"use client";

import { useState } from "react";
import { Bookmark, Building2, ChevronRight, Loader2, MapPin, Users, X } from "lucide-react";
import { LinkedInIcon } from "@/components/shared/brandIcons";
import { getApiErrorMessage } from "@/errors/error-utils";
import { SaveProspectMutation, UpdateProspectStatusMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { ProspectsQuery } from "@/routes/bussiness/Bussiness-Query";
import { PROSPECT_STATUSES, type Prospect, type ProspectStatus } from "@/types/bussiness/prospect-type";
import { FOCUS_RING } from "@/utils/ui-classes";
import {
  BADGE,
  CARD,
  EMAIL_STATUS_LABEL,
  EMAIL_STATUS_STYLE,
  PROSPECT_STATUS_LABEL,
  PROSPECT_STATUS_STYLE,
  SECONDARY_BUTTON,
} from "./prospect-ui";
import SectionHeader from "./SectionHeader";

type Props = {
  runId: string | null;
  /** The shortlist only exists once the search is ready. */
  ready: boolean;
  onOpen: (prospectId: string) => void;
};

/** Step 3: the shortlist, best first. */
export default function ShortlistSection({ runId, ready, onOpen }: Props) {
  const [status, setStatus] = useState<ProspectStatus | null>(null);
  const prospects = ProspectsQuery({ run_id: runId, status }, ready);
  const items = prospects.data ?? [];

  return (
    <section className={`${CARD} p-5 sm:p-6`}>
      <SectionHeader
        step={3}
        title="Shortlist"
        description="Best matches first, each with up to 3 people. Save one to get verified emails, a brief and drafts."
      />

      <div className="mt-5 flex flex-wrap gap-1.5" role="tablist" aria-label="Filter by status">
        {[null, ...PROSPECT_STATUSES].map((value) => {
          const active = status === value;
          return (
            <button
              key={value ?? "all"}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setStatus(value)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${FOCUS_RING} ${
                active ? "bg-[#5B57E6] text-white" : "bg-[#F1F2FB] text-neutral-600 hover:bg-[#E6E8F5]"
              }`}
            >
              {value ? PROSPECT_STATUS_LABEL[value] : "All"}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        {!ready ? (
          <EmptyState text="Your shortlist shows up here when a search is ready." />
        ) : prospects.isLoading ? (
          <ul className="space-y-3" aria-busy="true">
            {Array.from({ length: 3 }, (_, i) => (
              <li key={i} className="h-36 animate-pulse rounded-2xl bg-[#F8F9FF]" />
            ))}
          </ul>
        ) : prospects.isError ? (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-[13px] text-rose-700">
            {getApiErrorMessage(prospects.error, "Could not load the shortlist")}
          </p>
        ) : items.length ? (
          <ul className={`space-y-3 ${prospects.isFetching ? "opacity-70" : ""}`}>
            {items.map((prospect) => (
              <li key={prospect.id}>
                <ProspectCard prospect={prospect} onOpen={() => onOpen(prospect.id)} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState text={status ? `No ${PROSPECT_STATUS_LABEL[status].toLowerCase()} prospects.` : "No prospects found for this search."} />
        )}
      </div>
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#E6E8F5] px-6 py-10 text-center">
      <Users className="size-6 text-[#A5A8F5]" aria-hidden="true" />
      <p className="mt-2 text-[13px] text-neutral-500">{text}</p>
    </div>
  );
}

function ProspectCard({ prospect, onOpen }: { prospect: Prospect; onOpen: () => void }) {
  const saveProspect = SaveProspectMutation();
  const updateStatus = UpdateProspectStatusMutation();
  const location = [prospect.city, prospect.country].filter(Boolean).join(", ");
  const meta = [prospect.industry, prospect.employee_range ? `${prospect.employee_range} people` : null].filter(Boolean);

  return (
    <article className="rounded-2xl border border-[#E6E8F5] p-4 transition-shadow hover:shadow-[0_12px_32px_rgba(91,87,230,0.08)]">
      <div className="flex flex-wrap items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#EEF0FF] text-[#5B57E6]">
          <Building2 className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-[15px] font-semibold text-neutral-900">{prospect.name}</h3>
            <span className={`${BADGE} ${PROSPECT_STATUS_STYLE[prospect.status]}`}>
              {PROSPECT_STATUS_LABEL[prospect.status]}
            </span>
          </div>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-neutral-500">
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
            {location ? (
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3" aria-hidden="true" />
                {location}
              </span>
            ) : null}
            {meta.length ? <span>{meta.join(" · ")}</span> : null}
          </p>
        </div>
        {typeof prospect.score === "number" ? <ScoreBadge score={prospect.score} /> : null}
      </div>

      {prospect.reason ? <p className="mt-3 text-[13px] leading-5 text-neutral-600">{prospect.reason}</p> : null}

      {prospect.people.length ? (
        <ul className="mt-3 divide-y divide-[#F1F2FB] rounded-xl bg-[#FAFAFF] px-3">
          {prospect.people.slice(0, 3).map((person) => (
            <li key={person.id} className="flex flex-wrap items-center gap-2 py-2 text-[13px]">
              <span className="font-medium text-neutral-900">{person.name}</span>
              {person.title ? <span className="text-neutral-500">· {person.title}</span> : null}
              <span className={`${BADGE} ms-auto ${EMAIL_STATUS_STYLE[person.email_status]}`}>
                {EMAIL_STATUS_LABEL[person.email_status]}
              </span>
              {person.linkedin_url ? (
                <a
                  href={person.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${person.name} on LinkedIn`}
                  className={`text-neutral-400 hover:text-[#0A66C2] ${FOCUS_RING} rounded`}
                >
                  <LinkedInIcon className="size-4" />
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-3 flex flex-wrap justify-end gap-2">
        {prospect.status !== "dismissed" ? (
          <button
            type="button"
            onClick={() => updateStatus.mutate({ prospect_id: prospect.id, status: "dismissed" })}
            disabled={updateStatus.isPending}
            className={`${SECONDARY_BUTTON} ${FOCUS_RING}`}
          >
            {updateStatus.isPending ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
            Dismiss
          </button>
        ) : null}
        {prospect.status === "new" ? (
          <button
            type="button"
            onClick={() => saveProspect.mutate(prospect.id)}
            disabled={saveProspect.isPending}
            className={`${SECONDARY_BUTTON} ${FOCUS_RING}`}
          >
            {saveProspect.isPending ? <Loader2 className="size-4 animate-spin" /> : <Bookmark className="size-4" />}
            Save
          </button>
        ) : null}
        <button
          type="button"
          onClick={onOpen}
          className={`inline-flex items-center gap-1 rounded-full bg-[#5B57E6] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#4A46D0] ${FOCUS_RING}`}
        >
          View details
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

/** 0–100 match score, coloured by strength. */
function ScoreBadge({ score }: { score: number }) {
  const value = Math.round(score <= 1 ? score * 100 : score);
  const tone = value >= 75 ? "text-emerald-700 bg-emerald-50" : value >= 50 ? "text-amber-700 bg-amber-50" : "text-neutral-600 bg-neutral-100";
  return (
    <span className={`rounded-xl px-2.5 py-1 text-center ${tone}`}>
      <span className="block text-[15px] font-bold leading-none">{value}</span>
      <span className="text-[10px] font-medium uppercase tracking-wide">match</span>
    </span>
  );
}
