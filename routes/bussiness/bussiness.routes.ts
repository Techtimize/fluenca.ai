import { BUSSINESSENDPOINT } from "./Bussiness-Endpoint";
import api from "../apiClient";
import { AnalyzeCompanyRequest, AnalyzeCompanyResponse } from "@/types/bussiness/analyzecompany-type";
import { SocialGrowthResponse } from "@/types/bussiness/socail-growth-type";
import type { DashboardResponse } from "@/types/bussiness/dashboard-type";
import {
  CompetitorAnalysisJobResponse,
  CompetitorAnalysisManualRequest,
  CompetitorAnalysisRequest,
  CompetitorAnalysisResponse,
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
import { ContentRecommendationRequest, ContentRecommendationResponse, ContentRecommendationResultResponse } from "@/types/bussiness/content-recommendation-type";
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
  LatestGeneratedImageResponse,
} from "@/types/bussiness/imagegeneration-type";
import { IntelligenceJobResponse, IntelligenceRunRequest, IntelligenceRunResponse } from "@/types/bussiness/intelligence-type";
import type { PlannerResultsResponse, PlannerVersionsResponse } from "@/types/bussiness/planner-type";

function toQueryParams(params?: GoogleTrendQueryParams) {
  if (!params) return undefined;
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== "",
  );
  return entries.length ? Object.fromEntries(entries) : undefined;
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

export const SocialGrowthApi = async (prompt: string) => {
    const response = await api.post<SocialGrowthResponse>(BUSSINESSENDPOINT.GROWTH, { prompt: prompt });
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

export const CompleteIntakeApi = async (): Promise<IntakeResponseProps> => {
    const response = await api.post(BUSSINESSENDPOINT.INTAKE_COMPLETE);
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

export const BlogPostApi = async (brief_id: string) => {
    const response = await api.post(BUSSINESSENDPOINT.BLOG_POST, { params: { brief_id: brief_id } });
    return response.data;
}

export const BlogPostDetailsApi = async (blog_post_id: string) => {
    const response = await api.get(BUSSINESSENDPOINT.BLOG_POST_DETAILS(blog_post_id));
    return response.data;
}

