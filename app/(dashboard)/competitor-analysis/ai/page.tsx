"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import CompetitorResults from "@/components/dashboard/competitors/CompetitorResults";
import CompetitorVersionSelect from "@/components/dashboard/competitors/CompetitorVersionSelect";
import {
  asCompetitorsListResponse,
  LATEST_VERSION_VALUE,
  normalizeCompetitorVersions,
} from "@/components/dashboard/competitors/versionUtils";
import TopBar from "@/components/dashboard/topBar";
import Card from "@/components/shared/card";
import { Button } from "@/components/ui/button";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { getApiErrorMessage, isApiNotFoundError } from "@/errors/error-utils";
import { CompetitorAnalysisAiMutation } from "@/routes/bussiness/Bussiness-Mutation";
import {
  CompetitorAnalysisAiLatestResponseQuery,
  CompetitorAnalysisAiSpecificVersionsQuery,
  CompetitorAnalysisAiVersionsQuery,
} from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";
import { FOCUS_RING } from "@/utils/ui-classes";

export default function CompetitorAnalysisAiPage() {
  const companyId = useAuthStore((s) => s.company_id);
  const companyName = useAuthStore((s) => s.company_name);
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
    <main className="min-w-0 space-y-4 pb-4">
      <TopBar user={{ name: companyName || "User" }} placeholder="Search AI competitors..." />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href={PAGE_ROUTES.COMPETITOR_ANALYSIS}
            className={`mb-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#5B57E6] hover:underline ${FOCUS_RING}`}
          >
            <ArrowLeft className="size-3.5" />
            All modes
          </Link>
          <h1 className="text-xl font-semibold text-neutral-900">AI competitor analysis</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Run AI discovery and browse previous analysis versions.
          </p>
        </div>

        <CompetitorVersionSelect
          value={selectedVersion}
          onChange={setSelectedVersion}
          versions={versions}
          isLoading={isVersionsLoading}
          disabled={!companyId}
        />
      </div>

      {!companyId ? (
        <Card className="border-amber-200 bg-amber-50/80 p-5">
          <p className="text-sm text-amber-800">
            Company ID is missing. Complete company analysis first, then return here.
          </p>
        </Card>
      ) : null}

      <Card className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-[#ECEBFF] text-[#5B57E6]">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-[15px] font-semibold text-neutral-900">Run AI discovery</h3>
              <p className="mt-1 text-[13px] leading-5 text-neutral-500">
                Auto-discover competitors from your company profile using AI mode.
              </p>
            </div>
          </div>
          <Button
            type="button"
            onClick={handleRun}
            disabled={!companyId || isPending}
            className="h-11 shrink-0 gap-2 rounded-full bg-[#5B57E6] px-5 text-white hover:bg-[#4A46D0]"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Running…
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Run competitor analysis
              </>
            )}
          </Button>
        </div>
      </Card>

      <CompetitorResults
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
    </main>
  );
}
