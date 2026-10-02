"use client";

import type { ChartSegment } from "@/types/bussiness/dashboard";

type Props = {
  segments: ChartSegment[];
  centerLabel?: string;
};

export function CompetitorsDonutChart({ segments, centerLabel = "Mix" }: Props) {
  const total = segments.reduce((sum, item) => sum + item.value, 0);

  if (!segments.length || total <= 0) {
    return (
      <div className="grid min-h-[180px] place-items-center text-[13px] text-neutral-500">
        No chart data yet
      </div>
    );
  }

  let cursor = 0;
  const stops = segments.map((segment) => {
    const start = (cursor / total) * 100;
    cursor += segment.value;
    const end = (cursor / total) * 100;
    return `${segment.color} ${start}% ${end}%`;
  });

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
      <div
        className="relative size-40 shrink-0 rounded-full"
        style={{ background: `conic-gradient(${stops.join(", ")})` }}
        aria-hidden="true"
      >
        <div className="absolute inset-5 grid place-items-center rounded-full bg-white">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.04em] text-neutral-400">{centerLabel}</p>
            <p className="mt-0.5 text-sm font-semibold text-neutral-900">{segments.length}</p>
          </div>
        </div>
      </div>

      <ul className="w-full space-y-2">
        {segments.map((segment) => {
          const pct = Math.round((segment.value / total) * 100);
          return (
            <li key={segment.label} className="flex items-center justify-between gap-3 text-[13px]">
              <span className="flex min-w-0 items-center gap-2 text-neutral-700">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="truncate">{segment.label}</span>
              </span>
              <span className="font-medium text-neutral-900">{pct}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
