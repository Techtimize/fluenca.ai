"use client";

import { ArrowUpRight, Flame, Newspaper, TrendingUp } from "lucide-react";
import Card from "@/components/shared/card";
import type { NormalizedTrendItem } from "@/types/bussiness/google-trends-type";
import {
  formatPercent,
  formatTraffic,
} from "@/lib/trends/normalize";

type Props = {
  title: string;
  subtitle?: string;
  items: NormalizedTrendItem[];
  isLoading?: boolean;
  emptyMessage?: string;
  showRising?: boolean;
  onSelect?: (query: string) => void;
};

export default function TrendsListCard({
  title,
  subtitle,
  items,
  isLoading = false,
  emptyMessage = "No trends available right now.",
  showRising = false,
  onSelect,
}: Props) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
          {subtitle ? (
            <p className="mt-1 text-[13px] text-neutral-500">{subtitle}</p>
          ) : null}
        </div>
        <span className="grid size-10 place-items-center rounded-2xl bg-[#ECEBFF] text-[#5B57E6]">
          <Flame className="size-5" aria-hidden="true" />
        </span>
      </div>

      {isLoading ? (
        <ul className="mt-4 space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <li
              key={index}
              className="h-16 animate-pulse rounded-2xl bg-[#F1F4FF]"
            />
          ))}
        </ul>
      ) : items.length === 0 ? (
        <p className="mt-6 text-sm text-neutral-500">{emptyMessage}</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {items.map((item, index) => {
            const headline = item.newsItems[0];
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelect?.(item.query)}
                  className="flex w-full items-start gap-3 rounded-2xl border border-[#E6E8F5] bg-white px-3 py-3 text-left transition-colors hover:bg-[#F6F7FD]"
                >
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-[#F1F4FF] text-xs font-semibold text-[#5B57E6]">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-neutral-900">
                      {item.topic || item.query}
                    </span>
                    <span className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
                      <span>
                        Traffic{" "}
                        {formatTraffic(item.approxTraffic, item.searchVolume)}
                      </span>
                      {item.queryType ? (
                        <span className="rounded-full bg-[#F6F7FD] px-2 py-0.5 capitalize text-neutral-600">
                          {item.queryType}
                        </span>
                      ) : null}
                      {item.categories.slice(0, 1).map((category) => (
                        <span
                          key={category}
                          className="rounded-full bg-[#F6F7FD] px-2 py-0.5 text-neutral-600"
                        >
                          {category}
                        </span>
                      ))}
                    </span>
                    {headline ? (
                      <span className="mt-1.5 flex items-start gap-1.5 text-[11px] text-neutral-500">
                        <Newspaper
                          className="mt-0.5 size-3 shrink-0"
                          aria-hidden="true"
                        />
                        <span className="line-clamp-1">
                          {headline.source}: {headline.title}
                        </span>
                      </span>
                    ) : null}
                  </span>
                  {/* {showRising && item.increasePercentage != null ? (
                    <span className="flex shrink-0 items-center gap-1 text-[12px] font-medium text-[#3BA61F]">
                      <TrendingUp className="size-3.5" aria-hidden="true" />
                      {formatPercent(item.increasePercentage)}
                    </span>
                  ) : (
                    <ArrowUpRight
                      className="mt-1 size-4 shrink-0 text-neutral-400"
                      aria-hidden="true"
                    />
                  )} */}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
