import { BUSSINESSENDPOINT } from "./Bussiness-Endpoint";
import type { ContactUsRequest, ContactUsResponse } from "@/types/bussiness/contact-type";
import type {
  GoogleAnalyticsConnection,
  GoogleAnalyticsOverview,
  GoogleAnalyticsPropertyList,
} from "@/types/bussiness/google-analytics-type";
import type {
  IndexCheck,
  SearchConsoleConnection,
  SearchConsoleOverview,
  SearchConsoleSite,
  Sitemap,
  UrlInspection,
} from "@/types/bussiness/search-console-type";
import type {
  CreateScheduledPostRequest,
  ScheduledPost,
  ScheduledPostStatus,
  UpdateScheduledPostRequest,
} from "@/types/bussiness/scheduled-post-type";
import {
  unwrapTextPost,
  unwrapTextPosts,
  type CreateTextPostRequest,
  type TextPost,
} from "@/types/bussiness/text-post-type";
import type { NewsParams, NewsResponse } from "@/types/bussiness/news-type";
import api from "../apiClient";
import { AnalyzeCompanyRequest, AnalyzeCompanyResponse } from "@/types/bussiness/analyzecompany-type";
import type { DashboardResponse } from "@/types/bussiness/dashboard-type";
import type { DashboardDocumentationResponse } from "@/types/bussiness/dashboard-documentation-type";
import type {
  EditProfileRequest,
  EditProfileResponse,
  UserProfileResponse,
} from "@/types/bussiness/user-profile-type";
import {
  CompetitorAnalysisJobResponse,
  CompetitorAnalysisManualRequest,
  CompetitorAnalysisRequest,
  CompetitorAnalysisVersionsResponse,
  CompetitorsListResponse,
} from "@/types/bussiness/competitoranalysis-type";
import { OnboardingRequestProps, OnboardingResponseProps } from "@/types/onboarding-type";
import { DnaResponseProps } from "@/types/bussiness/dna-type";
import type {
  GoogleTrendExploreResponse,
  GoogleTrendFiltersResponse,
  GoogleTrendNowResponse,
  GoogleTrendQueryParams,
  GoogleTrendTrendingResponse,
} from "@/types/bussiness/google-trends-type";
import {  ContentRecommendationRequest, ContentRecommendationResponse, ContentRecommendationResultResponse } from "@/types/bussiness/content-recommendation-type";
import { AnswerQuestionRequestProps, IntakeQuestion, IntakeResponseProps } from "@/types/company-details-type";
import {
  ScriptGenerationRequest,
  ScriptGenerationResultsParams,
  ScriptGenerationResultsResponse,
} from "@/types/bussiness/script-type";
import type {
  CompanyImageGenerationResponse,
  ImageGenerationRequest,
  ImageGenerationResponse,
  ImageGenerationScheduleRequest,
  ImageGenerationScheduleResponse,
  LatestGeneratedImageResponse,
} from "@/types/bussiness/imagegeneration-type";
import { IntelligenceJobResponse, IntelligenceRunRequest, IntelligenceRunResponse } from "@/types/bussiness/intelligence-type";
import type { PlannerResultsResponse, PlannerVersionsResponse } from "@/types/bussiness/planner-type";
import type {
    BlogImageRequest,
    BlogPost,
    BlogPostListResponse,
    BriefListResponse,
    KeywordsStatusResponse,
} from "@/types/bussiness/blog-type";
import type {
  FacebookPublishRequest,
  FacebookPublishResponse,
  InstagramAuthorizeResponse,
  InstagramPublishRequest,
  InstagramPublishResponse,
  LinkedInPublishRequest,
  LinkedInPublishResponse,
  XPublishRequest,
  XPublishResponse,
  SocialAccountsResponse,
} from "@/types/bussiness/social-accounts-type";
import type {
  ContentExecutionAgentModeRequest,
  ContentExecutionAgentModeResponse,
  ContentExecutionDailyResponse,
  ContentExecutionItemsResponse,
  ContentExecutionRunRequest,
  ContentExecutionRunResponse,
  ContentExecutionRunsResponse,
  ContentExecutionSettingsRequest,
  ContentExecutionSettingsResponse,
} from "@/types/bussiness/content-execution-type";
import type {
  InstagramPostEngagementRequest,
  InstagramPostEngagementResponse,
  InstagramProfileContentRequest,
  InstagramProfileContentResponse,
  InstagramProfileIdRequest,
  InstagramProfileIdResponse,
  InstagramProfileInfoRequest,
  InstagramProfileInfoResponse,
} from "@/types/bussiness/instagram-type";
import type {
  SocialProfileContentRequest,
  SocialProfileContentResponse,
} from "@/types/bussiness/social-profile-content-type";
import type {
  CreateGoalRequest,
  CreateGoalResponse,
  DiagnoseGoalResponse,
  GoalDetailResponse,
  Goal,
  GoalListResponse,
  GoalLessonsResponse,
  GoalPlanResponse,
  GoalProgressResponse,
  GoalTask,
  UpdateGoalTaskRequest,
} from "@/types/bussiness/goal-type";

import type {
  BuildIcpRequest,
  IcpResponse,
  Prospect,
  ProspectRun,
  ProspectsParams,
  StartProspectRunRequest,
  UpdateIcpRequest,
  UpdateProspectStatusRequest,
} from "@/types/bussiness/prospect-type";
import type {
  LinkedInScore,
  LinkedInVoice,
  ProfileRewrite,
  ProfileScore,
  ProfileScoreRequest,
  ScheduleWeekPostRequest,
  WeekPost,
  WeekPostsResponse,
} from "@/types/bussiness/linkedin-growth-type";
import type {
  AddFollowUpRequest,
  Carousel,
  CarouselRequest,
  CoachDraft,
  CoachToday,
  ContentPlan,
  ContentPlanGoal,
  FollowUp,
  HookFormula,
  PostCheckRequest,
  PostCheckResponse,
  PublishCarouselRequest,
  RepurposeResponse,
  WeeklyReport,
  WritePostRequest,
} from "@/types/bussiness/linkedin-coach-type";


function toQueryParams(params?: GoogleTrendQueryParams) {
  if (!params) return undefined;
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== "",
  );
  return entries.length ? Object.fromEntries(entries) : undefined;
}

/** POST /contact-us — demo / sales requests */
export const ContactUsApi = async (data: ContactUsRequest): Promise<ContactUsResponse> => {
    const response = await api.post(BUSSINESSENDPOINT.CONTACT_US, data);
    return response.data;
}

export const WaitlistApi = async (email: string) => {
    const response = await api.post(`${process.env.NEXT_PUBLIC_WAITLIST_URL}`, { email: email });
    return response.data;
}

export const OnboardingApi = async (data: OnboardingRequestProps): Promise<OnboardingResponseProps> => {
    const response = await api.post(BUSSINESSENDPOINT.ONBOARDING, data);
    return response.data;
}

export const OnboardingDetailsApi = async (): Promise<OnboardingResponseProps> => {
    const response = await api.get(BUSSINESSENDPOINT.ONBOARDING);
    return response.data;
}

export const AnalyzeCompanyApi = async (data: AnalyzeCompanyRequest) => {
    const response = await api.post<AnalyzeCompanyResponse>(BUSSINESSENDPOINT.ANALYZE_COMPANY, data);
    return response.data;
}

export const CompetitorAnalysisAsyncApi = async (data: CompetitorAnalysisRequest) => {
    const response = await api.post(
      BUSSINESSENDPOINT.ANALYSIS.COMPETITOR_ANALYSIS_ASYNC,
      data,
    );
    return response.data;
}

export const CompetitorAnalysisJobApi = async (
  job_id: string,
): Promise<CompetitorAnalysisJobResponse> => {
    const response = await api.get(
      BUSSINESSENDPOINT.ANALYSIS.COMPETITOR_ANALYSIS_JOB(job_id),
    );
    return response.data;
}

export const CompetitorAnalysisCompetitorApi = async (company_id: string) => {
    const response = await api.get<CompetitorsListResponse>(
      BUSSINESSENDPOINT.ANALYSIS.COMPETITOR_ANALYSIS_COMPETITOR(company_id),
    );
    return response.data;
}

export const CompetitorAnalysisAiApi = async (company_id: string) => {
    const response = await api.post(
      BUSSINESSENDPOINT.ANALYSIS.COMPETITOR_ANALYSIS_AI,
      { company_id: company_id },
    );
    return response.data;
}

export const CompetitorAnalysisAiVersionsApi = async (
  company_id: string,
): Promise<CompetitorAnalysisVersionsResponse> => {
    const response = await api.get(
      BUSSINESSENDPOINT.ANALYSIS.COMPETITOR_ANALYSIS_AI_VERSIONS(company_id),
    );
    return response.data;
}

export const CompetitorAnalysisAiSpecificVersionsApi = async (
  company_id: string,
  version: string,
): Promise<CompetitorsListResponse> => {
    const response = await api.get(
      BUSSINESSENDPOINT.ANALYSIS.COMPETITOR_ANALYSIS_AI_SPECIFIC_VERSIONS(company_id, version),
    );
    return response.data;
}

export const CompetitorAnalysisAiLatestResponseApi = async (
  company_id: string,
): Promise<CompetitorsListResponse> => {
    const response = await api.get(
      BUSSINESSENDPOINT.ANALYSIS.COMPETITOR_ANALYSIS_LATEST_AI_RESPONSE(company_id),
    );
    return response.data;
}

export const CompetitorAnalysisManualApi = async (data: CompetitorAnalysisManualRequest) => {
    const response = await api.post(
      BUSSINESSENDPOINT.ANALYSIS.COMPETITOR_ANALYSIS_MANUAL,
      data,
    );
    return response.data;
}

export const CompetitorAnalysisManualVersionsApi = async (
  company_id: string,
): Promise<CompetitorAnalysisVersionsResponse> => {
    const response = await api.get(
      BUSSINESSENDPOINT.ANALYSIS.COMPETITOR_ANALYSIS_MANUAL_VERSIONS(company_id),
    );
    return response.data;
}

export const CompetitorAnalysisManualSpecificVersionsApi = async (
  company_id: string,
  version: string,
): Promise<CompetitorsListResponse> => {
    const response = await api.get(
      BUSSINESSENDPOINT.ANALYSIS.COMPETITOR_ANALYSIS_MANUAL_SPECIFIC_VERSIONS(company_id, version),
    );
    return response.data;
}

export const CompetitorAnalysisManualLatestResponseApi = async (
  company_id: string,
): Promise<CompetitorsListResponse> => {
    const response = await api.get(
      BUSSINESSENDPOINT.ANALYSIS.COMPETITOR_ANALYSIS_LATEST_MANUAL_RESPONSE(company_id),
    );
    return response.data;
}

export const CompetitorAnalysisFindCompetitorsApi = async (company_id: string) => {
    const response = await api.post(
      BUSSINESSENDPOINT.ANALYSIS.COMPETITOR_ANALYSIS_FIND_COMPETITORS,
      { company_id: company_id },
    );
    return response.data;
}

export const DnaApi = async (): Promise<DnaResponseProps> => {
    const response = await api.get(BUSSINESSENDPOINT.DNA);
    return response.data;
}

export const RetryDnaApi = async (): Promise<DnaResponseProps> => {
    const response = await api.post(BUSSINESSENDPOINT.DNA_RETRY);
    return response.data;
}
export const AnalyzeCompanyResultsApi = async (company_id: string) => {
    const response = await api.get<AnalyzeCompanyResponse>(
      BUSSINESSENDPOINT.ANALYZE_COMPANY_RESULTS(company_id),
    );
    return response.data;
}

export const AnalyzeCompanyDashboardApi = async (company_id: string) => {
    const response = await api.get<DashboardResponse>(
      BUSSINESSENDPOINT.ANALYZE_COMPANY_DASHBOARD(company_id),
    );
    return response.data;
}

export const UserProfileApi = async () => {
    const response = await api.get<UserProfileResponse>(BUSSINESSENDPOINT.USER_PROFILE);
    return response.data;
}

export const EditUserProfileApi = async (user_id: string, data: EditProfileRequest) => {
    const response = await api.patch<EditProfileResponse>(BUSSINESSENDPOINT.EDIT_USER_PROFILE(user_id), data);
    return response.data;
}

export const AnalyzeCompanyDashboardDocumentationApi =async (company_id: string) => {
    const response = await api.get<DashboardDocumentationResponse>(
      BUSSINESSENDPOINT.ANALYZE_COMPANY_DASHBOARD_DOCUMENTATION(company_id),
    );
    return response.data;
}

export const GoogleTrendNowApi = async (params?: GoogleTrendQueryParams) => {
    const response = await api.get<GoogleTrendNowResponse>(
      BUSSINESSENDPOINT.TRENDS.GOOGLE_TRENDS_NOW,
      { params: toQueryParams(params) },
    );
    return response.data;
}

export const GoogleTrendTrendingApi = async (params?: GoogleTrendQueryParams) => {
    const response = await api.get<GoogleTrendTrendingResponse>(
      BUSSINESSENDPOINT.TRENDS.GOOGLE_TRENDS_TRENDING,
      { params: toQueryParams(params) },
    );
    return response.data;
}

export const GoogleTrendExploreApi = async (params?: GoogleTrendQueryParams) => {
    const response = await api.get<GoogleTrendExploreResponse>(
      BUSSINESSENDPOINT.TRENDS.GOOGLE_TRENDS_EXPLORE,
      { params: toQueryParams(params) },
    );
    return response.data;
}

export const GoogleTrendFiltersApi = async () => {
    const response = await api.get<GoogleTrendFiltersResponse>(
      BUSSINESSENDPOINT.TRENDS.GOOGLE_TRENDS_FILTERS,
    );
    return response.data;
}

export const ContentRecommendationApi = async (data: ContentRecommendationRequest): Promise<ContentRecommendationResponse> => {
    const response = await api.post(BUSSINESSENDPOINT.RECOMMENDATION.CONTENT_RECOMMENDATION, data);
    return response.data;
}

export const ContentRecommendationResultApi = async (company_id: string): Promise<ContentRecommendationResultResponse> => {
    const response = await api.get(BUSSINESSENDPOINT.RECOMMENDATION.RECOMMENDATION_RESULT(company_id));
    return response.data;
}

export const IntakeApi = async (): Promise<IntakeResponseProps> => {
    const response = await api.get(BUSSINESSENDPOINT.INTAKE);
    return response.data;
}

export const AnswerQuestionApi = async ({ question_id, answer }: AnswerQuestionRequestProps): Promise<IntakeQuestion> => {
    const response = await api.patch(BUSSINESSENDPOINT.INTAKE_QUESTION(question_id), { answer });
    return response.data;
}

export const ScriptGenerationApi = async (data: ScriptGenerationRequest) => {
    const response = await api.post(BUSSINESSENDPOINT.GENERATION.SCRIPT_GENERATION, data);
    return response.data;
}

export const ScriptGenerationResultsByCompanyIdApi = async (
  company_id: string,
  params?: ScriptGenerationResultsParams,
): Promise<ScriptGenerationResultsResponse> => {
    const response = await api.get(
      BUSSINESSENDPOINT.GENERATION.SCRIPT_GENERATION_RESULTS_BY_COMPANY_ID(company_id),
      {
        params: {
          limit: params?.limit,
          offset: params?.offset,
        },
      },
    );
    return response.data;
}

export const ScriptGenerationResultsApi = async (): Promise<ScriptGenerationResultsResponse> => {
    const response = await api.get(BUSSINESSENDPOINT.GENERATION.SCRIPT_GENERATION_RESULTS);
    return response.data;
}

export const ImageGenerationApi = async (
  data: ImageGenerationRequest,
): Promise<ImageGenerationResponse> => {
    const response = await api.post(BUSSINESSENDPOINT.GENERATION.IMAGE_GENERATION, data);
    return response.data;
}

export const CompanyImageGenerationApi = async (
  company_id: string,
): Promise<CompanyImageGenerationResponse> => {
    const response = await api.get(BUSSINESSENDPOINT.GENERATION.COMPANY_IMAGE_GENERATION(company_id));
    return response.data;
}

export const DeleteImageApi = async (company_id: string, image_id: string) => {
    const response = await api.delete(BUSSINESSENDPOINT.GENERATION.DELETE_IMAGE(company_id, image_id));
    return response.data;
}

/** POST /generation/image-generation/schedule — saves (or replaces) the run's schedule. */
export const ScheduleImageGenerationApi = async (
  data: ImageGenerationScheduleRequest,
): Promise<ImageGenerationScheduleResponse> => {
    const response = await api.post(BUSSINESSENDPOINT.GENERATION.IMAGE_GENERATION_SCHEDULE, data);
    return response.data;
}

export const LatestGeneratedImageApi = async (
  company_id: string,
): Promise<LatestGeneratedImageResponse> => {
    const response = await api.get(BUSSINESSENDPOINT.GENERATION.LATEST_GENERATED_IMAGE(company_id));
    return response.data;
}

export const CompanyImageGenerationResultsApi = async (company_id: string): Promise<CompanyImageGenerationResponse> => {
    const response = await api.get(BUSSINESSENDPOINT.GENERATION.COMPANY_IMAGE_GENERATION(company_id));
    return response.data;
}

export const IntelligenceRunApi = async (
  data: IntelligenceRunRequest,
): Promise<IntelligenceRunResponse> => {
    const response = await api.post(BUSSINESSENDPOINT.INTELLIGENCE_RUN, data);
    return response.data;
}

export const IntelligenceJobApi = async (
  job_id: string,
): Promise<IntelligenceJobResponse> => {
    const response = await api.get(BUSSINESSENDPOINT.INTELLIGENCE_JOB(job_id));
    return response.data;
}

export const PlannerResultsApi = async (
  company_id: string,
): Promise<PlannerResultsResponse> => {
    const response = await api.get(BUSSINESSENDPOINT.PLANNER.PLANNER_LATEST_RESPONSE(company_id));
    return response.data;
}

export const PlannerVersionsApi = async (
  company_id: string,
): Promise<PlannerVersionsResponse> => {
    const response = await api.get(BUSSINESSENDPOINT.PLANNER.PLANNER_VERSIONS(company_id));
    return response.data;
}

export const PlannerSpecificVersionsApi = async (
  company_id: string,
  version: string,
): Promise<PlannerResultsResponse> => {
    const response = await api.get(BUSSINESSENDPOINT.PLANNER.PLANNER_SPECIFIC_VERSIONS(company_id, version));
    return response.data;
}

export const CompetitorAnalyticDashboardApi = async (company_id: string) => {
    const response = await api.get(BUSSINESSENDPOINT.ANALYSIS.COMPETITOR_ANALYSIS_COMPETITORS(company_id));
    return response.data;
}

export const KeywordsApi = async (): Promise<KeywordsStatusResponse> => {
    const response = await api.get(BUSSINESSENDPOINT.KEYWORDS);
    return response.data;
}

export const RetryKeywordsApi = async (): Promise<KeywordsStatusResponse> => {
    const response = await api.post(BUSSINESSENDPOINT.KEYWORDS_RETRY);
    return response.data;
}

export const BriefsApi = async (): Promise<BriefListResponse> => {
    const response = await api.get(BUSSINESSENDPOINT.BRIEFS);
    return response.data;
}

export const BlogPostApi = async (brief_id: string): Promise<BlogPost> => {
    const response = await api.post(BUSSINESSENDPOINT.BLOG_POST, { brief_id });
    return response.data;
}

export const BlogPostsApi = async (): Promise<BlogPostListResponse> => {
    const response = await api.get(BUSSINESSENDPOINT.BLOG_POST);
    return response.data;
}

export const BlogPostDetailsApi = async (blog_post_id: string): Promise<BlogPost> => {
    const response = await api.get(BUSSINESSENDPOINT.BLOG_POST_DETAILS(blog_post_id));
    return response.data;
}

export const BlogImageApi = async (blog_post_id: string, body: BlogImageRequest): Promise<BlogPost> => {
    const response = await api.post(BUSSINESSENDPOINT.BLOG_POST_IMAGES(blog_post_id), body);
    return response.data;
}

export const InstagramLoginApi = async (
  context?: string,
): Promise<InstagramAuthorizeResponse> => {
    const response = await api.get(BUSSINESSENDPOINT.CONNECTORS.INSTAGRAM_LOGIN, {
      params: { context },
    });
    return response.data;
}

export const LinkedInLoginApi = async (
  context?: string,
): Promise<InstagramAuthorizeResponse> => {
    const response = await api.get(BUSSINESSENDPOINT.CONNECTORS.LINKEDIN_LOGIN, {
      params: { context },
    });
    return response.data;
}

export const SocialAccountsApi = async (): Promise<SocialAccountsResponse> => {
    const response = await api.get(BUSSINESSENDPOINT.CONNECTORS.SOCIAL_ACCOUNTS);
    return response.data;
}

export const SocialAccountConnectApi = async (
  platform: string,
  context?: string,
): Promise<InstagramAuthorizeResponse> => {
    const response = await api.get(
      BUSSINESSENDPOINT.CONNECTORS.SOCIAL_ACCOUNTS_CONNECT(platform),
      { params: { context } },
    );
    return response.data;
}

export const SocialAccountDisconnectApi = async (platform: string) => {
    const response = await api.delete(
      BUSSINESSENDPOINT.CONNECTORS.SOCIAL_ACCOUNTS_DISCONNECT(platform),
    );
    return response.data;
}

export const InstagramLoginPostApi = async (): Promise<InstagramAuthorizeResponse> => {
  const response = await api.post(BUSSINESSENDPOINT.CONNECTORS.INSTAGRAM_LOGIN);
  return response.data;
}

export const SocialAccountsConnectApi = async (
  platform: string,
): Promise<InstagramAuthorizeResponse> => {
  const response = await api.post(
    BUSSINESSENDPOINT.CONNECTORS.SOCIAL_ACCOUNTS_CONNECT(platform),
  );
  return response.data;
}

export const FacebookConnectApi = async (): Promise<InstagramAuthorizeResponse> => {
  const response = await api.get(BUSSINESSENDPOINT.CONNECTORS.FACEBOOK_CONNECT);
  return response.data;
}

export const FacebookConnectPostApi = async (): Promise<InstagramAuthorizeResponse> => {
  const response = await api.post(BUSSINESSENDPOINT.CONNECTORS.FACEBOOK_CONNECT);
  return response.data;
}

export const InstagramPublishApi = async (
  data: InstagramPublishRequest,
): Promise<InstagramPublishResponse> => {
  const response = await api.post(BUSSINESSENDPOINT.PUBLISH.INSTAGRAM_PUBLISH, data);
  return response.data;
}

export const FacebookPublishApi = async (
  data: FacebookPublishRequest,
): Promise<FacebookPublishResponse> => {
  const response = await api.post(BUSSINESSENDPOINT.PUBLISH.FACEBOOK_PUBLISH, data);
  return response.data;
}

/** LinkedIn post — text | link | image. Auth + company; LinkedIn must have w_member_social. */
export const LinkedInPublishApi = async (
  data: LinkedInPublishRequest,
): Promise<LinkedInPublishResponse> => {
  const response = await api.post(BUSSINESSENDPOINT.PUBLISH.LINKEDIN_PUBLISH, data);
  return response.data;
}

export const XLoginApi = async (
  context?: string,
): Promise<InstagramAuthorizeResponse> => {
  const response = await api.get(BUSSINESSENDPOINT.CONNECTORS.X_LOGIN, {
    params: { context },
  });
  return response.data;
}

/** X post — text and/or image_url. 404 = X not connected, 502 = readable upstream error. */
export const XPublishApi = async (data: XPublishRequest): Promise<XPublishResponse> => {
  const response = await api.post(BUSSINESSENDPOINT.PUBLISH.X_PUBLISH, data);
  return response.data;
}

export const ContentExecutionSettingsApi = async (): Promise<ContentExecutionSettingsResponse> => {
  const response = await api.get(BUSSINESSENDPOINT.CONTENT_EXECUTION.SETTINGS);
  return response.data;
}

export const UpdateContentExecutionSettingsApi = async (
  data: ContentExecutionSettingsRequest,
): Promise<ContentExecutionSettingsResponse> => {
  const response = await api.put(BUSSINESSENDPOINT.CONTENT_EXECUTION.SETTINGS, data);
  return response.data;
}

/** Agent mode toggle — gates the content orchestrator. */
export const ContentExecutionAgentModeApi = async (): Promise<ContentExecutionAgentModeResponse> => {
  const response = await api.get(BUSSINESSENDPOINT.CONTENT_EXECUTION.AGENT_MODE);
  return response.data;
}

export const UpdateContentExecutionAgentModeApi = async (
  data: ContentExecutionAgentModeRequest,
): Promise<ContentExecutionAgentModeResponse> => {
  const response = await api.put(BUSSINESSENDPOINT.CONTENT_EXECUTION.AGENT_MODE, data);
  return response.data;
}

export const ContentExecutionDailyApi = async (): Promise<ContentExecutionDailyResponse> => {
  const response = await api.post(BUSSINESSENDPOINT.CONTENT_EXECUTION.DAILY);
  return response.data;
}

export const ContentExecutionRunApi = async (
  data?: ContentExecutionRunRequest,
): Promise<ContentExecutionRunResponse> => {
  const response = await api.post(BUSSINESSENDPOINT.CONTENT_EXECUTION.RUN, data ?? {});
  return response.data;
}

export const ContentExecutionItemsApi = async (params?: {
  date?: string;
  status?: string;
  platform?: string;
}): Promise<ContentExecutionItemsResponse> => {
  const response = await api.get(BUSSINESSENDPOINT.CONTENT_EXECUTION.ITEMS, {
    params,
  });
  return response.data;
}

export const ContentExecutionRunsApi = async (params?: {
  limit?: number;
  status?: string;
}): Promise<ContentExecutionRunsResponse> => {
  const response = await api.get(BUSSINESSENDPOINT.CONTENT_EXECUTION.RUNS, {
    params,
  });
  return response.data;
}

export const InstagramProfileIdApi = async (
  params: InstagramProfileIdRequest,
): Promise<InstagramProfileIdResponse> => {
  const response = await api.get(BUSSINESSENDPOINT.INSTAGRAM.PROFILE_ID, {
    params: { username: params.username },
  });
  return response.data;
}


export const InstagramProfileInfoApi = async (
  params: InstagramProfileInfoRequest,
): Promise<InstagramProfileInfoResponse> => {
  const response = await api.get(BUSSINESSENDPOINT.INSTAGRAM.PROFILE_INFO, {
    params: { username: params.username },
  });
  return response.data;
}


export const InstagramPostEngagementApi = async (
  params: InstagramPostEngagementRequest,
): Promise<InstagramPostEngagementResponse> => {
  const response = await api.get(BUSSINESSENDPOINT.INSTAGRAM.POST_ENGAGEMENT, {
    params: {
      username: params.username,
      post_url: params.post_url,
    },
  });
  return response.data;
}


export const InstagramProfileContentApi = async (
  params: InstagramProfileContentRequest,
): Promise<InstagramProfileContentResponse> => {
  const response = await api.get(BUSSINESSENDPOINT.INSTAGRAM.PROFILE_CONTENT, {
    params: {
      username: params.username,
    },
  });
  return response.data;
};

export const InstagramProfileReachApi = async (account_id: string) => {
  const response = await api.get(
    BUSSINESSENDPOINT.INSTAGRAM.PROFILE_REACH(account_id),
  );
  return response.data;
};

export const InstagramProfileInteractionsApi = async (account_id: string) => {
  const response = await api.get(
    BUSSINESSENDPOINT.INSTAGRAM.PROFILE_INTERACTIONS(account_id),
  );
  return response.data;
};

export const InstagramProfileDemographicsApi = async (
  account_id: string,
  audience: "followers" | "engaged-audience" = "followers",
) => {
  const response = await api.get(
    BUSSINESSENDPOINT.INSTAGRAM.PROFILE_DEMOGRAPHICS(account_id, audience),
  );
  return response.data;
};

export const InstagramProfileFollowsApi = async (account_id: string) => {
  const response = await api.get(
    BUSSINESSENDPOINT.INSTAGRAM.PROFILE_FOLLOWS(account_id),
  );
  return response.data;
};

export const InstagramProfileViewsApi = async (account_id: string) => {
  const response = await api.get(
    BUSSINESSENDPOINT.INSTAGRAM.PROFILE_VIEWS(account_id),
  );
  return response.data;
};

export const InstagramProfileActionsApi = async (account_id: string) => {
  const response = await api.get(
    BUSSINESSENDPOINT.INSTAGRAM.PROFILE_ACTIONS(account_id),
  );
  return response.data;
};

export const InstagramProfileStoriesApi = async (account_id: string) => {
  const response = await api.get(
    BUSSINESSENDPOINT.INSTAGRAM.PROFILE_STORIES(account_id),
  );
  return response.data;
};

export const InstagramLiveStreamApi = async (account_id: string) => {
  const response = await api.get(
    BUSSINESSENDPOINT.INSTAGRAM.LIVE_STREAM(account_id),
  );
  return response.data;
};  


export const FacebookProfileContentApi = async (
  params: SocialProfileContentRequest = {},
): Promise<SocialProfileContentResponse> => {
  const response = await api.get(BUSSINESSENDPOINT.FACEBOOK.PROFILE_CONTENT, {
    params: {
      media_limit: params.media_limit ?? 25,
    },
  });
  return response.data;
};

export const LinkedInProfileContentApi = async (
  params: SocialProfileContentRequest = {},
): Promise<SocialProfileContentResponse> => {
  const response = await api.get(BUSSINESSENDPOINT.LINKEDIN.PROFILE_CONTENT, {
    params: {
      media_limit: params.media_limit ?? 25,
    },
  });
  return response.data;
};


export const CreateGoalApi = async (
  data: CreateGoalRequest,
): Promise<CreateGoalResponse> => {
  const response = await api.post(BUSSINESSENDPOINT.GOAL.CREATE_GOAL, data);
  return response.data;
};

export const CompanyGoalsApi = async (): Promise<GoalListResponse> => {
  const response = await api.get(BUSSINESSENDPOINT.GOAL.COMPANY_GOALS);
  const data = response.data;
  if (Array.isArray(data)) return data;
  return data?.goals ?? data?.data ?? [];
};

export const GoalByIdApi = async (goal_id: string): Promise<GoalDetailResponse> => {
  const response = await api.get(BUSSINESSENDPOINT.GOAL.GOAL_BY_ID(goal_id));
  return response.data;
};

export const DiagnoseGoalApi = async (goal_id: string): Promise<DiagnoseGoalResponse> => {
  const response = await api.post(BUSSINESSENDPOINT.GOAL.DIAGNOSE(goal_id));
  return response.data;
};

export const ApproveGoalApi = async (goal_id: string): Promise<GoalDetailResponse> => {
  const response = await api.post(BUSSINESSENDPOINT.GOAL.APPROVE(goal_id));
  return response.data;
};

export const UpdateGoalTaskApi = async ({
  goal_id,
  task_id,
  status,
}: UpdateGoalTaskRequest): Promise<GoalTask> => {
  const response = await api.patch(BUSSINESSENDPOINT.GOAL.TASK(goal_id, task_id), { status });
  return response.data;
};
export const GoalProgressApi = async (goal_id: string): Promise<GoalProgressResponse> => {
  const response = await api.get(BUSSINESSENDPOINT.GOAL.PROGRESS(goal_id));
  return response.data;
};

export const GoalLessonsApi = async (): Promise<GoalLessonsResponse> => {
  const response = await api.get(BUSSINESSENDPOINT.GOAL.LESSONS);
  return response.data;
};

export const GoogleAnalyticsConnectionApi = async (): Promise<GoogleAnalyticsConnection> => {
  const response = await api.get(BUSSINESSENDPOINT.GOOGLE_ANALYTICS.CONNECTION);
  return response.data;
};

export const GoogleAnalyticsConnectApi = async (
  context?: string,
): Promise<{ authorize_url: string }> => {
  const response = await api.get(BUSSINESSENDPOINT.GOOGLE_ANALYTICS.CONNECT, {
    params: { context },
  });
  return response.data;
};

export const GoogleAnalyticsPropertiesApi = async (): Promise<GoogleAnalyticsPropertyList> => {
  const response = await api.get(BUSSINESSENDPOINT.GOOGLE_ANALYTICS.PROPERTIES);
  return response.data;
};

export const GoogleAnalyticsSelectPropertyApi = async (
  property_id: string,
): Promise<GoogleAnalyticsConnection> => {
  const response = await api.put(BUSSINESSENDPOINT.GOOGLE_ANALYTICS.PROPERTY, { property_id });
  return response.data;
};

export const GoogleAnalyticsOverviewApi = async (days = 28): Promise<GoogleAnalyticsOverview> => {
  const response = await api.get(BUSSINESSENDPOINT.GOOGLE_ANALYTICS.OVERVIEW, { params: { days } });
  return response.data;
};

export const GoogleAnalyticsDisconnectApi = async (): Promise<void> => {
  await api.delete(BUSSINESSENDPOINT.GOOGLE_ANALYTICS.DISCONNECT);
};

export const SearchConsoleConnectionApi = async (): Promise<SearchConsoleConnection> => {
  const response = await api.get(BUSSINESSENDPOINT.SEARCH_CONSOLE.CONNECTION);
  return response.data;
};

export const SearchConsoleConnectApi = async (
  context?: string,
): Promise<{ authorize_url: string }> => {
  const response = await api.get(BUSSINESSENDPOINT.SEARCH_CONSOLE.CONNECT, {
    params: { context },
  });
  return response.data;
};

export const SearchConsoleSitesApi = async (): Promise<{ items: SearchConsoleSite[] }> => {
  const response = await api.get(BUSSINESSENDPOINT.SEARCH_CONSOLE.SITES);
  return response.data;
};

export const SearchConsoleSelectSiteApi = async (site_url: string): Promise<SearchConsoleConnection> => {
  const response = await api.put(BUSSINESSENDPOINT.SEARCH_CONSOLE.SITE, { site_url });
  return response.data;
};

export const SearchConsoleOverviewApi = async (days = 28): Promise<SearchConsoleOverview> => {
  const response = await api.get(BUSSINESSENDPOINT.SEARCH_CONSOLE.OVERVIEW, { params: { days } });
  return response.data;
};

export const SearchConsoleSitemapsApi = async (): Promise<{ site_url: string; items: Sitemap[] }> => {
  const response = await api.get(BUSSINESSENDPOINT.SEARCH_CONSOLE.SITEMAPS);
  return response.data;
};

export const SearchConsoleInspectApi = async (url: string): Promise<UrlInspection> => {
  const response = await api.post(BUSSINESSENDPOINT.SEARCH_CONSOLE.INSPECT, { url });
  return response.data;
};

export const SearchConsoleIndexCheckApi = async (): Promise<IndexCheck> => {
  const response = await api.get(BUSSINESSENDPOINT.SEARCH_CONSOLE.INDEX_CHECK);
  return response.data;
};

export const SearchConsoleDisconnectApi = async (): Promise<void> => {
  await api.delete(BUSSINESSENDPOINT.SEARCH_CONSOLE.DISCONNECT);
};

export const DeleteGoalApi = async (goal_id: string): Promise<void> => {
  await api.delete(BUSSINESSENDPOINT.GOAL.GOAL_BY_ID(goal_id));
};

export const GoalPlanApi = async (goal_id: string): Promise<GoalPlanResponse> => {
  const response = await api.get(BUSSINESSENDPOINT.GOAL.PLAN(goal_id));
  return response.data;
};

export const PauseGoalApi = async (goal_id: string): Promise<Goal> => {
  const response = await api.post(BUSSINESSENDPOINT.GOAL.PAUSE(goal_id));
  return response.data;
};

export const ResumeGoalApi = async (goal_id: string): Promise<Goal> => {
  const response = await api.post(BUSSINESSENDPOINT.GOAL.RESUME(goal_id));
  return response.data;
};

export const GoalsByCompanyApi = async (company_id: string): Promise<GoalListResponse> => {
  const response = await api.get(BUSSINESSENDPOINT.GOAL.GOALS_BY_COMPANY(company_id));
  const data = response.data;
  // Accept a bare array or a { goals } / { data } / { items } wrapper.
  if (Array.isArray(data)) return data;
  return data?.goals ?? data?.data ?? data?.items ?? [];
};

const unwrapScheduledPosts = (data: unknown): ScheduledPost[] => {
  // Accept a bare array or a { scheduled_posts } / { items } / { data } wrapper.
  if (Array.isArray(data)) return data;
  const wrapped = data as { scheduled_posts?: ScheduledPost[]; items?: ScheduledPost[]; data?: ScheduledPost[] } | null;
  return wrapped?.scheduled_posts ?? wrapped?.items ?? wrapped?.data ?? [];
};

export const ScheduledPostsApi = async (status?: ScheduledPostStatus): Promise<ScheduledPost[]> => {
  const response = await api.get(BUSSINESSENDPOINT.SCHEDULED_POSTS.LIST, {
    params: status ? { status } : undefined,
  });
  return unwrapScheduledPosts(response.data);
};

export const ScheduledPostApi = async (post_id: string): Promise<ScheduledPost> => {
  const response = await api.get(BUSSINESSENDPOINT.SCHEDULED_POSTS.BY_ID(post_id));
  return response.data;
};

export const CreateScheduledPostApi = async (
  body: CreateScheduledPostRequest,
  onProgress?: (percent: number) => void,
): Promise<ScheduledPost> => {
  const formData = new FormData();
  if (body.file) formData.append("file", body.file);
  body.platforms.forEach((platform) => formData.append("platforms", platform));
  formData.append("scheduled_at", body.scheduled_at);
  if (body.caption) formData.append("caption", body.caption);
  if (body.generation_id) formData.append("generation_id", body.generation_id);
  const response = await api.post(BUSSINESSENDPOINT.SCHEDULED_POSTS.CREATE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) => {
      if (onProgress && event.total) onProgress(Math.round((event.loaded / event.total) * 100));
    },
  });
  return response.data;
};

export const UpdateScheduledPostApi = async (
  post_id: string,
  body: UpdateScheduledPostRequest,
): Promise<ScheduledPost> => {
  const response = await api.patch(BUSSINESSENDPOINT.SCHEDULED_POSTS.BY_ID(post_id), body);
  return response.data;
};

export const CancelScheduledPostApi = async (post_id: string): Promise<ScheduledPost> => {
  const response = await api.post(BUSSINESSENDPOINT.SCHEDULED_POSTS.CANCEL(post_id));
  return response.data;
};

export const DeleteScheduledPostApi = async (post_id: string): Promise<void> => {
  await api.delete(BUSSINESSENDPOINT.SCHEDULED_POSTS.BY_ID(post_id));
};

export const CreateTextPostApi = async (body: CreateTextPostRequest): Promise<TextPost> => {
  const response = await api.post(BUSSINESSENDPOINT.GENERATION.TEXT_POST, body);
  return unwrapTextPost(response.data);
};

export const CompanyTextPostsApi = async (company_id: string): Promise<TextPost[]> => {
  const response = await api.get(BUSSINESSENDPOINT.GENERATION.COMPANY_TEXT_POSTS(company_id));
  return unwrapTextPosts(response.data);
};

export const NewsApi = async (params?: NewsParams): Promise<NewsResponse> => {
  const topic = params?.topic?.trim();
  const response = await api.get(BUSSINESSENDPOINT.NEWS, {
    params: { ...(topic ? { topic } : {}), ...(params?.size ? { size: params.size } : {}) },
  });
  return response.data;
};


export const FindCompetitorApi = async (company_id: string) => {
  const response = await api.post(BUSSINESSENDPOINT.ANALYSIS.COMPETITOR_ANALYSIS_FIND_COMPETITORS, {
    company_id,
  });
  return response.data;
}

// ---------- Prospect finder ----------

/** The 202 from POST /prospects/runs may name the id `run_id`; keep `id` everywhere else. */
const normalizeRun = (data: ProspectRun & { run_id?: string }): ProspectRun => ({
  ...data,
  id: data.id ?? data.run_id ?? "",
});

const unwrapList = <T>(data: unknown, key: string): T[] => {
  // Accept a bare array or a { [key] } / { items } / { data } wrapper.
  if (Array.isArray(data)) return data;
  const wrapped = data as Record<string, T[] | undefined> | null;
  return wrapped?.[key] ?? wrapped?.items ?? wrapped?.data ?? [];
};

/** Builds 2–3 profiles from the DNA. Slow (10–40 s). */
export const BuildProspectIcpApi = async (body?: BuildIcpRequest): Promise<IcpResponse> => {
  const response = await api.post(BUSSINESSENDPOINT.PROSPECTS.ICP, body ?? {});
  return response.data;
};

export const ProspectIcpApi = async (): Promise<IcpResponse> => {
  const response = await api.get(BUSSINESSENDPOINT.PROSPECTS.ICP);
  return response.data;
};

export const UpdateProspectIcpApi = async (body: UpdateIcpRequest): Promise<IcpResponse> => {
  const response = await api.put(BUSSINESSENDPOINT.PROSPECTS.ICP, body);
  return response.data;
};

/** Starts a search in the background (202); poll ProspectRunApi until it's ready or failed. */
export const StartProspectRunApi = async (body?: StartProspectRunRequest): Promise<ProspectRun> => {
  const response = await api.post(BUSSINESSENDPOINT.PROSPECTS.RUNS, body ?? {});
  return normalizeRun(response.data);
};

export const ProspectRunsApi = async (): Promise<ProspectRun[]> => {
  const response = await api.get(BUSSINESSENDPOINT.PROSPECTS.RUNS);
  return unwrapList<ProspectRun>(response.data, "runs").map(normalizeRun);
};

export const ProspectRunApi = async (run_id: string): Promise<ProspectRun> => {
  const response = await api.get(BUSSINESSENDPOINT.PROSPECTS.RUN_BY_ID(run_id));
  return normalizeRun(response.data);
};

/** The shortlist, best first. */
export const ProspectsApi = async (params?: ProspectsParams): Promise<Prospect[]> => {
  const response = await api.get(BUSSINESSENDPOINT.PROSPECTS.LIST, {
    params: {
      ...(params?.run_id ? { run_id: params.run_id } : {}),
      ...(params?.status ? { status: params.status } : {}),
    },
  });
  return unwrapList<Prospect>(response.data, "prospects");
};

/** One prospect with its people, brief and drafts. */
export const ProspectApi = async (prospect_id: string): Promise<Prospect> => {
  const response = await api.get(BUSSINESSENDPOINT.PROSPECTS.BY_ID(prospect_id));
  return response.data;
};

/** Saves the prospect, then verifies emails and writes the brief and drafts in the background. */
export const SaveProspectApi = async (prospect_id: string): Promise<Prospect> => {
  const response = await api.post(BUSSINESSENDPOINT.PROSPECTS.SAVE(prospect_id));
  return response.data;
};

export const UpdateProspectStatusApi = async (
  prospect_id: string,
  body: UpdateProspectStatusRequest,
): Promise<Prospect> => {
  const response = await api.patch(BUSSINESSENDPOINT.PROSPECTS.STATUS(prospect_id), body);
  return response.data;
};

/** Writes the drafts again, for one person when `person_id` is given. */
export const RegenerateProspectDraftsApi = async (prospect_id: string, person_id?: string): Promise<Prospect> => {
  const response = await api.post(BUSSINESSENDPOINT.PROSPECTS.DRAFTS(prospect_id), undefined, {
    params: person_id ? { person_id } : undefined,
  });
  return response.data;
};

/** The saved prospects as a CSV file. */
export const ExportProspectsCsvApi = async (): Promise<Blob> => {
  const response = await api.get(BUSSINESSENDPOINT.PROSPECTS.EXPORT_CSV, { responseType: "blob" });
  return response.data;
};

// ---------- LinkedIn growth ----------

/** Judges the 12 checklist items and saves the result. */
export const RunProfileScoreApi = async (body?: ProfileScoreRequest): Promise<ProfileScore> => {
  const response = await api.post(BUSSINESSENDPOINT.LINKEDIN_GROWTH.PROFILE_SCORE, body ?? {});
  return response.data;
};

/** The latest profile score. */
export const ProfileScoreApi = async (): Promise<ProfileScore> => {
  const response = await api.get(BUSSINESSENDPOINT.LINKEDIN_GROWTH.PROFILE_SCORE);
  return response.data;
};

export const ProfileScoreHistoryApi = async (): Promise<ProfileScore[]> => {
  const response = await api.get(BUSSINESSENDPOINT.LINKEDIN_GROWTH.PROFILE_SCORE_HISTORY);
  return unwrapList<ProfileScore>(response.data, "history");
};

/** 3 headline and 2–3 About options, from the last-scored profile. */
export const ProfileRewriteApi = async (): Promise<ProfileRewrite> => {
  const response = await api.post(BUSSINESSENDPOINT.LINKEDIN_GROWTH.PROFILE_REWRITE);
  return response.data;
};

/** Tone, stories, hooks, formats and top posts; `ready` is false until the story bank has posts. */
export const LinkedInVoiceApi = async (): Promise<LinkedInVoice> => {
  const response = await api.get(BUSSINESSENDPOINT.LINKEDIN_GROWTH.VOICE);
  return response.data;
};

/** Builds the 3 posts for the first week. */
export const GenerateWeekPostsApi = async (): Promise<WeekPostsResponse> => {
  const response = await api.post(BUSSINESSENDPOINT.LINKEDIN_GROWTH.WEEK_POSTS);
  return { posts: unwrapList<WeekPost>(response.data, "posts") };
};

export const WeekPostsApi = async (): Promise<WeekPostsResponse> => {
  const response = await api.get(BUSSINESSENDPOINT.LINKEDIN_GROWTH.WEEK_POSTS);
  return { posts: unwrapList<WeekPost>(response.data, "posts") };
};

/** Schedules a post, optionally with edited text. It's published once and never retried. */
export const ScheduleWeekPostApi = async (post_id: string, body: ScheduleWeekPostRequest): Promise<WeekPost> => {
  const response = await api.post(BUSSINESSENDPOINT.LINKEDIN_GROWTH.WEEK_POST_SCHEDULE(post_id), body);
  return response.data;
};

export const CancelWeekPostApi = async (post_id: string): Promise<WeekPost> => {
  const response = await api.post(BUSSINESSENDPOINT.LINKEDIN_GROWTH.WEEK_POST_CANCEL(post_id));
  return response.data;
};

/** Scores profile, posting, engagement and network (25 each) and saves it. */
export const RunLinkedInScoreApi = async (): Promise<LinkedInScore> => {
  const response = await api.post(BUSSINESSENDPOINT.LINKEDIN_GROWTH.SCORE);
  return response.data;
};

export const LinkedInScoreApi = async (): Promise<LinkedInScore> => {
  const response = await api.get(BUSSINESSENDPOINT.LINKEDIN_GROWTH.SCORE);
  return response.data;
};

/** Every saved score, for the growth chart. */
export const LinkedInScoreHistoryApi = async (): Promise<LinkedInScore[]> => {
  const response = await api.get(BUSSINESSENDPOINT.LINKEDIN_GROWTH.SCORE_HISTORY);
  return unwrapList<LinkedInScore>(response.data, "history");
};

// ---------- LinkedIn coach ----------

/** Today's checklist. Built once a day; the first call of the day can take up to a minute. */
export const CoachTodayApi = async (): Promise<CoachToday> => {
  const response = await api.get(BUSSINESSENDPOINT.LINKEDIN_COACH.TODAY);
  return response.data;
};

export const CompleteCoachTaskApi = async (task_id: string): Promise<CoachToday> => {
  const response = await api.post(BUSSINESSENDPOINT.LINKEDIN_COACH.TASK_DONE(task_id));
  return response.data;
};

export const UndoCoachTaskApi = async (task_id: string): Promise<CoachToday> => {
  const response = await api.post(BUSSINESSENDPOINT.LINKEDIN_COACH.TASK_UNDO(task_id));
  return response.data;
};

export const FollowUpsApi = async (): Promise<FollowUp[]> => {
  const response = await api.get(BUSSINESSENDPOINT.LINKEDIN_COACH.FOLLOW_UPS);
  return unwrapList<FollowUp>(response.data, "follow_ups");
};

/** Adds someone who accepted your request or commented; a reply is drafted for them. */
export const AddFollowUpApi = async (body: AddFollowUpRequest): Promise<FollowUp> => {
  const response = await api.post(BUSSINESSENDPOINT.LINKEDIN_COACH.FOLLOW_UPS, body);
  return response.data;
};

export const CompleteFollowUpApi = async (follow_up_id: string): Promise<FollowUp> => {
  const response = await api.post(BUSSINESSENDPOINT.LINKEDIN_COACH.FOLLOW_UP_DONE(follow_up_id));
  return response.data;
};

/** This week's report, worked out from saved data. */
export const WeeklyReportApi = async (): Promise<WeeklyReport> => {
  const response = await api.get(BUSSINESSENDPOINT.LINKEDIN_COACH.WEEKLY_REPORT);
  return response.data;
};

export const WeeklyReportHistoryApi = async (): Promise<WeeklyReport[]> => {
  const response = await api.get(BUSSINESSENDPOINT.LINKEDIN_COACH.WEEKLY_REPORT_HISTORY);
  return unwrapList<WeeklyReport>(response.data, "reports");
};

/** 3–5 posts for next week around a goal. */
export const ContentPlanApi = async (goal: ContentPlanGoal): Promise<ContentPlan> => {
  const response = await api.post(BUSSINESSENDPOINT.LINKEDIN_COACH.CONTENT_PLAN, { goal });
  return response.data;
};

/** Slides in your voice, rendered as images. */
export const CarouselApi = async (body: CarouselRequest): Promise<Carousel> => {
  const response = await api.post(BUSSINESSENDPOINT.LINKEDIN_COACH.CAROUSEL, body);
  return response.data;
};

export const PublishCarouselApi = async (body: PublishCarouselRequest) => {
  const response = await api.post(BUSSINESSENDPOINT.LINKEDIN_COACH.PUBLISH_CAROUSEL, body);
  return response.data;
};

/** Your top post as a new angle and a follow-up, saved as drafts. */
export const RepurposeApi = async (): Promise<RepurposeResponse> => {
  const response = await api.post(BUSSINESSENDPOINT.LINKEDIN_COACH.REPURPOSE);
  return { drafts: unwrapList<CoachDraft>(response.data, "drafts") };
};

/** Removes the AI-written feel, scores the first line and lints the post. */
export const PostCheckApi = async (body: PostCheckRequest): Promise<PostCheckResponse> => {
  const response = await api.post(BUSSINESSENDPOINT.LINKEDIN_COACH.POST_CHECK, body);
  return response.data;
};

/** One post from a brief, saved as a draft. */
export const WritePostApi = async (body: WritePostRequest): Promise<CoachDraft> => {
  const response = await api.post(BUSSINESSENDPOINT.LINKEDIN_COACH.WRITE_POST, body);
  return response.data;
};

export const HookFormulasApi = async (): Promise<HookFormula[]> => {
  const response = await api.get(BUSSINESSENDPOINT.LINKEDIN_COACH.HOOK_FORMULAS);
  return unwrapList<HookFormula>(response.data, "formulas");
};
