import { Monitor, Smartphone } from "lucide-react";
import type { OverallPerformance } from "@/types/dashboard";

// The gauge is drawn in code because it changes with the score.
function ScoreGauge({ score }: { score: number }) {
  const bars = 13;
  const cx = 110, cy = 105, r1 = 55, r2 = 92;

  return (
    <div className="relative mx-auto w-full max-w-[260px]">
      <svg viewBox="0 0 220 115" className="w-full" role="img" aria-label={`Overall score ${score}%`}>
        {Array.from({ length: bars }, (_, i) => {
          const a = Math.PI - (i / (bars - 1)) * Math.PI;
          const filled = i / (bars - 1) <= score / 100;
          return (
            <line
              key={i}
              x1={(cx + r1 * Math.cos(a)).toFixed(2)}
              y1={(cy - r1 * Math.sin(a)).toFixed(2)}
              x2={(cx + r2 * Math.cos(a)).toFixed(2)}
              y2={(cy - r2 * Math.sin(a)).toFixed(2)}
              stroke={filled ? "#818CF8" : "#EEF0F8"}
              strokeWidth="11"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <p className="text-2xl font-semibold text-neutral-900">{score}%</p>
        <p className="text-xs text-neutral-500">Overall Score</p>
      </div>
    </div>
  );
}

export default function OverallPerformanceCard({ data }: { data: OverallPerformance }) {
  return (
    <section className="flex flex-col rounded-2xl border border-[#E6E8F5] bg-white p-5">
      <h3 className="text-[13px] font-semibold text-neutral-900">Overall Performance</h3>
      <p className="mb-6 mt-1 text-xs text-neutral-500">{data.summary}</p>
      <ScoreGauge score={data.score} />
      {data.stats?.length ? (
        <dl className="mt-auto grid grid-cols-2 gap-3 pt-5">
          {data.stats.map((stat) => (
            <div key={stat.label} className="rounded-xl bg-[#F1F4FF] px-3 py-2.5">
              <dt className="text-xs text-neutral-600">{stat.label}</dt>
              <dd className="mt-1 text-sm font-semibold text-neutral-900">{stat.value}</dd>
            </div>
          ))}
        </dl>
      ) : (
      <dl className="mt-auto grid grid-cols-2 gap-3 pt-5">
        <div className="rounded-xl bg-[#F1F4FF] px-3 py-2.5">
          <dt className="flex items-center gap-1.5 text-xs text-neutral-600">
            <Smartphone className="size-3.5" aria-hidden="true" /> Mobile
          </dt>
          <dd className="mt-1 text-sm font-semibold text-neutral-900">{data.mobile} %</dd>
        </div>
        <div className="rounded-xl bg-[#F1F4FF] px-3 py-2.5">
          <dt className="flex items-center gap-1.5 text-xs text-neutral-600">
            <Monitor className="size-3.5" aria-hidden="true" /> Desktop
          </dt>
          <dd className="mt-1 text-sm font-semibold text-neutral-900">{data.desktop} %</dd>
        </div>
      </dl>
      )}
    </section>
  );
}