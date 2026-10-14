import api from "@/routes/apiClient";

export type AiVisibilityMode = "automatic" | "manual";
export type AiEngine = "chatgpt" | "perplexity" | "google_ai" | "google_search";

export interface AiVisibilitySummary {
  engines: Record<string, { asked: number; mentioned: number; cited: number }>;
  share_of_voice: { brand: string; mentions: number; share: number }[];
  top_sources: { domain: string; count: number }[];
  gaps: { question: string; named_instead: string[] }[];
  questions: number;
  answers: number;
  mentioned: number;
  cited: number;
}

export interface AiVisibilityRunSummary {
  id: string;
  status: "queued" | "running" | "done" | "failed";
  trigger: "manual" | "automatic";
  score: number | null;
  summary: AiVisibilitySummary | null;
  cost_usd: number;
  error: string | null;
  created_at: string;
  finished_at: string | null;
}

export interface AiVisibilityOverview {
  mode: AiVisibilityMode;
  engines: AiEngine[];
  competitors: string[];
  next_check_at: string | null;
  latest: AiVisibilityRunSummary | null;
  active: AiVisibilityRunSummary | null;
  trend: { date: string; score: number }[];
  questions: { id: string; text: string; source: "auto" | "user"; ai_volume: number | null }[];
  can_check_now: boolean;
}

export interface AiVisibilityAnswer {
  question: string;
  engine: AiEngine;
  mentioned: boolean;
  position: number | null;
  cited: boolean;
  google_rank: number | null;
  sentiment: string | null;
  brands: string[];
  sources: string[];
  answer_text: string;
}

export interface AiVisibilityRun extends AiVisibilityRunSummary {
  answers: AiVisibilityAnswer[];
}

export const AiVisibilityOverviewApi = async (): Promise<AiVisibilityOverview> =>
  (await api.get("/ai-visibility")).data;

export const AiVisibilityRunApi = async (runId: string): Promise<AiVisibilityRun> =>
  (await api.get(`/ai-visibility/runs/${runId}`)).data;

export const AiVisibilityCheckApi = async (): Promise<AiVisibilityOverview> =>
  (await api.post("/ai-visibility/check")).data;

export const AiVisibilitySettingsApi = async (body: {
  mode: AiVisibilityMode;
  engines?: AiEngine[];
  competitors?: string[];
}): Promise<AiVisibilityOverview> => (await api.put("/ai-visibility/settings", body)).data;

export const AiVisibilityQuestionsApi = async (questions: string[]): Promise<AiVisibilityOverview> =>
  (await api.put("/ai-visibility/questions", { questions })).data;

export const AiVisibilityRefreshQuestionsApi = async (): Promise<AiVisibilityOverview> =>
  (await api.post("/ai-visibility/questions/refresh")).data;
