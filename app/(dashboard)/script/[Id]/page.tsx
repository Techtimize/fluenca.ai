"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import ScriptJourney from "@/components/dashboard/script/ScriptJourney";
import { ScriptResultCard } from "@/components/dashboard/script/scriptresultcard";
import {
  findScriptResultById,
  normalizeScriptResults,
} from "@/components/dashboard/script/utils";
import ApiNotFoundCard from "@/components/notfound";
import TopBar from "@/components/dashboard/topBar";
import Card from "@/components/shared/card";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { getApiErrorMessage, isApiNotFoundError } from "@/errors/error-utils";
import { ScriptGenerationResultsByCompanyIdQuery } from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";
import { FOCUS_RING } from "@/utils/ui-classes";

export default function ScriptDetailPage() {
  const params = useParams<{ Id?: string }>();
  const scriptId = typeof params?.Id === "string" ? params.Id : "";
  const companyId = useAuthStore((s) => s.company_id);
  const companyName = useAuthStore((s) => s.company_name);

  const { data, isLoading, isError, error, refetch, isRefetching } =
    ScriptGenerationResultsByCompanyIdQuery(companyId);

  const items = normalizeScriptResults(data);
  const item = findScriptResultById(items, scriptId);
  const notFound = (isError && isApiNotFoundError(error)) || (!isLoading && !isError && !item);
  const showLoading = Boolean(companyId) && isLoading && !item;

  return (
    <main className="min-w-0 space-y-4 pb-4">
      <TopBar user={{ name: companyName || "User" }} placeholder="Search scripts..." />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={PAGE_ROUTES.SCRIPT}
          className={`inline-flex items-center gap-1.5 text-[13px] font-medium text-[#5B57E6] hover:underline ${FOCUS_RING}`}
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          All scripts
        </Link>
      </div>

      {!item ? (
        <ScriptJourney scriptCount={items.length} showCta={Boolean(companyId)} />
      ) : null}

      {showLoading ? (
        <Card className="flex items-center gap-3 p-6 text-neutral-500">
          <Loader2 className="size-5 animate-spin text-[#5B57E6]" />
          <div>
            <p className="text-sm font-medium text-neutral-800">
              Loading script details…
            </p>
            <p className="mt-0.5 text-[13px] text-neutral-500">
              Opening the production brief for this script.
            </p>
          </div>
        </Card>
      ) : null}

      {companyId && isError && !isApiNotFoundError(error) ? (
        <Card className="border-rose-200 bg-rose-50/80 p-4">
          <p className="text-sm text-rose-800">
            {getApiErrorMessage(error, "Failed to load script")}
          </p>
        </Card>
      ) : null}

      {companyId && notFound && !showLoading ? (
        <ApiNotFoundCard
          resource="scripts"
          title="Script not found"
          description="We couldn’t find this script. It may have been removed, or the link is outdated."
          onRetry={() => void refetch()}
          isRetrying={isRefetching}
          actionLabel="Back to scripts"
          actionHref={PAGE_ROUTES.SCRIPT}
        />
      ) : null}

      {companyId && item ? (
        <ScriptResultCard item={item} index={0} total={1} />
      ) : null}
    </main>
  );
}
