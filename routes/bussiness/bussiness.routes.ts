import { BUSSINESSENDPOINT } from "./Bussiness-Endpoint";
import api from "../apiClient";
import { AnalyzeCompanyRequest, AnalyzeCompanyResponse } from "@/types/bussiness/onboarding-type";
import { SocialGrowthResponse } from "@/types/bussiness/socail-growth-type";
import { CompetitorAnalysisRequest, CompetitorAnalysisResponse } from "@/types/bussiness/competitoranalysis-type";import { OnboardingRequestProps, OnboardingResponseProps } from "@/types/onboarding-type";
import { DnaResponseProps } from "@/types/bussiness/dna-type";


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

export const DnaApi = async (): Promise<DnaResponseProps> => {
    const response = await api.get(BUSSINESSENDPOINT.DNA);
    return response.data;
}

export const RetryDnaApi = async (): Promise<DnaResponseProps> => {
    const response = await api.post(BUSSINESSENDPOINT.DNA_RETRY);
    return response.data;
}
