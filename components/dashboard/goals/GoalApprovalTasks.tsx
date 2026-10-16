"use client";

import { Check, Loader2, X } from "lucide-react";
import { UpdateGoalTaskMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { GoalByIdQuery } from "@/routes/bussiness/Bussiness-Query";
import type { GoalTask, GoalTaskStatus } from "@/types/bussiness/goal-type";
import { FOCUS_RING } from "@/utils/ui-classes";

/** Statuses that mean the user has already acted on (or no longer needs to act on) a task. */
const SETTLED = new Set(["approved", "rejected", "done", "completed", "skipped", "cancelled", "failed"]);

export function isAwaitingApproval(task: GoalTask) {
  return Boolean(task.requires_approval) && !SETTLED.has(String(task.status ?? "").toLowerCase());
}

const BUTTON = `inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[12px] font-semibold transition-colors disabled:pointer-events-none disabled:opacity-55 ${FOCUS_RING}`;

/** Tasks the agent wants sign-off on, each with Approve / Reject on the right. */
export default function GoalApprovalTasks({ goalId, count }: { goalId: string; count: number }) {
  const { data, isLoading } = GoalByIdQuery(goalId);
  const updateTask = UpdateGoalTaskMutation();
  const tasks = (data?.tasks ?? []).filter(isAwaitingApproval);
  const busyTaskId = updateTask.isPending ? updateTask.variables?.task_id : null;

  const decide = (task: GoalTask, status: GoalTaskStatus) =>
    updateTask.mutate({ goal_id: goalId, task_id: task.id, status });

  return (
    <section className="border-t border-[#F3E7DC] bg-[#FFFBF7] px-3.5 py-3" aria-label="Tasks waiting for approval">
      <p className="text-[12px] font-semibold text-neutral-800">
        {count} task{count === 1 ? "" : "s"} waiting for your approval
      </p>

      {isLoading ? (
        <p className="mt-2 flex items-center gap-2 text-[12px] text-neutral-500">
          <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> Loading tasks…
        </p>
      ) : tasks.length ? (
        <ul className="mt-2 space-y-2">
          {tasks.map((task) => {
            const deciding = busyTaskId === task.id ? updateTask.variables?.status : null;
            return (
              <li
                key={task.id}
                className="flex flex-col gap-2 rounded-xl border border-[#F3E7DC] bg-white px-3 py-2.5 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-neutral-900">{task.task}</p>
                  <p className="mt-0.5 flex flex-wrap gap-x-2 text-[11px] text-neutral-500">
                    {task.platform ? <span className="capitalize">{task.platform}</span> : null}
                    {task.priority ? <span className="capitalize">Priority · {task.priority}</span> : null}
                    {task.due_at ? <span>Due {new Date(task.due_at).toLocaleDateString()}</span> : null}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1.5 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => decide(task, "rejected")}
                    disabled={updateTask.isPending}
                    className={`${BUTTON} border border-[#E6E8F5] bg-white text-neutral-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700`}
                  >
                    {deciding === "rejected" ? (
                      <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                    ) : (
                      <X className="size-3.5" aria-hidden="true" />
                    )}
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => decide(task, "approved")}
                    disabled={updateTask.isPending}
                    className={`${BUTTON} bg-[#5B57E6] text-white hover:bg-[#4A46D0]`}
                  >
                    {deciding === "approved" ? (
                      <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                    ) : (
                      <Check className="size-3.5" aria-hidden="true" />
                    )}
                    Approve
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-1 text-[12px] text-neutral-500">Nothing left to review.</p>
      )}
    </section>
  );
}
