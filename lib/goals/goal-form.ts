export type GoalPlatform =
  | "instagram"
  | "linkedin"
  | "facebook"
  | "x"
  | "tiktok"
  | "reddit";

export type GoalMetric = "followers" | "engagement_rate" | "leads";

export type GoalFormValues = {
  platform: GoalPlatform;
  metric: GoalMetric;
  currentValue: string;
  targetValue: string;
  durationDays: number;
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
  { id: "tiktok", label: "TikTok", iconSrc: "/assets/tik-tok.png" },
  { id: "reddit", label: "Reddit", iconSrc: "/assets/reddit.png" },
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
  const days = form.durationDays;

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

  if (form.metric === "leads") {
    return `${target ?? "—"} ${metric?.unit || "leads"} on ${platform} in ${form.durationDays} days`;
  }

  return `${platform}: ${
    current != null ? formatGoalNumber(current, form.metric) : "—"
  } → ${target != null ? formatGoalNumber(target, form.metric) : "—"} in ${form.durationDays} days`;
}

export function isGoalFormValid(form: GoalFormValues) {
  const current = parseGoalNumber(form.currentValue);
  const target = parseGoalNumber(form.targetValue);
  if (target == null || target <= 0) return false;
  if (form.currentValue.trim() && current == null) return false;
  if (current != null && target <= current && form.metric !== "leads") {
    return false;
  }
  if (![30, 60, 90].includes(form.durationDays) && form.durationDays < 7) {
    return false;
  }
  return true;
}
