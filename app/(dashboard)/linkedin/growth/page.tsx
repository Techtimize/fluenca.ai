"use client";

import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import LinkedInScoreCard from "@/components/dashboard/linkedin-growth/LinkedInScoreCard";
import ProfileRewriteCard from "@/components/dashboard/linkedin-growth/ProfileRewriteCard";
import ProfileScoreCard from "@/components/dashboard/linkedin-growth/ProfileScoreCard";
import VoiceCard from "@/components/dashboard/linkedin-growth/VoiceCard";
import WeekPostsCard from "@/components/dashboard/linkedin-growth/WeekPostsCard";
import { SocialNotConnected } from "@/components/dashboard/social/SocialNotConnected";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { ProfileScoreQuery, SocialAccountsQuery } from "@/routes/bussiness/Bussiness-Query";
import {
  findSocialAccount,
  isSocialAccountConnected,
  normalizeSocialAccounts,
} from "@/types/bussiness/social-accounts-type";
import { FOCUS_RING } from "@/utils/ui-classes";

export default function LinkedInGrowthPage() {
  const { data: accountsData, isLoading } = SocialAccountsQuery();
  const connected = isSocialAccountConnected(findSocialAccount(normalizeSocialAccounts(accountsData), "linkedin"));
  const hasProfileScore = Boolean(ProfileScoreQuery(connected).data);

  return (
    <main className="min-w-0 space-y-4 pb-6">
      <section className="rounded-[28px] border border-[#E6E8F5] bg-[radial-gradient(ellipse_at_top_left,#E3EFFB_0%,#FFFFFF_55%)] p-5 sm:p-7">
        <Link
          href={PAGE_ROUTES.SOCIAL_LINKEDIN}
          className={`inline-flex items-center gap-1 rounded text-[13px] font-medium text-[#0A66C2] hover:underline ${FOCUS_RING}`}
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          LinkedIn
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">LinkedIn growth</h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-6 text-neutral-600">
          Score your profile and fix what matters most, sharpen your headline and About, and start posting in your own
          voice.
        </p>
      </section>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white py-20 text-sm text-neutral-500">
          <Loader2 className="size-5 animate-spin text-[#0A66C2]" />
          Loading LinkedIn…
        </div>
      ) : !connected ? (
        <SocialNotConnected platform="LinkedIn" accentClassName="bg-[#0A66C2] text-white" />
      ) : (
        <>
          <div className="grid gap-4 xl:grid-cols-2">
            <LinkedInScoreCard />
            <ProfileScoreCard />
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            <ProfileRewriteCard hasProfileScore={hasProfileScore} />
            <VoiceCard />
          </div>
          <WeekPostsCard />
        </>
      )}
    </main>
  );
}
