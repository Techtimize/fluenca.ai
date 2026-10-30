/* Estimated organic (Google) traffic of a website, from the keywords it ranks for (DataForSEO). */

/** GET /organic-traffic query params. */
export interface OrganicTrafficRequest {
  /** The site to check; left out, the company's own website is checked. */
  website?: string | null;
  /** Two-letter code for the history, keywords and pages; left out, the top-traffic country is used. */
  country?: string | null;
  /** Runs a fresh check instead of the saved one from the last 7 days (costs research budget). */
  refresh?: boolean;
}

export interface TrafficCountry {
  /** ISO code, e.g. "PK". */
  country: string;
  organic_traffic: number;
  /** Percent of all its organic traffic. */
  share: number;
}

export interface TrafficMonth {
  /** e.g. "2026-05". */
  month: string;
  organic_traffic: number;
  keywords: number;
}

export interface TrafficKeyword {
  keyword: string;
  position: number;
  search_volume: number;
  organic_traffic: number;
  url: string;
}

export interface TrafficPage {
  url: string;
  organic_traffic: number;
  /** Percent of the traffic in `country`. */
  share: number;
  keywords: number;
}

/** GET /organic-traffic */
export interface OrganicTrafficResponse {
  domain: string;
  /** The country the history, keywords and pages are for; null when the site has no traffic data. */
  country: string | null;
  language: string | null;
  /** Estimated monthly visits from Google, all countries. */
  organic_traffic: number;
  /** What that traffic would cost as Google Ads. */
  traffic_value_usd: number;
  /** Search results it appears in, all countries. */
  keywords: number;
  /** e.g. { pos_1: 40, pos_2_3: 80, pos_4_10: 120 }. */
  positions: Record<string, number>;
  top_countries: TrafficCountry[];
  history: TrafficMonth[];
  top_keywords: TrafficKeyword[];
  top_pages: TrafficPage[];
  checked_at: string;
  /** True when this is a saved report from the last 7 days. */
  from_cache: boolean;
}
