"use client";

import Image from "next/image";
import { ArrowUpRight, ImageOff, Loader2 } from "lucide-react";
import { FacebookIcon } from "@/components/shared/brandIcons";
import { formatDate } from "@/utils/format-date";
import { FOCUS_RING } from "@/utils/ui-classes";
import { DeleteImageControls } from "./deleteImageControl";
import { MetaChip } from "./meta-chips";
import type { ContentGenerationResultItem } from "./utils";

type PlatformKey = "instagram" | "linkedin" | "facebook" | "x";

function normalizePlatform(platform?: string): PlatformKey | null {
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
    badgeClass: string;
    buttonClass: string;
  }
> = {
  instagram: {
    label: "Instagram",
    icon: "/assets/insta.png",
    badgeClass: "bg-[#FCE7F3] text-[#BE185D]",
    buttonClass:
      "border-[#F5C2D8] bg-[linear-gradient(135deg,#FDF2F8_0%,#FFFFFF_55%)] text-[#BE185D] hover:border-[#EC4899] hover:bg-[#FCE7F3]",
  },
  linkedin: {
    label: "LinkedIn",
    icon: "/assets/linkedin.png",
    badgeClass: "bg-[#E8F1FB] text-[#0A66C2]",
    buttonClass:
      "border-[#BFD6F2] bg-[linear-gradient(135deg,#EFF6FF_0%,#FFFFFF_55%)] text-[#0A66C2] hover:border-[#0A66C2] hover:bg-[#E8F1FB]",
  },
  facebook: {
    label: "Facebook",
    icon: null,
    useFacebookIcon: true,
    badgeClass: "bg-[#E8F1FB] text-[#1877F2]",
    buttonClass:
      "border-[#B7D0F5] bg-[linear-gradient(135deg,#EFF6FF_0%,#FFFFFF_55%)] text-[#1877F2] hover:border-[#1877F2] hover:bg-[#E8F1FB]",
  },
  x: {
    label: "X",
    icon: null,
    badgeClass: "border border-[#E6E8F5] bg-[#F6F7FD] text-neutral-700",
    buttonClass:
      "border-[#D8D6F5] bg-[#F6F5FF] text-[#5B57E6] hover:border-[#5B57E6] hover:bg-[#ECEBFF]",
  },
};

function PlatformGlyph({
  config,
  size = 12,
}: {
  config: (typeof PLATFORM_UI)[PlatformKey];
  size?: number;
}) {
  if (config.useFacebookIcon) {
    return (
      <FacebookIcon
        className={size === 16 ? "size-4 text-[#1877F2]" : "size-3 text-[#1877F2]"}
      />
    );
  }
  if (config.icon) {
    return (
      <Image
        src={config.icon}
        alt=""
        width={size}
        height={size}
        className={
          size === 16
            ? "size-4 object-contain"
            : "size-3 rounded-[2px] object-contain"
        }
      />
    );
  }
  return null;
}

function PlatformBadge({ platform }: { platform?: string }) {
  const key = normalizePlatform(platform);
  if (!key) {
    if (!platform) return null;
    return <MetaChip label="Platform" value={platform} />;
  }

  const config = PLATFORM_UI[key];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium shadow-sm backdrop-blur-sm ${config.badgeClass}`}
    >
      <PlatformGlyph config={config} size={12} />
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
  const key = normalizePlatform(platform);
  const config = key ? PLATFORM_UI[key] : null;
  const label = config?.label ?? "Post";
  const buttonClass =
    config?.buttonClass ??
    "border-[#D8D6F5] bg-[#F6F5FF] text-[#5B57E6] hover:border-[#5B57E6] hover:bg-[#ECEBFF]";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`group inline-flex h-10 w-full items-center justify-between gap-2 rounded-xl border px-3 text-[12px] font-semibold transition-all active:translate-y-px disabled:pointer-events-none disabled:opacity-55 ${buttonClass} ${FOCUS_RING}`}
    >
      <span className="inline-flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-lg bg-white/90 ring-1 ring-black/5">
          {isPublishing ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          ) : config ? (
            <PlatformGlyph config={config} size={16} />
          ) : (
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          )}
        </span>
        <span className="text-left leading-tight">
          <span className="block text-[10px] font-medium uppercase tracking-[0.06em] opacity-70">
            {isPublishing ? "Publishing" : "Ready to share"}
          </span>
          <span className="block">
            {isPublishing ? `Publishing on ${label}…` : `Publish on ${label}`}
          </span>
        </span>
      </span>
      {!isPublishing ? (
        <ArrowUpRight
          className="size-4 shrink-0 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
          aria-hidden="true"
        />
      ) : null}
    </button>
  );
}

export function ResultCard({
  item,
  isPublishing = false,
  onPublish,
}: {
  item: ContentGenerationResultItem;
  isPublishing?: boolean;
  onPublish?: (item: ContentGenerationResultItem) => void;
}) {
  const cover = item.images[0];
  const created = formatDate(item.createdAt);
  const canPublish = Boolean(cover?.imageUrl && onPublish);
  const caption = item.caption?.trim() || "";
  const summary = item.summary?.trim() || item.hook?.trim() || "";

  return (
    <li className="flex flex-col overflow-hidden rounded-2xl border border-[#E6E8F5] bg-white shadow-[0_4px_18px_rgba(17,24,39,0.04)]">
      <div className="relative aspect-square bg-[#F6F7FD]">
        {cover ? (
          <Image
            src={cover.thumbnailUrl || cover.imageUrl}
            alt={item.title || cover.headline || "Generated content"}
            className="size-full object-cover"
            width={500}
            height={500}
            loading="lazy"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-neutral-400">
            <ImageOff className="size-8" aria-hidden="true" />
            <p className="text-[12px] font-medium">No image generated</p>
          </div>
        )}
        <div className="absolute left-2 top-2">
          <PlatformBadge platform={item.platform} />
        </div>
        <DeleteImageControls
          imageId={item.id}
          label={item.title || "image"}
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-[13px] font-semibold text-neutral-900">
              {item.title || item.projectName || "Untitled generation"}
            </p>
            {item.version != null ? (
              <span className="shrink-0 text-[11px] font-medium text-neutral-400">
                v{item.version}
              </span>
            ) : null}
          </div>
          {summary && summary !== caption ? (
            <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-neutral-500">
              {summary}
            </p>
          ) : null}
        </div>

        {caption ? (
          <div className="rounded-xl bg-[#F6F7FD] px-2.5 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
              Caption
            </p>
            <p className="mt-1 line-clamp-3 text-[12px] leading-5 text-neutral-700">
              {caption}
            </p>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-1">
          <MetaChip label="Purpose" value={item.purpose} />
          <MetaChip label="Ratio" value={item.aspectRatio} />
          {normalizePlatform(item.platform) === "instagram" ? (
            <MetaChip
              label="Images"
              value={`${item.imagesCount}/${item.jobsCount || item.imagesCount}`}
            />
          ) : null}
        </div>

        <div className="mt-auto space-y-2 border-t border-[#EEF0F8] pt-2.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] text-neutral-400">
              {created || "Unknown date"}
            </p>
            {cover ? (
              <a
                href={cover.imageUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[12px] font-medium text-neutral-500 transition-colors hover:text-[#5B57E6]"
              >
                Open image
                <ArrowUpRight className="size-3" aria-hidden="true" />
              </a>
            ) : null}
          </div>
          {onPublish ? (
            <PublishButton
              platform={item.platform}
              isPublishing={isPublishing}
              disabled={!canPublish || isPublishing}
              onClick={() => onPublish(item)}
            />
          ) : null}
        </div>
      </div>
    </li>
  );
}
