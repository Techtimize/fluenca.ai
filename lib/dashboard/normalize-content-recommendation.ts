import type {
  BrandVoice,
  ContentCalendar,
  ContentIdea,
  ContentPillar,
  ContentRecommendationPayload,
  ContentRecommendationResultResponse,
  ContentStrategyCore,
  InstagramPerformanceSummary,
  OpportunityScore,
  PlannerHandoff,
  PlatformPlan,
  PlatformStrategy,
  TrendSignal,
} from "@/types/bussiness/content-recommendation-type";

export type NormalizedContentRecommendation = {
  summary?: string | null;
  companyName?: string | null;
  version?: number | null;
  status?: string | null;
  createdAt?: string | null;
  platformNames: string[];
  ideasCount: number;
  strategy?: ContentStrategyCore;
  pillars: ContentPillar[];
  focusTopics: string[];
  businessGoals: string[];
  platforms: PlatformPlan[];
  ideas: ContentIdea[];
  calendar?: ContentCalendar;
  calendarItems: ContentIdea[];
  brandVoice?: BrandVoice | null;
  plannerHandoff?: PlannerHandoff | null;
  trendSignals: TrendSignal[];
  opportunityScores: OpportunityScore[];
  instagramPerformance?: InstagramPerformanceSummary | null;
  goalMode?: string | null;
  quickMode: boolean;
  hasData: boolean;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && Boolean(item));
}

function asStrategyCore(value: unknown): ContentStrategyCore | undefined {
  const record = asRecord(value);
  if (!record) return undefined;
  if (record.strategy && typeof record.strategy === "object") {
    return record.strategy as ContentStrategyCore;
  }
  return record as ContentStrategyCore;
}

function asPlatforms(value?: PlatformStrategy | null): PlatformPlan[] {
  if (!value) return [];
  if (Array.isArray(value.platforms) && value.platforms.length) {
    return value.platforms;
  }
  return Object.entries(value)
    .filter(([key, plan]) => key !== "platforms" && plan && !Array.isArray(plan))
    .map(([, plan]) => plan as PlatformPlan);
}

function asIdeas(
  ...lists: Array<ContentIdea[] | undefined | null>
): ContentIdea[] {
  for (const list of lists) {
    if (Array.isArray(list) && list.length) return list;
  }
  return [];
}

function asCalendarItems(calendar?: ContentCalendar | null): ContentIdea[] {
  if (!calendar) return [];
  if (Array.isArray(calendar.items) && calendar.items.length) {
    return calendar.items;
  }
  if (!calendar.phases) return [];
  return Object.values(calendar.phases).flatMap((phase) =>
    Array.isArray(phase) ? phase : [],
  );
}

function asOpportunityScores(
  value: ContentRecommendationPayload["opportunity_scores"],
): OpportunityScore[] {
  if (!value) return [];
  if (Array.isArray(value)) return value as OpportunityScore[];
  return Object.entries(value).map(([name, score]) => ({
    name,
    score: typeof score === "number" ? score : Number(score),
  }));
}

function asTrendSignals(value: unknown): TrendSignal[] {
  if (!Array.isArray(value)) return [];
  return value as TrendSignal[];
}

/**
 * Merge root + nested `recommendation`/`result` so every field from the API
 * shape in res.json is available regardless of which level it lives on.
 */
export function getContentRecommendationPayload(
  data?: ContentRecommendationResultResponse | null,
): ContentRecommendationPayload | null {
  if (!data || typeof data !== "object") return null;

  const nested =
    (data.recommendation && typeof data.recommendation === "object"
      ? data.recommendation
      : null) ||
    (data.result && typeof data.result === "object" ? data.result : null);

  const rootStrategy = data.content_strategy ?? data.strategy;
  const nestedStrategy =
    nested?.strategy ?? nested?.content_strategy ?? undefined;

  const merged: ContentRecommendationPayload = {
    ...(nested || {}),
    strategy: nestedStrategy ?? rootStrategy,
    content_strategy: nested?.content_strategy ?? data.content_strategy,
    platform_strategy: nested?.platform_strategy ?? data.platform_strategy,
    content_ideas: asIdeas(
      nested?.content_ideas,
      nested?.ideas,
      nested?.recommendations,
      data.content_ideas,
      data.ideas,
      data.recommendations,
    ),
    ideas: nested?.ideas ?? data.ideas,
    recommendations: nested?.recommendations ?? data.recommendations,
    content_calendar: nested?.content_calendar ?? data.content_calendar,
    brand_voice: nested?.brand_voice ?? data.brand_voice,
    planner_handoff: nested?.planner_handoff ?? data.planner_handoff,
    trend_signals: asTrendSignals(
      nested?.trend_signals ?? data.trend_signals,
    ),
    opportunity_scores:
      nested?.opportunity_scores ?? data.opportunity_scores ?? [],
    instagram_performance_summary:
      nested?.instagram_performance_summary ??
      data.instagram_performance_summary,
    goal_mode: nested?.goal_mode ?? data.goal_mode,
    quick_mode: nested?.quick_mode ?? data.quick_mode,
    summary: nested?.summary ?? data.summary,
    platforms: nested?.platforms ?? data.platforms,
    ideas_count: nested?.ideas_count ?? data.ideas_count,
    success: data.success ?? nested?.success,
  };

  const hasAny =
    merged.strategy ||
    merged.content_strategy ||
    merged.platform_strategy ||
    (merged.content_ideas?.length ?? 0) ||
    merged.content_calendar ||
    merged.brand_voice ||
    merged.planner_handoff ||
    merged.summary;

  return hasAny ? merged : null;
}

export function normalizeContentRecommendation(
  data?: ContentRecommendationResultResponse | null,
): NormalizedContentRecommendation {
  const payload = getContentRecommendationPayload(data);
  const strategy = asStrategyCore(
    payload?.strategy ?? payload?.content_strategy,
  );
  const platforms = asPlatforms(payload?.platform_strategy);
  const ideas = payload
    ? asIdeas(payload.content_ideas, payload.ideas, payload.recommendations)
    : [];
  const calendar = payload?.content_calendar;
  const calendarItems = asCalendarItems(calendar);
  const brandVoice = payload?.brand_voice ?? null;
  const plannerHandoff = payload?.planner_handoff ?? null;
  const trendSignals = asTrendSignals(payload?.trend_signals);
  const opportunityScores = asOpportunityScores(payload?.opportunity_scores);
  const instagramPerformance = payload?.instagram_performance_summary ?? null;
  const platformNames = asStringArray(
    payload?.platforms ?? data?.platforms,
  );
  const summary = payload?.summary ?? data?.summary;
  const ideasCount =
    typeof payload?.ideas_count === "number"
      ? payload.ideas_count
      : typeof data?.ideas_count === "number"
        ? data.ideas_count
        : ideas.length;

  return {
    summary,
    companyName: data?.company_name ?? null,
    version: typeof data?.version === "number" ? data.version : null,
    status: data?.status ?? null,
    createdAt: data?.created_at ?? null,
    platformNames,
    ideasCount,
    strategy,
    pillars: strategy?.content_pillars ?? [],
    focusTopics: strategy?.focus_topics ?? [],
    businessGoals: strategy?.business_goals ?? [],
    platforms,
    ideas,
    calendar,
    calendarItems,
    brandVoice,
    plannerHandoff,
    trendSignals,
    opportunityScores,
    instagramPerformance,
    goalMode: payload?.goal_mode ?? data?.goal_mode ?? null,
    quickMode: Boolean(payload?.quick_mode ?? data?.quick_mode),
    hasData: Boolean(
      summary ||
        strategy?.primary_goal ||
        strategy?.content_positioning ||
        (strategy?.content_pillars?.length ?? 0) ||
        platforms.length ||
        ideas.length ||
        calendarItems.length ||
        brandVoice?.tone_guide ||
        brandVoice?.brand_name ||
        plannerHandoff?.plan_summary ||
        trendSignals.length ||
        opportunityScores.length ||
        instagramPerformance?.summary ||
        (instagramPerformance?.best_topics?.length ?? 0) ||
        (instagramPerformance?.best_formats?.length ?? 0),
    ),
  };
}
