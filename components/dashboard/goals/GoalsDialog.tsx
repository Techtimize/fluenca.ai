"use client";

import GoalsWizard from "@/components/dashboard/goals/GoalsWizard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateGoalMutation } from "@/routes/bussiness/Bussiness-Mutation";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function GoalsDialog({ open, onOpenChange }: Props) {
  const { mutate: createGoal } = CreateGoalMutation();


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="flex max-h-[min(92vh,920px)] w-full max-w-[calc(100%-1rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-4xl sm:rounded-3xl"
      >
        <DialogHeader className="shrink-0 border-b border-[#EEF0F8] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_55%)] px-4 py-4 pe-12 sm:px-6 sm:py-5">
          <DialogTitle className="text-[18px] font-semibold tracking-tight text-neutral-900">
            Set your goal
          </DialogTitle>
          <DialogDescription className="mt-1 text-[13px] leading-5 text-neutral-500">
            Pick a target, diagnose the gap, approve a plan, execute tasks, and
            optimize as results come in.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
          {open ? <GoalsWizard /> : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
