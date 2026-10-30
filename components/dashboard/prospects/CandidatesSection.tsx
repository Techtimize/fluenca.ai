"use client";

import { useState } from "react";
import { Building2, ExternalLink, MapPin, SearchX } from "lucide-react";
import { getApiErrorMessage } from "@/errors/error-utils";
import { ProspectRunCandidatesQuery } from "@/routes/bussiness/Bussiness-Query";
import {
  CANDIDATE_OUTCOMES,
  type CandidateOutcome,
  type ProspectCandidate,
} from "@/types/bussiness/prospect-type";
import { FOCUS_RING } from "@/utils/ui-classes";
import { BADGE, CANDIDATE_OUTCOME_LABEL, CANDIDATE_OUTCOME_STYLE, CARD, humanize } from "./prospect-ui";
import SectionHeader from "./SectionHeader";

type Props = {
  runId: string | null;
};

/** Step 4: every company the search found, not only the shortlist, and why each made it or not. */
export default function CandidatesSection({ runId }: Props) {
  const [outcome, setOutcome] = useState<CandidateOutcome | null>(null);
  const candidates = ProspectRunCandidatesQuery(runId, { outcome });
  const counts = candidates.data?.counts ?? {};
  const total = Object.values(counts).reduce((sum, n) => sum + (n ?? 0), 0);
  const items = candidates.data?.items ?? [];
  // Only offer the outcomes this search actually has.
  const outcomes = CANDIDATE_OUTCOMES.filter((value) => counts[value]);

  return (
    <section className={`${CARD} p-5 sm:p-6`}>
      <SectionHeader
        step={4}
        title="All companies found"
        description="Everything the search found, shortlisted first, then the closest misses and why they missed."
      />

      {outcomes.length ? (
        <div className="mt-5 flex flex-wrap gap-1.5" role="tablist" aria-label="Filter by outcome">
          {[null, ...outcomes].map((value) => {
            const active = outcome === value;
            return (
              <button
                key={value ?? "all"}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setOutcome(value)}
                className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${FOCUS_RING} ${
                  active ? "bg-[#5B57E6] text-white" : "bg-[#F1F2FB] text-neutral-600 hover:bg-[#E6E8F5]"
                }`}
              >
                {value ? CANDIDATE_OUTCOME_LABEL[value] : "All"}{" "}
                <span className={active ? "text-white/75" : "text-neutral-400"}>
                  {value ? counts[value] : total}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="mt-4">
        {!runId ? (
          <EmptyState text="Run a search to see every company it finds." />
        ) : candidates.isLoading ? (
          <ul className="space-y-2.5" aria-busy="true">
            {Array.from({ length: 3 }, (_, i) => (
              <li key={i} className="h-20 animate-pulse rounded-2xl bg-[#F8F9FF]" />
            ))}
          </ul>
        ) : candidates.isError ? (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-[13px] text-rose-700">
            {getApiErrorMessage(candidates.error, "Could not load the companies found")}
          </p>
        ) : items.length ? (
          <ul className={`space-y-2.5 ${candidates.isFetching ? "opacity-70" : ""}`}>
            {items.map((candidate, index) => (
              <li key={`${candidate.domain ?? candidate.name}-${index}`}>
                <CandidateCard candidate={candidate} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            text={
              outcome
                ? `No ${CANDIDATE_OUTCOME_LABEL[outcome].toLowerCase()} companies.`
                : "No companies yet. Searches from before this list was added have none."
            }
          />
        )}
      </div>
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#E6E8F5] px-6 py-10 text-center">
      <SearchX className="size-6 text-[#A5A8F5]" aria-hidden="true" />
      <p className="mt-2 text-[13px] text-neutral-500">{text}</p>
    </div>
  );
}

function CandidateCard({ candidate }: { candidate: ProspectCandidate }) {
  const location = [candidate.city, candidate.country].filter(Boolean).join(", ");
  const website = candidate.domain ? `https://${candidate.domain}` : null;
  // Shortlisted ones explain the fit; the rest explain why they missed.
  const note = candidate.reason ?? candidate.why_fit;

  return (
    <article className="rounded-2xl border border-[#E6E8F5] p-3.5">
      <div className="flex flex-wrap items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#EEF0FF] text-[#5B57E6]">
          <Building2 className="size-4.5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-[14px] font-semibold text-neutral-900">{candidate.name}</h3>
            <span className={`${BADGE} ${CANDIDATE_OUTCOME_STYLE[candidate.outcome] ?? CANDIDATE_OUTCOME_STYLE.pending}`}>
              {CANDIDATE_OUTCOME_LABEL[candidate.outcome] ?? humanize(candidate.outcome)}
            </span>
          </div>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-neutral-500">
            {website ? (
              <a
                href={website}
                target="_blank"
                rel="noreferrer"
                className={`rounded text-[#5B57E6] hover:underline ${FOCUS_RING}`}
              >
                {candidate.domain}
              </a>
            ) : null}
            {location ? (
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3" aria-hidden="true" />
                {location}
              </span>
            ) : null}
            {candidate.source_url ? (
              <a
                href={candidate.source_url}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-1 rounded hover:text-[#5B57E6] ${FOCUS_RING}`}
              >
                Found via {humanize(candidate.source)}
                <ExternalLink className="size-3" aria-hidden="true" />
              </a>
            ) : (
              <span>Found via {humanize(candidate.source)}</span>
            )}
          </p>
        </div>
        {typeof candidate.fit_score === "number" ? (
          <span className="shrink-0 rounded-full bg-[#F1F2FB] px-2.5 py-1 text-[12px] font-semibold text-neutral-700">
            Fit {candidate.fit_score}
          </span>
        ) : null}
      </div>

      {candidate.what_they_do ? (
        <p className="mt-2 text-[13px] leading-5 text-neutral-600">{candidate.what_they_do}</p>
      ) : null}
      {note ? <p className="mt-1.5 text-[12px] leading-5 text-neutral-500">{note}</p> : null}
      {candidate.signals.length ? (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {candidate.signals.map((signal) => (
            <li key={signal} className="rounded-full bg-[#F6F7FD] px-2 py-0.5 text-[11px] text-neutral-600">
              {signal}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
