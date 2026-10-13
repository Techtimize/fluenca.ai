"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  Eye,
  HeartHandshake,
  Loader2,
  MousePointerClick,
  RefreshCw,
  TrendingUp,
  Users,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { formatCount } from "@/components/dashboard/social/socialUtils";
import { getApiErrorMessage } from "@/errors/error-utils";
import {
  latestSeriesValue,
  metricTotal,
  normalizeDemographics,
  normalizeInsightMetrics,
  pickMetric,
  type DemographicBreakdown,
  type InsightMetric,
} from "@/types/bussiness/instagram-insights-type";
import { FOCUS_RING } from "@/utils/ui-classes";
import { InstagramDemographicsBar } from "./instagramDemographicsbar";

type InsightBundle = {
  reach?: unknown;
  interactions?: unknown;
  demographics?: unknown;
  follows?: unknown;
  views?: unknown;
  actions?: unknown;
};

type LoadState = {
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
  isFetching?: boolean;
  refetch?: () => void;
};

type Props = {
  accountId: string | null;
  data: InsightBundle;
  states: {
    reach: LoadState;
    interactions: LoadState;
    demographics: LoadState;
    follows: LoadState;
    views: LoadState;
    actions: LoadState;
  };
  onRefreshAll: () => void;
  demographicsAudience: "followers" | "engaged-audience";
  onDemographicsAudienceChange: (v: "followers" | "engaged-audience") => void;
};

type TabId = "overview" | "audience" | "growth" | "engagement" | "actions";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "audience", label: "Audience" },
  { id: "growth", label: "Growth" },
  { id: "engagement", label: "Engagement" },
  { id: "actions", label: "Actions" },
];

function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  loading,
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof Eye;
  loading?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-3.5 sm:p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
            {label}
          </p>
          <p className="mt-1.5 truncate text-[22px] font-semibold tracking-tight text-neutral-900">
            {loading ? "…" : value}
          </p>
          <p className="mt-1 text-[12px] leading-4 text-neutral-500">{hint}</p>
        </div>
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#FFF0F5] text-[#E1306C]">
          <Icon className="size-4" />
        </span>
      </div>
    </div>
  );
}

function StatusPill({
  label,
  ok,
  loading,
  error,
}: {
  label: string;
  ok: boolean;
  loading?: boolean;
  error?: boolean;
}) {
  const tone = error
    ? "border-rose-200 bg-rose-50 text-rose-700"
    : loading
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : ok
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-neutral-200 bg-neutral-50 text-neutral-500";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${tone}`}
    >
      {loading ? <Loader2 className="size-3 animate-spin" /> : null}
      {label}
      {!loading && !error && ok ? " · ready" : null}
      {error ? " · failed" : null}
      {loading ? " · loading" : null}
    </span>
  );
}

function MiniBars({
  series,
  accent = "#E1306C",
}: {
  series?: InsightMetric["series"] | null;
  accent?: string;
}) {
  const safeSeries = Array.isArray(series) ? series : [];
  if (!safeSeries.length) {
    return (
      <p className="py-6 text-center text-[13px] text-neutral-400">No daily series yet</p>
    );
  }
  const max = Math.max(1, ...safeSeries.map((p) => p.value));
  const points = safeSeries.slice(-14);
  return (
    <div className="flex h-28 items-end gap-1.5">
      {points.map((p) => (
        <div key={`${p.label}-${p.endTime}`} className="flex min-w-0 flex-1 flex-col items-center gap-1">
          <div
            className="w-full rounded-t-md transition-all"
            style={{
              height: `${Math.max(6, (p.value / max) * 100)}%`,
              backgroundColor: accent,
              opacity: 0.75 + (p.value / max) * 0.25,
            }}
            title={`${p.label}: ${formatCount(p.value)}`}
          />
          <span className="truncate text-[9px] text-neutral-400">{p.label}</span>
        </div>
      ))}
    </div>
  );
}

function MetricList({ metrics }: { metrics?: InsightMetric[] | null }) {
  const safeMetrics = Array.isArray(metrics) ? metrics : [];
  if (!safeMetrics.length) {
    return (
      <p className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-8 text-center text-[13px] text-neutral-500">
        No metrics in this response yet.
      </p>
    );
  }
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {safeMetrics.map((m) => (
        <li
          key={m.id}
          className="rounded-xl border border-neutral-200 bg-neutral-50/80 px-3.5 py-3"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-neutral-900">
                Reached by accounts
              </p>
              {m.description ? (
                <p className="mt-0.5 line-clamp-2 text-[11px] text-neutral-500">
                  Unique accounts that saw your content
                </p>
              ) : null}
            </div>
            <p className="shrink-0 text-[16px] font-semibold text-neutral-900">
              {formatCount(m.total)}
            </p>
          </div>
          {m.period ? (
            <p className="mt-2 text-[10px] uppercase tracking-wide text-neutral-400">
              Period · {m.period}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function SectionShell({
  title,
  subtitle,
  loading,
  error,
  errorMessage,
  children,
  onRetry,
}: {
  title: string;
  subtitle: string;
  loading?: boolean;
  error?: boolean;
  errorMessage?: string;
  children: React.ReactNode;
  onRetry?: () => void;
}) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-[16px] font-semibold text-neutral-900">{title}</h3>
          <p className="mt-0.5 text-[13px] text-neutral-500">{subtitle}</p>
        </div>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className={`inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 text-[12px] font-medium text-neutral-700 hover:bg-neutral-50 ${FOCUS_RING}`}
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Retry
          </button>
        ) : null}
      </div>
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-neutral-500">
          <Loader2 className="size-5 animate-spin text-[#E1306C]" />
          Loading insights…
        </div>
      ) : error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-6 text-center text-[13px] text-rose-700">
          {errorMessage || "Couldn’t load this insight."}
        </div>
      ) : (
        children
      )}
    </section>
  );
}

export function InstagramInsightsPanel({
  accountId,
  data,
  states,
  onRefreshAll,
  demographicsAudience,
  onDemographicsAudienceChange,
}: Props) {
  const [tab, setTab] = useState<TabId>("overview");

  const reach = useMemo(
    () => normalizeInsightMetrics(data.reach) ?? [],
    [data.reach],
  );
  const interactions = useMemo(
    () => normalizeInsightMetrics(data.interactions) ?? [],
    [data.interactions],
  );
  const follows = useMemo(
    () => normalizeInsightMetrics(data.follows) ?? [],
    [data.follows],
  );
  const views = useMemo(
    () => normalizeInsightMetrics(data.views) ?? [],
    [data.views],
  );
  const actions = useMemo(
    () => normalizeInsightMetrics(data.actions) ?? [],
    [data.actions],
  );
  const demographics = useMemo(() => {
    const list = normalizeDemographics(data.demographics);
    return Array.isArray(list)
      ? list.filter((d) => Array.isArray(d?.buckets))
      : [];
  }, [data.demographics]);

  const reachMetric = pickMetric(reach, "reach", "accounts_reached");
  const viewsMetric = pickMetric(views, "views", "profile_views", "impressions");
  const followsIn = pickMetric(
    follows,
    "follows",
    "follower_count",
    "follows_and_unfollows",
    "new_followers",
  );
  const unfollows = pickMetric(follows, "unfollows", "unfollowers");
  const interactionsTotal =
    metricTotal(interactions, "accounts_engaged", "total_interactions", "interactions") ??
    (interactions.length
      ? interactions.reduce((s, m) => s + (m.total ?? 0), 0)
      : null);
  const actionsTotal =
    metricTotal(actions, "profile_links_taps", "profile_actions", "website_clicks") ??
    (actions.length ? actions.reduce((s, m) => s + (m.total ?? 0), 0) : null);

  const anyFetching = Object.values(states).some((s) => s.isFetching);
  const waitingForId = !accountId;

  if (waitingForId) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-10 text-center text-[13px] text-neutral-500">
        Waiting for Instagram account id from profile info before loading insights…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
        {/* <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <button
            type="button"
            onClick={onRefreshAll}
            disabled={anyFetching}
            className={`inline-flex h-9 shrink-0 items-center gap-1.5 self-start rounded-full border border-neutral-200 px-3 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-60 ${FOCUS_RING}`}
          >
            <RefreshCw className={`size-3.5 ${anyFetching ? "animate-spin" : ""}`} />
            Refresh insights
          </button>
        </div> */}
        <div className="mt-4 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Reach"
            value={formatCount(latestSeriesValue(reachMetric) ?? reachMetric?.total)}
            hint="Unique accounts that saw you"
            icon={TrendingUp}
            loading={states.reach.isLoading}
          />
          <KpiCard
            label="Profile views"
            value={formatCount(latestSeriesValue(viewsMetric) ?? viewsMetric?.total)}
            hint="People who opened your profile"
            icon={Eye}
            loading={states.views.isLoading}
          />
          <KpiCard
            label="Interactions"
            value={formatCount(interactionsTotal)}
            hint="Likes, comments, saves & more"
            icon={HeartHandshake}
            loading={states.interactions.isLoading}
          />
          <KpiCard
            label="Profile actions"
            value={formatCount(actionsTotal)}
            hint="Taps on buttons & links"
            icon={MousePointerClick}
            loading={states.actions.isLoading}
          />
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Insight sections"
        className="inline-flex max-w-full gap-0.5 overflow-x-auto rounded-lg border border-neutral-200 bg-neutral-100/80 p-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-semibold tracking-tight transition-colors ${FOCUS_RING} ${
                active
                  ? "bg-white text-[#E1306C] shadow-sm ring-1 ring-black/5"
                  : "text-neutral-500 hover:bg-white/70 hover:text-neutral-800"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "overview" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <SectionShell
            title="Reach over time"
            subtitle="How many unique accounts saw your content"
            loading={states.reach.isLoading}
            error={states.reach.isError}
            errorMessage={getApiErrorMessage(states.reach.error, "Reach unavailable")}
            onRetry={states.reach.refetch}
          >
            <MiniBars series={reachMetric?.series ?? []} />
            <div className="mt-4">
              <MetricList metrics={reach} />
            </div>
          </SectionShell>

          <SectionShell
            title="Views over time"
            subtitle="Profile and content views Instagram reported"
            loading={states.views.isLoading}
            error={states.views.isError}
            errorMessage={getApiErrorMessage(states.views.error, "Views unavailable")}
            onRetry={states.views.refetch}
          >
            <MiniBars series={viewsMetric?.series ?? []} accent="#C13584" />
            <div className="mt-4">
              <MetricList metrics={views} />
            </div>
          </SectionShell>
        </div>
      ) : null}

      {tab === "growth" ? (
        <SectionShell
          title="Follower growth"
          subtitle="Who joined and who left — net movement on your account"
          loading={states.follows.isLoading}
          error={states.follows.isError}
          errorMessage={getApiErrorMessage(states.follows.error, "Follows unavailable")}
          onRetry={states.follows.refetch}
        >
          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
              <span className="grid size-9 place-items-center rounded-full bg-white text-emerald-600">
                <UserPlus className="size-4" />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700/80">
                  New follows
                </p>
                <p className="text-[20px] font-semibold text-emerald-900">
                  {formatCount(followsIn?.total ?? latestSeriesValue(followsIn))}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-rose-100 bg-rose-50/70 px-4 py-3">
              <span className="grid size-9 place-items-center rounded-full bg-white text-rose-600">
                <UserMinus className="size-4" />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-rose-700/80">
                  Unfollows
                </p>
                <p className="text-[20px] font-semibold text-rose-900">
                  {formatCount(unfollows?.total ?? latestSeriesValue(unfollows))}
                </p>
              </div>
            </div>
          </div>
          <MiniBars series={followsIn?.series ?? []} accent="#10B981" />
          <div className="mt-4">
            <MetricList metrics={follows} />
          </div>
        </SectionShell>
      ) : null}

      {tab === "engagement" ? (
        <SectionShell
          title="Interactions"
          subtitle="How people engaged with your content (likes, comments, saves, shares)"
          loading={states.interactions.isLoading}
          error={states.interactions.isError}
          errorMessage={getApiErrorMessage(
            states.interactions.error,
            "Interactions unavailable",
          )}
          onRetry={states.interactions.refetch}
        >
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-[#FFF0F5] px-3 py-2.5 text-[13px] text-[#C13584]">
            <Activity className="size-4 shrink-0" />
            Total interactions in this window:{" "}
            <strong className="text-neutral-900">{formatCount(interactionsTotal)}</strong>
          </div>
          <MetricList metrics={interactions} />
        </SectionShell>
      ) : null}

      {tab === "actions" ? (
        <SectionShell
          title="Profile actions"
          subtitle="Taps on website, email, call, and other profile buttons"
          loading={states.actions.isLoading}
          error={states.actions.isError}
          errorMessage={getApiErrorMessage(states.actions.error, "Actions unavailable")}
          onRetry={states.actions.refetch}
        >
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-neutral-50 px-3 py-2.5 text-[13px] text-neutral-600">
            <Users className="size-4 shrink-0 text-[#E1306C]" />
            These are people who didn’t just watch — they took an action on your profile.
          </div>
          <MetricList metrics={actions} />
        </SectionShell>
      ) : null}
    </div>
  );
}
