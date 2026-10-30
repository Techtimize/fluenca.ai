"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, CircleAlert, CircleX, ExternalLink, Loader2, RotateCw } from "lucide-react";
import { ScoreGauge } from "@/components/dashboard/overallPerformanceCard";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getApiErrorMessage } from "@/errors/error-utils";
import { SiteVisibilityQuery } from "@/routes/bussiness/Bussiness-Query";
import type { SiteVisibilityResponse } from "@/types/bussiness/site-visibility-type";
import { FOCUS_RING } from "@/utils/ui-classes";
import SiteVisibilityDialog, { type SiteVisibilityTab } from "./SiteVisibilityDialog";

type CheckState = "pass" | "partial" | "fail";

/** `url` is set when the file exists, so it can be opened. */
type Check = { label: string; detail: string; state: CheckState; url?: string | null };

const hostLabel = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

/** Turns the report into a short pass/fail checklist; the meter shows how many pass. */
function visibilityChecks(report: SiteVisibilityResponse): Check[] {
  const blockedEngines = report.search_engines.filter((engine) => engine.blocked);
  const assistants = report.ai_assistants;
  const allowedAssistants = assistants.filter((a) => a.access === "allowed");
  const schema = report.schema_markup;

  return [
    {
      label: "robots.txt",
      url: report.robots_txt?.found ? report.robots_txt.url : null,
      state: !report.robots_txt?.found ? "fail" : report.robots_txt.lists_sitemap ? "pass" : "partial",
      detail: !report.robots_txt?.found
        ? "Missing"
        : report.robots_txt.lists_sitemap
          ? "Found, lists the sitemap"
          : "Found, doesn't list the sitemap",
    },
    {
      label: "Sitemap",
      url: report.sitemap?.found ? report.sitemap.url : null,
      state: report.sitemap?.found ? "pass" : "fail",
      detail: report.sitemap?.found ? `${report.sitemap.urls_listed.toLocaleString()} pages listed` : "Missing",
    },
    {
      label: "llms.txt",
      url: report.llms_txt?.found ? report.llms_txt.url : null,
      state: report.llms_txt?.found ? "pass" : "fail",
      detail: report.llms_txt?.found ? "Found" : "Missing",
    },
    {
      label: "Search engines",
      state: blockedEngines.length ? "fail" : "pass",
      detail: blockedEngines.length
        ? `Blocked: ${blockedEngines.map((engine) => engine.engine).join(", ")}`
        : "All allowed",
    },
    {
      label: "AI assistants",
      state: allowedAssistants.length === assistants.length ? "pass" : allowedAssistants.length ? "partial" : "fail",
      detail: `${allowedAssistants.length}/${assistants.length} can read the site`,
    },
    {
      label: "Schema markup",
      state: !schema?.checked || !schema.describes_business ? "fail" : schema.has_faq ? "pass" : "partial",
      detail: !schema?.checked
        ? "Not checked"
        : !schema.types.length
          ? "None on the home page"
          : `${schema.describes_business ? "Describes the business" : "Doesn't describe the business"}${schema.has_faq ? ", has FAQ" : ""}`,
    },
  ];
}

/** What each check means, shown when hovering its icon. */
const CHECK_INFO: Record<string, string> = {
  "robots.txt":
    "A file at your site's root that tells search engines and AI crawlers which pages they may read. It should also point to your sitemap.",
  Sitemap: "A list of all your pages, so Google and other search engines can find and index every one of them.",
  "llms.txt":
    "A short summary of your business with links to your key pages, written for AI assistants like ChatGPT and Claude to read.",
  "Search engines": "Whether your robots.txt lets Google, Bing and other search engines read your site.",
  "AI assistants":
    "Whether ChatGPT, Claude, Perplexity and Gemini may read your site, so they can recommend you in their answers.",
  "Schema markup":
    "Structured data on your home page that tells Google and AI assistants what your business is, and can add FAQs to search results.",
};

const STATE_ICON = {
  pass: <CheckCircle2 className="size-4 shrink-0 text-[#16A34A]" aria-label="Passed" />,
  partial: <CircleAlert className="size-4 shrink-0 text-[#D97706]" aria-label="Partly passed" />,
  fail: <CircleX className="size-4 shrink-0 text-[#E11D48]" aria-label="Failed" />,
};

const ACTION_BUTTON = `inline-flex h-9 items-center justify-center gap-1.5 rounded-full px-3 text-[12px] font-medium transition-colors ${FOCUS_RING}`;

/** Replaces Overall Performance: can search engines and AI assistants find and read the website? */
export default function SiteVisibilityCard() {
  const visibility = SiteVisibilityQuery();
  const report = visibility.data;
  const [tab, setTab] = useState<SiteVisibilityTab | null>(null);

  const checks = report?.checked ? visibilityChecks(report) : [];
  // A partly passed check counts as half.
  const points = checks.reduce((sum, c) => sum + (c.state === "pass" ? 1 : c.state === "partial" ? 0.5 : 0), 0);
  const score = checks.length ? Math.round((points / checks.length) * 100) : 0;
  const fixes = report?.recommended_actions.length ?? 0;
  // Only offer to write the files the site doesn't have yet.
  const canWriteLlms = !report?.llms_txt?.found;
  const canWriteSchema = !report?.schema_markup?.types.length;
  const writeTabs: SiteVisibilityTab[] = [
    ...(canWriteLlms ? (["llms"] as const) : []),
    ...(canWriteSchema ? (["schema"] as const) : []),
  ];

  return (
    <section className="flex min-w-0 flex-col rounded-2xl border border-[#E6E8F5] bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-[13px] font-semibold text-neutral-900">Site visibility</h3>
          <p className="mt-1 text-xs text-neutral-500">
            {report?.website
              ? `Can Google and AI assistants find and read ${hostLabel(report.website)}?`
              : "Can Google and AI assistants find and read your website?"}
          </p>
        </div>
        {report ? (
          <button
            type="button"
            onClick={() => void visibility.refetch()}
            disabled={visibility.isFetching}
            aria-label="Check the website again"
            className={`shrink-0 rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 disabled:opacity-60 ${FOCUS_RING}`}
          >
            <RotateCw className={`size-4 ${visibility.isFetching ? "animate-spin" : ""}`} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {visibility.isLoading ? (
        <div className="grid flex-1 place-items-center py-10" aria-busy="true">
          <Loader2 className="size-6 animate-spin text-[#5452F6]" aria-label="Checking the website" />
        </div>
      ) : visibility.isError ? (
        <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2.5 text-xs text-rose-700">
          {getApiErrorMessage(visibility.error, "Could not check the website.")}
        </p>
      ) : report && !report.checked ? (
        <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
          We couldn&rsquo;t read {hostLabel(report.website)}. Check that the website is online and try again.
        </p>
      ) : (
        <>
          <div className="mt-3">
            <ScoreGauge score={score} label="Visibility" className="mx-auto w-full max-w-56" />
          </div>
          <ul className="mt-2 space-y-1.5">
            {checks.map((check) => (
              <li key={check.label} className="flex items-start gap-2 text-xs">
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <button
                        type="button"
                        aria-label={`What is ${check.label}?`}
                        className={`shrink-0 cursor-help rounded-full ${FOCUS_RING}`}
                      />
                    }
                  >
                    {STATE_ICON[check.state]}
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-64 text-xs leading-5">
                    {CHECK_INFO[check.label]}
                  </TooltipContent>
                </Tooltip>
                <span className="font-medium text-neutral-800">{check.label}</span>
                <span className="ml-auto min-w-0 truncate text-right text-neutral-500" title={check.detail}>
                  {check.detail}
                </span>
                {check.url ? (
                  <a
                    href={check.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`View ${check.label}`}
                    className={`inline-flex shrink-0 items-center gap-0.5 rounded font-medium text-[#5452F6] hover:underline ${FOCUS_RING}`}
                  >
                    View
                    <ExternalLink className="size-3" aria-hidden="true" />
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </>
      )}

      <div className={`mt-auto grid gap-2 pt-4 ${writeTabs.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
        <button
          type="button"
          onClick={() => setTab("report")}
          disabled={!report}
          className={`${ACTION_BUTTON} ${writeTabs.length === 2 ? "col-span-2" : ""} bg-[#5452F6] text-white hover:bg-[#4544C9] disabled:opacity-60`}
        >
          {fixes ? `View report · ${fixes} fix${fixes === 1 ? "" : "es"}` : "View report"}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </button>
        {canWriteLlms ? (
          <button
            type="button"
            onClick={() => setTab("llms")}
            className={`${ACTION_BUTTON} bg-[#EEF0FF] text-[#4544C9] hover:bg-[#E3E6FF]`}
          >
            Write llms.txt
          </button>
        ) : null}
        {canWriteSchema ? (
          <button
            type="button"
            onClick={() => setTab("schema")}
            className={`${ACTION_BUTTON} bg-[#EEF0FF] text-[#4544C9] hover:bg-[#E3E6FF]`}
          >
            Schema markup
          </button>
        ) : null}
      </div>

      <SiteVisibilityDialog
        report={report ?? null}
        tab={tab}
        writeTabs={writeTabs}
        onTabChange={setTab}
        onClose={() => setTab(null)}
      />
    </section>
  );
}
