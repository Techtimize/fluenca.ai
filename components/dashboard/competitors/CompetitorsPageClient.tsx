"use client";

import CompetitorResults from "@/components/dashboard/competitors/CompetitorResults";
import { CompetitorsDetailTable } from "@/components/dashboard/competitors/CompetitorsDetailTable";
import { getApiErrorMessage } from "@/errors/error-utils";
import { normalizeCompetitorsList } from "@/lib/dashboard/map-competitors-page";
import { CompetitorAnalysisCompetitorQuery } from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";

export function CompetitorsPageClient() {
  const companyId = useAuthStore((s) => s.company_id);
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = CompetitorAnalysisCompetitorQuery(companyId);

  const loadCompetitors = () => {
    void refetch();
  };

  const competitors = normalizeCompetitorsList(
    data?.result?.competitors ??
      data?.result?.competitors_overview?.competitors ??
      data?.competitors ??
      [],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold text-neutral-900">Competitors</h2>
          <p className="mt-1 text-[13px] text-neutral-500">
            Latest competitor intelligence for your company.
          </p>
        </div>
        <button
          type="button"
          onClick={loadCompetitors}
          disabled={isFetching}
          className="rounded-full border border-[#E6E8F5] bg-white px-4 py-2 text-[13px] font-medium text-neutral-700 hover:bg-[#F8F9FF] disabled:opacity-50"
        >
          {isFetching ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <CompetitorResults
        data={data}
        isLoading={isLoading}
        isError={isError}
        errorMessage={
          isError ? getApiErrorMessage(error, "Failed to load competitors") : undefined
        }
      />

      {!isLoading && !isError ? <CompetitorsDetailTable competitors={competitors} /> : null}
    </div>
  );
}
