/* LinkedIn coach: the daily checklist, follow-ups, weekly report and the content tools. */

// ---------- Today on LinkedIn ----------

export const COACH_TASK_TYPES = ["post", "comment", "connect", "follow_up", "profile_fix"] as const;
export type CoachTaskType = (typeof COACH_TASK_TYPES)[number];

export interface CoachTask {
  id: string;
  type: CoachTaskType;
  title: string;
  done: boolean;
  /** Post 10, comment 3, connect 4, follow-up 4, profile fix 6. */
  points: number;
  /** The post to comment on, the person's LinkedIn (or a LinkedIn search), etc. */
  url?: string | null;
  /** Ready-to-use text: the post, a comment, a connection note (≤ 200 chars) or a reply. */
  draft?: string | null;
  /** Who the task is about (connect / follow-up) or whose post it is (comment). */
  person?: { name: string; headline?: string | null } | null;
  /** A snippet of the post to comment on, or why this fix matters. */
  context?: string | null;
  /** The post task's suggested publish time. */
  best_time?: string | null;
  /** The week post behind the post task, so it can be scheduled. */
  draft_id?: string | null;
}

export interface CoachToday {
  date: string;
  tasks: CoachTask[];
  streak: number;
  points_today: number;
  total_points?: number | null;
}

// ---------- Follow-ups ----------

export type FollowUpReason = "accepted" | "commented" | "no_reply";

export interface FollowUp {
  id: string;
  name: string;
  reason: FollowUpReason;
  linkedin_url?: string | null;
  draft_reply?: string | null;
  done: boolean;
  created_at?: string;
}

/** POST /follow-ups — someone who accepted your request or commented. */
export interface AddFollowUpRequest {
  name: string;
  reason: Exclude<FollowUpReason, "no_reply">;
  linkedin_url?: string;
  /** What they said, so the reply can answer it. */
  context?: string;
}

// ---------- Weekly report ----------

export interface WeeklyReport {
  id?: string;
  week_start: string;
  week_end?: string | null;
  score_change?: number | null;
  best_post?: { text: string; url?: string | null; engagement?: number | null } | null;
  new_connections?: number | null;
  posts?: number | null;
  comments?: number | null;
  points?: number | null;
  streak?: number | null;
  what_worked?: { hooks?: string[]; formats?: string[]; topics?: string[] } | null;
  /** Taken from the weakest part of the score. */
  next_focus?: { area: string; advice?: string | null } | null;
}

// ---------- Content plan ----------

export const CONTENT_PLAN_GOALS = ["followers", "leads", "authority"] as const;
export type ContentPlanGoal = (typeof CONTENT_PLAN_GOALS)[number];

export interface ContentPlanPost {
  day: string;
  time?: string | null;
  format: string;
  topic: string;
  hook: string;
  outline: string[];
  closing_line?: string | null;
}

export interface ContentPlan {
  goal?: ContentPlanGoal;
  /** 3–5 posts for next week. */
  posts: ContentPlanPost[];
}

// ---------- Carousel ----------

export type CarouselSource = "best_post" | "blog_post" | "text";

export interface CarouselRequest {
  source: CarouselSource;
  blog_post_id?: string;
  text?: string;
}

export interface CarouselSlide {
  index: number;
  title?: string | null;
  text: string;
  image_url: string;
  /** Slide-by-slide check notes, if any. */
  issues?: string[];
}

export interface Carousel {
  id?: string;
  title?: string | null;
  caption?: string | null;
  slides: CarouselSlide[];
}

/** POST /connector/linkedin/publish-carousel */
export interface PublishCarouselRequest {
  carousel_id?: string;
  image_urls: string[];
  caption: string;
}

// ---------- Repurpose, write and check ----------

/** A post saved as a draft; schedulable with the week-post one-click schedule. */
export interface CoachDraft {
  id: string;
  text: string;
  hook?: string | null;
  /** "new_angle" / "follow_up" for repurposed drafts. */
  kind?: string | null;
}

export interface RepurposeResponse {
  drafts: CoachDraft[];
}

export interface PostCheckRequest {
  text: string;
}

export interface PostCheckResponse {
  /** The post with the AI-written feel removed. */
  text: string;
  /** Score of the opening line. */
  first_line_score?: number | null;
  lint?: string[];
}

export interface WritePostRequest {
  brief: string;
}

// ---------- Hook formulas ----------

export interface HookFormula {
  name: string;
  formula: string;
  example?: string | null;
}
