/* LinkedIn growth: profile score, profile rewrite, voice, first week of posts and LinkedIn Score. */

// ---------- Profile score (out of 100) ----------

/** One of the 12 checklist items (headline, About, photo, banner, featured, experience, …). */
export interface ProfileScoreItem {
  key: string;
  label: string;
  points: number;
  max_points: number;
  /** Why it scored what it did. */
  feedback?: string | null;
}

export interface ProfileScoreFix {
  key: string;
  label: string;
  /** Points the fix would add. */
  points_to_gain: number;
  fix?: string | null;
}

export interface ProfileScore {
  id?: string;
  /** Out of 100. */
  total: number;
  items: ProfileScoreItem[];
  /** The 3 items with the most points to gain. */
  top_fixes: ProfileScoreFix[];
  created_at?: string;
}

/** POST /profile-score — the profile to judge; anything left out is read from the connected account. */
export interface ProfileScoreRequest {
  headline?: string;
  about?: string;
  [field: string]: unknown;
}

// ---------- Rewritten headline and About ----------

export interface RewriteOption {
  text: string;
  /** Headline checklist result for this option. */
  headline_check?: { passed: boolean; notes?: string[] } | null;
  /** How AI-written it reads. */
  ai_feel?: { score: number; label?: string | null } | null;
  /** What shows before LinkedIn's "see more". */
  before_see_more?: string | null;
}

export interface ProfileRewrite {
  /** 3 options. */
  headlines: RewriteOption[];
  /** 2–3 options. */
  abouts: RewriteOption[];
}

// ---------- LinkedIn voice (story bank) ----------

export interface LinkedInVoice {
  /** False until the story bank has posts. */
  ready: boolean;
  tone?: string[];
  stories?: { title: string; summary: string }[];
  hooks?: string[];
  formats?: string[];
  top_posts?: { text: string; url?: string | null; engagement?: number | null }[];
}

// ---------- First week of posts ----------

export type WeekPostStatus = "draft" | "scheduled" | "published" | "cancelled" | "failed";

export interface WeekPost {
  id: string;
  text: string;
  hook: string;
  /** The 3 hooks offered; `hook` is the one the scorer picked. */
  hook_options?: string[];
  hook_score?: number | null;
  ai_feel?: { score: number; label?: string | null } | null;
  lint?: string[];
  /** What it was built from: a trending search, a news story or one of your stories. */
  source?: string | null;
  status: WeekPostStatus;
  scheduled_at?: string | null;
}

export interface WeekPostsResponse {
  posts: WeekPost[];
}

/** POST /week-posts/{id}/schedule — `text` sends your edited version. */
export interface ScheduleWeekPostRequest {
  /** ISO 8601 with an offset. */
  scheduled_at: string;
  text?: string;
}

// ---------- LinkedIn Score ----------

export interface LinkedInScore {
  id?: string;
  /** Out of 100: the four pillars, 25 points each. */
  total: number;
  profile: number;
  posting: number;
  engagement: number;
  network: number;
  change_since_first?: number | null;
  created_at?: string;
}
