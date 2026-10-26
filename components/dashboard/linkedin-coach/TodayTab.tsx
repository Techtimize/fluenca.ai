"use client";

import type { ReactNode } from "react";
import { CheckCircle2, Circle, ExternalLink, Flame, Loader2, Star } from "lucide-react";
import { CopyButton, ErrorText, LABEL } from "@/components/dashboard/linkedin-growth/ui";
import { getApiErrorMessage } from "@/errors/error-utils";
import { ToggleCoachTaskMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { CoachTodayQuery } from "@/routes/bussiness/Bussiness-Query";
import { COACH_TASK_TYPES, type CoachTask, type CoachTaskType } from "@/types/bussiness/linkedin-coach-type";
import { FOCUS_RING } from "@/utils/ui-classes";
import DraftScheduler from "./DraftScheduler";
import FollowUpsPanel from "./FollowUpsPanel";

const GROUP_LABEL: Record<CoachTaskType, string> = {
  post: "Publish a post",
  comment: "Comment on posts in your niche",
  connect: "Connect with ideal customers",
  follow_up: "Follow up",
  profile_fix: "Fix your profile",
};

/** "Today on LinkedIn": the daily checklist, streak and points, then follow-ups. */
export default function TodayTab() {
  const todayQuery = CoachTodayQuery();
  const today = todayQuery.data;

  if (todayQuery.isLoading) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-[#E6E8F5] bg-white px-6 py-14 text-center" aria-live="polite">
        <Loader2 className="size-6 animate-spin text-[#0A66C2]" aria-hidden="true" />
        <p className="mt-3 text-[14px] font-semibold text-neutral-900">Building today&apos;s checklist…</p>
        <p className="mt-1 text-[13px] text-neutral-500">The first visit of the day can take up to a minute.</p>
      </div>
    );
  }

  if (todayQuery.isError || !today) {
    return <ErrorText>{getApiErrorMessage(todayQuery.error, "Could not build today's checklist")}</ErrorText>;
  }

  const doneCount = today.tasks.filter((task) => task.done).length;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat icon={<Flame className="size-5 text-orange-500" />} label="Day streak" value={today.streak} />
        <Stat icon={<Star className="size-5 text-amber-500" />} label="Points today" value={today.points_today} />
        <Stat
          icon={<CheckCircle2 className="size-5 text-emerald-600" />}
          label="Tasks done"
          value={`${doneCount} / ${today.tasks.length}`}
        />
      </div>

      {COACH_TASK_TYPES.map((type) => {
        const tasks = today.tasks.filter((task) => task.type === type);
        if (!tasks.length) return null;
        return (
          <section key={type} className="rounded-2xl border border-[#E6E8F5] bg-white p-5">
            <h2 className="text-[15px] font-semibold text-neutral-900">
              {GROUP_LABEL[type]}
              <span className="ms-2 text-[12px] font-medium text-neutral-400">
                {tasks.filter((task) => task.done).length} / {tasks.length}
              </span>
            </h2>
            <ul className="mt-3 space-y-2.5">
              {tasks.map((task) => (
                <li key={task.id}>
                  <TaskCard task={task} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <FollowUpsPanel />
    </div>
  );
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: number | string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#E6E8F5] bg-white p-4">
      {icon}
      <div>
        <p className="text-[20px] font-bold leading-none text-neutral-900">{value}</p>
        <p className="mt-1 text-[12px] text-neutral-500">{label}</p>
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: CoachTask }) {
  const toggle = ToggleCoachTaskMutation();
  const linkLabel = task.type === "comment" ? "Open post" : task.type === "post" ? "Open LinkedIn" : "Open profile";

  return (
    <article className={`flex gap-3 rounded-xl border p-3 transition-colors ${task.done ? "border-emerald-100 bg-emerald-50/40" : "border-[#EEF0FA]"}`}>
      <button
        type="button"
        onClick={() => toggle.mutate({ task_id: task.id, done: !task.done })}
        disabled={toggle.isPending}
        aria-pressed={task.done}
        aria-label={task.done ? `Mark “${task.title}” not done` : `Mark “${task.title}” done`}
        className={`mt-0.5 h-fit shrink-0 rounded-full ${FOCUS_RING}`}
      >
        {toggle.isPending ? (
          <Loader2 className="size-5 animate-spin text-[#0A66C2]" />
        ) : task.done ? (
          <CheckCircle2 className="size-5 text-emerald-600" />
        ) : (
          <Circle className="size-5 text-neutral-300 hover:text-[#0A66C2]" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className={`text-[13px] font-semibold ${task.done ? "text-neutral-500 line-through" : "text-neutral-900"}`}>{task.title}</p>
          <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">+{task.points} pts</span>
        </div>
        {task.person ? (
          <p className="mt-0.5 text-[12px] text-neutral-600">
            {task.person.name}
            {task.person.headline ? <span className="text-neutral-400"> · {task.person.headline}</span> : null}
          </p>
        ) : null}
        {task.context ? <p className="mt-1 line-clamp-2 text-[12px] italic text-neutral-500">{task.context}</p> : null}

        {task.draft ? (
          <div className="mt-2 rounded-lg bg-[#F6F9FD] p-2.5">
            <p className={LABEL}>{task.type === "connect" ? `Note (${task.draft.length}/200)` : "Draft"}</p>
            <p className="mt-1 whitespace-pre-wrap text-[12px] leading-5 text-neutral-700">{task.draft}</p>
          </div>
        ) : null}

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {task.draft ? <CopyButton text={task.draft} /> : null}
          {task.url ? (
            <a
              href={task.url}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-medium text-[#0A66C2] ring-1 ring-[#D6E4F5] hover:bg-[#F6F9FD] ${FOCUS_RING}`}
            >
              {linkLabel}
              <ExternalLink className="size-3" aria-hidden="true" />
            </a>
          ) : null}
        </div>

        {task.type === "post" && task.draft_id && !task.done ? (
          <div className="mt-3">
            <DraftScheduler draftId={task.draft_id} suggestedAt={task.best_time} />
          </div>
        ) : null}
      </div>
    </article>
  );
}
