"use client";

import Image from "next/image";
import { DeleteImageControls } from "./deleteImageControl";
import { MetaChip } from "./meta-chips";
import type { ContentImageItem } from "./utils";

export function ImageCard({ item }: { item: ContentImageItem }) {
  return (
    <li className="overflow-hidden rounded-2xl border border-[#E6E8F5] bg-white shadow-[0_4px_18px_rgba(17,24,39,0.04)]">
      <div className="relative aspect-square bg-[#F6F7FD]">
        <Image
          src={item.thumbnailUrl || item.imageUrl}
          alt={item.title || item.headline || "Generated content"}
          className="size-full object-cover"
          width={500}
          height={500}
          loading="lazy"
        />
        <DeleteImageControls
          imageId={item.runId || item.id}
          label={item.title || item.headline || "image"}
        />
      </div>

      <div className="space-y-2 p-3">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-neutral-900">
            {item.title || item.headline || item.projectName || "Generated image"}
          </p>
          {item.prompt ? (
            <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-neutral-500">
              {item.prompt}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-1">
          <MetaChip label="Platform" value={item.platform} />
          <MetaChip label="Purpose" value={item.purpose} />
          <MetaChip label="Scene" value={item.sceneNumber} />
          <MetaChip label="Status" value={item.status} />
        </div>

        <a
          href={item.imageUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex text-[12px] font-medium text-[#5B57E6] hover:underline"
        >
          Open full image
        </a>
      </div>
    </li>
  );
}
