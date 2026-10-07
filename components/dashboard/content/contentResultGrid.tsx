"use client";

import { ResultCard } from "./resultcard";
import type { ContentGenerationResultItem } from "./utils";

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
