"use client";

import Link from "next/link";
import { Sparkles, Users } from "lucide-react";
import TopBar from "@/components/dashboard/topBar";
import Card from "@/components/shared/card";
import { PAGE_ROUTES } from "@/constant/page-routes";
import useAuthStore from "@/store/AuthsStore";
import { FOCUS_RING } from "@/utils/ui-classes";

export default function CompetitorAnalysisPage() {
  const companyName = useAuthStore((s) => s.company_name);

  return (
    <main className="min-w-0 space-y-4 pb-4">
      <TopBar user={{ name: companyName || "User" }} placeholder="Search competitors..." />

      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Competitor analysis</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Choose AI discovery or manual competitor input. Each mode has its own versions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href={PAGE_ROUTES.COMPETITOR_ANALYSIS_AI}
          className={`group block rounded-3xl focus-visible:outline-none ${FOCUS_RING}`}
        >
          <Card className="h-full p-5 transition-colors group-hover:border-[#C8C6F5] sm:p-6">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#ECEBFF] text-[#5B57E6]">
              <Sparkles className="size-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-[16px] font-semibold text-neutral-900">AI mode</h2>
            <p className="mt-1.5 text-[13px] leading-5 text-neutral-500">
              Auto-discover competitors and browse AI analysis versions from a dropdown.
            </p>
            <p className="mt-4 text-[13px] font-medium text-[#5B57E6]">Open AI analysis →</p>
          </Card>
        </Link>

        <Link
          href={PAGE_ROUTES.COMPETITOR_ANALYSIS_MANUAL}
          className={`group block rounded-3xl focus-visible:outline-none ${FOCUS_RING}`}
        >
          <Card className="h-full p-5 transition-colors group-hover:border-[#C8C6F5] sm:p-6">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#ECEBFF] text-[#5B57E6]">
              <Users className="size-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-[16px] font-semibold text-neutral-900">Manual mode</h2>
            <p className="mt-1.5 text-[13px] leading-5 text-neutral-500">
              Add Instagram and LinkedIn competitors, then browse manual analysis versions.
            </p>
            <p className="mt-4 text-[13px] font-medium text-[#5B57E6]">Open manual analysis →</p>
          </Card>
        </Link>
      </div>
    </main>
  );
}
