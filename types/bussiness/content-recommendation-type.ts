export interface ContentRecommendationRequest {
  company_id: string;
}

export interface ContentRecommendationResponse {
  success: boolean;
  message?: string;
}

export interface ContentPillar {
  name?: string;
  percentage?: number;
  objective?: string;
}

export interface ContentStrategyCore {
  primary_goal?: string;
  content_positioning?: string;
  content_pillars?: ContentPillar[];
  focus_topics?: string[];
  business_goals?: string[];
}

export interface ContentStrategyBlock {
  strategy?: ContentStrategyCore;
}

export interface ContentRatio {
  educational?: number;
  authority?: number;
  case_study?: number;
  promotional?: number;
  company?: number;
  entertainment?: number;
  [key: string]: number | undefined;
}

export interface PlatformPlan {
  platform?: string;
  role?: string;
  formats?: string[];
  content_ratio?: ContentRatio;
  goal_alignment?: string;
  best_performing?: string[];
}

export interface PlatformStrategy {
  platforms?: PlatformPlan[];
  linkedin?: PlatformPlan;
  instagram?: PlatformPlan;
  [key: string]: PlatformPlan | PlatformPlan[] | undefined;
}

export interface ContentSlide {
  slide_number?: number;
  headline?: string;
  body?: string;
  image_prompt?: string;
}

export interface ContentIdea {
  title?: string;
  name?: string;
  idea?: string;
  topic?: string;
  headline?: string;
  theme?: string;
  platform?: string;
  channel?: string;
  format?: string;
  post_type?: string;
  content_type?: string;
  content_pillar?: string;
  pillar?: string;
  objective?: string;
  goal?: string;
  target_audience?: string;
  hook?: string;
  angle?: string;
  description?: string;
  summary?: string;
  caption?: string;
  body?: string;
  content?: string;
  key_points?: string[];
  hashtags?: string[];
  cta?: string;
  call_to_action?: string;
  reason?: string;
  priority?: string | number;
  priority_score?: number;
  image_prompt?: string;
  visual_prompt?: string;
  visual?: string;
  visual_style?: string;
  visual_direction?: string;
  script_brief?: string;
  brief?: string;
  slides?: ContentSlide[];
  style?: string;
  duration_seconds?: number;
  user_request?: string;
  date?: string;
  day?: string;
  phase?: string;
  media_type?: string;
}

export interface ContentCalendarPhaseItem extends ContentIdea {
  id?: string;
  action_ref?: string;
  idea_ref?: string;
  aspect_ratio?: string;
  company_id?: string;
}

export interface ContentCalendar {
  days?: number;
  start_date?: string;
  end_date?: string;
  skip_weekends?: boolean;
  source_plan_summary?: string;
  phases?: Record<string, ContentCalendarPhaseItem[]>;
  items?: ContentCalendarPhaseItem[];
}

export interface ContentRecommendationPayload {
  strategy?: ContentStrategyBlock | ContentStrategyCore;
  platform_strategy?: PlatformStrategy;
  content_ideas?: ContentIdea[];
  ideas?: ContentIdea[];
  recommendations?: ContentIdea[];
  content_calendar?: ContentCalendar;
  summary?: string | null;
  success?: boolean;
}

export interface ContentRecommendationResultResponse {
  success?: boolean;
  message?: string;
  status?: string;
  company_id?: string;
  prompt_id?: string;
  created_at?: string;
  error?: string | null;
  warnings?: string[];
  summary?: string | null;
  result?: ContentRecommendationPayload | null;
  recommendation?: ContentRecommendationPayload | null;
  strategy?: ContentStrategyBlock | ContentStrategyCore;
  platform_strategy?: PlatformStrategy;
  content_ideas?: ContentIdea[];
  ideas?: ContentIdea[];
  recommendations?: ContentIdea[];
  content_calendar?: ContentCalendar;
}
