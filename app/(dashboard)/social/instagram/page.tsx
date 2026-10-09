"use client";

import { InstagramProfileView } from "@/components/dashboard/social/InstagramProfileView";
import { SocialPlatformTabs } from "@/components/dashboard/social/SocialPlatformTabs";
import TopBar from "@/components/dashboard/topBar";
import useAuthStore from "@/store/AuthsStore";

export default function InstagramSocialPage() {
  const companyName = useAuthStore((s) => s.company_name);

  return (
    <main className="min-w-0 space-y-4 pb-6">
      <TopBar
        user={{ name: companyName || "User" }}
        placeholder="Search Instagram..."
      />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">
            Instagram profile
          </h1>
          <p className="mt-1 text-[13px] text-neutral-500">
            Loads profile info and posts for your connected Instagram handle.
          </p>
        </div>
        <SocialPlatformTabs />
      </div>
      <InstagramProfileView />
    </main>
  );
}
