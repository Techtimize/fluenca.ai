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
  facebook?: PlatformPlan;
  [key: string]: PlatformPlan | PlatformPlan[] | undefined;
}

export interface ContentSlide {
  slide_number?: number;
  headline?: string;
  body?: string;
  image_prompt?: string;
}

export interface StoryFrame {
  text?: string;
  type?: string;
  frame?: number;
  sticker?: string | null;
}

export interface ReelShot {
  shot?: number;
  visual?: string;
  audio_line?: string;
  duration_sec?: number;
}

export interface ProductionPack {
  do?: string[];
  dont?: string[];
  ab_hooks?: string[];
  tone_guide?: string;
  primary_hook?: string;
  story_sequence?: StoryFrame[];
  carousel_slides?: ContentSlide[];
  reel_shot_list?: ReelShot[];
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
  ab_hooks?: string[];
  brand_voice_note?: string;
  production_pack?: ProductionPack;
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

export interface BrandVoice {
  do?: string[];
  dont?: string[];
  audience?: string[];
  brand_name?: string;
  tone_guide?: string | null;
  positioning?: string | null;
  content_themes?: string[];
  differentiators?: string[];
}

export interface PlannerHandoff {
  action_count?: number;
  plan_summary?: string;
  calendar_items_linked?: number;
}

export interface TrendSignal {
  topic?: string;
  signal?: string;
  platform?: string;
  score?: number;
  reason?: string;
  [key: string]: unknown;
}

export interface OpportunityScore {
  name?: string;
  topic?: string;
  score?: number;
  platform?: string;
  reason?: string;
  [key: string]: unknown;
}

export interface InstagramPerformanceSummary {
  source?: string | null;
  summary?: string | null;
  post_count?: number | null;
  best_topics?: string[];
  best_formats?: string[];
  account_insights?: Record<string, unknown>;
  average_engagement_rate?: number | null;
}

export interface ContentRecommendationPayload {
  strategy?: ContentStrategyBlock | ContentStrategyCore;
  content_strategy?: ContentStrategyBlock | ContentStrategyCore;
  platform_strategy?: PlatformStrategy;
  content_ideas?: ContentIdea[];
  ideas?: ContentIdea[];
  recommendations?: ContentIdea[];
  content_calendar?: ContentCalendar;
  brand_voice?: BrandVoice | null;
  planner_handoff?: PlannerHandoff | null;
  trend_signals?: TrendSignal[];
  opportunity_scores?: OpportunityScore[] | Record<string, number>;
  instagram_performance_summary?: InstagramPerformanceSummary | null;
  goal_mode?: string | null;
  quick_mode?: boolean;
  summary?: string | null;
  platforms?: string[];
  ideas_count?: number;
  success?: boolean;
}

export interface ContentRecommendationResultResponse {
  success?: boolean;
  message?: string;
  status?: string;
  content_recommendation_id?: string;
  company_id?: string;
  company_name?: string;
  prompt_id?: string;
  version?: number;
  created_at?: string;
  error?: string | null;
  warnings?: string[];
  summary?: string | null;
  platforms?: string[];
  ideas_count?: number;
  result?: ContentRecommendationPayload | null;
  recommendation?: ContentRecommendationPayload | null;
  content_strategy?: ContentStrategyBlock | ContentStrategyCore;
  strategy?: ContentStrategyBlock | ContentStrategyCore;
  platform_strategy?: PlatformStrategy;
  content_ideas?: ContentIdea[];
  ideas?: ContentIdea[];
  recommendations?: ContentIdea[];
  content_calendar?: ContentCalendar;
  brand_voice?: BrandVoice | null;
  planner_handoff?: PlannerHandoff | null;
  trend_signals?: TrendSignal[];
  opportunity_scores?: OpportunityScore[] | Record<string, number>;
  instagram_performance_summary?: InstagramPerformanceSummary | null;
  goal_mode?: string | null;
  quick_mode?: boolean;
}
