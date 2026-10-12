import type { SocialGrowthResponse } from "@/types/bussiness/socail-growth-type";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

/** Normalize loosely-shaped growth API payloads into the typed response. */
export function normalizeSocialGrowthResponse(
  raw: unknown,
): SocialGrowthResponse | null {
  const root = asRecord(raw);
  if (!root) return null;

  const nested = asRecord(root.result) || asRecord(root.data) || root;
  const goal = asRecord(nested.goal) || asRecord(root.goal);
  const growthGap = asRecord(nested.growth_gap) || asRecord(root.growth_gap);
  const strategy = asRecord(nested.strategy) || asRecord(root.strategy);
  const contentPlan =
    asRecord(nested.content_plan) || asRecord(root.content_plan);
  const performance =
    asRecord(nested.performance_report) || asRecord(root.performance_report);
  const progress =
    asRecord(nested.goal_progress) ||
    asRecord(nested.progress) ||
    asRecord(root.goal_progress);

  return {
    ...(nested as SocialGrowthResponse),
    success: nested.success !== false && root.success !== false,
    needs_user_input: Boolean(nested.needs_user_input ?? root.needs_user_input),
    clarification_questions: asArray(
      nested.clarification_questions ?? root.clarification_questions,
    ),
    missing_fields: asArray(nested.missing_fields ?? root.missing_fields),
    goal: (goal || {}) as SocialGrowthResponse["goal"],
    growth_gap: (growthGap || {}) as SocialGrowthResponse["growth_gap"],
    strategy: {
      version: Number(strategy?.version ?? nested.strategy_version ?? 1),
      strategy: asArray(strategy?.strategy),
      opportunities_used: asArray(strategy?.opportunities_used),
      platforms: asArray(strategy?.platforms ?? nested.platforms),
    },
    platform_strategies: (asRecord(nested.platform_strategies) ||
      {}) as SocialGrowthResponse["platform_strategies"],
    content_plan: {
      pillars: asArray(contentPlan?.pillars),
      ideas: asArray(contentPlan?.ideas),
      series: asArray(contentPlan?.series),
      calendar: asArray(contentPlan?.calendar),
      keywords: asArray(contentPlan?.keywords),
      hashtags: asArray(contentPlan?.hashtags),
      platforms: asArray(contentPlan?.platforms),
    },
    engagement_plan: (asRecord(nested.engagement_plan) || {
      steps: [],
      community_building: false,
      dm_opportunities: "",
    }) as SocialGrowthResponse["engagement_plan"],
    tasks: asArray(nested.tasks ?? root.tasks),
    pending_approvals: asArray(nested.pending_approvals),
    execution_results: asArray(nested.execution_results),
    performance_report: (performance ||
      {}) as SocialGrowthResponse["performance_report"],
    goal_status: String(
      nested.goal_status || root.goal_status || "in_progress",
    ),
    goal_progress: {
      followers: Number(progress?.followers ?? 0),
      engagement: Number(progress?.engagement ?? 0),
    },
    issues: asArray(nested.issues ?? root.issues),
    optimization_recommendations: asArray(
      nested.optimization_recommendations,
    ),
    experiment: (asRecord(nested.experiment) ||
      {}) as SocialGrowthResponse["experiment"],
    strategy_version: Number(nested.strategy_version ?? strategy?.version ?? 1),
    result: (asRecord(nested.result) ||
      nested) as SocialGrowthResponse["result"],
    error: (nested.error as string | null) ?? null,
    meta: (asRecord(nested.meta) || {}) as SocialGrowthResponse["meta"],
  };
}
