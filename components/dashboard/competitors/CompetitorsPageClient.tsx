"use client";

import { useCallback, useMemo } from "react";
import { CompetitorsView } from "@/components/dashboard/competitors/CompetitorsView";
import Card from "@/components/shared/card";
import { getApiErrorMessage } from "@/errors/error-utils";
import { mapCompetitorsPageData } from "@/lib/dashboard/map-competitors-page";
import { CompetitorAnalysisCompetitorQuery } from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";

export function CompetitorsPageClient() {
  const companyId = useAuthStore((s) => s.company_user_id);
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = CompetitorAnalysisCompetitorQuery(companyId);

  const loadCompetitors = useCallback(() => {
    void refetch();
  }, [refetch]);

  const pageData = useMemo(() => (data ? mapCompetitorsPageData(data) : null), [data]);

  const competitors =
    data?.result?.competitors ??
    data?.result?.competitors_overview?.competitors ??
    data?.competitors ??
    [];

  if (isLoading && !data) {
    return (
      <Card className="p-8 text-center text-sm text-neutral-500">Loading competitor view…</Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-rose-200 bg-rose-50/80 p-5">
        <p className="text-sm text-rose-700">
          {getApiErrorMessage(error, "Failed to load competitors")}
        </p>
      </Card>
    );
  }

  if (!pageData) {
    return (
      <Card className="p-8 text-center text-sm text-neutral-500">
        No competitor analysis available yet. Run analysis first.
      </Card>
    );
  }

  return (
    <CompetitorsView
      data={pageData}
      competitorDetails={competitors}
      onRefresh={loadCompetitors}
      isRefreshing={isFetching}
    />
  );
}
