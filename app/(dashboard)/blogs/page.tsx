"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Loader2, PenLine, RotateCcw } from "lucide-react";
import { BlogStatusChip } from "@/components/dashboard/blogs/blogStatusChip";
import ApiNotFoundCard from "@/components/notfound";
import Card from "@/components/shared/card";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { isApiNotFoundError } from "@/errors/error-utils";
import { cn } from "@/lib/utils";
import { BlogPostMutation, RetryKeywordsMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { BlogPostsQuery, BriefsQuery, KeywordsQuery } from "@/routes/bussiness/Bussiness-Query";

const OPEN_LINK = cn(buttonVariants({ variant: "outline", size: "sm" }));

export default function BlogsPage() {
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

  const write = (briefId: string) => {
    setPendingBriefId(briefId);
    writePost.mutate(briefId, { onSettled: () => setPendingBriefId(null) });
  };

  return (
    <main className="min-w-0 space-y-4 pb-4">
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
