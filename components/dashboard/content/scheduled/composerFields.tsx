"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { CalendarDays, Clock, CloudUpload, Film, Globe, ImageIcon, Plus, X } from "lucide-react";
import { MonthCalendar } from "@/components/dashboard/content/schedulePostDialog";
import { SCHEDULED_POST_LIMITS } from "@/types/bussiness/scheduled-post-type";
import { FOCUS_RING } from "@/utils/ui-classes";
import { cn } from "@/lib/utils";

export const FIELD = `w-full rounded-xl border border-[#E6E8F5] bg-white text-[13px] text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-[#5B57E6] focus:ring-2 focus:ring-[#5B57E6]/20`;

const ACCEPT = [...SCHEDULED_POST_LIMITS.image.types, ...SCHEDULED_POST_LIMITS.video.types].join(",");
export const MEDIA_HINT = `${SCHEDULED_POST_LIMITS.image.label} · ${SCHEDULED_POST_LIMITS.video.label}`;

export function validateFile(file: File) {
  for (const limit of Object.values(SCHEDULED_POST_LIMITS)) {
    if ((limit.types as readonly string[]).includes(file.type)) {
      return file.size > limit.maxBytes ? `That file is too large. Use ${limit.label}.` : null;
    }
  }
  return `Unsupported file. Use ${SCHEDULED_POST_LIMITS.image.label}, or ${SCHEDULED_POST_LIMITS.video.label}.`;
}

export function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Numbered step heading, e.g. "1. Choose media". */
export function Step({
  n,
  title,
  hint,
  aside,
  children,
}: {
  n: number;
  title: string;
  hint?: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[13px] font-semibold text-neutral-900">
          {n}. {title}
          {hint ? <span className="ms-1 font-normal text-neutral-400">{hint}</span> : null}
        </h3>
        {aside}
      </div>
      {children}
    </section>
  );
}

/**
 * One image or video. `compact` is the slim LinkedIn row; otherwise a large drop zone
 * (the scheduling API takes one file per post, so there's no carousel).
 */
export function MediaPicker({
  file,
  previewUrl,
  error,
  disabled,
  compact = false,
  onPick,
  onClear,
}: {
  file: File | null;
  previewUrl: string | null;
  error: string | null;
  disabled: boolean;
  compact?: boolean;
  onPick: (file: File | undefined) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const isVideo = Boolean(file?.type.startsWith("video/"));

  const clear = () => {
    onClear();
    if (inputRef.current) inputRef.current.value = "";
  };

  const dropProps = {
    onDragOver: (event: React.DragEvent) => {
      event.preventDefault();
      setDragging(true);
    },
    onDragLeave: () => setDragging(false),
    onDrop: (event: React.DragEvent) => {
      event.preventDefault();
      setDragging(false);
      onPick(event.dataTransfer.files[0]);
    },
  };

  const input = (
    <input
      ref={inputRef}
      type="file"
      accept={ACCEPT}
      className="sr-only"
      disabled={disabled}
      onChange={(event) => onPick(event.target.files?.[0])}
    />
  );

  return (
    <div className="space-y-2.5">
      {file && previewUrl ? (
        <div className="flex items-center gap-3 rounded-2xl border border-[#E6E8F5] bg-white p-2.5">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-neutral-900">
            {isVideo ? (
              <video src={previewUrl} muted className="size-full object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- local blob preview
              <img src={previewUrl} alt="" className="size-full object-cover" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 truncate text-[13px] font-medium text-neutral-800">
              {isVideo ? (
                <Film className="size-3.5 shrink-0 text-[#5B57E6]" aria-hidden="true" />
              ) : (
                <ImageIcon className="size-3.5 shrink-0 text-[#5B57E6]" aria-hidden="true" />
              )}
              <span className="truncate">{file.name}</span>
            </p>
            <p className="text-[11px] text-neutral-500">{formatBytes(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={clear}
            disabled={disabled}
            aria-label="Remove file"
            className={`grid size-8 shrink-0 place-items-center rounded-full text-neutral-500 hover:bg-neutral-100 disabled:opacity-50 ${FOCUS_RING}`}
          >
            <X className="size-4" />
          </button>
        </div>
      ) : compact ? (
        <label
          {...dropProps}
          className={cn(
            "flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed px-4 py-3 transition-colors has-focus-visible:ring-2 has-focus-visible:ring-[#5B57E6]/40",
            dragging ? "border-[#5B57E6] bg-[#F0F1FF]" : "border-[#D9DCF7] bg-[#FAFAFF] hover:bg-[#F6F7FD]",
          )}
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-[#5B57E6] ring-1 ring-[#E3E6FF]">
            <CloudUpload className="size-4" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-medium text-neutral-800">Upload an image or video</span>
            <span className="block text-[11px] text-neutral-500">{MEDIA_HINT}</span>
          </span>
          <span className="shrink-0 rounded-full border border-[#D9DCF7] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#5B57E6]">
            Browse files
          </span>
          {input}
        </label>
      ) : (
        <label
          {...dropProps}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors has-focus-visible:ring-2 has-focus-visible:ring-[#5B57E6]/40",
            dragging ? "border-[#5B57E6] bg-[#F0F1FF]" : "border-[#D9DCF7] bg-[#FAFAFF] hover:bg-[#F6F7FD]",
          )}
        >
          <span className="grid size-11 place-items-center rounded-full bg-[#ECEBFF] text-[#5B57E6]">
            <CloudUpload className="size-5" aria-hidden="true" />
          </span>
          <span className="mt-3 text-[14px] font-semibold text-neutral-900">Drag and drop an image or video</span>
          <span className="mt-1 text-[12px] text-neutral-500">{MEDIA_HINT}</span>
          <span className="mt-3 rounded-full border border-[#D9DCF7] bg-white px-4 py-1.5 text-[13px] font-semibold text-[#5B57E6]">
            Browse files
          </span>
          {input}
        </label>
      )}
      {error ? <p className="text-[12px] text-rose-600">{error}</p> : null}
    </div>
  );
}

/** "#marketing" chips; Enter, comma or space adds one. */
export function HashtagInput({
  value,
  onChange,
  disabled,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  disabled: boolean;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const tag = draft.trim().replace(/^#+/, "").replace(/[^\p{L}\p{N}_]/gu, "");
    setDraft("");
    if (tag && !value.includes(tag)) onChange([...value, tag]);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "," || event.key === " ") {
      event.preventDefault();
      add();
    } else if (event.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className={`${FIELD} flex flex-wrap items-center gap-1.5 px-2.5 py-2`}>
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-full bg-[#EEF0FF] py-1 pe-1.5 ps-2.5 text-[12px] font-medium text-[#4544C9]"
        >
          #{tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((t) => t !== tag))}
            disabled={disabled}
            aria-label={`Remove #${tag}`}
            className={`grid size-4 place-items-center rounded-full hover:bg-[#DCDFFF] ${FOCUS_RING}`}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <span className="inline-flex min-w-28 flex-1 items-center gap-1 text-neutral-400">
        <Plus className="size-3.5 shrink-0" aria-hidden="true" />
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          onBlur={add}
          disabled={disabled}
          placeholder="Add hashtag"
          aria-label="Add hashtag"
          className="w-full bg-transparent text-[12px] text-neutral-800 outline-none placeholder:text-neutral-400"
        />
      </span>
    </div>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");
const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

/** Date (with an inline month calendar), time and the timezone it's sent in. */
export function ScheduleFields({ value, onChange }: { value: Date; onChange: (next: Date) => void }) {
  const [calendarOpen, setCalendarOpen] = useState(true);
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
      <div className="space-y-1.5">
        <p className="text-[12px] font-medium text-neutral-700">Date</p>
        <button
          type="button"
          onClick={() => setCalendarOpen((open) => !open)}
          aria-expanded={calendarOpen}
          className={`${FIELD} flex h-10 items-center gap-2 px-3 text-left ${FOCUS_RING}`}
        >
          <CalendarDays className="size-4 text-neutral-500" aria-hidden="true" />
          {value.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
        </button>
        {calendarOpen ? (
          <div className="rounded-xl border border-[#E6E8F5] p-2">
            <MonthCalendar selected={value} onSelect={pickDay} />
          </div>
        ) : null}
      </div>

      <label className="block space-y-1.5">
        <span className="text-[12px] font-medium text-neutral-700">Time</span>
        <span className={`${FIELD} flex h-10 items-center gap-2 px-3`}>
          <Clock className="size-4 shrink-0 text-neutral-500" aria-hidden="true" />
          <input
            type="time"
            value={`${pad(value.getHours())}:${pad(value.getMinutes())}`}
            onChange={(event) => pickTime(event.target.value)}
            className="w-full bg-transparent text-[13px] text-neutral-900 outline-none"
          />
        </span>
      </label>

      <div className="space-y-1.5">
        <p className="text-[12px] font-medium text-neutral-700">Timezone</p>
        <p className={`${FIELD} flex h-10 items-center gap-2 bg-[#FAFAFF] px-3 text-neutral-700`}>
          <Globe className="size-4 shrink-0 text-neutral-500" aria-hidden="true" />
          {TIMEZONE}
          <span className="ms-auto text-[11px] text-neutral-400">Your timezone</span>
        </p>
      </div>

      {inPast ? <p className="text-[12px] text-rose-600">Pick a time in the future.</p> : null}
    </div>
  );
}
