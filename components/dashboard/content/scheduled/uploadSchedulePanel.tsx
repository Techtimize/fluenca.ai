"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarClock, CloudUpload, Film, ImageIcon, Loader2, X } from "lucide-react";
import { initialDate } from "@/components/dashboard/content/schedulePostDialog";
import {
  PlatformPicker,
  ScheduleDateTime,
  useConnectedPlatforms,
} from "@/components/dashboard/content/scheduled/scheduleFields";
import Card from "@/components/shared/card";
import { CreateScheduledPostMutation } from "@/routes/bussiness/Bussiness-Mutation";
import {
  SCHEDULED_POST_LIMITS,
  toOffsetIso,
  type ScheduledPostPlatform,
} from "@/types/bussiness/scheduled-post-type";
import { FOCUS_RING } from "@/utils/ui-classes";
import { cn } from "@/lib/utils";

const CAPTION_LIMIT = 2200;
const ACCEPT = [...SCHEDULED_POST_LIMITS.image.types, ...SCHEDULED_POST_LIMITS.video.types].join(",");

function validateFile(file: File) {
  for (const limit of Object.values(SCHEDULED_POST_LIMITS)) {
    if ((limit.types as readonly string[]).includes(file.type)) {
      return file.size > limit.maxBytes ? `That file is too large. Use ${limit.label}.` : null;
    }
  }
  return `Unsupported file. Use ${SCHEDULED_POST_LIMITS.image.label}, or ${SCHEDULED_POST_LIMITS.video.label}.`;
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Upload your own image or video and schedule it to one or more platforms. */
export default function UploadSchedulePanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  // null until the user picks; until then the first connected platform is preselected.
  const [picked, setPicked] = useState<ScheduledPostPlatform[] | null>(null);
  const { connected, isLoading: platformsLoading } = useConnectedPlatforms();
  const platforms = (picked ?? connected.slice(0, 1)).filter((p) => connected.includes(p));
  const [scheduledAt, setScheduledAt] = useState(() => initialDate());
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const { mutate, isPending } = CreateScheduledPostMutation();

  // Free the previous preview whenever it is replaced, and on unmount.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const isVideo = Boolean(file?.type.startsWith("video/"));
  const inPast = scheduledAt <= new Date();
  const canSubmit = Boolean(file) && platforms.length > 0 && !inPast && !isPending;

  const pickFile = (next: File | undefined) => {
    if (!next) return;
    const error = validateFile(next);
    setFileError(error);
    if (error) return;
    setFile(next);
    setPreviewUrl(URL.createObjectURL(next));
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setFileError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const submit = () => {
    if (!file || !canSubmit) return;
    setProgress(0);
    mutate(
      {
        body: {
          file,
          platforms,
          scheduled_at: toOffsetIso(scheduledAt),
          caption: caption.trim() || undefined,
        },
        onProgress: setProgress,
      },
      {
        onSuccess: () => {
          clearFile();
          setCaption("");
          setScheduledAt(initialDate());
        },
      },
    );
  };

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#ECEBFF] text-[#5B57E6]">
          <CloudUpload className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="text-[16px] font-semibold text-neutral-900">Upload & schedule</h2>
          <p className="text-[12px] text-neutral-500">
            {SCHEDULED_POST_LIMITS.image.label} · {SCHEDULED_POST_LIMITS.video.label}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)]">
        <div className="min-w-0 space-y-4">
          {file && previewUrl ? (
            <div className="relative overflow-hidden rounded-2xl border border-[#E6E8F5] bg-neutral-950">
              {isVideo ? (
                <video src={previewUrl} controls className="mx-auto max-h-80 w-full object-contain" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element -- local blob preview, nothing to optimise
                <img src={previewUrl} alt="Selected upload" className="mx-auto max-h-80 w-full object-contain" />
              )}
              <div className="flex items-center gap-2 border-t border-white/10 bg-white px-3 py-2">
                {isVideo ? (
                  <Film className="size-4 shrink-0 text-[#5B57E6]" aria-hidden="true" />
                ) : (
                  <ImageIcon className="size-4 shrink-0 text-[#5B57E6]" aria-hidden="true" />
                )}
                <p className="min-w-0 flex-1 truncate text-[12px] text-neutral-700">{file.name}</p>
                <span className="shrink-0 text-[11px] text-neutral-500">{formatBytes(file.size)}</span>
                <button
                  type="button"
                  onClick={clearFile}
                  disabled={isPending}
                  aria-label="Remove file"
                  className={`grid size-7 shrink-0 place-items-center rounded-full text-neutral-500 hover:bg-neutral-100 disabled:opacity-50 ${FOCUS_RING}`}
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>
          ) : (
            <label
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                pickFile(event.dataTransfer.files[0]);
              }}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#5B57E6]/40",
                dragging ? "border-[#5B57E6] bg-[#F0F1FF]" : "border-[#D9DCF7] bg-[#FAFAFF] hover:bg-[#F6F7FD]",
              )}
            >
              <span className="grid size-12 place-items-center rounded-full bg-white text-[#5B57E6] shadow-sm ring-1 ring-[#E3E6FF]">
                <CloudUpload className="size-5" aria-hidden="true" />
              </span>
              <span className="mt-3 text-[14px] font-semibold text-neutral-900">
                Drop an image or video here, or browse
              </span>
              <span className="mt-1 text-[12px] text-neutral-500">
                {SCHEDULED_POST_LIMITS.image.label} · {SCHEDULED_POST_LIMITS.video.label}
              </span>
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPT}
                className="sr-only"
                onChange={(event) => pickFile(event.target.files?.[0])}
              />
            </label>
          )}
          {fileError ? <p className="text-[12px] text-rose-600">{fileError}</p> : null}

          <label className="block">
            <span className="flex items-center justify-between text-[13px] font-medium text-neutral-700">
              Caption <span className="font-normal text-neutral-400">Optional</span>
            </span>
            <textarea
              value={caption}
              onChange={(event) => setCaption(event.target.value.slice(0, CAPTION_LIMIT))}
              rows={4}
              placeholder="Write a caption…"
              className="mt-2 w-full resize-y rounded-2xl border border-[#E6E8F5] bg-white px-3.5 py-2.5 text-[13px] text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-[#5B57E6] focus:ring-2 focus:ring-[#5B57E6]/20"
            />
            <span className="mt-1 block text-end text-[11px] text-neutral-400">
              {caption.length}/{CAPTION_LIMIT}
            </span>
          </label>
        </div>

        <div className="min-w-0 space-y-4">
          <PlatformPicker
            value={platforms}
            onChange={setPicked}
            connected={connected}
            isLoading={platformsLoading}
          />
          <ScheduleDateTime value={scheduledAt} onChange={setScheduledAt} />

          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#5B57E6] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#4A46D0] disabled:pointer-events-none disabled:opacity-55 ${FOCUS_RING}`}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <CalendarClock className="size-4" aria-hidden="true" />
            )}
            {isPending ? (progress < 100 ? `Uploading ${progress}%` : "Scheduling…") : "Schedule post"}
          </button>
          {isPending ? (
            <div
              className="h-1.5 overflow-hidden rounded-full bg-[#ECEBFF]"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Upload progress"
            >
              <div className="h-full rounded-full bg-[#5B57E6] transition-[width]" style={{ width: `${progress}%` }} />
            </div>
          ) : !file ? (
            <p className="text-center text-[12px] text-neutral-500">Add a file to schedule it.</p>
          ) : platforms.length === 0 && connected.length ? (
            <p className="text-center text-[12px] text-rose-600">Pick at least one platform.</p>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
