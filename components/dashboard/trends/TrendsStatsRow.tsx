"use client";

import { Activity, ArrowUpRight, Sparkles, TrendingUp } from "lucide-react";
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
      hint: geoLabel
        ? `${geoLabel}${dateLabel ? ` · ${dateLabel}` : ""}`
        : "Currently rising",
      liveDot: true,
      icon: Activity,
      iconTone: "border-[#DCDBFB] bg-[#F1F0FF] text-[#5B57E6]",
      footer: "Real-time volume tracking",
      footerTag: (
        <span className="inline-flex items-center gap-0.5 text-[12px] font-semibold text-[#5B57E6]">
          Live
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </span>
      ),
    },
    {
      id: "lift",
      label: "Avg. rising score",
      value: isLoading ? "—" : formatPercent(avgLift),
      hint: "Across rising queries",
      liveDot: false,
      icon: TrendingUp,
      iconTone: "border-[#CDEFD9] bg-[#ECFAF1] text-[#16A34A]",
      footer: "Velocity indicator",
      footerTag: (
        <span className="rounded-full bg-[#DDF7E7] px-2.5 py-0.5 text-[11px] font-semibold text-[#15803D]">
          Breakout ready
        </span>
      ),
    },
    {
      id: "volume",
      label: "Top traffic",
      value: isLoading
        ? "—"
        : formatTraffic(topItem?.approxTraffic ?? null, topItem?.searchVolume ?? null),
      hint: topItem?.topic ?? "Highest search traffic",
      liveDot: false,
      icon: Sparkles,
      iconTone: "border-[#FBE3BF] bg-[#FFF6E8] text-[#E08A0B]",
      footer: "Peak query lead",
      footerTag: (
        <span className="text-[12px] font-semibold text-[#E07A0B]">
          Highest interest
        </span>
      ),
    },
  ];

  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <li
            key={stat.id}
            className="flex flex-col rounded-2xl border border-[#E6E8F5] bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.03)] sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
                  {stat.label}
                </p>
                <p className="mt-1.5 truncate text-[26px] font-bold leading-none tracking-tight text-neutral-900">
                  {stat.value}
                </p>
                <p className="mt-2 flex items-center gap-1.5 truncate text-[12px] text-neutral-500">
                  {stat.liveDot ? (
                    <span
                      className="size-1.5 shrink-0 rounded-full bg-emerald-500"
                      aria-hidden="true"
                    />
                  ) : null}
                  <span className="truncate">{stat.hint}</span>
                </p>
              </div>
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-xl border ${stat.iconTone}`}
              >
                <Icon className="size-4.5" aria-hidden="true" />
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#EEF0F8] pt-3">
              <span className="truncate text-[12px] text-neutral-500">
                {stat.footer}
              </span>
              {stat.footerTag}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
