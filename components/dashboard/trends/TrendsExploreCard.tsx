"use client";

import { Search } from "lucide-react";
import Card from "@/components/shared/card";
import type { NormalizedExploreData } from "@/types/bussiness/google-trends-type";
import { FOCUS_RING } from "@/utils/ui-classes";
import { formatTraffic } from "@/lib/trends/normalize";

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
  data: NormalizedExploreData;
  isLoading?: boolean;
  isFetching?: boolean;
  onSelect?: (query: string) => void;
};

export default function TrendsExploreCard({
  query,
  onQueryChange,
  onSubmit,
  data,
  isLoading = false,
  isFetching = false,
  onSelect,
}: Props) {
  const primarySeries = data.series[0];
  const maxValue = Math.max(
    ...(primarySeries?.points.map((point) => point.value) ?? [0]),
    1,
  );

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">
            Explore keyword
          </h2>
          <p className="mt-1 text-[13px] text-neutral-500">
            Compare related top and rising queries for a topic.
          </p>
        </div>
      </div>

      <form
        className="mt-4 flex flex-col gap-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search a keyword to explore..."
            aria-label="Explore keyword"
            className="h-11 w-full rounded-full border border-[#E6E8F5] bg-white pl-11 pr-4 text-sm outline-none placeholder:text-neutral-500 focus:ring-2 focus:ring-[#5B57E6]/30"
          />
        </div>
        <button
          type="submit"
          disabled={!query.trim() || isFetching}
          className={`h-11 rounded-full bg-gradient-to-r from-[#2E2A9E] to-[#4F46E5] px-6 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS_RING}`}
        >
          {isFetching ? "Exploring..." : "Explore"}
        </button>
      </form>

      {isLoading ? (
        <div className="mt-5 h-40 animate-pulse rounded-2xl bg-[#F1F4FF]" />
      ) : !query.trim() ? (
        <p className="mt-5 text-sm text-neutral-500">
          Pick a trending topic or search a keyword to see related interest.
        </p>
      ) : primarySeries && primarySeries.points.length > 0 ? (
        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[13px] font-medium text-neutral-900">
              {primarySeries.label}
            </p>
            <p className="text-[12px] text-neutral-500">
              {primarySeries.points.length} related
            </p>
          </div>
          <div className="flex h-40 items-end gap-1 rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] px-3 py-3">
            {primarySeries.points.slice(0, 24).map((point) => (
              <div
                key={`${point.label}-${point.value}`}
                className="group relative flex-1"
                title={`${point.label}: ${point.value}`}
              >
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-[#2E2A9E] to-[#8B87FF]"
                  style={{
                    height: `${Math.max(8, (point.value / maxValue) * 100)}%`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ) : data.errors.length > 0 ? (
        <p className="mt-5 text-sm text-[#B42318]">{data.errors[0]}</p>
      ) : (
        <p className="mt-5 text-sm text-neutral-500">
          No explore data returned for this keyword yet.
        </p>
      )}

      {(data.topQueries.length > 0 || data.risingQueries.length > 0) && (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {data.topQueries.length > 0 ? (
            <div>
              <h3 className="mb-2 text-[13px] font-semibold text-neutral-900">
                Top queries
              </h3>
              <ul className="space-y-2">
                {data.topQueries.slice(0, 8).map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onSelect?.(item.query)}
                      className="flex w-full items-center justify-between gap-2 rounded-xl border border-[#E6E8F5] bg-[#F6F7FD] px-3 py-2 text-left text-[12px] text-neutral-700 transition-colors hover:bg-white"
                    >
                      <span className="truncate">{item.query}</span>
                      <span className="shrink-0 text-neutral-500">
                        {formatTraffic(item.approxTraffic, item.searchVolume)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {data.risingQueries.length > 0 ? (
            <div>
              <h3 className="mb-2 text-[13px] font-semibold text-neutral-900">
                Rising queries
              </h3>
              <ul className="space-y-2">
                {data.risingQueries.slice(0, 8).map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onSelect?.(item.query)}
                      className="flex w-full items-center justify-between gap-2 rounded-xl border border-[#E6E8F5] bg-[#F6F7FD] px-3 py-2 text-left text-[12px] text-neutral-700 transition-colors hover:bg-white"
                    >
                      <span className="truncate">{item.query}</span>
                      <span className="shrink-0 text-[#3BA61F]">
                        {item.approxTraffic ??
                          (item.increasePercentage != null
                            ? `+${item.increasePercentage}%`
                            : "—")}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </Card>
  );
}
