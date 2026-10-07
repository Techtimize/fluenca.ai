"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Users } from "lucide-react";
import TopBar from "@/components/dashboard/topBar";
import { PAGE_ROUTES } from "@/constant/page-routes";
import useAuthStore from "@/store/AuthsStore";
import { FOCUS_RING } from "@/utils/ui-classes";

const MODE_TABS = [
  {
    id: "ai",
    label: "AI",
    href: PAGE_ROUTES.COMPETITOR_ANALYSIS_AI,
    icon: Sparkles,
  },
  {
    id: "manual",
    label: "Manual",
    href: PAGE_ROUTES.COMPETITOR_ANALYSIS_MANUAL,
    icon: Users,
  },
] as const;

export default function CompetitorAnalysisShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const companyName = useAuthStore((s) => s.company_name);
  const activeTab =
    MODE_TABS.find((tab) => pathname?.startsWith(tab.href))?.id ?? "ai";

  return (
    <main className="min-w-0 space-y-4 pb-4">
      <TopBar
        user={{ name: companyName || "User" }}
        placeholder="Search competitors..."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div
          role="tablist"
          aria-label="Competitor analysis mode"
          className="inline-flex shrink-0 self-start rounded-full border border-[#E6E8F5] bg-[#F6F7FD] p-1"
        >
          {MODE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                role="tab"
                aria-selected={isActive}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${FOCUS_RING} ${
                  isActive
                    ? "bg-white text-[#5B57E6] shadow-[0_1px_3px_rgba(17,24,39,0.08)]"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                <Icon className="size-3.5" aria-hidden="true" />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      {children}
    </main>
  );
}
