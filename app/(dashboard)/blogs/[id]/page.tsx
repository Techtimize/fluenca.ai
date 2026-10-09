"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { ArrowLeft, ImagePlus, Loader2, RotateCcw } from "lucide-react";
import { BlogMarkdown } from "@/components/dashboard/blogs/blogMarkdown";
import { BlogStatusChip } from "@/components/dashboard/blogs/blogStatusChip";
import TopBar from "@/components/dashboard/topBar";
import ApiNotFoundCard from "@/components/notfound";
import Card from "@/components/shared/card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { getApiErrorMessage, isApiNotFoundError } from "@/errors/error-utils";
import { BlogImageMutation, BlogPostMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { BlogPostDetailsQuery, BlogPostsQuery } from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";
import { FOCUS_RING } from "@/utils/ui-classes";

const BLOG_LINK_PREFIX = "/blog/";
const IMAGE_BUTTON = "h-8 gap-1.5 rounded-full px-3 text-[12px]";

export default function BlogPostPage() {
  const params = useParams<{ id?: string }>();
  const postId = typeof params?.id === "string" ? params.id : "";
  const companyName = useAuthStore((s) => s.company_name);
  const { data: post, isLoading, isError, error, refetch, isRefetching } = BlogPostDetailsQuery(postId);
  const { data: list } = BlogPostsQuery();
  const writePost = BlogPostMutation();
  const makeImage = BlogImageMutation(postId);
  const { mutate: requestImage } = makeImage;
  const heroRequested = useRef(false);
  const pendingImage = makeImage.isPending ? makeImage.variables : undefined;
  const pendingHeading = pendingImage?.kind === "section" ? pendingImage.heading : null;

  useEffect(() => {
    if (!post || post.status !== "ready" || post.hero_image_url || heroRequested.current) return;
    heroRequested.current = true;
    requestImage({ kind: "hero" });
  }, [post, requestImage]);

  const readyIdsBySlug = new Map(
    (list?.blog_posts ?? []).filter((item) => item.status === "ready").map((item) => [item.slug, item.id]),
  );
  const resolveHref = (href: string) => {
    if (!href.startsWith(BLOG_LINK_PREFIX)) return href;
    const id = readyIdsBySlug.get(href.slice(BLOG_LINK_PREFIX.length));
    return id ? PAGE_ROUTES.BLOG_DETAIL(id) : null;
  };
  const notFound = isError && isApiNotFoundError(error);
  const failedChecks = post?.quality_checks.filter((check) => check.status === "fail") ?? [];

  return (
    <main className="min-w-0 space-y-4 pb-4">
      <TopBar user={{ name: companyName || "User" }} placeholder="Search blog posts..." />

      <Link
        href={PAGE_ROUTES.BLOGS}
        className={`inline-flex items-center gap-1.5 text-[13px] font-medium text-[#5B57E6] hover:underline ${FOCUS_RING}`}
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        All blog posts
      </Link>

      {isLoading ? (
        <Card className="flex items-center gap-3 p-6 text-neutral-500">
          <Loader2 className="size-5 animate-spin text-[#5B57E6]" />
          <span className="text-sm">Loading blog post…</span>
        </Card>
      ) : null}

      {notFound ? (
        <ApiNotFoundCard
          title="Blog post not found"
          description="We couldn’t find this blog post. It may belong to another company, or the link is outdated."
          actionLabel="Back to blog posts"
          actionHref={PAGE_ROUTES.BLOGS}
          onRetry={() => void refetch()}
          isRetrying={isRefetching}
        />
      ) : null}

      {isError && !notFound ? (
        <Card className="border-rose-200 bg-rose-50/80 p-4">
          <p className="text-sm text-rose-800">{getApiErrorMessage(error, "Failed to load the blog post")}</p>
        </Card>
      ) : null}

      {post && (post.status === "queued" || post.status === "writing") ? (
        <Card className="flex items-center gap-3 p-6">
          <Loader2 className="size-5 animate-spin text-[#5B57E6]" />
          <div>
            <p className="text-sm font-medium text-neutral-800">Writing your blog post…</p>
            <p className="mt-0.5 text-[13px] text-neutral-500">
              It is usually ready within a minute. This page updates by itself.
            </p>
          </div>
        </Card>
      ) : null}

      {post && post.status === "failed" ? (
        <Card className="space-y-3 border-rose-200 bg-rose-50/80 p-5">
          <p className="text-sm text-rose-800">{post.error || "Something went wrong while writing your blog post."}</p>
          <Button
            type="button"
            size="sm"
            disabled={writePost.isPending}
            onClick={() => writePost.mutate(post.brief_id)}
            className="h-9 gap-1.5 rounded-full bg-[#5B57E6] px-3.5 text-white hover:bg-[#4A46D4]"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Try again
          </Button>
        </Card>
      ) : null}

      {post && post.status === "ready" ? (
        <article className="space-y-4">
          <Card className="overflow-hidden">
            {post.hero_image_url ? (
              <Image
                src={post.hero_image_url}
                alt={post.hero_image_alt || post.title}
                width={1600}
                height={900}
                unoptimized
                className="aspect-video w-full object-cover"
              />
            ) : pendingImage?.kind === "hero" ? (
              <div className="flex aspect-video w-full items-center justify-center gap-2 bg-[#F4F5FB] text-[13px] text-neutral-500">
                <Loader2 className="size-4 animate-spin text-[#5B57E6]" aria-hidden="true" />
                Creating the image…
              </div>
            ) : null}
            <div className="space-y-2 p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 text-[12px] text-neutral-500">
                <BlogStatusChip status={post.status} />
                <Badge>{`${post.word_count} words`}</Badge>
                {post.quality_score !== null ? <Badge>{`Quality ${post.quality_score}/100`}</Badge> : null}
                <Badge>{`/blog/${post.slug}`}</Badge>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={makeImage.isPending}
                  onClick={() => requestImage({ kind: "hero" })}
                  className={`ms-auto ${IMAGE_BUTTON}`}
                >
                  <ImagePlus className="size-3.5" aria-hidden="true" />
                  {post.hero_image_url ? "New hero image" : "Create hero image"}
                </Button>
              </div>
              <h1 className="text-2xl font-semibold leading-tight text-neutral-900">{post.title}</h1>
              {post.meta_description ? (
                <p className="text-[14px] text-neutral-600">{post.meta_description}</p>
              ) : null}
            </div>
          </Card>

          {post.key_takeaways.length > 0 ? (
            <Card className="p-5 sm:p-6">
              <h2 className="text-[15px] font-semibold text-neutral-900">Key takeaways</h2>
              <ul className="mt-2 list-disc space-y-1.5 ps-5 text-[14px] text-neutral-700">
                {post.key_takeaways.map((takeaway) => (
                  <li key={takeaway}>{takeaway}</li>
                ))}
              </ul>
            </Card>
          ) : null}

          <Card className="p-5 sm:p-6">
            <BlogMarkdown
              markdown={post.content_markdown}
              resolveHref={resolveHref}
              headingAction={(heading) => (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={makeImage.isPending}
                  onClick={() => requestImage({ kind: "section", heading })}
                  aria-label={`Add image: ${heading}`}
                  className={IMAGE_BUTTON}
                >
                  {pendingHeading === heading ? (
                    <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    <ImagePlus className="size-3.5" aria-hidden="true" />
                  )}
                  Add image
                </Button>
              )}
            />
          </Card>

          {post.faq.length > 0 ? (
            <Card className="p-5 sm:p-6">
              <h2 className="text-[15px] font-semibold text-neutral-900">Frequently asked questions</h2>
              <dl className="mt-3 space-y-4">
                {post.faq.map((item) => (
                  <div key={item.question}>
                    <dt className="text-[14px] font-medium capitalize text-neutral-900">{item.question}</dt>
                    <dd className="mt-1 text-[14px] leading-6 text-neutral-700">{item.answer}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          ) : null}

          {post.quality_checks.length > 0 ? (
            <Card className="p-5 sm:p-6">
              <h2 className="text-[15px] font-semibold text-neutral-900">Quality checks</h2>
              <p className="mt-0.5 text-[12px] text-neutral-500">
                {failedChecks.length === 0
                  ? "Every check passed."
                  : `${failedChecks.length} check(s) to review before publishing.`}
              </p>
              <ul className="mt-3 space-y-2 text-[13px]">
                {post.quality_checks.map((check) => (
                  <li key={check.name} className="flex gap-2">
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        check.status === "pass"
                          ? "bg-emerald-50 text-emerald-700"
                          : check.status === "fail"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {check.status}
                    </span>
                    <span className="text-neutral-700">
                      <span className="font-medium">{check.name.replaceAll("_", " ")}</span>: {check.detail}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}
        </article>
      ) : null}
    </main>
  );
}
