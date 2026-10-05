import type {
  PlannerAction,
  PlannerCalendarItem,
  PlannerResultsResponse,
  PlannerVersionsResponse,
} from "@/types/bussiness/planner-type";

export type PlannerEvent = {
  id: string;
  date: Date;
  title: string;
  description?: string;
  platform?: string;
  format?: string;
  priority?: string;
  why?: string;
  owner?: string;
  phase?: string;
  what_to_do?: string;
};

export const LATEST_PLANNER_VERSION = "latest";

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function unwrapPlannerResult(
  data?: PlannerResultsResponse | null,
): PlannerResultsResponse | null {
  if (!data || typeof data !== "object") return null;
  if (data.result && typeof data.result === "object") {
    return { ...data, ...data.result };
  }
  return data;
}

export function normalizePlannerVersions(data?: PlannerVersionsResponse | null) {
  if (!data) return [] as { version: string; label: string; created_at?: string }[];

  const raw = Array.isArray(data)
    ? data
    : Array.isArray(data.versions)
      ? data.versions
      : Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.items)
          ? data.items
          : [];

  const seen = new Set<string>();
  const items: { version: string; label: string; created_at?: string }[] = [];

  for (const entry of raw) {
    if (typeof entry === "string" || typeof entry === "number") {
      const version = String(entry).trim();
      if (!version || seen.has(version)) continue;
      seen.add(version);
      items.push({ version, label: `Version ${version}` });
      continue;
    }
    if (!entry || typeof entry !== "object") continue;
    const version = String(entry.version ?? "").trim();
    if (!version || seen.has(version)) continue;
    seen.add(version);
    items.push({
      version,
      label: entry.label || `Version ${version}`,
      created_at: entry.created_at,
    });
  }

  return items;
}

function collectActions(planner: PlannerResultsResponse): PlannerAction[] {
  if (Array.isArray(planner.actions) && planner.actions.length) return planner.actions;

  const fromPlan = planner.thirty_day_action_plan?.actions;
  if (Array.isArray(fromPlan) && fromPlan.length) return fromPlan;

  const weeks = planner.weeks || planner.thirty_day_action_plan?.weeks;
  if (weeks && typeof weeks === "object") {
    return Object.values(weeks).flatMap((list) => (Array.isArray(list) ? list : []));
  }

  return [];
}

function collectCalendarItems(planner: PlannerResultsResponse): PlannerCalendarItem[] {
  const calendar = planner.content_calendar;
  if (!calendar) return [];
  if (Array.isArray(calendar.items) && calendar.items.length) return calendar.items;

  if (calendar.phases && typeof calendar.phases === "object") {
    return Object.values(calendar.phases).flatMap((list) => (Array.isArray(list) ? list : []));
  }

  return [];
}

function resolveStartDate(planner: PlannerResultsResponse): Date {
  const candidates = [
    planner.content_calendar?.start_date,
    planner.meta?.timestamp,
    planner.created_at,
  ];

  for (const value of candidates) {
    if (!value) continue;
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return startOfDay(parsed);
  }

  return startOfDay(new Date());
}

export function buildPlannerEvents(data?: PlannerResultsResponse | null): PlannerEvent[] {
  const planner = unwrapPlannerResult(data);
  if (!planner) return [];

  const datedItems = collectCalendarItems(planner);
  if (datedItems.length) {
    const events: PlannerEvent[] = [];
    datedItems.forEach((item, index) => {
      if (!item.date) return;
      const date = startOfDay(new Date(item.date));
      if (Number.isNaN(date.getTime())) return;
      events.push({
        id: item.id || `cal-${item.date}-${index}`,
        date,
        title: item.title || item.topic || item.format || "Scheduled content",
        description: item.caption || item.reason || item.hook,
        platform: item.platform,
        format: item.format,
        priority:
          typeof item.priority_score === "number"
            ? String(item.priority_score)
            : item.priority,
        why: item.reason,
        phase: item.phase,
        what_to_do: item.title || item.topic || item.caption,
      });
    });
    return events;
  }

  const start = resolveStartDate(planner);
  const actions = collectActions(planner);

  return actions.map((action, index) => {
    const week = typeof action.week === "number" && action.week > 0 ? action.week : 1;
    const day = typeof action.day === "number" && action.day > 0 ? action.day : 1;
    const offset = (week - 1) * 7 + (day - 1);
    const date = addDays(start, offset);

    return {
      id: `action-${week}-${day}-${index}`,
      date,
      title: action.what_to_do || action.action || action.title || `Week ${week} action`,
      description: action.why,
      platform: action.platform,
      format: action.format,
      priority: action.priority,
      why: action.why,
      owner: action.owner,
      phase: action.timeline || `Week ${week}`,
      what_to_do: action.what_to_do || action.action || action.title,
    };
  });
}

export function getPlannerSummary(data?: PlannerResultsResponse | null): string {
  const planner = unwrapPlannerResult(data);
  if (!planner) return "";
  return (
    planner.summary ||
    planner.thirty_day_action_plan?.summary ||
    planner.content_calendar?.source_plan_summary ||
    ""
  );
}

export function getPlannerPlanDays(data?: PlannerResultsResponse | null): number {
  const planner = unwrapPlannerResult(data);
  const days =
    planner?.content_calendar?.days ||
    planner?.plan_days ||
    planner?.thirty_day_action_plan?.plan_days ||
    30;
  return typeof days === "number" && days > 0 ? days : 30;
}
