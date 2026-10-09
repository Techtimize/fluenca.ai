"use client";

import { useMemo } from "react";
import { normalizeCompanyContent } from "@/components/dashboard/content/utils";
import { CompanyImageGenerationResultsQuery } from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";

export function useSocialContent() {
  const companyId = useAuthStore((s) => s.company_id);
  const { data, isLoading, isFetching, refetch } =
    CompanyImageGenerationResultsQuery(companyId || "");

  const content = useMemo(() => normalizeCompanyContent(data), [data]);

  return {
    companyId,
    results: content.results,
    isLoading: Boolean(companyId) && (isLoading || isFetching),
    isRefreshing: Boolean(companyId) && isFetching,
    refetch,
  };
}
