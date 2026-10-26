import { cn } from "@/lib/utils";
import { Check } from "lucide-react";


export type OnboardingStep = 1 | 2 | 3 | 4 | 5;

export default function OnboardingStepper({
  step,
  maxStepReached,
  stepLabels,
  onStepClick,
}: {
  step: OnboardingStep;
  maxStepReached: OnboardingStep;
  stepLabels: Record<OnboardingStep, string>;
  onStepClick: (step: OnboardingStep) => void;
}) {
  const steps: OnboardingStep[] = [1, 2, 3, 4];

  return (
    <div className="mx-auto flex w-full max-w-md items-start">
      {steps.map((id, index) => {
        const isDone = id < step;
        const isCurrent = id === step;
        const clickable = id <= maxStepReached && id !== step;

        return (
          <div
            key={id}
            className={cn("flex items-start", index < steps.length - 1 ? "flex-1" : "flex-none")}
          >
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick(id)}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-full text-[13px] font-semibold transition-colors",
                  isDone || isCurrent
                    ? "bg-[#5B57E6] text-white"
                    : "border-2 border-[#E6E8F5] bg-white text-neutral-400",
                  clickable ? "cursor-pointer" : "cursor-default",
                )}
              >
                {isDone ? <Check className="size-4" /> : id}
              </button>
              <span
                className={cn(
                  "max-w-23 text-center text-[12px] leading-tight",
                  isCurrent
                    ? "font-semibold text-neutral-900"
                    : isDone
                      ? "font-medium text-neutral-700"
                      : "text-neutral-400",
                )}
              >
                {stepLabels[id]}
              </span>
            </div>
            {index < steps.length - 1 ? (
              <div
                className={cn(
                  "mt-4.25 h-0.5 flex-1",
                  id < step ? "bg-[#5B57E6]" : "bg-[#E6E8F5]",
                )}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}