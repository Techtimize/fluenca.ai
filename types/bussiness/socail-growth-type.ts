export type MetricTarget = {
  target: number;
  current: number;
};

export type SocialGrowthGoal = {
  platforms: string[];
  goals: {
    followers: MetricTarget;
    engagement_rate: MetricTarget;
  };
  duration_days: number;
  raw_goal: string;
  assumptions: string[];
};

export type GrowthGap = {
  follower_gap: number;
  required_daily_growth: number;
  required_monthly_growth: number;
  engagement_gap: number;
  reach_gap: number;
  profile_visit_gap: number;
  duration_days: number;
  current_followers: number;
  target_followers: number;
};

export type StrategyAction = {
  objective: string;
  platform: string;
  kpi: string;
  why: string;
  actions: string[];
  success_metric: string;
};

export type StrategyOpportunity = {
  opportunity: string;
  reason: string;
  suggested_formats: string[];
};

export type SocialGrowthStrategy = {
  version: number;
  strategy: StrategyAction[];
  opportunities_used: StrategyOpportunity[];
  platforms: string[];
};

export type PlatformContentItem = {
  type: string;
  topic: string;
  hook: string;
  cta: string;
  goal: string;
  platform: string;
};

export type PlatformPostingSchedule = {
  reels_per_week: number;
  carousels_per_week: number;
  stories_daily: boolean;
};

export type PlatformStrategy = {
  content_plan: PlatformContentItem[];
  posting_schedule: PlatformPostingSchedule;
  hashtags: string[];
  profile_optimization: string[];
  collaborations: string[];
};

/** Keyed by platform id, e.g. "instagram", "linkedin". */
export type PlatformStrategies = Partial<Record<string, PlatformStrategy>>;

export type ContentPillar = {
  name: string;
  description: string;
  opportunity?: string;
  reason?: string;
  suggested_formats?: string[];
};

export type ContentIdea = {
  type: string;
  topic: string;
  hook: string;
  cta: string;
  goal: string;
  platform: string;
  pillar: string;
};

export type ContentSeries = {
  name?: string;
  description?: string;
  topic?: string;
  chain: string[];
  from?: string;
  goal?: string;
};

export type ContentCalendarItem = {
  day: number;
  platform: string;
  type: string;
  topic: string;
  goal: string;
};

export type ContentPlan = {
  pillars: ContentPillar[];
  ideas: ContentIdea[];
  series?: ContentSeries[];
  calendar: ContentCalendarItem[];
  keywords?: string[];
  hashtags?: string[];
  platforms?: string[];
};

export type EngagementStep = {
  step: string;
  platform: string;
  count: number;
};

export type EngagementPlan = {
  steps: EngagementStep[];
  community_building: boolean;
  dm_opportunities: string;
};

export type SocialGrowthTask = {
  id?: string;
  task: string;
  platform: string;
  priority: string;
  due_at: string;
  topic: string;
  requires_approval: boolean;
  status: string;
  approved_by: string;
};

export type ExecutionResult = {
  task: string;
  platform: string;
  status: string;
  message: string;
  at: string;
};

export type PerformanceBaseline = {
  followers: number;
  engagement_rate: number;
};

export type PerformanceReport = {
  collected_at: string;
  followers: number;
  engagement_rate: number;
  reach: number | null;
  impressions: number | null;
  profile_visits: number | null;
  baseline: PerformanceBaseline;
  source: string;
};

export type GoalProgress = {
  followers: number;
  engagement: number;
};

export type OptimizationRecommendation = {
  hypothesis: string;
  platform: string;
  metric: string;
  action: string;
  variant: string;
};

export type GrowthExperiment = {
  hypothesis: string;
  platform: string;
  metric: string;
  action: string;
  variant: string;
};

export type SocialGrowthResult = {
  goal_status: string;
  progress: GoalProgress;
  issues: string[];
  growth_gap: GrowthGap;
  strategy_version: number;
};

export type SocialGrowthMeta = {
  duration_sec: number;
  timestamp: string;
  agent_mode: string;
  mode: string;
  platforms: string[];
  loop_count: number;
};

export type SocialGrowthResponse = {
  success: boolean;
  needs_user_input: boolean;
  clarification_questions: string[];
  missing_fields: string[];
  goal: SocialGrowthGoal;
  growth_gap: GrowthGap;
  strategy: SocialGrowthStrategy;
  platform_strategies: PlatformStrategies;
  content_plan: ContentPlan;
  engagement_plan: EngagementPlan;
  tasks: SocialGrowthTask[];
  pending_approvals: string[];
  execution_results: ExecutionResult[];
  performance_report: PerformanceReport;
  goal_status: string;
  goal_progress: GoalProgress;
  issues: string[];
  optimization_recommendations: OptimizationRecommendation[];
  experiment: GrowthExperiment;
  strategy_version: number;
  result: SocialGrowthResult;
  error: string | null;
  meta: SocialGrowthMeta;
};
