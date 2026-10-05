"use client";

import Link from "next/link";
import { Loader2, Sparkles } from "lucide-react";
import ContentImageGrid from "@/components/dashboard/content/contentImageGrid";
import { normalizeCompanyImages } from "@/components/dashboard/content/utils";
import TopBar from "@/components/dashboard/topBar";
import ApiNotFoundCard from "@/components/notfound";
import Card from "@/components/shared/card";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { getApiErrorMessage, isApiNotFoundError } from "@/errors/error-utils";
import { CompanyImageGenerationResultsQuery } from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";
import { FOCUS_RING } from "@/utils/ui-classes";

export default function ContentPage() {
  const companyId = useAuthStore((s) => s.company_id);
  const companyName = useAuthStore((s) => s.company_name);
  const { data, isLoading, isError, error, isFetching, refetch, isRefetching } =
    CompanyImageGenerationResultsQuery(companyId);

  const images = normalizeCompanyImages(data);
  const hasImages = images.length > 0;
  const notFound = isError && isApiNotFoundError(error);

  return (
    <main className="min-w-0 space-y-3 pb-4">
      <TopBar user={{ name: companyName || "User" }} placeholder="Search content..." />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">Content</h1>
          <p className="text-[13px] text-neutral-500">
            Generated images for your company, fetched by company ID.
          </p>
        </div>

        <Link
          href={PAGE_ROUTES.SCRIPT}
          className={`inline-flex h-9 items-center gap-2 rounded-full bg-[#5B57E6] px-3.5 text-sm font-medium text-white hover:bg-[#4A46D0] ${FOCUS_RING}`}
        >
          <Sparkles className="size-4" aria-hidden="true" />
          Generate from scripts
        </Link>
      </div>

      {!companyId ? (
        <Card className="border-amber-200 bg-amber-50/80 p-4">
          <p className="text-sm text-amber-800">
            Company ID is missing. Complete company analysis first, then return here.
          </p>
        </Card>
      ) : null}

      {companyId && (isLoading || isFetching) && !hasImages && !notFound ? (
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

      {companyId && !isLoading && !isError && !hasImages ? (
        <ApiNotFoundCard resource="content" />
      ) : null}

      {companyId && hasImages ? (
        <div className="space-y-3">
          <p className="text-[12px] text-neutral-500">
            {images.length} image{images.length === 1 ? "" : "s"}
          </p>
          <ContentImageGrid items={images} />
        </div>
      ) : null}
    </main>
  );
}
