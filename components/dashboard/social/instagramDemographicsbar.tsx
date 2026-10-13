import { DemographicBreakdown } from "@/types/bussiness/instagram-insights-type";
import { formatCount } from "./socialUtils";

export function InstagramDemographicsBar({
  breakdown,
}: {
  breakdown: DemographicBreakdown;
}) {
  const buckets = Array.isArray(breakdown?.buckets) ? breakdown.buckets : [];
  if (buckets.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-4">
        <h4 className="text-[13px] font-semibold text-neutral-900">
          {breakdown?.title || "Demographics"}
        </h4>
        <p className="mt-3 text-[12px] text-neutral-500">No data for this breakdown.</p>
      </div>
    );
  }

  const max = Math.max(1, ...buckets.map((b) => b.value));
  const rows = buckets.slice(0, 8);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <h4 className="text-[13px] font-semibold text-neutral-900">
        {breakdown.title}
      </h4>
      <ul className="mt-3 space-y-2.5">
        {rows.map((b) => (
          <li key={b.key}>
            <div className="mb-1 flex items-center justify-between gap-2 text-[12px]">
              <span className="truncate font-medium text-neutral-700">
                {b.label}
              </span>
              <span className="shrink-0 text-neutral-500">
                {formatCount(b.value)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#F58529] via-[#E1306C] to-[#C13584]"
                style={{ width: `${(b.value / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

  