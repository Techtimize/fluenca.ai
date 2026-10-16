"use client";

import { useState } from "react";
import {
  Ban,
  CalendarClock,
  ChevronDown,
  ExternalLink,
  Film,
  ImageIcon,
  Loader2,
  Pencil,
  Trash2,
  Type,
} from "lucide-react";
import EditScheduledPostDialog from "@/components/dashboard/content/scheduled/editScheduledPostDialog";
import { PlatformIcon, platformLabel } from "@/components/dashboard/content/scheduled/scheduleFields";
import { formatSchedule } from "@/components/dashboard/content/schedulePostDialog";
import Card from "@/components/shared/card";
import { getApiErrorMessage } from "@/errors/error-utils";
import {
  CancelScheduledPostMutation,
  DeleteScheduledPostMutation,
} from "@/routes/bussiness/Bussiness-Mutation";
import { ScheduledPostQuery, ScheduledPostsQuery } from "@/routes/bussiness/Bussiness-Query";
import {
  isScheduledPostVideo,
  scheduledPostMediaUrl,
  scheduledPostResults,
  type ScheduledPost,
} from "@/types/bussiness/scheduled-post-type";
import { FOCUS_RING } from "@/utils/ui-classes";
import { cn } from "@/lib/utils";

type ListFilter = "all" | "scheduled";

const FILTERS: { id: ListFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "scheduled", label: "Upcoming" },
];

const STATUS_STYLES: Record<string, string> = {
  scheduled: "bg-[#EEF0FF] text-[#4544C9] ring-[#DCE0FA]",
  publishing: "bg-amber-50 text-amber-700 ring-amber-100",
  published: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  partially_published: "bg-amber-50 text-amber-700 ring-amber-100",
  failed: "bg-rose-50 text-rose-700 ring-rose-100",
  cancelled: "bg-neutral-100 text-neutral-600 ring-neutral-200",
};

const ACTION = `inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#E6E8F5] bg-white px-2.5 text-[12px] font-medium text-neutral-700 transition-colors hover:bg-[#F6F7FD] disabled:opacity-55 ${FOCUS_RING}`;

function ScheduledStatusChip({ status }: { status?: string }) {
  const value = status || "unknown";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ring-1",
        STATUS_STYLES[value] ?? "bg-neutral-100 text-neutral-600 ring-neutral-200",
      )}
    >
      {value.replace(/_/g, " ")}
    </span>
  );
}

function Thumbnail({ post }: { post: ScheduledPost }) {
  const url = scheduledPostMediaUrl(post);
  const video = isScheduledPostVideo(post);
  return (
    <div className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl bg-[linear-gradient(135deg,#EEF0FF,#F6F4FF)]">
      {url && video ? (
        <video src={url} muted preload="metadata" className="size-full object-cover" />
      ) : url ? (
        // eslint-disable-next-line @next/next/no-img-element -- S3 URL from the backend, not a configured image host
        <img src={url} alt="" className="size-full object-cover" />
      ) : null}
      <span
        className={cn(
          "absolute grid place-items-center text-[#A5A8F5]",
          url ? "bottom-1 right-1 size-5 rounded-md bg-black/55 text-white" : "inset-0",
        )}
      >
        {!url ? (
          <Type className="size-6" aria-hidden="true" />
        ) : video ? (
          <Film className={url ? "size-3" : "size-6"} aria-hidden="true" />
        ) : (
          <ImageIcon className={url ? "size-3" : "size-6"} aria-hidden="true" />
        )}
      </span>
    </div>
  );
}

/** Each platform's outcome, fetched from GET /scheduled-posts/{id} when the row is expanded. */
function PlatformResults({ postId }: { postId: string }) {
  const { data, isLoading, isError, error } = ScheduledPostQuery(postId);

  if (isLoading) {
    return (
      <p className="flex items-center gap-2 text-[12px] text-neutral-500">
        <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> Loading results…
      </p>
    );
  }
  if (isError) {
    return <p className="text-[12px] text-rose-600">{getApiErrorMessage(error, "Could not load this post")}</p>;
  }

  const results = data ? scheduledPostResults(data) : [];
  if (!results.length) {
    return <p className="text-[12px] text-neutral-500">No platform results yet. They appear once the post goes out.</p>;
  }

  return (
    <ul className="space-y-2">
      {results.map((result) => {
        const link = result.permalink || result.url;
        return (
          <li key={result.platform} className="flex flex-wrap items-center gap-2 text-[12px]">
            <PlatformIcon platform={result.platform} className="size-4" />
            <span className="font-medium text-neutral-800">{platformLabel(result.platform)}</span>
            <ScheduledStatusChip status={result.status} />
            {result.published_at ? (
              <span className="text-neutral-500">{formatSchedule(result.published_at)}</span>
            ) : null}
            {link ? (
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-1 rounded text-[#5B57E6] hover:underline ${FOCUS_RING}`}
              >
                View post <ExternalLink className="size-3" aria-hidden="true" />
              </a>
            ) : null}
            {result.error ? <span className="basis-full text-rose-600">{result.error}</span> : null}
          </li>
        );
      })}
    </ul>
  );
}

function ScheduledPostRow({ post }: { post: ScheduledPost }) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const cancel = CancelScheduledPostMutation();
  const remove = DeleteScheduledPostMutation();
  const editable = post.status === "scheduled";

  return (
    <li className="rounded-2xl border border-[#E6E8F5] bg-white p-3.5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <Thumbnail post={post} />

        <div className="min-w-0 flex-1">
          <p className={cn("line-clamp-2 text-[13px] leading-5", post.caption ? "text-neutral-900" : "text-neutral-400")}>
            {post.caption || "No caption"}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-neutral-600">
            <ScheduledStatusChip status={post.status} />
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock className="size-3.5 text-neutral-400" aria-hidden="true" />
              {formatSchedule(post.scheduled_at) ?? "No time set"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              {post.platforms.map((platform) => (
                <span key={platform} title={platformLabel(platform)} className="inline-flex">
                  <PlatformIcon platform={platform} />
                  <span className="sr-only">{platformLabel(platform)}</span>
                </span>
              ))}
            </span>
          </div>
          {post.error ? <p className="mt-1.5 text-[12px] text-rose-600">{post.error}</p> : null}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-1.5 sm:justify-end">
          {editable ? (
            <>
              <button type="button" onClick={() => setEditing(true)} className={ACTION}>
                <Pencil className="size-3.5" aria-hidden="true" /> Edit
              </button>
              <button
                type="button"
                onClick={() => cancel.mutate(post.id)}
                disabled={cancel.isPending}
                className={ACTION}
              >
                {cancel.isPending ? (
                  <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <Ban className="size-3.5" aria-hidden="true" />
                )}
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
              className={ACTION}
            >
              Results
              <ChevronDown className={cn("size-3.5 transition-transform", expanded && "rotate-180")} aria-hidden="true" />
            </button>
          )}
          {confirmingDelete ? (
            <>
              <button
                type="button"
                onClick={() => remove.mutate(post.id)}
                disabled={remove.isPending}
                className={`${ACTION} border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100`}
              >
                {remove.isPending ? <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> : null}
                Delete post and file
              </button>
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                disabled={remove.isPending}
                className={ACTION}
              >
                Keep
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              aria-label="Delete scheduled post"
              className={`${ACTION} px-2 text-rose-600`}
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {expanded && !editable ? (
        <div className="mt-3 border-t border-[#EEF0F8] pt-3">
          <PlatformResults postId={post.id} />
        </div>
      ) : null}

      {editable ? <EditScheduledPostDialog post={post} open={editing} onOpenChange={setEditing} /> : null}
    </li>
  );
}

export default function ScheduledPostsList() {
  const [filter, setFilter] = useState<ListFilter>("all");
  const { data, isLoading, isError, error, refetch, isRefetching } = ScheduledPostsQuery(
    filter === "scheduled" ? "scheduled" : undefined,
  );
  const posts = data ?? [];

  return (
    <section className="min-w-0 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-neutral-900">
          Scheduled posts
          <span className="rounded-full bg-[#EEF0FF] px-2 py-0.5 text-[11px] font-semibold text-[#4544C9]">
            {posts.length}
          </span>
        </h2>
        <div
          role="tablist"
          aria-label="Filter scheduled posts"
          className="inline-flex gap-1 rounded-full border border-[#E6E8F5] bg-white p-1"
        >
          {FILTERS.map((item) => {
            const active = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(item.id)}
                className={cn(
                  `h-8 rounded-full px-3 text-[12px] font-semibold transition-colors ${FOCUS_RING}`,
                  active ? "bg-[#5B57E6] text-white shadow-sm" : "text-neutral-600 hover:bg-[#F6F7FD]",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <ul className="space-y-3" aria-busy="true">
          {Array.from({ length: 2 }, (_, i) => (
            <li key={i} className="h-28 animate-pulse rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF]" />
          ))}
        </ul>
      ) : isError ? (
        <Card className="flex flex-wrap items-center justify-between gap-3 border-rose-200 bg-rose-50/80 p-4">
          <p className="text-sm text-rose-800">{getApiErrorMessage(error, "Failed to load scheduled posts")}</p>
          <button type="button" onClick={() => void refetch()} disabled={isRefetching} className={ACTION}>
            {isRefetching ? <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> : null}
            Try again
          </button>
        </Card>
      ) : posts.length ? (
        <ul className="space-y-3">
          {posts.map((post) => (
            <ScheduledPostRow key={post.id} post={post} />
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#E6E8F5] bg-white px-6 py-10 text-center">
          <span className="grid size-11 place-items-center rounded-full bg-[#EEF0FF] text-[#5B57E6]">
            <CalendarClock className="size-5" aria-hidden="true" />
          </span>
          <p className="mt-3 text-[14px] font-semibold text-neutral-900">
            {filter === "scheduled" ? "Nothing upcoming" : "No scheduled posts yet"}
          </p>
          <p className="mt-1 max-w-sm text-[12px] text-neutral-500">
            Upload an image or video above and pick when it should go out.
          </p>
        </div>
      )}
    </section>
  );
}
