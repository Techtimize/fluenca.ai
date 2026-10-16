"use client";

import Link from "next/link";
import { useState } from "react";
import { FileText, Sparkles } from "lucide-react";
import BlogPostRow from "@/components/dashboard/blogs/BlogPostRow";
import BlogWriterHero from "@/components/dashboard/blogs/BlogWriterHero";
import ReadyToWritePanel from "@/components/dashboard/blogs/ReadyToWritePanel";
import { useRouter } from "next/navigation";
import { AiVisibilityGapPostMutation, AiVisibilityQuery } from "@/routes/ai-visibility/AiVisibility-Query";
import ApiNotFoundCard from "@/components/notfound";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { isApiNotFoundError } from "@/errors/error-utils";
import { cn } from "@/lib/utils";
import { BlogPostMutation, RetryKeywordsMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { BlogPostsQuery, BriefsQuery, KeywordsQuery } from "@/routes/bussiness/Bussiness-Query";
import type { BlogPostListItem } from "@/types/bussiness/blog-type";
import { FOCUS_RING } from "@/utils/ui-classes";

const OPEN_LINK = cn(buttonVariants({ variant: "outline", size: "sm" }));

type StatusFilter = "all" | "ready" | "writing" | "failed";
type SortOrder = "newest" | "oldest" | "quality";

const STATUS_TABS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All posts" },
  { id: "ready", label: "Ready" },
  { id: "writing", label: "In progress" },
  { id: "failed", label: "Failed" },
];

const SORT_OPTIONS: { id: SortOrder; label: string }[] = [
  { id: "newest", label: "Newest first" },
  { id: "oldest", label: "Oldest first" },
  { id: "quality", label: "Highest quality" },
];

function matchesStatus(post: BlogPostListItem, filter: StatusFilter) {
  if (filter === "all") return true;
  if (filter === "writing") return post.status === "queued" || post.status === "writing";
  return post.status === filter;
}

function sortPosts(posts: BlogPostListItem[], order: SortOrder) {
  const time = (post: BlogPostListItem) => new Date(post.created_at).getTime() || 0;
  return [...posts].sort((a, b) => {
    if (order === "quality") return (b.quality_score ?? -1) - (a.quality_score ?? -1);
    return order === "oldest" ? time(a) - time(b) : time(b) - time(a);
  });
}

export default function BlogsPage() {
  const keywords = KeywordsQuery();
  const researchStatus = keywords.data?.status;
  const briefs = BriefsQuery(researchStatus);
  const posts = BlogPostsQuery();
  const writePost = BlogPostMutation();
  const startResearch = RetryKeywordsMutation();
  const [pendingBriefId, setPendingBriefId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const blogBriefs = (briefs.data?.briefs ?? []).filter((brief) => brief.format === "blog");
  const router = useRouter();
  const visibility = AiVisibilityQuery();
  const gapPost = AiVisibilityGapPostMutation();
  const gapPosts = visibility.data?.gap_posts ?? {};
  const gapPostIds = new Set(Object.values(gapPosts));
  const latestVisibility = visibility.data?.latest;
  const openGaps =
    latestVisibility?.status === "done"
      ? (latestVisibility.summary?.gaps ?? []).filter((gap) => !gapPosts[gap.question])
      : [];
  const writeGap = (question: string) =>
    gapPost.mutate(question, { onSuccess: (post) => router.push(PAGE_ROUTES.BLOG_DETAIL(post.id)) });
  const allPosts = posts.data?.blog_posts ?? [];
  const briefsById = new Map(blogBriefs.map((brief) => [brief.brief_id, brief]));
  const briefsWithPost = new Set(allPosts.map((post) => post.brief_id));
  const unwritten = blogBriefs.filter((brief) => !briefsWithPost.has(brief.brief_id));
  const noBriefs = briefs.isError && isApiNotFoundError(briefs.error);
  const loading = keywords.isLoading || briefs.isLoading || posts.isLoading;

  const counts: Record<StatusFilter, number> = {
    all: allPosts.length,
    ready: allPosts.filter((post) => matchesStatus(post, "ready")).length,
    writing: allPosts.filter((post) => matchesStatus(post, "writing")).length,
    failed: allPosts.filter((post) => matchesStatus(post, "failed")).length,
  };
  const visiblePosts = sortPosts(
    allPosts.filter((post) => matchesStatus(post, statusFilter)),
    sortOrder,
  );

  const write = (briefId: string) => {
    setPendingBriefId(briefId);
    writePost.mutate(briefId, { onSettled: () => setPendingBriefId(null) });
  };

  const showNoBriefs =
    !loading &&
    researchStatus === "ready" &&
    !posts.isError &&
    allPosts.length === 0 &&
    (noBriefs || (briefs.isSuccess && blogBriefs.length === 0));

  return (
    <main className="min-w-0 space-y-5 pb-6">
      <header className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center text-[#5B57E6]">
          <Sparkles className="size-8" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Blog Writer</h1>
          <p className="mt-0.5 text-[13px] text-neutral-500">
            Generate high-quality blog ideas and turn them into ready-to-publish drafts.
          </p>
        </div>
      </header>

      <BlogWriterHero />

      {researchStatus === "not_started" ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E6E8F5] bg-white px-4 py-3.5">
          <div className="min-w-0">
            <p className="text-sm font-medium text-neutral-800">Keyword research has not run yet</p>
            <p className="mt-0.5 text-[13px] text-neutral-500">
              It starts by itself when you approve your topical map on the Company DNA page. If your map is already
              approved, use Generate Ideas.
            </p>
          </div>
          <Link href={PAGE_ROUTES.DNA} className={OPEN_LINK}>
            Open Company DNA
          </Link>
        </div>
      ) : null}

      {showNoBriefs ? (
        <ApiNotFoundCard
          title="No blog briefs in this research"
          description="Keyword research finished but found no topic big enough for a blog post. Add or reword topics in your topical map and approve it again."
          actionLabel="Open Company DNA"
          actionHref={PAGE_ROUTES.DNA}
          onRetry={() => void briefs.refetch()}
          isRetrying={briefs.isRefetching}
        />
      ) : null}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,1fr)]">
        <section className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEF0F8] pb-4">
            <div
              role="tablist"
              aria-label="Filter posts by status"
              className="flex flex-wrap gap-1 rounded-full border border-[#E6E8F5] bg-white p-1"
            >
              {STATUS_TABS.filter((tab) => tab.id === "all" || counts[tab.id] > 0).map((tab) => {
                const selected = statusFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors ${FOCUS_RING} ${
                      selected ? "bg-[#5B57E6] text-white shadow-sm" : "text-neutral-700 hover:bg-[#F6F5FF]"
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`rounded-full px-1.5 text-[10px] font-semibold ${
                        selected ? "bg-white/20 text-white" : "bg-[#EEF0FF] text-[#4544C9]"
                      }`}
                    >
                      {counts[tab.id]}
                    </span>
                  </button>
                );
              })}
            </div>

            <Select
              value={sortOrder}
              onValueChange={(next) => {
                if (next === "newest" || next === "oldest" || next === "quality") setSortOrder(next);
              }}
            >
              <SelectTrigger
                aria-label="Sort posts"
                className="h-9 w-40 rounded-xl border-[#E6E8F5] bg-white px-3 text-[12px] text-neutral-700"
              >
                <SelectValue>
                  {(value: string | null) => SORT_OPTIONS.find((option) => option.id === value)?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent align="end">
                <SelectGroup>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-neutral-900">
              Your Blog Posts
              <span className="rounded-full bg-[#EEF0FF] px-2 py-0.5 text-[11px] font-semibold text-[#4544C9]">
                {allPosts.length}
              </span>
            </h2>
            <p className="mt-1 text-[12px] text-neutral-500">
              AI-written drafts tailored to your brand, audience and goals.
            </p>
          </div>

          {loading ? (
            <ul className="space-y-3" aria-busy="true">
              {Array.from({ length: 3 }, (_, i) => (
                <li key={i} className="h-28 animate-pulse rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF]" />
              ))}
            </ul>
          ) : visiblePosts.length ? (
            <ul className="space-y-3">
              {visiblePosts.map((post) => {
                const brief = briefsById.get(post.brief_id);
                return (
                  <BlogPostRow
                    key={post.id}
                    post={post}
                    briefTitle={brief?.title}
                    keyword={brief?.primary_keyword ?? (gapPostIds.has(post.id) ? "From AI visibility" : undefined)}
                    retrying={pendingBriefId === post.brief_id}
                    onRetry={() => write(post.brief_id)}
                  />
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#E6E8F5] bg-white px-6 py-12 text-center">
              <span className="grid size-11 place-items-center rounded-full bg-[#EEF0FF] text-[#5B57E6]">
                <FileText className="size-5" aria-hidden="true" />
              </span>
              <p className="mt-3 text-[14px] font-semibold text-neutral-900">
                {allPosts.length ? "No posts match this filter" : "No blog posts yet"}
              </p>
              <p className="mt-1 max-w-sm text-[12px] text-neutral-500">
                {allPosts.length
                  ? "Try another status."
                  : "Pick a topic from Ready to Write and Fluenca will draft the post for you."}
              </p>
            </div>
          )}
        </section>

        <aside className="min-w-0 xl:sticky xl:top-4">
          <ReadyToWritePanel
            briefs={loading ? [] : unwritten}
            researchStatus={researchStatus}
            pendingBriefId={pendingBriefId}
            onWrite={write}
            isGenerating={startResearch.isPending}
            onGenerate={() => startResearch.mutate()}
            gaps={loading ? [] : openGaps}
            pendingGap={gapPost.isPending ? (gapPost.variables ?? null) : null}
            onWriteGap={writeGap}
          />
        </aside>
      </div>
    </main>
  );
}
