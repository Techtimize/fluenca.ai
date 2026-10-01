"use client";

import {
  ArrowUpRight,
  AtSign,
  Crosshair,
  FileText,
  Flame,
  Gauge,
  Globe2,
  Link2,
  Share2,
  Sparkles,
  Zap,
} from "lucide-react";
import Card from "@/components/shared/card";
import type { CompetitorRecommendedAction } from "@/types/bussiness/competitoranalysis-type";

type MoveKey =
  | "linkedin"
  | "instagram"
  | "website"
  | "content"
  | "positioning"
  | "proof"
  | "social"
  | "general";

type PriorityTone = "high" | "medium" | "low" | "rank";

const MOVE_META: Record<
  MoveKey,
  { label: string; color: string; bg: string; ring: string; Icon: typeof Globe2 }
> = {
  linkedin: {
    label: "LinkedIn",
    color: "text-[#0A66C2]",
    bg: "bg-[#E8F1FB]",
    ring: "ring-[#BFD7F2]",
    Icon: Link2,
  },
  instagram: {
    label: "Instagram",
    color: "text-[#C13584]",
    bg: "bg-[#FCEEF5]",
    ring: "ring-[#F3C5DA]",
    Icon: AtSign,
  },
  website: {
    label: "Website",
    color: "text-[#0F766E]",
    bg: "bg-[#E6F7F4]",
    ring: "ring-[#B7E4DC]",
    Icon: Globe2,
  },
  content: {
    label: "Content",
    color: "text-[#B45309]",
    bg: "bg-[#FEF3C7]",
    ring: "ring-[#F6D98A]",
    Icon: Share2,
  },
  positioning: {
    label: "Positioning",
    color: "text-[#5B57E6]",
    bg: "bg-[#ECEBFF]",
    ring: "ring-[#C9C6F8]",
    Icon: Crosshair,
  },
  proof: {
    label: "Proof",
    color: "text-[#0369A1]",
    bg: "bg-[#E0F2FE]",
    ring: "ring-[#BAE6FD]",
    Icon: FileText,
  },
  social: {
    label: "Social Growth",
    color: "text-[#BE185D]",
    bg: "bg-[#FCE7F3]",
    ring: "ring-[#F9A8D4]",
    Icon: Sparkles,
  },
  general: {
    label: "Strategy",
    color: "text-neutral-700",
    bg: "bg-neutral-100",
    ring: "ring-neutral-200",
    Icon: Zap,
  },
};

function detectMove(action: CompetitorRecommendedAction): MoveKey {
  const haystack = `${action.category ?? ""} ${action.title ?? ""} ${action.action ?? ""}`.toLowerCase();
  if (haystack.includes("linkedin")) return "linkedin";
  if (haystack.includes("instagram")) return "instagram";
  if (haystack.includes("social")) return "social";
  if (haystack.includes("proof") || haystack.includes("case study")) return "proof";
  if (haystack.includes("website")) return "website";
  if (haystack.includes("content") || haystack.includes("posting") || haystack.includes("hashtag")) {
    return "content";
  }
  if (
    haystack.includes("position") ||
    haystack.includes("buyer") ||
    haystack.includes("messaging")
  ) {
    return "positioning";
  }
  return "general";
}

function normalizePriority(priority?: string | number | null) {
  if (priority == null || priority === "") return null;
  const raw = String(priority).trim().toLowerCase();
  if (raw === "high" || raw === "1") return { label: "High", tone: "high" as const };
  if (raw === "medium" || raw === "2" || raw === "3") {
    return { label: raw === "medium" ? "Medium" : `P${raw}`, tone: "medium" as const };
  }
  if (raw === "low" || raw === "4" || raw === "5") {
    return { label: raw === "low" ? "Low" : `P${raw}`, tone: "low" as const };
  }
  if (/^\d+$/.test(raw)) return { label: `P${raw}`, tone: "rank" as const };
  return { label: String(priority), tone: "rank" as const };
}

function isLowEffort(effort?: string | null) {
  return (effort ?? "").toLowerCase().includes("low");
}

function isHighPriority(action: CompetitorRecommendedAction) {
  const priority = normalizePriority(action.priority);
  return priority?.tone === "high";
}

function isMediumPriority(action: CompetitorRecommendedAction) {
  const priority = normalizePriority(action.priority);
  return priority?.tone === "medium";
}

function priorityTone(tone: PriorityTone) {
  if (tone === "high") return "bg-[#FEE2E2] text-[#B91C1C]";
  if (tone === "medium") return "bg-[#FEF3C7] text-[#B45309]";
  if (tone === "low") return "bg-[#E5E7EB] text-neutral-600";
  return "bg-[#ECEBFF] text-[#5B57E6]";
}

function impactTone(impact?: string | null) {
  const value = (impact ?? "").toLowerCase();
  if (value.includes("high")) return "text-[#B91C1C]";
  if (value.includes("medium")) return "text-[#B45309]";
  if (value.includes("low")) return "text-neutral-500";
  return "text-neutral-600";
}

function MoveCard({
  item,
  index,
}: {
  item: CompetitorRecommendedAction;
  index: number;
}) {
  const move = detectMove(item);
  const meta = MOVE_META[move];
  const Icon = meta.Icon;
  const priority = normalizePriority(item.priority);

  return (
    <article className="rounded-2xl border border-[#E6E8F5] bg-white p-4 shadow-[0_1px_0_rgba(15,23,42,0.02)] transition-colors hover:border-[#D7DBF5] hover:bg-[#FBFBFE]">
      <div className="flex items-start gap-3">
        <span
          className={`grid size-9 shrink-0 place-items-center rounded-xl ring-1 ${meta.bg} ${meta.color} ${meta.ring}`}
        >
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[10px] font-semibold tracking-wider text-neutral-400">
              {String(index + 1).padStart(2, "0")}
            </span>
            {priority ? (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${priorityTone(priority.tone)}`}
              >
                {priority.label}
              </span>
            ) : null}
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${meta.bg} ${meta.color}`}>
              {item.category || meta.label}
            </span>
          </div>
          <h4 className="mt-2 text-[13px] font-semibold leading-5 text-neutral-900">
            {item.title || item.category || "Strategy move"}
          </h4>
          <p className="mt-1.5 text-[12px] leading-5 text-neutral-600">{item.action}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.impact ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#E6E8F5] bg-[#F8F9FF] px-2 py-0.5 text-[10px] font-medium text-neutral-600">
                <Flame className={`size-3 ${impactTone(item.impact)}`} />
                {item.impact}
              </span>
            ) : null}
            {item.effort ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#E6E8F5] bg-[#F8F9FF] px-2 py-0.5 text-[10px] font-medium text-neutral-600">
                <Gauge className="size-3 text-[#5B57E6]" />
                {item.effort}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function Column({
  title,
  description,
  count,
  accent,
  Icon,
  items,
  emptyLabel,
}: {
  title: string;
  description: string;
  count: number;
  accent: string;
  Icon: typeof Flame;
  items: CompetitorRecommendedAction[];
  emptyLabel: string;
}) {
  return (
    <section className="flex min-h-0 flex-col rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF]">
      <header className="border-b border-[#E6E8F5] px-4 py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`grid size-8 place-items-center rounded-xl ${accent}`}>
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <div>
              <h4 className="text-[13px] font-semibold text-neutral-900">{title}</h4>
              <p className="text-[11px] text-neutral-500">{description}</p>
            </div>
          </div>
          <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-neutral-700 ring-1 ring-[#E6E8F5]">
            {count}
          </span>
        </div>
      </header>

      <div className="flex-1 space-y-3 p-3">
        {items.length ? (
          items.map((item, index) => (
            <MoveCard
              key={`${title}-${item.title || item.action || index}-${index}`}
              item={item}
              index={index}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E6E8F5] bg-white px-3 py-8 text-center">
            <p className="text-[12px] text-neutral-500">{emptyLabel}</p>
          </div>
        )}
      </div>
    </section>
  );
}

type Props = {
  actions?: CompetitorRecommendedAction[] | null;
};

export default function CompetitorStrategyMoves({ actions }: Props) {
  if (!actions?.length) {
    return (
      <Card className="overflow-hidden p-0">
        <div className="border-b border-[#E6E8F5] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_55%)] px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-[#ECEBFF] text-[#5B57E6]">
              <ArrowUpRight className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-[15px] font-semibold text-neutral-900">Strategy moves</h3>
              <p className="mt-1 text-[13px] leading-5 text-neutral-500">
                Recommended competitive plays ranked by impact and effort.
              </p>
            </div>
          </div>
        </div>
        <div className="px-5 py-10 text-center sm:px-6">
          <p className="text-[13px] text-neutral-500">No strategy moves yet.</p>
        </div>
      </Card>
    );
  }

  const highPriority = actions.filter(isHighPriority);
  const mediumPriority = actions.filter(
    (item) => isMediumPriority(item) && !isHighPriority(item),
  );
  const lowEffort = actions.filter((item) => isLowEffort(item.effort));

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-[#E6E8F5] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_55%)] px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-[#ECEBFF] text-[#5B57E6]">
              <ArrowUpRight className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-[15px] font-semibold text-neutral-900">Strategy moves</h3>
              <p className="mt-1 max-w-xl text-[13px] leading-5 text-neutral-500">
                High priority, medium priority, and low-effort plays at a glance.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-[12px]">
            <span className="rounded-full bg-white px-3 py-1 font-medium text-neutral-700 ring-1 ring-[#E6E8F5]">
              {actions.length} moves
            </span>
            <span className="rounded-full bg-[#FEE2E2] px-3 py-1 font-medium text-[#B91C1C]">
              {highPriority.length} high
            </span>
            <span className="rounded-full bg-[#FEF3C7] px-3 py-1 font-medium text-[#B45309]">
              {mediumPriority.length} medium
            </span>
            <span className="rounded-full bg-[#E6F7F4] px-3 py-1 font-medium text-[#0F766E]">
              {lowEffort.length} low effort
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-3">
        <Column
          title="High priority"
          description="Do these first"
          count={highPriority.length}
          accent="bg-[#FEE2E2] text-[#B91C1C]"
          Icon={Flame}
          items={highPriority}
          emptyLabel="No high-priority moves"
        />
        <Column
          title="Medium priority"
          description="Plan these next"
          count={mediumPriority.length}
          accent="bg-[#FEF3C7] text-[#B45309]"
          Icon={Gauge}
          items={mediumPriority}
          emptyLabel="No medium-priority moves"
        />
        <Column
          title="Low effort"
          description="Quick wins"
          count={lowEffort.length}
          accent="bg-[#E6F7F4] text-[#0F766E]"
          Icon={Zap}
          items={lowEffort}
          emptyLabel="No low-effort moves"
        />
      </div>
    </Card>
  );
}
