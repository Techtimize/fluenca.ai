"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowDownWideNarrow,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  MoreVertical,
  Pencil,
  Share2,
  Sparkles,
  Star,
} from "lucide-react";
import { BrandButton } from "@/components/ui/brand-button";
import { PAGE_ROUTES } from "@/constant/page-routes";
import type { PlannerResultsResponse } from "@/types/bussiness/planner-type";
import { FOCUS_RING } from "@/utils/ui-classes";
import { cn } from "@/lib/utils";
import {
  buildPlannerEvents,
  getPlannerPlanDays,
  getPlannerSummary,
  type PlannerEvent,
} from "./plannerUtils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const ASSET_ICONS = {
  instagram: "/assets/insta.png",
  linkedin: "/assets/linkedin.png",
} as const;

type PlatformFilter = "all" | "linkedin" | "instagram" | "both" | "general";
type SortOrder = "newest" | "oldest";

const PLATFORM_META: Record<
  string,
  {
    label: string;
    color: string;
    bg: string;
    pill: string;
    assets?: (keyof typeof ASSET_ICONS)[];
    FallbackIcon?: typeof FileText;
  }
> = {
  linkedin: {
    label: "LinkedIn",
    color: "text-[#0A66C2]",
    bg: "bg-[#E8F1FB]",
    pill: "bg-[#E8F1FB] text-[#0A66C2]",
    assets: ["linkedin"],
  },
  instagram: {
    label: "Instagram",
    color: "text-[#C13584]",
    bg: "bg-[#FCEEF5]",
    pill: "bg-[#FCEEF5] text-[#C13584]",
    assets: ["instagram"],
  },
  both: {
    label: "Multi-platform",
    color: "text-[#5B57E6]",
    bg: "bg-[#ECEBFF]",
    pill: "bg-[#ECEBFF] text-[#5B57E6]",
    assets: ["instagram", "linkedin"],
  },
  general: {
    label: "General",
    color: "text-neutral-700",
    bg: "bg-neutral-100",
    pill: "bg-neutral-100 text-neutral-700",
    FallbackIcon: FileText,
  },
};

const FILTERS: { id: PlatformFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "instagram", label: "Instagram" },
  { id: "both", label: "Multi-platform" },
];

function PlatformIcons({
  platformKey: key,
  size = 14,
  className = "",
}: {
  platformKey: string;
  size?: number;
  className?: string;
}) {
  const meta = PLATFORM_META[key] || PLATFORM_META.general;
  if (meta.assets?.length) {
    return (
      <span className={`inline-flex items-center gap-0.5 ${className}`}>
        {meta.assets.map((asset) => (
          <Image
            key={asset}
            src={ASSET_ICONS[asset]}
            alt=""
            width={size}
            height={size}
            className="rounded-[3px] object-contain"
            style={{ width: size, height: size }}
          />
        ))}
      </span>
    );
  }
  const Fallback = meta.FallbackIcon || Share2;
  return (
    <Fallback
      className={className}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}

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

function getMonthCells(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = addDays(first, -first.getDay());
  return Array.from({ length: 42 }, (_, index) => addDays(start, index));
}

function resolvePlatformKey(value?: string) {
  const lower = (value || "").toLowerCase();
  if (lower.includes("linkedin") && lower.includes("instagram")) return "both";
  if (lower.includes("linkedin")) return "linkedin";
  if (lower.includes("instagram")) return "instagram";
  if (lower.includes("both") || lower.includes("multi")) return "both";
  return "general";
}

function eventSnippet(event: PlannerEvent) {
  const format = event.format ? `${event.format}: ` : "";
  const title = event.title || "Scheduled content";
  return `${format}${title}`;
}

function nextStepsFromEvent(event: PlannerEvent): string[] {
  const source = event.what_to_do || event.title || "";
  if (!source.trim()) return [];
  const parts = source
    .split(/\n|(?<=\.)\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.slice(0, 4);
}

function isHighPriority(priority?: string) {
  if (!priority) return false;
  const lower = priority.toLowerCase();
  const numeric = Number(priority);
  return (
    lower.includes("high") ||
    (Number.isFinite(numeric) && numeric >= 8)
  );
}

type Props = {
  data: PlannerResultsResponse;
  versionSelect?: ReactNode;
};

export default function PlannerCalendar({ data, versionSelect }: Props) {
  const events = useMemo(() => buildPlannerEvents(data), [data]);
  const summary = getPlannerSummary(data);
  const planDays = getPlannerPlanDays(data);

  const planStart = useMemo(() => {
    if (!events.length) return startOfDay(new Date());
    return startOfDay(
      events.reduce(
        (min, event) => (event.date < min ? event.date : min),
        events[0].date,
      ),
    );
  }, [events]);

  const planEnd = useMemo(
    () => addDays(planStart, Math.max(planDays - 1, 0)),
    [planStart, planDays],
  );

  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(planStart.getFullYear(), planStart.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<Date>(planStart);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [detailOpen, setDetailOpen] = useState(true);

  const filteredEvents = useMemo(() => {
    const list =
      platformFilter === "all"
        ? events
        : events.filter(
            (event) => resolvePlatformKey(event.platform) === platformFilter,
          );
    return [...list].sort((a, b) => {
      const diff = a.date.getTime() - b.date.getTime();
      return sortOrder === "newest" ? -diff : diff;
    });
  }, [events, platformFilter, sortOrder]);

  const cells = useMemo(() => getMonthCells(visibleMonth), [visibleMonth]);
  const eventsByDay = useMemo(() => {
    const map = new Map<string, PlannerEvent[]>();
    filteredEvents.forEach((event) => {
      const key = dateKey(event.date);
      const list = map.get(key) ?? [];
      list.push(event);
      map.set(key, list);
    });
    return map;
  }, [filteredEvents]);

  const selectedEvents = eventsByDay.get(dateKey(selectedDate)) ?? [];
  const activeEvent =
    selectedEvents.find((event) => event.id === selectedEventId) ||
    selectedEvents[0] ||
    null;

  const canGoPrev = (() => {
    const prev = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth() - 1,
      1,
    );
    return prev >= new Date(planStart.getFullYear(), planStart.getMonth(), 1);
  })();

  const canGoNext = (() => {
    const next = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth() + 1,
      1,
    );
    return next <= new Date(planEnd.getFullYear(), planEnd.getMonth(), 1);
  })();

  const handleSelectDate = (cell: Date) => {
    setSelectedDate(cell);
    setDetailOpen(true);
    const dayEvents = eventsByDay.get(dateKey(cell)) ?? [];
    setSelectedEventId(dayEvents[0]?.id ?? null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#ECEBFF] text-[#5B57E6]">
              <CalendarDays className="size-4" aria-hidden="true" />
            </span>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-[28px]">
              {planDays}-day Content Calendar
            </h1>
          </div>
          <p className="mt-1.5 max-w-2xl text-[14px] text-neutral-500">
            {summary ||
              "Plan, review, and schedule your AI-generated posts across platforms."}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 self-start xl:self-auto">
          <button
            type="button"
            disabled={!canGoPrev}
            onClick={() =>
              setVisibleMonth(
                new Date(
                  visibleMonth.getFullYear(),
                  visibleMonth.getMonth() - 1,
                  1,
                ),
              )
            }
            className={`grid size-9 place-items-center rounded-full border border-[#E6E8F5] bg-white text-neutral-600 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS_RING}`}
          >
            <ChevronLeft className="size-4" />
          </button>
          <p className="min-w-35 text-center text-sm font-semibold text-neutral-900">
            {monthLabel(visibleMonth)}
          </p>
          <button
            type="button"
            disabled={!canGoNext}
            onClick={() =>
              setVisibleMonth(
                new Date(
                  visibleMonth.getFullYear(),
                  visibleMonth.getMonth() + 1,
                  1,
                ),
              )
            }
            className={`grid size-9 place-items-center rounded-full border border-[#E6E8F5] bg-white text-neutral-600 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS_RING}`}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="tablist"
          aria-label="Filter by platform"
          className="inline-flex max-w-full flex-wrap gap-1.5 rounded-full border border-[#E6E8F5] bg-white p-1"
        >
          {FILTERS.map((filter) => {
            const active = platformFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setPlatformFilter(filter.id)}
                className={cn(
                  `inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[12px] font-semibold transition-colors ${FOCUS_RING}`,
                  active
                    ? "bg-[#5B57E6] text-white shadow-sm"
                    : "text-neutral-600 hover:bg-[#F6F7FD]",
                )}
              >
                {filter.id !== "all" ? (
                  <PlatformIcons platformKey={filter.id} size={12} />
                ) : null}
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-10 items-center rounded-full border border-[#E6E8F5] bg-white px-3 text-[12px] font-semibold text-neutral-700">
            {filteredEvents.length} scheduled item
            {filteredEvents.length === 1 ? "" : "s"}
          </span>

          <label className="relative inline-flex">
            <span className="sr-only">Sort calendar items</span>
            <ArrowDownWideNarrow
              className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-neutral-400"
              aria-hidden="true"
            />

            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-neutral-400"
              aria-hidden="true"
            />
          </label>

          {versionSelect}
        </div>
      </div>

      <div
        className={cn(
          "grid gap-4",
          detailOpen
            ? "xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.9fr)]"
            : "grid-cols-1",
        )}
      >
        <section className="overflow-hidden rounded-2xl border border-[#E6E8F5] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.03)]">
          <div className="grid grid-cols-7 border-b border-[#E6E8F5] bg-[#FAFBFF] text-center text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
            {WEEKDAYS.map((day) => (
              <div key={day} className="px-1 py-2.5">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {cells.map((cell) => {
              const inMonth = cell.getMonth() === visibleMonth.getMonth();
              const inPlan = cell >= planStart && cell <= planEnd;
              const dayEvents = eventsByDay.get(dateKey(cell)) ?? [];
              const selected = sameDay(cell, selectedDate);

              return (
                <button
                  key={dateKey(cell)}
                  type="button"
                  disabled={!inPlan}
                  onClick={() => handleSelectDate(cell)}
                  className={cn(
                    `flex min-h-26 flex-col border-b border-r border-[#EEF0F8] p-1.5 text-left transition-colors sm:min-h-[118px] sm:p-2 ${FOCUS_RING}`,
                    selected
                      ? "bg-[#F7F6FF] ring-1 ring-inset ring-[#5B57E6]"
                      : inPlan
                        ? "bg-white hover:bg-[#FAFBFF]"
                        : "bg-[#FCFCFD]",
                    !inMonth && "bg-[#FCFCFD]",
                    !inPlan && "cursor-default",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex size-6 items-center justify-center rounded-full text-[12px] font-semibold",
                      selected
                        ? "bg-[#5B57E6] text-white"
                        : inMonth
                          ? "text-neutral-700"
                          : "text-neutral-300",
                      !inPlan && inMonth && "text-neutral-400",
                    )}
                  >
                    {cell.getDate()}
                  </span>

                  <div className="mt-1.5 flex flex-1 flex-col gap-1">
                    {dayEvents.slice(0, 2).map((event) => {
                      const key = resolvePlatformKey(event.platform);
                      const meta = PLATFORM_META[key] || PLATFORM_META.general;
                      return (
                        <span
                          key={event.id}
                          className={cn(
                            "block truncate rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                            meta.pill,
                          )}
                          title={eventSnippet(event)}
                        >
                          {eventSnippet(event)}
                        </span>
                      );
                    })}
                    {dayEvents.length > 2 ? (
                      <span className="px-0.5 text-[10px] font-medium text-neutral-400">
                        +{dayEvents.length - 2} more
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {detailOpen ? (
          <aside className="flex min-h-105 flex-col rounded-2xl border border-[#E6E8F5] bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,0.06)] sm:p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-start gap-2">
                <button
                  type="button"
                  onClick={() => setDetailOpen(false)}
                  className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-[#E6E8F5] text-neutral-600 hover:bg-neutral-50 ${FOCUS_RING}`}
                  aria-label="Close day details"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold tracking-tight text-neutral-900">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <span className="mt-1 inline-flex rounded-full bg-[#F0F1F8] px-2 py-0.5 text-[11px] font-semibold text-neutral-600">
                    {selectedEvents.length} post
                    {selectedEvents.length === 1 ? "" : "s"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className={`grid size-8 place-items-center rounded-full text-neutral-400 hover:bg-neutral-50 hover:text-neutral-700 ${FOCUS_RING}`}
                aria-label="More options"
              >
                <MoreVertical className="size-4" />
              </button>
            </div>

            {selectedEvents.length > 1 ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {selectedEvents.map((event, index) => {
                  const active = activeEvent?.id === event.id;
                  return (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => setSelectedEventId(event.id)}
                      className={cn(
                        `rounded-full px-2.5 py-1 text-[11px] font-semibold ${FOCUS_RING}`,
                        active
                          ? "bg-[#5B57E6] text-white"
                          : "bg-[#F5F6FA] text-neutral-600 hover:bg-[#ECEBFF]",
                      )}
                    >
                      Post {index + 1}
                    </button>
                  );
                })}
              </div>
            ) : null}

            {activeEvent ? (
              <div className="mt-4 flex flex-1 flex-col">
                <div className="flex flex-wrap gap-1.5">
                  {(() => {
                    const key = resolvePlatformKey(activeEvent.platform);
                    const meta = PLATFORM_META[key] || PLATFORM_META.general;
                    return (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.pill}`}
                      >
                        <PlatformIcons platformKey={key} size={12} />
                        {meta.label}
                      </span>
                    );
                  })()}
                  {isHighPriority(activeEvent.priority) ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF7ED] px-2.5 py-1 text-[11px] font-semibold text-[#C2410C]">
                      <Star className="size-3 fill-current" aria-hidden="true" />
                      High priority
                    </span>
                  ) : activeEvent.priority ? (
                    <span className="inline-flex items-center rounded-full bg-[#F5F6FA] px-2.5 py-1 text-[11px] font-semibold text-neutral-600">
                      Priority: {activeEvent.priority}
                    </span>
                  ) : null}
                </div>

                <h2 className="mt-3 text-[16px] font-semibold leading-snug tracking-tight text-neutral-900">
                  {activeEvent.title}
                </h2>

                {(activeEvent.owner || activeEvent.format) && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {activeEvent.owner ? (
                      <div className="rounded-xl border border-[#E6E8F5] bg-[#FAFBFF] px-3 py-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
                          Purpose
                        </p>
                        <p className="mt-1 text-[13px] font-medium capitalize text-neutral-800">
                          {activeEvent.owner}
                        </p>
                      </div>
                    ) : null}
                    {activeEvent.format ? (
                      <div className="rounded-xl border border-[#E6E8F5] bg-[#FAFBFF] px-3 py-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
                          Action
                        </p>
                        <p className="mt-1 text-[13px] font-medium capitalize text-neutral-800">
                          {activeEvent.format}
                        </p>
                      </div>
                    ) : null}
                  </div>
                )}

                {(activeEvent.why || activeEvent.description) && (
                  <div className="mt-4">
                    <p className="mb-1.5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-neutral-900">
                      <Sparkles
                        className="size-3.5 text-[#5B57E6]"
                        aria-hidden="true"
                      />
                      Rationale
                    </p>
                    <p className="text-[13px] leading-5 text-neutral-600">
                      {activeEvent.why || activeEvent.description}
                    </p>
                  </div>
                )}

                {nextStepsFromEvent(activeEvent).length > 0 ? (
                  <div className="mt-4">
                    <p className="mb-1.5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-neutral-900">
                      <CheckCircle2
                        className="size-3.5 text-[#5B57E6]"
                        aria-hidden="true"
                      />
                      Next steps
                    </p>
                    <ol className="space-y-1.5">
                      {nextStepsFromEvent(activeEvent).map((step, index) => (
                        <li
                          key={`${step}-${index}`}
                          className="flex gap-2 text-[13px] leading-5 text-neutral-600"
                        >
                          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#ECEBFF] text-[10px] font-semibold text-[#5B57E6]">
                            {index + 1}
                          </span>
                          <span className="min-w-0">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}

                <div className="mt-auto space-y-2 pt-5">
                  <BrandButton
                    href={PAGE_ROUTES.CONTENT}
                    size="full"
                    className="justify-center"
                  >
                    <ExternalLink className="size-4" />
                    View content
                  </BrandButton>
                </div>
              </div>
            ) : (
              <div className="mt-10 flex flex-1 flex-col items-center justify-center text-center">
                <span className="grid size-12 place-items-center rounded-2xl bg-[#F5F6FA] text-neutral-400">
                  <CalendarDays className="size-5" />
                </span>
                <p className="mt-3 text-[14px] font-medium text-neutral-800">
                  No posts on this day
                </p>
                <p className="mt-1 max-w-55 text-[13px] text-neutral-500">
                  Pick another date on the calendar to review scheduled content.
                </p>
              </div>
            )}
          </aside>
        ) : null}
      </div>
    </div>
  );
}
