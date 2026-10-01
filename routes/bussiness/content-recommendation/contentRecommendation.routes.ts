import { BUSSINESSENDPOINT } from "../Bussiness-Endpoint";
import api from "../../apiClient";
import {
    ContentRecommendationRequest,
    ContentRecommendationResponse,
    ContentRecommendationResultResponse,
} from "@/types/bussiness/content-recommendation-type";


export const ContentRecommendationApi = async (data: ContentRecommendationRequest): Promise<ContentRecommendationResponse> => {
    const response = await api.post(BUSSINESSENDPOINT.RECOMMENDATION.CONTENT_RECOMMENDATION, data);
    return response.data;
}

export const ContentRecommendationResultApi = async (company_id: string): Promise<ContentRecommendationResultResponse> => {
    const response = await api.get(BUSSINESSENDPOINT.RECOMMENDATION.RECOMMENDATION_RESULT(company_id));
    return response.data;
}
