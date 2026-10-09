"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Loader2, PenLine, RotateCcw } from "lucide-react";
import { BlogStatusChip } from "@/components/dashboard/blogs/blogStatusChip";
import TopBar from "@/components/dashboard/topBar";
import ApiNotFoundCard from "@/components/notfound";
import Card from "@/components/shared/card";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { getApiErrorMessage, isApiNotFoundError } from "@/errors/error-utils";
import { cn } from "@/lib/utils";
import { BlogPostMutation, RetryKeywordsMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { BlogPostsQuery, BriefsQuery, KeywordsQuery } from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";
import type { KeywordRunStep } from "@/types/bussiness/blog-type";

const PRIMARY_BUTTON = "h-9 shrink-0 gap-1.5 rounded-full bg-[#5B57E6] px-3.5 text-white hover:bg-[#4A46D4]";
const OPEN_LINK = cn(buttonVariants({ variant: "outline", size: "sm" }), "h-9 rounded-full px-3.5");
const RESEARCH_STEPS: Record<KeywordRunStep, string> = {
  queued: "Starting",
  finding_keywords: "Finding the keywords people search",
  grouping_topics: "Grouping keywords into topics",
  checking_overlap: "Checking Google's top results",
  writing_briefs: "Writing the blog briefs",
  done: "Finishing",
};

export default function BlogsPage() {
  const companyName = useAuthStore((s) => s.company_name);
  const keywords = KeywordsQuery();
  const researchStatus = keywords.data?.status;
  const briefs = BriefsQuery(researchStatus);
  const posts = BlogPostsQuery();
  const writePost = BlogPostMutation();
  const startResearch = RetryKeywordsMutation();
  const [pendingBriefId, setPendingBriefId] = useState<string | null>(null);

  const blogBriefs = (briefs.data?.briefs ?? []).filter((brief) => brief.format === "blog");
  const allPosts = posts.data?.blog_posts ?? [];
  const briefTitles = new Map(blogBriefs.map((brief) => [brief.brief_id, brief.title]));
  const briefsWithPost = new Set(allPosts.map((post) => post.brief_id));
  const unwritten = blogBriefs.filter((brief) => !briefsWithPost.has(brief.brief_id));
  const noBriefs = briefs.isError && isApiNotFoundError(briefs.error);
  const loading = keywords.isLoading || briefs.isLoading || posts.isLoading;
  const researchStep = keywords.data?.step ? RESEARCH_STEPS[keywords.data.step] : RESEARCH_STEPS.queued;

  const write = (briefId: string) => {
    setPendingBriefId(briefId);
    writePost.mutate(briefId, { onSettled: () => setPendingBriefId(null) });
  };

  return (
    <main className="min-w-0 space-y-4 pb-4">
      <TopBar user={{ name: companyName || "User" }} placeholder="Search blog posts..." />

      <div>
        <h1 className="text-lg font-semibold text-neutral-900">Blog posts</h1>
        <p className="mt-0.5 text-[13px] text-neutral-500">
          Each blog brief from your keyword research becomes a full post with a hero image and links to your other posts.
        </p>
      </div>

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
            className={PRIMARY_BUTTON}
            disabled={startResearch.isPending}
            onClick={() => startResearch.mutate()}
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Try again
          </Button>
        </Card>
      ) : null}

      {researchStatus === "not_started" ? (
        <Card className="space-y-3 p-5">
          <div>
            <p className="text-sm font-medium text-neutral-800">Keyword research has not run yet</p>
            <p className="mt-0.5 text-[13px] text-neutral-500">
              It starts by itself when you approve your topical map on the Company DNA page. If your map is
              already approved, start it here.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              className={PRIMARY_BUTTON}
              disabled={startResearch.isPending}
              onClick={() => startResearch.mutate()}
            >
              {startResearch.isPending ? (
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <PenLine className="size-3.5" aria-hidden="true" />
              )}
              Start keyword research
            </Button>
            <Link href={PAGE_ROUTES.DNA} className={OPEN_LINK}>
              Open Company DNA
            </Link>
          </div>
        </Card>
      ) : null}

      {!loading && allPosts.length > 0 ? (
        <Card className="p-4 sm:p-5">
          <h2 className="text-[15px] font-semibold text-neutral-900">Your posts</h2>
          <ul className="mt-3 divide-y divide-[#EEF0F8]">
            {allPosts.map((post) => (
              <li key={post.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                {post.hero_image_url ? (
                  <Image
                    src={post.hero_image_url}
                    alt={post.hero_image_alt || post.title}
                    width={112}
                    height={63}
                    sizes="112px"
                    className="aspect-video w-28 shrink-0 rounded-lg object-cover"
                  />
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium text-neutral-900">
                    {post.title || briefTitles.get(post.brief_id) || "Untitled post"}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-neutral-500">
                    <BlogStatusChip status={post.status} />
                    {post.status === "ready" ? <Badge>{`${post.word_count} words`}</Badge> : null}
                    {post.status === "ready" && post.quality_score !== null ? (
                      <Badge>{`Quality ${post.quality_score}/100`}</Badge>
                    ) : null}
                    {post.status === "failed" && post.error ? <span className="text-rose-700">{post.error}</span> : null}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {post.status === "failed" ? (
                    <Button
                      type="button"
                      size="sm"
                      className={PRIMARY_BUTTON}
                      disabled={pendingBriefId === post.brief_id}
                      onClick={() => write(post.brief_id)}
                    >
                      <RotateCcw className="size-3.5" aria-hidden="true" />
                      Try again
                    </Button>
                  ) : null}
                  <Link href={PAGE_ROUTES.BLOG_DETAIL(post.id)} className={OPEN_LINK}>
                    Open
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {!loading && unwritten.length > 0 ? (
        <Card className="p-4 sm:p-5">
          <h2 className="text-[15px] font-semibold text-neutral-900">Ready to write</h2>
          <p className="mt-0.5 text-[12px] text-neutral-500">Blog briefs without a post yet, highest priority first.</p>
          <ul className="mt-3 divide-y divide-[#EEF0F8]">
            {unwritten.map((brief) => (
              <li key={brief.brief_id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium text-neutral-900">{brief.title}</p>
                  <p className="mt-0.5 text-[12px] text-neutral-500">
                    {brief.primary_keyword} · {brief.total_volume.toLocaleString()} searches a month
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  className={PRIMARY_BUTTON}
                  disabled={pendingBriefId === brief.brief_id}
                  onClick={() => write(brief.brief_id)}
                >
                  {pendingBriefId === brief.brief_id ? (
                    <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    <PenLine className="size-3.5" aria-hidden="true" />
                  )}
                  Write post
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {!loading && researchStatus === "ready" && !posts.isError && allPosts.length === 0 && (noBriefs || (briefs.isSuccess && blogBriefs.length === 0)) ? (
        <ApiNotFoundCard
          title="No blog briefs in this research"
          description="Keyword research finished but found no topic big enough for a blog post. Add or reword topics in your topical map and approve it again."
          actionLabel="Open Company DNA"
          actionHref={PAGE_ROUTES.DNA}
          onRetry={() => void briefs.refetch()}
          isRetrying={briefs.isRefetching}
        />
      ) : null}
    </main>
  );
}
