"use client";
import { useState } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import {  X } from "lucide-react";
import AnalyticsChartsRow from "@/components/dashboard/cards/analyticsCharts";
import { ANALYSIS_DOC_ID } from "@/lib/dashboard/map-dashboard";
import { AnalyzeCompanyDashboardDocumentationQuery } from "@/routes/bussiness/Bussiness-Query";
import type {
  CompanyDocumentationDetails,
  CompetitorsDocumentationDetails,
  DashboardDocumentationData,
  MarketingDocumentationDetails,
  PainPointsDocumentationDetails,
} from "@/types/bussiness/dashboard-documentation-type";
import type { AnalyticsCharts, DocItem } from "@/types/dashboard";
import { FOCUS_RING } from "@/utils/ui-classes";
import CompanyDetails from "./companydetailsidesheet";
import { BulletList, Fields, ListHeading, SheetSection } from "./utils";
import MarketingDetails from "./marketingpositionSheet";
import PainPointsDetails from "./painpointsSheet";
import CompetitorsDetails from "./competitorSheet";

type Props = {
  companyId: string;
  item: DocItem | null;
  onClose: () => void;
  analysisChannels?: AnalysisChannel[];
  defaultAnalysisChannel?: string;
};

export type AnalysisChannel = { id: string; label: string; charts: AnalyticsCharts | null };

export default function DocumentationSheet({
  companyId,
  item,
  onClose,
  analysisChannels = [],
  defaultAnalysisChannel,
}: Props) {
  const open = item !== null;
  const isAnalysis = item?.id === ANALYSIS_DOC_ID;
  const { data, isLoading, isError } = AnalyzeCompanyDashboardDocumentationQuery(companyId, open && !isAnalysis);
  const section = item ? data?.data?.[item.id as keyof DashboardDocumentationData] : undefined;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/30 duration-150 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup className="fixed inset-0 z-50 flex w-full max-w-none flex-col overflow-hidden rounded-none bg-white shadow-2xl outline-none duration-200 data-open:animate-in data-open:slide-in-from-right-10 data-open:fade-in-0 data-closed:animate-out data-closed:slide-out-to-right-10 data-closed:fade-out-0 sm:inset-y-3 sm:right-3 sm:left-auto sm:w-[calc(100%-1.5rem)] sm:max-w-md sm:rounded-3xl">
          <header className="mx-4 flex items-center justify-between gap-3 border-b border-[#ECEDF5] py-4 sm:mx-5">
            <DialogPrimitive.Title className="min-w-0 truncate text-base font-semibold text-neutral-900">
              {section?.title ?? item?.title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              className={`grid size-8 place-items-center rounded-full text-neutral-700 transition-colors hover:bg-[#F1F2F8] ${FOCUS_RING}`}
            >
              <X className="size-4.5" aria-hidden="true" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </header>

          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
            {isAnalysis ? (
              <AnalysisDetails channels={analysisChannels} defaultChannel={defaultAnalysisChannel} />
            ) : isLoading ? (
              <SheetSkeleton />
            ) : isError ? (
              <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                Could not load these details. Please try again.
              </p>
            ) : !section ? (
              <p className="text-sm text-neutral-500">No details available yet.</p>
            ) : item?.id === "company" ? (
              <CompanyDetails details={section.details as CompanyDocumentationDetails} />
            ) : item?.id === "marketing" ? (
              <MarketingDetails details={section.details as MarketingDocumentationDetails} />
            ) : item?.id === "pain_points" ? (
              <PainPointsDetails details={section.details as PainPointsDocumentationDetails} />
            ) : item?.id === "competitors" ? (
              <CompetitorsDetails details={section.details as CompetitorsDocumentationDetails} />
            ) : null}
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}


function AnalysisDetails({ channels, defaultChannel }: { channels: AnalysisChannel[]; defaultChannel?: string }) {
  const [selected, setSelected] = useState(defaultChannel);
  const active = channels.find((channel) => channel.id === selected) ?? channels[0];

  if (!active) {
    return <p className="text-sm text-neutral-500">No channels have been analyzed yet.</p>;
  }

  const charts = active.charts;
  const showStrengthsWeaknesses = active.id === "website";
  const hasData =
    charts &&
    ((showStrengthsWeaknesses && charts.strengthsWeaknesses.length) ||
      charts.opportunities?.length ||
      charts.actions.length);

  return (
    <>
      <div
        role="tablist"
        aria-label="Channel"
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5 scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        {channels.map((channel) => (
          <button
            key={channel.id}
            type="button"
            role="tab"
            aria-selected={channel.id === active.id}
            onClick={() => setSelected(channel.id)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${FOCUS_RING} ${
              channel.id === active.id ? "bg-[#5452F6] text-white" : "bg-[#EEF0FF] text-neutral-800 hover:bg-[#E3E6FF]"
            }`}
          >
            {channel.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" aria-label={active.label} className="space-y-4">
        {hasData ? (
          <AnalyticsChartsRow charts={charts} showStrengthsWeaknesses={showStrengthsWeaknesses} />
        ) : (
          <p className="text-sm text-neutral-500">
            No strengths or opportunities found for {active.label} yet.
          </p>
        )}
      </div>
    </>
  );
}



function SheetSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-busy="true">
      <div className="h-4 w-1/3 rounded bg-neutral-200" />
      <div className="space-y-2">
        <div className="h-3 rounded bg-neutral-100" />
        <div className="h-3 rounded bg-neutral-100" />
        <div className="h-3 w-2/3 rounded bg-neutral-100" />
      </div>
      <div className="h-4 w-1/4 rounded bg-neutral-200" />
      <div className="flex gap-2">
        <div className="h-6 w-20 rounded-full bg-neutral-100" />
        <div className="h-6 w-24 rounded-full bg-neutral-100" />
        <div className="h-6 w-16 rounded-full bg-neutral-100" />
      </div>
    </div>
  );
}

