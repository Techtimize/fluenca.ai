"use client";

import { useMemo } from "react";
import { normalizeContentRecommendation } from "@/lib/dashboard/normalize-content-recommendation";
import { ContentRecommendationMutation } from "@/routes/bussiness/Bussiness-Mutation";
import type { ContentRecommendationResultResponse } from "@/types/bussiness/content-recommendation-type";
import CalendarSection from "./CalendarSection";
import { EmptyState } from "./Emptystate";
import IdeasSection from "./IdeasSection";
import {
  InstagramPerformanceSection,
  OpportunityScoresSection,
  TrendSignalsSection,
} from "./InsightSections";
import PlatformStrategySection from "./PlatformStrategySection";

type Props = {
  data?: ContentRecommendationResultResponse | null;
  companyId: string;
  empty?: boolean;
};

export default function ContentRecommendations({
  data,
  companyId,
  empty = false,
}: Props) {
  const { mutate: recommend, isPending } = ContentRecommendationMutation();

  const normalized = useMemo(
    () => normalizeContentRecommendation(data),
    [data],
  );

  const handleGenerate = () => {
    recommend({ company_id: companyId });
  };

  if (empty || !normalized.hasData) {
    return <EmptyState onGenerate={handleGenerate} isPending={isPending} />;
  }

  return (
    <div className="space-y-6">
      <PlatformStrategySection platforms={normalized.platforms} />
      <IdeasSection ideas={normalized.ideas} companyId={companyId} />
      <TrendSignalsSection signals={normalized.trendSignals} />
      <OpportunityScoresSection scores={normalized.opportunityScores} />
      <CalendarSection
        calendar={normalized.calendar}
        items={normalized.calendarItems}
        companyId={companyId}
      />
    </div>
  );
}
