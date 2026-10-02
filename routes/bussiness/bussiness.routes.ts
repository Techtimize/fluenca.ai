import { BUSSINESSENDPOINT } from "./Bussiness-Endpoint";
import api from "../apiClient";
import { AnalyzeCompanyRequest, AnalyzeCompanyResponse } from "@/types/bussiness/onboarding-type";
import { SocialGrowthResponse } from "@/types/bussiness/socail-growth-type";
import { CompetitorAnalysisRequest, CompetitorAnalysisResponse } from "@/types/bussiness/competitoranalysis-type";import { OnboardingRequestProps, OnboardingResponseProps } from "@/types/onboarding-type";
import { BuisnessNicheTrendResponse, NicheTrendsRequest } from "@/types/bussiness/neche_trends";


export const WaitlistApi = async (email: string) => {
    const response = await api.post(BUSSINESSENDPOINT.WAITLIST, { email: email });
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

export const CompetitorAnalysisApi = async (data: CompetitorAnalysisRequest) => {
    const response = await api.post<CompetitorAnalysisResponse>(BUSSINESSENDPOINT.COMPETITOR_ANALYSIS, data);
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
