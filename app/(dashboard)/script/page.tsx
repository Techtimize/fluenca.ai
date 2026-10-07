"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
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
import { getApiErrorMessage, isApiNotFoundError } from "@/errors/error-utils";
import { ScriptGenerationResultsByCompanyIdQuery } from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";

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

  return (
    <main className="min-w-0 space-y-4 pb-4">
      <TopBar user={{ name: companyName || "User" }} placeholder="Search scripts..." />

      <ScriptJourney scriptCount={items.length} showCta={Boolean(companyId)} />

      {!companyId ? (
        <Card className="border-amber-200 bg-amber-50/80 p-4">
          <p className="text-sm text-amber-800">
            Company ID is missing. Complete company analysis first, then return
            here.
          </p>
        </Card>
      ) : null}

      {showLoading ? (
        <Card className="flex items-center gap-3 p-6 text-neutral-500">
          <Loader2 className="size-5 animate-spin text-[#5B57E6]" />
          <div>
            <p className="text-sm font-medium text-neutral-800">
              Loading your scripts…
            </p>
            <p className="mt-0.5 text-[13px] text-neutral-500">
              Pulling generated stories, scenes, and characters.
            </p>
          </div>
        </Card>
      ) : null}

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
        <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
          <p className="text-sm text-neutral-600">No scripts on this page.</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOffset((prev) => Math.max(0, prev - limit))}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            Previous
          </Button>
        </Card>
      ) : null}

      {companyId && hasResults ? (
        <section className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-3 px-1">
            <div>
              <h2 className="text-[15px] font-semibold text-neutral-900">
                Generated scripts
              </h2>
              <p className="mt-0.5 text-[13px] text-neutral-500">
                Open a script to review the brief, copy, cast, and scene breakdown.
              </p>
            </div>
            {isFetching && !isLoading ? (
              <span className="inline-flex items-center gap-1.5 text-[12px] text-neutral-400">
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                Updating…
              </span>
            ) : null}
          </div>
          <ScriptList items={items} />
          {pagination.hasPrevious || pagination.hasNext ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-[#E6E8F5] bg-white px-4 py-3">
              <p className="text-[13px] text-neutral-500">
                {totalPages !== null
                  ? `Page ${pageNumber} of ${totalPages}`
                  : `Page ${pageNumber}`}
                {pagination.total !== null
                  ? ` · ${pagination.total} script${pagination.total === 1 ? "" : "s"}`
                  : null}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
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
