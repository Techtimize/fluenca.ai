"use client";

import Link from "next/link";
import { ArrowLeft, BarChart3 } from "lucide-react";
import GoogleAnalyticsCard from "@/components/dashboard/integrations/googleAnalyticsCard";
import TopBar from "@/components/dashboard/topBar";
import { PAGE_ROUTES } from "@/constant/page-routes";
import useAuthStore from "@/store/AuthsStore";
import { FOCUS_RING } from "@/utils/ui-classes";

export default function GoogleAnalyticsPage() {
  const companyName = useAuthStore((s) => s.company_name);

  return (
    <main className="min-w-0 space-y-4 pb-6">
      <TopBar user={{ name: companyName || "User" }} placeholder="Search analytics..." />

      <section className="rounded-[28px] border border-[#E6E8F5] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_55%)] p-5 sm:p-7">
        <Link
          href={PAGE_ROUTES.DASHBOARD}
          className={`inline-flex items-center gap-1.5 rounded-full text-[13px] font-medium text-neutral-600 hover:text-neutral-900 ${FOCUS_RING}`}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to dashboard
        </Link>
        <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#E37400] ring-1 ring-[#E6E8F5]">
          <BarChart3 className="size-3.5" aria-hidden="true" />
          Google Analytics
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">Website traffic</h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-6 text-neutral-600">
          Users, sessions and where your visitors come from over the last 28 days.
        </p>
      </section>

      <GoogleAnalyticsCard />
    </main>
  );
}
