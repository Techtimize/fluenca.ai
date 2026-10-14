import type { ReactNode } from "react";
import { ChevronRight, Target } from "lucide-react";
import Card from "@/components/shared/card";
import type { DocItem } from "@/types/dashboard";
import { getIcon } from "@/utils/icon-utils";
import { FOCUS_RING } from "@/utils/ui-classes";

type Props = {
  items: DocItem[];
  goalLabel?: string;
  onSetGoal?: () => void;
  /** Shown above the goal button, e.g. the current goal. */
  goalSlot?: ReactNode;
  onSelect?: (item: DocItem) => void;
};

export default function DocumentationCard({
  items,
  goalLabel = "Set Your Goal",
  onSetGoal,
  goalSlot,
  onSelect,
}: Props) {
  return (
    <Card as="aside" className="flex h-full min-w-0 flex-col p-4 sm:p-5">
      <h2 className="mb-2 text-sm font-semibold text-neutral-900">
        Documentation
      </h2>
      <ul className="flex-1 space-y-0.5">
        {items.map((item) => {
          const Icon = getIcon(item.icon);
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect?.(item)}
                className={`group flex w-full items-center gap-2.5 rounded-xl px-1.5 py-2.5 text-left transition-colors hover:bg-[#F6F7FD] sm:gap-3 sm:px-2 ${FOCUS_RING}`}
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#EEF0FF] text-[#5452F6]">
                  <Icon className="size-4.5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-neutral-900">
                    {item.title}
                  </span>
                  <span className="block truncate text-xs text-neutral-500">
                    {item.subtitle}
                  </span>
                </span>
                <ChevronRight
                  className="size-4.5 shrink-0 text-neutral-700 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </button>
            </li>
          );
        })}
      </ul>
      {goalSlot}
      <button
        type="button"
        onClick={onSetGoal}
        className={`mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#4F46E5] to-[#8B5CF6] px-3 text-sm font-medium text-white shadow-[0_6px_16px_-6px_rgba(99,70,240,0.6)] transition-opacity hover:opacity-95 sm:text-[15px] ${FOCUS_RING}`}
      >
        <Target className="size-4.5 shrink-0" aria-hidden="true" />
        <span className="truncate">{goalLabel}</span>
      </button>
    </Card>
  );
}
