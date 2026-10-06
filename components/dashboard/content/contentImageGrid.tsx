"use client";

import Image from "next/image";
import { ImageOff, Loader2, Trash2 } from "lucide-react";
import { DeleteImageMutation } from "@/routes/bussiness/Bussiness-Mutation";
import useAuthStore from "@/store/AuthsStore";
import { FOCUS_RING } from "@/utils/ui-classes";
import type { ContentGenerationResultItem, ContentImageItem } from "./utils";

function MetaChip({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  if (value == null || value === "") return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#E6E8F5] bg-[#F6F7FD] px-2 py-0.5 text-[10px] font-medium text-neutral-700">
      <span className="text-neutral-500">{label}</span>
      <span className="text-neutral-800">{value}</span>
    </span>
  );
}

function StatusChip({ success, status }: { success: boolean; status?: string }) {
  const label = status || (success ? "success" : "failed");
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
        success
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
          : "bg-rose-50 text-rose-700 ring-1 ring-rose-100"
      }`}
    >
      {label}
    </span>
  );
}

function formatDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function DeleteImageControls({
  imageId,
  label,
}: {
  imageId: string;
  label: string;
}) {
  const companyId = useAuthStore((s) => s.company_id);
  const { mutate, isPending } = DeleteImageMutation();

  if (!companyId || !imageId) return null;

  return (
    <>
      <div className="absolute right-2 top-2 z-20">
        <button
          type="button"
          aria-label={`Delete ${label}`}
          disabled={isPending}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            mutate(imageId);
          }}
          className={`grid size-8 place-items-center rounded-full border border-white/70 bg-white/95 text-neutral-500 shadow-sm backdrop-blur transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-70 ${FOCUS_RING}`}
        >
          {isPending ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <Trash2 className="size-3.5" aria-hidden="true" />
          )}
        </button>
      </div>
      {isPending ? (
        <div className="absolute inset-0 z-10 grid place-items-center bg-white/55 backdrop-blur-[1px]">
          <Loader2
            className="size-7 animate-spin text-[#5B57E6]"
            aria-label="Deleting"
          />
        </div>
      ) : null}
    </>
  );
}

function ImageCard({ item }: { item: ContentImageItem }) {
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

function ResultCard({ item }: { item: ContentGenerationResultItem }) {
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

export function ContentResultsGrid({
  items,
}: {
  items: ContentGenerationResultItem[];
}) {
  if (!items.length) return null;

  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <ResultCard key={item.id} item={item} />
      ))}
    </ul>
  );
}

export default function ContentImageGrid({
  items,
}: {
  items: ContentImageItem[];
}) {
  if (!items.length) return null;

  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <ImageCard key={item.id} item={item} />
      ))}
    </ul>
  );
}
