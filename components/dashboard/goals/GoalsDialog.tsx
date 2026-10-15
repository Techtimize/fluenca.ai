"use client";

import { Loader2 } from "lucide-react";
import GoalsWizard from "@/components/dashboard/goals/GoalsWizard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GoalByIdQuery } from "@/routes/bussiness/Bussiness-Query";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Reopen this saved goal; omit to set a new one. */
  goalId?: string | null;
};

export default function GoalsDialog({ open, onOpenChange, goalId }: Props) {
  const { data: goalDetail, isLoading, isError } = GoalByIdQuery(
    open ? goalId : null,
  );

  let body = null;
  if (open && goalId) {
    if (isLoading) {
      body = (
        <div className="grid place-items-center py-16 text-neutral-400">
          <Loader2 className="size-5 animate-spin" />
        </div>
      );
    } else if (isError || !goalDetail) {
      body = (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-700">
          Couldn&apos;t load this goal. Try again.
        </p>
      );
    } else {
      body = <GoalsWizard key={goalId} initialGoal={goalDetail} />;
    }
  } else if (open) {
    body = <GoalsWizard />;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="flex max-h-[min(92vh,920px)] w-full max-w-[calc(100%-1rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-4xl sm:rounded-3xl"
      >
        <DialogHeader className="shrink-0 border-b border-[#EEF0F8] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_55%)] px-4 py-4 pe-12 sm:px-6 sm:py-5">
          <DialogTitle className="text-[18px] font-semibold tracking-tight text-neutral-900">
            {goalId ? "Your goal" : "Set your goal"}
          </DialogTitle>
          <DialogDescription className="mt-1 text-[13px] leading-5 text-neutral-500">
            Pick a target, diagnose the gap, approve a plan, and execute tasks.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
          {body}
        </div>
      </DialogContent>
    </Dialog>
  );
}
