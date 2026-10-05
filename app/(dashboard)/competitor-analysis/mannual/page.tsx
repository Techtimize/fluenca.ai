"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, AtSign, Link2, Loader2, Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { getApiErrorMessage, isApiNotFoundError } from "@/errors/error-utils";
import { CompetitorAnalysisManualMutation } from "@/routes/bussiness/Bussiness-Mutation";
import {
  CompetitorAnalysisManualLatestResponseQuery,
  CompetitorAnalysisManualSpecificVersionsQuery,
  CompetitorAnalysisManualVersionsQuery,
} from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";
import { FOCUS_RING } from "@/utils/ui-classes";

function normalizeInstagram(value: string) {
  const trimmed = value.trim().replace(/^@+/, "");
  if (!trimmed) return "";
  return `@${trimmed}`;
}

function normalizeLinkedIn(value: string) {
  return value.trim();
}

function isLikelyLinkedIn(value: string) {
  return /linkedin\.com/i.test(value) || value.startsWith("http");
}

export default function CompetitorAnalysisManualPage() {
  const companyId = useAuthStore((s) => s.company_id);
  const companyName = useAuthStore((s) => s.company_name);
  const [selectedVersion, setSelectedVersion] = useState(LATEST_VERSION_VALUE);
  const [instagramInput, setInstagramInput] = useState("");
  const [linkedinInput, setLinkedinInput] = useState("");
  const [competitors, setCompetitors] = useState<string[]>([]);

  const {
    data: versionsData,
    isLoading: isVersionsLoading,
    refetch: refetchVersions,
  } = CompetitorAnalysisManualVersionsQuery(companyId);

  const {
    data: latestData,
    isLoading: isLatestLoading,
    isError: isLatestError,
    error: latestError,
    refetch: refetchLatest,
    isRefetching: isLatestRefetching,
  } = CompetitorAnalysisManualLatestResponseQuery(companyId);

  const specificVersion =
    selectedVersion !== LATEST_VERSION_VALUE ? selectedVersion : "";

  const {
    data: specificData,
    isLoading: isSpecificLoading,
    isError: isSpecificError,
    error: specificError,
    refetch: refetchSpecific,
    isRefetching: isSpecificRefetching,
  } = CompetitorAnalysisManualSpecificVersionsQuery(companyId, specificVersion);

  const { mutate: runManualAnalysis, isPending } = CompetitorAnalysisManualMutation();

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

  const addCompetitor = (raw: string, kind: "instagram" | "linkedin") => {
    const value =
      kind === "instagram" ? normalizeInstagram(raw) : normalizeLinkedIn(raw);

    if (!value) {
      toast.error(
        kind === "instagram"
          ? "Enter an Instagram username"
          : "Enter a LinkedIn URL",
      );
      return;
    }

    if (kind === "linkedin" && !isLikelyLinkedIn(value)) {
      toast.error("Enter a valid LinkedIn URL");
      return;
    }

    if (competitors.some((item) => item.toLowerCase() === value.toLowerCase())) {
      toast.error("This competitor is already added");
      return;
    }

    setCompetitors((prev) => [...prev, value]);
    if (kind === "instagram") setInstagramInput("");
    else setLinkedinInput("");
  };

  const removeCompetitor = (value: string) => {
    setCompetitors((prev) => prev.filter((item) => item !== value));
  };

  const handleRun = () => {
    if (!companyId) return;
    if (!competitors.length) {
      toast.error("Add at least one Instagram username or LinkedIn URL");
      return;
    }

    runManualAnalysis(
      {
        company_id: companyId,
        competitors,
      },
      {
        onSuccess: () => {
          setSelectedVersion(LATEST_VERSION_VALUE);
          void refetchVersions();
          void refetchLatest();
        },
      },
    );
  };

  const handleRetry = () => {
    void refetchVersions();
    if (usingLatest) void refetchLatest();
    else void refetchSpecific();
  };

  return (
    <main className="min-w-0 space-y-4 pb-4">
      <TopBar user={{ name: companyName || "User" }} placeholder="Search manual competitors..." />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href={PAGE_ROUTES.COMPETITOR_ANALYSIS}
            className={`mb-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#5B57E6] hover:underline ${FOCUS_RING}`}
          >
            <ArrowLeft className="size-3.5" />
            All modes
          </Link>
          <h1 className="text-xl font-semibold text-neutral-900">Manual competitor analysis</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Add competitors yourself and browse previous manual analysis versions.
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
        <h3 className="text-[15px] font-semibold text-neutral-900">Add competitors</h3>
        <p className="mt-1 text-[13px] text-neutral-500">
          Provide Instagram usernames and LinkedIn company URLs, then run analysis.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
              <AtSign className="size-4 text-[#5B57E6]" />
              Instagram username
            </label>
            <div className="flex gap-2">
              <Input
                value={instagramInput}
                onChange={(e) => setInstagramInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCompetitor(instagramInput, "instagram");
                  }
                }}
                placeholder="@confiz"
                className="h-11 rounded-full border-[#E6E8F5] bg-white px-4"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addCompetitor(instagramInput, "instagram")}
                className="h-11 shrink-0 rounded-full px-4"
              >
                <Plus className="size-4" />
                Add
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
              <Link2 className="size-4 text-[#5B57E6]" />
              LinkedIn URL
            </label>
            <div className="flex gap-2">
              <Input
                value={linkedinInput}
                onChange={(e) => setLinkedinInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCompetitor(linkedinInput, "linkedin");
                  }
                }}
                placeholder="https://www.linkedin.com/company/systems-limited/"
                className="h-11 rounded-full border-[#E6E8F5] bg-white px-4"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addCompetitor(linkedinInput, "linkedin")}
                className="h-11 shrink-0 rounded-full px-4"
              >
                <Plus className="size-4" />
                Add
              </Button>
            </div>
          </div>
        </div>

        {competitors.length ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {competitors.map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-2 rounded-full border border-[#E6E8F5] bg-[#F8F9FF] px-3 py-1.5 text-[13px] text-neutral-700"
              >
                <span className="max-w-[240px] truncate">{item}</span>
                <button
                  type="button"
                  aria-label={`Remove ${item}`}
                  onClick={() => removeCompetitor(item)}
                  className={`rounded-full p-0.5 text-neutral-500 hover:bg-white hover:text-rose-600 ${FOCUS_RING}`}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-[13px] text-neutral-500">
            No competitors added yet. Example: @confiz or a LinkedIn company URL.
          </p>
        )}

        <div className="mt-5 flex justify-end">
          <Button
            type="button"
            onClick={handleRun}
            disabled={!companyId || isPending || competitors.length === 0}
            className="h-11 gap-2 rounded-full bg-[#5B57E6] px-5 text-white hover:bg-[#4A46D0]"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Running…
              </>
            ) : (
              <>
                <Users className="size-4" />
                Run manual analysis
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
            ? getApiErrorMessage(error, "Failed to load manual competitor analysis")
            : undefined
        }
        onRetry={handleRetry}
        isRetrying={isRefetching || isPending}
        onRunAnalysis={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />
    </main>
  );
}
