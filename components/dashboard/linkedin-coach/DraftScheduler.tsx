"use client";

import { useState } from "react";
import { CalendarCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PRIMARY_BUTTON } from "@/components/dashboard/linkedin-growth/ui";
import { ScheduleWeekPostMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { toOffsetIso } from "@/types/bussiness/scheduled-post-type";

/** Tuesday–Thursday 08:30 does best; default to the next such morning. */
function nextBestSlot() {
  const date = new Date();
  date.setHours(8, 30, 0, 0);
  do {
    date.setDate(date.getDate() + 1);
  } while (![2, 3, 4].includes(date.getDay()));
  return date;
}

/** "2026-10-27T08:30" for <input type="datetime-local">. */
const toInputValue = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const formatSlot = (date: Date) =>
  date.toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

type Props = {
  draftId: string;
  /** Suggested time from the server, if any. */
  suggestedAt?: string | null;
  /** Edited text to send instead of the saved draft. */
  text?: string;
};

/** One-click schedule for a saved draft (uses the week-post schedule). */
export default function DraftScheduler({ draftId, suggestedAt, text }: Props) {
  const [slot, setSlot] = useState(() => {
    const suggested = suggestedAt ? new Date(suggestedAt) : null;
    return suggested && !Number.isNaN(suggested.getTime()) ? suggested : nextBestSlot();
  });
  const [scheduledFor, setScheduledFor] = useState<Date | null>(null);
  const schedule = ScheduleWeekPostMutation();

  if (scheduledFor) {
    return (
      <p className="flex items-center justify-center gap-1.5 rounded-full bg-[#E8F1FB] py-2 text-[12px] font-semibold text-[#0A66C2]">
        <CalendarCheck className="size-4" aria-hidden="true" />
        Scheduled for {formatSlot(scheduledFor)}
      </p>
    );
  }

  const submit = () => {
    if (slot.getTime() <= Date.now()) {
      toast.error("Pick a time in the future");
      return;
    }
    schedule.mutate(
      { post_id: draftId, body: { scheduled_at: toOffsetIso(slot), ...(text ? { text } : {}) } },
      { onSuccess: () => setScheduledFor(slot) },
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="min-w-0 flex-1">
        <span className="sr-only">Post time</span>
        <input
          type="datetime-local"
          value={toInputValue(slot)}
          onChange={(e) => e.target.value && setSlot(new Date(e.target.value))}
          className="h-9 w-full rounded-full border border-[#E6E8F5] bg-white px-3 text-[12px] outline-none focus:border-[#0A66C2] focus:ring-2 focus:ring-[#0A66C2]/20"
        />
      </label>
      <button type="button" onClick={submit} disabled={schedule.isPending} className={PRIMARY_BUTTON}>
        {schedule.isPending ? <Loader2 className="size-4 animate-spin" /> : <CalendarCheck className="size-4" />}
        Schedule
      </button>
    </div>
  );
}
