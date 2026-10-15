"use client";

import { useState } from "react";
import { Loader2, Plus, Target } from "lucide-react";
import GoalCard from "@/components/dashboard/goals/GoalCard";
import GoalsDialog from "@/components/dashboard/goals/GoalsDialog";
import TopBar from "@/components/dashboard/topBar";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/errors/error-utils";
import { GoalsByCompanyQuery } from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";
import type { GoalStatus } from "@/types/bussiness/goal-type";
import { FOCUS_RING } from "@/utils/ui-classes";

type Filter = "all" | GoalStatus;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "paused", label: "Paused" },
  { id: "diagnosed", label: "Diagnosed" },
  { id: "draft", label: "Draft" },
  { id: "completed", label: "Completed" },
];

export default function GoalsPage() {
  const companyId = useAuthStore((s) => s.company_id);
  const companyName = useAuthStore((s) => s.company_name);
  const { data: goals = [], isLoading, isError, error, isFetching } = GoalsByCompanyQuery(companyId);
  const [filter, setFilter] = useState<Filter>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openGoalId, setOpenGoalId] = useState<string | null>(null);

  const counts: Partial<Record<Filter, number>> = { all: goals.length };
  for (const goal of goals) counts[goal.status] = (counts[goal.status] ?? 0) + 1;

  const visible = filter === "all" ? goals : goals.filter((goal) => goal.status === filter);

  const openGoal = (goalId: string | null) => {
    setOpenGoalId(goalId);
    setDialogOpen(true);
  };

  return (
    <main className="min-w-0 space-y-4 pb-6">
      <TopBar user={{ name: companyName || "User" }} placeholder="Search goals..." />

      <section className="rounded-[28px] border border-[#E6E8F5] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_55%)] p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5B57E6] ring-1 ring-[#E6E8F5]">
              <Target className="size-3.5" aria-hidden="true" />
              Goals
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">Your goals</h1>
            <p className="mt-2 max-w-2xl text-[14px] leading-6 text-neutral-600">
              Every goal for your company, with its plan, performance and status.
            </p>
          </div>
          <Button type="button" onClick={() => openGoal(null)} className="h-10 gap-2 rounded-full px-5">
            <Plus className="size-4" aria-hidden="true" />
            Set a goal
          </Button>
        </div>
      </section>

      {goals.length ? (
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter goals by status">
          {FILTERS.filter((item) => item.id === "all" || counts[item.id]).map((item) => {
            const selected = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setFilter(item.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${FOCUS_RING} ${
                  selected ? "bg-[#5452F6] text-white" : "bg-[#EEF0FF] text-neutral-800 hover:bg-[#E3E6FF]"
                }`}
              >
                {item.label}
                <span className={selected ? "text-white/80" : "text-neutral-500"}>{counts[item.id] ?? 0}</span>
              </button>
            );
          })}
          {isFetching && !isLoading ? (
            <Loader2 className="size-4 animate-spin text-[#5452F6]" aria-label="Updating goals" />
          ) : null}
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF]" />
          ))}
        </div>
      ) : isError ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-700">
          {getApiErrorMessage(error, "Couldn't load your goals.")}
        </p>
      ) : !goals.length ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-[#E6E8F5] bg-white px-6 py-14 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-[#EEF0FF] text-[#5452F6]">
            <Target className="size-6" aria-hidden="true" />
          </span>
          <p className="mt-3 text-[15px] font-semibold text-neutral-900">No goals yet</p>
          <p className="mt-1 max-w-sm text-[13px] text-neutral-500">
            Set a goal and Fluenca will diagnose where you are, build a plan and track it.
          </p>
          <Button type="button" onClick={() => openGoal(null)} className="mt-5 h-10 gap-2 rounded-full px-5">
            <Plus className="size-4" aria-hidden="true" />
            Set your first goal
          </Button>
        </div>
      ) : (
        <div className="grid items-start gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onOpen={openGoal} />
          ))}
        </div>
      )}

      <GoalsDialog open={dialogOpen} onOpenChange={setDialogOpen} goalId={openGoalId} />
    </main>
  );
}
