"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FOCUS_RING } from "@/utils/ui-classes";
import { cn } from "@/lib/utils";
import type { ContentGenerationResultItem } from "./utils";

/** Placeholder values the generator returns when nothing was chosen; they carry no meaning. */
const EMPTY_VALUES = new Set(["default", "none", "n/a", "na", "null", "undefined", "auto", "-"]);

function humanize(value: string) {
  const text = value.trim().replace(/[_-]+/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Type and format share the first row; tone (and style) get a full-width row each, since they run longer.
 * Placeholder values like "default" are dropped.
 */
export function contentDetails(item: ContentGenerationResultItem) {
  const fields: [string, string | undefined][] = [
    ["Type", item.purpose],
    ["Format", item.aspectRatio],
    ["Tone", item.tone],
    ["Style", item.style],
  ];
  const visible = fields
    .map(([label, value]) => [label, value?.trim() ?? ""] as const)
    .filter(([, value]) => value && !EMPTY_VALUES.has(value.toLowerCase()));
  const pairCount = visible.filter(([label]) => label === "Type" || label === "Format").length;
  return visible.map(([label, value]) => ({
    label,
    value: label === "Format" ? value : humanize(value),
    // A lone Type or Format fills the row instead of leaving an empty half.
    wide: !(label === "Type" || label === "Format") || pairCount === 1,
  }));
}

/** Label/value grid for the content details; used on the card and in the preview. */
export function ContentDetailsList({
  details,
  className,
}: {
  details: ReturnType<typeof contentDetails>;
  className?: string;
}) {
  if (!details.length) return null;
  return (
    <dl className={cn("grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#ECEDF5] bg-[#ECEDF5]", className)}>
      {details.map((detail) => (
        <div key={detail.label} className={cn("min-w-0 bg-white px-3 py-2", detail.wide && "col-span-2")}>
          <dt className="text-[11px] text-neutral-500">{detail.label}</dt>
          <dd className="truncate text-[13px] font-medium text-neutral-900" title={detail.value}>
            {detail.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

type Props = {
  item: ContentGenerationResultItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ContentPreviewDialog({ item, open, onOpenChange }: Props) {
  const images = item.images.filter((image) => image.imageUrl);
  const [index, setIndex] = useState(0);
  const current = images[Math.min(index, images.length - 1)];
  const details = contentDetails(item);
  const caption = item.caption?.trim();
  const title = item.title || item.projectName || "Generated content";
  const step = (delta: number) => setIndex((i) => (i + delta + images.length) % images.length);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="flex max-h-[min(92vh,900px)] w-full max-w-[calc(100%-1rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-5xl md:flex-row"
      >
        <div className="relative flex min-h-64 flex-1 items-center justify-center bg-neutral-950 md:min-h-0">
          {current ? (
            <Image
              src={current.imageUrl}
              alt={current.headline || title}
              width={1600}
              height={1600}
              sizes="(min-width: 768px) 640px, 100vw"
              className="max-h-[55vh] w-auto object-contain md:max-h-[88vh]"
            />
          ) : null}
          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous image"
                className={`absolute left-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-neutral-800 shadow hover:bg-white ${FOCUS_RING}`}
              >
                <ChevronLeft className="size-4.5" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next image"
                className={`absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-neutral-800 shadow hover:bg-white ${FOCUS_RING}`}
              >
                <ChevronRight className="size-4.5" />
              </button>
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium tabular-nums text-white">
                {index + 1} / {images.length}
              </span>
            </>
          ) : null}
        </div>

        <aside className="flex w-full shrink-0 flex-col gap-4 overflow-y-auto p-5 md:w-80">
          <DialogHeader className="pe-8">
            <DialogTitle className="text-[16px] font-semibold leading-snug text-neutral-900">{title}</DialogTitle>
            <DialogDescription className="sr-only">Full-size preview of this generated content.</DialogDescription>
          </DialogHeader>

          {details.length ? (
            <section className="space-y-2">
              <h3 className="text-xs font-medium text-neutral-500">Content type</h3>
              <ContentDetailsList details={details} />
            </section>
          ) : null}

          {caption ? (
            <section className="space-y-2">
              <h3 className="text-xs font-medium text-neutral-500">Caption</h3>
              <p className="whitespace-pre-line text-[13px] leading-6 text-neutral-800">{caption}</p>
            </section>
          ) : null}

          {images.length > 1 ? (
            <ul className="grid grid-cols-4 gap-2">
              {images.map((image, i) => (
                <li key={image.id}>
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Show image ${i + 1}`}
                    aria-current={i === index ? "true" : undefined}
                    className={cn(
                      `relative block aspect-square w-full overflow-hidden rounded-lg ring-2 ${FOCUS_RING}`,
                      i === index ? "ring-[#5452F6]" : "ring-transparent opacity-70 hover:opacity-100",
                    )}
                  >
                    <Image
                      src={image.thumbnailUrl || image.imageUrl}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          {current ? (
            <a
              href={current.imageUrl}
              target="_blank"
              rel="noreferrer"
              className={`mt-auto inline-flex items-center gap-1 self-start rounded text-[13px] font-medium text-[#5452F6] hover:underline ${FOCUS_RING}`}
            >
              Open original
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          ) : null}
        </aside>
      </DialogContent>
    </Dialog>
  );
}
