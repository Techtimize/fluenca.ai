"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronRight, ClipboardList, Loader2, Pause, Play, Trash2, TrendingUp } from "lucide-react";
import GoalPlanDialog from "@/components/dashboard/goals/GoalPlanDialog";
import GoalProgressDialog from "@/components/dashboard/goals/GoalProgressDialog";
import { FacebookIcon } from "@/components/shared/brandIcons";
import {
  DeleteGoalMutation,
  PauseGoalMutation,
  ResumeGoalMutation,
} from "@/routes/bussiness/Bussiness-Mutation";
import {
  GOAL_PLATFORMS,
  flattenGoalProgress,
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
  const [planOpen, setPlanOpen] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const deleteGoal = DeleteGoalMutation();
  const pauseGoal = PauseGoalMutation();
  const resumeGoal = ResumeGoalMutation();
  const { data: goals } = CompanyGoalsQuery();
  const goal = pickCurrentGoal(goals);
  const { data: goalProgress } = GoalProgressQuery(
    goal && goal.status !== "draft" ? goal.id : null,
  );

  if (!goal) return null;

  const platform = GOAL_PLATFORMS.find((item) => item.id === goal.platform);
  const progress = goalMetricProgress(goal.metric, flattenGoalProgress(goalProgress));
  const percent =
    progress != null ? Math.min(100, Math.max(0, Math.round(progress))) : null;
  const waiting = goal.tasks_waiting_for_approval ?? 0;
  // A draft has no plan until it has been diagnosed.
  const hasPlan = goal.status !== "draft";

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF]">
      <button
        type="button"
        onClick={() => onOpen(goal.id)}
        className={`group block w-full p-3.5 text-left transition-colors hover:bg-[#F1F2FD] ${FOCUS_RING}`}
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
      <div className="flex items-center border-t border-[#E6E8F5] bg-white">
        {confirmingDelete ? (
          <div className="flex w-full flex-wrap items-center justify-between gap-2 px-3.5 py-2" role="alert">
            <span className="text-[13px] font-medium text-neutral-800">Delete this goal?</span>
            <span className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                disabled={deleteGoal.isPending}
                className={`rounded-full px-3 py-1.5 text-[12px] font-medium text-neutral-600 hover:bg-neutral-100 ${FOCUS_RING}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  deleteGoal.mutate(goal.id, { onSettled: () => setConfirmingDelete(false) })
                }
                disabled={deleteGoal.isPending}
                className={`inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-3 py-1.5 text-[12px] font-medium text-white hover:bg-rose-700 disabled:opacity-60 ${FOCUS_RING}`}
              >
                {deleteGoal.isPending ? (
                  <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <Trash2 className="size-3.5" aria-hidden="true" />
                )}
                Delete
              </button>
            </span>
          </div>
        ) : (
          <>
            {hasPlan ? (
              <button
                type="button"
                onClick={() => setPlanOpen(true)}
                className={`flex flex-1 items-center justify-center gap-1.5 px-3.5 py-2.5 text-[13px] font-medium text-[#4544C9] transition-colors hover:bg-[#F6F5FF] ${FOCUS_RING}`}
              >
                <ClipboardList className="size-4" aria-hidden="true" />
                View plan
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setProgressOpen(true)}
              className={`flex flex-1 items-center justify-center gap-1.5 px-3.5 py-2.5 text-[13px] font-medium text-[#4544C9] transition-colors hover:bg-[#F6F5FF] ${
                hasPlan ? "border-s border-[#E6E8F5]" : ""
              } ${FOCUS_RING}`}
            >
              <TrendingUp className="size-4" aria-hidden="true" />
              Performance
            </button>
            {goal.status === "active" || goal.status === "paused" ? (
              <button
                type="button"
                onClick={() =>
                  goal.status === "active" ? pauseGoal.mutate(goal.id) : resumeGoal.mutate(goal.id)
                }
                disabled={pauseGoal.isPending || resumeGoal.isPending}
                aria-label={goal.status === "active" ? "Pause goal" : "Resume goal"}
                title={goal.status === "active" ? "Pause goal" : "Resume goal"}
                className={`grid size-10 shrink-0 place-items-center border-s border-[#E6E8F5] text-neutral-500 transition-colors hover:bg-[#F6F5FF] hover:text-[#4544C9] disabled:opacity-60 ${FOCUS_RING}`}
              >
                {pauseGoal.isPending || resumeGoal.isPending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : goal.status === "active" ? (
                  <Pause className="size-4" aria-hidden="true" />
                ) : (
                  <Play className="size-4" aria-hidden="true" />
                )}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              aria-label="Delete goal"
              title="Delete goal"
              className={`grid size-10 shrink-0 place-items-center border-s border-[#E6E8F5] text-neutral-400 transition-colors hover:bg-rose-50 hover:text-rose-600 ${FOCUS_RING}`}
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </button>
          </>
        )}
      </div>
      <GoalPlanDialog
        goal={goal}
        open={planOpen}
        onOpenChange={setPlanOpen}
      />
      <GoalProgressDialog goal={goal} open={progressOpen} onOpenChange={setProgressOpen} />
    </div>
  );
}
