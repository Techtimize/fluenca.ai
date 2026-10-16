"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Gauge, Link2, Loader2, Monitor, RotateCw, Smartphone } from "lucide-react";
import { PageSpeedReport } from "@/components/dashboard/website-speed/PageSpeedReport";
import { Button } from "@/components/ui/button";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { getApiErrorMessage } from "@/errors/error-utils";
import { OnboardingDetailsQuery } from "@/routes/bussiness/Bussiness-Query";
import { PageSpeedQuery } from "@/routes/page-speed/PageSpeed-Query";
import type { PageSpeedStrategy } from "@/routes/page-speed/page-speed.routes";
import { FOCUS_RING } from "@/utils/ui-classes";

const STRATEGIES: { id: PageSpeedStrategy; label: string; icon: typeof Smartphone }[] = [
  { id: "mobile", label: "Mobile", icon: Smartphone },
  { id: "desktop", label: "Desktop", icon: Monitor },
];

export default function WebsiteSpeedPage() {
  const { data: company, isSuccess } = OnboardingDetailsQuery();
  const companyUrl = company?.website_url?.trim() ?? "";

  // Same url as the dashboard card by default, so its cached results show instantly.
  const [checkedUrl, setCheckedUrl] = useState<string | null>(null);
  const [draftUrl, setDraftUrl] = useState<string | null>(null);
  const [strategy, setStrategy] = useState<PageSpeedStrategy>("mobile");
  const url = checkedUrl ?? companyUrl;

  const queries = {
    mobile: PageSpeedQuery(url, "mobile", isSuccess),
    desktop: PageSpeedQuery(url, "desktop", isSuccess),
  };
  const active = queries[strategy];

  const anyFetching = queries.mobile.isFetching || queries.desktop.isFetching;

  const rerun = () => {
    void queries.mobile.refetch();
    void queries.desktop.refetch();
  };

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
        <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5452F6] ring-1 ring-[#E6E8F5]">
          <Gauge className="size-3.5" aria-hidden="true" />
          Website speed
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">PageSpeed report</h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-6 text-neutral-600">
          Performance, accessibility, best practices and SEO from Google PageSpeed Insights, with what to fix first.
          Your company website is checked by default; enter another page to check it instead.
        </p>
      </section>

      <section className="space-y-5 rounded-[28px] border border-[#E6E8F5] bg-[#F8F9FD] p-4 sm:p-5">
        <form
          className="flex flex-col gap-3 sm:flex-row sm:items-center"
          onSubmit={(event) => {
            event.preventDefault();
            const next = (draftUrl ?? url).trim();
            if (next === url) rerun();
            else setCheckedUrl(next);
          }}
        >
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Page address to check</span>
            <Link2
              className="pointer-events-none absolute inset-s-4 top-1/2 size-5 -translate-y-1/2 text-neutral-500"
              aria-hidden="true"
            />
            <input
              type="text"
              value={draftUrl ?? url}
              onChange={(event) => setDraftUrl(event.target.value)}
              placeholder="https://yoursite.com or a page on it"
              className={`h-12 w-full rounded-xl border border-[#E6E8F5] bg-white pe-4 ps-12 text-[15px] text-neutral-900 ${FOCUS_RING}`}
            />
          </label>
          <Button
            type="submit"
            disabled={anyFetching}
            className="h-12 gap-2 rounded-xl bg-linear-to-r from-[#4F46E5] to-[#6D6AF5] px-6 text-[15px] font-semibold text-white shadow-[0_6px_16px_-6px_rgba(79,70,229,0.6)] hover:opacity-95"
          >
            {anyFetching ? (
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            ) : (
              <RotateCw className="size-5" aria-hidden="true" />
            )}
            {(draftUrl ?? url).trim() === url ? "Re-run check" : "Check this page"}
          </Button>
        </form>

        <div role="tablist" aria-label="Device" className="flex flex-wrap gap-3">
          {STRATEGIES.map((item) => {
            const query = queries[item.id];
            const selected = strategy === item.id;
            return (
              <div
                key={item.id}
                className={`flex w-full items-center rounded-xl border bg-white transition-colors sm:w-58 ${
                  selected ? "border-[#4F46E5] bg-[#F6F5FF] ring-1 ring-[#4F46E5]/20" : "border-[#E6E8F5] hover:bg-[#F8F9FF]"
                }`}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setStrategy(item.id)}
                  className={`flex min-w-0 flex-1 items-center gap-3 rounded-s-xl py-3 ps-5 text-[15px] font-medium text-neutral-900 ${FOCUS_RING}`}
                >
                  <item.icon className={`size-5 ${selected ? "text-[#4F46E5]" : "text-neutral-500"}`} aria-hidden="true" />
                  {item.label}
                  {query.isError ? <span className="text-[12px] font-medium text-rose-600">Failed</span> : null}
                </button>
                <button
                  type="button"
                  onClick={() => void query.refetch()}
                  disabled={query.isFetching}
                  aria-label={`Re-run ${item.label.toLowerCase()} check`}
                  className={`me-2 grid size-9 shrink-0 place-items-center rounded-full text-[#4F46E5] hover:bg-[#EEF0FF] disabled:cursor-default ${FOCUS_RING}`}
                >
                  <RotateCw className={`size-4.5 ${query.isFetching ? "animate-spin" : ""}`} aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>

        <div role="tabpanel">
          {active.data ? (
            <PageSpeedReport result={active.data} />
          ) : active.isError ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
              <p className="text-[13px] text-rose-700">
                {getApiErrorMessage(active.error, "Could not check the website speed")}
              </p>
              <Button type="button" variant="outline" onClick={() => void active.refetch()} className="h-9 rounded-full">
                Try again
              </Button>
            </div>
          ) : (
            <p className="flex items-center gap-2 text-[13px] text-neutral-500">
              <Loader2 className="size-4 animate-spin text-[#5B57E6]" aria-hidden="true" />
              Checking the {strategy} version… this can take up to a minute.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
