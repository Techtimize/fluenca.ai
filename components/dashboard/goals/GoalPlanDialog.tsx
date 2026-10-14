"use client";

import type { ReactNode } from "react";
import { ArrowRight, CalendarClock, CheckCircle2, Circle, ClipboardList, FlaskConical, Layers, Loader2, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getApiErrorMessage } from "@/errors/error-utils";
import { goalToForm, summarizeGoal } from "@/lib/goals/goal-form";
import { normalizeSocialGrowthResponse } from "@/lib/goals/normalize-growth";
import { GoalPlanQuery } from "@/routes/bussiness/Bussiness-Query";
import type { Goal, GoalPlanResponse } from "@/types/bussiness/goal-type";
import type { SocialGrowthTask } from "@/types/bussiness/socail-growth-type";

const DONE_STATUSES = ["done", "completed"];

function Section({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
        <Icon className="size-3.5 text-[#5B57E6]" aria-hidden="true" />
        {title}
      </h3>
      <div className="mt-2.5">{children}</div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] px-3.5 py-3">
      <p className="truncate text-[11px] text-neutral-500">{label}</p>
      <p className="mt-1 truncate text-[14px] font-semibold capitalize text-neutral-900">{value}</p>
    </div>
  );
}

function TaskRow({ task }: { task: SocialGrowthTask }) {
  const done = DONE_STATUSES.includes(String(task.status).toLowerCase());
  return (
    <li className="flex items-start gap-3 rounded-2xl border border-[#E6E8F5] px-3.5 py-3">
      {done ? (
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#047857]" aria-label="Done" />
      ) : (
        <Circle className="mt-0.5 size-4 shrink-0 text-neutral-300" aria-label="Not done" />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-neutral-900">{task.task}</p>
        <p className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-neutral-500">
          {task.status ? <span className="capitalize">{String(task.status).replaceAll("_", " ")}</span> : null}
          {task.platform ? <span>{task.platform}</span> : null}
          {task.priority ? <span>Priority · {task.priority}</span> : null}
          {task.due_at ? <span>Due {new Date(task.due_at).toLocaleDateString()}</span> : null}
        </p>
      </div>
    </li>
  );
}

/** The plan may come at the top level or nested under plan / growth_result. */
function planSource(data?: GoalPlanResponse | null) {
  if (!data) return null;
  return data.plan ?? data.growth_result ?? data;
}

type Props = {
  goal: Goal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Read-only view of a goal's plan, loaded from GET /goal/{id}/plan. */
export default function GoalPlanDialog({ goal, open, onOpenChange }: Props) {
  const { data, isLoading, isError, error } = GoalPlanQuery(open ? goal.id : null);
  const plan = normalizeSocialGrowthResponse(planSource(data));
  // Task records with ids sit beside the plan once it is approved; otherwise use the plan's own.
  const tasks: SocialGrowthTask[] = Array.isArray(data?.tasks) && data.tasks.length ? data.tasks : (plan?.tasks ?? []);
  const actions = plan?.strategy?.strategy ?? [];
  const pillars = plan?.content_plan?.pillars ?? [];
  const experiments = plan?.strategy?.opportunities_used ?? [];
  const schedule = plan?.platform_strategies?.[goal.platform]?.posting_schedule;
  const isEmpty = !actions.length && !pillars.length && !experiments.length && !tasks.length && !schedule;
  const doneCount = tasks.filter((task) => DONE_STATUSES.includes(String(task.status).toLowerCase())).length;

  let body: ReactNode;
  if (isLoading) {
    body = (
      <div className="grid place-items-center py-16 text-neutral-400">
        <Loader2 className="size-5 animate-spin" aria-label="Loading plan" />
      </div>
    );
  } else if (isError) {
    body = (
      <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-700">
        {getApiErrorMessage(error, "Couldn't load this plan. Try again.")}
      </p>
    );
  } else if (!plan || isEmpty) {
    body = (
      <p className="rounded-2xl border border-dashed border-[#E6E8F5] px-4 py-8 text-center text-[13px] text-neutral-500">
        No plan yet. Diagnose this goal to build one.
      </p>
    );
  } else {
    body = (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Status" value={goal.status.replaceAll("_", " ")} />
          <Stat label="Deadline" value={new Date(goal.deadline).toLocaleDateString()} />
          <Stat label="Tasks done" value={tasks.length ? `${doneCount} / ${tasks.length}` : "—"} />
          <Stat
            label="Approved"
            value={goal.approved_at ? new Date(goal.approved_at).toLocaleDateString() : "Not yet"}
          />
        </div>

        {schedule ? (
          <Section icon={CalendarClock} title="Posting schedule">
            <div className="grid grid-cols-3 gap-2">
              <Stat label="Reels / week" value={String(schedule.reels_per_week)} />
              <Stat label="Carousels / week" value={String(schedule.carousels_per_week)} />
              <Stat label="Stories" value={schedule.stories_daily ? "Daily" : "As needed"} />
            </div>
          </Section>
        ) : null}

        <Section icon={Target} title="Strategy">
          {actions.length ? (
            <ul className="space-y-2">
              {actions.map((action, index) => (
                <li key={`${action.objective}-${index}`} className="rounded-2xl border border-[#E6E8F5] p-3.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#ECEBFF] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-[#5B57E6]">
                      {action.platform || "All"}
                    </span>
                    {action.kpi ? <span className="text-[11px] text-neutral-500">KPI · {action.kpi}</span> : null}
                  </div>
                  <p className="mt-2 text-[13px] font-semibold text-neutral-900">{action.objective}</p>
                  {action.why ? <p className="mt-1 text-[12px] leading-5 text-neutral-600">{action.why}</p> : null}
                  {action.actions?.length ? (
                    <ul className="mt-2 space-y-1">
                      {action.actions.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-[12px] text-neutral-700">
                          <ArrowRight className="mt-0.5 size-3 shrink-0 text-[#5B57E6]" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-neutral-500">No strategy actions in this plan.</p>
          )}
        </Section>

        {pillars.length ? (
          <Section icon={Layers} title="Content themes">
            <ul className="grid gap-2 sm:grid-cols-2">
              {pillars.map((pillar, index) => (
                <li key={`${pillar.name}-${index}`} className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-3.5">
                  <p className="text-[13px] font-semibold text-neutral-900">{pillar.name}</p>
                  {pillar.description ? (
                    <p className="mt-1 text-[12px] leading-5 text-neutral-600">{pillar.description}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {experiments.length ? (
          <Section icon={FlaskConical} title="Experiments">
            <ul className="space-y-2">
              {experiments.map((item, index) => (
                <li key={`${item.opportunity}-${index}`} className="rounded-xl border border-[#D1FAE5] bg-[#F7FFFB] px-3 py-2.5">
                  <p className="text-[13px] font-semibold text-neutral-900">{item.opportunity}</p>
                  {item.reason ? <p className="mt-1 text-[12px] text-neutral-600">{item.reason}</p> : null}
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        <Section icon={ClipboardList} title="Tasks">
          {tasks.length ? (
            <ul className="space-y-2">
              {tasks.map((task, index) => (
                <TaskRow key={task.id || `${task.task}-${index}`} task={task} />
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-neutral-500">No tasks yet.</p>
          )}
        </Section>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="flex max-h-[min(92vh,880px)] w-full max-w-[calc(100%-1rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-2xl sm:rounded-3xl"
      >
        <DialogHeader className="shrink-0 border-b border-[#EEF0F8] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_55%)] px-4 py-4 pe-12 sm:px-6 sm:py-5">
          <DialogTitle className="text-[18px] font-semibold tracking-tight text-neutral-900">Current plan</DialogTitle>
          <DialogDescription className="mt-1 text-[13px] leading-5 text-neutral-500">
            {summarizeGoal(goalToForm(goal))}
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">{body}</div>
      </DialogContent>
    </Dialog>
  );
}
