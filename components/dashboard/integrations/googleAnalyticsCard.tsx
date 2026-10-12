"use client";

import { BarChart3, CheckCircle2, Loader2, Unplug } from "lucide-react";
import Card from "@/components/shared/card";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/errors/error-utils";
import {
  GoogleAnalyticsConnectMutation,
  GoogleAnalyticsDisconnectMutation,
  GoogleAnalyticsSelectPropertyMutation,
} from "@/routes/google-analytics/GoogleAnalytics-Mutation";
import {
  GoogleAnalyticsConnectionQuery,
  GoogleAnalyticsOverviewQuery,
  GoogleAnalyticsPropertiesQuery,
} from "@/routes/google-analytics/GoogleAnalytics-Query";

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

function TopList({ title, rows }: { title: string; rows: { label: string; value: number }[] }) {
  return (
    <div>
      <h3 className="text-[13px] font-semibold text-neutral-900">{title}</h3>
      {rows.length === 0 ? (
        <p className="mt-2 text-[13px] text-neutral-500">No data for this period.</p>
      ) : (
        <ul className="mt-2 space-y-1.5 text-[13px]">
          {rows.map((row) => (
            <li key={row.label} className="flex items-center justify-between gap-3">
              <span className="min-w-0 truncate text-neutral-700">{row.label}</span>
              <span className="shrink-0 font-medium text-neutral-900">{count.format(row.value)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function GoogleAnalyticsCard() {
  const { data: connection, isLoading, isError, error } = GoogleAnalyticsConnectionQuery();
  const active = Boolean(connection?.connected && connection.status === "active");
  const properties = GoogleAnalyticsPropertiesQuery(active);
  const overview = GoogleAnalyticsOverviewQuery(active ? (connection?.property_id ?? null) : null, OVERVIEW_DAYS);
  const connect = GoogleAnalyticsConnectMutation();
  const chooseProperty = GoogleAnalyticsSelectPropertyMutation();
  const disconnect = GoogleAnalyticsDisconnectMutation();
  const revoked = connection?.connected && connection.status === "revoked";
  const totals = overview.data?.totals;

  return (
    <Card className="space-y-5 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#F6F7FD] text-[#E37400] ring-1 ring-[#E6E8F5]">
            <BarChart3 className="size-7" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[16px] font-semibold text-neutral-900">Google Analytics</h2>
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
              {revoked
                ? "Fluenca can no longer read this Google Analytics account. Connect it again to see your traffic."
                : "Connect your website's Google Analytics 4 to see visits, top pages and where your traffic comes from."}
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
              {connect.isPending ? <Loader2 className="size-4 animate-spin" /> : <BarChart3 className="size-4" />}
              {revoked ? "Reconnect Google Analytics" : "Connect Google Analytics"}
            </Button>
          ) : null}
        </div>
      </div>

      {isError ? (
        <p className="text-[13px] text-rose-700">{getApiErrorMessage(error, "Could not load Google Analytics")}</p>
      ) : null}

      {active ? (
        <label className="block max-w-md">
          <span className="text-[13px] font-medium text-neutral-800">Property</span>
          <select
            value={connection?.property_id ?? ""}
            disabled={properties.isLoading || chooseProperty.isPending}
            onChange={(event) => event.target.value && chooseProperty.mutate(event.target.value)}
            className="mt-1 h-11 w-full rounded-xl border border-[#E6E8F5] bg-white px-3 text-[14px] text-neutral-800"
          >
            <option value="">{properties.isLoading ? "Loading properties…" : "Choose a property"}</option>
            {(properties.data?.items ?? []).map((property) => (
              <option key={property.property_id} value={property.property_id}>
                {property.display_name} ({property.account_name})
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {active && connection?.property_id ? (
        overview.isLoading ? (
          <p className="flex items-center gap-2 text-[13px] text-neutral-500">
            <Loader2 className="size-4 animate-spin text-[#5B57E6]" />
            Loading the last {OVERVIEW_DAYS} days…
          </p>
        ) : overview.isError ? (
          <p className="text-[13px] text-rose-700">{getApiErrorMessage(overview.error, "Could not load the overview")}</p>
        ) : totals ? (
          <div className="space-y-5">
            <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-neutral-500">
              Last {OVERVIEW_DAYS} days
            </p>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Stat label="Sessions" value={count.format(totals.sessions)} />
              <Stat label="Users" value={count.format(totals.users)} />
              <Stat label="Page views" value={count.format(totals.page_views)} />
              <Stat label="Engagement rate" value={`${Math.round(totals.engagement_rate * 100)}%`} />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <TopList
                title="Top pages"
                rows={(overview.data?.top_pages ?? [])
                  .slice(0, TOP_ROWS)
                  .map((page) => ({ label: page.path, value: page.page_views }))}
              />
              <TopList
                title="Traffic channels"
                rows={(overview.data?.channels ?? [])
                  .slice(0, TOP_ROWS)
                  .map((channel) => ({ label: channel.channel, value: channel.sessions }))}
              />
            </div>
          </div>
        ) : null
      ) : null}
    </Card>
  );
}
