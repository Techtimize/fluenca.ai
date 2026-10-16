"use client";

import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import SearchConsoleCard from "@/components/dashboard/integrations/searchConsoleCard";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { FOCUS_RING } from "@/utils/ui-classes";

export default function GoogleSearchConsolePage() {

  return (
    <main className="min-w-0 space-y-4 pb-6">
      <section className="rounded-[28px] border border-[#E6E8F5] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_55%)] p-5 sm:p-7">
        <Link
          href={PAGE_ROUTES.DASHBOARD}
          className={`inline-flex items-center gap-1.5 rounded-full text-[13px] font-medium text-neutral-600 hover:text-neutral-900 ${FOCUS_RING}`}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to dashboard
        </Link>
        <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1A73E8] ring-1 ring-[#E6E8F5]">
          <Search className="size-3.5" aria-hidden="true" />
          Google Search Console
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">Search performance</h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-6 text-neutral-600">
          How people find your website on Google over the last 28 days: clicks, impressions, top searches and
          pages, sitemaps, and which pages are indexed.
        </p>
      </section>

      <SearchConsoleCard />
    </main>
  );
}
