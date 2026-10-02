import { BUSSINESSENDPOINT } from "./Bussiness-Endpoint";
import api from "../apiClient";
import { AnalyzeCompanyRequest, AnalyzeCompanyResponse } from "@/types/bussiness/analyzecompany-type";
import { SocialGrowthResponse } from "@/types/bussiness/socail-growth-type";
import { CompetitorAnalysisRequest, CompetitorAnalysisResponse, CompetitorsListResponse } from "@/types/bussiness/competitoranalysis-type";
import { OnboardingRequestProps, OnboardingResponseProps } from "@/types/onboarding-type";
import { DnaResponseProps } from "@/types/bussiness/dna-type";
import type {
  GoogleTrendExploreResponse,
  GoogleTrendFiltersResponse,
  GoogleTrendNowResponse,
  GoogleTrendQueryParams,
  GoogleTrendTrendingResponse,
} from "@/types/bussiness/google-trends-type";

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
      BUSSINESSENDPOINT.COMPETITOR_ANALYSIS,
      data,
    );
    return response.data;
}

export const CompetitorAnalysisCompetitorApi = async (company_id: string) => {
    const response = await api.get<CompetitorsListResponse>(
      BUSSINESSENDPOINT.COMPETITOR_ANALYSIS_COMPETITOR(company_id),
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

export const NicheTrendApi = async (data: NicheTrendsRequest) => {
    const response = await api.post<BuisnessNicheTrendResponse>(BUSSINESSENDPOINT.NICHE_TREND, data);
    return response.data;
}

export const ContentRecommendationApi = async (prompt: string) => {
    const response = await api.post(BUSSINESSENDPOINT.CONTENT_RECOMMENDATION, {prompt: prompt});
    return response.data;
}
