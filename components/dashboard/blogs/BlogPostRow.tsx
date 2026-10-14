import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, FileText, Loader2, PenLine, RotateCcw } from "lucide-react";
import { BlogStatusChip } from "@/components/dashboard/blogs/blogStatusChip";
import { PAGE_ROUTES } from "@/constant/page-routes";
import type { BlogPostListItem } from "@/types/bussiness/blog-type";
import { FOCUS_RING } from "@/utils/ui-classes";

const PRIMARY = `inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-[#5B57E6] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#4A46D0] disabled:opacity-60 ${FOCUS_RING}`;

type Props = {
  post: BlogPostListItem;
  /** Title of the brief the post was written from, used while the post has no title yet. */
  briefTitle?: string;
  keyword?: string;
  retrying: boolean;
  onRetry: () => void;
};

export default function BlogPostRow({ post, briefTitle, keyword, retrying, onRetry }: Props) {
  const ready = post.status === "ready";
  const busy = post.status === "queued" || post.status === "writing";
  const title = post.title || briefTitle || "Untitled post";

  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-[#E6E8F5] bg-white p-3.5 sm:flex-row sm:items-center">
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-[linear-gradient(135deg,#EEF0FF,#F6F4FF)] sm:w-28">
        {post.hero_image_url ? (
          <Image
            src={post.hero_image_url}
            alt={post.hero_image_alt || title}
            fill
            sizes="(min-width: 640px) 112px, 100vw"
            className="object-cover"
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center text-[#A5A8F5]">
            <FileText className="size-8" aria-hidden="true" />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-[14px] font-semibold text-neutral-900">{title}</p>
        {post.meta_description ? (
          <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-neutral-500">{post.meta_description}</p>
        ) : null}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <BlogStatusChip status={post.status} />
          {keyword ? (
            <span className="rounded-full bg-[#F1F2FB] px-2.5 py-0.5 text-[11px] text-[#4544C9]">{keyword}</span>
          ) : null}
        </div>
        {post.status === "failed" && post.error ? (
          <p className="mt-2 text-[12px] text-rose-700">{post.error}</p>
        ) : null}
      </div>

      <div className="flex shrink-0 flex-row items-center justify-between gap-3 sm:w-40 sm:flex-col sm:items-end">
        <div className="space-y-1 text-[12px] text-neutral-500 sm:text-end">
          <p className="flex items-center gap-1.5 sm:justify-end">
            <FileText className="size-3.5" aria-hidden="true" />
            {ready ? `${post.word_count.toLocaleString()} words` : "—"}
          </p>
          <p className="flex items-center gap-1.5 sm:justify-end">
            <BadgeCheck className="size-3.5" aria-hidden="true" />
            {ready && post.quality_score !== null ? `Quality ${post.quality_score}/100` : "Quality —"}
          </p>
        </div>
        {post.status === "failed" ? (
          <button type="button" onClick={onRetry} disabled={retrying} className={PRIMARY}>
            {retrying ? (
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <RotateCcw className="size-3.5" aria-hidden="true" />
            )}
            Try again
          </button>
        ) : busy ? (
          <span className="inline-flex h-9 items-center gap-1.5 px-1 text-[13px] text-neutral-500">
            <Loader2 className="size-3.5 animate-spin text-[#5B57E6]" aria-hidden="true" />
            Writing…
          </span>
        ) : (
          <Link href={PAGE_ROUTES.BLOG_DETAIL(post.id)} className={PRIMARY}>
            <PenLine className="size-3.5" aria-hidden="true" />
            Open
          </Link>
        )}
      </div>
    </li>
  );
}
