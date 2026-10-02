import { ArrowUp } from "lucide-react";
import type { Metric, Tone } from "@/types/dashboard";
import { getIcon } from "@/utils/icon-utils";

const TONES: Record<Tone, { iconBg: string; text: string; bar: string }> = {
  green: { iconBg: "bg-[#EAF7E4]", text: "text-[#3BA61F]", bar: "bg-[#3BA61F]" },
  orange: { iconBg: "bg-[#FFF3E2]", text: "text-[#E08A0B]", bar: "bg-[#E08A0B]" },
  purple: { iconBg: "bg-[#ECEBFF]", text: "text-[#6366F1]", bar: "bg-[#818CF8]" },
  teal: { iconBg: "bg-[#DDF6F4]", text: "text-[#0D9488]", bar: "bg-[#2DD4BF]" },
  sky: { iconBg: "bg-[#E0F2FE]", text: "text-[#0284C7]", bar: "bg-[#38BDF8]" },
  rose: { iconBg: "bg-[#FDE8EE]", text: "text-[#E11D48]", bar: "bg-[#FB7185]" },
};

// Renders an <li>, so use it inside a <ul>.
export default function MetricCard({ metric }: { metric: Metric }) {
  const Icon = getIcon(metric.icon);
  const t = TONES[metric.tone];
  const score = Math.max(0, Math.min(100, metric.score));

  return (
    <li className="rounded-2xl border border-[#E6E8F5] bg-white p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className={`grid size-10 place-items-center rounded-xl ${t.iconBg} ${t.text}`}>
            <Icon className="size-5" aria-hidden="true" />
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