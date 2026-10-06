import Link from "next/link";
import { ChevronRight, Target } from "lucide-react";
import Card from "@/components/shared/card";
import type { DocItem } from "@/types/dashboard";
import { getIcon } from "@/utils/icon-utils";
import { FOCUS_RING } from "@/utils/ui-classes";


type Props = {
  items: DocItem[];
  goalLabel?: string;
  onSetGoal?: () => void;
};

export default function DocumentationCard({ items, goalLabel = "Set Your Goal", onSetGoal }: Props) {
  return (
    <Card as="aside" className="flex h-full flex-col p-5">
      <h2 className="mb-2 text-sm font-semibold text-neutral-900">Documentation</h2>
      <ul className="flex-1 space-y-0.5">
        {items.map((item) => {
          const Icon = getIcon(item.icon);
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-[#F6F7FD] ${FOCUS_RING}`}
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#EEF0FF] text-[#5452F6]">
                  <Icon className="size-4.5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-neutral-900">{item.title}</span>
                  <span className="block truncate text-xs text-neutral-500">{item.subtitle}</span>
                </span>
                <ChevronRight
                  className="size-4.5 text-neutral-700 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={onSetGoal}
        className={`mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#4F46E5] to-[#8B5CF6] text-[15px] font-medium text-white shadow-[0_6px_16px_-6px_rgba(99,70,240,0.6)] transition-opacity hover:opacity-95 ${FOCUS_RING}`}
      >
        <Target className="size-4.5" aria-hidden="true" />
        {goalLabel}
      </button>
    </Card>
  );
}
