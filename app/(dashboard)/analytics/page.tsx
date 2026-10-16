"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { Activity, Plug } from "lucide-react";
import GoalAgentSection from "@/components/dashboard/analytics/GoalAgentSection";
import {
  FacebookSourceCard,
  GoogleAnalyticsSourceCard,
  InstagramSourceCard,
  LinkedInSourceCard,
  SearchConsoleSourceCard,
  WebsiteSpeedSourceCard,
  useAnalyticsSources,
  type AnalyticsSourceId,
} from "@/components/dashboard/cards/dataSourceCards";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { FOCUS_RING } from "@/utils/ui-classes";

const SOURCES: { id: AnalyticsSourceId; label: string; Card: ComponentType }[] = [
  { id: "instagram", label: "Instagram", Card: InstagramSourceCard },
  { id: "facebook", label: "Facebook", Card: FacebookSourceCard },
  { id: "linkedin", label: "LinkedIn", Card: LinkedInSourceCard },
  { id: "google-analytics", label: "Google Analytics", Card: GoogleAnalyticsSourceCard },
  { id: "search-console", label: "Search Console", Card: SearchConsoleSourceCard },
  { id: "website-speed", label: "Website speed", Card: WebsiteSpeedSourceCard },
];

/** One place for the goal agent's progress and the numbers from every connected account. */
export default function AnalyticsPage() {
  const { connected, isLoading } = useAnalyticsSources();
  const live = SOURCES.filter((source) => connected[source.id]);
  const missing = SOURCES.filter((source) => !connected[source.id]);

  return (
    <main className="min-w-0 space-y-6 pb-6">
      <section className="rounded-[28px] border border-[#E6E8F5] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_55%)] p-5 sm:p-7">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5B57E6] ring-1 ring-[#E6E8F5]">
          <Activity className="size-3.5" aria-hidden="true" />
          Analytics
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">Your analytics</h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-6 text-neutral-600">
          What your goal agent is doing, and how every connected account is performing.
        </p>
      </section>

      <GoalAgentSection />

      <section className="space-y-3" aria-labelledby="accounts-heading">
        <div>
          <h2 id="accounts-heading" className="text-lg font-semibold tracking-tight text-neutral-900">
            Connected accounts
          </h2>
          <p className="text-[13px] text-neutral-500">Live numbers from each account you&apos;ve connected.</p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF]" />
            ))}
          </div>
        ) : live.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {live.map(({ id, Card }) => (
              <Card key={id} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-[#E6E8F5] bg-white px-4 py-6 text-center text-[13px] text-neutral-500">
            No accounts connected yet.
          </p>
        )}

        {!isLoading && missing.length ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E6E8F5] bg-white px-4 py-3">
            <p className="text-[13px] text-neutral-600">
              Not connected: <span className="text-neutral-900">{missing.map((s) => s.label).join(", ")}</span>
            </p>
            <Link
              href={PAGE_ROUTES.CONNECTORS}
              className={`inline-flex items-center gap-1.5 rounded-full bg-[#EEF0FF] px-3.5 py-1.5 text-[13px] font-medium text-[#4544C9] hover:bg-[#E3E6FF] ${FOCUS_RING}`}
            >
              <Plug className="size-3.5" aria-hidden="true" />
              Connect accounts
            </Link>
          </div>
        ) : null}
      </section>
    </main>
  );
}
