"use client";

import { useState } from "react";
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScheduleImageGenerationMutation } from "@/routes/bussiness/Bussiness-Mutation";
import type { ScheduleablePlatform } from "@/types/bussiness/imagegeneration-type";
import { FOCUS_RING } from "@/utils/ui-classes";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const pad = (n: number) => String(n).padStart(2, "0");
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export function formatSchedule(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// Existing schedule, or the next full hour from now
export function initialDate(schedule?: string | null) {
  const existing = schedule ? new Date(schedule) : null;
  if (existing && !Number.isNaN(existing.getTime()) && existing > new Date()) {
    return existing;
  }
  const next = new Date();
  next.setHours(next.getHours() + 1, 0, 0, 0);
  return next;
}

export function MonthCalendar({
  selected,
  onSelect,
}: {
  /** null = nothing picked yet; the calendar opens on the current month */
  selected: Date | null;
  onSelect: (day: Date) => void;
}) {
  const [month, setMonth] = useState(() => {
    const base = selected ?? new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: month.getDay() }, () => null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1),
    ),
  ];
  const isCurrentMonth =
    month.getFullYear() === today.getFullYear() &&
    month.getMonth() === today.getMonth();

  const shiftMonth = (delta: number) =>
    setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1));

  return (
    <div className="rounded-2xl border border-[#E6E8F5] p-3">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          disabled={isCurrentMonth}
          aria-label="Previous month"
          className={`grid size-8 place-items-center rounded-full text-neutral-600 hover:bg-[#F6F7FD] disabled:opacity-30 ${FOCUS_RING}`}
        >
          <ChevronLeft className="size-4" />
        </button>
        <p className="text-sm font-semibold text-neutral-900">
          {month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          aria-label="Next month"
          className={`grid size-8 place-items-center rounded-full text-neutral-600 hover:bg-[#F6F7FD] ${FOCUS_RING}`}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((day) => (
          <span key={day} className="py-1 text-[11px] font-medium text-neutral-400">
            {day}
          </span>
        ))}
        {cells.map((day, index) =>
          day ? (
            <button
              key={day.toISOString()}
              type="button"
              disabled={day < startOfToday}
              onClick={() => onSelect(day)}
              aria-pressed={selected ? sameDay(day, selected) : false}
              className={cn(
                `grid h-9 place-items-center rounded-lg text-[13px] transition-colors disabled:cursor-not-allowed disabled:text-neutral-300 ${FOCUS_RING}`,
                selected && sameDay(day, selected)
                  ? "bg-[#5B57E6] font-semibold text-white"
                  : sameDay(day, today)
                    ? "font-semibold text-[#5B57E6] hover:bg-[#F0F1FF]"
                    : "text-neutral-700 hover:bg-[#F6F7FD]",
              )}
            >
              {day.getDate()}
            </button>
          ) : (
            <span key={`empty-${index}`} />
          ),
        )}
      </div>
    </div>
  );
}

export function SchedulePostButton({
  runId,
  platform,
  schedule,
}: {
  runId: string;
  platform: ScheduleablePlatform | null;
  schedule?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(() => initialDate(schedule));
  const { mutate, isPending } = ScheduleImageGenerationMutation();

  const isEdit = Boolean(schedule);
  const time = `${pad(selected.getHours())}:${pad(selected.getMinutes())}`;
  const inPast = selected <= new Date();

  const openDialog = () => {
    setSelected(initialDate(schedule));
    setOpen(true);
  };

  const pickDay = (day: Date) => {
    const next = new Date(day);
    next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
    setSelected(next);
  };

  const pickTime = (value: string) => {
    const [hours, minutes] = value.split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return;
    const next = new Date(selected);
    next.setHours(hours, minutes, 0, 0);
    setSelected(next);
  };

  const save = () => {
    if (!platform || inPast || isPending) return;
    mutate(
      // toISOString sends UTC with a "Z", so the backend never guesses the timezone
      { platform, id: runId, schedule: selected.toISOString() },
      { onSuccess: () => setOpen(false) },
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        disabled={!platform}
        title={platform ? undefined : "This platform can't be scheduled"}
        className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#D9DCF7] bg-white px-4 text-[13px] font-semibold text-[#5B57E6] transition-colors hover:bg-[#F0F1FF] disabled:pointer-events-none disabled:opacity-55 ${FOCUS_RING}`}
      >
        {isEdit ? (
          <Pencil className="size-4" aria-hidden="true" />
        ) : (
          <CalendarClock className="size-4" aria-hidden="true" />
        )}
        {isEdit ? "Edit schedule" : "Schedule post"}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit schedule" : "Schedule post"}</DialogTitle>
            <DialogDescription>
              Pick the date and time this post should go out.
            </DialogDescription>
          </DialogHeader>

          <MonthCalendar selected={selected} onSelect={pickDay} />

          <label className="flex items-center justify-between gap-3 rounded-2xl border border-[#E6E8F5] px-3 py-2">
            <span className="text-sm font-medium text-neutral-700">Time</span>
            <input
              type="time"
              value={time}
              onChange={(event) => pickTime(event.target.value)}
              className="rounded-lg bg-[#F6F7FD] px-2 py-1 text-sm text-neutral-900 outline-none focus:ring-2 focus:ring-[#5B57E6]/40"
            />
          </label>

          <p
            className={`text-[13px] ${inPast ? "text-rose-600" : "text-neutral-500"}`}
          >
            {inPast
              ? "Pick a time in the future."
              : `Posts on ${formatSchedule(selected.toISOString())}`}
          </p>

          <DialogFooter>
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className={`inline-flex h-10 items-center justify-center rounded-xl border border-[#E6E8F5] bg-white px-4 text-[13px] font-semibold text-neutral-700 hover:bg-neutral-50 ${FOCUS_RING}`}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={inPast || isPending}
              className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#5B57E6] px-4 text-[13px] font-semibold text-white hover:bg-[#4A46D0] disabled:pointer-events-none disabled:opacity-55 ${FOCUS_RING}`}
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
