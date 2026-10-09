"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarDays, Loader2, Sparkles } from "lucide-react";
import PlannerCalendar from "@/components/dashboard/calendar/PlannerCalendar";
import {
  buildPlannerEvents,
  getPlannerSummary,
  LATEST_PLANNER_VERSION,
  normalizePlannerVersions,
  unwrapPlannerResult,
} from "@/components/dashboard/calendar/plannerUtils";
import { AgentModeToggle } from "@/components/dashboard/content-execution/AgentModeToggle";
import TopBar from "@/components/dashboard/topBar";
import ApiNotFoundCard from "@/components/notfound";
import Card from "@/components/shared/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { getApiErrorMessage, isApiNotFoundError } from "@/errors/error-utils";
import {
  PlannerResultsQuery,
  PlannerSpecificVersionsQuery,
  PlannerVersionsQuery,
} from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";
import { FOCUS_RING } from "@/utils/ui-classes";

export default function CalendarPage() {
  const companyId = useAuthStore((s) => s.company_id);
  const companyName = useAuthStore((s) => s.company_name);
  const [selectedVersion, setSelectedVersion] = useState(LATEST_PLANNER_VERSION);

  const {
    data: versionsData,
    isLoading: isVersionsLoading,
  } = PlannerVersionsQuery(companyId);

  const {
    data: latestData,
    isLoading: isLatestLoading,
    isError: isLatestError,
    error: latestError,
    isFetching: isLatestFetching,
    refetch: refetchLatest,
    isRefetching: isLatestRefetching,
  } = PlannerResultsQuery(companyId);

  const specificVersion =
    selectedVersion !== LATEST_PLANNER_VERSION ? selectedVersion : "";

  const {
    data: specificData,
    isLoading: isSpecificLoading,
    isError: isSpecificError,
    error: specificError,
    isFetching: isSpecificFetching,
    refetch: refetchSpecific,
    isRefetching: isSpecificRefetching,
  } = PlannerSpecificVersionsQuery(companyId, specificVersion);

  const versions = useMemo(
    () => normalizePlannerVersions(versionsData),
    [versionsData],
  );

  const usingLatest = selectedVersion === LATEST_PLANNER_VERSION;
  const rawData = usingLatest ? latestData : specificData;
  const planner = unwrapPlannerResult(rawData);
  // No useMemo: React Compiler memoizes this, and a manual one can't be preserved here.
  const events = buildPlannerEvents(planner);
  const summary = getPlannerSummary(planner);
  const hasPlan = events.length > 0;

  const isLoading = usingLatest ? isLatestLoading : isSpecificLoading;
  const isFetching = usingLatest ? isLatestFetching : isSpecificFetching;
  const isError = usingLatest ? isLatestError : isSpecificError;
  const error = usingLatest ? latestError : specificError;
  const isRefetching = usingLatest ? isLatestRefetching : isSpecificRefetching;
  const notFound = isError && isApiNotFoundError(error);

  const versionSelect = (
    <Select
      value={selectedVersion}
      onValueChange={(value) => {
        if (typeof value === "string") setSelectedVersion(value);
      }}
      disabled={!companyId || isVersionsLoading}
    >
      <SelectTrigger className="h-8 w-[180px] rounded-full border-[#E6E8F5] bg-white px-3 text-[12px]">
        <SelectValue
          placeholder={isVersionsLoading ? "Loading…" : "Version"}
        />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectGroup>
          <SelectItem value={LATEST_PLANNER_VERSION}>Latest version</SelectItem>
          {versions.map((item) => (
            <SelectItem key={item.version} value={item.version}>
              {item.label}
              {item.created_at
                ? ` · ${new Date(item.created_at).toLocaleDateString()}`
                : ""}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );

  return (
    <main className="min-w-0 space-y-4 pb-4">
      <TopBar user={{ name: companyName || "User" }} placeholder="Search calendar..." />

      {companyId ? (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-neutral-900">Calendar</h1>
            <p className="mt-1 text-[13px] text-neutral-500">
              Turn on agent mode to let Fluenca run today’s planned posts.
            </p>
          </div>
          <AgentModeToggle className="w-full max-w-md sm:w-auto sm:min-w-[320px]" />
        </div>
      ) : null}

      {companyId && (isLoading || isFetching) && !hasPlan && !notFound ? (
        <Card className="flex items-center justify-center gap-3 p-12 text-neutral-500">
          <Loader2 className="size-5 animate-spin text-[#5B57E6]" />
          <span className="text-sm">Loading planner calendar…</span>
        </Card>
      ) : null}

      {companyId && notFound ? (
        <ApiNotFoundCard
          resource="calendar"
          onRetry={() => {
            if (usingLatest) void refetchLatest();
            else void refetchSpecific();
          }}
          isRetrying={isRefetching}
          actionLabel="Open content recommendations"
          actionHref={PAGE_ROUTES.CONTENT_RECOMMENDATION}
        />
      ) : null}

      {companyId && isError && !notFound ? (
        <Card className="border-rose-200 bg-rose-50/80 p-5">
          <p className="text-sm text-rose-800">
            {getApiErrorMessage(error, "Failed to load planner results")}
          </p>
        </Card>
      ) : null}

      {companyId && !isError && hasPlan && planner ? (
        <PlannerCalendar data={planner} versionSelect={versionSelect} />
      ) : null}

      {companyId && !isLoading && !isFetching && !isError && !hasPlan ? (
        <Card className="relative overflow-hidden p-0">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#ECEBFF_0%,transparent_55%)]"
          />
          <div className="relative mx-auto flex max-w-lg flex-col items-center px-6 py-14 text-center sm:py-16">
            <span className="grid size-14 place-items-center rounded-3xl bg-[#ECEBFF] text-[#5B57E6] shadow-[0_8px_24px_rgba(91,87,230,0.18)]">
              <CalendarDays className="size-6" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-lg font-semibold text-neutral-900">No planner results yet</h2>
            <p className="mt-2 text-[14px] leading-6 text-neutral-500">
              Run intelligence to generate a planner schedule, then return here to view it on the
              calendar.
            </p>
            <Link
              href={PAGE_ROUTES.DNA}
              className={`mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#5B57E6] px-5 text-sm font-medium text-white hover:bg-[#4A46D0] ${FOCUS_RING}`}
            >
              <Sparkles className="size-4" />
              Start intelligence run
            </Link>
          </div>
        </Card>
      ) : null}
    </main>
  );
}
