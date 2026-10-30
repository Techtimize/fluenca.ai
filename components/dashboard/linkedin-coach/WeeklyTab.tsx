"use client";

import { useState } from "react";
import { CalendarRange, ExternalLink, Loader2, Recycle, Sparkles, Target } from "lucide-react";
import {
  ChangeBadge,
  CopyButton,
  EmptyAction,
  ErrorText,
  formatDate,
  GrowthSection,
  LABEL,
  LoadingBlock,
  PRIMARY_BUTTON,
} from "@/components/dashboard/linkedin-growth/ui";
import { getApiErrorMessage, isApiNotFoundError } from "@/errors/error-utils";
import { ContentPlanMutation, RepurposeMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { WeeklyReportHistoryQuery, WeeklyReportQuery } from "@/routes/bussiness/Bussiness-Query";
import { CONTENT_PLAN_GOALS, type ContentPlanGoal, type WeeklyReport } from "@/types/bussiness/linkedin-coach-type";
import { FOCUS_RING } from "@/utils/ui-classes";
import CarouselCard from "./CarouselCard";
import DraftScheduler from "./DraftScheduler";

/** Every week: the report, next week's plan, a carousel and a repurposed winner. */
export default function WeeklyTab() {
  return (
    <div className="space-y-4">
      <WeeklyReportCard />
      <ContentPlanCard />
      <div className="grid gap-4 xl:grid-cols-2">
        <CarouselCard />
        <RepurposeCard />
      </div>
    </div>
  );
}

function WeeklyReportCard() {
  const reportQuery = WeeklyReportQuery();
  const historyQuery = WeeklyReportHistoryQuery();
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);
  const noReportYet = reportQuery.isError && isApiNotFoundError(reportQuery.error);
  const history = historyQuery.data ?? [];
  const report = history.find((entry) => entry.week_start === selectedWeek) ?? reportQuery.data;

  return (
    <GrowthSection
      icon={CalendarRange}
      title="Weekly report"
      description="How the week went and what to focus on next, worked out from your saved activity."
      action={
        history.length > 1 ? (
          <select
            value={selectedWeek ?? report?.week_start ?? ""}
            onChange={(e) => setSelectedWeek(e.target.value)}
            aria-label="Week"
            className="h-9 rounded-full border border-[#E6E8F5] bg-white px-3 text-[12px] outline-none focus:border-[#0A66C2] focus:ring-2 focus:ring-[#0A66C2]/20"
          >
            {history.map((entry) => (
              <option key={entry.week_start} value={entry.week_start}>
                Week of {formatDate(entry.week_start)}
              </option>
            ))}
          </select>
        ) : null
      }
    >
      {reportQuery.isLoading ? (
        <LoadingBlock />
      ) : reportQuery.isError && !noReportYet ? (
        <ErrorText>{getApiErrorMessage(reportQuery.error, "Could not load the weekly report")}</ErrorText>
      ) : report ? (
        <ReportBody report={report} />
      ) : (
        <EmptyAction text="Your first weekly report shows up after a week of activity." />
      )}
    </GrowthSection>
  );
}

function ReportBody({ report }: { report: WeeklyReport }) {
  const stats = [
    { label: "Posts", value: report.posts },
    { label: "Comments", value: report.comments },
    { label: "New connections", value: report.new_connections },
    { label: "Points", value: report.points },
    { label: "Streak", value: report.streak },
  ].filter((stat) => stat.value != null);
  const worked = report.what_worked;
  const workedGroups = [
    { label: "Hooks", items: worked?.hooks ?? [] },
    { label: "Formats", items: worked?.formats ?? [] },
    { label: "Topics", items: worked?.topics ?? [] },
  ].filter((group) => group.items.length);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-[13px] text-neutral-500">
          Week of {formatDate(report.week_start)}
          {report.week_end ? ` – ${formatDate(report.week_end)}` : ""}
        </p>
        {report.score_change != null ? <ChangeBadge change={report.score_change} suffix="LinkedIn Score" /> : null}
      </div>

      {stats.length ? (
        <dl className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {stats.map(({ label, value }) => (
            <div key={label} className="rounded-xl bg-[#F6F9FD] px-3 py-2.5">
              <dt className="text-[11px] text-neutral-500">{label}</dt>
              <dd className="text-[18px] font-bold text-neutral-900">{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {report.best_post ? (
          <div>
            <p className={LABEL}>Best post</p>
            <div className="mt-1.5 rounded-xl border border-[#EEF0FA] p-3">
              <p className="line-clamp-4 text-[13px] leading-5 text-neutral-700">{report.best_post.text}</p>
              <div className="mt-1.5 flex items-center gap-3 text-[11px] text-neutral-500">
                {report.best_post.engagement != null ? <span>{report.best_post.engagement} engagement</span> : null}
                {report.best_post.url ? (
                  <a href={report.best_post.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#0A66C2] hover:underline">
                    View post
                    <ExternalLink className="size-3" aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {workedGroups.length ? (
          <div>
            <p className={LABEL}>What worked</p>
            <div className="mt-1.5 space-y-2">
              {workedGroups.map(({ label, items }) => (
                <div key={label} className="flex flex-wrap items-center gap-1.5">
                  <span className="w-16 shrink-0 text-[12px] font-medium text-neutral-600">{label}</span>
                  {items.map((item) => (
                    <span key={item} className="rounded-full bg-[#E8F1FB] px-2.5 py-0.5 text-[12px] text-[#0A66C2]">
                      {item}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {report.next_focus ? (
        <div className="flex gap-3 rounded-xl bg-linear-to-r from-[#E8F1FB] to-white p-4">
          <Target className="mt-0.5 size-5 shrink-0 text-[#0A66C2]" aria-hidden="true" />
          <div>
            <p className="text-[13px] font-semibold text-neutral-900">Next week&apos;s focus: {report.next_focus.area}</p>
            {report.next_focus.advice ? <p className="mt-0.5 text-[12px] leading-5 text-neutral-600">{report.next_focus.advice}</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

const GOAL_LABEL: Record<ContentPlanGoal, string> = {
  followers: "More followers",
  leads: "More leads",
  authority: "More authority",
};

function ContentPlanCard() {
  const [goal, setGoal] = useState<ContentPlanGoal>("leads");
  const plan = ContentPlanMutation();

  return (
    <GrowthSection
      icon={Sparkles}
      title="Next week's content plan"
      description="3–5 posts around your goal, each with day, time, format, topic, hook, outline and closing line."
    >
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-full bg-[#F1F4F9] p-1" role="radiogroup" aria-label="Goal">
          {CONTENT_PLAN_GOALS.map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={goal === value}
              onClick={() => setGoal(value)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-medium ${FOCUS_RING} ${
                goal === value ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
              }`}
            >
              {GOAL_LABEL[value]}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => plan.mutate(goal)} disabled={plan.isPending} className={PRIMARY_BUTTON}>
          {plan.isPending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          {plan.isPending ? "Planning…" : plan.data ? "Plan again" : "Plan next week"}
        </button>
      </div>

      {plan.data?.posts.length ? (
        <ol className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {plan.data.posts.map((post) => (
            <li key={`${post.day}-${post.hook}`} className="flex flex-col rounded-xl border border-[#EEF0FA] p-3.5">
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="rounded-full bg-[#0A66C2] px-2 py-0.5 font-semibold text-white">
                  {post.day}
                  {post.time ? ` · ${post.time}` : ""}
                </span>
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-neutral-600">{post.format}</span>
              </div>
              <p className="mt-2 text-[12px] text-neutral-500">{post.topic}</p>
              <p className="mt-1 text-[14px] font-semibold leading-5 text-neutral-900">{post.hook}</p>
              {post.outline.length ? (
                <ul className="mt-2 list-disc space-y-0.5 ps-4 text-[12px] leading-5 text-neutral-600">
                  {post.outline.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : null}
              {post.closing_line ? <p className="mt-2 text-[12px] italic text-neutral-600">“{post.closing_line}”</p> : null}
              <div className="mt-auto flex justify-end pt-2">
                <CopyButton text={[post.hook, ...post.outline.map((point) => `• ${point}`), post.closing_line ?? ""].filter(Boolean).join("\n")} />
              </div>
            </li>
          ))}
        </ol>
      ) : null}
    </GrowthSection>
  );
}

function RepurposeCard() {
  const repurpose = RepurposeMutation();
  const drafts = repurpose.data?.drafts ?? [];

  return (
    <GrowthSection
      icon={Recycle}
      title="Repurpose your winner"
      description="Your top post as a new angle and a follow-up, saved as drafts you can schedule in one click."
    >
      {drafts.length ? (
        <ul className="space-y-3">
          {drafts.map((draft) => (
            <li key={draft.id} className="rounded-xl border border-[#EEF0FA] p-3">
              <div className="flex items-center justify-between gap-2">
                <span className={LABEL}>{draft.kind === "follow_up" ? "Follow-up" : "New angle"}</span>
                <CopyButton text={draft.text} />
              </div>
              <p className="mt-1.5 line-clamp-6 whitespace-pre-wrap text-[13px] leading-5 text-neutral-700">{draft.text}</p>
              <div className="mt-3">
                <DraftScheduler draftId={draft.id} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyAction text="Turn your best-performing post into two fresh drafts.">
          <button type="button" onClick={() => repurpose.mutate()} disabled={repurpose.isPending} className={PRIMARY_BUTTON}>
            {repurpose.isPending ? <Loader2 className="size-4 animate-spin" /> : <Recycle className="size-4" />}
            {repurpose.isPending ? "Repurposing…" : "Repurpose my top post"}
          </button>
        </EmptyAction>
      )}
    </GrowthSection>
  );
}
