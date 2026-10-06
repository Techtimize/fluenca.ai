"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { normalizeContentRecommendation } from "@/lib/dashboard/normalize-content-recommendation";
import { ContentRecommendationMutation } from "@/routes/bussiness/Bussiness-Mutation";
import type { ContentRecommendationResultResponse } from "@/types/bussiness/content-recommendation-type";
import CalendarSection from "./CalendarSection";
import { EmptyState } from "./Emptystate";
import IdeasSection from "./IdeasSection";
import PlatformStrategySection from "./PlatformStrategySection";
import StrategySection from "./StrategySection";
import SharedCard from "@/components/shared/card";

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
    if (!companyId) {
      toast.error("Company ID is missing. Please log in again.");
      return;
    }
    recommend({ company_id: companyId });
  };

  if (empty || !normalized.hasData) {
    return <EmptyState onGenerate={handleGenerate} isPending={isPending} />;
  }

  return (
    <div className="space-y-3">
      <PlatformStrategySection platforms={normalized.platforms} />
      <IdeasSection ideas={normalized.ideas} companyId={companyId} />
    </div>
  );
}
