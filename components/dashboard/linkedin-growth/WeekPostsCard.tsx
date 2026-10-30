"use client";

import { useState } from "react";
import { AlertTriangle, CalendarCheck, CalendarDays, ChevronDown, Loader2, RotateCw, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/errors/error-utils";
import {
  CancelWeekPostMutation,
  GenerateWeekPostsMutation,
  ScheduleWeekPostMutation,
} from "@/routes/bussiness/Bussiness-Mutation";
import { WeekPostsQuery } from "@/routes/bussiness/Bussiness-Query";
import type { WeekPost, WeekPostStatus } from "@/types/bussiness/linkedin-growth-type";
import { toOffsetIso } from "@/types/bussiness/scheduled-post-type";
import { FOCUS_RING } from "@/utils/ui-classes";
import { CopyButton, EmptyAction, ErrorText, GHOST_BUTTON, GrowthSection, LABEL, LoadingBlock, PRIMARY_BUTTON } from "./ui";

const STATUS_STYLE: Record<WeekPostStatus, string> = {
  draft: "bg-neutral-100 text-neutral-600",
  scheduled: "bg-[#E8F1FB] text-[#0A66C2]",
  published: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-neutral-100 text-neutral-500",
  failed: "bg-rose-50 text-rose-700",
};

const POST_HOUR = 9;

/** Spread the week out: post 1 tomorrow, then every other day, at 9:00 local time. */
function suggestedSlot(index: number) {
  const date = new Date();
  date.setDate(date.getDate() + index * 2 + 1);
  date.setHours(POST_HOUR, 0, 0, 0);
  return date;
}

/** "2026-10-27T09:00" for <input type="datetime-local">. */
const toInputValue = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const formatSlot = (date: Date) =>
  date.toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

/** 3 posts from niche trends, news and your stories: edit, then schedule each in one click. */
export default function WeekPostsCard() {
  const postsQuery = WeekPostsQuery();
  const generate = GenerateWeekPostsMutation();
  const posts = postsQuery.data?.posts ?? [];

  return (
    <GrowthSection
      icon={CalendarDays}
      title="Your first week of posts"
      description="3 posts from your niche's trending searches and news, and your own stories. Each hook is scored and the text is checked for an AI-written feel."
      action={
        posts.length ? (
          <button type="button" onClick={() => generate.mutate()} disabled={generate.isPending} className={GHOST_BUTTON}>
            {generate.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <RotateCw className="size-3.5" />}
            Write new posts
          </button>
        ) : null
      }
    >
      {postsQuery.isLoading ? (
        <LoadingBlock />
      ) : postsQuery.isError ? (
        <ErrorText>{getApiErrorMessage(postsQuery.error, "Could not load your posts")}</ErrorText>
      ) : posts.length ? (
        <ol className="grid gap-3 lg:grid-cols-3">
          {posts.map((post, index) => (
            <li key={post.id}>
              <PostCard post={post} index={index} />
            </li>
          ))}
        </ol>
      ) : (
        <EmptyAction text="Get 3 ready posts for your first week, each schedulable in one click.">
          <button type="button" onClick={() => generate.mutate()} disabled={generate.isPending} className={PRIMARY_BUTTON}>
            {generate.isPending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {generate.isPending ? "Writing your posts…" : "Write my first week"}
          </button>
        </EmptyAction>
      )}
    </GrowthSection>
  );
}

function PostCard({ post, index }: { post: WeekPost; index: number }) {
  const [text, setText] = useState(post.text);
  const [slot, setSlot] = useState(() => suggestedSlot(index));
  const [showHooks, setShowHooks] = useState(false);
  const schedulePost = ScheduleWeekPostMutation();
  const cancelPost = CancelWeekPostMutation();

  const editable = post.status === "draft" || post.status === "cancelled";
  const edited = text.trim() !== post.text.trim();
  const otherHooks = (post.hook_options ?? []).filter((hook) => hook !== post.hook);

  const schedule = () => {
    if (slot.getTime() <= Date.now()) {
      toast.error("Pick a time in the future");
      return;
    }
    schedulePost.mutate({
      post_id: post.id,
      body: { scheduled_at: toOffsetIso(slot), ...(edited ? { text: text.trim() } : {}) },
    });
  };

  return (
    <article className="flex h-full flex-col rounded-xl border border-[#EEF0FA] bg-[#FBFCFE] p-3.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[#0A66C2]">Post {index + 1}</span>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${STATUS_STYLE[post.status]}`}>
          {post.status}
        </span>
      </div>

      <p className="mt-2 text-[14px] font-semibold leading-5 text-neutral-900">{post.hook}</p>

      <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
        {post.hook_score != null ? (
          <span className="rounded-full bg-white px-2 py-0.5 font-medium text-neutral-600 ring-1 ring-[#EEF0FA]">
            Hook score {Math.round(post.hook_score)}
          </span>
        ) : null}
        {post.ai_feel ? (
          <span className="rounded-full bg-white px-2 py-0.5 font-medium text-neutral-600 ring-1 ring-[#EEF0FA]">
            AI feel: {post.ai_feel.label ?? Math.round(post.ai_feel.score)}
          </span>
        ) : null}
        {post.source ? (
          <span className="rounded-full bg-[#E8F1FB] px-2 py-0.5 text-[#0A66C2]">From {post.source}</span>
        ) : null}
      </div>

      {otherHooks.length ? (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setShowHooks((value) => !value)}
            aria-expanded={showHooks}
            className={`inline-flex items-center gap-0.5 rounded text-[12px] font-medium text-[#0A66C2] ${FOCUS_RING}`}
          >
            Other hooks it tried
            <ChevronDown className={`size-3.5 transition-transform ${showHooks ? "rotate-180" : ""}`} aria-hidden="true" />
          </button>
          {showHooks ? (
            <ul className="mt-1 list-disc space-y-0.5 ps-4 text-[12px] text-neutral-500">
              {otherHooks.map((hook) => (
                <li key={hook}>{hook}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <label className="mt-3 block">
        <span className={LABEL}>{editable ? "Post (edit before scheduling)" : "Post"}</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          readOnly={!editable}
          rows={8}
          className="mt-1 w-full resize-y rounded-lg border border-[#E6E8F5] bg-white p-2.5 text-[13px] leading-5 text-neutral-700 outline-none read-only:bg-neutral-50 focus:border-[#0A66C2] focus:ring-2 focus:ring-[#0A66C2]/20"
        />
      </label>

      {post.lint?.length ? (
        <ul className="mt-1.5 space-y-0.5 text-[11px] text-amber-700">
          {post.lint.map((issue) => (
            <li key={issue} className="flex gap-1">
              <AlertTriangle className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
              {issue}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-auto space-y-2 pt-3">
        <div className="flex justify-end">
          <CopyButton text={text} />
        </div>

        {post.status === "scheduled" ? (
          <>
            <p className="flex items-center justify-center gap-1.5 rounded-full bg-[#E8F1FB] py-2 text-[12px] font-semibold text-[#0A66C2]">
              <CalendarCheck className="size-4" aria-hidden="true" />
              {post.scheduled_at ? formatSlot(new Date(post.scheduled_at)) : "Scheduled"}
            </p>
            <button type="button" onClick={() => cancelPost.mutate(post.id)} disabled={cancelPost.isPending} className={`${GHOST_BUTTON} w-full`}>
              {cancelPost.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <X className="size-3.5" />}
              Cancel
            </button>
          </>
        ) : editable ? (
          <>
            <label className="block">
              <span className="sr-only">Post time</span>
              <input
                type="datetime-local"
                value={toInputValue(slot)}
                onChange={(e) => e.target.value && setSlot(new Date(e.target.value))}
                className="h-9 w-full rounded-full border border-[#E6E8F5] bg-white px-3 text-[12px] outline-none focus:border-[#0A66C2] focus:ring-2 focus:ring-[#0A66C2]/20"
              />
            </label>
            <button type="button" onClick={schedule} disabled={schedulePost.isPending || !text.trim()} className={`${PRIMARY_BUTTON} w-full`}>
              {schedulePost.isPending ? <Loader2 className="size-4 animate-spin" /> : <CalendarCheck className="size-4" />}
              Schedule{edited ? " with my edits" : ""}
            </button>
          </>
        ) : post.status === "failed" ? (
          <p className="text-center text-[12px] text-rose-700">This post didn&apos;t go out. It won&apos;t be retried automatically.</p>
        ) : null}
      </div>
    </article>
  );
}
