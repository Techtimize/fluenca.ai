import type { ReactNode } from "react";

type Props = {
  step: number;
  title: string;
  description: string;
  action?: ReactNode;
};

/** Numbered heading shared by the prospect finder's steps. */
export default function SectionHeader({ step, title, description, action }: Props) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex gap-3">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#EEF0FF] text-[12px] font-bold text-[#4544C9]">
          {step}
        </span>
        <div>
          <h2 className="text-[16px] font-semibold text-neutral-900">{title}</h2>
          <p className="mt-0.5 text-[13px] text-neutral-500">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}
