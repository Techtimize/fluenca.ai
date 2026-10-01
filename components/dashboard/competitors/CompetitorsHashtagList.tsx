"use client";

import Card from "@/components/shared/card";
import type { HashtagItem } from "@/types/bussiness/dashboard";

type Props = {
  items: HashtagItem[];
};

export function CompetitorsHashtagList({ items }: Props) {
  return (
    <Card className="p-5">
      <h3 className="text-[15px] font-semibold text-neutral-900">Top hashtags</h3>
      <p className="mt-1 text-[13px] text-neutral-500">Most common tags across competitor posts</p>

      {items.length ? (
        <ul className="mt-4 space-y-3">
          {items.map((item) => {
            const width = Math.max(8, Math.round((item.count / Math.max(item.maxCount, 1)) * 100));
            return (
              <li key={item.tag}>
                <div className="mb-1 flex items-center justify-between gap-2 text-[12px]">
                  <span className="font-medium text-[#5B57E6]">{item.tag}</span>
                  <span className="text-neutral-400">{item.count}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#ECEBFF]">
                  <div className="h-full rounded-full bg-[#5B57E6]" style={{ width: `${width}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-4 text-[13px] text-neutral-500">No hashtags found yet.</p>
      )}
    </Card>
  );
}
