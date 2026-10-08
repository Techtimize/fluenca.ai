"use client";

import { useMemo, useState } from "react";
import { AtSign, Globe, Link2, Loader2, Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import CompetitorVersionSelect from "@/components/dashboard/competitors/CompetitorVersionSelect";
import {
  asCompetitorsListResponse,
  LATEST_VERSION_VALUE,
  normalizeCompetitorVersions,
} from "@/components/dashboard/competitors/versionUtils";
import Card from "@/components/shared/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage, isApiNotFoundError } from "@/errors/error-utils";
import { CompetitorAnalysisManualMutation } from "@/routes/bussiness/Bussiness-Mutation";
import {
  CompetitorAnalysisManualLatestResponseQuery,
  CompetitorAnalysisManualSpecificVersionsQuery,
  CompetitorAnalysisManualVersionsQuery,
} from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";
import { FOCUS_RING } from "@/utils/ui-classes";
import ManualCompetitorResults from "@/components/dashboard/competitors/CompetitorResults";

type CompetitorRow = {
  id: string;
  instagram: string;
  linkedin: string;
  website: string;
};

function createEmptyRow(): CompetitorRow {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `row-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    instagram: "",
    linkedin: "",
    website: "",
  };
}

function normalizeInstagram(value: string) {
  const trimmed = value.trim().replace(/^@+/, "");
  if (!trimmed) return "";
  return `@${trimmed}`;
}

function normalizeLinkedIn(value: string) {
  return value.trim();
}

function normalizeWebsite(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function isLikelyLinkedIn(value: string) {
  return /linkedin\.com/i.test(value);
}

function isLikelyWebsite(value: string) {
  try {
    const url = new URL(value);
    return Boolean(url.hostname.includes("."));
  } catch {
    return false;
  }
}

function collectCompetitorValues(rows: CompetitorRow[]) {
  const values: string[] = [];
  const seen = new Set<string>();

  for (const row of rows) {
    const entries: Array<{ kind: "instagram" | "linkedin" | "website"; value: string }> = [
      { kind: "instagram", value: normalizeInstagram(row.instagram) },
      { kind: "linkedin", value: normalizeLinkedIn(row.linkedin) },
      { kind: "website", value: normalizeWebsite(row.website) },
    ];

    for (const entry of entries) {
      if (!entry.value) continue;

      if (entry.kind === "linkedin" && !isLikelyLinkedIn(entry.value)) {
        return {
          values: [] as string[],
          error: "Enter a valid LinkedIn URL (linkedin.com/…)",
        };
      }

      if (entry.kind === "website" && !isLikelyWebsite(entry.value)) {
        return {
          values: [] as string[],
          error: "Enter a valid website URL",
        };
      }

      const key = entry.value.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      values.push(entry.value);
    }
  }

  return { values, error: null as string | null };
}

export default function CompetitorAnalysisManualPage() {
  const companyId = useAuthStore((s) => s.company_id);
  const [selectedVersion, setSelectedVersion] = useState(LATEST_VERSION_VALUE);
  const [rows, setRows] = useState<CompetitorRow[]>(() => [createEmptyRow()]);

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

  const filledFieldCount = useMemo(
    () =>
      rows.reduce((count, row) => {
        return (
          count +
          [row.instagram, row.linkedin, row.website].filter((value) => value.trim()).length
        );
      }, 0),
    [rows],
  );

  const updateRow = (
    id: string,
    field: "instagram" | "linkedin" | "website",
    value: string,
  ) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const addRow = () => {
    setRows((prev) => [...prev, createEmptyRow()]);
  };

  const removeRow = (id: string) => {
    setRows((prev) => {
      if (prev.length <= 1) {
        return [createEmptyRow()];
      }
      return prev.filter((row) => row.id !== id);
    });
  };

  const handleRun = () => {
    if (!companyId) return;

    const { values, error: validationError } = collectCompetitorValues(rows);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    if (!values.length) {
      toast.error(
        "Fill at least one Instagram username, LinkedIn URL, or website",
      );
      return;
    }

    runManualAnalysis(
      {
        company_id: companyId,
        competitors: values,
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
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-[16px] font-semibold text-neutral-900">
            Manual competitor analysis
          </h2>
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
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-[15px] font-semibold text-neutral-900">
              Add competitors
            </h3>
            <p className="mt-1 text-[13px] text-neutral-500">
              Each row is one competitor. Fill Instagram, LinkedIn, and/or website,
              then use + to add another.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={addRow}
            className="h-10 shrink-0 gap-1.5 rounded-full px-4"
          >
            <Plus className="size-4" />
            Add competitor
          </Button>
        </div>

        <div className="mt-4 space-y-3">
          {rows.map((row, index) => (
            <div
              key={row.id}
              className="rounded-2xl border border-[#E6E8F5] bg-[#FBFBFF] p-3.5 sm:p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
                  Competitor {String(index + 1).padStart(2, "0")}
                </p>
                <button
                  type="button"
                  aria-label={`Remove competitor ${index + 1}`}
                  onClick={() => removeRow(row.id)}
                  disabled={rows.length === 1 && filledFieldCount === 0}
                  className={`inline-flex size-8 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-white hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS_RING}`}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>

              <div className="grid gap-3 lg:grid-cols-3">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                    <AtSign className="size-4 text-[#5B57E6]" />
                    Instagram username
                  </label>
                  <Input
                    value={row.instagram}
                    onChange={(e) => updateRow(row.id, "instagram", e.target.value)}
                    placeholder="@username"
                    className="h-11 rounded-full border-[#E6E8F5] bg-white px-4"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                    <Link2 className="size-4 text-[#5B57E6]" />
                    LinkedIn URL
                  </label>
                  <Input
                    value={row.linkedin}
                    onChange={(e) => updateRow(row.id, "linkedin", e.target.value)}
                    placeholder="https://www.linkedin.com/company/…"
                    className="h-11 rounded-full border-[#E6E8F5] bg-white px-4"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                    <Globe className="size-4 text-[#5B57E6]" />
                    Website URL
                  </label>
                  <Input
                    value={row.website}
                    onChange={(e) => updateRow(row.id, "website", e.target.value)}
                    placeholder="https://www.example.com"
                    className="h-11 rounded-full border-[#E6E8F5] bg-white px-4"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={addRow}
            className="h-10 gap-1.5 rounded-full px-3 text-[#5B57E6] hover:bg-[#ECEBFF] hover:text-[#4A46D0]"
          >
            <Plus className="size-4" />
            Add another competitor
          </Button>

          <Button
            type="button"
            onClick={handleRun}
            disabled={!companyId || isPending || filledFieldCount === 0}
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

      <ManualCompetitorResults
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
    </div>
  );
}
