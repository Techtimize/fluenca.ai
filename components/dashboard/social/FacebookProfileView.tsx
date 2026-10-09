"use client";

import Link from "next/link";
import {
  Globe2,
  Loader2,
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Share2,
  UserRound,
} from "lucide-react";
import { FacebookIcon } from "@/components/shared/brandIcons";
import type { ContentGenerationResultItem } from "@/components/dashboard/content/utils";
import { SocialNotConnected } from "@/components/dashboard/social/SocialNotConnected";
import {
  accountDisplayName,
  accountHandle,
  platformPosts,
} from "@/components/dashboard/social/socialUtils";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { SocialAccountsQuery } from "@/routes/bussiness/Bussiness-Query";
import {
  findSocialAccount,
  isSocialAccountConnected,
  normalizeSocialAccounts,
} from "@/types/bussiness/social-accounts-type";
import { FOCUS_RING } from "@/utils/ui-classes";

function formatDate(value?: string) {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function FacebookProfileView({
  results = [],
  isContentLoading = false,
}: {
  results?: ContentGenerationResultItem[];
  isContentLoading?: boolean;
}) {
  const { data: accountsData, isLoading: isAccountsLoading } =
    SocialAccountsQuery();
  const account = findSocialAccount(
    normalizeSocialAccounts(accountsData),
    "facebook",
  );
  const connected = isSocialAccountConnected(account);
  const name = accountDisplayName(account) || "Facebook Page";
  const handle = accountHandle(account);
  const avatar =
    typeof account?.profile_picture_url === "string"
      ? account.profile_picture_url
      : null;
  const posts = platformPosts(results, "facebook");

  if (isAccountsLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-sm text-neutral-500">
        <Loader2 className="size-5 animate-spin text-[#1877F2]" />
        Loading Facebook…
      </div>
    );
  }

  if (!connected) {
    return (
      <SocialNotConnected
        platform="Facebook"
        accentClassName="bg-[#1877F2] text-white"
      />
    );
  }

  return (
    <div className="mx-auto max-w-[680px] overflow-hidden rounded-2xl border border-[#CCD0D5] bg-[#F0F2F5] shadow-sm">
      <div className="bg-white">
        <div className="relative h-[160px] bg-gradient-to-br from-[#1877F2] via-[#4B92F7] to-[#8BB7F9] sm:h-[220px]">
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent" />
        </div>
        <div className="relative px-4 pb-4 sm:px-6">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-3">
              <div className="rounded-full bg-white p-1 shadow-md">
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatar}
                    alt={name}
                    className="size-[112px] rounded-full object-cover sm:size-[136px]"
                  />
                ) : (
                  <div className="grid size-[112px] place-items-center rounded-full bg-[#E4E6EB] text-[#65676B] sm:size-[136px]">
                    <UserRound className="size-14" />
                  </div>
                )}
              </div>
              <div className="pb-2">
                <h1 className="text-[24px] font-bold leading-tight text-[#050505] sm:text-[28px]">
                  {name}
                </h1>
                {handle ? (
                  <p className="mt-0.5 text-[14px] text-[#65676B]">@{handle}</p>
                ) : null}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pb-2">
              <span className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#E7F3FF] px-3 text-[14px] font-semibold text-[#1877F2]">
                <FacebookIcon className="size-4" />
                Connected
              </span>
              <Link
                href={PAGE_ROUTES.INTEGRATIONS}
                className={`inline-flex h-9 items-center rounded-md bg-[#E4E6EB] px-3 text-[14px] font-semibold text-[#050505] hover:bg-[#D8DADF] ${FOCUS_RING}`}
              >
                Manage
              </Link>
            </div>
          </div>

          <div className="mt-4 flex gap-5 border-t border-[#CCD0D5] pt-1 text-[15px] font-semibold text-[#65676B]">
            <span className="border-b-[3px] border-[#1877F2] px-1 py-3 text-[#1877F2]">
              Posts
            </span>
            <span className="px-1 py-3">About</span>
            <span className="px-1 py-3">Photos</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-3 sm:p-4">
        <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-[#E4E6EB]">
          <div className="flex items-center gap-2 text-[13px] text-[#65676B]">
            <Globe2 className="size-4" />
            Public · Fluenca generated Facebook content
          </div>
        </div>

        {isContentLoading ? (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-white py-14 text-sm text-[#65676B] shadow-sm">
            <Loader2 className="size-5 animate-spin text-[#1877F2]" />
            Loading posts…
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-xl bg-white px-5 py-12 text-center shadow-sm">
            <p className="text-[17px] font-semibold text-[#050505]">
              No posts to show
            </p>
            <p className="mt-1 text-[14px] text-[#65676B]">
              Facebook-generated content will show up in this feed.
            </p>
            <Link
              href={PAGE_ROUTES.CONTENT}
              className={`mt-4 inline-flex text-[14px] font-semibold text-[#1877F2] hover:underline ${FOCUS_RING}`}
            >
              Open Content
            </Link>
          </div>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-[#E4E6EB]"
            >
              <div className="flex items-start justify-between gap-3 p-3">
                <div className="flex items-center gap-2.5">
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatar}
                      alt=""
                      className="size-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="grid size-10 place-items-center rounded-full bg-[#E4E6EB] text-[#65676B]">
                      <UserRound className="size-5" />
                    </span>
                  )}
                  <div>
                    <p className="text-[15px] font-semibold text-[#050505]">
                      {name}
                    </p>
                    <p className="text-[12px] text-[#65676B]">
                      {formatDate(post.createdAt)} · Public
                    </p>
                  </div>
                </div>
                <MoreHorizontal className="size-5 text-[#65676B]" />
              </div>

              {(post.caption || post.title) && (
                <p className="px-3 pb-3 text-[15px] leading-5 text-[#050505]">
                  {post.caption || post.title}
                </p>
              )}

              {post.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.imageUrl}
                  alt={post.title || "Facebook post"}
                  className="max-h-[520px] w-full object-cover"
                />
              ) : null}

              <div className="grid grid-cols-3 border-t border-[#E4E6EB] text-[14px] font-semibold text-[#65676B]">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 hover:bg-[#F0F2F5]"
                >
                  <ThumbsUp className="size-4" /> Like
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 hover:bg-[#F0F2F5]"
                >
                  <MessageCircle className="size-4" /> Comment
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 hover:bg-[#F0F2F5]"
                >
                  <Share2 className="size-4" /> Share
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
