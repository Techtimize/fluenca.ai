"use client";

import { ImageCard } from "./imageCard";
import type { ContentImageItem } from "./utils";

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
