"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  FileText,
  Filter,
  Grid3X3,
  Image as ImageLucide,
  Loader2,
  MessageCircle,
  RefreshCw,
  ThumbsUp,
  UserRound,
} from "lucide-react";
import { SocialNotConnected } from "@/components/dashboard/social/SocialNotConnected";
import {
  accountDisplayName,
  accountHandle,
  formatCount,
} from "@/components/dashboard/social/socialUtils";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { getApiErrorMessage } from "@/errors/error-utils";
import {
  LinkedInProfileContentQuery,
  SocialAccountsQuery,
} from "@/routes/bussiness/Bussiness-Query";
import {
  findSocialAccount,
  isSocialAccountConnected,
  normalizeSocialAccounts,
} from "@/types/bussiness/social-accounts-type";
import type { SocialProfileMediaItem } from "@/types/bussiness/social-profile-content-type";
import {
  normalizeSocialProfileContent,
  socialMediaCaption,
  socialMediaComments,
  socialMediaDate,
  socialMediaHref,
  socialMediaImageUrl,
  socialMediaLikes,
} from "@/types/bussiness/social-profile-content-type";
import { FOCUS_RING } from "@/utils/ui-classes";

type MediaFilter = "all" | "posts" | "articles";

function formatPostDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isArticle(post: SocialProfileMediaItem) {
  return !socialMediaImageUrl(post) && Boolean(socialMediaCaption(post));
}

export function LinkedInProfileView() {
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>("all");
  const { data: accountsData, isLoading: isAccountsLoading } =
    SocialAccountsQuery();
  const account = findSocialAccount(
    normalizeSocialAccounts(accountsData),
    "linkedin",
  );
  const connected = isSocialAccountConnected(account);
  const name = accountDisplayName(account) || "LinkedIn Member";
  const handle = accountHandle(account);
  const avatar =
    typeof account?.profile_picture_url === "string"
      ? account.profile_picture_url
      : null;
  const headline =
    (typeof account?.headline === "string" && account.headline) ||
    (typeof account?.title === "string" && account.title) ||
    null;
  const followers =
    typeof account?.followers_count === "number"
      ? account.followers_count
      : typeof account?.connections_count === "number"
        ? account.connections_count
        : null;
  const following =
    typeof account?.follows_count === "number" ? account.follows_count : null;
  const profileUrl =
    (typeof account?.profile_url === "string" && account.profile_url) ||
    (handle ? `https://www.linkedin.com/in/${handle}/` : null);

  const {
    data: contentRaw,
    isLoading: isContentLoading,
    isError: isContentError,
    error: contentError,
    refetch,
    isFetching,
  } = LinkedInProfileContentQuery(connected);

  const posts = normalizeSocialProfileContent(contentRaw);
  const mediaCount = posts.length;

  const filteredPosts =
    mediaFilter === "articles"
      ? posts.filter(isArticle)
      : mediaFilter === "posts"
        ? posts.filter((post) => !isArticle(post))
        : posts;

  if (isAccountsLoading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white py-20 text-sm text-neutral-500">
        <Loader2 className="size-5 animate-spin text-[#0A66C2]" />
        Loading LinkedIn…
      </div>
    );
  }

  if (!connected) {
    return (
      <SocialNotConnected
        platform="LinkedIn"
        accentClassName="bg-[#0A66C2] text-white"
      />
    );
  }

  return (
    <div className="grid w-full gap-4 text-neutral-900 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="space-y-4 p-4">
          {avatar ? (
            <Image
              src={String(avatar)}
              alt={name}
              className="aspect-square w-full rounded-full object-contain"
              width={100}
              height={100}
            />
          ) : (
            <div className="grid aspect-square place-items-center rounded-full bg-neutral-100 text-neutral-400">
              <UserRound className="size-16" />
            </div>
          )}

          <div>
            <h1 className="truncate text-[22px] font-bold tracking-tight">
              {name}
            </h1>
            {handle ? (
              <p className="mt-0.5 text-[14px] text-neutral-500">@{handle}</p>
            ) : null}
            {headline ? (
              <p className="mt-2 text-[13px] leading-5 text-neutral-600">
                {headline}
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                Followers
              </p>
              <p className="mt-1 text-[18px] font-semibold">
                {formatCount(followers)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                Engagement
              </p>
              <p className="mt-1 text-[18px] font-semibold">—</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                Following
              </p>
              <p className="mt-1 text-[18px] font-semibold">
                {formatCount(following)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                Posts
              </p>
              <p className="mt-1 text-[18px] font-semibold">
                {formatCount(mediaCount)}
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {profileUrl ? (
              <a
                href={profileUrl}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white text-[13px] font-semibold text-neutral-900 hover:bg-neutral-50 ${FOCUS_RING}`}
              >
                <ExternalLink className="size-4" />
                Open LinkedIn Profile
              </a>
            ) : (
              <Link
                href={PAGE_ROUTES.INTEGRATIONS}
                className={`inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white text-[13px] font-semibold text-neutral-900 hover:bg-neutral-50 ${FOCUS_RING}`}
              >
                Manage connection
              </Link>
            )}
          </div>
        </div>
      </aside>

      <section className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h2 className="text-[22px] font-semibold tracking-tight">
              Content (Media)
            </h2>
            <p className="mt-1 text-[13px] text-neutral-500">
              {filteredPosts.length} of {posts.length} posts shown
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { id: "all", label: "All" },
                { id: "posts", label: "Posts" },
                { id: "articles", label: "Articles" },
              ] as const
            ).map((tab) => {
              const active = mediaFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMediaFilter(tab.id)}
                  className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${
                    active
                      ? "bg-[#0A66C2] text-white"
                      : "border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                  } ${FOCUS_RING}`}
                >
                  {tab.label}
                </button>
              );
            })}
            <button
              type="button"
              className={`inline-flex h-9 items-center gap-1.5 rounded-full border border-neutral-200 px-3 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50 ${FOCUS_RING}`}
            >
              <Filter className="size-3.5" />
              Filter
            </button>
            <button
              type="button"
              className={`inline-flex h-9 items-center rounded-full border border-neutral-200 px-3 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50 ${FOCUS_RING}`}
            >
              Sort by: Newest
            </button>
            <button
              type="button"
              onClick={() => {
                void refetch();
              }}
              disabled={isFetching}
              aria-label="Refresh media"
              className={`grid size-9 place-items-center rounded-full border border-neutral-200 text-neutral-700 hover:bg-neutral-50 disabled:opacity-60 ${FOCUS_RING}`}
            >
              <RefreshCw
                className={`size-3.5 ${isFetching ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {isContentLoading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-sm text-neutral-500">
            <Loader2 className="size-5 animate-spin text-[#0A66C2]" />
            Loading LinkedIn content…
          </div>
        ) : isContentError ? (
          <div className="py-16 text-center text-[14px] text-red-500">
            {getApiErrorMessage(
              contentError,
              "Couldn’t load LinkedIn profile content",
            )}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[18px] font-light text-neutral-900">
              No media yet
            </p>
            <p className="mt-2 text-[14px] text-neutral-500">
              No {mediaFilter === "all" ? "posts" : mediaFilter} returned for
              this LinkedIn account.
            </p>
          </div>
        ) : (
          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filteredPosts.map((post, index) => {
              const imageUrl = socialMediaImageUrl(post);
              const caption = socialMediaCaption(post);
              const likes = socialMediaLikes(post);
              const comments = socialMediaComments(post);
              const href = socialMediaHref(post);
              const dateLabel = formatPostDate(socialMediaDate(post));
              const article = isArticle(post);
              const key = String(
                post.id || post.media_id || imageUrl || index,
              );

              return (
                <li
                  key={key}
                  className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm"
                >
                  <div className="relative aspect-[4/5] bg-neutral-100">
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageUrl}
                        alt={caption || `LinkedIn post ${index + 1}`}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="grid size-full place-items-center text-neutral-400">
                        <Grid3X3 className="size-8" />
                      </div>
                    )}
                    <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-black/55 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                      {article ? (
                        <FileText className="size-3" />
                      ) : (
                        <ImageLucide className="size-3" />
                      )}
                      {article ? "Article" : "Post"}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-3">
                    <div className="min-h-[52px] space-y-1">
                      <p className="line-clamp-2 text-[13px] leading-5 text-neutral-800">
                        {caption || "No caption"}
                      </p>
                      {dateLabel ? (
                        <p className="text-[12px] text-neutral-400">
                          {dateLabel}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-2 border-t border-neutral-100 pt-2.5 text-[12px] text-neutral-500">
                      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="inline-flex items-center gap-1">
                          <ThumbsUp className="size-3.5 shrink-0" />
                          <span className="truncate">
                            {likes == null
                              ? "— likes"
                              : `${formatCount(likes)} likes`}
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MessageCircle className="size-3.5 shrink-0" />
                          <span className="truncate">
                            {comments == null
                              ? "— comments"
                              : `${formatCount(comments)} comments`}
                          </span>
                        </span>
                      </div>
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Open on LinkedIn"
                          className={`shrink-0 text-neutral-400 hover:text-neutral-900 ${FOCUS_RING}`}
                        >
                          <ExternalLink className="size-3.5" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
