export type SearchConsoleStatus = "active" | "revoked";

export interface SearchConsoleConnection {
  connected: boolean;
  status: SearchConsoleStatus | null;
  google_email: string | null;
  site_url: string | null;
  permission_level: string | null;
  connected_at: string | null;
}

export interface SearchConsoleSite {
  site_url: string;
  permission_level: string;
}

export interface SearchRow {
  key: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SearchConsoleOverview {
  site_url: string;
  days: number;
  totals: { clicks: number; impressions: number; ctr: number; position: number };
  daily: { day: string; clicks: number; impressions: number }[];
  top_queries: SearchRow[];
  top_pages: SearchRow[];
}

export interface Sitemap {
  path: string;
  type: string;
  is_index: boolean;
  is_pending: boolean;
  last_submitted: string | null;
  last_downloaded: string | null;
  submitted_urls: number;
  warnings: number;
  errors: number;
}

export interface UrlInspection {
  url: string;
  indexed: boolean;
  verdict: string;
  coverage_state: string;
  robots_txt_state: string;
  indexing_state: string;
  page_fetch_state: string;
  crawled_as: string;
  last_crawl_time: string | null;
  google_canonical: string | null;
  user_canonical: string | null;
  inspection_link: string | null;
  error: string | null;
}

export interface IndexCheck {
  site_url: string;
  checked: number;
  indexed: number;
  items: UrlInspection[];
}
