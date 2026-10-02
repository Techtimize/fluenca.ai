import { useQuery } from "@tanstack/react-query";
import { CompetitorAnalysisCompetitorApi, ContentRecommendationResultApi, DnaApi, IntakeApi, OnboardingDetailsApi } from "./bussiness.routes";
import {
    AnalyzeCompanyResultsApi,
  GoogleTrendExploreApi,
  GoogleTrendFiltersApi,
  GoogleTrendNowApi,
  GoogleTrendTrendingApi,
} from "./bussiness.routes";
import type { GoogleTrendQueryParams } from "@/types/bussiness/google-trends-type";
import { ChatHistoryApi } from "../chatbot/chatbot.routes";

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
    enabled: Boolean(company_user_id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const CompetitorAnalysisCompetitorQuery = (company_id: string) => {
  return useQuery({
    queryKey: ["competitor-analysis-competitor", company_id],
    queryFn: () => CompetitorAnalysisCompetitorApi(company_id),
    enabled: Boolean(company_id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const ContentRecommendationResultQuery = (company_id: string) => {
    return useQuery({
        queryKey: ["content-recommendation-result", company_id],
        queryFn: () => ContentRecommendationResultApi(company_id),
        enabled: Boolean(company_id),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
}

const POLL_INTERVAL_MS = 3000;

export const IntakeQuery = () => {
    return useQuery({
        queryKey: ['intake'],
        queryFn: () => IntakeApi(),
        refetchInterval: (query) => {
            const status = query.state.data?.status;
            return !status || status === 'not_started' || status === 'running' ? POLL_INTERVAL_MS : false;
        },
        refetchOnWindowFocus: false,
    });
}

export const CHAT_HISTORY_KEY = ["chat-history"];

export const ChatHistoryQuery = (enabled = true) => {
  return useQuery({
    queryKey: CHAT_HISTORY_KEY,
    queryFn: () => ChatHistoryApi(),
    enabled,
    refetchInterval: (query) => {
      const messages = query.state.data?.messages ?? [];
      const last = messages[messages.length - 1];
      return last?.status === "running" ? 3000 : false;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
