import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { CompanyImageGenerationResultsApi, CompetitorAnalysisAiLatestResponseApi, CompetitorAnalysisAiSpecificVersionsApi, CompetitorAnalysisAiVersionsApi, CompetitorAnalysisCompetitorApi, CompetitorAnalysisJobApi, CompetitorAnalysisManualLatestResponseApi, CompetitorAnalysisManualSpecificVersionsApi, CompetitorAnalysisManualVersionsApi, CompetitorAnalyticDashboardApi, ContentExecutionAgentModeApi, ContentExecutionItemsApi, ContentExecutionRunsApi, ContentExecutionSettingsApi, ContentRecommendationResultApi, DnaApi, FacebookProfileContentApi, IntakeApi, IntelligenceJobApi, InstagramProfileIdApi, InstagramProfileInfoApi, LinkedInProfileContentApi, OnboardingDetailsApi, PlannerResultsApi, PlannerSpecificVersionsApi, PlannerVersionsApi, ScriptGenerationResultsApi, ScriptGenerationResultsByCompanyIdApi, SocialAccountsApi, InstagramProfileContentApi, InstagramProfileReachApi, InstagramProfileInteractionsApi, InstagramProfileDemographicsApi, InstagramProfileFollowsApi, InstagramProfileViewsApi, InstagramProfileActionsApi, InstagramProfileStoriesApi, InstagramLiveStreamApi, CompanyGoalsApi, GoalByIdApi, GoalProgressApi, GoalLessonsApi, GoalPlanApi, GoalsByCompanyApi } from "./bussiness.routes";
import {
    AnalyzeCompanyResultsApi,
  AnalyzeCompanyDashboardApi,
  AnalyzeCompanyDashboardDocumentationApi,
  UserProfileApi,
  GoogleTrendExploreApi,
  GoogleTrendFiltersApi,
  GoogleTrendNowApi,
  GoogleTrendTrendingApi,
} from "./bussiness.routes";
import type { GoogleTrendQueryParams } from "@/types/bussiness/google-trends-type";
import { ChatHistoryApi } from "../chatbot/chatbot.routes";
import { BlogPostDetailsApi, BlogPostsApi, BriefsApi, KeywordsApi } from "./bussiness.routes";
import {
  GoogleAnalyticsConnectionApi,
  GoogleAnalyticsOverviewApi,
  GoogleAnalyticsPropertiesApi,
  SearchConsoleConnectionApi,
  SearchConsoleOverviewApi,
  SearchConsoleSitemapsApi,
  SearchConsoleSitesApi,
} from "./bussiness.routes";

const BLOG_POLL_INTERVAL_MS = 3000;
const isWriting = (status?: string) => status === "queued" || status === "writing";

export const KEYWORDS_KEY = ["keywords"];

export const KeywordsQuery = () => {
  return useQuery({
    queryKey: KEYWORDS_KEY,
    queryFn: () => KeywordsApi(),
    refetchInterval: (query) => (query.state.data?.status === "researching" ? BLOG_POLL_INTERVAL_MS : false),
    refetchOnWindowFocus: false,
  });
};

export const BriefsQuery = (researchStatus?: string) => {
  return useQuery({
    queryKey: ["briefs", researchStatus],
    queryFn: () => BriefsApi(),
    enabled: Boolean(researchStatus),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const BlogPostsQuery = () => {
  return useQuery({
    queryKey: ["blog-posts"],
    queryFn: () => BlogPostsApi(),
    refetchInterval: (query) =>
      query.state.data?.blog_posts.some((post) => isWriting(post.status)) ? BLOG_POLL_INTERVAL_MS : false,
    refetchOnWindowFocus: false,
  });
};

export const BlogPostDetailsQuery = (blogPostId: string) => {
  return useQuery({
    queryKey: ["blog-post", blogPostId],
    queryFn: () => BlogPostDetailsApi(blogPostId),
    enabled: Boolean(blogPostId),
    retry: false,
    refetchInterval: (query) => (isWriting(query.state.data?.status) ? BLOG_POLL_INTERVAL_MS : false),
    refetchOnWindowFocus: false,
  });
};

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

export const UserProfileQuery = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: () => UserProfileApi(),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const AnalyzeCompanyDashboardDocumentationQuery = (company_id: string, enabled = true) => {
  return useQuery({
    queryKey: ["analyze-company-dashboard-documentation", company_id],
    queryFn: () => AnalyzeCompanyDashboardDocumentationApi(company_id),
    enabled: enabled && Boolean(company_id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const CompetitorAnalysisCompetitorQuery =(company_id: string) => {
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
      return messages.some((m) => m.status === "running") ? 3000 : false;
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

export const SocialAccountsQuery = (enabled = true) => {
  return useQuery({
    queryKey: ["social-accounts"],
    queryFn: () => SocialAccountsApi(),
    enabled,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const InstagramProfileIdQuery = (username?: string | null) => {
  const value = username?.trim() || "";
  return useQuery({
    queryKey: ["instagram-profile-id", value],
    queryFn: () => InstagramProfileIdApi({ username: value }),
    enabled: Boolean(value),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const InstagramProfileInfoQuery = (username?: string | null) => {
  const value = username?.trim() || "";
  return useQuery({
    queryKey: ["instagram-profile-info", value],
    queryFn: () => InstagramProfileInfoApi({ username: value }),
    enabled: Boolean(value),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const ContentExecutionSettingsQuery = (enabled = true) => {
  return useQuery({
    queryKey: ["content-execution-settings"],
    queryFn: () => ContentExecutionSettingsApi(),
    enabled,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const ContentExecutionAgentModeQuery = (enabled = true) => {
  return useQuery({
    queryKey: ["content-execution-agent-mode"],
    queryFn: () => ContentExecutionAgentModeApi(),
    enabled,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const ContentExecutionItemsQuery = (
  params?: { date?: string; status?: string; platform?: string },
  enabled = true,
) => {
  return useQuery({
    queryKey: ["content-execution-items", params],
    queryFn: () => ContentExecutionItemsApi(params),
    enabled,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const ContentExecutionRunsQuery = (
  params?: { limit?: number; status?: string },
  enabled = true,
) => {
  return useQuery({
    queryKey: ["content-execution-runs", params],
    queryFn: () => ContentExecutionRunsApi(params),
    enabled,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const InstagramProfileContentQuery = (username?: string | null) => {
  return useQuery({
    queryKey: ["instagram-profile-content", username],
    queryFn: () => InstagramProfileContentApi({ username: username as string }),
    enabled: Boolean(username),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const InstagramProfileReachQuery = (account_id?: string | null) => {
  return useQuery({
    queryKey: ["instagram-profile-reach", account_id],
    queryFn: () => InstagramProfileReachApi(account_id as string),
    enabled: Boolean(account_id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const InstagramProfileInteractionsQuery = (account_id?: string | null) => {
  return useQuery({
    queryKey: ["instagram-profile-interactions", account_id],
    queryFn: () => InstagramProfileInteractionsApi(account_id as string),
    enabled: Boolean(account_id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const InstagramProfileDemographicsQuery = (
  account_id?: string | null,
  audience: "followers" | "engaged-audience" = "followers",
) => {
  return useQuery({
    queryKey: ["instagram-profile-demographics", account_id, audience],
    queryFn: () =>
      InstagramProfileDemographicsApi(account_id as string, audience),
    enabled: Boolean(account_id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const InstagramProfileFollowsQuery = (account_id?: string | null) => {
  return useQuery({
    queryKey: ["instagram-profile-follows", account_id],
    queryFn: () => InstagramProfileFollowsApi(account_id as string),
    enabled: Boolean(account_id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const InstagramProfileViewsQuery = (account_id?: string | null) => {
  return useQuery({
    queryKey: ["instagram-profile-views", account_id],
    queryFn: () => InstagramProfileViewsApi(account_id as string),
    enabled: Boolean(account_id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const InstagramProfileActionsQuery = (account_id?: string | null) => {
  return useQuery({
    queryKey: ["instagram-profile-actions", account_id],
    queryFn: () => InstagramProfileActionsApi(account_id as string),
    enabled: Boolean(account_id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const InstagramProfileStoriesQuery = (account_id?: string | null) => {
  return useQuery({
    queryKey: ["instagram-profile-stories", account_id],
    queryFn: () => InstagramProfileStoriesApi(account_id as string),
    enabled: Boolean(account_id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const InstagramLiveStreamQuery = (account_id?: string | null) => {
  return useQuery({
    queryKey: ["instagram-live-stream", account_id],
    queryFn: () => InstagramLiveStreamApi(account_id as string),
    enabled: Boolean(account_id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
export const FacebookProfileContentQuery = (
  enabled = true,
  mediaLimit = 25,
) => {
  return useQuery({
    queryKey: ["facebook-profile-content", mediaLimit],
    queryFn: () => FacebookProfileContentApi({ media_limit: mediaLimit }),
    enabled,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const LinkedInProfileContentQuery = (
  enabled = true,
  mediaLimit = 25,
) => {
  return useQuery({
    queryKey: ["linkedin-profile-content", mediaLimit],
    queryFn: () => LinkedInProfileContentApi({ media_limit: mediaLimit }),
    enabled,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
export const GOALS_KEY = ["goals"];
export const goalKey = (goal_id?: string | null) => ["goal", goal_id];

export const CompanyGoalsQuery = (enabled = true) => {
  return useQuery({
    queryKey: GOALS_KEY,
    queryFn: () => CompanyGoalsApi(),
    enabled,
    refetchOnWindowFocus: false,
  });
};

export const GoalByIdQuery = (goal_id?: string | null) => {
  return useQuery({
    queryKey: goalKey(goal_id),
    queryFn: () => GoalByIdApi(goal_id as string),
    enabled: Boolean(goal_id),
    refetchOnWindowFocus: false,
  });
};

export const GoalProgressQuery = (goal_id?: string | null) => {
  return useQuery({
    queryKey: [...goalKey(goal_id), "progress"],
    queryFn: () => GoalProgressApi(goal_id as string),
    enabled: Boolean(goal_id),
    refetchOnWindowFocus: false,
  });
};

export const GoalLessonsQuery = (enabled = true) => {
  return useQuery({
    queryKey: ["goal-lessons"],
    queryFn: () => GoalLessonsApi(),
    enabled,
    refetchOnWindowFocus: false,
  });
};

export const GOOGLE_ANALYTICS_KEY = ["google-analytics"];
const GOOGLE_ANALYTICS_STALE_MS = 5 * 60 * 1000;

export const GoogleAnalyticsConnectionQuery = () => {
  return useQuery({
    queryKey: GOOGLE_ANALYTICS_KEY,
    queryFn: () => GoogleAnalyticsConnectionApi(),
    refetchOnWindowFocus: true,
  });
};

export const GoogleAnalyticsPropertiesQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: [...GOOGLE_ANALYTICS_KEY, "properties"],
    queryFn: () => GoogleAnalyticsPropertiesApi(),
    enabled,
    staleTime: GOOGLE_ANALYTICS_STALE_MS,
  });
};

/** Runs once a property is chosen; the key includes it so switching property refetches. */
export const GoogleAnalyticsOverviewQuery = (propertyId: string | null, days = 28) => {
  return useQuery({
    queryKey: [...GOOGLE_ANALYTICS_KEY, "overview", propertyId, days],
    queryFn: () => GoogleAnalyticsOverviewApi(days),
    enabled: Boolean(propertyId),
    staleTime: GOOGLE_ANALYTICS_STALE_MS,
  });
};

export const SEARCH_CONSOLE_KEY = ["search-console"];
const SEARCH_CONSOLE_STALE_MS = 5 * 60 * 1000;

export const SearchConsoleConnectionQuery = () => {
  return useQuery({
    queryKey: SEARCH_CONSOLE_KEY,
    queryFn: () => SearchConsoleConnectionApi(),
    refetchOnWindowFocus: true,
  });
};

export const SearchConsoleSitesQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: [...SEARCH_CONSOLE_KEY, "sites"],
    queryFn: () => SearchConsoleSitesApi(),
    enabled,
    staleTime: SEARCH_CONSOLE_STALE_MS,
  });
};

/** Runs once a site is chosen; the key includes it so switching site refetches. */
export const SearchConsoleOverviewQuery = (siteUrl: string | null, days = 28) => {
  return useQuery({
    queryKey: [...SEARCH_CONSOLE_KEY, "overview", siteUrl, days],
    queryFn: () => SearchConsoleOverviewApi(days),
    enabled: Boolean(siteUrl),
    staleTime: SEARCH_CONSOLE_STALE_MS,
  });
};

export const SearchConsoleSitemapsQuery = (siteUrl: string | null) => {
  return useQuery({
    queryKey: [...SEARCH_CONSOLE_KEY, "sitemaps", siteUrl],
    queryFn: () => SearchConsoleSitemapsApi(),
    enabled: Boolean(siteUrl),
    staleTime: SEARCH_CONSOLE_STALE_MS,
  });
};

export const GoalPlanQuery = (goal_id?: string | null) => {
  return useQuery({
    queryKey: [...goalKey(goal_id), "plan"],
    queryFn: () => GoalPlanApi(goal_id as string),
    enabled: Boolean(goal_id),
    refetchOnWindowFocus: false,
  });
};

/** All of a company's goals; keyed under GOALS_KEY so goal mutations refresh it too. */
export const GoalsByCompanyQuery = (company_id?: string | null) => {
  return useQuery({
    queryKey: [...GOALS_KEY, "company", company_id],
    queryFn: () => GoalsByCompanyApi(company_id as string),
    enabled: Boolean(company_id),
    refetchOnWindowFocus: false,
  });
};
