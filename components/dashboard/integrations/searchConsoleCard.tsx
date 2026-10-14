"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Search, Unplug, XCircle } from "lucide-react";
import Card from "@/components/shared/card";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/errors/error-utils";
import {
  SearchConsoleConnectMutation,
  SearchConsoleDisconnectMutation,
  SearchConsoleIndexCheckMutation,
  SearchConsoleInspectMutation,
  SearchConsoleSelectSiteMutation,
} from "@/routes/bussiness/Bussiness-Mutation";
import {
  SearchConsoleConnectionQuery,
  SearchConsoleOverviewQuery,
  SearchConsoleSitemapsQuery,
  SearchConsoleSitesQuery,
} from "@/routes/bussiness/Bussiness-Query";
import type { SearchRow, UrlInspection } from "@/types/bussiness/search-console-type";

const OVERVIEW_DAYS = 28;
const TOP_ROWS = 5;
const count = new Intl.NumberFormat();

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#F6F7FD] px-4 py-3 ring-1 ring-[#E6E8F5]">
      <p className="text-[12px] text-neutral-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-neutral-900">{value}</p>
    </div>
  );
}

function TopRows({ title, rows }: { title: string; rows: SearchRow[] }) {
  return (
    <div>
      <h3 className="text-[13px] font-semibold text-neutral-900">{title}</h3>
      {rows.length === 0 ? (
        <p className="mt-2 text-[13px] text-neutral-500">No data for this period.</p>
      ) : (
        <ul className="mt-2 space-y-1.5 text-[13px]">
          {rows.slice(0, TOP_ROWS).map((row) => (
            <li key={row.key} className="flex items-center justify-between gap-3">
              <span className="min-w-0 truncate text-neutral-700">{row.key}</span>
              <span className="shrink-0 text-neutral-900">
                <span className="font-medium">{count.format(row.clicks)}</span>
                <span className="text-neutral-500"> clicks · #{row.position.toFixed(1)}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function InspectionRow({ item }: { item: UrlInspection }) {
  return (
    <li className="flex items-start gap-2 text-[13px]">
      {item.indexed ? (
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#0F766E]" aria-hidden="true" />
      ) : (
        <XCircle className="mt-0.5 size-4 shrink-0 text-rose-600" aria-hidden="true" />
      )}
      <div className="min-w-0">
        <p className="truncate font-medium text-neutral-800">{item.url}</p>
        <p className="text-neutral-500">
          {item.error ?? item.coverage_state ?? item.verdict}
          {item.last_crawl_time ? ` · last crawled ${new Date(item.last_crawl_time).toLocaleDateString()}` : ""}
        </p>
      </div>
    </li>
  );
}

export default function SearchConsoleCard() {
  const { data: connection, isLoading, isError, error } = SearchConsoleConnectionQuery();
  const active = Boolean(connection?.connected && connection.status === "active");
  const siteUrl = active ? (connection?.site_url ?? null) : null;
  const sites = SearchConsoleSitesQuery(active);
  const overview = SearchConsoleOverviewQuery(siteUrl, OVERVIEW_DAYS);
  const sitemaps = SearchConsoleSitemapsQuery(siteUrl);
  const connect = SearchConsoleConnectMutation();
  const chooseSite = SearchConsoleSelectSiteMutation();
  const disconnect = SearchConsoleDisconnectMutation();
  const indexCheck = SearchConsoleIndexCheckMutation();
  const inspect = SearchConsoleInspectMutation();
  const [pageUrl, setPageUrl] = useState("");
  const revoked = connection?.connected && connection.status === "revoked";
  const totals = overview.data?.totals;

  return (
    <Card className="space-y-5 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#F6F7FD] text-[#1A73E8] ring-1 ring-[#E6E8F5]">
            <Search className="size-7" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[16px] font-semibold text-neutral-900">Google Search Console</h2>
              {isLoading ? (
                <span className="rounded-full bg-[#F0F1F8] px-2.5 py-0.5 text-[11px] font-medium text-neutral-500">
                  Checking…
                </span>
              ) : active ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F7F4] px-2.5 py-0.5 text-[11px] font-medium text-[#0F766E]">
                  <CheckCircle2 className="size-3.5" aria-hidden="true" />
                  Connected
                </span>
              ) : revoked ? (
                <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-medium text-rose-700">
                  Access removed
                </span>
              ) : (
                <span className="rounded-full bg-[#F6F7FD] px-2.5 py-0.5 text-[11px] font-medium text-neutral-500">
                  Not connected
                </span>
              )}
            </div>
            <p className="mt-1 text-[13px] leading-5 text-neutral-500">
              See how people find your website on Google: clicks, searches, top pages and which pages are indexed.
            </p>
            {connection?.google_email ? (
              <p className="mt-2 text-[13px] font-medium text-neutral-800">{connection.google_email}</p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {connection?.connected ? (
            <Button
              type="button"
              variant="outline"
              disabled={disconnect.isPending}
              onClick={() => disconnect.mutate()}
              className="h-11 gap-2 rounded-full px-4"
            >
              {disconnect.isPending ? <Loader2 className="size-4 animate-spin" /> : <Unplug className="size-4" />}
              Disconnect
            </Button>
          ) : null}
          {!active ? (
            <Button
              type="button"
              disabled={connect.isPending || isLoading}
              onClick={() => connect.mutate()}
              className="h-11 gap-2 rounded-full bg-[#5B57E6] px-5 text-white hover:bg-[#4A46D0]"
            >
              {connect.isPending ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
              {revoked ? "Reconnect Search Console" : "Connect Google Search Console"}
            </Button>
          ) : null}
        </div>
      </div>

      {isError ? (
        <p className="text-[13px] text-rose-700">{getApiErrorMessage(error, "Could not load Search Console")}</p>
      ) : null}

      {active ? (
        <label className="block max-w-md">
          <span className="text-[13px] font-medium text-neutral-800">Website</span>
          <select
            value={connection?.site_url ?? ""}
            disabled={sites.isLoading || chooseSite.isPending}
            onChange={(event) => event.target.value && chooseSite.mutate(event.target.value)}
            className="mt-1 h-11 w-full rounded-xl border border-[#E6E8F5] bg-white px-3 text-[14px] text-neutral-800"
          >
            <option value="">{sites.isLoading ? "Loading websites…" : "Choose a website"}</option>
            {(sites.data?.items ?? []).map((site) => (
              <option key={site.site_url} value={site.site_url}>
                {site.site_url}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {siteUrl ? (
        <div className="space-y-6">
          {overview.isLoading ? (
            <p className="flex items-center gap-2 text-[13px] text-neutral-500">
              <Loader2 className="size-4 animate-spin text-[#5B57E6]" />
              Loading the last {OVERVIEW_DAYS} days…
            </p>
          ) : overview.isError ? (
            <p className="text-[13px] text-rose-700">{getApiErrorMessage(overview.error, "Could not load the search data")}</p>
          ) : totals ? (
            <div className="space-y-5">
              <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-neutral-500">
                Google search, last {OVERVIEW_DAYS} days
              </p>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <Stat label="Clicks" value={count.format(totals.clicks)} />
                <Stat label="Impressions" value={count.format(totals.impressions)} />
                <Stat label="CTR" value={`${(totals.ctr * 100).toFixed(1)}%`} />
                <Stat label="Avg. position" value={totals.position.toFixed(1)} />
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <TopRows title="Top searches" rows={overview.data?.top_queries ?? []} />
                <TopRows title="Top pages" rows={overview.data?.top_pages ?? []} />
              </div>
            </div>
          ) : null}

          <div className="space-y-4 border-t border-[#E6E8F5] pt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-neutral-500">Page indexing</p>
              <Button
                type="button"
                variant="outline"
                disabled={indexCheck.isPending}
                onClick={() => indexCheck.mutate()}
                className="h-9 gap-2 rounded-full px-4 text-[13px]"
              >
                {indexCheck.isPending ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
                Check key pages
              </Button>
            </div>

            {indexCheck.data ? (
              <div className="space-y-2">
                <p className="text-[13px] text-neutral-700">
                  {indexCheck.data.indexed} of {indexCheck.data.checked} key pages are indexed by Google.
                </p>
                <ul className="space-y-2">
                  {indexCheck.data.items.map((item) => (
                    <InspectionRow key={item.url} item={item} />
                  ))}
                </ul>
              </div>
            ) : null}

            <form
              className="flex flex-wrap gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                if (pageUrl.trim()) inspect.mutate(pageUrl.trim());
              }}
            >
              <input
                type="url"
                value={pageUrl}
                onChange={(event) => setPageUrl(event.target.value)}
                placeholder="https://yoursite.com/page"
                aria-label="Page address to check"
                className="h-10 min-w-0 flex-1 rounded-xl border border-[#E6E8F5] bg-white px-3 text-[14px]"
              />
              <Button type="submit" variant="outline" disabled={inspect.isPending} className="h-10 rounded-full px-4">
                {inspect.isPending ? <Loader2 className="size-4 animate-spin" /> : "Check a page"}
              </Button>
            </form>
            {inspect.data ? (
              <ul>
                <InspectionRow item={inspect.data} />
              </ul>
            ) : null}

            <div>
              <h3 className="text-[13px] font-semibold text-neutral-900">Sitemaps</h3>
              {sitemaps.isLoading ? (
                <p className="mt-2 text-[13px] text-neutral-500">Loading…</p>
              ) : (sitemaps.data?.items ?? []).length === 0 ? (
                <p className="mt-2 text-[13px] text-neutral-500">No sitemap submitted to Google yet.</p>
              ) : (
                <ul className="mt-2 space-y-1.5 text-[13px]">
                  {(sitemaps.data?.items ?? []).map((sitemap) => (
                    <li key={sitemap.path} className="flex items-center justify-between gap-3">
                      <span className="min-w-0 truncate text-neutral-700">{sitemap.path}</span>
                      <span className="shrink-0 text-neutral-500">
                        {count.format(sitemap.submitted_urls)} pages
                        {sitemap.errors ? ` · ${sitemap.errors} errors` : ""}
                        {sitemap.is_pending ? " · pending" : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
