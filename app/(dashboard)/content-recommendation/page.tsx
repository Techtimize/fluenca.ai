"use client";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import ContentRecommendations from "@/components/dashboard/contentrecommendation/contentRecommendations";
import TopBar from "@/components/dashboard/topBar";
import Card from "@/components/shared/card";
import { getApiErrorMessage } from "@/errors/error-utils";
import { ContentRecommendationMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { ContentRecommendationResultQuery } from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";
import { FOCUS_RING } from "@/utils/ui-classes";

export default function ContentRecommendationPage() {
  const companyId = useAuthStore((s) => s.company_id);
  const companyName = useAuthStore((s) => s.company_name);
  const { data, isLoading, isError, error, isFetching } =
    ContentRecommendationResultQuery(companyId);
  const { mutate: recommend, isPending } = ContentRecommendationMutation();

  const handleGenerate = () => {
    if (!companyId) {
      toast.error("Company ID is missing. Please log in again.");
      return;
    }
    recommend({ company_id: companyId });
  };

  const hasPayload = Boolean(data && Object.keys(data).length);

  return (
    <main className="min-w-0 space-y-3 pb-4">
      <TopBar
        user={{ name: companyName || "User" }}
        placeholder="Search recommendations..."
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">Content recommendations</h1>
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

      {!companyId ? (
        <Card className="border-amber-200 bg-amber-50/80 p-4">
          <p className="text-sm text-amber-800">
            Company ID is missing. Complete company analysis first, then return here.
          </p>
        </Card>
      ) : null}
      {companyId && isError ? (
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
