import Image from "next/image";
import { Clock3, FileText, LayoutGrid, Target } from "lucide-react";
import type { PlatformPlan } from "@/types/bussiness/content-recommendation-type";
import { cn } from "@/lib/utils";

export type PlatformStrategyStat = {
  label: string;
  /** 0–100 percentage for the progress bar */
  percent: number;
};

export type PlatformStrategyCardProps = {
  platformName: string;
  description?: string | null;
  goal?: string | null;
  tags?: string[];
  stats?: PlatformStrategyStat[];
  iconSrc?: string;
  className?: string;
};

function defaultPlatformIcon(platform?: string) {
  const lower = (platform || "").toLowerCase();
  if (lower.includes("instagram") || lower === "ig") return "/assets/insta.png";
  if (lower.includes("linkedin")) return "/assets/linkedin.png";
  return "/assets/globe.png";
}

/** Map a PlatformPlan API object into card props. */
export function platformPlanToCardProps(
  plan: PlatformPlan,
): PlatformStrategyCardProps {
  const platformName = plan.platform || "Platform";
  const stats = Object.entries(plan.content_ratio || {})
    .filter(([, value]) => typeof value === "number")
    .map(([label, value]) => ({
      label: label.replace(/_/g, " "),
      percent: Number(value),
    }));

  return {
    platformName,
    description: plan.role,
    goal: plan.goal_alignment,
    tags: plan.formats ?? [],
    stats,
    iconSrc: defaultPlatformIcon(plan.platform),
  };
}

function RowLabel({
  icon: Icon,
  children,
}: {
  icon: typeof Target;
  children: string;
}) {
  return (
    <div className="mb-2 flex items-center gap-1.5 text-[12px] font-medium text-neutral-500">
      <Icon className="size-3.5 shrink-0 text-[#5B57E6]" aria-hidden="true" />
      {children}
    </div>
  );
}

export function PlatformStrategyCard({
  platformName,
  description,
  goal,
  tags = [],
  stats = [],
  iconSrc,
  className,
}: PlatformStrategyCardProps) {
  const icon = iconSrc ?? defaultPlatformIcon(platformName);

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-2xl border border-[#E6E8F5] bg-white p-4 sm:p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#EEF0F8] bg-[#F7F8FC]">
            <Image
              src={icon}
              alt=""
              width={20}
              height={20}
              className="size-5 object-contain"
            />
          </span>
          <div className="min-w-0">
            <h4 className="truncate text-[15px] font-semibold capitalize tracking-tight text-neutral-900">
              {platformName}
            </h4>
            {description ? (
              <p className="mt-0.5 line-clamp-2 text-[12px] leading-4 text-neutral-500">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#ECEBFF] px-2.5 py-1 text-[11px] font-semibold text-[#5B57E6]">
          <FileText className="size-3" aria-hidden="true" />
          Platform Strategy
        </span>
      </div>

      {goal ? (
        <div className="mt-4">
          <RowLabel icon={Target}>Goal</RowLabel>
          <p className="text-[13px] leading-5 text-neutral-800">{goal}</p>
        </div>
      ) : null}

      {tags.length > 0 ? (
        <div className="mt-4">
          <RowLabel icon={LayoutGrid}>Content pillars</RowLabel>
          <ul className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <li key={tag}>
                <span className="inline-flex items-center rounded-full bg-[#ECEBFF] px-2.5 py-1 text-[11px] font-medium text-[#4338CA]">
                  {tag}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {stats.length > 0 ? (
        <div className="mt-4">
          <RowLabel icon={Clock3}>Content mix</RowLabel>
          <ul className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
            {stats.map((stat) => {
              const pct = Math.max(0, Math.min(100, stat.percent));
              return (
                <li key={stat.label} className="min-w-0">
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <span className="truncate text-[12px] capitalize text-neutral-600">
                      {stat.label}
                    </span>
                    <span className="shrink-0 text-[12px] font-semibold tabular-nums text-neutral-900">
                      {pct}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#EEF0F8]">
                    <div
                      className="h-full rounded-full bg-[#5B57E6]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
