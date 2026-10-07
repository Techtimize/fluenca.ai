import { ArrowUp } from "lucide-react";
import type { Metric, Tone } from "@/types/dashboard";
import { DynamicIcon } from "@/utils/icon-utils";

const TONES: Record<Tone, { iconBg: string; text: string; bar: string }> = {
  green: { iconBg: "bg-[#EAF6E3]", text: "text-[#3E9E1C]", bar: "bg-[#3E9E1C]" },
  orange: { iconBg: "bg-[#FDF0DD]", text: "text-[#D98306]", bar: "bg-[#D98306]" },
  purple: { iconBg: "bg-[#E6E8FC]", text: "text-[#4A57EC]", bar: "bg-[#4A57EC]" },
  teal: { iconBg: "bg-[#DDF2F4]", text: "text-[#0E8F9B]", bar: "bg-[#0E8F9B]" },
  sky: { iconBg: "bg-[#E0F2FE]", text: "text-[#0284C7]", bar: "bg-[#38BDF8]" },
  rose: { iconBg: "bg-[#FDE8EE]", text: "text-[#E11D48]", bar: "bg-[#FB7185]" },
};

// Renders an <li>, so use it inside a <ul>.
export default function MetricCard({ metric }: { metric: Metric }) {
  const t = TONES[metric.tone];
  const score = Math.max(0, Math.min(100, metric.score));

  return (
    <li className="rounded-2xl border border-[#E6E8F5] bg-white p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className={`grid size-10 place-items-center rounded-xl ${t.iconBg} ${t.text}`}>
            <DynamicIcon name={metric.icon} className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[13px] font-medium text-neutral-900">{metric.label}</p>
            <p className={`flex items-center gap-0.5 text-[11px] ${t.text}`}>
              <ArrowUp className="size-3" aria-hidden="true" />
              {metric.change}
            </p>
          </div>
        </div>
        <p className="text-2xl font-semibold text-neutral-900">{metric.score}</p>
      </div>
      <div
        className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-100"
        role="progressbar"
        aria-label={metric.label}
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={`h-full rounded-full ${t.bar}`} style={{ width: `${score}%` }} />
      </div>
    </li>
  );
}