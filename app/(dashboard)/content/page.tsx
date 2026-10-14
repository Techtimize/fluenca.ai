"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowDownWideNarrow, ChevronDown, Loader2, Sparkles } from "lucide-react";
import { ContentResultsGrid } from "@/components/dashboard/content/contentResultGrid";
import { normalizeContentPlatform } from "@/components/dashboard/content/resultcard";
import {
  normalizeCompanyContent,
  type ContentGenerationResultItem,
} from "@/components/dashboard/content/utils";
import SocialPostsSection from "@/components/dashboard/content/socialPostsSection";
import TopBar from "@/components/dashboard/topBar";
import ApiNotFoundCard from "@/components/notfound";
import Card from "@/components/shared/card";
import { getApiErrorMessage, isApiNotFoundError } from "@/errors/error-utils";
import {
  FacebookPublishMutation,
  InstagramPublishMutation,
  LinkedInPublishMutation,
} from "@/routes/bussiness/Bussiness-Mutation";
import { CompanyImageGenerationResultsQuery } from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";
import { FOCUS_RING } from "@/utils/ui-classes";
import { cn } from "@/lib/utils";

type PlatformFilter = "all" | "instagram" | "linkedin";
type SortOrder = "newest" | "oldest";

function platformKey(platform?: string) {
  const value = String(platform || "").toLowerCase();
  if (value.includes("facebook")) return "facebook" as const;
  if (value.includes("linkedin")) return "linkedin" as const;
  if (value.includes("instagram") || value === "ig" || value === "insta") {
    return "instagram" as const;
  }
  return null;
}

function linkedInPayload(item: ContentGenerationResultItem) {
  const text =
    item.caption || item.hook || item.summary || item.title || "New update";
  const title = item.title || item.projectName || undefined;
  const imageUrl = item.images.map((image) => image.imageUrl).find(Boolean);

  if (imageUrl) {
    return { text, image_url: imageUrl, title };
  }
  return { text };
}

const FILTERS: {
  id: PlatformFilter;
  label: string;
  icon?: string;
}[] = [
  { id: "all", label: "All" },
  { id: "instagram", label: "Instagram", icon: "/assets/insta.png" },
  { id: "linkedin", label: "LinkedIn", icon: "/assets/linkedin.png" },
];

export default function ContentPage() {
  const companyId = useAuthStore((s) => s.company_id);
  const companyName = useAuthStore((s) => s.company_name);
  const { data, isLoading, isError, error, isFetching, refetch, isRefetching } =
    CompanyImageGenerationResultsQuery(companyId);
  const { mutate: publishInstagram, isPending: isPublishingInstagram } =
    InstagramPublishMutation();
  const { mutate: publishFacebook, isPending: isPublishingFacebook } =
    FacebookPublishMutation();
  const { mutate: publishLinkedIn, isPending: isPublishingLinkedIn } =
    LinkedInPublishMutation();
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const content = normalizeCompanyContent(data);
  const hasResults = content.results.length > 0;
  const notFound = isError && isApiNotFoundError(error);
  const isPublishing =
    isPublishingInstagram || isPublishingFacebook || isPublishingLinkedIn;

  const handlePublish = (item: ContentGenerationResultItem) => {
    const platform = platformKey(item.platform);
    setPublishingId(item.id);

    if (platform === "linkedin") {
      publishLinkedIn(linkedInPayload(item), {
        onSettled: () => setPublishingId(null),
      });
      return;
    }

    const imageUrls = item.images
      .map((image) => image.imageUrl)
      .filter(Boolean);
    const imageUrl = imageUrls[0];
    if (!imageUrl) {
      setPublishingId(null);
      return;
    }

    const payload = {
      image_url: imageUrl,
      caption: item.caption || item.hook || item.summary || item.title || "",
      image_urls: imageUrls.length > 1 ? imageUrls : undefined,
    };
    if (platform === "facebook") {
      publishFacebook(payload, {
        onSettled: () => setPublishingId(null),
      });
      return;
    }
    publishInstagram(payload, {
      onSettled: () => setPublishingId(null),
    });
  };

  const gridItems = content.results
    .filter(
      (item) =>
        platformFilter === "all" ||
        normalizeContentPlatform(item.platform) === platformFilter,
    )
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
    });

  return (
    <main className="min-w-0 space-y-5 pb-6">
      <TopBar
        user={{ name: companyName || "User" }}
        placeholder="Search content..."
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#ECEBFF] text-[#5B57E6]">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-[28px]">
              Generated Content
            </h1>
          </div>
          <p className="mt-1.5 max-w-2xl text-[14px] text-neutral-500">
            AI-created content for your social media channels. Review, edit, and
            publish your posts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div
            role="tablist"
            aria-label="Filter by platform"
            className="inline-flex flex-wrap gap-1.5 rounded-full border border-[#E6E8F5] bg-white p-1"
          >
            {FILTERS.map((filter) => {
              const active = platformFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setPlatformFilter(filter.id)}
                  className={cn(
                    `inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[12px] font-semibold transition-colors ${FOCUS_RING}`,
                    active
                      ? "bg-[#5B57E6] text-white shadow-sm"
                      : "text-neutral-600 hover:bg-[#F6F7FD]",
                  )}
                >
                  {filter.icon ? (
                    <Image
                      src={filter.icon}
                      alt=""
                      width={14}
                      height={14}
                      className="size-3.5 object-contain"
                    />
                  ) : null}
                  {filter.label}
                </button>
              );
            })}
          </div>

          <label className="relative inline-flex">
            <span className="sr-only">Sort content</span>
            <ArrowDownWideNarrow
              className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-neutral-400"
              aria-hidden="true"
            />
            <select
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(event.target.value as SortOrder)
              }
              className={`h-10 appearance-none rounded-full border border-[#E6E8F5] bg-white py-0 pl-9 pr-9 text-[12px] font-semibold text-neutral-700 outline-none ${FOCUS_RING}`}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-neutral-400"
              aria-hidden="true"
            />
          </label>
        </div>
      </div>

      <SocialPostsSection />

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

      {companyId && hasResults && gridItems.length === 0 ? (
        <Card className="p-8 text-center text-sm text-neutral-500">
          No posts match this platform filter.
        </Card>
      ) : null}

      {companyId && hasResults && gridItems.length > 0 ? (
        <ContentResultsGrid
          items={gridItems}
          publishingId={isPublishing ? publishingId : null}
          onPublish={handlePublish}
        />
      ) : null}
    </main>
  );
}
