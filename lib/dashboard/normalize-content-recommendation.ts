import type {
  ContentCalendar,
  ContentIdea,
  ContentPillar,
  ContentRecommendationPayload,
  ContentRecommendationResultResponse,
  ContentStrategyCore,
  PlatformPlan,
  PlatformStrategy,
} from "@/types/bussiness/content-recommendation-type";

export type NormalizedContentRecommendation = {
  summary?: string | null;
  strategy?: ContentStrategyCore;
  pillars: ContentPillar[];
  focusTopics: string[];
  businessGoals: string[];
  platforms: PlatformPlan[];
  ideas: ContentIdea[];
  calendar?: ContentCalendar;
  calendarItems: ContentIdea[];
  hasData: boolean;
};

function asStrategyCore(
  value?: ContentRecommendationPayload["strategy"] | null,
): ContentStrategyCore | undefined {
  if (!value || typeof value !== "object") return undefined;
  if ("strategy" in value && value.strategy && typeof value.strategy === "object") {
    return value.strategy;
  }
  return value as ContentStrategyCore;
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

function asIdeas(payload: ContentRecommendationPayload): ContentIdea[] {
  const lists = [payload.content_ideas, payload.ideas, payload.recommendations];
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

export function getContentRecommendationPayload(
  data?: ContentRecommendationResultResponse | null,
): ContentRecommendationPayload | null {
  if (!data || typeof data !== "object") return null;
  if (data.result && typeof data.result === "object") return data.result;
  if (data.recommendation && typeof data.recommendation === "object") {
    return data.recommendation;
  }
  if (
    data.strategy ||
    data.platform_strategy ||
    data.content_ideas ||
    data.ideas ||
    data.recommendations ||
    data.content_calendar
  ) {
    return data;
  }
  return null;
}

export function normalizeContentRecommendation(
  data?: ContentRecommendationResultResponse | null,
): NormalizedContentRecommendation {
  const payload = getContentRecommendationPayload(data);
  const strategy = asStrategyCore(payload?.strategy);
  const platforms = asPlatforms(payload?.platform_strategy);
  const ideas = payload ? asIdeas(payload) : [];
  const calendar = payload?.content_calendar;
  const calendarItems = asCalendarItems(calendar);
  const summary = payload?.summary ?? data?.summary;

  return {
    summary,
    strategy,
    pillars: strategy?.content_pillars ?? [],
    focusTopics: strategy?.focus_topics ?? [],
    businessGoals: strategy?.business_goals ?? [],
    platforms,
    ideas,
    calendar,
    calendarItems,
    hasData: Boolean(
      summary ||
        strategy?.primary_goal ||
        strategy?.content_positioning ||
        (strategy?.content_pillars?.length ?? 0) ||
        platforms.length ||
        ideas.length ||
        calendarItems.length,
    ),
  };
}
