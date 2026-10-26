"use client";

import Link from "next/link";
import { ListChecks, TrendingUp } from "lucide-react";
import { LinkedInProfileView } from "@/components/dashboard/social/LinkedInProfileView";
import { SocialPlatformTabs } from "@/components/dashboard/social/SocialPlatformTabs";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { FOCUS_RING } from "@/utils/ui-classes";

export default function LinkedInSocialPage() {

  return (
    <main className="min-w-0 space-y-4 pb-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">LinkedIn</h1>
          <p className="mt-1 text-[13px] text-neutral-500">
            Profile insights and media for your connected LinkedIn account.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={PAGE_ROUTES.LINKEDIN_COACH}
            className={`inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-[#0A66C2] ring-1 ring-[#D6E4F5] hover:bg-[#F6F9FD] ${FOCUS_RING}`}
          >
            <ListChecks className="size-4" aria-hidden="true" />
            Coach
          </Link>
          <Link
            href={PAGE_ROUTES.LINKEDIN_GROWTH}
            className={`inline-flex items-center gap-1.5 rounded-full bg-[#0A66C2] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#09579f] ${FOCUS_RING}`}
          >
            <TrendingUp className="size-4" aria-hidden="true" />
            Growth plan
          </Link>
          <SocialPlatformTabs />
        </div>
      </div>
      <LinkedInProfileView />
    </main>
  );
}
