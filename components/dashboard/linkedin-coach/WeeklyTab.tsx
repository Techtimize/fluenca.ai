"use client";

import { useState } from "react";
import { Loader2, Recycle, Sparkles } from "lucide-react";
import {
  CopyButton,
  EmptyAction,
  GrowthSection,
  LABEL,
  PRIMARY_BUTTON,
} from "@/components/dashboard/linkedin-growth/ui";
import { ContentPlanMutation, RepurposeMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { CONTENT_PLAN_GOALS, type ContentPlanGoal } from "@/types/bussiness/linkedin-coach-type";
import { FOCUS_RING } from "@/utils/ui-classes";
import CarouselCard from "./CarouselCard";
import DraftScheduler from "./DraftScheduler";

/** Every week: next week's plan, a carousel and a repurposed winner. */
export default function WeeklyTab() {
  return (
    <div className="space-y-4">
      <ContentPlanCard />
      <div className="grid gap-4 xl:grid-cols-2">
        <CarouselCard />
        <RepurposeCard />
      </div>
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
