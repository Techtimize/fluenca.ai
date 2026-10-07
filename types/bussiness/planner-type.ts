export interface PlannerAction {
  week?: number;
  day?: number;
  platform?: string;
  what_to_do?: string;
  why?: string;
  format?: string;
  priority?: string;
  owner?: string;
  title?: string;
  action?: string;
  timeline?: string;
}

export interface PlannerCalendarItem {
  id?: string;
  day?: string;
  date?: string;
  platform?: string;
  format?: string;
  pillar?: string;
  topic?: string;
  goal?: string;
  phase?: string;
  media_type?: string;
  title?: string;
  hook?: string;
  caption?: string;
  cta?: string;
  reason?: string;
  priority?: string;
  priority_score?: number;
}

export interface PlannerContentCalendar {
  days?: number;
  start_date?: string;
  end_date?: string;
  skip_weekends?: boolean;
  source_plan_summary?: string;
  phases?: Record<string, PlannerCalendarItem[]>;
  items?: PlannerCalendarItem[];
}

export interface PlannerThirtyDayPlan {
  summary?: string;
  plan_days?: number;
  platforms?: string[];
  weeks?: Record<string, PlannerAction[]>;
  actions?: PlannerAction[];
  days_0_30?: PlannerAction[];
}

export interface PlannerMeta {
  duration_sec?: number;
  timestamp?: string;
  agent_mode?: string;
  actions_count?: number;
  status?: string;
  version?: string | number;
  planner_id?: string;
  prompt_id?: string;
}

export interface PlannerResultsResponse {
  success?: boolean;
  error?: string | null;
  message?: string;
  company_id?: string;
  platforms?: string[];
  plan_days?: number;
  summary?: string;
  actions?: PlannerAction[];
  weeks?: Record<string, PlannerAction[]>;
  thirty_day_action_plan?: PlannerThirtyDayPlan;
  content_calendar?: PlannerContentCalendar;
  logs?: string[];
  meta?: PlannerMeta;
  created_at?: string;
  result?: PlannerResultsResponse;
  [key: string]: unknown;
}

export type PlannerVersionsResponse =
  | Array<string | number | { version: string | number; created_at?: string; label?: string }>
  | {
      versions?: Array<string | number | { version: string | number; created_at?: string; label?: string }>;
      data?: Array<string | number | { version: string | number; created_at?: string; label?: string }>;
      items?: Array<string | number | { version: string | number; created_at?: string; label?: string }>;
      [key: string]: unknown;
    };
