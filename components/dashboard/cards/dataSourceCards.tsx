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
  Search,
  Smartphone,
  TrendingUp,
} from "lucide-react";
import { FacebookIcon } from "@/components/shared/brandIcons";
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
import { getApiErrorMessage } from "@/errors/error-utils";
import {
  GoogleAnalyticsConnectMutation,
  GoogleAnalyticsSelectPropertyMutation,
  InstagramConnectMutation,
  RefreshOrganicTrafficMutation,
} from "@/routes/bussiness/Bussiness-Mutation";
import { accountDisplayName, accountHandle } from "@/components/dashboard/social/socialUtils";
import {
  GoogleAnalyticsConnectionQuery,
  GoogleAnalyticsOverviewQuery,
  GoogleAnalyticsPropertiesQuery,
  InstagramProfileContentQuery,
  InstagramProfileInfoQuery,
  InstagramProfileInteractionsQuery,
  FacebookProfileContentQuery,
  LinkedInProfileContentQuery,
  OnboardingDetailsQuery,
  OrganicTrafficQuery,
  SearchConsoleConnectionQuery,
  SearchConsoleOverviewQuery,
  SocialAccountsQuery,
} from "@/routes/bussiness/Bussiness-Query";
import {
  normalizeLinkedInProfileContent,
  normalizeSocialProfileContent,
  socialMediaComments,
  socialMediaLikes,
} from "@/types/bussiness/social-profile-content-type";
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

const usdCompact = new Intl.NumberFormat("en", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const monthLabel = (month: string) => {
  const [year, m] = month.split("-").map(Number);
  return year && m ? new Date(year, m - 1).toLocaleDateString("en", { month: "short" }) : month;
};

/** Estimated monthly Google visits to the company website (no connection needed). */
export function OrganicTrafficSourceCard() {
  const traffic = OrganicTrafficQuery();
  const refresh = RefreshOrganicTrafficMutation();
  const data = traffic.data;
  const loading = traffic.isLoading;
  const topCountry = data?.top_countries[0];
  const history = data?.history ?? [];
  const peak = Math.max(1, ...history.map((month) => month.organic_traffic));

  return (
    <SourceCard
      icon={<TrendingUp className="size-6 text-[#0F9D58]" aria-hidden="true" />}
      title="Organic traffic"
      description={
        loading
          ? "Estimating your Google traffic… this can take up to 20 seconds."
          : "Estimated monthly visits from Google, from the keywords you rank for."
      }
      detail={data?.domain ?? null}
      action={
        <button
          type="button"
          onClick={() => refresh.mutate({})}
          disabled={loading || refresh.isPending}
          className={SECONDARY_ACTION}
        >
          {refresh.isPending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <RotateCw className="size-4" aria-hidden="true" />
          )}
          {refresh.isPending ? "Checking…" : "Check again"}
        </button>
      }
    >
      {traffic.isError ? (
        <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2.5 text-xs text-rose-700">
          {getApiErrorMessage(traffic.error, "Could not load organic traffic.")}
        </p>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <StatTile
              label="Monthly visits"
              value={data ? compactNumber.format(data.organic_traffic) : null}
              loading={loading}
            />
            <StatTile
              label="Traffic value"
              value={data ? usdCompact.format(data.traffic_value_usd) : null}
              loading={loading}
            />
            <StatTile label="Keywords" value={data ? compactNumber.format(data.keywords) : null} loading={loading} />
            <StatTile
              label="Top country"
              value={data ? (topCountry ? `${topCountry.country} · ${Math.round(topCountry.share)}%` : "–") : null}
              loading={loading}
            />
          </div>

          {history.length > 1 ? (
            <div className="mt-3" aria-label={`Organic traffic over the last ${history.length} months`}>
              <div className="flex h-12 items-end gap-1">
                {history.map((month) => (
                  <span
                    key={month.month}
                    title={`${monthLabel(month.month)}: ${compactNumber.format(month.organic_traffic)} visits`}
                    className="flex-1 rounded-t bg-[#C9E9D6] last:bg-[#0F9D58]"
                    style={{ height: `${Math.max(6, (month.organic_traffic / peak) * 100)}%` }}
                  />
                ))}
              </div>
              <div className="mt-1 flex gap-1 text-[10px] text-neutral-400">
                {history.map((month) => (
                  <span key={month.month} className="flex-1 text-center">
                    {monthLabel(month.month)}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {data ? (
            <p className="mt-1.5 text-[11px] text-neutral-400">
              {data.from_cache ? "Saved report · " : ""}Checked {new Date(data.checked_at).toLocaleDateString()}
              {data.country ? ` · details for ${data.country}` : ""}
            </p>
          ) : null}
        </>
      )}
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
            label="Profile Views"
            value={accountsEngaged != null ? compactNumber.format(accountsEngaged) : null}
            loading={insightsLoading}
          />
        </div>
      ) : null}
    </SourceCard>
  );
}

function ManageLink({ href, label = "Open report" }: { href: string; label?: string }) {
  return (
    <Link href={href} className={SECONDARY_ACTION}>
      {label}
      <ArrowRight className="size-4" aria-hidden="true" />
    </Link>
  );
}

function sumOf(values: (number | null)[]) {
  const numbers = values.filter((v): v is number => v != null);
  return numbers.length ? numbers.reduce((total, v) => total + v, 0) : null;
}

/** Posts returned plus their likes and comments, from the profile-content endpoints. */
function postStats(raw: Parameters<typeof normalizeSocialProfileContent>[0]) {
  const posts = normalizeSocialProfileContent(raw);
  return {
    posts: posts.length,
    likes: sumOf(posts.map(socialMediaLikes)),
    comments: sumOf(posts.map(socialMediaComments)),
  };
}

const formatStat = (value: number | null) => (value != null ? compactNumber.format(value) : null);

export function FacebookSourceCard() {
  const { data, isLoading } = SocialAccountsQuery();
  const account = findSocialAccount(normalizeSocialAccounts(data), "facebook");
  const connected = isSocialAccountConnected(account);
  const state: ConnectionState = isLoading ? "checking" : connected ? "connected" : "disconnected";
  const contentQ = FacebookProfileContentQuery(connected);
  const stats = postStats(contentQ.data);
  const followers = typeof account?.followers_count === "number" ? account.followers_count : null;

  return (
    <SourceCard
      icon={<FacebookIcon className="size-6 text-[#1877F2]" />}
      title="Facebook"
      description="Page audience and how your recent posts performed."
      status={<StatusPill state={state} />}
      detail={connected ? accountDisplayName(account) : null}
      action={<ManageLink href={PAGE_ROUTES.CONNECTORS} label="Manage account" />}
    >
      {connected ? (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <StatTile label="Followers" value={formatStat(followers)} loading={false} />
          <StatTile label="Recent posts" value={formatStat(stats.posts)} loading={contentQ.isLoading} />
          <StatTile label="Likes" value={formatStat(stats.likes)} loading={contentQ.isLoading} />
          <StatTile label="Comments" value={formatStat(stats.comments)} loading={contentQ.isLoading} />
        </div>
      ) : null}
    </SourceCard>
  );
}

export function LinkedInSourceCard() {
  const { data, isLoading } = SocialAccountsQuery();
  const account = findSocialAccount(normalizeSocialAccounts(data), "linkedin");
  const connected = isSocialAccountConnected(account);
  const state: ConnectionState = isLoading ? "checking" : connected ? "connected" : "disconnected";
  const contentQ = LinkedInProfileContentQuery(connected);
  const profile = normalizeLinkedInProfileContent(contentQ.data);
  const stats = postStats(contentQ.data);
  const posts = profile.postsCountReturned ?? stats.posts;

  return (
    <SourceCard
      icon={<Image src="/assets/linkedin.png" alt="" width={24} height={24} className="size-6 object-contain" />}
      title="LinkedIn"
      description="Your recent LinkedIn posts and the reactions they got."
      status={<StatusPill state={state} />}
      detail={connected ? profile.name || accountDisplayName(account) : null}
      action={<ManageLink href={PAGE_ROUTES.SOCIAL_LINKEDIN} label="Open LinkedIn" />}
    >
      {connected ? (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <StatTile label="Recent posts" value={formatStat(posts)} loading={contentQ.isLoading} />
          <StatTile label="Reactions" value={formatStat(stats.likes)} loading={contentQ.isLoading} />
          <StatTile label="Comments" value={formatStat(stats.comments)} loading={contentQ.isLoading} />
          <StatTile
            label="Avg. reactions"
            value={stats.likes != null && posts ? (stats.likes / posts).toFixed(1) : null}
            loading={contentQ.isLoading}
          />
        </div>
      ) : null}
    </SourceCard>
  );
}

export function SearchConsoleSourceCard() {
  const { data: connection, isLoading } = SearchConsoleConnectionQuery();
  const state = connectionState(isLoading, connection);
  const siteUrl = state === "connected" ? (connection?.site_url ?? null) : null;
  const overview = SearchConsoleOverviewQuery(siteUrl, GA_OVERVIEW_DAYS);
  const totals = overview.data?.totals;
  const loading = overview.isLoading;

  return (
    <SourceCard
      icon={<Search className="size-6 text-[#1A73E8]" aria-hidden="true" />}
      title="Search Console"
      description={`How people found you on Google in the last ${GA_OVERVIEW_DAYS} days.`}
      status={<StatusPill state={state} />}
      detail={siteUrl}
      action={<ManageLink href={PAGE_ROUTES.GOOGLE_SEARCH_CONSOLE} />}
    >
      {siteUrl ? (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <StatTile label="Clicks" value={totals ? compactNumber.format(totals.clicks) : null} loading={loading} />
          <StatTile
            label="Impressions"
            value={totals ? compactNumber.format(totals.impressions) : null}
            loading={loading}
          />
          <StatTile label="CTR" value={totals ? `${(totals.ctr * 100).toFixed(1)}%` : null} loading={loading} />
          <StatTile label="Avg. position" value={totals ? totals.position.toFixed(1) : null} loading={loading} />
        </div>
      ) : null}
    </SourceCard>
  );
}

export type AnalyticsSourceId =
  | "instagram"
  | "facebook"
  | "linkedin"
  | "google-analytics"
  | "search-console"
  | "website-speed";

/** Which sources are connected, so the analytics page can show only those. */
export function useAnalyticsSources() {
  const accounts = SocialAccountsQuery();
  const ga = GoogleAnalyticsConnectionQuery();
  const sc = SearchConsoleConnectionQuery();
  const company = OnboardingDetailsQuery();
  const list = normalizeSocialAccounts(accounts.data);
  const social = (platform: string) => isSocialAccountConnected(findSocialAccount(list, platform));

  const connected: Record<AnalyticsSourceId, boolean> = {
    instagram: social("instagram"),
    facebook: social("facebook"),
    linkedin: social("linkedin"),
    "google-analytics": connectionState(false, ga.data) === "connected",
    "search-console": connectionState(false, sc.data) === "connected",
    // The backend checks the company website itself, so speed is available once onboarding is loaded.
    "website-speed": company.isSuccess,
  };
  return {
    connected,
    isLoading: accounts.isLoading || ga.isLoading || sc.isLoading || company.isLoading,
  };
}
