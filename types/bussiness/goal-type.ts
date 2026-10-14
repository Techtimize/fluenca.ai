import type { GoalMetric, GoalPlatform } from "@/lib/goals/goal-form";
import type {
  GoalProgress,
  SocialGrowthResponse,
  SocialGrowthTask,
} from "@/types/bussiness/socail-growth-type";

export type GoalMode = "individual" | "company";

export type GoalStatus =
  | "draft"
  | "diagnosed"
  | "active"
  | "paused"
  | "completed"
  | "failed"
  | "cancelled";

export type GoalTaskType =
  | "content_creation"
  | "content_curation"
  | "engagement"
  | "growth"
  | "analytics";

export type GoalTaskStatus = "done" | "pending" | "approved";

export type GoalConstraints = {
  posts_per_week: number;
  approve_everything: boolean;
  allowed_task_types: GoalTaskType[];
  budget_usd: number;
  notes: string;
};

export interface CreateGoalRequest {
  platform: GoalPlatform;
  metric: GoalMetric;
  baseline_value: number | null;
  target_value: number;
  lower_is_better: boolean;
  /** ISO date at midnight UTC, e.g. "2027-01-12T00:00:00Z". */
  deadline: string;
  description: string;
}

/** GoalResponse: list items name the values `baseline`/`target`; full goals may use `*_value`. */
export type Goal = Omit<CreateGoalRequest, "baseline_value" | "target_value"> & {
  id: string;
  /** Set by the backend; not part of the create payload. */
  mode?: GoalMode;
  objective?: string;
  constraints?: GoalConstraints;
  baseline?: number | null;
  target?: number;
  baseline_value?: number | null;
  target_value?: number;
  tasks_waiting_for_approval?: number;
  company_id?: string;
  user_id?: string;
  status: GoalStatus;
  approved_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type GoalTask = SocialGrowthTask & { id: string };

export type CreateGoalResponse = {
  goal_id: string;
  status: GoalStatus;
  goal: Goal;
};

export type DiagnoseGoalResponse = SocialGrowthResponse & {
  goal_id: string;
  status: GoalStatus;
};

export type GoalDetailResponse = {
  goal: Goal;
  growth_result: SocialGrowthResponse | null;
  tasks: GoalTask[];
  goal_progress: GoalProgress | null;
};

export type GoalListResponse = Goal[];

export type UpdateGoalTaskRequest = {
  goal_id: string;
  task_id: string;
  status: GoalTaskStatus;
};

/** GET /goal/{id}/progress: measured progress (0–100 per metric) plus whatever else the backend reports. */
export type GoalProgressResponse = Partial<GoalProgress> & {
  goal_progress?: Partial<GoalProgress> & Record<string, unknown>;
  progress?: Partial<GoalProgress> & Record<string, unknown>;
  [key: string]: unknown;
};

/** What the agent has learned across all of the company's goals. */
export type GoalLesson = Record<string, unknown>;

export type GoalLessonsResponse = GoalLesson[];

/**
 * GET /goal/{id}/plan: the goal's plan. Shaped like the diagnosis (strategy, content_plan, tasks…),
 * either at the top level or nested under plan / growth_result.
 */
export type GoalPlanResponse = {
  plan?: Record<string, unknown> | null;
  growth_result?: Record<string, unknown> | null;
  tasks?: GoalTask[];
  [key: string]: unknown;
};
