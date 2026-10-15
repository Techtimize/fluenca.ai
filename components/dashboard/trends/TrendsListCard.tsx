"use client";

import { ArrowUpRight, BarChart3, Flame, Newspaper, Zap } from "lucide-react";
import type { NormalizedTrendItem } from "@/types/bussiness/google-trends-type";
import { formatTraffic } from "@/lib/trends/normalize";
import { cn } from "@/lib/utils";

type Variant = "trending" | "rising" | "top";

const VARIANTS: Record<
  Variant,
  {
    Icon: typeof Flame;
    iconTone: string;
    tag: string;
    tagTone: string;
  }
> = {
  trending: {
    Icon: Flame,
    iconTone: "bg-[#FFF1EE] text-[#F04438]",
    tag: "Trending",
    tagTone: "bg-[#E7F8EE] text-[#15803D]",
  },
  rising: {
    Icon: ArrowUpRight,
    iconTone: "bg-[#F1F0FF] text-[#5B57E6]",
    tag: "Rising",
    tagTone: "bg-[#F1F0FF] text-[#5B57E6]",
  },
  top: {
    Icon: BarChart3,
    iconTone: "bg-[#FFF6E8] text-[#E08A0B]",
    tag: "Top",
    tagTone: "bg-[#FFF6E8] text-[#B45309]",
  },
};

type Props = {
  title: string;
  subtitle?: string;
  items: NormalizedTrendItem[];
  isLoading?: boolean;
  emptyMessage?: string;
  variant?: Variant;
  geoLabel?: string | null;
  onSelect?: (query: string) => void;
};

export default function TrendsListCard({
  title,
  subtitle,
  items,
  isLoading = false,
  emptyMessage = "No trends available right now.",
  variant = "trending",
  geoLabel,
  onSelect,
}: Props) {
  const { Icon, iconTone, tag, tagTone } = VARIANTS[variant];

  return (
    <section className="overflow-hidden rounded-2xl border border-[#E6E8F5] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
      <header className="flex items-center justify-between gap-3 border-b border-[#EEF0F8] px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`grid size-9 shrink-0 place-items-center rounded-xl ${iconTone}`}
          >
            <Icon className="size-4.5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="text-[15px] font-semibold text-neutral-900">{title}</h2>
            {subtitle ? (
              <p className="truncate text-[12px] text-neutral-500">{subtitle}</p>
            ) : null}
          </div>
        </div>
        {variant === "rising" ? (
          <Zap className="size-4 shrink-0 text-[#5B57E6]" aria-hidden="true" />
        ) : null}
      </header>

      {isLoading ? (
        <ul className="space-y-3 p-4 sm:p-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <li
              key={index}
              className="h-14 animate-pulse rounded-xl bg-[#F4F5FD]"
            />
          ))}
        </ul>
      ) : items.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-neutral-500">
          {emptyMessage}
        </p>
      ) : (
        <ul className="divide-y divide-[#EEF0F8]">
          {items.map((item, index) => {
            const headline = item.newsItems[0];
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelect?.(item.query)}
                  className="flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[#FAFBFF] sm:px-5"
                >
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[#F1F2F8] text-[11px] font-semibold text-neutral-600">
                    {index + 1}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold text-neutral-900">
                      {item.topic || item.query}
                    </span>

                    <span className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-500">
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 font-medium",
                          tagTone,
                        )}
                      >
                        {tag}
                      </span>
                      {geoLabel ? (
                        <>
                          <span aria-hidden="true">•</span>
                          <span>{geoLabel}</span>
                        </>
                      ) : null}
                      {item.queryType ? (
                        <span className="rounded-md bg-[#F6F7FD] px-2 py-0.5 capitalize text-neutral-600">
                          {item.queryType}
                        </span>
                      ) : null}
                      {item.categories.slice(0, 1).map((category) => (
                        <span
                          key={category}
                          className="rounded-md bg-[#F6F7FD] px-2 py-0.5 text-neutral-600"
                        >
                          {category}
                        </span>
                      ))}
                    </span>

                    {headline ? (
                      <span className="mt-1.5 flex items-start gap-1.5 text-[12px] text-neutral-500">
                        <Newspaper
                          className="mt-0.5 size-3.5 shrink-0 text-neutral-400"
                          aria-hidden="true"
                        />
                        <span className="line-clamp-1">
                          <span className="font-semibold text-neutral-700">
                            {headline.source}:
                          </span>{" "}
                          {headline.title}
                        </span>
                      </span>
                    ) : null}
                  </span>

                  <span className="shrink-0 whitespace-nowrap rounded-md border border-[#C9D7FB] bg-[#F3F7FF] px-2 py-0.5 text-[11px] font-semibold text-[#2F5BD3]">
                    Traffic {formatTraffic(item.approxTraffic, item.searchVolume)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
