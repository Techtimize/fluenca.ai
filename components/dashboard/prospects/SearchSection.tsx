"use client";

import { AlertCircle, CheckCircle2, Loader2, Search } from "lucide-react";
import type { ProspectRun } from "@/types/bussiness/prospect-type";
import { BADGE, CARD, formatDateTime, humanize, RUN_STATUS_LABEL, RUN_STATUS_STYLE } from "./prospect-ui";
import SectionHeader from "./SectionHeader";

type Props = {
  runs: ProspectRun[];
  /** The search being shown (polled by the page until it finishes). */
  run?: ProspectRun;
  selectedRunId: string | null;
  onSelectRun: (runId: string) => void;
};

/** Step 2: the background search and its progress. */
export default function SearchSection({ runs, run, selectedRunId, onSelectRun }: Props) {
  return (
    <section className={`${CARD} p-5 sm:p-6`}>
      <SectionHeader
        step={2}
        title="Search"
        description="Fluenca finds companies that match a profile, then the best people to contact there."
        action={
          runs.length > 1 ? (
            <label className="flex items-center gap-2 text-[12px] text-neutral-500">
              <span className="sr-only sm:not-sr-only">Recent searches</span>
              <select
                value={selectedRunId ?? ""}
                onChange={(e) => onSelectRun(e.target.value)}
                className="h-9 rounded-full border border-[#E6E8F5] bg-white px-3 text-[13px] text-neutral-800 outline-none focus:border-[#5B57E6] focus:ring-2 focus:ring-[#5B57E6]/20"
              >
                {runs.map((item) => (
                  <option key={item.id} value={item.id}>
                    {formatDateTime(item.created_at) || item.id} · {RUN_STATUS_LABEL[item.status]}
                  </option>
                ))}
              </select>
            </label>
          ) : null
        }
      />

      <div className="mt-5">
        {run ? (
          <RunStatus run={run} />
        ) : (
          <div className="flex items-center gap-3 rounded-2xl border border-dashed border-[#E6E8F5] px-4 py-5 text-[13px] text-neutral-500">
            <Search className="size-4 shrink-0 text-[#A5A8F5]" aria-hidden="true" />
            No searches yet. Pick a profile above and click “Find prospects”.
          </div>
        )}
      </div>
    </section>
  );
}

function RunStatus({ run }: { run: ProspectRun }) {
  const inProgress = run.status === "queued" || run.status === "running";
  const counts = Object.entries(run.counts ?? {});

  return (
    <div className="rounded-2xl bg-[#FAFAFF] p-4 ring-1 ring-[#EEF0FA]" aria-live="polite">
      <div className="flex flex-wrap items-center gap-3">
        {inProgress ? (
          <Loader2 className="size-5 animate-spin text-[#5B57E6]" aria-hidden="true" />
        ) : run.status === "ready" ? (
          <CheckCircle2 className="size-5 text-emerald-600" aria-hidden="true" />
        ) : (
          <AlertCircle className="size-5 text-rose-600" aria-hidden="true" />
        )}
        <span className={`${BADGE} ${RUN_STATUS_STYLE[run.status]}`}>{RUN_STATUS_LABEL[run.status]}</span>
        {run.stage && inProgress ? (
          <span className="text-[13px] text-neutral-700">{humanize(run.stage)}…</span>
        ) : null}
        {run.created_at ? (
          <span className="ms-auto text-[12px] text-neutral-400">Started {formatDateTime(run.created_at)}</span>
        ) : null}
      </div>

      {inProgress ? (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#EEF0FA]">
          <div className="h-full w-1/3 animate-[prospect-progress_1.4s_ease-in-out_infinite] rounded-full bg-linear-to-r from-[#5B57E6] to-[#8B5CF6]" />
        </div>
      ) : null}

      {run.status === "failed" ? (
        <p className="mt-3 text-[13px] text-rose-700">{run.error || "The search failed. Try again from a profile."}</p>
      ) : null}

      {counts.length ? (
        <dl className="mt-4 flex flex-wrap gap-2">
          {counts.map(([key, value]) => (
            <div key={key} className="rounded-xl bg-white px-3 py-2 ring-1 ring-[#EEF0FA]">
              <dt className="text-[11px] text-neutral-500">{humanize(key)}</dt>
              <dd className="text-[15px] font-semibold text-neutral-900">{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}
