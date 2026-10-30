/* Story bank: the company's past Instagram / LinkedIn posts, the voice learned from them, and the
   weekly "what's working" report. */

export type StoryBankStatus = "importing" | "learning" | "ready" | "empty" | "failed";
export type StoryBankPlatform = "instagram" | "linkedin";
export type StoryBankPostFormat = "text" | "image" | "carousel" | "reel" | "video";

// ---------- Refresh ----------

export interface StoryBankPost {
  id: string;
  platform: StoryBankPlatform;
  format: StoryBankPostFormat;
  hook: string;
  text: string;
  permalink: string | null;
  posted_at: string | null;
  /** How the numbers were read: "insights", "public" or "none". */
  metrics_source: string;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  saves: number | null;
  reach: number | null;
  views: number | null;
  /** Engagement against the company's typical post: 2.0 is twice as good. */
  relative_score: number | null;
  /** e.g. "3.1x more comments than your typical post". */
  highlight: string | null;
}

export interface StoryBankFormatResult {
  platform: StoryBankPlatform;
  format: StoryBankPostFormat;
  posts: number;
  median_relative: number;
}

export interface StoryBankVoice {
  summary: string;
  traits: string[];
  sentence_style: string;
  vocabulary: string[];
  signature_phrases: string[];
  formatting: string;
  point_of_view: string;
}

export interface StoryBankHookPattern {
  pattern: string;
  example: string;
  evidence: string;
}

export interface StoryBankStory {
  title: string;
  summary: string;
  source_post_id?: string | null;
}

/** What was learned from one platform's posts. */
export interface StoryBankProfile {
  platform: StoryBankPlatform;
  version: number;
  learned_at: string;
  posts_analysed: number;
  voice: StoryBankVoice;
  hook_patterns: StoryBankHookPattern[];
  winning_formats: { format: string; why: string }[];
  stories: StoryBankStory[];
  content_pillars: string[];
  do_more: string[];
  avoid: string[];
}

/**
 * GET /story-bank (no params) — the company's voice and stories, its best posts and formats.
 * POST /story-bank/refresh (no body) returns the same shape.
 * While `status` is "importing" or "learning", poll every 5 seconds.
 */
export interface StoryBankResponse {
  status: StoryBankStatus;
  error_message: string | null;
  last_synced_at: string | null;
  last_learned_at: string | null;
  /** Posts read per platform, e.g. { instagram: 40, linkedin: 12 }. */
  post_counts: Record<string, number>;
  profiles: StoryBankProfile[];
  top_posts: StoryBankPost[];
  formats: StoryBankFormatResult[];
}

export const isStoryBankBusy = (status?: StoryBankStatus) => status === "importing" || status === "learning";

// ---------- Weekly report ----------

/** GET /story-bank/weekly query params. */
export interface StoryBankWeeklyRequest {
  /** Any day (YYYY-MM-DD) in the week to report on; defaults to the last full week. */
  week_start?: string | null;
}

export interface WeeklyTopPost {
  id: string;
  platform: string;
  format: string;
  hook: string;
  permalink: string | null;
  posted_at: string | null;
  relative_score: number | null;
  highlight: string | null;
  likes: number | null;
  comments: number | null;
  saves: number | null;
  shares: number | null;
  reach: number | null;
}

export interface WeeklyHook {
  platform: string;
  pattern: string;
  example: string;
  evidence: string;
}

export interface WeeklyFormat {
  platform: string;
  format: string;
  posts: number;
  /** The format's typical result against the company's typical post. */
  median_relative: number;
}

/** GET /story-bank/weekly, and each item of GET /story-bank/weekly/history (newest first, up to 8). */
export interface StoryBankWeeklyReport {
  week_start: string;
  week_end: string;
  posts_published: number;
  posts_by_platform: Record<string, number>;
  top_posts: WeeklyTopPost[];
  formats: WeeklyFormat[];
  hooks_that_work: WeeklyHook[];
  /** Plain sentences, e.g. "This hook got 3x more comments. Use similar hooks." */
  whats_working: string[];
  try_next: string[];
  notes: string[];
}
