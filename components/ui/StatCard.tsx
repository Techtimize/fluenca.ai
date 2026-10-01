"use client";

import {
  BarChart3,
  CalendarDays,
  FileText,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import Card from "@/components/shared/card";
import type { StatMetric } from "@/types/bussiness/dashboard";

type IconVariant = StatMetric["iconVariant"];

const ICON_CONFIG: Record<
  IconVariant,
  { bg: string; color: string; Icon: LucideIcon }
> = {
  competitors: {
    bg: "bg-[#ECEBFF]",
    color: "text-[#5B57E6]",
    Icon: Users,
  },
  posts: {
    bg: "bg-[#E6F7F4]",
    color: "text-[#0F766E]",
    Icon: FileText,
  },
  engagement: {
    bg: "bg-[#FEF3C7]",
    color: "text-[#B45309]",
    Icon: TrendingUp,
  },
  calendar: {
    bg: "bg-[#E8F1FB]",
    color: "text-[#0A66C2]",
    Icon: CalendarDays,
  },
};

const FALLBACK = {
  bg: "bg-[#F3F4F6]",
  color: "text-neutral-600",
  Icon: BarChart3,
};

interface StatCardProps {
  metric: StatMetric;
}

export function StatCard({ metric }: StatCardProps) {
  const config = ICON_CONFIG[metric.iconVariant] ?? FALLBACK;
  const Icon = config.Icon;

  return (
    <Card className="flex items-start justify-between gap-4 p-5">
      <div className="min-w-0">
        <p className="text-[12px] font-medium text-neutral-500">{metric.label}</p>
        <p className="mt-1 truncate text-2xl font-semibold tracking-tight text-neutral-900">
          {metric.value}
        </p>
        {metric.subtitle ? (
          <p className="mt-1 text-[12px] text-neutral-400">{metric.subtitle}</p>
        ) : null}
      </div>
      <span
        className={`grid size-10 shrink-0 place-items-center rounded-2xl ${config.bg} ${config.color}`}
      >
        <Icon className="size-5" aria-hidden="true" />
      </span>
    </Card>
  );
}

interface StatCardGridProps {
  metrics: StatMetric[];
}

export function StatCardGrid({ metrics }: StatCardGridProps) {
  if (!metrics?.length) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <StatCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
}
