"use client";

import { useState } from "react";
import { Download, Loader2, Target } from "lucide-react";
import IcpSection from "@/components/dashboard/prospects/IcpSection";
import ProspectDetailDialog from "@/components/dashboard/prospects/ProspectDetailDialog";
import { SECONDARY_BUTTON } from "@/components/dashboard/prospects/prospect-ui";
import SearchSection from "@/components/dashboard/prospects/SearchSection";
import ShortlistSection from "@/components/dashboard/prospects/ShortlistSection";
import { ExportProspectsCsvMutation, StartProspectRunMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { ProspectRunQuery, ProspectRunsQuery } from "@/routes/bussiness/Bussiness-Query";
import { isRunFinished } from "@/types/bussiness/prospect-type";
import { FOCUS_RING } from "@/utils/ui-classes";

/** Prospect finder: build customer profiles → run a search → work through the shortlist. */
export default function ProspectsPage() {
  const runsQuery = ProspectRunsQuery();
  const runs = runsQuery.data ?? [];

  // Show the search the user picked, or the most recent one.
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const runId = selectedRunId ?? runs[0]?.id ?? null;
  const run = ProspectRunQuery(runId).data;

  const [openProspectId, setOpenProspectId] = useState<string | null>(null);

  const startRun = StartProspectRunMutation();
  const exportCsv = ExportProspectsCsvMutation();
  const searchBusy = startRun.isPending || Boolean(run && !isRunFinished(run.status));

  const findProspects = (icpId?: string) => {
    startRun.mutate(icpId ? { icp_id: icpId } : undefined, {
      onSuccess: (newRun) => setSelectedRunId(newRun.id),
    });
  };

  return (
    <main className="min-w-0 space-y-4 pb-6">
      <section className="flex flex-wrap items-end justify-between gap-4 rounded-[28px] border border-[#E6E8F5] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_55%)] p-5 sm:p-7">
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5B57E6] ring-1 ring-[#E6E8F5]">
            <Target className="size-3.5" aria-hidden="true" />
            Prospects
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">Prospect finder</h1>
          <p className="mt-2 max-w-2xl text-[14px] leading-6 text-neutral-600">
            Find companies that fit your ideal customer, the right people to talk to, and outreach drafts ready to send.
          </p>
        </div>
        <button
          type="button"
          onClick={() => exportCsv.mutate()}
          disabled={exportCsv.isPending}
          className={`${SECONDARY_BUTTON} ${FOCUS_RING}`}
        >
          {exportCsv.isPending ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
          Export saved (CSV)
        </button>
      </section>

      <IcpSection onFind={findProspects} searchBusy={searchBusy} />
      <SearchSection runs={runs} run={run} selectedRunId={runId} onSelectRun={setSelectedRunId} />
      <ShortlistSection runId={runId} ready={run?.status === "ready"} onOpen={setOpenProspectId} />

      <ProspectDetailDialog prospectId={openProspectId} onClose={() => setOpenProspectId(null)} />
    </main>
  );
}
