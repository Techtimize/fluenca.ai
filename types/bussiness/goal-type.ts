import type { GoalMetric, GoalPlatform } from "@/lib/goals/goal-form";
import type {
  GoalProgress,
  SocialGrowthResponse,
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
  mode: GoalMode;
  objective: string;
  description: string;
  platform: GoalPlatform;
  metric: GoalMetric;
  baseline_value: number | null;
  target_value: number;
  lower_is_better: boolean;
  deadline: string;
  constraints: GoalConstraints;
}

export type Goal = CreateGoalRequest & {
  id: string;
  company_id?: string;
  user_id?: string;
  status: GoalStatus;
  approved_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type GoalTask = {
  id: string;
  task: string;
  platform: string;
  priority: string;
  due_at: string;
  topic: string;
  requires_approval: boolean;
  status: string;
  approved_by?: string;
};

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
