"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import { formatDate } from "@/utils/format-date";
import { DeleteImageControls } from "./deleteImageControl";
import { MetaChip } from "./meta-chips";
import { StatusChip } from "./status-chips";
import type { ContentGenerationResultItem } from "./utils";

export function ResultCard({ item }: { item: ContentGenerationResultItem }) {
  const cover = item.images[0];
  const created = formatDate(item.createdAt);

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
        <div className="absolute left-2 top-2 z-20">
          <StatusChip success={item.success} status={item.status} />
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
          {item.summary || item.hook || item.caption ? (
            <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-neutral-500">
              {item.summary || item.hook || item.caption}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-1">
          <MetaChip label="Platform" value={item.platform} />
          <MetaChip label="Purpose" value={item.purpose} />
          <MetaChip label="Ratio" value={item.aspectRatio} />
          <MetaChip
            label="Images"
            value={`${item.imagesCount}/${item.jobsCount || item.imagesCount}`}
          />
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <p className="text-[11px] text-neutral-400">
            {created || "Unknown date"}
          </p>
          {cover ? (
            <a
              href={cover.imageUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex text-[12px] font-medium text-[#5B57E6] hover:underline"
            >
              Open image
            </a>
          ) : null}
        </div>
      </div>
    </li>
  );
}
