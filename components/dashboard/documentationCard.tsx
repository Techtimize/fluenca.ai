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
    <Card as="aside" className="flex flex-col p-5">
      <h2 className="mb-3 text-[13px] font-semibold text-neutral-900">Documentation</h2>
      <ul className="flex-1 space-y-1">
        {items.map((item) => {
          const Icon = getIcon(item.icon);
          return (
            <li key={item.id}>
              <Link href={item.href} className={`flex items-center gap-3 rounded-xl p-2 hover:bg-[#F6F7FD] ${FOCUS_RING}`}>
                <span className="grid size-8 place-items-center rounded-lg bg-[#ECEBFF] text-[#5B57E6]">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-medium text-neutral-900">{item.title}</span>
                  <span className="block truncate text-xs text-neutral-500">{item.subtitle}</span>
                </span>
                <ChevronRight className="size-4 text-neutral-500" aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={onSetGoal}
        className={`mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2E2A9E] to-[#4F46E5] text-sm font-medium text-white ${FOCUS_RING}`}
      >
        <Target className="size-4" aria-hidden="true" />
        {goalLabel}
      </button>
    </Card>
  );
}