"use client";

import { ResultCard } from "./resultcard";
import type { PostedContent } from "@/lib/content/posted-content";
import type { ContentGenerationResultItem } from "./utils";

export function ContentResultsGrid({
  items,
  publishingId,
  posted,
  onPublish,
}: {
  items: ContentGenerationResultItem[];
  publishingId?: string | null;
  /** Items already published, keyed by content id. */
  posted?: Record<string, PostedContent>;
  onPublish?: (item: ContentGenerationResultItem) => void;
}) {
  if (!items.length) return null;

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <ResultCard
          key={item.id}
          item={item}
          isPublishing={publishingId === item.id}
          posted={posted?.[item.id]}
          onPublish={onPublish}
        />
      ))}
    </ul>
  );
}
