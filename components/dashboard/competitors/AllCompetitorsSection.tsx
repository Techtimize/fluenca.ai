"use client";

import CompetitorCompareDialog, {
  useCompetitorCompare,
} from "@/components/dashboard/competitors/CompetitorCompareDialog";
import CompetitorRow from "@/components/dashboard/competitors/CompetitorRow";
import { useComparedStatus } from "@/components/dashboard/competitors/useComparedStatus";
import { mapSavedCompetitor } from "@/lib/dashboard/map-dashboard";
import { GetFindCompetitorQuery } from "@/routes/bussiness/Bussiness-Query";

/** Every competitor found for the company, with their links and a Compare button each. */
export default function AllCompetitorsSection({ companyId }: { companyId: string }) {
  const { data, isLoading } = GetFindCompetitorQuery(companyId);
  const compare = useCompetitorCompare();
  const withComparedStatus = useComparedStatus();
  const competitors = withComparedStatus((data ?? []).map(mapSavedCompetitor));

  if (isLoading) {
    return <div className="h-32 animate-pulse rounded-3xl bg-[#F1F3FB]" aria-hidden="true" />;
  }
  if (!competitors.length) return null;

  return (
    <section className="rounded-3xl border border-[#E6E8F5] bg-white p-4 sm:p-5">
      <h3 className="mb-3 text-sm font-semibold text-neutral-900">
        Your competitors{" "}
        <span className="font-normal text-neutral-500">({competitors.length})</span>
      </h3>
      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        {competitors.map((competitor, index) => (
          <CompetitorRow
            key={competitor.id}
            competitor={competitor}
            index={index}
            onCompare={() => compare.start([competitor], competitor.id)}
            compareDisabled={compare.isBusy}
            isComparing={compare.isComparing(competitor.id)}
            confirmable
          />
        ))}
      </ul>
      <CompetitorCompareDialog {...compare.dialogProps} />
    </section>
  );
}
