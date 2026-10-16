"use client";

import { InstagramProfileView } from "@/components/dashboard/social/InstagramProfileView";
import { SocialPlatformTabs } from "@/components/dashboard/social/SocialPlatformTabs";

export default function InstagramSocialPage() {

  return (
    <main className="min-w-0 max-w-full space-y-4 overflow-x-clip pb-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">Instagram</h1>
          <p className="mt-1 text-[13px] text-neutral-500">
            Profile, live insights, and media for your connected Instagram
            handle.
          </p>
        </div>
        <SocialPlatformTabs />
      </div>
      <InstagramProfileView />
    </main>
  );
}