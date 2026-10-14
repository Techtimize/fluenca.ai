"use client";

import { Loader2, RotateCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getApiErrorMessage } from "@/errors/error-utils";
import { GOAL_METRICS, flattenGoalProgress, formatGoalNumber, goalToForm, summarizeGoal } from "@/lib/goals/goal-form";
import { GoalProgressQuery } from "@/routes/bussiness/Bussiness-Query";
import type { Goal } from "@/types/bussiness/goal-type";
import { FOCUS_RING } from "@/utils/ui-classes";

/** Fields shown in their own rows, so they are left out of "Other measurements". */
const KNOWN_KEYS = new Set(["followers", "engagement", "goal_progress", "progress", "goal_id", "id"]);

function asPercent(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? Math.min(100, Math.max(0, Math.round(value))) : null;
}

function humanize(key: string) {
  const text = key.replaceAll("_", " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatValue(value: unknown) {
  if (typeof value === "number") return Number.isInteger(value) ? value.toLocaleString() : value.toFixed(2);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string") {
    const date = /^\d{4}-\d{2}-\d{2}T/.test(value) ? new Date(value) : null;
    return date && !Number.isNaN(date.getTime()) ? date.toLocaleString() : value;
  }
  return null;
}

function ProgressRow({ label, percent, highlight = false }: { label: string; percent: number | null; highlight?: boolean }) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3.5 ${
        highlight ? "border-[#C7C4FB] bg-[#F6F5FF]" : "border-[#E6E8F5] bg-white"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] font-medium text-neutral-800">{label}</p>
        <p className="text-[15px] font-semibold text-neutral-900">{percent != null ? `${percent}%` : "—"}</p>
      </div>
      <div
        className="mt-2.5 h-2 overflow-hidden rounded-full bg-[#E6E8F5]"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent ?? undefined}
      >
        <div
          className="h-full rounded-full bg-linear-to-r from-[#4F46E5] to-[#8B5CF6]"
          style={{ width: `${percent ?? 0}%` }}
        />
      </div>
    </div>
  );
}

type Props = {
  goal: Goal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** A goal's measured performance, from GET /goal/{id}/progress. */
export default function GoalProgressDialog({ goal, open, onOpenChange }: Props) {
  const { data, isLoading, isError, error, refetch, isFetching } = GoalProgressQuery(open ? goal.id : null);
  const progress = flattenGoalProgress(data);
  const followers = asPercent(progress.followers);
  const engagement = asPercent(progress.engagement);
  const metric = GOAL_METRICS.find((item) => item.id === goal.metric);
  const goalPercent = goal.metric === "followers" ? followers : goal.metric === "engagement_rate" ? engagement : null;
  const baseline = goal.baseline_value ?? goal.baseline;
  const target = goal.target_value ?? goal.target;
  const others = Object.entries(progress)
    .filter(([key]) => !KNOWN_KEYS.has(key))
    .map(([key, value]) => [humanize(key), formatValue(value)] as const)
    .filter((entry): entry is readonly [string, string] => entry[1] != null && entry[1] !== "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="flex max-h-[min(92vh,760px)] w-full max-w-[calc(100%-1rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-lg sm:rounded-3xl"
      >
        <DialogHeader className="shrink-0 border-b border-[#EEF0F8] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_55%)] px-4 py-4 pe-12 sm:px-6 sm:py-5">
          <DialogTitle className="text-[18px] font-semibold tracking-tight text-neutral-900">Goal performance</DialogTitle>
          <DialogDescription className="mt-1 text-[13px] leading-5 text-neutral-500">
            {summarizeGoal(goalToForm(goal))}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 sm:p-6">
          {isLoading ? (
            <div className="grid place-items-center py-14 text-neutral-400">
              <Loader2 className="size-5 animate-spin" aria-label="Loading performance" />
            </div>
          ) : isError ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-700">
              {getApiErrorMessage(error, "Couldn't load this goal's performance.")}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] px-3.5 py-3">
                  <p className="text-[11px] text-neutral-500">Started at</p>
                  <p className="mt-1 text-[15px] font-semibold text-neutral-900">
                    {baseline != null ? formatGoalNumber(baseline, goal.metric) : "—"}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] px-3.5 py-3">
                  <p className="text-[11px] text-neutral-500">Target</p>
                  <p className="mt-1 text-[15px] font-semibold text-neutral-900">
                    {target != null ? formatGoalNumber(target, goal.metric) : "—"}
                  </p>
                </div>
              </div>

              {goal.metric === "leads" ? null : (
                <ProgressRow label={`${metric?.label ?? "Goal"} progress`} percent={goalPercent} highlight />
              )}
              {goal.metric !== "followers" ? <ProgressRow label="Follower progress" percent={followers} /> : null}
              {goal.metric !== "engagement_rate" ? <ProgressRow label="Engagement progress" percent={engagement} /> : null}

              {others.length ? (
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
                    Other measurements
                  </p>
                  <dl className="divide-y divide-[#EEF0F8] rounded-2xl border border-[#E6E8F5]">
                    {others.map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between gap-3 px-4 py-2.5 text-[13px]">
                        <dt className="text-neutral-500">{label}</dt>
                        <dd className="truncate font-medium text-neutral-900">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}

              {goal.status === "draft" ? (
                <p className="text-[12px] text-neutral-500">
                  This goal is still a draft. Progress is measured once its plan is approved.
                </p>
              ) : null}
            </>
          )}
        </div>

        <div className="flex shrink-0 justify-end border-t border-[#EEF0F8] px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium text-[#4544C9] hover:bg-[#EEF0FF] disabled:opacity-60 ${FOCUS_RING}`}
          >
            <RotateCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} aria-hidden="true" />
            Refresh
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
