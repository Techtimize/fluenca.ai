"use client";

import { FacebookProfileView } from "@/components/dashboard/social/FacebookProfileView";
import { SocialPlatformTabs } from "@/components/dashboard/social/SocialPlatformTabs";

export default function FacebookSocialPage() {

  return (
    <main className="min-w-0 space-y-4 pb-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">Facebook</h1>
          <p className="mt-1 text-[13px] text-neutral-500">
            Profile insights and media for your connected Facebook page.
          </p>
        </div>
        <SocialPlatformTabs />
      </div>
      <FacebookProfileView />
    </main>
  );
}