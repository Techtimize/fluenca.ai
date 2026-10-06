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

export type IntelligenceStepStatus = "pending" | "running" | "completed" | "failed" | "skipped";

export type IntelligenceStepName =
  | "analyze_company"
  | "discover_competitors"
  | "competitor_analysis"
  | "planner"
  | "content_recommendation"
  | "script_generation";

export interface IntelligenceJobStep {
  name: IntelligenceStepName | string;
  status: IntelligenceStepStatus | string;
  started_at: string | null;
  finished_at: string | null;
  duration_sec: number | null;
  error: string | null;
  success: boolean | null;
  // Shape depends on the step; analyze_company returns { company, meta, ... }.
  result: Record<string, unknown> | null;
  get_url: string;
}

export interface IntelligenceJobOptions {
  company_id: string;
  company_data: string | null;
  platforms: string[];
  competitor_limit: number | null;
  post_limit: number | null;
  plan_days: number;
  calendar_days: number;
  idea_count: number | null;
  script_count: number;
  skip_steps: string[] | null;
}

// GET /intelligence/jobs/{job_id}. An unknown job returns 404 with { detail }.
export interface IntelligenceJobResponse {
  success?: boolean;
  message?: string;
  job_id: string;
  status: "pending" | "running" | "completed" | "failed" | string;
  created_at: string;
  updated_at: string;
  company_id: string;
  company_name: string | null;
  current_step: IntelligenceStepName | string | null;
  error: string | null;
  elapsed_sec: number | null;
  steps: Record<string, IntelligenceJobStep>;
  results: Record<string, unknown>;
  pages: Record<string, string>;
  options: IntelligenceJobOptions;
}
