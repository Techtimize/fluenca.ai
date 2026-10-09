"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clapperboard,
  ExternalLink,
  Filter,
  Grid3X3,
  Heart,
  Image as ImageLucide,
  Loader2,
  MapPin,
  MessageCircle,
  RefreshCw,
  UserRound,
} from "lucide-react";
import { SocialNotConnected } from "@/components/dashboard/social/SocialNotConnected";
import {
  accountHandle,
  formatCount,
} from "@/components/dashboard/social/socialUtils";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { getApiErrorMessage } from "@/errors/error-utils";
import {
  InstagramProfileContentQuery,
  InstagramProfileInfoQuery,
  SocialAccountsQuery,
} from "@/routes/bussiness/Bussiness-Query";
import {
  findSocialAccount,
  isSocialAccountConnected,
  normalizeSocialAccounts,
} from "@/types/bussiness/social-accounts-type";
import type { InstagramMediaItem } from "@/types/bussiness/instagram-type";
import {
  instagramMediaImageUrl,
  normalizeInstagramProfileContent,
  normalizeInstagramProfileInfo,
} from "@/types/bussiness/instagram-type";
import { FOCUS_RING } from "@/utils/ui-classes";
import Image from "next/image";

type MediaFilter = "all" | "posts" | "reels";

function isReel(item: InstagramMediaItem) {
  const type = String(item.media_type || item.product_type || "")
    .toLowerCase()
    .trim();
  return (
    type.includes("reel") ||
    type.includes("video") ||
    type === "igtv" ||
    type === "clips"
  );
}

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

function influencerTier(followers?: number | null) {
  if (typeof followers !== "number" || !Number.isFinite(followers)) {
    return "Influencer";
  }
  if (followers >= 1_000_000) return "Mega Influencer";
  if (followers >= 100_000) return "Macro Influencer";
  if (followers >= 10_000) return "Micro Influencer";
  return "Nano Influencer";
}

function engagementRate(
  posts: InstagramMediaItem[],
  followers?: number | null,
) {
  if (!followers || followers <= 0 || posts.length === 0) return null;
  let likesTotal = 0;
  let commentsTotal = 0;
  for (const post of posts) {
    const likes = Number(post.like_count ?? post.likes ?? 0);
    const comments = Number(post.comments_count ?? post.comments ?? 0);
    if (Number.isFinite(likes)) likesTotal += likes;
    if (Number.isFinite(comments)) commentsTotal += comments;
  }
  const avg = (likesTotal + commentsTotal) / posts.length;
  return (avg / followers) * 100;
}

export function InstagramProfileView() {
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>("all");
  const { data: accountsData, isLoading: isAccountsLoading } =
    SocialAccountsQuery();
  const connectedAccount = findSocialAccount(
    normalizeSocialAccounts(accountsData),
    "instagram",
  );
  const connected = isSocialAccountConnected(connectedAccount);
  const username = accountHandle(connectedAccount);

  const {
    data: profileRaw,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
    refetch: refetchProfile,
    isFetching: isProfileFetching,
  } = InstagramProfileInfoQuery(connected && username ? username : null);

  const {
    data: contentRaw,
    isLoading: isContentLoading,
    isError: isContentError,
    error: contentError,
    refetch: refetchContent,
    isFetching: isContentFetching,
  } = InstagramProfileContentQuery(connected && username ? username : null);

  const profile = normalizeInstagramProfileInfo(profileRaw);
  const posts = normalizeInstagramProfileContent(contentRaw);

  const displayName =
    profile.name ||
    connectedAccount?.display_name ||
    username ||
    "Instagram";
  const bio = profile.bio;
  const website =
    profile.website ||
    (typeof connectedAccount?.profile_url === "string"
      ? connectedAccount.profile_url
      : null);
  const avatar =
    profile.profilePicture ||
    (typeof connectedAccount?.profile_picture_url === "string"
      ? connectedAccount.profile_picture_url
      : null);
  const followers =
    profile.followers ??
    (typeof connectedAccount?.followers_count === "number"
      ? connectedAccount.followers_count
      : null);
  const following =
    profile.following ??
    (typeof connectedAccount?.follows_count === "number"
      ? connectedAccount.follows_count
      : null);
  const mediaCount = profile.posts ?? posts.length;
  const instagramId = profile.instagramId;
  const location =
    (typeof profileRaw?.city_name === "string" && profileRaw.city_name) ||
    (typeof profileRaw?.location === "string" && profileRaw.location) ||
    null;
  const tier = influencerTier(followers);
  const engagement = engagementRate(posts, followers);
  const profileUrl =
    (typeof website === "string" && website.includes("instagram.com")
      ? website
      : null) ||
    (username ? `https://www.instagram.com/${username}/` : null);

  const filteredPosts =
    mediaFilter === "reels"
      ? posts.filter(isReel)
      : mediaFilter === "posts"
        ? posts.filter((item) => !isReel(item))
        : posts;

  const isRefreshing = isProfileFetching || isContentFetching;

  const handleRefresh = () => {
    void refetchProfile();
    void refetchContent();
  };

  if (isAccountsLoading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white py-20 text-sm text-neutral-500">
        <Loader2 className="size-5 animate-spin text-[#E1306C]" />
        Loading Instagram…
      </div>
    );
  }

  if (!connected) {
    return (
      <SocialNotConnected
        platform="Instagram"
        accentClassName="bg-gradient-to-br from-[#F58529] via-[#E1306C] to-[#C13584] text-white"
      />
    );
  }

  if (!username) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-neutral-200 bg-white px-6 py-12 text-center text-neutral-900">
        <p className="text-[16px] font-semibold">Instagram handle missing</p>
        <p className="mt-2 text-[14px] text-neutral-500">
          Reconnect Instagram so Fluenca can read the connected username and
          load profile content.
        </p>
        <Link
          href={PAGE_ROUTES.INTEGRATIONS}
          className={`mt-4 inline-flex text-[14px] font-semibold text-[#E1306C] hover:underline ${FOCUS_RING}`}
        >
          Open Integrations
        </Link>
      </div>
    );
  }

  return (
    <div className="grid w-full gap-4 text-neutral-900 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
      {/* Profile sidebar */}
      <aside className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="space-y-4 p-4">
            {avatar ? (
              <Image
                src={String(avatar)}
                alt={displayName}
                className="aspect-square w-full object-contain rounded-full"
                width={100}
                height={100}
              />
            ) : (
              <div className="grid aspect-square place-items-center text-neutral-400">
                <UserRound className="size-16" />
              </div>
            )}
        

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="truncate text-[22px] font-bold tracking-tight">
                {displayName}
              </h1>
            </div>
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
              <p className="mt-1 text-[18px] font-semibold">
                {engagement == null ? "—" : `${engagement.toFixed(1)}%`}
              </p>
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

          <div className="space-y-2 text-[13px] leading-5 text-neutral-700">
            {bio ? <p className="whitespace-pre-wrap">{bio}</p> : null}
            {location ? (
              <p className="inline-flex items-center gap-1.5 text-neutral-500">
                <MapPin className="size-3.5" />
                {location}
              </p>
            ) : null}
            {isProfileError ? (
              <p className="text-[12px] text-red-500">
                {getApiErrorMessage(
                  profileError,
                  "Couldn’t load Instagram profile details",
                )}
              </p>
            ) : null}
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
                Open Instagram Profile
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

      {/* Media content */}
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
                { id: "reels", label: "Reels" },
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
                      ? "bg-[#E1306C] text-white"
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
              onClick={handleRefresh}
              disabled={isRefreshing}
              aria-label="Refresh media"
              className={`grid size-9 place-items-center rounded-full border border-neutral-200 text-neutral-700 hover:bg-neutral-50 disabled:opacity-60 ${FOCUS_RING}`}
            >
              <RefreshCw
                className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {isContentLoading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-sm text-neutral-500">
            <Loader2 className="size-5 animate-spin text-[#E1306C]" />
            Loading @{username} content…
          </div>
        ) : isContentError ? (
          <div className="py-16 text-center text-[14px] text-red-500">
            {getApiErrorMessage(
              contentError,
              "Couldn’t load Instagram profile content",
            )}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[18px] font-light text-neutral-900">No media yet</p>
            <p className="mt-2 text-[14px] text-neutral-500">
              No {mediaFilter === "all" ? "posts" : mediaFilter} returned for @
              {username}.
            </p>
          </div>
        ) : (
          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filteredPosts.map((post, index) => {
              const imageUrl = instagramMediaImageUrl(post);
              const likes = post.like_count ?? post.likes;
              const comments = post.comments_count ?? post.comments;
              const href = post.permalink || post.post_url || undefined;
              const key = String(
                post.id || post.media_id || imageUrl || index,
              );
              const caption =
                typeof post.caption === "string" ? post.caption.trim() : "";
              const dateLabel = formatPostDate(
                post.timestamp || post.created_at || null,
              );
              const reel = isReel(post);

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
                        alt={caption || `Instagram post ${index + 1}`}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="grid size-full place-items-center text-neutral-400">
                        <Grid3X3 className="size-8" />
                      </div>
                    )}
                    <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-black/55 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                      {reel ? (
                        <Clapperboard className="size-3" />
                      ) : (
                        <ImageLucide className="size-3" />
                      )}
                      {reel ? "Reel" : "Post"}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-3">
                    <div className="min-h-[52px] space-y-1">
                      <p className="line-clamp-2 text-[13px] leading-5 text-neutral-800">
                        {caption || "No caption"}
                      </p>
                      {dateLabel ? (
                        <p className="text-[12px] text-neutral-400">{dateLabel}</p>
                      ) : null}
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-2 border-t border-neutral-100 pt-2.5 text-[12px] text-neutral-500">
                      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="inline-flex items-center gap-1">
                          <Heart className="size-3.5 shrink-0" />
                          <span className="truncate">
                            {typeof likes === "number"
                              ? `${formatCount(likes)} likes`
                              : "— likes"}
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MessageCircle className="size-3.5 shrink-0" />
                          <span className="truncate">
                            {typeof comments === "number"
                              ? `${formatCount(comments)} comments`
                              : "— comments"}
                          </span>
                        </span>
                      </div>
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Open on Instagram"
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
