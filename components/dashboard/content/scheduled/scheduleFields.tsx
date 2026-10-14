"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { MonthCalendar, formatSchedule } from "@/components/dashboard/content/schedulePostDialog";
import {
  SCHEDULED_POST_PLATFORMS,
  type ScheduledPostPlatform,
} from "@/types/bussiness/scheduled-post-type";
import { FOCUS_RING } from "@/utils/ui-classes";
import { cn } from "@/lib/utils";

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
};

const pad = (n: number) => String(n).padStart(2, "0");

export function platformLabel(platform: string) {
  return PLATFORM_LABELS[platform] ?? platform.charAt(0).toUpperCase() + platform.slice(1);
}

export function PlatformIcon({ platform, className = "size-4" }: { platform: string; className?: string }) {
  if (platform === "instagram") {
    return <Image src="/assets/insta.png" alt="" width={16} height={16} className={cn("object-contain", className)} />;
  }
  if (platform === "facebook") {
    return (
      <span
        className={cn("grid place-items-center rounded-full bg-[#1877F2] text-[10px] font-bold leading-none text-white", className)}
        aria-hidden="true"
      >
        f
      </span>
    );
  }
  return null;
}

export function isScheduledPostPlatform(value: string): value is ScheduledPostPlatform {
  return (SCHEDULED_POST_PLATFORMS as readonly string[]).includes(value);
}

export function PlatformPicker({
  value,
  onChange,
}: {
  value: ScheduledPostPlatform[];
  onChange: (next: ScheduledPostPlatform[]) => void;
}) {
  const toggle = (platform: ScheduledPostPlatform) =>
    onChange(value.includes(platform) ? value.filter((p) => p !== platform) : [...value, platform]);

  return (
    <fieldset>
      <legend className="text-[13px] font-medium text-neutral-700">Post to</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {SCHEDULED_POST_PLATFORMS.map((platform) => {
          const active = value.includes(platform);
          return (
            <button
              key={platform}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(platform)}
              className={cn(
                `inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-[13px] font-medium transition-colors ${FOCUS_RING}`,
                active
                  ? "border-[#5B57E6] bg-[#F0F1FF] text-[#3F3D9E]"
                  : "border-[#E6E8F5] bg-white text-neutral-600 hover:bg-[#F6F7FD]",
              )}
            >
              <PlatformIcon platform={platform} />
              {platformLabel(platform)}
              {active ? <Check className="size-3.5 text-[#5B57E6]" aria-hidden="true" /> : null}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Day picker plus time input; reports a Date in the browser's local time. */
export function ScheduleDateTime({ value, onChange }: { value: Date; onChange: (next: Date) => void }) {
  const inPast = value <= new Date();

  const pickDay = (day: Date) => {
    const next = new Date(day);
    next.setHours(value.getHours(), value.getMinutes(), 0, 0);
    onChange(next);
  };

  const pickTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return;
    const next = new Date(value);
    next.setHours(hours, minutes, 0, 0);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <MonthCalendar selected={value} onSelect={pickDay} />
      <label className="flex items-center justify-between gap-3 rounded-2xl border border-[#E6E8F5] px-3 py-2">
        <span className="text-sm font-medium text-neutral-700">Time</span>
        <input
          type="time"
          value={`${pad(value.getHours())}:${pad(value.getMinutes())}`}
          onChange={(event) => pickTime(event.target.value)}
          className="rounded-lg bg-[#F6F7FD] px-2 py-1 text-sm text-neutral-900 outline-none focus:ring-2 focus:ring-[#5B57E6]/40"
        />
      </label>
      <p className={`text-[12px] ${inPast ? "text-rose-600" : "text-neutral-500"}`}>
        {inPast
          ? "Pick a time in the future."
          : `Goes out ${formatSchedule(value.toISOString())} (${Intl.DateTimeFormat().resolvedOptions().timeZone})`}
      </p>
    </div>
  );
}
