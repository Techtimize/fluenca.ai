"use client";

import { LinkedInProfileView } from "@/components/dashboard/social/LinkedInProfileView";
import { SocialPlatformTabs } from "@/components/dashboard/social/SocialPlatformTabs";

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
        <SocialPlatformTabs />
      </div>
      <LinkedInProfileView />
    </main>
  );
}