"use client";

import {
  Clapperboard,
  ExternalLink,
  Loader2,
  Radio,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { formatCount } from "@/components/dashboard/social/socialUtils";
import { getApiErrorMessage } from "@/errors/error-utils";
import {
  instagramStoryImageUrl,
  normalizeInstagramLive,
  normalizeInstagramStories,
  type InstagramLiveItem,
  type InstagramStoryItem,
} from "@/types/bussiness/instagram-type";
import { formatPostDate } from "@/utils/insta-utils";
import { FOCUS_RING } from "@/utils/ui-classes";

type LoadState = {
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
  isFetching?: boolean;
  refetch?: () => void;
};

type Props = {
  accountId: string | null;
  storiesRaw: unknown;
  liveRaw: unknown;
  storiesState: LoadState;
  liveState: LoadState;
  onRefresh: () => void;
};

function isVideo(type?: string | null) {
  if (!type) return false;
  const t = type.toLowerCase();
  return t.includes("video") || t.includes("reel");
}

function LiveBanner({
  item,
  loading,
}: {
  item: InstagramLiveItem | null;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-6 text-[13px] text-neutral-500">
        <Loader2 className="size-4 animate-spin text-[#E1306C]" />
        Checking for a live broadcast…
      </div>
    );
  }

  if (!item) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-6 text-center">
        <p className="text-[14px] font-medium text-neutral-800">Not live right now</p>
        <p className="mt-1 text-[12px] text-neutral-500">
          When this account goes live, it will show up here with viewers and a
          link to watch.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border ${
        item.isLive
          ? "border-rose-200 bg-gradient-to-r from-[#FFF1F2] via-white to-[#FFF7ED]"
          : "border-neutral-200 bg-white"
      }`}
    >
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-neutral-100 sm:h-28 sm:w-40">
          {item.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.coverUrl}
              alt={item.title || "Live stream"}
              className="size-full object-cover"
            />
          ) : (
            <div className="grid size-full place-items-center text-neutral-400">
              <Radio className="size-8" />
            </div>
          )}
          {item.isLive ? (
            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              <span className="size-1.5 animate-pulse rounded-full bg-white" />
              Live
            </span>
          ) : (
            <span className="absolute left-2 top-2 rounded-full bg-neutral-900/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              {item.status || "Ended"}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-neutral-900">
            {item.title || (item.isLive ? "Live now on Instagram" : "Recent live")}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-neutral-500">
            {item.viewerCount != null ? (
              <span>{formatCount(item.viewerCount)} watching</span>
            ) : null}
            {item.startedAt ? (
              <span>Started {formatPostDate(item.startedAt)}</span>
            ) : null}
            {item.endedAt ? <span>Ended {formatPostDate(item.endedAt)}</span> : null}
            {item.status ? <span className="capitalize">{item.status}</span> : null}
          </div>
          {item.permalink ? (
            <a
              href={item.permalink}
              target="_blank"
              rel="noreferrer"
              className={`mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#E1306C] hover:underline ${FOCUS_RING}`}
            >
              <ExternalLink className="size-3.5" />
              {item.isLive ? "Watch live" : "Open broadcast"}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function StoryCard({ story }: { story: InstagramStoryItem }) {
  const image = instagramStoryImageUrl(story);
  const video = isVideo(story.mediaType);
  return (
    <li className="w-[120px] shrink-0 sm:w-[140px]">
      <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-neutral-100 ring-2 ring-[#E1306C]/25">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={story.caption || "Instagram story"}
            className="size-full object-cover"
          />
        ) : (
          <div className="grid size-full place-items-center text-neutral-400">
            <Sparkles className="size-6" />
          </div>
        )}
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-black/55 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
          {video ? <Clapperboard className="size-3" /> : <Sparkles className="size-3" />}
          {video ? "Video" : "Story"}
        </span>
        {story.permalink ? (
          <a
            href={story.permalink}
            target="_blank"
            rel="noreferrer"
            aria-label="Open story"
            className="absolute inset-0"
          />
        ) : null}
      </div>
      {story.timestamp ? (
        <p className="mt-1.5 truncate text-center text-[11px] text-neutral-500">
          {formatPostDate(story.timestamp)}
        </p>
      ) : null}
    </li>
  );
}

export function InstagramStoriesLivePanel({
  accountId,
  storiesRaw,
  liveRaw,
  storiesState,
  liveState,
  onRefresh,
}: Props) {
  const stories = normalizeInstagramStories(storiesRaw);
  const lives = normalizeInstagramLive(liveRaw);
  const activeLive = lives.find((l) => l.isLive) || lives[0] || null;
  const refreshing = storiesState.isFetching || liveState.isFetching;

  if (!accountId) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-8 text-center text-[13px] text-neutral-500">
        Waiting for Instagram account id before loading stories & live…
      </div>
    );
  }

  return (
    <section className="min-w-0 space-y-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-[18px] font-semibold tracking-tight text-neutral-900 sm:text-[20px]">
            Stories & Live
          </h2>
          <p className="mt-1 text-[13px] text-neutral-500">
            Active stories and any live broadcast for this account — so you can
            see what’s happening right now, not just the feed.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className={`inline-flex h-9 shrink-0 items-center gap-1.5 self-start rounded-full border border-neutral-200 px-3 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-60 ${FOCUS_RING}`}
        >
          <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Live */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Radio className="size-4 text-rose-600" />
          <h3 className="text-[14px] font-semibold text-neutral-900">Live stream</h3>
        </div>
        {liveState.isError ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-5 text-center text-[13px] text-rose-700">
            {getApiErrorMessage(liveState.error, "Couldn’t load live status")}
            {liveState.refetch ? (
              <button
                type="button"
                onClick={liveState.refetch}
                className={`mt-2 block w-full text-[12px] font-semibold underline ${FOCUS_RING}`}
              >
                Retry
              </button>
            ) : null}
          </div>
        ) : (
          <LiveBanner item={activeLive} loading={liveState.isLoading} />
        )}
      </div>

      {/* Stories */}
      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-[#E1306C]" />
            <h3 className="text-[14px] font-semibold text-neutral-900">
              Active stories
            </h3>
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
              {stories.length}
            </span>
          </div>
        </div>

        {storiesState.isLoading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-neutral-500">
            <Loader2 className="size-5 animate-spin text-[#E1306C]" />
            Loading stories…
          </div>
        ) : storiesState.isError ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-5 text-center text-[13px] text-rose-700">
            {getApiErrorMessage(storiesState.error, "Couldn’t load stories")}
            {storiesState.refetch ? (
              <button
                type="button"
                onClick={storiesState.refetch}
                className={`mt-2 block w-full text-[12px] font-semibold underline ${FOCUS_RING}`}
              >
                Retry
              </button>
            ) : null}
          </div>
        ) : stories.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-8 text-center">
            <p className="text-[14px] font-medium text-neutral-800">No active stories</p>
            <p className="mt-1 text-[12px] text-neutral-500">
              Stories disappear after 24 hours. When new ones go up, they’ll
              appear in this row.
            </p>
          </div>
        ) : (
          <ul className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
