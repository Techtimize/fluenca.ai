"use client";

import { FacebookProfileView } from "@/components/dashboard/social/FacebookProfileView";
import { SocialPlatformTabs } from "@/components/dashboard/social/SocialPlatformTabs";
import { useSocialContent } from "@/components/dashboard/social/useSocialContent";
import TopBar from "@/components/dashboard/topBar";
import useAuthStore from "@/store/AuthsStore";

export default function FacebookSocialPage() {
  const companyName = useAuthStore((s) => s.company_name);
  const { results, isLoading } = useSocialContent();

  return (
    <main className="min-w-0 space-y-4 pb-6">
      <TopBar
        user={{ name: companyName || "User" }}
        placeholder="Search Facebook..."
      />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">
            Facebook page
          </h1>
          <p className="mt-1 text-[13px] text-neutral-500">
            Cover, page header, and timeline styled like Facebook.
          </p>
        </div>
        <SocialPlatformTabs />
      </div>
      <FacebookProfileView results={results} isContentLoading={isLoading} />
    </main>
  );
}
