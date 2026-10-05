export interface ContentRecommendationRequest {
  company_id: string;
}

export interface ContentRecommendationResponse {
  success: boolean;
  message?: string;
}

// GET /contentRecommendation/results/{company_id}: shape not documented by the backend yet.
export type ContentRecommendationResultResponse = Record<string, unknown>;
