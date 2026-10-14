"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Gauge,
  Loader2,
  Monitor,
  Plug,
  RotateCw,
  Smartphone,
} from "lucide-react";
import { scoreColor } from "@/components/dashboard/website-speed/PageSpeedReport";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAGE_ROUTES } from "@/constant/page-routes";
import {
  GoogleAnalyticsConnectMutation,
  GoogleAnalyticsSelectPropertyMutation,
  InstagramConnectMutation,
} from "@/routes/bussiness/Bussiness-Mutation";
import { accountHandle } from "@/components/dashboard/social/socialUtils";
import {
  GoogleAnalyticsConnectionQuery,
  GoogleAnalyticsOverviewQuery,
  GoogleAnalyticsPropertiesQuery,
  InstagramProfileContentQuery,
  InstagramProfileInfoQuery,
  InstagramProfileInteractionsQuery,
  OnboardingDetailsQuery,
  SocialAccountsQuery,
} from "@/routes/bussiness/Bussiness-Query";
import { metricTotal, normalizeInsightMetrics } from "@/types/bussiness/instagram-insights-type";
import { normalizeInstagramProfileContent, normalizeInstagramProfileInfo } from "@/types/bussiness/instagram-type";
import { engagementRate } from "@/utils/insta-utils";
import {
  findSocialAccount,
  isSocialAccountConnected,
  normalizeSocialAccounts,
} from "@/types/bussiness/social-accounts-type";
import { PageSpeedQuery } from "@/routes/page-speed/PageSpeed-Query";
import { FOCUS_RING } from "@/utils/ui-classes";

const PRIMARY_ACTION = `inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#5452F6] px-4 text-sm font-medium text-white transition-colors hover:bg-[#4544C9] disabled:opacity-60 ${FOCUS_RING}`;
const SECONDARY_ACTION = `inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#EEF0FF] px-4 text-sm font-medium text-[#4544C9] transition-colors hover:bg-[#E3E6FF] ${FOCUS_RING}`;

const GA_OVERVIEW_DAYS = 28;

type ConnectionState = "checking" | "connected" | "revoked" | "disconnected";

function StatusPill({ state }: { state: ConnectionState }) {
  if (state === "checking") {
    return <span className="rounded-full bg-[#F0F1F8] px-2 py-0.5 text-[11px] font-medium text-neutral-500">Checking…</span>;
  }
  if (state === "connected") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F7F4] px-2 py-0.5 text-[11px] font-medium text-[#0F766E]">
        <CheckCircle2 className="size-3" aria-hidden="true" />
        Connected
      </span>
    );
  }
  if (state === "revoked") {
    return <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700">Access removed</span>;
  }
  return <span className="rounded-full bg-[#F6F7FD] px-2 py-0.5 text-[11px] font-medium text-neutral-500">Not connected</span>;
}

function SourceCard({
  icon,
  title,
  description,
  status,
  detail,
  children,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  status?: ReactNode;
  detail?: string | null;
  children?: ReactNode;
  action: ReactNode;
}) {
  return (
    <section className="flex min-w-0 flex-col rounded-2xl border border-[#E6E8F5] bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#F6F7FD] ring-1 ring-[#E6E8F5]">
          {icon}
        </span>
        {status}
      </div>
      <h3 className="mt-4 text-[13px] font-semibold text-neutral-900">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-neutral-500">{description}</p>
      {detail ? <p className="mt-2 truncate text-xs font-medium text-neutral-800">{detail}</p> : null}
      {children}
      <div className="mt-auto pt-5">{action}</div>
    </section>
  );
}

function connectionState(
  isLoading: boolean,
  connection?: { connected: boolean; status: string | null } | null,
): ConnectionState {
  if (isLoading) return "checking";
  if (connection?.connected && connection.status === "active") return "connected";
  if (connection?.connected && connection.status === "revoked") return "revoked";
  return "disconnected";
}

function ConnectAction({
  state,
  title,
  reportHref,
  reportLabel = "View report",
  isPending,
  onConnect,
}: {
  state: ConnectionState;
  title: string;
  reportHref: string;
  reportLabel?: string;
  isPending: boolean;
  onConnect: () => void;
}) {
  if (state === "connected") {
    return (
      <Link href={reportHref} className={SECONDARY_ACTION}>
        {reportLabel}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={onConnect}
      disabled={state === "checking" || isPending}
      aria-label={`${state === "revoked" ? "Reconnect" : "Connect"} ${title}`}
      className={PRIMARY_ACTION}
    >
      {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Plug className="size-4" aria-hidden="true" />}
      {state === "revoked" ? "Reconnect" : "Connect"}
    </button>
  );
}

export function GoogleAnalyticsSourceCard() {
  const { data: connection, isLoading } = GoogleAnalyticsConnectionQuery();
  const connect = GoogleAnalyticsConnectMutation();
  const state = connectionState(isLoading, connection);
  const connected = state === "connected";
  const properties = GoogleAnalyticsPropertiesQuery(connected);
  const chooseProperty = GoogleAnalyticsSelectPropertyMutation();
  const propertyItems = properties.data?.items ?? [];
  // Same window as the full report, so both share one cached overview.
  const overview = GoogleAnalyticsOverviewQuery(connected ? (connection?.property_id ?? null) : null, GA_OVERVIEW_DAYS);
  const totals = overview.data?.totals;

  return (
    <SourceCard
      icon={<BarChart3 className="size-6 text-[#E37400]" aria-hidden="true" />}
      title="Google Analytics"
      description="Website traffic, users, sessions and where visitors come from."
      status={<StatusPill state={state} />}
      detail={connected ? connection?.google_email : null}
      action={
        <ConnectAction
          state={state}
          title="Google Analytics"
          reportHref={PAGE_ROUTES.GOOGLE_ANALYTICS}
          isPending={connect.isPending}
          onConnect={() => connect.mutate()}
        />
      }
    >
      {connected ? (
        <div className="mt-4">
          <p id="ga-property-label" className="flex items-center gap-1.5 text-xs font-medium text-neutral-600">
            Property
            {chooseProperty.isPending ? (
              <Loader2 className="size-3 animate-spin text-[#5452F6]" aria-label="Saving property" />
            ) : null}
          </p>
          <Select
            value={connection?.property_id ?? null}
            disabled={properties.isLoading || chooseProperty.isPending}
            onValueChange={(next) => {
              if (typeof next === "string" && next !== connection?.property_id) chooseProperty.mutate(next);
            }}
          >
            <SelectTrigger
              aria-labelledby="ga-property-label"
              className="mt-1 h-10 w-full rounded-xl border-[#E6E8F5] bg-white px-3 text-[13px] text-neutral-800"
            >
              <SelectValue placeholder={properties.isLoading ? "Loading properties…" : "Choose a property"}>
                {(value: string | null) => {
                  const property = propertyItems.find((item) => item.property_id === value);
                  return property ? `${property.display_name} (${property.account_name})` : connection?.property_name;
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="start">
              <SelectGroup>
                {propertyItems.map((property) => (
                  <SelectItem key={property.property_id} value={property.property_id}>
                    {property.display_name} ({property.account_name})
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      ) : null}
      {connected && connection?.property_id ? (
        <>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <StatTile
              label="Page views"
              value={totals ? compactNumber.format(totals.page_views) : null}
              loading={overview.isLoading}
            />
            <StatTile
              label="Engagement rate"
              value={totals ? `${Math.round(totals.engagement_rate * 100)}%` : null}
              loading={overview.isLoading}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-neutral-400">
            {overview.isError ? "Could not load the overview." : `Last ${GA_OVERVIEW_DAYS} days`}
          </p>
        </>
      ) : null}
    </SourceCard>
  );
}

function hostLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }
}

function SpeedResult({
  label,
  icon: Icon,
  query,
}: {
  label: string;
  icon: LucideIcon;
  query: ReturnType<typeof PageSpeedQuery>;
}) {
  const performance = query.data?.categories.find((c) => c.id === "performance");
  const score = performance?.score ?? query.data?.score ?? null;
  const seo = query.data?.categories.find((c) => c.id === "seo")?.score ?? null;
  // Lighthouse's audit id is "speed-index"; match the title too in case the backend renames it.
  const speedIndex = query.data?.lab_metrics.find(
    (m) => m.id === "speed-index" || m.title.toLowerCase() === "speed index",
  )?.display_value;

  return (
    <div className="flex flex-col items-center gap-2 rounded-xl bg-[#F1F4FF] px-3 py-3">
      <span className="flex items-center gap-1.5 text-xs text-neutral-600">
        <Icon className="size-3.5" aria-hidden="true" />
        {label}
      </span>
      {query.isLoading ? (
        <span className="grid size-12 place-items-center" aria-label={`Checking ${label.toLowerCase()} speed`}>
          <Loader2 className="size-5 animate-spin text-[#5452F6]" aria-hidden="true" />
        </span>
      ) : query.isError ? (
        <span className="grid size-12 place-items-center text-xs font-medium text-rose-600">Failed</span>
      ) : (
        <span
          className={`grid size-12 place-items-center rounded-full bg-white text-base font-semibold ring-4 ${scoreColor(score)}`}
          aria-label={`${label} performance score ${score ?? "unavailable"}`}
        >
          {score ?? "–"}
        </span>
      )}
      {query.data ? (
        <dl className="w-full space-y-1 border-t border-white pt-2 text-[11px]">
          <div className="flex items-center justify-between gap-2">
            <dt className="text-neutral-500">SEO</dt>
            <dd className={`font-semibold ${scoreColor(seo)}`}>{seo ?? "–"}</dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="truncate text-neutral-500">Speed index</dt>
            <dd className="shrink-0 font-semibold text-neutral-900">{speedIndex || "–"}</dd>
          </div>
        </dl>
      ) : null}
    </div>
  );
}

export function WebsiteSpeedSourceCard() {
  const { data: company, isSuccess } = OnboardingDetailsQuery();
  // A blank url makes the backend check the company website itself.
  const url = company?.website_url?.trim() ?? "";
  const mobile = PageSpeedQuery(url, "mobile", isSuccess);
  const desktop = PageSpeedQuery(url, "desktop", isSuccess);
  const checking = mobile.isFetching || desktop.isFetching;
  const failed = mobile.isError || desktop.isError;
  const site = url || mobile.data?.url || desktop.data?.url || "";

  return (
    <SourceCard
      icon={<Gauge className="size-6 text-[#5452F6]" aria-hidden="true" />}
      title="Website speed"
      description={
        checking
          ? "Running Google PageSpeed Insights… this can take up to a minute."
          : "Performance score from Google PageSpeed Insights."
      }
      detail={site ? hostLabel(site) : null}
      action={
        failed && !checking ? (
          <button
            type="button"
            onClick={() => {
              if (mobile.isError) void mobile.refetch();
              if (desktop.isError) void desktop.refetch();
            }}
            className={SECONDARY_ACTION}
          >
            <RotateCw className="size-4" aria-hidden="true" />
            Try again
          </button>
        ) : (
          <Link href={PAGE_ROUTES.WEBSITE_SPEED} className={SECONDARY_ACTION}>
            View details
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        )
      }
    >
      <div className="mt-4 grid grid-cols-2 gap-2">
        <SpeedResult label="Mobile" icon={Smartphone} query={mobile} />
        <SpeedResult label="Desktop" icon={Monitor} query={desktop} />
      </div>
    </SourceCard>
  );
}

const compactNumber = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

function StatTile({ label, value, loading }: { label: string; value: string | null; loading: boolean }) {
  return (
    <div className="min-w-0 rounded-xl bg-[#F1F4FF] px-3 py-2.5">
      <p className="truncate text-xs text-neutral-600">{label}</p>
      {loading && value == null ? (
        <Loader2 className="mt-1.5 size-4 animate-spin text-[#5452F6]" aria-label={`Loading ${label.toLowerCase()}`} />
      ) : (
        <p className="mt-1 truncate text-sm font-semibold text-neutral-900">{value ?? "–"}</p>
      )}
    </div>
  );
}

export function InstagramSourceCard() {
  const { data, isLoading } = SocialAccountsQuery();
  const connect = InstagramConnectMutation();
  const account = findSocialAccount(normalizeSocialAccounts(data), "instagram");
  const connected = isSocialAccountConnected(account);
  const state: ConnectionState = isLoading ? "checking" : connected ? "connected" : "disconnected";
  const username = connected ? accountHandle(account) : null;

  // Same chain as the Instagram profile view: profile by username, then insights by its account id.
  const profileQ = InstagramProfileInfoQuery(username);
  const contentQ = InstagramProfileContentQuery(username);
  const profile = normalizeInstagramProfileInfo(profileQ.data);
  const interactionsQ = InstagramProfileInteractionsQuery(profile.instagramId);

  const followers =
    profile.followers ?? (typeof account?.followers_count === "number" ? account.followers_count : null);
  const engagement = engagementRate(normalizeInstagramProfileContent(contentQ.data) ?? [], followers);
  const interactions = normalizeInsightMetrics(interactionsQ.data) ?? [];
  const totalInteractions =
    metricTotal(interactions, "total_interactions", "interactions") ??
    (interactions.length ? interactions.reduce((sum, m) => sum + (m.total ?? 0), 0) : null);
  const accountsEngaged = metricTotal(interactions, "accounts_engaged");
  const insightsLoading = profileQ.isLoading || interactionsQ.isLoading;

  return (
    <SourceCard
      icon={<Image src="/assets/insta.png" alt="" width={24} height={24} className="size-6 object-contain" />}
      title="Instagram"
      description={
        connected
          ? "Profile engagement and how people interacted with your account."
          : "Connect your Instagram account to track followers, engagement and interactions."
      }
      status={<StatusPill state={state} />}
      detail={username ? `@${username}` : null}
      action={
        <ConnectAction
          state={state}
          title="Instagram"
          reportHref={PAGE_ROUTES.CONNECTORS}
          reportLabel="Manage account"
          isPending={connect.isPending}
          onConnect={() => connect.mutate()}
        />
      }
    >
      {connected ? (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <StatTile
            label="Followers"
            value={followers != null ? compactNumber.format(followers) : null}
            loading={profileQ.isLoading}
          />
          <StatTile
            label="Engagement"
            value={engagement != null ? `${engagement.toFixed(2)}%` : null}
            loading={profileQ.isLoading || contentQ.isLoading}
          />
          <StatTile
            label="Interactions"
            value={totalInteractions != null ? compactNumber.format(totalInteractions) : null}
            loading={insightsLoading}
          />
          <StatTile
            label="Accounts engaged"
            value={accountsEngaged != null ? compactNumber.format(accountsEngaged) : null}
            loading={insightsLoading}
          />
        </div>
      ) : null}
    </SourceCard>
  );
}
