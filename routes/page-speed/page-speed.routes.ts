import api from "@/routes/apiClient";

export type PageSpeedStrategy = "mobile" | "desktop";

export interface PageSpeedResult {
  url: string;
  strategy: PageSpeedStrategy;
  score: number | null;
  lab_metrics: { id: string; title: string; display_value: string; score: number | null }[];
  field_metrics: { id: string; percentile: number; category: string }[];
  field_category: string | null;
  opportunities: { id: string; title: string; display_value: string; savings_ms: number }[];
  categories: { id: string; title: string; score: number | null; issues: string[] }[];
  screenshot: string | null;
}

/** Runs Google PageSpeed Insights; a blank url checks the company website. */
export const PageSpeedApi = async (params: {
  url: string;
  strategy: PageSpeedStrategy;
}): Promise<PageSpeedResult> =>
  (await api.get("/page-speed", { params: { strategy: params.strategy, url: params.url || undefined } })).data;
