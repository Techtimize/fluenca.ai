"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ImageIcon,
  ImageOff,
  Loader2,
  Maximize2,
  Send,
} from "lucide-react";
import { FacebookIcon } from "@/components/shared/brandIcons";
import type { PostedContent } from "@/lib/content/posted-content";
import { formatDate } from "@/utils/format-date";
import { FOCUS_RING } from "@/utils/ui-classes";
import ContentPreviewDialog, { ContentDetailsList, contentDetails } from "./contentPreviewDialog";
import { DeleteImageControls } from "./deleteImageControl";
import { formatSchedule, SchedulePostButton } from "./schedulePostDialog";
import type { ContentGenerationResultItem } from "./utils";

type PlatformKey = "instagram" | "linkedin" | "facebook" | "x";

export function normalizeContentPlatform(
  platform?: string,
): PlatformKey | null {
  const value = String(platform || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
  if (value.includes("instagram") || value === "insta" || value === "ig") {
    return "instagram";
  }
  if (value.includes("linkedin") || value === "li") {
    return "linkedin";
  }
  if (value.includes("facebook")) return "facebook";
  if (value === "x" || value.includes("twitter")) return "x";
  return null;
}

const PLATFORM_UI: Record<
  PlatformKey,
  {
    label: string;
    icon: string | null;
    useFacebookIcon?: boolean;
  }
> = {
  instagram: {
    label: "Instagram",
    icon: "/assets/insta.png",
  },
  linkedin: {
    label: "LinkedIn",
    icon: "/assets/linkedin.png",
  },
  facebook: {
    label: "Facebook",
    icon: null,
    useFacebookIcon: true,
  },
  x: {
    label: "X",
    icon: null,
  },
};

function PlatformGlyph({
  config,
  size = 14,
}: {
  config: (typeof PLATFORM_UI)[PlatformKey];
  size?: number;
}) {
  if (config.useFacebookIcon) {
    return <FacebookIcon className="size-3.5 text-[#1877F2]" />;
  }
  if (config.icon) {
    return (
      <Image
        src={config.icon}
        alt=""
        width={size}
        height={size}
        className="size-3.5 object-contain"
      />
    );
  }
  return null;
}

function PlatformHeader({ platform }: { platform?: string }) {
  const key = normalizeContentPlatform(platform);
  if (!key) {
    return (
      <span className="text-[13px] font-semibold text-neutral-800">
        {platform || "Content"}
      </span>
    );
  }
  const config = PLATFORM_UI[key];
  return (
    <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-neutral-900">
      <PlatformGlyph config={config} />
      {config.label}
    </span>
  );
}

function PublishButton({
  platform,
  isPublishing,
  disabled,
  onClick,
}: {
  platform?: string;
  isPublishing: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const key = normalizeContentPlatform(platform);
  const label = key ? PLATFORM_UI[key].label : "Post";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={isPublishing ? `Publishing on ${label}` : `Publish on ${label}`}
      className={`inline-flex h-11 w-full min-w-0 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#4F46E5] via-[#5B57E6] to-[#7C3AED] px-4 text-[13px] font-semibold text-white shadow-[0_6px_16px_rgba(91,87,230,0.28)] transition hover:brightness-105 disabled:pointer-events-none disabled:opacity-55 ${FOCUS_RING}`}
    >
      {isPublishing ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <Send className="size-4" aria-hidden="true" />
      )}
      <span className="truncate">{isPublishing ? "Publishing…" : "Publish"}</span>
    </button>
  );
}

/** Replaces the schedule/publish buttons once the item has gone live, so it can't be posted twice. */
function PostedNotice({ posted }: { posted: PostedContent }) {
  const key = normalizeContentPlatform(posted.platform);
  const label = key ? PLATFORM_UI[key].label : posted.platform;
  const when = formatDate(posted.postedAt);
  const profileUrl =
    posted.username && key === "instagram" ? `https://www.instagram.com/${posted.username}/` : null;

  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3.5 py-2.5">
      <CheckCircle2 className="size-4.5 shrink-0 text-emerald-600" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-emerald-800">Posted on {label}</p>
        {when ? <p className="text-[11px] text-emerald-700/80">{when}</p> : null}
      </div>
      {profileUrl ? (
        <a
          href={profileUrl}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex shrink-0 items-center gap-1 rounded text-[12px] font-medium text-emerald-800 hover:underline ${FOCUS_RING}`}
        >
          @{posted.username}
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </a>
      ) : null}
    </div>
  );
}

export function ResultCard({
  item,
  isPublishing = false,
  posted,
  onPublish,
}: {
  item: ContentGenerationResultItem;
  isPublishing?: boolean;
  /** Set once the item has been published; it can't be published or scheduled again. */
  posted?: PostedContent;
  onPublish?: (item: ContentGenerationResultItem) => void;
}) {
  const cover = item.images[0];
  const created = formatDate(item.createdAt);
  const canPublish = Boolean(cover?.imageUrl && onPublish);
  const caption = item.caption?.trim() || "";
  const details = contentDetails(item);
  const [previewOpen, setPreviewOpen] = useState(false);
  const imageCount = item.imagesCount || item.images.length || 0;
  const scheduledFor = formatSchedule(item.schedule);

  return (
    <li className="relative flex flex-col rounded-2xl border border-[#E6E8F5] bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <div className="mb-3 flex items-center justify-between gap-2">
        <PlatformHeader platform={item.platform} />
        <DeleteImageControls
          imageId={item.id}
          label={item.title || "image"}
          variant="inline"
        />
      </div>

      <div className="relative overflow-hidden rounded-xl bg-[#F6F7FD]">
        <div className="relative aspect-4/3">
          {cover ? (
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              aria-label="View full image"
              className={`group block size-full cursor-zoom-in ${FOCUS_RING}`}
            >
              <Image
                src={cover.thumbnailUrl || cover.imageUrl}
                alt={item.title || cover.headline || "Generated content"}
                className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                width={500}
                height={500}
                loading="lazy"
              />
              <span className="absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-full bg-black/55 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <Maximize2 className="size-3.5" aria-hidden="true" />
              </span>
            </button>
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-2 text-neutral-400">
              <ImageOff className="size-8" aria-hidden="true" />
              <p className="text-[12px] font-medium">No image generated</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-start gap-2">
          <h3 className="min-w-0 flex-1 text-[15px] font-semibold leading-snug tracking-tight text-neutral-900">
            {item.title || item.projectName || "Untitled generation"}
          </h3>
          {item.version != null ? (
            <span className="shrink-0 rounded-full bg-[#ECEBFF] px-2 py-0.5 text-[11px] font-semibold text-[#5B57E6]">
              v{item.version}
            </span>
          ) : null}
        </div>

        {caption ? (
          <div className="rounded-xl bg-[#F5F6FA] px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-400">
              Caption:
            </p>
            <p className="mt-1 line-clamp-3 text-[13px] leading-5 text-neutral-700">
              {caption}
            </p>
          </div>
        ) : null}

        <ContentDetailsList details={details} />

        {scheduledFor ? (
          <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#ECEBFF] px-2.5 py-1 text-[12px] font-medium text-[#5B57E6]">
            <CalendarClock className="size-3.5" aria-hidden="true" />
            Scheduled for {scheduledFor}
          </p>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px] text-neutral-500">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5 text-neutral-400" aria-hidden="true" />
            {created || "Unknown date"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ImageIcon className="size-3.5 text-neutral-400" aria-hidden="true" />
            {imageCount} {imageCount === 1 ? "image" : "images"}
          </span>
          {cover ? (
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className={`ml-auto inline-flex items-center gap-1 rounded font-medium text-neutral-500 transition-colors hover:text-[#5B57E6] ${FOCUS_RING}`}
            >
              View image
              <Maximize2 className="size-3" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        {posted ? (
          <PostedNotice posted={posted} />
        ) : (
          <div className={`grid gap-2 ${onPublish ? "grid-cols-2" : "grid-cols-1"}`}>
            <SchedulePostButton
              runId={item.id}
              platform={normalizeContentPlatform(item.platform)}
              schedule={item.schedule}
            />

            {onPublish ? (
              <PublishButton
                platform={item.platform}
                isPublishing={isPublishing}
                disabled={!canPublish || isPublishing}
                onClick={() => onPublish(item)}
              />
            ) : null}
          </div>
        )}
      </div>

      {cover ? <ContentPreviewDialog item={item} open={previewOpen} onOpenChange={setPreviewOpen} /> : null}
    </li>
  );
}
