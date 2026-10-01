"use client";

import { useMemo, useState } from "react";
import {
  AtSign,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Crosshair,
  FileText,
  Globe2,
  Link2,
  Share2,
  Target,
} from "lucide-react";
import Card from "@/components/shared/card";
import type {
  CompetitorNinetyDayPlan,
  CompetitorRecommendedAction,
} from "@/types/bussiness/competitoranalysis-type";
import { FOCUS_RING } from "@/utils/ui-classes";

type PlatformKey =
  | "linkedin"
  | "instagram"
  | "website"
  | "content"
  | "positioning"
  | "general";

type CalendarEvent = CompetitorRecommendedAction & {
  id: string;
  date: Date;
  phase: "0-30" | "31-60" | "61-90";
  platform: PlatformKey;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PLATFORM_META: Record<
  PlatformKey,
  { label: string; color: string; bg: string; Icon: typeof Globe2 }
> = {
  linkedin: {
    label: "LinkedIn",
    color: "text-[#0A66C2]",
    bg: "bg-[#E8F1FB]",
    Icon: Link2,
  },
  instagram: {
    label: "Instagram",
    color: "text-[#C13584]",
    bg: "bg-[#FCEEF5]",
    Icon: AtSign,
  },
  website: {
    label: "Website",
    color: "text-[#0F766E]",
    bg: "bg-[#E6F7F4]",
    Icon: Globe2,
  },
  content: {
    label: "Content",
    color: "text-[#B45309]",
    bg: "bg-[#FEF3C7]",
    Icon: Share2,
  },
  positioning: {
    label: "Positioning",
    color: "text-[#5B57E6]",
    bg: "bg-[#ECEBFF]",
    Icon: Crosshair,
  },
  general: {
    label: "General",
    color: "text-neutral-700",
    bg: "bg-neutral-100",
    Icon: FileText,
  },
};

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function monthLabel(date: Date) {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function dateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function detectPlatform(action: CompetitorRecommendedAction): PlatformKey {
  const haystack = `${action.category ?? ""} ${action.title ?? ""} ${action.action ?? ""}`.toLowerCase();
  if (haystack.includes("linkedin")) return "linkedin";
  if (haystack.includes("instagram") || haystack.includes("social growth")) return "instagram";
  if (haystack.includes("website") || haystack.includes("proof") || haystack.includes("case study")) {
    return "website";
  }
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

function phaseFromTimeline(timeline?: string | null): "0-30" | "31-60" | "61-90" {
  const value = (timeline ?? "").toLowerCase();
  if (value.includes("61") || value.includes("90")) return "61-90";
  if (value.includes("31") || value.includes("60")) return "31-60";
  return "0-30";
}

function distributeActions(
  actions: CompetitorRecommendedAction[],
  start: Date,
  phase: "0-30" | "31-60" | "61-90",
): CalendarEvent[] {
  if (!actions.length) return [];
  const phaseStartOffset = phase === "0-30" ? 0 : phase === "31-60" ? 30 : 60;
  const phaseLength = 30;
  const step = Math.max(1, Math.floor(phaseLength / actions.length));

  return actions.map((action, index) => {
    const dayOffset = phaseStartOffset + Math.min(phaseLength - 1, index * step + 2);
    return {
      ...action,
      id: `${phase}-${index}-${action.title ?? "action"}`,
      date: addDays(start, dayOffset),
      phase,
      platform: detectPlatform(action),
    };
  });
}

function buildCalendarEvents(plan: CompetitorNinetyDayPlan, startDate: Date): CalendarEvent[] {
  const start = startOfDay(startDate);
  return [
    ...distributeActions(plan.days_0_30 ?? [], start, "0-30"),
    ...distributeActions(plan.days_31_60 ?? [], start, "31-60"),
    ...distributeActions(plan.days_61_90 ?? [], start, "61-90"),
  ];
}

function getMonthCells(monthDate: Date) {
  const first = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const start = addDays(first, -first.getDay());
  return Array.from({ length: 42 }, (_, index) => addDays(start, index));
}

type Props = {
  plan: CompetitorNinetyDayPlan;
  startDate?: string | Date | null;
};

export default function CompetitorNinetyDayCalendar({ plan, startDate }: Props) {
  const planStart = useMemo(() => {
    if (!startDate) return startOfDay(new Date());
    const parsed = startDate instanceof Date ? startDate : new Date(startDate);
    return Number.isNaN(parsed.getTime()) ? startOfDay(new Date()) : startOfDay(parsed);
  }, [startDate]);

  const events = useMemo(() => buildCalendarEvents(plan, planStart), [plan, planStart]);
  const planEnd = useMemo(() => addDays(planStart, 89), [planStart]);

  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(planStart.getFullYear(), planStart.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<Date>(planStart);

  const cells = useMemo(() => getMonthCells(visibleMonth), [visibleMonth]);
  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach((event) => {
      const key = dateKey(event.date);
      const list = map.get(key) ?? [];
      list.push(event);
      map.set(key, list);
    });
    return map;
  }, [events]);

  const selectedEvents = eventsByDay.get(dateKey(selectedDate)) ?? [];
  const phaseCounts = {
    early: plan.days_0_30?.length ?? 0,
    mid: plan.days_31_60?.length ?? 0,
    late: plan.days_61_90?.length ?? 0,
  };

  const canGoPrev = (() => {
    const prev = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
    return prev >= new Date(planStart.getFullYear(), planStart.getMonth(), 1);
  })();

  const canGoNext = (() => {
    const next = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
    return next <= new Date(planEnd.getFullYear(), planEnd.getMonth(), 1);
  })();

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-[#E6E8F5] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_55%)] px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-[#ECEBFF] text-[#5B57E6]">
              <CalendarDays className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-[15px] font-semibold text-neutral-900">90-day action calendar</h3>
              <p className="mt-1 max-w-xl text-[13px] leading-5 text-neutral-500">
                {plan.summary ||
                  "Scheduled initiatives across the next 90 days with platform-specific actions."}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-[12px]">
            <span className="rounded-full bg-white px-3 py-1 font-medium text-neutral-700 ring-1 ring-[#E6E8F5]">
              0–30d · {phaseCounts.early}
            </span>
            <span className="rounded-full bg-white px-3 py-1 font-medium text-neutral-700 ring-1 ring-[#E6E8F5]">
              31–60d · {phaseCounts.mid}
            </span>
            <span className="rounded-full bg-white px-3 py-1 font-medium text-neutral-700 ring-1 ring-[#E6E8F5]">
              61–90d · {phaseCounts.late}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {(Object.keys(PLATFORM_META) as PlatformKey[]).map((key) => {
            const meta = PLATFORM_META[key];
            const Icon = meta.Icon;
            return (
              <span
                key={key}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${meta.bg} ${meta.color}`}
              >
                <Icon className="size-3.5" />
                {meta.label}
              </span>
            );
          })}
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.4fr)_360px]">
        <div className="p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={!canGoPrev}
              onClick={() =>
                setVisibleMonth(
                  new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1),
                )
              }
              className={`grid size-9 place-items-center rounded-full border border-[#E6E8F5] bg-white text-neutral-700 disabled:opacity-40 ${FOCUS_RING}`}
              aria-label="Previous month"
            >
              <ChevronLeft className="size-4" />
            </button>
            <p className="text-sm font-semibold text-neutral-900">{monthLabel(visibleMonth)}</p>
            <button
              type="button"
              disabled={!canGoNext}
              onClick={() =>
                setVisibleMonth(
                  new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1),
                )
              }
              className={`grid size-9 place-items-center rounded-full border border-[#E6E8F5] bg-white text-neutral-700 disabled:opacity-40 ${FOCUS_RING}`}
              aria-label="Next month"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium uppercase tracking-[0.04em] text-neutral-400">
            {WEEKDAYS.map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((day) => {
              const inMonth = day.getMonth() === visibleMonth.getMonth();
              const inPlan = day >= planStart && day <= planEnd;
              const key = dateKey(day);
              const dayEvents = eventsByDay.get(key) ?? [];
              const selected = sameDay(day, selectedDate);
              const isToday = sameDay(day, new Date());

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDate(day)}
                  className={`min-h-[84px] rounded-2xl border p-1.5 text-left transition-colors sm:min-h-[96px] ${FOCUS_RING} ${
                    selected
                      ? "border-[#5B57E6] bg-[#F6F7FD]"
                      : inPlan
                        ? "border-[#E6E8F5] bg-white hover:bg-[#F8F9FF]"
                        : "border-transparent bg-neutral-50/70"
                  } ${inMonth ? "" : "opacity-40"}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`grid size-6 place-items-center rounded-full text-[11px] font-semibold ${
                        isToday
                          ? "bg-[#5B57E6] text-white"
                          : selected
                            ? "text-[#5B57E6]"
                            : "text-neutral-700"
                      }`}
                    >
                      {day.getDate()}
                    </span>
                    {dayEvents.length > 0 ? (
                      <span className="text-[10px] font-medium text-neutral-400">
                        {dayEvents.length}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 2).map((event) => {
                      const meta = PLATFORM_META[event.platform];
                      const Icon = meta.Icon;
                      return (
                        <div
                          key={event.id}
                          className={`flex items-center gap-1 rounded-lg px-1.5 py-1 ${meta.bg}`}
                          title={event.title || event.action}
                        >
                          <Icon className={`size-3 shrink-0 ${meta.color}`} />
                          <span className={`truncate text-[10px] font-medium ${meta.color}`}>
                            {event.title || meta.label}
                          </span>
                        </div>
                      );
                    })}
                    {dayEvents.length > 2 ? (
                      <p className="px-1 text-[10px] text-neutral-400">
                        +{dayEvents.length - 2} more
                      </p>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="border-t border-[#E6E8F5] bg-[#FBFBFE] p-4 sm:p-5 lg:border-l lg:border-t-0">
          <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-neutral-400">
            Selected day
          </p>
          <h4 className="mt-1 text-[15px] font-semibold text-neutral-900">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </h4>

          {selectedEvents.length ? (
            <ul className="mt-4 space-y-3">
              {selectedEvents.map((event) => {
                const meta = PLATFORM_META[event.platform];
                const Icon = meta.Icon;
                return (
                  <li
                    key={event.id}
                    className="rounded-2xl border border-[#E6E8F5] bg-white p-3 shadow-[0_1px_0_rgba(15,23,42,0.02)]"
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`grid size-9 shrink-0 place-items-center rounded-xl ${meta.bg} ${meta.color}`}
                      >
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <p className="text-[13px] font-semibold text-neutral-900">
                            {event.title || "Action"}
                          </p>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${meta.bg} ${meta.color}`}>
                            {meta.label}
                          </span>
                        </div>
                        <p className="mt-1 text-[12px] leading-5 text-neutral-600">{event.action}</p>
                        <p className="mt-2 text-[11px] text-neutral-400">
                          {[
                            event.phase ? `Phase ${event.phase}` : null,
                            event.priority ? `Priority ${event.priority}` : null,
                            event.effort ? `Effort ${event.effort}` : null,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-[#E6E8F5] bg-white px-4 py-8 text-center">
              <Target className="mx-auto size-5 text-neutral-300" />
              <p className="mt-2 text-[13px] text-neutral-500">No actions scheduled for this day.</p>
            </div>
          )}

          <div className="mt-5 rounded-2xl border border-[#E6E8F5] bg-white p-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-neutral-400">
              Plan window
            </p>
            <p className="mt-1 text-[13px] text-neutral-700">
              {planStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              {" – "}
              {planEnd.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </aside>
      </div>
    </Card>
  );
}
