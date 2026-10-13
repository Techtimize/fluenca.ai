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
import { BrandButton } from "@/components/ui/brand-button";
import useAuthStore from "@/store/AuthsStore";

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
    <main className="min-w-0 space-y-5 pb-6">
      <TopBar
        user={{ name: companyName || "User" }}
        placeholder="Search recommendations..."
      />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-[28px]">
            Content recommendations
          </h1>
          <p className="mt-1.5 text-[14px] text-neutral-500">
            AI-generated ideas, themes, and post plans for your brand.
          </p>
        </div>

        {companyId ? (
          <BrandButton
            type="button"
            size="sm"
            onClick={handleGenerate}
            disabled={isPending}
            className="shrink-0"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {isPending ? "Generating…" : hasPayload ? "Regenerate" : "Generate"}
          </BrandButton>
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
