"use client";

import { useState } from "react";
import Image from "next/image";
import { AlertCircle, CalendarClock, CheckCircle2, Loader2, Send } from "lucide-react";
import { initialDate } from "@/components/dashboard/content/schedulePostDialog";
import { ScheduleDateTime } from "@/components/dashboard/content/scheduled/scheduleFields";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { isPublishSucceeded } from "@/lib/content/posted-content";
import { CreateScheduledPostMutation, LinkedInPublishMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { toOffsetIso } from "@/types/bussiness/scheduled-post-type";
import { CompanyTextPostsQuery } from "@/routes/bussiness/Bussiness-Query";
import {
  isTextPostPosted,
  textPostError,
  textPostId,
  textPostText,
  type TextPost,
} from "@/types/bussiness/text-post-type";
import { formatDate } from "@/utils/format-date";
import { FOCUS_RING } from "@/utils/ui-classes";
import { cn } from "@/lib/utils";

const LINKEDIN_LIMIT = 3000;

type When = "now" | "later";

export function TextPostStatus({ post }: { post: TextPost }) {
  if (isTextPostPosted(post)) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
        <CheckCircle2 className="size-3" aria-hidden="true" />
        Posted
      </span>
    );
  }
  return textPostError(post) ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700 ring-1 ring-rose-200">
      <AlertCircle className="size-3" aria-hidden="true" />
      Not posted
    </span>
  ) : (
    <span className="rounded-full bg-[#F0F1F8] px-2 py-0.5 text-[11px] font-semibold text-neutral-600">Draft</span>
  );
}

/** Mounted fresh on each open, so the text starts from the saved post. */
function TextPostForm({ post, onDone }: { post: TextPost; onDone: () => void }) {
  const [text, setText] = useState(() => textPostText(post));
  const [when, setWhen] = useState<When>("now");
  const [scheduledAt, setScheduledAt] = useState(() => initialDate());
  const publish = LinkedInPublishMutation();
  const schedule = CreateScheduledPostMutation();
  const busy = publish.isPending || schedule.isPending;
  const inPast = scheduledAt <= new Date();
  const posted = isTextPostPosted(post);
  const id = textPostId(post);
  const error = textPostError(post);

  const submit = () => {
    if (!id || !text.trim() || posted) return;
    if (when === "later") {
      if (inPast) return;
      // Same text-only LinkedIn post the Upload & schedule screen sends: no file.
      schedule.mutate(
        {
          body: {
            platforms: ["linkedin"],
            scheduled_at: toOffsetIso(scheduledAt),
            caption: text.trim(),
            generation_id: id,
          },
        },
        { onSuccess: onDone },
      );
      return;
    }
    publish.mutate(
      { text: text.trim(), generation_id: id },
      { onSuccess: (response) => isPublishSucceeded(response) && onDone() },
    );
  };

  return (
    <>
      {error && !posted ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] text-rose-700">
          Last attempt failed: {error}
        </p>
      ) : null}
      <label className="block">
        <span className="flex items-center justify-between text-[13px] font-medium text-neutral-700">
          Post text
          <span className="font-normal tabular-nums text-neutral-400">
            {text.length}/{LINKEDIN_LIMIT}
          </span>
        </span>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value.slice(0, LINKEDIN_LIMIT))}
          readOnly={posted}
          rows={12}
          className="mt-2 w-full resize-y rounded-xl border border-[#E6E8F5] bg-white px-3.5 py-2.5 text-[14px] leading-6 text-neutral-900 outline-none read-only:bg-[#F8F9FC] focus:border-[#5B57E6] focus:ring-2 focus:ring-[#5B57E6]/20"
        />
      </label>

      {posted ? null : (
        <fieldset className="space-y-3">
          <legend className="text-[13px] font-medium text-neutral-700">When</legend>
          <div role="radiogroup" aria-label="When to post" className="inline-flex gap-1 rounded-xl border border-[#E6E8F5] bg-white p-1">
            {(
              [
                { id: "now", label: "Post now", icon: Send },
                { id: "later", label: "Schedule", icon: CalendarClock },
              ] as const
            ).map((option) => {
              const active = when === option.id;
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setWhen(option.id)}
                  disabled={busy}
                  className={cn(
                    `inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] font-semibold transition-colors ${FOCUS_RING}`,
                    active ? "bg-[#5B57E6] text-white shadow-sm" : "text-neutral-600 hover:bg-[#F6F7FD]",
                  )}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  {option.label}
                </button>
              );
            })}
          </div>
          {when === "later" ? <ScheduleDateTime value={scheduledAt} onChange={setScheduledAt} /> : null}
        </fieldset>
      )}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone} disabled={busy}>
          {posted ? "Close" : "Cancel"}
        </Button>
        {posted ? null : (
          <Button
            type="button"
            onClick={submit}
            disabled={!id || !text.trim() || busy || (when === "later" && inPast)}
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : when === "later" ? (
              <CalendarClock className="size-4" aria-hidden="true" />
            ) : (
              <Send className="size-4" aria-hidden="true" />
            )}
            {when === "later"
              ? schedule.isPending
                ? "Scheduling…"
                : "Schedule post"
              : publish.isPending
                ? "Publishing…"
                : "Publish on LinkedIn"}
          </Button>
        )}
      </DialogFooter>
    </>
  );
}

/** Review a generated text post, edit it if needed, then publish it to LinkedIn with its generation_id. */
export function TextPostDialog({
  post,
  open,
  onOpenChange,
}: {
  post: TextPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const posted = isTextPostPosted(post);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image src="/assets/linkedin.png" alt="" width={18} height={18} className="size-4.5 object-contain" />
            {posted ? "Posted on LinkedIn" : "LinkedIn text post"}
          </DialogTitle>
          <DialogDescription>
            {posted
              ? "This post is live on LinkedIn."
              : "Check the post, edit anything you like, then publish now or pick a time."}
          </DialogDescription>
        </DialogHeader>
        {open && post ? <TextPostForm post={post} onDone={() => onOpenChange(false)} /> : null}
      </DialogContent>
    </Dialog>
  );
}

/** Text posts for the Content screen, newest first, each opening the publish dialog. */
export function TextPostsSection({ companyId }: { companyId: string }) {
  const { data: posts = [], isLoading } = CompanyTextPostsQuery(companyId);
  const [openId, setOpenId] = useState<string | null>(null);
  const openPost = posts.find((post) => textPostId(post) === openId) ?? null;
  const sorted = [...posts].sort(
    (a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime(),
  );

  if (isLoading || !posts.length) return null;

  return (
    <section className="space-y-3" aria-labelledby="text-posts-heading">
      <div className="flex items-center gap-2">
        <Image src="/assets/linkedin.png" alt="" width={16} height={16} className="size-4 object-contain" />
        <h2 id="text-posts-heading" className="text-[15px] font-semibold text-neutral-900">
          LinkedIn text posts
        </h2>
        <span className="rounded-full bg-[#EEF0FF] px-2 py-0.5 text-[11px] font-semibold text-[#4544C9]">
          {posts.length}
        </span>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {sorted.map((post) => {
          const id = textPostId(post);
          const posted = isTextPostPosted(post);
          const when = formatDate((posted ? post.posted_at : post.created_at) ?? undefined);
          return (
            <li key={id ?? textPostText(post).slice(0, 40)} className="flex flex-col rounded-2xl border border-[#E6E8F5] bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <TextPostStatus post={post} />
                {when ? <span className="text-[11px] text-neutral-500">{when}</span> : null}
              </div>
              <p className="mt-3 line-clamp-5 whitespace-pre-line text-[13px] leading-5 text-neutral-800">
                {textPostText(post) || "No text"}
              </p>
              <button
                type="button"
                onClick={() => setOpenId(id)}
                disabled={!id}
                className={cn(
                  `mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl text-[13px] font-semibold transition-colors disabled:opacity-50 ${FOCUS_RING}`,
                  posted
                    ? "border border-[#E6E8F5] bg-white text-neutral-700 hover:bg-[#F6F7FD]"
                    : "bg-[#5B57E6] text-white hover:bg-[#4A46D0]",
                )}
              >
                {posted ? "View post" : (
                  <>
                    <Send className="size-4" aria-hidden="true" />
                    Review & publish
                  </>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <TextPostDialog post={openPost} open={openPost !== null} onOpenChange={(open) => !open && setOpenId(null)} />
    </section>
  );
}
