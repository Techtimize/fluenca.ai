"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Clapperboard,
  ExternalLink,
  Grid3X3,
  Heart,
  Image as ImageLucide,
  Loader2,
  MapPin,
  MessageCircle,
  RefreshCw,
  UserRound,
} from "lucide-react";
import { InstagramInsightsPanel } from "@/components/dashboard/social/InstagramInsightsPanel";
import { InstagramStoriesLivePanel } from "@/components/dashboard/social/InstagramStoriesLivePanel";
import { SocialNotConnected } from "@/components/dashboard/social/SocialNotConnected";
import {
  accountHandle,
  formatCount,
} from "@/components/dashboard/social/socialUtils";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { getApiErrorMessage } from "@/errors/error-utils";
import {
  InstagramProfileActionsQuery,
  InstagramProfileContentQuery,
  InstagramProfileDemographicsQuery,
  InstagramProfileFollowsQuery,
  InstagramProfileInfoQuery,
  InstagramProfileInteractionsQuery,
  InstagramProfileReachQuery,
  InstagramProfileStoriesQuery,
  InstagramProfileViewsQuery,
  InstagramLiveStreamQuery,
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
import {
  engagementRate,
  formatPostDate,
  isReel,
  type MediaFilter,
} from "@/utils/insta-utils";

export function InstagramProfileView() {
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>("all");
  const [demographicsAudience, setDemographicsAudience] = useState<
    "followers" | "engaged-audience"
  >("followers");

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
    profile.name || connectedAccount?.display_name || username || "Instagram";
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
  const storiesQ = InstagramProfileStoriesQuery(instagramId);
  const liveQ = InstagramLiveStreamQuery(instagramId);

  const reachQ = InstagramProfileReachQuery(instagramId);
  const interactionsQ = InstagramProfileInteractionsQuery(instagramId);
  const demographicsQ = InstagramProfileDemographicsQuery(
    instagramId,
    demographicsAudience,
  );
  const followsQ = InstagramProfileFollowsQuery(instagramId);
  const viewsQ = InstagramProfileViewsQuery(instagramId);
  const actionsQ = InstagramProfileActionsQuery(instagramId);

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

  const isRefreshing =
    isProfileFetching ||
    isContentFetching ||
    reachQ.isFetching ||
    interactionsQ.isFetching ||
    demographicsQ.isFetching ||
    followsQ.isFetching ||
    viewsQ.isFetching ||
    actionsQ.isFetching ||
    storiesQ.isFetching ||
    liveQ.isFetching;

  const handleRefreshProfile = () => {
    void refetchProfile();
    void refetchContent();
    void storiesQ.refetch();
    void liveQ.refetch();
  };

  const handleRefreshInsights = () => {
    void reachQ.refetch();
    void interactionsQ.refetch();
    void demographicsQ.refetch();
    void followsQ.refetch();
    void viewsQ.refetch();
    void actionsQ.refetch();
  };

  const handleRefreshStoriesLive = () => {
    void storiesQ.refetch();
    void liveQ.refetch();
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
          href={PAGE_ROUTES.CONNECTORS}
          className={`mt-4 inline-flex text-[14px] font-semibold text-[#E1306C] hover:underline ${FOCUS_RING}`}
        >
          Open Connectors
        </Link>
      </div>
    );
  }

  return (
    <div className="grid w-full gap-4 text-neutral-900 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
      {/* Profile sidebar */}
      <aside className="h-fit overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm lg:sticky lg:top-4">
        <div className="space-y-4 p-4">
          <div className="relative mx-auto w-28 sm:w-32">
            {avatar ? (
              <Image
                src={String(avatar)}
                alt={displayName}
                className="aspect-square w-full rounded-full object-cover ring-2 ring-[#FCE7F3]"
                width={128}
                height={128}
              />
            ) : (
              <div className="grid aspect-square place-items-center rounded-full bg-neutral-100 text-neutral-400">
                <UserRound className="size-16" />
              </div>
            )}
          </div>

          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center gap-1.5 lg:justify-start">
              <h1 className="truncate text-[20px] font-bold tracking-tight sm:text-[22px]">
                {displayName}
              </h1>
            </div>
            {username ? (
              <p className="mt-0.5 text-[13px] text-neutral-500">@{username}</p>
            ) : null}
            {isProfileLoading ? (
              <p className="mt-2 inline-flex items-center gap-1.5 text-[12px] text-neutral-400">
                <Loader2 className="size-3 animate-spin" />
                Syncing profile…
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <Stat label="Followers" value={formatCount(followers)} />
            <Stat
              label="Engagement"
              value={engagement == null ? "—" : `${engagement.toFixed(1)}%`}
            />
            <Stat label="Following" value={formatCount(following)} />
            <Stat label="Posts" value={formatCount(mediaCount)} />
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
                href={PAGE_ROUTES.CONNECTORS}
                className={`inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white text-[13px] font-semibold text-neutral-900 hover:bg-neutral-50 ${FOCUS_RING}`}
              >
                Manage connection
              </Link>
            )}
            <button
              type="button"
              onClick={handleRefreshProfile}
              disabled={isRefreshing}
              className={`inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 text-[13px] font-semibold text-white hover:bg-neutral-800 disabled:opacity-60 ${FOCUS_RING}`}
            >
              <RefreshCw
                className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh profile & media
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 space-y-4">
        <InstagramInsightsPanel
          accountId={instagramId}
          data={{
            reach: reachQ.data,
            interactions: interactionsQ.data,
            demographics: demographicsQ.data,
            follows: followsQ.data,
            views: viewsQ.data,
            actions: actionsQ.data,
          }}
          states={{
            reach: {
              isLoading: reachQ.isLoading,
              isError: reachQ.isError,
              error: reachQ.error,
              isFetching: reachQ.isFetching,
              refetch: () => void reachQ.refetch(),
            },
            interactions: {
              isLoading: interactionsQ.isLoading,
              isError: interactionsQ.isError,
              error: interactionsQ.error,
              isFetching: interactionsQ.isFetching,
              refetch: () => void interactionsQ.refetch(),
            },
            demographics: {
              isLoading: demographicsQ.isLoading,
              isError: demographicsQ.isError,
              error: demographicsQ.error,
              isFetching: demographicsQ.isFetching,
              refetch: () => void demographicsQ.refetch(),
            },
            follows: {
              isLoading: followsQ.isLoading,
              isError: followsQ.isError,
              error: followsQ.error,
              isFetching: followsQ.isFetching,
              refetch: () => void followsQ.refetch(),
            },
            views: {
              isLoading: viewsQ.isLoading,
              isError: viewsQ.isError,
              error: viewsQ.error,
              isFetching: viewsQ.isFetching,
              refetch: () => void viewsQ.refetch(),
            },
            actions: {
              isLoading: actionsQ.isLoading,
              isError: actionsQ.isError,
              error: actionsQ.error,
              isFetching: actionsQ.isFetching,
              refetch: () => void actionsQ.refetch(),
            },
          }}
          onRefreshAll={handleRefreshInsights}
          demographicsAudience={demographicsAudience}
          onDemographicsAudienceChange={setDemographicsAudience}
        />

        <InstagramStoriesLivePanel
          accountId={instagramId}
          storiesRaw={storiesQ.data}
          liveRaw={liveQ.data}
          storiesState={{
            isLoading: storiesQ.isLoading,
            isError: storiesQ.isError,
            error: storiesQ.error,
            isFetching: storiesQ.isFetching,
            refetch: () => void storiesQ.refetch(),
          }}
          liveState={{
            isLoading: liveQ.isLoading,
            isError: liveQ.isError,
            error: liveQ.error,
            isFetching: liveQ.isFetching,
            refetch: () => void liveQ.refetch(),
          }}
          onRefresh={handleRefreshStoriesLive}
        />

        {/* Media content */}
        <section className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <h2 className="text-[20px] font-semibold tracking-tight sm:text-[22px]">
                Content (Media)
              </h2>
              <p className="mt-1 text-[13px] text-neutral-500">
                {filteredPosts.length} of {posts.length} posts shown · your
                recent feed
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
                onClick={handleRefreshProfile}
                disabled={isContentFetching}
                aria-label="Refresh media"
                className={`grid size-9 place-items-center rounded-full border border-neutral-200 text-neutral-700 hover:bg-neutral-50 disabled:opacity-60 ${FOCUS_RING}`}
              >
                <RefreshCw
                  className={`size-3.5 ${isContentFetching ? "animate-spin" : ""}`}
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
              <p className="text-[18px] font-light text-neutral-900">
                No media yet
              </p>
              <p className="mt-2 text-[14px] text-neutral-500">
                No {mediaFilter === "all" ? "posts" : mediaFilter} returned for @
                {username}.
              </p>
            </div>
          ) : (
            <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredPosts.map((post, index) => (
                <MediaCard key={mediaKey(post, index)} post={post} index={index} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
        {label}
      </p>
      <p className="mt-1 text-[18px] font-semibold">{value}</p>
    </div>
  );
}

function mediaKey(post: InstagramMediaItem, index: number) {
  return String(
    post.id || post.media_id || instagramMediaImageUrl(post) || index,
  );
}

function MediaCard({
  post,
  index,
}: {
  post: InstagramMediaItem;
  index: number;
}) {
  const imageUrl = instagramMediaImageUrl(post);
  const likes = post.like_count ?? post.likes;
  const comments = post.comments_count ?? post.comments;
  const href = post.permalink || post.post_url || undefined;
  const caption = typeof post.caption === "string" ? post.caption.trim() : "";
  const dateLabel = formatPostDate(post.timestamp || post.created_at || null);
  const reel = isReel(post);

  return (
    <li className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
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
}
