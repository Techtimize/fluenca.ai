"use client";

import { useState } from "react";
import {
  Check,
  CheckCircle2,
  CircleAlert,
  CircleX,
  Copy,
  Download,
  ExternalLink,
  Loader2,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DownloadLlmsTxtMutation,
  WriteLlmsTxtMutation,
  WriteSchemaMarkupMutation,
} from "@/routes/bussiness/Bussiness-Mutation";
import type {
  AiAccess,
  SchemaBlockKind,
  SiteVisibilityResponse,
} from "@/types/bussiness/site-visibility-type";
import { FOCUS_RING } from "@/utils/ui-classes";

export type SiteVisibilityTab = "report" | "llms" | "schema";

const TABS: { id: SiteVisibilityTab; label: string }[] = [
  { id: "report", label: "Report" },
  { id: "llms", label: "llms.txt" },
  { id: "schema", label: "Schema markup" },
];

type Props = {
  report: SiteVisibilityResponse | null;
  /** The dialog is open while a tab is set. */
  tab: SiteVisibilityTab | null;
  /** The file-writing tabs to offer; a file the site already has isn't offered. */
  writeTabs: SiteVisibilityTab[];
  onTabChange: (tab: SiteVisibilityTab) => void;
  onClose: () => void;
};

const PRIMARY = `inline-flex items-center justify-center gap-2 rounded-full bg-[#5452F6] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#4544C9] disabled:opacity-60 ${FOCUS_RING}`;
const SECONDARY = `inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-medium text-neutral-700 ring-1 ring-[#E6E8F5] hover:bg-neutral-50 disabled:opacity-60 ${FOCUS_RING}`;

export default function SiteVisibilityDialog({
  report,
  tab,
  writeTabs,
  onTabChange,
  onClose,
}: Props) {
  const tabs = TABS.filter(
    ({ id }) => id === "report" || writeTabs.includes(id),
  );

  return (
    <Dialog open={tab !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-5 sm:max-w-2xl sm:p-6">
        <DialogHeader className="text-left">
          <DialogTitle className="text-lg font-semibold text-neutral-900">
            Site visibility
          </DialogTitle>
          <DialogDescription className="text-[13px] text-neutral-500">
            How search engines and AI assistants see your website, what to fix,
            and files that help them understand it.
          </DialogDescription>
        </DialogHeader>

        {tabs.length > 1 ? (
          <div
            className="flex flex-wrap gap-1.5"
            role="tablist"
            aria-label="Site visibility"
          >
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => onTabChange(id)}
                className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${FOCUS_RING} ${
                  tab === id
                    ? "bg-[#5452F6] text-white"
                    : "bg-[#F1F2FB] text-neutral-600 hover:bg-[#E6E8F5]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        ) : null}

        {/* Kept mounted so generated files survive switching tabs. */}
        <div role="tabpanel" hidden={tab !== "report"}>
          <ReportPanel report={report} />
        </div>
        {writeTabs.includes("llms") ? (
          <div role="tabpanel" hidden={tab !== "llms"}>
            <LlmsTxtPanel />
          </div>
        ) : null}
        {writeTabs.includes("schema") ? (
          <div role="tabpanel" hidden={tab !== "schema"}>
            <SchemaPanel />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

const LEVEL_STYLE: Record<string, string> = {
  high: "bg-rose-50 text-rose-700",
  medium: "bg-amber-50 text-amber-700",
  low: "bg-emerald-50 text-emerald-700",
};

function Level({ label, value }: { label: string; value: string }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${LEVEL_STYLE[value.toLowerCase()] ?? "bg-neutral-100 text-neutral-600"}`}
    >
      {label}: {value}
    </span>
  );
}

const ACCESS_STYLE: Record<AiAccess, { label: string; className: string }> = {
  allowed: { label: "Allowed", className: "bg-emerald-50 text-emerald-700" },
  partly_blocked: {
    label: "Partly blocked",
    className: "bg-amber-50 text-amber-700",
  },
  blocked: { label: "Blocked", className: "bg-rose-50 text-rose-700" },
};

function StatusIcon({
  ok,
  partial = false,
}: {
  ok: boolean;
  partial?: boolean;
}) {
  if (ok)
    return (
      <CheckCircle2
        className="size-4 shrink-0 text-[#16A34A]"
        aria-label="OK"
      />
    );
  if (partial)
    return (
      <CircleAlert
        className="size-4 shrink-0 text-[#D97706]"
        aria-label="Needs attention"
      />
    );
  return (
    <CircleX className="size-4 shrink-0 text-[#E11D48]" aria-label="Problem" />
  );
}

function ReportSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-[12px] font-semibold uppercase tracking-wide text-neutral-400">
        {title}
      </h3>
      <div className="mt-2 divide-y divide-[#F1F2FB] rounded-xl border border-[#EEF0FA]">
        {children}
      </div>
    </section>
  );
}

function ReportRow({
  icon,
  label,
  detail,
  url,
}: {
  icon: React.ReactNode;
  label: string;
  detail: React.ReactNode;
  url?: string | null;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 px-3 py-2.5 text-[13px]">
      {icon}
      <span className="font-medium text-neutral-900">{label}</span>
      <span className="text-neutral-500">{detail}</span>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className={`ml-auto inline-flex items-center gap-1 rounded text-[12px] font-medium text-[#5452F6] hover:underline ${FOCUS_RING}`}
        >
          View
          <ExternalLink className="size-3" aria-hidden="true" />
        </a>
      ) : null}
    </div>
  );
}

/** The full check: files, who may read the site, schema markup, then the recommended fixes. */
function ReportPanel({ report }: { report: SiteVisibilityResponse | null }) {
  if (!report) return null;
  if (!report.checked) {
    return (
      <p className="rounded-xl bg-amber-50 px-3 py-2.5 text-[13px] text-amber-800">
        We couldn&rsquo;t read {report.website}. Check that the website is
        online and try again.
      </p>
    );
  }

  const {
    robots_txt: robots,
    sitemap,
    llms_txt: llms,
    schema_markup: schema,
  } = report;
  const actions = report.recommended_actions;

  return (
    <div className="space-y-5">
      <p className="text-[12px] text-neutral-500">
        Checked{" "}
        <a
          href={report.website}
          target="_blank"
          rel="noreferrer"
          className={`rounded font-medium text-[#5452F6] hover:underline ${FOCUS_RING}`}
        >
          {report.website}
        </a>
      </p>

      <ReportSection title="Files">
        <ReportRow
          icon={
            <StatusIcon
              ok={Boolean(robots?.found && robots.lists_sitemap)}
              partial={Boolean(robots?.found)}
            />
          }
          label="robots.txt"
          detail={
            !robots?.found
              ? "Missing"
              : robots.lists_sitemap
                ? "Found, lists the sitemap"
                : "Found, doesn't list the sitemap"
          }
          url={robots?.found ? robots.url : null}
        />
        <ReportRow
          icon={<StatusIcon ok={Boolean(sitemap?.found)} />}
          label="Sitemap"
          detail={
            sitemap?.found
              ? `Found, ${sitemap.urls_listed.toLocaleString()} pages listed`
              : "Missing"
          }
          url={sitemap?.found ? sitemap.url : null}
        />
        <ReportRow
          icon={<StatusIcon ok={Boolean(llms?.found)} />}
          label="llms.txt"
          detail={llms?.found ? "Found" : "Missing"}
          url={llms?.found ? llms.url : null}
        />
      </ReportSection>

      {report.search_engines.length ? (
        <ReportSection title="Search engines">
          {report.search_engines.map((engine) => (
            <ReportRow
              key={engine.engine}
              icon={<StatusIcon ok={!engine.blocked} />}
              label={engine.engine}
              detail={
                engine.blocked ? "Blocked by robots.txt" : "Can read the site"
              }
            />
          ))}
        </ReportSection>
      ) : null}

      {report.ai_assistants.length ? (
        <ReportSection title="AI assistants">
          {report.ai_assistants.map((assistant) => {
            const style = ACCESS_STYLE[assistant.access];
            return (
              <ReportRow
                key={assistant.assistant}
                icon={
                  <StatusIcon
                    ok={assistant.access === "allowed"}
                    partial={assistant.access === "partly_blocked"}
                  />
                }
                label={assistant.assistant}
                detail={
                  <>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${style.className}`}
                    >
                      {style.label}
                    </span>
                    {assistant.blocked_crawlers.length ? (
                      <span className="ms-2 text-[12px]">
                        Blocked: {assistant.blocked_crawlers.join(", ")}
                      </span>
                    ) : null}
                  </>
                }
              />
            );
          })}
        </ReportSection>
      ) : null}

      <ReportSection title="Schema markup">
        {!schema?.checked ? (
          <ReportRow
            icon={<StatusIcon ok={false} />}
            label="Home page"
            detail="Not checked"
          />
        ) : (
          <>
            <ReportRow
              icon={<StatusIcon ok={schema.types.length > 0} />}
              label="Types found"
              detail={schema.types.length ? schema.types.join(", ") : "None"}
            />
            <ReportRow
              icon={<StatusIcon ok={schema.describes_business} />}
              label="Describes the business"
              detail={schema.describes_business ? "Yes" : "No"}
            />
            <ReportRow
              icon={<StatusIcon ok={schema.has_faq} />}
              label="FAQ"
              detail={schema.has_faq ? "Yes" : "No"}
            />
          </>
        )}
      </ReportSection>

      <section>
        <h3 className="text-[12px] font-semibold uppercase tracking-wide text-neutral-400">
          Recommended fixes{actions.length ? ` (${actions.length})` : ""}
        </h3>
        {actions.length ? (
          <ol className="mt-2 space-y-3">
            {actions.map((action, index) => (
              <li
                key={`${action.title}-${index}`}
                className="rounded-xl border border-[#EEF0FA] p-3.5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-[14px] font-semibold text-neutral-900">
                    {index + 1}. {action.title}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <Level label="Impact" value={action.impact} />
                    <Level label="Effort" value={action.effort} />
                  </div>
                </div>
                <p className="mt-2 text-[13px] leading-5 text-neutral-700">
                  {action.action}
                </p>
                <p className="mt-1 text-[12px] leading-5 text-neutral-500">
                  {action.rationale}
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-[13px] text-emerald-800">
            Nothing to fix. Search engines and AI assistants can find and read
            your website.
          </p>
        )}
      </section>
    </div>
  );
}

function CopyButton({
  text,
  label = "Copy",
}: {
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button type="button" onClick={() => void copy()} className={SECONDARY}>
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {copied ? "Copied" : label}
    </button>
  );
}

const saveText = (text: string, filename: string) => {
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/plain;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

function LlmsTxtPanel() {
  const write = WriteLlmsTxtMutation();
  const download = DownloadLlmsTxtMutation();
  const file = write.data;

  return (
    <div className="space-y-3">
      <p className="text-[13px] leading-5 text-neutral-600">
        An llms.txt is a short summary of your business with links to your key
        pages, for AI assistants like ChatGPT and Claude to read. It&rsquo;s
        written from your Company DNA and takes 10 to 40 seconds.
      </p>

      {file ? (
        <>
          {file.publish_at ? (
            <p className="text-[12px] text-neutral-500">
              Publish it at{" "}
              <span className="font-medium text-neutral-800">
                {file.publish_at}
              </span>
            </p>
          ) : null}
          <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-xl bg-[#F8F9FF] p-3 text-[12px] leading-5 text-neutral-800 ring-1 ring-[#EEF0FA]">
            {file.content}
          </pre>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => saveText(file.content, file.filename)}
              className={PRIMARY}
            >
              <Download className="size-4" />
              Download llms.txt
            </button>
            <CopyButton text={file.content} />
            <button
              type="button"
              onClick={() => write.mutate()}
              disabled={write.isPending}
              className={SECONDARY}
            >
              {write.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              Write again
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => write.mutate()}
            disabled={write.isPending || download.isPending}
            className={PRIMARY}
          >
            {write.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {write.isPending ? "Writing…" : "Write llms.txt"}
          </button>
          <button
            type="button"
            onClick={() => download.mutate()}
            disabled={write.isPending || download.isPending}
            className={SECONDARY}
          >
            {download.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            {download.isPending ? "Writing…" : "Write & download"}
          </button>
        </div>
      )}
    </div>
  );
}

const BLOCK_LABEL: Record<SchemaBlockKind, string> = {
  business: "Business",
  website: "Website",
  faq: "FAQ",
  article: "Article (blog posts)",
};

function SchemaPanel() {
  const write = WriteSchemaMarkupMutation();
  const markup = write.data;

  return (
    <div className="space-y-3">
      <p className="text-[13px] leading-5 text-neutral-600">
        Schema markup tells Google and AI assistants what your business is. We
        write ready-to-paste snippets from your Company DNA; it takes 10 to 40
        seconds.
      </p>

      {markup ? (
        <>
          {markup.how_to_use ? (
            <p className="text-[12px] leading-5 text-neutral-500">
              {markup.how_to_use}
            </p>
          ) : null}
          <ul className="space-y-3">
            {markup.blocks.map((block, index) => (
              <li
                key={`${block.kind}-${index}`}
                className="rounded-xl border border-[#EEF0FA]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F1F2FB] px-3 py-2">
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-neutral-900">
                      {BLOCK_LABEL[block.kind] ?? block.kind}
                    </p>
                    <p className="truncate text-[11px] text-neutral-500">
                      Paste on: {block.place_on}
                    </p>
                  </div>
                  <CopyButton text={block.snippet} label="Copy snippet" />
                </div>
                <pre className="max-h-56 overflow-auto px-3 py-2.5 text-[11px] leading-5 text-neutral-700">
                  {block.snippet}
                </pre>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => write.mutate()}
            disabled={write.isPending}
            className={SECONDARY}
          >
            {write.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            Write again
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => write.mutate()}
          disabled={write.isPending}
          className={PRIMARY}
        >
          {write.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {write.isPending ? "Writing…" : "Write schema markup"}
        </button>
      )}
    </div>
  );
}
