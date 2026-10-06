"use client";

import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import ContentRecommendations from "@/components/dashboard/contentrecommendation/contentRecommendations";
import TopBar from "@/components/dashboard/topBar";
import ApiNotFoundCard from "@/components/notfound";
import Card from "@/components/shared/card";
import { getApiErrorMessage, isApiNotFoundError } from "@/errors/error-utils";
import { normalizeContentRecommendation } from "@/lib/dashboard/normalize-content-recommendation";
import { ContentRecommendationMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { ContentRecommendationResultQuery } from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";
import { FOCUS_RING } from "@/utils/ui-classes";

export default function ContentRecommendationPage() {
  const companyId = useAuthStore((s) => s.company_id);
  const companyName = useAuthStore((s) => s.company_name);
  const { data, isLoading, isError, error, refetch, isRefetching } =
    ContentRecommendationResultQuery(companyId);
  const { mutate: recommend, isPending } = ContentRecommendationMutation();

  const normalized = normalizeContentRecommendation(data);
  const hasPayload = normalized.hasData;
  const notFound = isError && isApiNotFoundError(error);

  const handleGenerate = () => {
    if (!companyId) {
      toast.error("Company ID is missing. Please log in again.");
      return;
    }
    recommend({ company_id: companyId });
  };

  return (
    <main className="min-w-0 space-y-3 pb-4">
      <TopBar
        user={{ name: companyName || "User" }}
        placeholder="Search recommendations..."
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">
            Content recommendations
          </h1>
          <p className="text-[13px] text-neutral-500">
            AI-generated ideas, themes, and post plans for your brand.
          </p>
        </div>

        {companyId ? (
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isPending}
            className={`inline-flex h-9 items-center gap-2 rounded-full bg-[#5B57E6] px-3.5 text-sm font-medium text-white hover:bg-[#4A46D0] disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS_RING}`}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {isPending ? "Generating…" : hasPayload ? "Regenerate" : "Generate"}
          </button>
        ) : null}
      </div>
      {companyId && isLoading ? (
        <Card className="flex items-center gap-3 p-4">
          <Loader2 className="size-4 animate-spin text-[#5B57E6]" />
          <p className="text-sm text-neutral-600">Loading recommendations…</p>
        </Card>
      ) : null}

      {companyId && notFound ? (
        <ApiNotFoundCard
          resource="recommendations"
          actionLabel="Generate recommendations"
          onAction={handleGenerate}
          onRetry={() => void refetch()}
          isRetrying={isRefetching || isPending}
        />
      ) : null}

      {companyId && isError && !notFound ? (
        <Card className="border-rose-200 bg-rose-50/80 p-4">
          <p className="text-sm text-rose-800">
            {getApiErrorMessage(error, "Failed to load content recommendations")}
          </p>
        </Card>
      ) : null}

      {companyId && !isLoading && !isError ? (
        <ContentRecommendations
          data={data}
          companyId={companyId}
          empty={!hasPayload}
        />
      ) : null}
    </main>
  );
}
