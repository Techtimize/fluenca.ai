/** GET /news: articles for the company's niche, or for a topic the user typed. */
export interface NewsArticle {
  title: string;
  url: string;
  source: string | null;
  source_icon: string | null;
  /** "2026-10-16 10:12:45", no timezone. */
  published_at: string | null;
  description: string | null;
  image_url: string | null;
  categories: string[] | null;
}

export interface NewsResponse {
  /** The niche (or typed topic) the search used. */
  niche: string[];
  /** True when nothing matched exactly and the search was widened. */
  broadened: boolean;
  country: string | null;
  language: string | null;
  count: number;
  articles: NewsArticle[];
}

export interface NewsParams {
  topic?: string;
  /** Up to 10. */
  size?: number;
}

export const NEWS_MAX_SIZE = 10;
