"use client";

import { Loader2 } from "lucide-react";
import { ContentResultsGrid } from "@/components/dashboard/content/contentResultGrid";
import { normalizeCompanyContent } from "@/components/dashboard/content/utils";
import TopBar from "@/components/dashboard/topBar";
import ApiNotFoundCard from "@/components/notfound";
import Card from "@/components/shared/card";
import { getApiErrorMessage, isApiNotFoundError } from "@/errors/error-utils";
import { CompanyImageGenerationResultsQuery } from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";

export default function ContentPage() {
  const companyId = useAuthStore((s) => s.company_id);
  const companyName = useAuthStore((s) => s.company_name);
  const { data, isLoading, isError, error, isFetching, refetch, isRefetching } =
    CompanyImageGenerationResultsQuery(companyId);

  const content = normalizeCompanyContent(data);
  const hasResults = content.results.length > 0 || content.images.length > 0;
  const notFound = isError && isApiNotFoundError(error);

  return (
    <main className="min-w-0 space-y-3 pb-4">
      <TopBar user={{ name: companyName || "User" }} placeholder="Search content..." />
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">Generated Content</h1>
        </div>
   

      {companyId && (isLoading || isFetching) && !hasResults && !notFound ? (
        <Card className="flex items-center justify-center gap-3 p-8 text-neutral-500">
          <Loader2 className="size-5 animate-spin text-[#5B57E6]" />
          <span className="text-sm">Loading content…</span>
        </Card>
      ) : null}

      {companyId && notFound ? (
        <ApiNotFoundCard
          resource="content"
          onRetry={() => void refetch()}
          isRetrying={isRefetching}
        />
      ) : null}

      {companyId && isError && !notFound ? (
        <Card className="border-rose-200 bg-rose-50/80 p-4">
          <p className="text-sm text-rose-800">
            {getApiErrorMessage(error, "Failed to load generated images")}
          </p>
        </Card>
      ) : null}

      {companyId && !isLoading && !isError && !hasResults ? (
        <ApiNotFoundCard resource="content" />
      ) : null}

      {companyId && hasResults ? (
        <div className="space-y-3">
          <p className="text-[12px] text-neutral-500">
            {content.count} run{content.count === 1 ? "" : "s"}
            {" · "}
            {content.imagesCount} image{content.imagesCount === 1 ? "" : "s"}
          </p>
          {content.results.length > 0 ? (
            <ContentResultsGrid items={content.results} />
          ) : (
            <ContentResultsGrid
              items={content.images.map((image, index) => ({
                id: image.id || `image-${index}`,
                success: true,
                status: image.status || "success",
                platform: image.platform,
                purpose: image.purpose,
                aspectRatio: image.aspectRatio,
                imagesCount: 1,
                jobsCount: 1,
                createdAt: image.createdAt,
                title: image.title || image.headline,
                projectName: image.projectName,
                caption: image.caption,
                images: [image],
              }))}
            />
          )}
        </div>
      ) : null}
    </main>
  );
}
