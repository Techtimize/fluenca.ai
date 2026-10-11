"use client";

import {
  Activity,
  Check,
  ClipboardList,
  LineChart,
  Search,
  Target,
} from "lucide-react";

export const GOAL_STEPS = [
  {
    id: 1,
    label: "Set goal",
    description: "Platform, metric, target, deadline",
    icon: Target,
  },
  {
    id: 2,
    label: "Diagnose",
    description: "Profiles, content, competitors",
    icon: Search,
  },
  {
    id: 3,
    label: "Plan",
    description: "Weekly targets & experiments",
    icon: ClipboardList,
  },
  {
    id: 4,
    label: "Execute",
    description: "Content, schedule, tasks",
    icon: Activity,
  },
  {
    id: 5,
    label: "Optimize",
    description: "Learn and adjust",
    icon: LineChart,
  },
] as const;

type Props = {
  currentStep: number;
  maxReached: number;
  onSelect?: (step: number) => void;
};

export default function GoalStepRail({
  currentStep,
  maxReached,
  onSelect,
}: Props) {
  return (
    <ol className="grid gap-2 sm:grid-cols-5">
      {GOAL_STEPS.map((step, index) => {
        const Icon = step.icon;
        const done = currentStep > step.id;
        const active = currentStep === step.id;
        const reachable = step.id <= maxReached;
        return (
          <li key={step.id}>
            <button
              type="button"
              disabled={!reachable}
              onClick={() => onSelect?.(step.id)}
              className={`flex w-full items-start gap-2.5 rounded-2xl border px-3 py-3 text-left transition-colors ${
                active
                  ? "border-[#5B57E6] bg-[#F6F5FF] shadow-[0_1px_0_rgba(15,23,42,0.02)]"
                  : done
                    ? "border-[#E6E8F5] bg-white hover:bg-[#F8F9FF]"
                    : "border-[#EEF0F8] bg-[#FCFCFF] opacity-70"
              } disabled:cursor-not-allowed`}
            >
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-full text-[12px] font-semibold ${
                  done
                    ? "bg-[#5B57E6] text-white"
                    : active
                      ? "bg-[#ECEBFF] text-[#5B57E6]"
                      : "bg-[#F0F1F8] text-neutral-500"
                }`}
              >
                {done ? <Check className="size-3.5" /> : <Icon className="size-3.5" />}
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
                  Step {index + 1}
                </span>
                <span className="mt-0.5 block truncate text-[13px] font-semibold text-neutral-900">
                  {step.label}
                </span>
                <span className="mt-0.5 hidden text-[11px] leading-4 text-neutral-500 sm:block">
                  {step.description}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
