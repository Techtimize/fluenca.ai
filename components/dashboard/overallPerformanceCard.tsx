import { useId } from "react";
import { Monitor, Smartphone } from "lucide-react";
import type { OverallPerformance } from "@/types/dashboard";


const BARS = 13;
const SWEEP = 200; 
const CX = 140,
  CY = 140,
  R_INNER = 84,
  R_OUTER = 132,
  BAR_WIDTH = 24;
const TRACK = "#EEF0FD";

function ScoreGauge({ score }: { score: number }) {
  const gradientId = useId();
  const pct = Math.max(0, Math.min(100, score)) / 100;
  const filledCount = Math.round(pct * (BARS - 1)) + (pct > 0 ? 1 : 0);

  return (
    <svg
      viewBox="0 0 280 182"
      className="mx-auto w-full max-w-70"
      role="img"
      aria-label={`Overall score ${score}%`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A5DF9" />
          <stop offset="100%" stopColor="#7C4FF0" />
        </linearGradient>
      </defs>
      {Array.from({ length: BARS }, (_, i) => {
        const angle = -SWEEP / 2 + (i / (BARS - 1)) * SWEEP;
        return (
          <rect
            key={i}
            x={CX - BAR_WIDTH / 2}
            y={CY - R_OUTER}
            width={BAR_WIDTH}
            height={R_OUTER - R_INNER}
            rx={11}
            fill={i < filledCount ? `url(#${gradientId})` : TRACK}
            transform={`rotate(${angle.toFixed(2)} ${CX} ${CY})`}
          />
        );
      })}
      <text
        x={CX}
        y={CY + 2}
        textAnchor="middle"
        className="fill-neutral-900 text-[38px] font-semibold"
      >
        {score}%
      </text>
      <text
        x={CX}
        y={CY + 26}
        textAnchor="middle"
        className="fill-neutral-700 text-[15px]"
      >
        Overall Score
      </text>
    </svg>
  );
}

export default function OverallPerformanceCard({
  data,
}: {
  data: OverallPerformance;
}) {
  return (
    <section className="flex flex-col rounded-2xl border border-[#E6E8F5] bg-white p-5">
      <h3 className="text-[13px] font-semibold text-neutral-900">
        Overall Performance
      </h3>
      <p className="mb-6 mt-1 text-xs text-neutral-500">{data.summary}</p>
      <ScoreGauge score={data.score} />
      {data.stats?.length ? (
        <dl className="mt-auto grid grid-cols-2 gap-3 pt-5">
          {data.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-[#F1F4FF] px-3 py-2.5"
            >
              <dt className="text-xs text-neutral-600">{stat.label}</dt>
              <dd className="mt-1 text-sm font-semibold text-neutral-900">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : data.mobile != null && data.desktop != null ? (
        <dl className="mt-auto grid grid-cols-2 gap-3 pt-5">
          <div className="rounded-xl bg-[#F1F4FF] px-3 py-2.5">
            <dt className="flex items-center gap-1.5 text-xs text-neutral-600">
              <Smartphone className="size-3.5" aria-hidden="true" /> Mobile
            </dt>
            <dd className="mt-1 text-sm font-semibold text-neutral-900">
              {data.mobile} %
            </dd>
          </div>
          <div className="rounded-xl bg-[#F1F4FF] px-3 py-2.5">
            <dt className="flex items-center gap-1.5 text-xs text-neutral-600">
              <Monitor className="size-3.5" aria-hidden="true" /> Desktop
            </dt>
            <dd className="mt-1 text-sm font-semibold text-neutral-900">
              {data.desktop} %
            </dd>
          </div>
        </dl>
      ) : null}
    </section>
  );
}
