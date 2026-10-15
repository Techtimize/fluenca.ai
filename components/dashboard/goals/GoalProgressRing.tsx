import { useId } from "react";

const SIZES = {
  md: { size: 132, outer: 10, inner: 5, gap: 5, value: "text-[26px]", padding: "px-5 py-4", gapClass: "gap-3" },
  sm: { size: 96, outer: 8, inner: 4, gap: 4, value: "text-[20px]", padding: "px-3.5 py-3", gapClass: "gap-2.5" },
} as const;

/** Within this many points of expected counts as on track. */
const ON_TRACK_MARGIN = 5;

function pace(progress: number | null, expected: number | null) {
  if (progress == null || expected == null) return null;
  const diff = progress - expected;
  if (Math.abs(diff) <= ON_TRACK_MARGIN) return { label: "On track", className: "bg-[#DCFCE7] text-[#047857]" };
  if (diff > 0) return { label: `Ahead by ${diff}%`, className: "bg-[#DCFCE7] text-[#047857]" };
  return { label: `Behind by ${-diff}%`, className: "bg-[#FFE4E6] text-[#BE123C]" };
}

/** A filled arc; nothing at 0, since a round cap on a zero-length dash still draws a dot. */
function Arc({ r, center, stroke, width, percent }: { r: number; center: number; stroke: string; width: number; percent: number | null }) {
  if (!percent) return null;
  const length = 2 * Math.PI * r;
  return (
    <circle
      cx={center}
      cy={center}
      r={r}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={`${(percent / 100) * length} ${length}`}
    />
  );
}

type Props = {
  progress: number | null;
  expected: number | null;
  /** Expected was estimated from time elapsed rather than reported by the backend. */
  expectedIsEstimate?: boolean;
  isLoading?: boolean;
  size?: keyof typeof SIZES;
};

/** Actual progress (outer ring, value in the centre) against expected progress (inner ring). */
export default function GoalProgressRing({
  progress,
  expected,
  expectedIsEstimate = false,
  isLoading = false,
  size = "md",
}: Props) {
  const gradientId = useId();
  const status = pace(progress, expected);
  const s = SIZES[size];
  const center = s.size / 2;
  const outerR = (s.size - s.outer) / 2;
  const innerR = outerR - s.outer / 2 - s.gap - s.inner / 2;

  return (
    <div className={`flex flex-col items-center rounded-2xl border border-[#E6E8F5] bg-white ${s.padding} ${s.gapClass}`}>
      <div className="relative" style={{ width: s.size, height: s.size }}>
        <svg viewBox={`0 0 ${s.size} ${s.size}`} className="size-full -rotate-90" aria-hidden="true">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          <circle cx={center} cy={center} r={outerR} fill="none" stroke="#ECEBFF" strokeWidth={s.outer} />
          <Arc r={outerR} center={center} stroke={`url(#${gradientId})`} width={s.outer} percent={progress} />
          <circle cx={center} cy={center} r={innerR} fill="none" stroke="#F4F4F5" strokeWidth={s.inner} />
          <Arc r={innerR} center={center} stroke="#F5A524" width={s.inner} percent={expected} />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className={`${s.value} font-semibold leading-none text-neutral-900`}>
              {isLoading ? "…" : progress != null ? `${progress}%` : "—"}
            </p>
            <p className="mt-1 text-[11px] text-neutral-500">progress</p>
          </div>
        </div>
      </div>

      <dl className="w-full space-y-1.5 text-[12px]">
        <div className="flex items-center justify-between gap-3">
          <dt className="flex items-center gap-1.5 text-neutral-600">
            <span className="size-2.5 rounded-full bg-linear-to-r from-[#4F46E5] to-[#8B5CF6]" aria-hidden="true" />
            Progress
          </dt>
          <dd className="font-semibold text-neutral-900">{progress != null ? `${progress}%` : "—"}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt
            className="flex items-center gap-1.5 text-neutral-600"
            title={expectedIsEstimate ? "Estimated from time elapsed toward the deadline" : undefined}
          >
            <span className="size-2.5 rounded-full bg-[#F5A524]" aria-hidden="true" />
            Expected{expectedIsEstimate && size === "md" ? " (by time)" : ""}
          </dt>
          <dd className="font-semibold text-neutral-900">{expected != null ? `${expected}%` : "—"}</dd>
        </div>
      </dl>

      {status ? (
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${status.className}`}>{status.label}</span>
      ) : null}
    </div>
  );
}

const MINI_SIZE = 56;
const MINI_STROKE = 6;

function MiniRing({
  label,
  percent,
  stroke,
  track,
  isLoading,
  title,
}: {
  label: string;
  percent: number | null;
  stroke: string;
  track: string;
  isLoading: boolean;
  title?: string;
}) {
  const center = MINI_SIZE / 2;
  const r = (MINI_SIZE - MINI_STROKE) / 2;
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl border border-[#E6E8F5] bg-white px-2 py-2" title={title}>
      <div className="relative" style={{ width: MINI_SIZE, height: MINI_SIZE }}>
        <svg viewBox={`0 0 ${MINI_SIZE} ${MINI_SIZE}`} className="size-full -rotate-90" aria-hidden="true">
          <circle cx={center} cy={center} r={r} fill="none" stroke={track} strokeWidth={MINI_STROKE} />
          <Arc r={r} center={center} stroke={stroke} width={MINI_STROKE} percent={percent} />
        </svg>
        <span className="absolute inset-0 grid place-items-center text-[13px] font-semibold text-neutral-900">
          {isLoading ? "…" : percent != null ? `${percent}%` : "—"}
        </span>
      </div>
      <span className="text-[11px] text-neutral-500">{label}</span>
    </div>
  );
}

/** Compact version for cards: progress and expected as two separate small rings. */
export function GoalProgressMini({
  progress,
  expected,
  expectedIsEstimate = false,
  isLoading = false,
}: Omit<Props, "size">) {
  return (
    <div className="flex w-full gap-2">
      <MiniRing label="Progress" percent={progress} stroke="#6366F1" track="#ECEBFF" isLoading={isLoading} />
      <MiniRing
        label="Expected"
        percent={expected}
        stroke="#F5A524"
        track="#FDF1DC"
        isLoading={isLoading}
        title={expectedIsEstimate ? "Estimated from time elapsed toward the deadline" : undefined}
      />
    </div>
  );
}
