import { BarChart3, Monitor, MoreVertical, Smartphone } from "lucide-react";
import Card from "@/components/shared/card";
import type { AnalyticsData, AnalyticsSource, Device } from "@/types/dashboard";
import { FOCUS_RING } from "@/utils/ui-classes";
import {
  GoogleAnalyticsSourceCard,
  InstagramSourceCard,
  WebsiteSpeedSourceCard,
} from "./dataSourceCards";
import MetricCard from "./metricCard";
import OverallPerformanceCard from "../overallPerformanceCard";
import VitalsCard from "./vitalsCard";

type Props = {
  data: AnalyticsData;
  sources: AnalyticsSource[];
  source: string;
  device: Device;
  compact?: boolean;
  onSourceChange: (source: string) => void;
  onDeviceChange: (device: Device) => void;
};

export default function AnalyticsSection({
  data,
  sources,
  source,
  device,
  compact = false,
  onSourceChange,
  onDeviceChange,
}: Props) {
  return (
    <Card className="mt-0 p-4 sm:mt-4 sm:p-5 md:p-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-neutral-900">Analytics</h2>
        <button type="button" aria-label="Analytics options" className="shrink-0 rounded-md p-1 text-neutral-600 hover:bg-neutral-100">
          <MoreVertical className="size-4" />
        </button>
      </div>

      {data.emptyMessage ? (
        <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E6E8F5] bg-[#F9FAFF] px-4 py-10 text-center sm:px-6 sm:py-14">
          <span className="grid size-11 place-items-center rounded-full bg-[#EEF0FF] text-[#5452F6]">
            <BarChart3 className="size-5" aria-hidden="true" />
          </span>
          <p className="mt-3 text-sm font-medium text-neutral-900">No analytics for this channel yet</p>
          <p className="mt-1 max-w-sm text-xs text-neutral-500">{data.emptyMessage}</p>
        </div>
      ) : (
      <>
      <ul
        className={`mt-4 grid gap-3 sm:gap-4 ${
          compact
            ? "grid-cols-1 min-[380px]:grid-cols-2"
            : `grid-cols-1 min-[380px]:grid-cols-2 ${
                data.metrics.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4"
              }`
        }`}
      >
        {data.metrics.map((m) => (
          <MetricCard key={m.id} metric={m} />
        ))}
      </ul>

      {/* Overall score + the data sources that deepen it */}
      <div
        className={`mt-3 grid gap-3 sm:mt-4 sm:gap-4 ${
          compact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
        }`}
      >
        <OverallPerformanceCard data={data.overall} />
        <GoogleAnalyticsSourceCard />
        <WebsiteSpeedSourceCard />
        <InstagramSourceCard />
      </div>


      {data.vitals.length > 0 && (
        <div className={`mt-3 grid gap-3 sm:mt-4 sm:gap-4 ${compact ? "" : "lg:grid-cols-2"}`}>
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