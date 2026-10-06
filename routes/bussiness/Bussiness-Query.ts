import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { CompanyImageGenerationResultsApi, CompetitorAnalysisAiLatestResponseApi, CompetitorAnalysisAiSpecificVersionsApi, CompetitorAnalysisAiVersionsApi, CompetitorAnalysisCompetitorApi, CompetitorAnalysisJobApi, CompetitorAnalysisManualLatestResponseApi, CompetitorAnalysisManualSpecificVersionsApi, CompetitorAnalysisManualVersionsApi, CompetitorAnalyticDashboardApi, ContentRecommendationResultApi, DnaApi, IntakeApi, IntelligenceJobApi, OnboardingDetailsApi, PlannerResultsApi, PlannerSpecificVersionsApi, PlannerVersionsApi, ScriptGenerationResultsApi, ScriptGenerationResultsByCompanyIdApi } from "./bussiness.routes";
import {
    AnalyzeCompanyResultsApi,
  AnalyzeCompanyDashboardApi,
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

export const AnalyzeCompanyResultsQuery = (company_id: string) => {
  return useQuery({
    queryKey: ["analyze-company-results", company_id],
    queryFn: () => AnalyzeCompanyResultsApi(company_id),
    enabled: Boolean(company_id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const AnalyzeCompanyDashboardQuery = (company_id: string) => {
  return useQuery({
    queryKey: ["analyze-company-dashboard", company_id],
    queryFn: () => AnalyzeCompanyDashboardApi(company_id),
    enabled: Boolean(company_id),
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

export const ScriptGenerationResultsByCompanyIdQuery = (
  company_id: string,
  params?: { limit?: number; offset?: number },
) => {
  const limit = params?.limit ?? 20;
  const offset = params?.offset ?? 0;

  return useQuery({
    queryKey: ["script-generation-results", company_id, { limit, offset }],
    queryFn: () =>
      ScriptGenerationResultsByCompanyIdApi(company_id, { limit, offset }),
    enabled: Boolean(company_id),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const ScriptGenerationResultsQuery = () => {
  return useQuery({
    queryKey: ["script-generation-results"],
    queryFn: () => ScriptGenerationResultsApi(),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

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

export const CHAT_HISTORY_KEY = (conversationId: string | null) => ["chat-history", conversationId];

export const ChatHistoryQuery = (conversationId: string | null, enabled = true) => {
  return useQuery({
    queryKey: CHAT_HISTORY_KEY(conversationId),
    queryFn: () => ChatHistoryApi(conversationId as string),
    enabled: enabled && conversationId !== null,
    refetchInterval: (query) => {
      const messages = query.state.data?.messages ?? [];
      const last = messages[messages.length - 1];
      return last?.status === "running" ? 3000 : false;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};


export const CompanyImageGenerationResultsQuery = (company_id: string) => {
  return useQuery({
    queryKey: ["company-image-generation-results", company_id],
    queryFn: () => CompanyImageGenerationResultsApi(company_id),
    enabled: Boolean(company_id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

const JOB_DONE_STATUSES = new Set([
  "completed",
  "succeeded",
  "success",
  "ready",
  "failed",
  "error",
  "cancelled",
  "canceled",
]);

export const CompetitorAnalysisJobQuery = (job_id: string) => {
  return useQuery({
    queryKey: ["competitor-analysis-job", job_id],
    queryFn: () => CompetitorAnalysisJobApi(job_id),
    enabled: Boolean(job_id),
    refetchInterval: (query) => {
      const status = String(query.state.data?.status ?? "").toLowerCase();
      if (status && JOB_DONE_STATUSES.has(status)) return false;
      return POLL_INTERVAL_MS;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};


export const CompetitorAnalysisAiVersionsQuery = (company_id: string) => {
  return useQuery({
    queryKey: ["competitor-analysis-ai-versions", company_id],
    queryFn: () => CompetitorAnalysisAiVersionsApi(company_id),
    enabled: Boolean(company_id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const CompetitorAnalysisAiSpecificVersionsQuery = (company_id: string, version: string) => {
  return useQuery({
    queryKey: ["competitor-analysis-ai-specific-versions", company_id, version],
    queryFn: () => CompetitorAnalysisAiSpecificVersionsApi(company_id, version),
    enabled: Boolean(company_id && version),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const CompetitorAnalysisAiLatestResponseQuery = (company_id: string) => {
  return useQuery({
    queryKey: ["competitor-analysis-ai-latest-response", company_id],
    queryFn: () => CompetitorAnalysisAiLatestResponseApi(company_id),
    enabled: Boolean(company_id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const CompetitorAnalysisManualVersionsQuery = (company_id: string) => {
  return useQuery({
    queryKey: ["competitor-analysis-manual-versions", company_id],
    queryFn: () => CompetitorAnalysisManualVersionsApi(company_id),
    enabled: Boolean(company_id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const CompetitorAnalysisManualSpecificVersionsQuery = (company_id: string, version: string) => {
  return useQuery({
    queryKey: ["competitor-analysis-manual-specific-versions", company_id, version],
    queryFn: () => CompetitorAnalysisManualSpecificVersionsApi(company_id, version),
    enabled: Boolean(company_id && version),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const CompetitorAnalysisManualLatestResponseQuery = (company_id: string) => {
  return useQuery({
    queryKey: ["competitor-analysis-manual-latest-response", company_id],
    queryFn: () => CompetitorAnalysisManualLatestResponseApi(company_id),
    enabled: Boolean(company_id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const IntelligenceJobQuery = (job_id: string) => {
  return useQuery({
    queryKey: ["intelligence-job", job_id],
    queryFn: () => IntelligenceJobApi(job_id),
    enabled: Boolean(job_id),
    // A 4xx (e.g. 404 "Job not found") will not fix itself, so fail fast instead of retrying.
    retry: (failureCount, error) => {
      const status = (error as { response?: { status?: number } })?.response?.status ?? 0;
      return status >= 400 && status < 500 ? false : failureCount < 2;
    },
    refetchInterval: (query) => {
      if (query.state.status === "error") return false;
      const status = String(query.state.data?.status ?? "").toLowerCase();
      if (status && JOB_DONE_STATUSES.has(status)) return false;
      return POLL_INTERVAL_MS;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const PlannerResultsQuery = (company_id: string) => {
  return useQuery({
    queryKey: ["planner-results", company_id],
    queryFn: () => PlannerResultsApi(company_id),
    enabled: Boolean(company_id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const PlannerVersionsQuery = (company_id: string) => {
  return useQuery({
    queryKey: ["planner-versions", company_id],
    queryFn: () => PlannerVersionsApi(company_id),
    enabled: Boolean(company_id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const PlannerSpecificVersionsQuery = (company_id: string, version: string) => {
  return useQuery({
    queryKey: ["planner-specific-versions", company_id, version],
    queryFn: () => PlannerSpecificVersionsApi(company_id, version),
    enabled: Boolean(company_id && version),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};


export const CompetitorAnalyticDashboardQuery = (company_id: string) => {
  return useQuery({
    queryKey: ["competitor-analytic-dashboard", company_id],
    queryFn: () => CompetitorAnalyticDashboardApi(company_id),
    enabled: Boolean(company_id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};