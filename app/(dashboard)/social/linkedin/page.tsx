"use client";

import { LinkedInProfileView } from "@/components/dashboard/social/LinkedInProfileView";
import { SocialPlatformTabs } from "@/components/dashboard/social/SocialPlatformTabs";
import TopBar from "@/components/dashboard/topBar";
import useAuthStore from "@/store/AuthsStore";

export default function LinkedInSocialPage() {
  const companyName = useAuthStore((s) => s.company_name);

  return (
    <main className="min-w-0 space-y-4 pb-6">
      <TopBar
        user={{ name: companyName || "User" }}
        placeholder="Search LinkedIn..."
      />
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
