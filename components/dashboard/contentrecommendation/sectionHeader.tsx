import type { LucideIcon } from "lucide-react";
import { sectionIcon } from "./chipsandsection";
import { humanize } from "./utils";

export default function SectionHeader({
  label,
  count,
  icon,
}: {
  label: string;
  count?: number;
  icon?: LucideIcon;
}) {
  const Icon = icon ?? sectionIcon(label);
  const title = humanize(label);

  return (
    <div className="mb-3 flex items-center gap-2.5">
      <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-[#ECEBFF] text-[#5B57E6]">
        <Icon className="size-3.5" aria-hidden="true" />
      </span>
      <div className="flex min-w-0 items-baseline gap-2">
        <h3 className="text-[14px] font-semibold text-neutral-900">{title}</h3>
        {typeof count === "number" ? (
          <span className="text-[12px] text-neutral-400">· {count}</span>
        ) : null}
      </div>
    </div>
  );
}
