export interface ContentRecommendationRequest {
  company_id: string;
}

export interface ContentRecommendationResponse {
  success: boolean;
  message?: string;
}

export type ContentRecommendationResultResponse = Record<string, unknown>;
