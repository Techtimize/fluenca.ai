"use client";

import { Activity, Sparkles, TrendingUp } from "lucide-react";
import Card from "@/components/shared/card";
import type { NormalizedTrendItem } from "@/types/bussiness/google-trends-type";
import { formatPercent, formatTraffic } from "@/lib/trends/normalize";

type Props = {
  items: NormalizedTrendItem[];
  isLoading?: boolean;
  geoLabel?: string | null;
  dateLabel?: string | null;
};

export default function TrendsStatsRow({
  items,
  isLoading = false,
  geoLabel,
  dateLabel,
}: Props) {
  const activeCount = items.length;
  const avgLift =
    items.filter((item) => item.increasePercentage != null).length > 0
      ? Math.round(
          items.reduce(
            (sum, item) => sum + (item.increasePercentage ?? 0),
            0,
          ) /
            items.filter((item) => item.increasePercentage != null).length,
        )
      : null;
  const topItem = items.reduce<NormalizedTrendItem | null>((best, item) => {
    if (item.searchVolume == null) return best;
    if (!best || (best.searchVolume ?? 0) < item.searchVolume) return item;
    return best;
  }, null);

  const stats = [
    {
      id: "active",
      label: "Active trends",
      value: isLoading ? "—" : String(activeCount),
      hint: geoLabel ? `${geoLabel}${dateLabel ? ` · ${dateLabel}` : ""}` : "Currently rising",
      icon: Activity,
      tone: "bg-[#ECEBFF] text-[#5B57E6]",
    },
    {
      id: "lift",
      label: "Avg. rising score",
      value: isLoading ? "—" : formatPercent(avgLift),
      hint: "Across rising queries",
      icon: TrendingUp,
      tone: "bg-[#EAF7E4] text-[#3BA61F]",
    },
    {
      id: "volume",
      label: "Top traffic",
      value: isLoading
        ? "—"
        : formatTraffic(topItem?.approxTraffic ?? null, topItem?.searchVolume ?? null),
      hint: topItem?.topic ?? "Highest search traffic",
      icon: Sparkles,
      tone: "bg-[#FFF3E2] text-[#E08A0B]",
    },
  ];

  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <li key={stat.id}>
            <Card className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-neutral-900">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-neutral-900">
                    {stat.value}
                  </p>
                  <p className="mt-1 truncate text-[11px] text-neutral-500">
                    {stat.hint}
                  </p>
                </div>
                <span
                  className={`grid size-10 place-items-center rounded-2xl ${stat.tone}`}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
              </div>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
