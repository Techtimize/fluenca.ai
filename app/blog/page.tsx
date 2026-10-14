"use client";

import { Loader2, RotateCcw } from "lucide-react";
import { BlogCards } from "@/components/dashboard/blogs/BlogCards";
import TopBar from "@/components/dashboard/topBar";
import Card from "@/components/shared/card";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage, isApiNotFoundError } from "@/errors/error-utils";
import { RetryKeywordsMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { BlogPostsQuery, BriefsQuery, KeywordsQuery } from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";
import type { KeywordRunStep } from "@/types/bussiness/blog-type";
import FooterSection from "@/components/landing/footer-section";

const RESEARCH_STEPS: Record<KeywordRunStep, string> = {
  queued: "Starting",
  finding_keywords: "Finding the keywords people search",
  grouping_topics: "Grouping keywords into topics",
  checking_overlap: "Checking Google's top results",
  writing_briefs: "Writing the blog briefs",
  done: "Finishing",
};

export default function BlogPage() {
  const companyName = useAuthStore((s) => s.company_name);
  const keywords = KeywordsQuery();
  const researchStatus = keywords.data?.status;
  const briefs = BriefsQuery(researchStatus);
  const posts = BlogPostsQuery();
  const startResearch = RetryKeywordsMutation();

  const noBriefs = briefs.isError && isApiNotFoundError(briefs.error);
  const loading = keywords.isLoading || briefs.isLoading || posts.isLoading;
  const researchStep = keywords.data?.step ? RESEARCH_STEPS[keywords.data.step] : RESEARCH_STEPS.queued;

  return (
    <>
      <main className="mx-auto w-full max-w-[1280px] min-w-0 space-y-4 px-3 py-6 sm:px-5 lg:px-8">
        <TopBar user={{ name: companyName || "User" }} placeholder="Search blog posts..." />

      <div>
        <h1 className="text-lg font-semibold text-neutral-900">Blog posts</h1>
        <p className="mt-0.5 text-[13px] text-neutral-500">
          Each blog brief from your keyword research becomes a full post with a hero image and links to your other posts.
        </p>
      </div>

      <BlogCards />

      {loading ? (
        <Card className="flex items-center justify-center gap-3 p-8 text-neutral-500">
          <Loader2 className="size-5 animate-spin text-[#5B57E6]" />
          <span className="text-sm">Loading blog posts…</span>
        </Card>
      ) : null}

      {posts.isError ? (
        <Card className="border-rose-200 bg-rose-50/80 p-4">
          <p className="text-sm text-rose-800">{getApiErrorMessage(posts.error, "Failed to load blog posts")}</p>
        </Card>
      ) : null}

      {briefs.isError && !noBriefs ? (
        <Card className="border-rose-200 bg-rose-50/80 p-4">
          <p className="text-sm text-rose-800">{getApiErrorMessage(briefs.error, "Failed to load blog briefs")}</p>
        </Card>
      ) : null}

      {keywords.isError ? (
        <Card className="border-rose-200 bg-rose-50/80 p-4">
          <p className="text-sm text-rose-800">{getApiErrorMessage(keywords.error, "Failed to load keyword research")}</p>
        </Card>
      ) : null}

      {researchStatus === "researching" ? (
        <Card className="flex items-center gap-3 p-5">
          <Loader2 className="size-5 shrink-0 animate-spin text-[#5B57E6]" />
          <div>
            <p className="text-sm font-medium text-neutral-800">Keyword research is running: {researchStep}…</p>
            <p className="mt-0.5 text-[13px] text-neutral-500">
              It usually takes a few minutes. Your blog briefs show up here by themselves when it finishes.
            </p>
          </div>
        </Card>
      ) : null}

      {researchStatus === "failed" ? (
        <Card className="space-y-3 border-rose-200 bg-rose-50/80 p-5">
          <p className="text-sm text-rose-800">{keywords.data?.error || "Keyword research failed."}</p>
          <Button
            type="button"
            size="sm"
            disabled={startResearch.isPending}
            onClick={() => startResearch.mutate()}
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Try again
          </Button>
        </Card>
      ) : null}

    </main>
    <FooterSection />
    </>
  );
}
