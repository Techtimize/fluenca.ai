import { BarChart3, Monitor, MoreVertical, Smartphone } from "lucide-react";
import Card from "@/components/shared/card";
import type { AnalyticsData, AnalyticsSource, Device } from "@/types/dashboard";
import { FOCUS_RING } from "@/utils/ui-classes";
import AnalyticsChartsRow from "./analyticsCharts";
import IntegrationCard from "./integrationCard";
import MetricCard from "./metricCard";
import OverallPerformanceCard from "../overallPerformanceCard";
import VitalsCard from "./vitalsCard";

type Props = {
  data: AnalyticsData;
  sources: AnalyticsSource[];
  // Id of the selected source tab.
  source: string;
  device: Device;
  compact?: boolean;
  onSourceChange: (source: string) => void;
  onDeviceChange: (device: Device) => void;
  onConnectIntegration?: (id: string) => void;
};

export default function AnalyticsSection({
  data,
  sources,
  source,
  device,
  compact = false,
  onSourceChange,
  onDeviceChange,
  onConnectIntegration,
}: Props) {
  return (
    <Card className="mt-4 p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-neutral-900">Analytics</h2>
        <button type="button" aria-label="Analytics options" className="rounded-md p-1 text-neutral-600 hover:bg-neutral-100">
          <MoreVertical className="size-4" />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Analytics source" className="flex flex-wrap gap-2">
          {sources.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={source === s.id}
              onClick={() => onSourceChange(s.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${FOCUS_RING} ${
                source === s.id ? "bg-[#5452F6] text-white" : "bg-[#EEF0FF] text-neutral-800 hover:bg-[#E3E6FF]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* <div className="flex rounded-full bg-[#F1F4FF] p-1">
          {(["mobile", "desktop"] as const).map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={device === d}
              onClick={() => onDeviceChange(d)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${FOCUS_RING} ${
                device === d ? "bg-[#5452F6] text-white" : "text-[#5452F6]"
              }`}
            >
              {d === "mobile" ? <Smartphone className="size-3" /> : <Monitor className="size-3" />}
              {d}
            </button>
          ))}
        </div> */}
      </div>

      {data.emptyMessage ? (
        <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E6E8F5] bg-[#F9FAFF] px-6 py-14 text-center">
          <span className="grid size-11 place-items-center rounded-full bg-[#EEF0FF] text-[#5452F6]">
            <BarChart3 className="size-5" aria-hidden="true" />
          </span>
          <p className="mt-3 text-sm font-medium text-neutral-900">No analytics for this channel yet</p>
          <p className="mt-1 max-w-sm text-xs text-neutral-500">{data.emptyMessage}</p>
        </div>
      ) : (
      <>
      {/* Metrics: 4 across in one row from md up */}
      <ul className={`mt-4 grid gap-4 ${compact ? "sm:grid-cols-2" : `grid-cols-2 ${data.metrics.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4"}`}`}>
        {data.metrics.map((m) => (
          <MetricCard key={m.id} metric={m} />
        ))}
      </ul>

      {/* Overall + analysis charts: 4 across in one row */}
      <div
        className={`mt-4 grid gap-4 ${
          compact
            ? "sm:grid-cols-2 sm:[&>*:last-child:nth-child(odd)]:col-span-2"
            : data.charts
              ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
              : "lg:grid-cols-[minmax(260px,1.1fr)_repeat(2,minmax(0,1fr))]"
        }`}
      >
        <OverallPerformanceCard data={data.overall} />
        {data.charts ? <AnalyticsChartsRow charts={data.charts} /> : null}
        {!data.charts
          ? data.integrations.map((i) => (
              <IntegrationCard key={i.id} integration={i} onConnect={onConnectIntegration} />
            ))
          : null}
      </div>

      {/* Vitals: side by side normally, stacked when compact */}
      {data.vitals.length > 0 && (
        <div className={`mt-4 grid gap-4 ${compact ? "" : "lg:grid-cols-2"}`}>
          {data.vitals.map((g) => (
            <VitalsCard key={g.id} group={g} />
          ))}
        </div>
      )}
      </>
      )}
    </Card>
  );
}