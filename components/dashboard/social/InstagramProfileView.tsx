"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Grid3X3,
  Heart,
  Loader2,
  MessageCircle,
  Settings,
  UserRound,
} from "lucide-react";
import { SocialNotConnected } from "@/components/dashboard/social/SocialNotConnected";
import {
  accountHandle,
  formatCount,
  unwrapInstagramProfile,
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
import {
  instagramMediaImageUrl,
  normalizeInstagramProfileContent,
} from "@/types/bussiness/instagram-type";
import { FOCUS_RING } from "@/utils/ui-classes";

export function InstagramProfileView() {
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
  } = InstagramProfileInfoQuery(connected && username ? username : null);

  const {
    data: contentRaw,
    isLoading: isContentLoading,
    isError: isContentError,
    error: contentError,
  } = InstagramProfileContentQuery(connected && username ? username : null);

  const profile = unwrapInstagramProfile(profileRaw);
  const posts = normalizeInstagramProfileContent(contentRaw);

  const displayName =
    profile.full_name ||
    connectedAccount?.display_name ||
    username ||
    "Instagram";
  const bio = profile.biography || null;
  const website = profile.website || connectedAccount?.profile_url || null;
  const avatar =
    profile.profile_pic_url ||
    (typeof connectedAccount?.profile_picture_url === "string"
      ? connectedAccount.profile_picture_url
      : null);
  const followers =
    profile.followers_count ??
    (typeof connectedAccount?.followers_count === "number"
      ? connectedAccount.followers_count
      : null);
  const following =
    profile.follows_count ??
    (typeof connectedAccount?.follows_count === "number"
      ? connectedAccount.follows_count
      : null);
  const mediaCount = profile.media_count ?? posts.length;

  if (isAccountsLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-sm text-neutral-500">
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
      <div className="mx-auto max-w-md rounded-2xl border border-[#DBDBDB] bg-white px-6 py-12 text-center">
        <p className="text-[16px] font-semibold text-[#262626]">
          Instagram handle missing
        </p>
        <p className="mt-2 text-[14px] text-[#8E8E8E]">
          Reconnect Instagram so Fluenca can read the connected username and
          load profile content.
        </p>
        <Link
          href={PAGE_ROUTES.INTEGRATIONS}
          className={`mt-4 inline-flex text-[14px] font-semibold text-[#0095F6] hover:underline ${FOCUS_RING}`}
        >
          Open Integrations
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[935px] overflow-hidden rounded-2xl border border-[#DBDBDB] bg-white text-[#262626] shadow-sm">
      <div className="flex items-center justify-between border-b border-[#DBDBDB] px-4 py-3">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/insta.png"
            alt=""
            width={20}
            height={20}
            className="size-5 object-contain"
          />
          <span className="text-[15px] font-semibold tracking-tight">
            {username}
          </span>
        </div>
        <Link
          href={PAGE_ROUTES.INTEGRATIONS}
          className={`grid size-8 place-items-center rounded-full text-[#262626] hover:bg-[#FAFAFA] ${FOCUS_RING}`}
          aria-label="Account settings"
        >
          <Settings className="size-5" />
        </Link>
      </div>

      <div className="px-4 py-6 sm:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-16">
          <div className="mx-auto shrink-0 sm:mx-0">
            <div className="rounded-full bg-gradient-to-tr from-[#F58529] via-[#E1306C] to-[#C13584] p-[3px]">
              <div className="rounded-full bg-white p-[2px]">
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={String(avatar)}
                    alt={displayName}
                    className="size-[86px] rounded-full object-cover sm:size-[150px]"
                  />
                ) : (
                  <div className="grid size-[86px] place-items-center rounded-full bg-[#EFEFEF] text-[#8E8E8E] sm:size-[150px]">
                    <UserRound className="size-10 sm:size-16" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[20px] font-light tracking-tight sm:text-[28px]">
                {username}
              </h1>
              <span className="rounded-lg bg-[#EFEFEF] px-3 py-1.5 text-[13px] font-semibold">
                Connected
              </span>
            </div>

            <div className="mt-5 flex gap-8 text-[14px] sm:text-[16px]">
              <div>
                <span className="font-semibold">{formatCount(mediaCount)}</span>{" "}
                posts
              </div>
              <div>
                <span className="font-semibold">{formatCount(followers)}</span>{" "}
                followers
              </div>
              <div>
                <span className="font-semibold">{formatCount(following)}</span>{" "}
                following
              </div>
            </div>

            <div className="mt-5 space-y-1 text-[14px] leading-5">
              <p className="font-semibold">{displayName}</p>
              {bio ? (
                <p className="whitespace-pre-wrap text-[#262626]">{bio}</p>
              ) : null}
              {website ? (
                <a
                  href={String(website)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#00376B] hover:underline"
                >
                  {String(website).replace(/^https?:\/\//, "")}
                </a>
              ) : null}
            </div>

            {isProfileLoading ? (
              <p className="mt-3 inline-flex items-center gap-1.5 text-[12px] text-[#8E8E8E]">
                <Loader2 className="size-3.5 animate-spin" />
                Syncing profile for @{username}…
              </p>
            ) : null}
            {isProfileError ? (
              <p className="mt-3 text-[12px] text-[#ED4956]">
                {getApiErrorMessage(
                  profileError,
                  "Couldn’t load Instagram profile details",
                )}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center border-t border-[#DBDBDB]">
        <div className="inline-flex items-center gap-1.5 border-t border-[#262626] px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.12em]">
          <Grid3X3 className="size-3.5" />
          Posts
        </div>
      </div>

      {isContentLoading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-[#8E8E8E]">
          <Loader2 className="size-5 animate-spin text-[#E1306C]" />
          Loading @{username} content…
        </div>
      ) : isContentError ? (
        <div className="px-6 py-12 text-center">
          <p className="text-[14px] text-[#ED4956]">
            {getApiErrorMessage(
              contentError,
              "Couldn’t load Instagram profile content",
            )}
          </p>
        </div>
      ) : posts.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <p className="text-[18px] font-light">No Posts Yet</p>
          <p className="mt-2 text-[14px] text-[#8E8E8E]">
            No media returned for @{username} from Instagram.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-3 gap-[1px] bg-[#DBDBDB] sm:gap-[3px]">
          {posts.map((post, index) => {
            const imageUrl = instagramMediaImageUrl(post);
            const likes = post.like_count ?? post.likes;
            const comments = post.comments_count ?? post.comments;
            const href = post.permalink || post.post_url || undefined;
            const key = String(post.id || post.media_id || imageUrl || index);

            const cell = (
              <>
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt={post.caption || `Instagram post ${index + 1}`}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="grid size-full place-items-center text-[#8E8E8E]">
                    <Grid3X3 className="size-6" />
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-4 bg-black/0 text-white opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-1 text-[14px] font-semibold">
                    <Heart className="size-4 fill-white" />{" "}
                    {typeof likes === "number" ? formatCount(likes) : "—"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[14px] font-semibold">
                    <MessageCircle className="size-4 fill-white" />{" "}
                    {typeof comments === "number" ? formatCount(comments) : "—"}
                  </span>
                </div>
              </>
            );

            return (
              <li
                key={key}
                className="group relative aspect-square bg-[#FAFAFA]"
              >
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute inset-0 block"
                  >
                    {cell}
                  </a>
                ) : (
                  cell
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
