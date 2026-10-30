"use client";

import { useState } from "react";
import { AlertCircle, Bookmark, Check, Copy, Loader2, Mail, RotateCw } from "lucide-react";
import { LinkedInIcon } from "@/components/shared/brandIcons";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getApiErrorMessage } from "@/errors/error-utils";
import {
  RegenerateProspectDraftsMutation,
  SaveProspectMutation,
  UpdateProspectStatusMutation,
} from "@/routes/bussiness/Bussiness-Mutation";
import { ProspectQuery } from "@/routes/bussiness/Bussiness-Query";
import {
  isEnriching,
  SETTABLE_PROSPECT_STATUSES,
  type Prospect,
  type ProspectBrief,
  type ProspectDraft,
  type ProspectDraftKind,
  type ProspectPerson,
  type SettableProspectStatus,
} from "@/types/bussiness/prospect-type";
import { FOCUS_RING } from "@/utils/ui-classes";
import {
  BADGE,
  EMAIL_STATUS_LABEL,
  EMAIL_STATUS_STYLE,
  PROSPECT_STATUS_LABEL,
  PROSPECT_STATUS_STYLE,
  SECONDARY_BUTTON,
} from "./prospect-ui";

type Props = {
  prospectId: string | null;
  onClose: () => void;
};

export default function ProspectDetailDialog({ prospectId, onClose }: Props) {
  return (
    <Dialog open={Boolean(prospectId)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-5 sm:max-w-3xl sm:p-6">
        {prospectId ? <ProspectDetail prospectId={prospectId} /> : null}
      </DialogContent>
    </Dialog>
  );
}

function ProspectDetail({ prospectId }: { prospectId: string }) {
  const prospectQuery = ProspectQuery(prospectId);
  const prospect = prospectQuery.data;

  if (prospectQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-16" aria-busy="true">
        <Loader2 className="size-6 animate-spin text-[#5B57E6]" aria-label="Loading prospect" />
      </div>
    );
  }

  if (prospectQuery.isError || !prospect) {
    return (
      <>
        <DialogTitle className="sr-only">Prospect</DialogTitle>
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-[13px] text-rose-700">
          {getApiErrorMessage(prospectQuery.error, "Could not load this prospect")}
        </p>
      </>
    );
  }

  return (
    <div className="space-y-6">
      <DetailHeader prospect={prospect} />
      <EnrichBanner prospect={prospect} />
      <PeopleList people={prospect.people} />
      {prospect.brief ? <BriefCard brief={prospect.brief} /> : null}
      {prospect.drafts?.length ? <DraftsPanel prospect={prospect} /> : null}
    </div>
  );
}

function DetailHeader({ prospect }: { prospect: Prospect }) {
  const saveProspect = SaveProspectMutation();
  const updateStatus = UpdateProspectStatusMutation();
  const location = [prospect.city, prospect.country].filter(Boolean).join(", ");

  return (
    <DialogHeader className="gap-3 pe-8">
      <div className="flex flex-wrap items-center gap-2">
        <DialogTitle className="text-xl font-semibold text-neutral-900">{prospect.name}</DialogTitle>
        <span className={`${BADGE} ${PROSPECT_STATUS_STYLE[prospect.status]}`}>
          {PROSPECT_STATUS_LABEL[prospect.status]}
        </span>
      </div>
      <DialogDescription className="flex flex-wrap gap-x-3 text-[13px]">
        {prospect.domain ? (
          <a
            href={prospect.website || `https://${prospect.domain}`}
            target="_blank"
            rel="noreferrer"
            className="text-[#5B57E6] hover:underline"
          >
            {prospect.domain}
          </a>
        ) : null}
        {location ? <span>{location}</span> : null}
        {prospect.industry ? <span>{prospect.industry}</span> : null}
      </DialogDescription>

      <div className="flex flex-wrap items-center gap-2">
        {prospect.status === "new" ? (
          <button
            type="button"
            onClick={() => saveProspect.mutate(prospect.id)}
            disabled={saveProspect.isPending}
            className={`inline-flex items-center gap-2 rounded-full bg-[#5B57E6] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#4A46D0] disabled:opacity-55 ${FOCUS_RING}`}
          >
            {saveProspect.isPending ? <Loader2 className="size-4 animate-spin" /> : <Bookmark className="size-4" />}
            Save and write outreach
          </button>
        ) : null}
        <label className="flex items-center gap-2 text-[12px] text-neutral-500">
          Status
          <select
            value={SETTABLE_PROSPECT_STATUSES.includes(prospect.status as SettableProspectStatus) ? prospect.status : ""}
            onChange={(e) =>
              updateStatus.mutate({ prospect_id: prospect.id, status: e.target.value as SettableProspectStatus })
            }
            disabled={updateStatus.isPending}
            className="h-9 rounded-full border border-[#E6E8F5] bg-white px-3 text-[13px] text-neutral-800 outline-none focus:border-[#5B57E6] focus:ring-2 focus:ring-[#5B57E6]/20"
          >
            {/* "Saved" isn't settable here, so show it as a disabled placeholder */}
            <option value="" disabled>
              {PROSPECT_STATUS_LABEL[prospect.status]}
            </option>
            {SETTABLE_PROSPECT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {PROSPECT_STATUS_LABEL[status]}
              </option>
            ))}
          </select>
        </label>
        {updateStatus.isPending ? <Loader2 className="size-4 animate-spin text-[#5B57E6]" aria-hidden="true" /> : null}
      </div>
    </DialogHeader>
  );
}

function EnrichBanner({ prospect }: { prospect: Prospect }) {
  if (isEnriching(prospect.enrich_status)) {
    return (
      <p className="flex items-center gap-2 rounded-xl bg-[#EEF0FF] px-4 py-3 text-[13px] text-[#3F3D9E]" aria-live="polite">
        <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden="true" />
        Verifying emails and writing the brief and drafts. This updates by itself.
      </p>
    );
  }
  if (prospect.enrich_status === "failed") {
    return (
      <p className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-[13px] text-rose-700">
        <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
        We couldn&apos;t finish the brief and drafts for this prospect.
      </p>
    );
  }
  return null;
}

function SectionTitle({ children }: { children: string }) {
  return <h3 className="text-[12px] font-semibold uppercase tracking-wide text-neutral-400">{children}</h3>;
}

function PeopleList({ people }: { people: ProspectPerson[] }) {
  if (!people.length) return null;
  return (
    <section>
      <SectionTitle>People</SectionTitle>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
        {people.map((person) => (
          <li key={person.id} className="rounded-xl border border-[#EEF0FA] p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[14px] font-semibold text-neutral-900">{person.name}</p>
                {person.title ? <p className="truncate text-[12px] text-neutral-500">{person.title}</p> : null}
              </div>
              {person.linkedin_url ? (
                <a
                  href={person.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${person.name} on LinkedIn`}
                  className={`shrink-0 rounded ${FOCUS_RING}`}
                >
                  <LinkedInIcon className="size-4" />
                </a>
              ) : null}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px]">
              {person.email ? (
                <span className="inline-flex min-w-0 items-center gap-1 text-neutral-700">
                  <Mail className="size-3.5 shrink-0 text-neutral-400" aria-hidden="true" />
                  <span className="truncate">{person.email}</span>
                </span>
              ) : null}
              <span className={`${BADGE} ${EMAIL_STATUS_STYLE[person.email_status]}`}>
                {EMAIL_STATUS_LABEL[person.email_status]}
              </span>
              {typeof person.prospect_score === "number" ? (
                <span className="text-neutral-500">Score {Math.round(person.prospect_score)}</span>
              ) : null}
            </div>
            {person.role_fit ? <p className="mt-1.5 text-[12px] text-neutral-500">Role fit: {person.role_fit}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

function BriefCard({ brief }: { brief: ProspectBrief }) {
  const rows = [
    { label: "Who they are", value: brief.who_they_are },
    { label: "Likely challenge", value: brief.likely_challenge },
    { label: "Why they fit", value: brief.why_they_fit },
    { label: "Opening angle", value: brief.opening_angle },
  ].filter((row) => row.value);

  return (
    <section>
      <SectionTitle>Brief</SectionTitle>
      <div className="mt-2 space-y-3 rounded-2xl bg-[#FAFAFF] p-4 ring-1 ring-[#EEF0FA]">
        {rows.map(({ label, value }) => (
          <div key={label}>
            <p className="text-[12px] font-semibold text-neutral-900">{label}</p>
            <p className="mt-0.5 text-[13px] leading-5 text-neutral-600">{value}</p>
          </div>
        ))}
        {brief.happening_now.length ? (
          <div>
            <p className="text-[12px] font-semibold text-neutral-900">Happening now</p>
            <ul className="mt-1 list-disc space-y-0.5 ps-5 text-[13px] leading-5 text-neutral-600">
              {brief.happening_now.map((item, index) => (
                <li key={`${item.fact}-${index}`}>
                  {item.fact}
                  {item.date || item.source_url ? (
                    <span className="text-neutral-400">
                      {" "}
                      ({item.date}
                      {item.date && item.source_url ? " · " : null}
                      {item.source_url ? (
                        <a
                          href={item.source_url}
                          target="_blank"
                          rel="noreferrer"
                          className={`rounded text-[#5B57E6] hover:underline ${FOCUS_RING}`}
                        >
                          source
                        </a>
                      ) : null}
                      )
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

const DRAFT_FIELDS: { kind: ProspectDraftKind; label: string }[] = [
  { kind: "linkedin_connect", label: "LinkedIn connection note" },
  { kind: "linkedin_message", label: "LinkedIn message" },
  { kind: "email_first", label: "First email" },
  { kind: "email_follow_up", label: "Follow-up email" },
];

const draftText = (draft?: ProspectDraft) =>
  draft ? [draft.subject ? `Subject: ${draft.subject}` : "", draft.body].filter(Boolean).join("\n\n") : "";

/** The API sends a flat list of drafts; group them per person, keeping the order people first appear. */
function groupDraftsByPerson(drafts: ProspectDraft[]) {
  const groups = new Map<string, { personId: string | null; drafts: ProspectDraft[] }>();
  for (const draft of drafts) {
    const key = draft.person_id ?? "";
    const group = groups.get(key) ?? { personId: draft.person_id ?? null, drafts: [] };
    group.drafts.push(draft);
    groups.set(key, group);
  }
  return [...groups.values()];
}

/** Drafts per person, with a tab for each when there are several. */
function DraftsPanel({ prospect }: { prospect: Prospect }) {
  const groups = groupDraftsByPerson(prospect.drafts ?? []);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = groups[activeIndex] ?? groups[0];
  const regenerate = RegenerateProspectDraftsMutation();
  const personName = (personId?: string | null) =>
    prospect.people.find((person) => person.id === personId)?.name ?? "Drafts";

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionTitle>Outreach drafts</SectionTitle>
        <button
          type="button"
          onClick={() => regenerate.mutate({ prospect_id: prospect.id, person_id: active?.personId ?? undefined })}
          disabled={regenerate.isPending}
          className={`${SECONDARY_BUTTON} py-1.5 ${FOCUS_RING}`}
        >
          {regenerate.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <RotateCw className="size-3.5" />}
          Rewrite
        </button>
      </div>

      {groups.length > 1 ? (
        <div className="mt-2 flex flex-wrap gap-1.5" role="tablist" aria-label="Drafts for">
          {groups.map((item, index) => (
            <button
              key={item.personId ?? index}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              className={`rounded-full px-3 py-1 text-[12px] font-medium ${FOCUS_RING} ${
                index === activeIndex ? "bg-[#5B57E6] text-white" : "bg-[#F1F2FB] text-neutral-600 hover:bg-[#E6E8F5]"
              }`}
            >
              {personName(item.personId)}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-3 space-y-3">
        {DRAFT_FIELDS.map(({ kind, label }) => {
          const text = draftText(active?.drafts.find((d) => d.kind === kind));
          return text ? <DraftBlock key={kind} label={label} text={text} /> : null;
        })}
      </div>
    </section>
  );
}

function DraftBlock({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-xl border border-[#EEF0FA]">
      <div className="flex items-center justify-between border-b border-[#F1F2FB] px-3 py-2">
        <p className="text-[12px] font-semibold text-neutral-700">{label}</p>
        <button
          type="button"
          onClick={() => void copy()}
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[12px] text-neutral-500 hover:bg-[#F1F2FB] hover:text-[#5B57E6] ${FOCUS_RING}`}
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="whitespace-pre-wrap px-3 py-2.5 text-[13px] leading-5 text-neutral-700">{text}</p>
    </div>
  );
}
