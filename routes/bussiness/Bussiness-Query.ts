import { useQuery } from "@tanstack/react-query";
import { DnaApi, OnboardingDetailsApi } from "./bussiness.routes";
import {
    AnalyzeCompanyResultsApi,
  GoogleTrendExploreApi,
  GoogleTrendFiltersApi,
  GoogleTrendNowApi,
  GoogleTrendTrendingApi,
} from "./bussiness.routes";
import type { GoogleTrendQueryParams } from "@/types/bussiness/google-trends-type";

export const OnboardingDetailsQuery = () => {
  return useQuery({
    queryKey: ["onboarding-details"],
    queryFn: () => OnboardingDetailsApi(),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const GoogleTrendNowQuery = (params?: GoogleTrendQueryParams) => {
  return useQuery({
    queryKey: ["google-trend-now", params],
    queryFn: () => GoogleTrendNowApi(params),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};


export const DnaQuery = () => {
    return useQuery({
        queryKey: ['dna'],
        queryFn: () => DnaApi(),
        refetchInterval: (query) => {
            const status = query.state.data?.status;
            return status === 'ready' || status === 'failed' ? false : 3000;
        },
        refetchOnWindowFocus: false,
    });
}
export const GoogleTrendTrendingQuery = (params?: GoogleTrendQueryParams) => {
  return useQuery({
    queryKey: ["google-trend-trending", params],
    queryFn: () => GoogleTrendTrendingApi(params),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const GoogleTrendExploreQuery = (params?: GoogleTrendQueryParams) => {
  return useQuery({
    queryKey: ["google-trend-explore", params],
    queryFn: () => GoogleTrendExploreApi(params),
    enabled: Boolean(params?.q),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const GoogleTrendFiltersQuery = () => {
  return useQuery({
    queryKey: ["google-trend-filters"],
    queryFn: () => GoogleTrendFiltersApi(),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const AnalyzeCompanyResultsQuery = (company_user_id: string) => {
  return useQuery({
    queryKey: ["analyze-company-results", company_user_id],
    queryFn: () => AnalyzeCompanyResultsApi(company_user_id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};