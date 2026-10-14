"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { FacebookIcon } from "@/components/shared/brandIcons";
import {
  GOAL_PLATFORMS,
  goalMetricProgress,
  goalToForm,
  summarizeGoal,
} from "@/lib/goals/goal-form";
import {
  CompanyGoalsQuery,
  GoalProgressQuery,
} from "@/routes/bussiness/Bussiness-Query";
import type { Goal, GoalStatus } from "@/types/bussiness/goal-type";
import { FOCUS_RING } from "@/utils/ui-classes";

const HIDDEN_STATUSES: GoalStatus[] = ["cancelled"];

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-[#F0F1F8] text-neutral-600",
  diagnosed: "bg-[#ECEBFF] text-[#5B57E6]",
  active: "bg-[#DCFCE7] text-[#047857]",
  paused: "bg-[#FEF3C7] text-[#B45309]",
  completed: "bg-[#DCFCE7] text-[#047857]",
  failed: "bg-[#FFE4E6] text-[#BE123C]",
};

/** The list comes newest first; show the latest goal that hasn't been cancelled. */
function pickCurrentGoal(goals?: Goal[]) {
  return goals?.find((goal) => !HIDDEN_STATUSES.includes(goal.status));
}

type Props = {
  onOpen: (goalId: string) => void;
};

export default function CurrentGoalSummary({ onOpen }: Props) {
  const { data: goals } = CompanyGoalsQuery();
  const goal = pickCurrentGoal(goals);
  const { data: goalProgress } = GoalProgressQuery(
    goal && goal.status !== "draft" ? goal.id : null,
  );

  if (!goal) return null;

  const platform = GOAL_PLATFORMS.find((item) => item.id === goal.platform);
  const progress = goalMetricProgress(goal.metric, goalProgress);
  const percent =
    progress != null ? Math.min(100, Math.max(0, Math.round(progress))) : null;
  const waiting = goal.tasks_waiting_for_approval ?? 0;

  return (
    <button
      type="button"
      onClick={() => onOpen(goal.id)}
      className={`group mt-4 w-full rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-3.5 text-left transition-colors hover:bg-[#F1F2FD] ${FOCUS_RING}`}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
          Current goal
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
            STATUS_STYLES[goal.status] ?? STATUS_STYLES.draft
          }`}
        >
          {goal.status}
        </span>
      </span>

      <span className="mt-2 flex items-center gap-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-white ring-1 ring-[#E6E8F5]">
          {goal.platform === "facebook" ? (
            <FacebookIcon className="size-4 text-[#1877F2]" />
          ) : platform?.iconSrc ? (
            <Image
              src={platform.iconSrc}
              alt=""
              width={16}
              height={16}
              className="size-4 object-contain"
            />
          ) : null}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-semibold text-neutral-900">
            {summarizeGoal(goalToForm(goal))}
          </span>
          <span className="block text-[12px] text-neutral-500">
            Due {new Date(goal.deadline).toLocaleDateString()}
          </span>
        </span>
        <ChevronRight
          className="size-4 shrink-0 text-neutral-500 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>

      {waiting > 0 ? (
        <span className="mt-3 block rounded-xl border border-[#F3E7DC] bg-[#FFFBF7] px-2.5 py-1.5 text-[12px] text-neutral-700">
          {waiting} task{waiting === 1 ? "" : "s"} waiting for your approval
        </span>
      ) : null}

      {percent != null ? (
        <span className="mt-3 block">
          <span className="flex justify-between text-[11px] text-neutral-500">
            <span>Progress</span>
            <span className="font-semibold text-neutral-700">{percent}%</span>
          </span>
          <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-[#E6E8F5]">
            <span
              className="block h-full rounded-full bg-linear-to-r from-[#4F46E5] to-[#8B5CF6]"
              style={{ width: `${percent}%` }}
            />
          </span>
        </span>
      ) : null}
    </button>
  );
}
