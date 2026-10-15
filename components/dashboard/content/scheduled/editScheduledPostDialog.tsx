"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { initialDate } from "@/components/dashboard/content/schedulePostDialog";
import {
  PlatformPicker,
  ScheduleDateTime,
  isScheduledPostPlatform,
} from "@/components/dashboard/content/scheduled/scheduleFields";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UpdateScheduledPostMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { toOffsetIso, type ScheduledPost } from "@/types/bussiness/scheduled-post-type";
import { FOCUS_RING } from "@/utils/ui-classes";

type Props = {
  post: ScheduledPost;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Mounted fresh on each open, so the form always starts from the post's current values. */
function EditForm({ post, onDone }: { post: ScheduledPost; onDone: () => void }) {
  const [platforms, setPlatforms] = useState(() => post.platforms.filter(isScheduledPostPlatform));
  const [scheduledAt, setScheduledAt] = useState(() => initialDate(post.scheduled_at));
  const [caption, setCaption] = useState(post.caption ?? "");
  const { mutate, isPending } = UpdateScheduledPostMutation();

  const inPast = scheduledAt <= new Date();
  const canSave = platforms.length > 0 && !inPast && !isPending;

  const save = () => {
    if (!canSave) return;
    mutate(
      {
        post_id: post.id,
        body: { scheduled_at: toOffsetIso(scheduledAt), platforms, caption: caption.trim() },
      },
      { onSuccess: onDone },
    );
  };

  return (
    <>
      <div className="max-h-[60vh] space-y-4 overflow-y-auto pe-1">
        <PlatformPicker value={platforms} onChange={setPlatforms} />
        <ScheduleDateTime value={scheduledAt} onChange={setScheduledAt} />
        <label className="block">
          <span className="text-[13px] font-medium text-neutral-700">Caption</span>
          <textarea
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            rows={3}
            className="mt-2 w-full resize-y rounded-2xl border border-[#E6E8F5] bg-white px-3.5 py-2.5 text-[13px] text-neutral-900 outline-none focus:border-[#5B57E6] focus:ring-2 focus:ring-[#5B57E6]/20"
          />
        </label>
      </div>

      <DialogFooter>
        <button
          type="button"
          onClick={onDone}
          disabled={isPending}
          className={`inline-flex h-10 items-center justify-center rounded-xl border border-[#E6E8F5] bg-white px-4 text-[13px] font-semibold text-neutral-700 hover:bg-neutral-50 ${FOCUS_RING}`}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={save}
          disabled={!canSave}
          className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#5B57E6] px-4 text-[13px] font-semibold text-white hover:bg-[#4A46D0] disabled:pointer-events-none disabled:opacity-55 ${FOCUS_RING}`}
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          Save changes
        </button>
      </DialogFooter>
    </>
  );
}

export default function EditScheduledPostDialog({ post, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit scheduled post</DialogTitle>
          <DialogDescription>Change the time, platforms or caption before it goes out.</DialogDescription>
        </DialogHeader>
        {open ? <EditForm post={post} onDone={() => onOpenChange(false)} /> : null}
      </DialogContent>
    </Dialog>
  );
}
