"use client";

import { CompetitorsAIInsights } from "@/components/dashboard/competitors/CompetitorsAIInsights";
import { CompetitorsChartCard } from "@/components/dashboard/competitors/CompetitorsChartCard";
import { CompetitorsDetailTable } from "@/components/dashboard/competitors/CompetitorsDetailTable";
import { CompetitorsDonutChart } from "@/components/dashboard/competitors/CompetitorsDonutChart";
import { CompetitorsHashtagList } from "@/components/dashboard/competitors/CompetitorsHashtagList";
import { CompetitorsHeader } from "@/components/dashboard/competitors/CompetitorsHeader";
import { CompetitorsTopTable } from "@/components/dashboard/competitors/CompetitorsTopTable";
import { CompetitorsTrendingTopics } from "@/components/dashboard/competitors/CompetitorsTrendingTopics";
import { StatCardGrid } from "@/components/ui/StatCard";
import type { CompetitorsPageData } from "@/types/bussiness/dashboard";
import type { CompetitorListItem } from "@/types/bussiness/competitoranalysis-type";

interface CompetitorsViewProps {
  data: CompetitorsPageData;
  competitorDetails?: CompetitorListItem[];
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function CompetitorsView({
  data,
  competitorDetails = [],
  onRefresh,
  isRefreshing,
}: CompetitorsViewProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <CompetitorsHeader
          title="Competitor analysis"
          subtitle={data.company.subtitle}
          lastUpdated={data.lastUpdated}
        />
        {onRefresh ? (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="rounded-full border border-[#E6E8F5] bg-white px-4 py-2 text-[13px] font-medium text-neutral-700 hover:bg-[#F8F9FF] disabled:opacity-50"
          >
            {isRefreshing ? "Refreshing…" : "Refresh data"}
          </button>
        ) : null}
      </div>

      <StatCardGrid metrics={data.stats} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <CompetitorsTopTable competitors={data.topCompetitors} />
        </div>
        <CompetitorsAIInsights insights={data.aiInsights} />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <CompetitorsChartCard
          title="Content type distribution"
          description="Format mix across competitor posts"
        >
          <CompetitorsDonutChart segments={data.contentTypes} centerLabel="Formats" />
        </CompetitorsChartCard>
        <CompetitorsChartCard
          title="Content theme distribution"
          description="Dominant themes in the competitive set"
        >
          <CompetitorsDonutChart segments={data.contentThemes} centerLabel="Themes" />
        </CompetitorsChartCard>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <CompetitorsHashtagList items={data.hashtags} />
        <CompetitorsTrendingTopics topics={data.trendingTopics} />
      </div>

      <CompetitorsDetailTable competitors={competitorDetails} />
    </div>
  );
}
