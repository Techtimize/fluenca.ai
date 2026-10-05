"use client";

import Image from "next/image";
import { useMemo, useState, type ReactNode } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
  Share2,
} from "lucide-react";
import Card from "@/components/shared/card";
import type { PlannerResultsResponse } from "@/types/bussiness/planner-type";
import { FOCUS_RING } from "@/utils/ui-classes";
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

const PLATFORM_META: Record<
  string,
  {
    label: string;
    color: string;
    bg: string;
    assets?: (keyof typeof ASSET_ICONS)[];
    FallbackIcon?: typeof FileText;
  }
> = {
  linkedin: {
    label: "LinkedIn",
    color: "text-[#0A66C2]",
    bg: "bg-[#E8F1FB]",
    assets: ["linkedin"],
  },
  instagram: {
    label: "Instagram",
    color: "text-[#C13584]",
    bg: "bg-[#FCEEF5]",
    assets: ["instagram"],
  },
  both: {
    label: "Multi-platform",
    color: "text-[#5B57E6]",
    bg: "bg-[#ECEBFF]",
    assets: ["instagram", "linkedin"],
  },
  general: {
    label: "General",
    color: "text-neutral-700",
    bg: "bg-neutral-100",
    FallbackIcon: FileText,
  },
};

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
  return <Fallback className={className} style={{ width: size, height: size }} aria-hidden="true" />;
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

  const planEnd = useMemo(() => addDays(planStart, Math.max(planDays - 1, 0)), [planStart, planDays]);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(planStart.getFullYear(), planStart.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<Date>(planStart);

  const cells = useMemo(() => getMonthCells(visibleMonth), [visibleMonth]);
  const eventsByDay = useMemo(() => {
    const map = new Map<string, PlannerEvent[]>();
    events.forEach((event) => {
      const key = dateKey(event.date);
      const list = map.get(key) ?? [];
      list.push(event);
      map.set(key, list);
    });
    return map;
  }, [events]);

  const selectedEvents = eventsByDay.get(dateKey(selectedDate)) ?? [];

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
              <h3 className="text-[15px] font-semibold text-neutral-900">
                {planDays}-day content calendar
              </h3>
              <p className="mt-1 max-w-xl text-[13px] leading-5 text-neutral-500">
                {summary || "Scheduled planner actions across your platforms."}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <span className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-neutral-700 ring-1 ring-[#E6E8F5]">
              {events.length} scheduled item{events.length === 1 ? "" : "s"}
            </span>
            {versionSelect}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(PLATFORM_META).map(([key, meta]) => (
            <span
              key={key}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${meta.bg} ${meta.color}`}
            >
              <PlatformIcons platformKey={key} size={12} />
              {meta.label}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.9fr)]">
        <div className="border-b border-[#E6E8F5] p-4 sm:p-5 lg:border-b-0 lg:border-r">
          <div className="mb-3 flex items-center justify-between gap-2">
            <button
              type="button"
              disabled={!canGoPrev}
              onClick={() =>
                setVisibleMonth(
                  new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1),
                )
              }
              className={`grid size-8 place-items-center rounded-full border border-[#E6E8F5] text-neutral-600 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS_RING}`}
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
              className={`grid size-8 place-items-center rounded-full border border-[#E6E8F5] text-neutral-600 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS_RING}`}
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-neutral-400">
            {WEEKDAYS.map((day) => (
              <div key={day} className="py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
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
                  onClick={() => setSelectedDate(cell)}
                  className={`flex min-h-[88px] flex-col rounded-xl border p-1.5 text-left transition-colors ${FOCUS_RING} ${
                    selected
                      ? "border-[#5B57E6] bg-[#F6F5FF]"
                      : inPlan
                        ? "border-[#EEF0F8] bg-white hover:border-[#D8D6F5]"
                        : "border-transparent bg-transparent"
                  } ${!inMonth ? "opacity-40" : ""} ${!inPlan ? "cursor-default opacity-30" : ""}`}
                >
                  <span className="text-[11px] font-medium text-neutral-600">{cell.getDate()}</span>

                  {dayEvents.length ? (
                    <div className="mt-0.5 flex justify-center gap-1">
                      {Array.from(
                        new Set(
                          dayEvents.flatMap((event) => {
                            const key = resolvePlatformKey(event.platform);
                            return PLATFORM_META[key]?.assets ?? [];
                          }),
                        ),
                      ).map((asset) => (
                        <Image
                          key={asset}
                          src={ASSET_ICONS[asset]}
                          alt=""
                          width={14}
                          height={14}
                          className="rounded-[3px] object-contain"
                        />
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-1 flex flex-1 flex-col items-stretch justify-start gap-0.5">
                    {dayEvents.slice(0, 2).map((event) => {
                      const key = resolvePlatformKey(event.platform);
                      const meta = PLATFORM_META[key] || PLATFORM_META.general;
                      return (
                        <span
                          key={event.id}
                          className={`block truncate rounded-md px-1 py-0.5 text-center text-[10px] font-medium ${meta.bg} ${meta.color}`}
                          title={event.title}
                        >
                          {event.title}
                        </span>
                      );
                    })}
                    {dayEvents.length > 2 ? (
                      <span className="text-center text-[10px] text-neutral-400">
                        +{dayEvents.length - 2} more
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </p>

          {selectedEvents.length ? (
            <ul className="mt-3 space-y-3">
              {selectedEvents.map((event) => {
                const key = resolvePlatformKey(event.platform);
                const meta = PLATFORM_META[key] || PLATFORM_META.general;
                return (
                  <li
                    key={event.id}
                    className="rounded-2xl border border-[#E6E8F5] bg-[#FAFBFF] p-3"
                  >
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${meta.bg} ${meta.color}`}
                      >
                        <PlatformIcons platformKey={key} size={12} />
                        {meta.label}
                      </span>
                      {event.priority ? (
                        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-neutral-600 ring-1 ring-[#E6E8F5]">
                          Priority: {event.priority}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-[13px] font-semibold text-neutral-900">{event.title}</p>
                    {event.description ? (
                      <p className="mt-1 text-[12px] leading-5 text-neutral-600">Why: {event.description}</p>
                    ) : null}
                    {(event.owner || event.format) ? (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {event.owner ? (
                          <div className="rounded-xl bg-white px-2.5 py-2 ring-1 ring-[#E6E8F5]">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
                              Purpose
                            </p>
                            <p className="mt-1 text-[12px] font-medium capitalize text-neutral-800">
                              {event.owner}
                            </p>
                          </div>
                        ) : null}
                        {event.format ? (
                          <div className="rounded-xl bg-white px-2.5 py-2 ring-1 ring-[#E6E8F5]">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
                              Action
                            </p>
                            <p className="mt-1 text-[12px] font-medium capitalize text-neutral-800">
                              {event.format}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                    {event.what_to_do ? (
                      <p className="mt-3 border-t border-[#E6E8F5] pt-3 text-[12px] leading-5 text-neutral-700">
                        <span className="font-semibold text-neutral-900">What to do: </span>
                        {event.what_to_do}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-6 text-[13px] text-neutral-500">No planner items on this day.</p>
          )}
        </div>
      </div>
    </Card>
  );
}
