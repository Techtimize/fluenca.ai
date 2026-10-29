"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import ToolsTab from "@/components/dashboard/linkedin-coach/ToolsTab";
import WeeklyTab from "@/components/dashboard/linkedin-coach/WeeklyTab";
import { SocialNotConnected } from "@/components/dashboard/social/SocialNotConnected";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { SocialAccountsQuery } from "@/routes/bussiness/Bussiness-Query";
import {
  findSocialAccount,
  isSocialAccountConnected,
  normalizeSocialAccounts,
} from "@/types/bussiness/social-accounts-type";
import { FOCUS_RING } from "@/utils/ui-classes";

const TABS = [
  { id: "weekly", label: "This week" },
  { id: "tools", label: "Tools" },
] as const;

type Tab = (typeof TABS)[number]["id"];

/** LinkedIn coach: next week's plan and content, and writing tools. */
export default function LinkedInCoachPage() {
  const [tab, setTab] = useState<Tab>("weekly");
  const { data: accountsData, isLoading } = SocialAccountsQuery();
  const connected = isSocialAccountConnected(findSocialAccount(normalizeSocialAccounts(accountsData), "linkedin"));

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
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">LinkedIn coach</h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-6 text-neutral-600">
          A content plan, carousel and repurposed posts every week, and tools to write better posts whenever you need
          them.
        </p>

        <div className="mt-4 inline-flex rounded-full bg-white/80 p-1 ring-1 ring-[#E6E8F5]" role="tablist" aria-label="Coach sections">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${FOCUS_RING} ${
                tab === id ? "bg-[#0A66C2] text-white" : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white py-20 text-sm text-neutral-500">
          <Loader2 className="size-5 animate-spin text-[#0A66C2]" />
          Loading LinkedIn…
        </div>
      ) : !connected ? (
        <SocialNotConnected platform="LinkedIn" accentClassName="bg-[#0A66C2] text-white" />
      ) : tab === "weekly" ? (
        <WeeklyTab />
      ) : (
        <ToolsTab />
      )}
    </main>
  );
}
