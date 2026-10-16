import type { CreateGoalRequest, Goal, GoalProgressResponse } from "@/types/bussiness/goal-type";

export type GoalPlatform =
  | "instagram"
  | "linkedin"
  | "facebook"
  | "x";

export type GoalMetric = "followers" | "engagement_rate" | "leads";

/** What the user picks; buildCreateGoalRequest turns it into the POST /goal payload. */
export type GoalFormValues = {
  platform: GoalPlatform;
  metric: GoalMetric;
  /** baseline_value; number fields stay strings while being typed. */
  currentValue: string;
  /** target_value */
  targetValue: string;
  /** yyyy-mm-dd */
  deadline: string;
};

export const GOAL_PLATFORMS: {
  id: GoalPlatform;
  label: string;
  iconSrc?: string;
}[] = [
  { id: "instagram", label: "Instagram", iconSrc: "/assets/insta.png" },
  { id: "linkedin", label: "LinkedIn", iconSrc: "/assets/linkedin.png" },
  { id: "facebook", label: "Facebook" },
  { id: "x", label: "X", iconSrc: "/assets/x.png" },
];

export const GOAL_METRICS: {
  id: GoalMetric;
  label: string;
  unit: string;
  hint: string;
}[] = [
  {
    id: "followers",
    label: "Followers",
    unit: "followers",
    hint: "Grow audience size on the selected platform",
  },
  {
    id: "engagement_rate",
    label: "Engagement rate",
    unit: "%",
    hint: "Improve likes, comments, and shares relative to reach",
  },
  {
    id: "leads",
    label: "Qualified leads",
    unit: "leads / month",
    hint: "Drive inbound leads from content and profile CTAs",
  },
];

export const GOAL_DURATIONS = [
  { days: 30, label: "30 days" },
  { days: 60, label: "60 days" },
  { days: 90, label: "90 days" },
] as const;

export const MIN_GOAL_DAYS = 7;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Local yyyy-mm-dd, the format a date input uses. */
export function toDateInput(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function deadlineInDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toDateInput(date);
}

function parseDateInput(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Whole days from today to a yyyy-mm-dd deadline; null when unset or invalid. */
export function daysUntil(deadline: string) {
  const date = deadline ? parseDateInput(deadline) : null;
  if (!date) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((date.getTime() - today.getTime()) / DAY_MS);
}

function formatDeadline(deadline: string) {
  const date = parseDateInput(deadline);
  if (!date) return "—";
  return date.toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function createInitialGoalForm(): GoalFormValues {
  return {
    platform: "instagram",
    metric: "followers",
    currentValue: "",
    targetValue: "",
    deadline: deadlineInDays(90),
  };
}

export function parseGoalNumber(value: string) {
  const cleaned = value.replace(/,/g, "").trim();
  if (!cleaned) return null;
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

export function formatGoalNumber(value: number, metric: GoalMetric) {
  if (metric === "engagement_rate") {
    return `${value}%`;
  }
  return new Intl.NumberFormat("en", {
    notation: value >= 10000 ? "compact" : "standard",
    maximumFractionDigits: value >= 10000 ? 1 : 0,
  }).format(value);
}

export function buildGoalPrompt(form: GoalFormValues) {
  const platform =
    GOAL_PLATFORMS.find((item) => item.id === form.platform)?.label ||
    form.platform;
  const current = parseGoalNumber(form.currentValue);
  const target = parseGoalNumber(form.targetValue);
  const days = daysUntil(form.deadline) ?? 0;

  if (form.metric === "followers") {
    return `Grow ${platform} from ${current ?? "current"} to ${target} followers in ${days} days. Diagnose my current situation, build a measurable weekly plan, prepare execution tasks, and include learning/optimization recommendations.`;
  }

  if (form.metric === "engagement_rate") {
    return `Increase ${platform} engagement rate from ${current ?? "current"}% to ${target}% in ${days} days. Diagnose my current situation, build a measurable weekly plan, prepare execution tasks, and include learning/optimization recommendations.`;
  }

  return `Generate ${target} qualified leads per month on ${platform} over the next ${days} days${
    current != null ? ` (currently about ${current} leads/month)` : ""
  }. Diagnose my current situation, build a measurable weekly plan, prepare execution tasks, and include learning/optimization recommendations.`;
}

export function summarizeGoal(form: GoalFormValues) {
  const platform =
    GOAL_PLATFORMS.find((item) => item.id === form.platform)?.label ||
    form.platform;
  const current = parseGoalNumber(form.currentValue);
  const target = parseGoalNumber(form.targetValue);
  const metric = GOAL_METRICS.find((item) => item.id === form.metric);
  const deadline = formatDeadline(form.deadline);

  if (form.metric === "leads") {
    return `${target ?? "—"} ${metric?.unit || "leads"} on ${platform} by ${deadline}`;
  }

  return `${platform}: ${
    current != null ? formatGoalNumber(current, form.metric) : "—"
  } → ${target != null ? formatGoalNumber(target, form.metric) : "—"} by ${deadline}`;
}

/** The first problem with the form, matching what POST /goal refuses; null when valid. */
export function getGoalFormError(form: GoalFormValues): string | null {
  const current = parseGoalNumber(form.currentValue);
  const target = parseGoalNumber(form.targetValue);
  if (target == null || target <= 0) return "Enter a target above 0.";
  if (form.currentValue.trim() && current == null) {
    return "Current value must be a number.";
  }
  if (
    form.metric === "engagement_rate" &&
    (target > 100 || (current != null && (current < 0 || current > 100)))
  ) {
    return "Engagement rate must be between 0 and 100%.";
  }
  if (current != null && target <= current && form.metric !== "leads") {
    return "Target must be higher than the current value.";
  }

  const days = daysUntil(form.deadline);
  if (days == null) return "Pick a deadline.";
  if (days < MIN_GOAL_DAYS) {
    return `Deadline must be at least ${MIN_GOAL_DAYS} days away.`;
  }
  return null;
}

export function isGoalFormValid(form: GoalFormValues) {
  return getGoalFormError(form) == null;
}

export function buildCreateGoalRequest(form: GoalFormValues): CreateGoalRequest {
  return {
    platform: form.platform,
    metric: form.metric,
    baseline_value: parseGoalNumber(form.currentValue),
    target_value: parseGoalNumber(form.targetValue) ?? 0,
    // Followers, engagement rate and leads all improve upward.
    lower_is_better: false,
    deadline: `${form.deadline}T00:00:00Z`,
    description: buildGoalPrompt(form),
  };
}

/** Rebuild the wizard form from a saved goal. */
export function goalToForm(goal: Goal): GoalFormValues {
  const defaults = createInitialGoalForm();
  const baseline = goal.baseline_value ?? goal.baseline;
  const target = goal.target_value ?? goal.target;
  const deadline = new Date(goal.deadline);

  return {
    platform: goal.platform,
    metric: goal.metric,
    currentValue: baseline != null ? String(baseline) : "",
    targetValue: target != null ? String(target) : "",
    // Deadlines are midnight UTC, so read the UTC date to avoid shifting a day.
    deadline: Number.isNaN(deadline.getTime())
      ? defaults.deadline
      : deadline.toISOString().slice(0, 10),
  };
}

/** Progress (0–100) toward the goal's own metric, when the backend measures it. */
export function goalMetricProgress(
  metric: GoalMetric,
  progress?: Record<string, unknown> | null,
) {
  if (!progress) return null;
  const value =
    metric === "followers" ? progress.followers : metric === "engagement_rate" ? progress.engagement : null;
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/** GET /goal/{id}/progress may return the measurements flat or nested under goal_progress / progress. */
export function flattenGoalProgress(raw?: GoalProgressResponse | null): Record<string, unknown> {
  if (!raw) return {};
  const nested = raw.goal_progress ?? raw.progress;
  return nested && typeof nested === "object" ? { ...raw, ...nested } : raw;
}

const PROGRESS_PCT_KEYS = ["progress_pct", "progress_percent", "percent_complete", "pct_complete"];
const EXPECTED_PCT_KEYS = ["expected_pct", "expected_progress_pct", "expected_percent", "expected_progress"];

function firstPercent(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "number" && Number.isFinite(value)) return Math.min(100, Math.max(0, value));
  }
  return null;
}

/**
 * Actual vs expected progress (0–100) for a goal. Prefers the backend's progress_pct / expected_pct;
 * falls back to the goal metric's progress, and to time elapsed between creation and deadline.
 */
export function goalProgressPercents(goal: Goal, raw?: GoalProgressResponse | null) {
  const source = flattenGoalProgress(raw);
  const progress = firstPercent(source, PROGRESS_PCT_KEYS) ?? goalMetricProgress(goal.metric, source);

  let expected = firstPercent(source, EXPECTED_PCT_KEYS);
  const expectedIsEstimate = expected == null;
  if (expected == null && goal.created_at) {
    const start = new Date(goal.created_at).getTime();
    const end = new Date(goal.deadline).getTime();
    if (Number.isFinite(start) && Number.isFinite(end) && end > start) {
      expected = Math.min(100, Math.max(0, ((Date.now() - start) / (end - start)) * 100));
    }
  }

  return {
    progress: progress != null ? Math.round(progress) : null,
    expected: expected != null ? Math.round(expected) : null,
    expectedIsEstimate,
  };
}
