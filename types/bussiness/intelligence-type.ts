export interface IntelligenceRunRequest {
  company_id: string;
  platforms: string[];
  script_count: number;
}

export interface IntelligenceRunResponse {
  success?: boolean;
  message?: string;
  error?: string | null;
  job_id?: string;
  status?: string;
  company_id?: string;
}

export interface IntelligenceJobResponse {
  success?: boolean;
  message?: string;
  error?: string | null;
  job_id?: string;
  company_id?: string;
  status?: string;
  result?: unknown;
  [key: string]: unknown;
}
