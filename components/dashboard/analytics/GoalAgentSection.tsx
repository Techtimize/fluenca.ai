"use client";

import Link from "next/link";
import { ArrowRight, Target } from "lucide-react";
import GoalCard from "@/components/dashboard/goals/GoalCard";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { isOpenGoal } from "@/lib/goals/goal-form";
import { CompanyGoalsQuery } from "@/routes/bussiness/Bussiness-Query";
import { FOCUS_RING } from "@/utils/ui-classes";

function Stat({ label, value, loading }: { label: string; value: number; loading: boolean }) {
  return (
    <div className="rounded-2xl border border-[#E6E8F5] bg-white px-4 py-3">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums text-neutral-900">{loading ? "–" : value}</p>
    </div>
  );
}

/** What the goal agent is working on: open goals with progress, plus tasks waiting for sign-off. */
export default function GoalAgentSection() {
  const { data: goals = [], isLoading, isError } = CompanyGoalsQuery();
  const open = goals.filter(isOpenGoal);
  const completed = goals.filter((goal) => goal.status === "completed").length;
  const waiting = open.reduce((total, goal) => total + (goal.tasks_waiting_for_approval ?? 0), 0);

  return (
    <section className="space-y-3" aria-labelledby="goal-agent-heading">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="goal-agent-heading" className="text-lg font-semibold tracking-tight text-neutral-900">
            Goal agent
          </h2>
          <p className="text-[13px] text-neutral-500">Progress on your goals and the tasks waiting for you.</p>
        </div>
        <Link
          href={PAGE_ROUTES.GOALS}
          className={`inline-flex items-center gap-1 rounded text-[13px] font-medium text-[#5B57E6] hover:underline ${FOCUS_RING}`}
        >
          All goals
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Stat label="In progress" value={open.length} loading={isLoading} />
        <Stat label="Awaiting approval" value={waiting} loading={isLoading} />
        <Stat label="Completed" value={completed} loading={isLoading} />
      </div>

      {isLoading ? (
        <div className="h-40 animate-pulse rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF]" aria-busy="true" />
      ) : isError ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-700">
          Couldn&apos;t load your goals. Try again in a moment.
        </p>
      ) : open.length ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {open.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#E6E8F5] bg-white px-6 py-8 text-center">
          <span className="grid size-10 place-items-center rounded-full bg-[#EEF0FF] text-[#5B57E6]">
            <Target className="size-5" aria-hidden="true" />
          </span>
          <p className="mt-3 text-[14px] font-semibold text-neutral-900">No goal in progress</p>
          <p className="mt-1 max-w-sm text-[13px] text-neutral-500">
            Set a goal on the dashboard and the agent will plan and track it here.
          </p>
          <Link
            href={PAGE_ROUTES.DASHBOARD}
            className={`mt-3 inline-flex items-center gap-1 rounded text-[13px] font-medium text-[#5B57E6] hover:underline ${FOCUS_RING}`}
          >
            Go to dashboard
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      )}
    </section>
  );
}
