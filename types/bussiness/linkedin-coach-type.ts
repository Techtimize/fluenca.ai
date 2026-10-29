/* LinkedIn coach: the weekly content plan and the content tools. */

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
