"use client";

import { useMemo, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import CompetitiveBriefResults from "@/components/dashboard/competitors/CompetitiveBriefResults";
import CompetitorVersionSelect from "@/components/dashboard/competitors/CompetitorVersionSelect";
import {
  asCompetitorsListResponse,
  LATEST_VERSION_VALUE,
  normalizeCompetitorVersions,
} from "@/components/dashboard/competitors/versionUtils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getApiErrorMessage, isApiNotFoundError } from "@/errors/error-utils";
import { CompetitorAnalysisAiMutation } from "@/routes/bussiness/Bussiness-Mutation";
import {
  CompetitorAnalysisAiLatestResponseQuery,
  CompetitorAnalysisAiSpecificVersionsQuery,
  CompetitorAnalysisAiVersionsQuery,
} from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";

export default function CompetitorAnalysisAiPage() {
  const companyId = useAuthStore((s) => s.company_id);
  const [selectedVersion, setSelectedVersion] = useState(LATEST_VERSION_VALUE);

  const {
    data: versionsData,
    isLoading: isVersionsLoading,
    refetch: refetchVersions,
  } = CompetitorAnalysisAiVersionsQuery(companyId);

  const {
    data: latestData,
    isLoading: isLatestLoading,
    isError: isLatestError,
    error: latestError,
    refetch: refetchLatest,
    isRefetching: isLatestRefetching,
  } = CompetitorAnalysisAiLatestResponseQuery(companyId);

  const specificVersion =
    selectedVersion !== LATEST_VERSION_VALUE ? selectedVersion : "";

  const {
    data: specificData,
    isLoading: isSpecificLoading,
    isError: isSpecificError,
    error: specificError,
    refetch: refetchSpecific,
    isRefetching: isSpecificRefetching,
  } = CompetitorAnalysisAiSpecificVersionsQuery(companyId, specificVersion);

  const { mutate: runAiAnalysis, isPending } = CompetitorAnalysisAiMutation();
  const versions = useMemo(
    () => normalizeCompetitorVersions(versionsData),
    [versionsData],
  );

  const usingLatest = selectedVersion === LATEST_VERSION_VALUE;
  const competitorResults = asCompetitorsListResponse(
    usingLatest ? latestData : specificData,
  );
  const isLoading = usingLatest ? isLatestLoading : isSpecificLoading;
  const isError = usingLatest ? isLatestError : isSpecificError;
  const error = usingLatest ? latestError : specificError;
  const isRefetching = usingLatest ? isLatestRefetching : isSpecificRefetching;
  const notFound = isError && isApiNotFoundError(error);

  const handleRun = () => {
    if (!companyId) return;
    runAiAnalysis(companyId, {
      onSuccess: () => {
        setSelectedVersion(LATEST_VERSION_VALUE);
        void refetchVersions();
        void refetchLatest();
      },
    });
  };

  const handleRetry = () => {
    void refetchVersions();
    if (usingLatest) void refetchLatest();
    else void refetchSpecific();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-[16px] font-semibold tracking-tight text-neutral-900">
            AI competitor analysis
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Discover peers, gaps, and recommended moves from your latest brief.
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-2 sm:justify-end">
          <CompetitorVersionSelect
            value={selectedVersion}
            onChange={setSelectedVersion}
            versions={versions}
            isLoading={isVersionsLoading}
            disabled={!companyId}
          />
          <TooltipProvider delay={200}>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    onClick={handleRun}
                    disabled={!companyId || isPending}
                    aria-label="Run AI analysis"
                    className="size-10 shrink-0 rounded-full bg-[#5B57E6] p-0 text-white hover:bg-[#4A46D0]"
                  />
                }
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4 animate-sparkle-glow" />
                )}
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                sideOffset={8}
                className="max-w-[240px] text-center leading-relaxed"
              >
                {isPending
                  ? "AI analysis is running. This may take a minute."
                  : "Run AI analysis to discover competitors, spot gaps, and get recommended next moves for your brand."}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <CompetitiveBriefResults
        data={competitorResults}
        isLoading={Boolean(companyId) && isLoading && !competitorResults}
        isError={isError && !notFound}
        isNotFound={notFound}
        errorMessage={
          isError && !notFound
            ? getApiErrorMessage(error, "Failed to load AI competitor analysis")
            : undefined
        }
        onRetry={handleRetry}
        isRetrying={isRefetching || isPending}
        onRunAnalysis={handleRun}
      />
    </div>
  );
}
