"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ContentResultsGrid } from "@/components/dashboard/content/contentResultGrid";
import {
  normalizeCompanyContent,
  type ContentGenerationResultItem,
} from "@/components/dashboard/content/utils";
import { AgentModeToggle } from "@/components/dashboard/content-execution/AgentModeToggle";
import TopBar from "@/components/dashboard/topBar";
import ApiNotFoundCard from "@/components/notfound";
import Card from "@/components/shared/card";
import { getApiErrorMessage, isApiNotFoundError } from "@/errors/error-utils";
import {
  FacebookPublishMutation,
  InstagramPublishMutation,
} from "@/routes/bussiness/Bussiness-Mutation";
import { CompanyImageGenerationResultsQuery } from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";

function platformKey(platform?: string) {
  const value = String(platform || "").toLowerCase();
  if (value.includes("facebook")) return "facebook" as const;
  if (value.includes("linkedin")) return "linkedin" as const;
  if (value.includes("instagram") || value === "ig" || value === "insta") {
    return "instagram" as const;
  }
  return null;
}

export default function ContentPage() {
  const companyId = useAuthStore((s) => s.company_id);
  const companyName = useAuthStore((s) => s.company_name);
  const { data, isLoading, isError, error, isFetching, refetch, isRefetching } =
    CompanyImageGenerationResultsQuery(companyId);
  const { mutate: publishInstagram, isPending: isPublishingInstagram } =
    InstagramPublishMutation();
  const { mutate: publishFacebook, isPending: isPublishingFacebook } =
    FacebookPublishMutation();
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const content = normalizeCompanyContent(data);
  const hasResults = content.results.length > 0 || content.images.length > 0;
  const notFound = isError && isApiNotFoundError(error);
  const isPublishing = isPublishingInstagram || isPublishingFacebook;

  const handlePublish = (item: ContentGenerationResultItem) => {
    const platform = platformKey(item.platform);

    if (platform === "linkedin") {
      toast.message("LinkedIn publishing is coming soon");
      return;
    }

    const imageUrls = item.images
      .map((image) => image.imageUrl)
      .filter(Boolean);
    const imageUrl = imageUrls[0];
    if (!imageUrl) return;

    const payload = {
      image_url: imageUrl,
      caption: item.caption || item.hook || item.summary || item.title || "",
      image_urls: imageUrls.length > 1 ? imageUrls : undefined,
    };

    setPublishingId(item.id);

    if (platform === "facebook") {
      publishFacebook(payload, {
        onSettled: () => setPublishingId(null),
      });
      return;
    }

    // Default to Instagram for Instagram (and unknown) content
    publishInstagram(payload, {
      onSettled: () => setPublishingId(null),
    });
  };

  const gridItems: ContentGenerationResultItem[] =
    content.results.length > 0
      ? content.results
      : content.images.map((image, index) => ({
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
        }));

  return (
    <main className="min-w-0 space-y-3 pb-4">
      <TopBar user={{ name: companyName || "User" }} placeholder="Search content..." />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-neutral-900">Generated Content</h1>
          <p className="mt-1 text-[13px] text-neutral-500">
            Agent mode gates automatic script → image → publish from the calendar.
          </p>
        </div>
        <AgentModeToggle className="w-full max-w-md sm:w-auto sm:min-w-[320px]" />
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
          <ContentResultsGrid
            items={gridItems}
            publishingId={isPublishing ? publishingId : null}
            onPublish={handlePublish}
          />
        </div>
      ) : null}
    </main>
  );
}
