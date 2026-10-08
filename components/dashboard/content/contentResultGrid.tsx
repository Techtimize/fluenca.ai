"use client";

import { ResultCard } from "./resultcard";
import type { ContentGenerationResultItem } from "./utils";

export function ContentResultsGrid({
  items,
  publishingId,
  onPublish,
}: {
  items: ContentGenerationResultItem[];
  publishingId?: string | null;
  onPublish?: (item: ContentGenerationResultItem) => void;
}) {
  if (!items.length) return null;

  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <ResultCard
          key={item.id}
          item={item}
          isPublishing={publishingId === item.id}
          onPublish={onPublish}
        />
      ))}
    </ul>
  );
}
