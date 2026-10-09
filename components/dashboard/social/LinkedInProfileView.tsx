"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bookmark,
  Globe2,
  Loader2,
  MessageSquare,
  MoreHorizontal,
  Repeat2,
  Send,
  ThumbsUp,
  UserRound,
} from "lucide-react";
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
  });
}

export function LinkedInProfileView({
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
    "Connected with Fluenca";
  const posts = platformPosts(results, "linkedin");

  if (isAccountsLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-sm text-neutral-500">
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
    <div className="mx-auto grid max-w-[1128px] gap-3 lg:grid-cols-[288px_minmax(0,1fr)]">
      <aside className="overflow-hidden rounded-xl border border-[#E0E0E0] bg-white shadow-sm">
        <div className="h-[56px] bg-gradient-to-r from-[#0A66C2] to-[#378FE9]" />
        <div className="relative px-4 pb-4">
          <div className="-mt-8">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatar}
                alt={name}
                className="size-16 rounded-full border-2 border-white object-cover"
              />
            ) : (
              <div className="grid size-16 place-items-center rounded-full border-2 border-white bg-[#E9E5DF] text-[#666666]">
                <UserRound className="size-8" />
              </div>
            )}
          </div>
          <h1 className="mt-2 text-[16px] font-semibold text-[#000000E6]">
            {name}
          </h1>
          <p className="mt-0.5 text-[12px] leading-4 text-[#00000099]">
            {headline}
          </p>
          {handle ? (
            <p className="mt-2 text-[12px] text-[#00000099]">@{handle}</p>
          ) : null}
          <div className="mt-3 flex items-center gap-1.5 text-[12px] text-[#00000099]">
            <Globe2 className="size-3.5" />
            Connected account
          </div>
          <Link
            href={PAGE_ROUTES.INTEGRATIONS}
            className={`mt-4 inline-flex h-8 w-full items-center justify-center rounded-full border border-[#0A66C2] text-[13px] font-semibold text-[#0A66C2] hover:bg-[#EAF4FF] ${FOCUS_RING}`}
          >
            Manage connection
          </Link>
        </div>
      </aside>

      <section className="space-y-3">
        <div className="flex items-center gap-2 rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 shadow-sm">
          <Image
            src="/assets/linkedin.png"
            alt=""
            width={20}
            height={20}
            className="size-5 object-contain"
          />
          <div>
            <p className="text-[14px] font-semibold text-[#000000E6]">
              LinkedIn feed
            </p>
            <p className="text-[12px] text-[#00000099]">
              Posts generated for LinkedIn in Fluenca
            </p>
          </div>
        </div>

        {isContentLoading ? (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-[#E0E0E0] bg-white py-14 text-sm text-[#00000099] shadow-sm">
            <Loader2 className="size-5 animate-spin text-[#0A66C2]" />
            Loading posts…
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-xl border border-[#E0E0E0] bg-white px-5 py-12 text-center shadow-sm">
            <p className="text-[16px] font-semibold text-[#000000E6]">
              No LinkedIn posts yet
            </p>
            <p className="mt-1 text-[13px] text-[#00000099]">
              Generate LinkedIn content and it will appear in this feed.
            </p>
            <Link
              href={PAGE_ROUTES.CONTENT}
              className={`mt-4 inline-flex text-[14px] font-semibold text-[#0A66C2] hover:underline ${FOCUS_RING}`}
            >
              Open Content
            </Link>
          </div>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="overflow-hidden rounded-xl border border-[#E0E0E0] bg-white shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 p-3">
                <div className="flex items-start gap-2.5">
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatar}
                      alt=""
                      className="size-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="grid size-12 place-items-center rounded-full bg-[#E9E5DF] text-[#666666]">
                      <UserRound className="size-6" />
                    </span>
                  )}
                  <div>
                    <p className="text-[14px] font-semibold text-[#000000E6]">
                      {name}
                    </p>
                    <p className="text-[12px] leading-4 text-[#00000099]">
                      {headline}
                    </p>
                    <p className="mt-0.5 text-[12px] text-[#00000099]">
                      {formatDate(post.createdAt)} ·{" "}
                      <Globe2 className="inline size-3" />
                    </p>
                  </div>
                </div>
                <MoreHorizontal className="size-5 text-[#00000099]" />
              </div>

              {(post.caption || post.title) && (
                <p className="whitespace-pre-wrap px-3 pb-3 text-[14px] leading-5 text-[#000000E6]">
                  {post.caption || post.title}
                </p>
              )}

              {post.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.imageUrl}
                  alt={post.title || "LinkedIn post"}
                  className="max-h-[480px] w-full object-cover"
                />
              ) : null}

              <div className="grid grid-cols-4 border-t border-[#E0E0E0] text-[13px] font-semibold text-[#00000099]">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 hover:bg-[#F3F2EF]"
                >
                  <ThumbsUp className="size-4" /> Like
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 hover:bg-[#F3F2EF]"
                >
                  <MessageSquare className="size-4" /> Comment
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 hover:bg-[#F3F2EF]"
                >
                  <Repeat2 className="size-4" /> Repost
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 hover:bg-[#F3F2EF]"
                >
                  <Send className="size-4" /> Send
                </button>
              </div>
              <div className="flex items-center justify-end border-t border-[#E0E0E0] px-3 py-2 text-[#00000066]">
                <Bookmark className="size-4" />
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
