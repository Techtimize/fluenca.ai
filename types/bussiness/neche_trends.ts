export interface NicheTrendsRequest {
  company_data: string;
  region: string;
  instausername: string;
  linkedinusername: string;
  competitors: string[];
  competitor_limit: number;
  post_limit: number;
  request_delay_seconds: number;
  min_engagement_rate: number;
  include_web_trends: boolean;
}

export interface BuisnessNicheTrendResponse {
    message: string;
    success: boolean;
}