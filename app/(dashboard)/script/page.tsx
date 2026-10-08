"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Library, Loader2 } from "lucide-react";
import ScriptEmptyState from "@/components/dashboard/script/ScriptEmptyState";
import ScriptJourney from "@/components/dashboard/script/ScriptJourney";
import ScriptList from "@/components/dashboard/script/ScriptList";
import {
  SCRIPT_PAGE_LIMIT,
  getScriptPaginationMeta,
  normalizeScriptResults,
} from "@/components/dashboard/script/utils";
import ApiNotFoundCard from "@/components/notfound";
import TopBar from "@/components/dashboard/topBar";
import Card from "@/components/shared/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getApiErrorMessage, isApiNotFoundError } from "@/errors/error-utils";
import { ScriptGenerationResultsByCompanyIdQuery } from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";
import { ScriptLibrarySkeleton } from "@/components/dashboard/script/scriptskelton";

export default function ScriptPage() {
  const companyId = useAuthStore((s) => s.company_id);
  const companyName = useAuthStore((s) => s.company_name);
  const [offset, setOffset] = useState(0);
  const limit = SCRIPT_PAGE_LIMIT;

  const { data, isLoading, isError, error, isFetching, refetch, isRefetching } =
    ScriptGenerationResultsByCompanyIdQuery(companyId, { limit, offset });

  const items = normalizeScriptResults(data);
  const pagination = getScriptPaginationMeta(data, items, { limit, offset });
  const hasResults = items.length > 0;
  const notFound = isError && isApiNotFoundError(error);
  const showLoading =
    Boolean(companyId) &&
    (isLoading || isFetching) &&
    !hasResults &&
    !notFound;

  const pageNumber = Math.floor(offset / limit) + 1;
  const totalPages =
    pagination.total !== null
      ? Math.max(1, Math.ceil(pagination.total / limit))
      : null;
  const libraryCount =
    pagination.total !== null ? pagination.total : items.length;

  return (
    <main className="min-w-0 space-y-5 pb-6">
      <TopBar
        user={{ name: companyName || "User" }}
        placeholder="Search scripts..."
      />
      <ScriptJourney
        scriptCount={hasResults ? libraryCount : 0}
        showCta={Boolean(companyId)}
      />
      {showLoading ? <ScriptLibrarySkeleton /> : null}
      {companyId && notFound ? (
        <ApiNotFoundCard
          resource="scripts"
          onRetry={() => void refetch()}
          isRetrying={isRefetching}
        />
      ) : null}

      {companyId && isError && !notFound ? (
        <Card className="border-rose-200 bg-rose-50/80 p-4">
          <p className="text-sm text-rose-800">
            {getApiErrorMessage(error, "Failed to load scripts")}
          </p>
        </Card>
      ) : null}

      {companyId && !isLoading && !isError && !hasResults && offset === 0 ? (
        <ScriptEmptyState />
      ) : null}

      {companyId && !isLoading && !isError && !hasResults && offset > 0 ? (
        <Card className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border-[#E6E8F5] p-5">
          <div>
            <p className="text-sm font-medium text-neutral-800">
              No scripts on this page
            </p>
            <p className="mt-0.5 text-[13px] text-neutral-500">
              Jump back to an earlier page to keep browsing.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-full"
            onClick={() => setOffset((prev) => Math.max(0, prev - limit))}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            Previous
          </Button>
        </Card>
      ) : null}

      {companyId && hasResults ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3 rounded-[22px] border border-[#E6E8F5] bg-[linear-gradient(135deg,#FBFBFF_0%,#FFFFFF_70%)] px-4 py-3.5 sm:px-5">
            <div className="flex min-w-0 items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#ECEBFF] text-[#5B57E6]">
                <Library className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-[15px] font-semibold tracking-tight text-neutral-900">
                    Generated scripts
                  </h2>
                  <span className="rounded-full bg-[#ECEBFF] px-2 py-0.5 text-[11px] font-semibold tabular-nums text-[#5B57E6]">
                    {libraryCount}
                  </span>
                </div>
                <p className="mt-0.5 text-[13px] text-neutral-500">
                  Open a script to review the brief, copy, cast, and scene
                  breakdown.
                </p>
              </div>
            </div>
            {isFetching && !isLoading ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[12px] text-neutral-500 ring-1 ring-[#E6E8F5]">
                <Loader2
                  className="size-3.5 animate-spin text-[#5B57E6]"
                  aria-hidden="true"
                />
                Updating…
              </span>
            ) : null}
          </div>

          <ScriptList items={items} />

          {pagination.hasPrevious || pagination.hasNext ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-[#E6E8F5] bg-white px-4 py-3.5 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
              <div>
                <p className="text-[13px] font-medium tabular-nums text-neutral-800">
                  {totalPages !== null
                    ? `Page ${pageNumber} of ${totalPages}`
                    : `Page ${pageNumber}`}
                </p>
                {pagination.total !== null ? (
                  <p className="mt-0.5 text-[12px] text-neutral-500">
                    {pagination.total} script
                    {pagination.total === 1 ? "" : "s"} in your library
                  </p>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-full px-3.5"
                  disabled={!pagination.hasPrevious || isFetching}
                  onClick={() =>
                    setOffset((prev) => Math.max(0, prev - limit))
                  }
                >
                  <ChevronLeft className="size-4" aria-hidden="true" />
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-full px-3.5"
                  disabled={!pagination.hasNext || isFetching}
                  onClick={() => setOffset((prev) => prev + limit)}
                >
                  Next
                  <ChevronRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
    </main>
  );
}
