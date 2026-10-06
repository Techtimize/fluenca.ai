"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  AlertTriangle,
  Building2,
  Crosshair,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import CompetitorComparisonInsights from "@/components/dashboard/competitors/CompetitorComparisonInsights";
import CompetitorStrategyMoves from "@/components/dashboard/competitors/CompetitorStrategyMoves";
import ApiNotFoundCard from "@/components/notfound";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import Card from "@/components/shared/card";
import type {
  CompetitorListItem,
  CompetitorsListResponse,
  CompetitorLinkedInEmployee,
  CompetitorJobOpening,
} from "@/types/bussiness/competitoranalysis-type";

function formatNumber(value?: number | null) {
  if (typeof value !== "number") return "—";
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function formatPercent(value?: number | null) {
  if (typeof value !== "number") return "—";
  const normalized = value <= 1 ? value * 100 : value;
  return `${Math.round(normalized)}%`;
}

function formatEngagement(value?: number | null) {
  if (typeof value !== "number") return "—";
  return `${value.toFixed(2)}%`;
}

function competitorLabel(item: CompetitorListItem) {
  return item.name || item.company_name || item.username || "Competitor";
}

function competitorHandle(item: CompetitorListItem) {
  if (item.username) return item.username.startsWith("@") ? item.username : `@${item.username}`;
  return item.company_name || item.website || "—";
}

function toDisplayLabel(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map(toDisplayLabel).filter(Boolean).join(", ");
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    // API sometimes returns numeric ranges as { min, max }
    if ("min" in record || "max" in record) {
      const min = record.min;
      const max = record.max;
      if (typeof min === "number" && typeof max === "number") return `${min}–${max}`;
      if (typeof min === "number") return `${min}+`;
      if (typeof max === "number") return `≤${max}`;
      if (min != null || max != null) {
        return [min, max].filter((v) => v != null).map(String).join("–");
      }
    }
    const primary =
      record.technology ??
      record.service ??
      record.item ??
      record.title ??
      record.name ??
      record.gap ??
      record.theme ??
      record.topic ??
      record.label ??
      record.action ??
      record.area;
    if (primary != null && (typeof primary === "string" || typeof primary === "number")) {
      const extras = [
        record.priority != null ? `Priority ${String(record.priority)}` : null,
        record.competitor_count != null ? `${String(record.competitor_count)} competitors` : null,
      ].filter(Boolean);
      return extras.length ? `${primary} · ${extras.join(" · ")}` : String(primary);
    }
    return Object.entries(record)
      .filter(([, v]) => v != null && typeof v !== "object")
      .map(([k, v]) => `${k}: ${String(v)}`)
      .join(" · ");
  }
  return "";
}

function Chip({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-[#E6E8F5] bg-[#F6F7FD] px-3 py-1 text-[12px] text-neutral-700">
      {children}
    </span>
  );
}

function ChipList({ items }: { items?: unknown[] | null }) {
  const labels = (items ?? []).map(toDisplayLabel).filter(Boolean);
  if (!labels.length) return <p className="text-[13px] text-neutral-500">No data yet</p>;
  return (
    <ul className="flex flex-wrap gap-2">
      {labels.map((item, index) => (
        <li key={`${item}-${index}`}>
          <Chip>{item}</Chip>
        </li>
      ))}
    </ul>
  );
}

function BulletList({ items }: { items?: unknown[] | null }) {
  const labels = (items ?? []).map(toDisplayLabel).filter(Boolean);
  if (!labels.length) return <p className="text-[13px] text-neutral-500">No data yet</p>;
  return (
    <ul className="space-y-2">
      {labels.map((item, index) => (
        <li key={`${item}-${index}`} className="flex gap-2 text-[13px] leading-5 text-neutral-700">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#5B57E6]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Section({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon?: typeof Target;
  children: ReactNode;
}) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-start gap-3">
        {Icon ? (
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#ECEBFF] text-[#5B57E6]">
            <Icon className="size-4" aria-hidden="true" />
          </span>
        ) : null}
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold text-neutral-900">{title}</h3>
          {description ? (
            <p className="mt-1 text-[13px] leading-5 text-neutral-500">{description}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </Card>
  );
}

function KvGrid({
  items,
}: {
  items: Array<{ label: string; value?: string | number | null }>;
}) {
  const visible = items.filter(
    (item) => item.value !== null && item.value !== undefined && item.value !== "",
  );
  if (!visible.length) return <p className="text-[13px] text-neutral-500">No data yet</p>;
  return (
    <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {visible.map((item) => (
        <div key={item.label} className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-3">
          <dt className="text-[11px] font-medium uppercase tracking-[0.04em] text-neutral-500">
            {item.label}
          </dt>
          <dd className="mt-1 break-words text-[13px] font-medium text-neutral-900">
            {String(item.value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function formatLevel(level?: string | null) {
  if (!level) return null;
  return level.replace(/_/g, " ");
}

function employeeTitle(employee: CompetitorLinkedInEmployee) {
  const title = employee.designation || employee.title || "";
  if (!title) return "LinkedIn profile";
  return title.length > 90 ? `${title.slice(0, 90)}…` : title;
}

function hiringSignalList(signals?: string[] | string | null) {
  if (!signals) return [];
  if (Array.isArray(signals)) return signals.filter(Boolean);
  return [signals];
}

function LinkedInEmployeeBlock({ item }: { item: CompetitorListItem }) {
  const analysis = item.linkedin_analysis;
  const employees = item.employees ?? [];
  const openings = item.job_openings ?? [];
  const signals = hiringSignalList(item.hiring_signals);
  const employeeCount =
    item.linkedin_total_employees ??
    analysis?.employee_count ??
    item.employee_count ??
    employees.length;
  const profilesSampled = item.linkedin_profiles_sampled ?? employees.length;
  const openRoles = analysis?.open_roles ?? analysis?.job_openings_count ?? openings.length;
  const isHiring = item.is_hiring ?? analysis?.is_hiring ?? analysis?.active_hiring;
  const companySizeLabel = toDisplayLabel(
    item.linkedin_employee_range ||
      item.linkedin_company_size ||
      item.company_size ||
      analysis?.company_size,
  );

  const hasData =
    employees.length > 0 ||
    openings.length > 0 ||
    signals.length > 0 ||
    employeeCount != null ||
    profilesSampled != null ||
    openRoles != null ||
    isHiring != null ||
    Boolean(companySizeLabel) ||
    analysis?.thought_leadership_score != null ||
    analysis?.post_count != null;

  if (!hasData) return null;

  return (
    <div className="mt-4 rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[12px] font-semibold text-neutral-800">LinkedIn talent</p>
        <div className="flex flex-wrap gap-1.5">
          {isHiring ? (
            <span className="rounded-full bg-[#E6F7F4] px-2 py-0.5 text-[10px] font-medium text-[#0F766E]">
              Hiring
            </span>
          ) : null}
          {companySizeLabel ? (
            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] text-neutral-600 ring-1 ring-[#E6E8F5]">
              {companySizeLabel}
            </span>
          ) : null}
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-white p-2.5 ring-1 ring-[#E6E8F5]">
          <dt className="text-[10px] uppercase tracking-[0.04em] text-neutral-400">Employees</dt>
          <dd className="mt-1 text-[13px] font-semibold text-neutral-900">
            {formatNumber(employeeCount)}
          </dd>
        </div>
        <div className="rounded-xl bg-white p-2.5 ring-1 ring-[#E6E8F5]">
          <dt className="text-[10px] uppercase tracking-[0.04em] text-neutral-400">Profiles</dt>
          <dd className="mt-1 text-[13px] font-semibold text-neutral-900">
            {formatNumber(profilesSampled)}
          </dd>
        </div>
        <div className="rounded-xl bg-white p-2.5 ring-1 ring-[#E6E8F5]">
          <dt className="text-[10px] uppercase tracking-[0.04em] text-neutral-400">Open roles</dt>
          <dd className="mt-1 text-[13px] font-semibold text-neutral-900">
            {formatNumber(openRoles)}
          </dd>
        </div>
      </dl>

      {(analysis?.post_count != null || analysis?.thought_leadership_score != null) && (
        <p className="mt-2 text-[11px] text-neutral-500">
          {[
            analysis?.post_count != null ? `${analysis.post_count} LinkedIn posts` : null,
            analysis?.thought_leadership_score != null
              ? `Thought leadership ${analysis.thought_leadership_score}`
              : null,
            analysis?.is_thought_leader ? "Thought leader" : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      )}

      {employees.length ? (
        <ul className="mt-3 space-y-2">
          {employees.slice(0, 4).map((employee, index) => {
            const personName = employee.name || `Employee ${index + 1}`;
            const level = formatLevel(employee.level);
            return (
              <li
                key={`${personName}-${employee.linkedin_url || index}`}
                className="rounded-xl border border-[#E6E8F5] bg-white p-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="text-[12px] font-semibold text-neutral-900">{personName}</p>
                      {level ? (
                        <span className="rounded-full bg-[#ECEBFF] px-2 py-0.5 text-[10px] font-medium capitalize text-[#5B57E6]">
                          {level}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-neutral-500">
                      {employeeTitle(employee)}
                    </p>
                  </div>
                  {employee.linkedin_url ? (
                    <a
                      href={employee.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 text-[11px] font-medium text-[#5B57E6] hover:underline"
                    >
                      Profile
                    </a>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}

      {openings.length ? (
        <div className="mt-3">
          <p className="mb-1.5 text-[11px] font-medium text-neutral-500">Open roles</p>
          <ul className="space-y-1.5">
            {openings.slice(0, 3).map((job: CompetitorJobOpening, index) => (
              <li key={`${job.job_title || index}`} className="text-[12px] text-neutral-700">
                {job.linkedin_url ? (
                  <a
                    href={job.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-[#5B57E6] hover:underline"
                  >
                    {job.job_title || "Open role"}
                  </a>
                ) : (
                  <span className="font-medium">{job.job_title || "Open role"}</span>
                )}
                {job.location ? (
                  <span className="text-neutral-400"> · {job.location}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {signals.length ? (
        <div className="mt-3">
          <p className="mb-1.5 text-[11px] font-medium text-neutral-500">Hiring signals</p>
          <ChipList items={signals.slice(0, 4)} />
        </div>
      ) : null}
    </div>
  );
}

function CompetitorCards({ competitors }: { competitors: CompetitorListItem[] }) {
  return (
    <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {competitors.map((item, index) => {
        const name = competitorLabel(item);
        const image = item.profile_picture_url || item.image_url;
        return (
          <li key={`${item.username || item.name || index}`}>
            <Card className="h-full p-5">
              <div className="flex items-start gap-3">
                <Avatar name={name} imageUrl={image} size="lg" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-neutral-900">{name}</p>
                  <p className="truncate text-[12px] text-neutral-500">{competitorHandle(item)}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {typeof item.match_score === "number" ? (
                      <Badge>{`Match ${formatPercent(item.match_score)}`}</Badge>
                    ) : null}
                    {typeof item.similarity_percentages?.overall === "number" ? (
                      <Badge>{`DNA ${formatPercent(item.similarity_percentages.overall)}`}</Badge>
                    ) : null}
                    {item.discovered_by ? <Badge>{item.discovered_by}</Badge> : null}
                    {item.threat_level ? <Badge>{item.threat_level}</Badge> : null}
                    {item.is_hiring ? <Badge>Hiring</Badge> : null}
                  </div>
                </div>
              </div>

              {item.bio ? (
                <p className="mt-3 line-clamp-3 text-[13px] leading-5 text-neutral-600">{item.bio}</p>
              ) : null}

              <dl className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-2xl bg-[#F8F9FF] p-2.5">
                  <dt className="text-[10px] uppercase tracking-[0.04em] text-neutral-500">Followers</dt>
                  <dd className="mt-1 text-[13px] font-semibold text-neutral-900">
                    {formatNumber(item.followers)}
                  </dd>
                </div>
                <div className="rounded-2xl bg-[#F8F9FF] p-2.5">
                  <dt className="text-[10px] uppercase tracking-[0.04em] text-neutral-500">Posts</dt>
                  <dd className="mt-1 text-[13px] font-semibold text-neutral-900">
                    {formatNumber(
                      item.post_count ??
                        item.content_strategy?.post_count ??
                        (Array.isArray(item.posts) ? item.posts.length : null),
                    )}
                  </dd>
                </div>
                <div className="rounded-2xl bg-[#F8F9FF] p-2.5">
                  <dt className="text-[10px] uppercase tracking-[0.04em] text-neutral-500">Engagement</dt>
                  <dd className="mt-1 text-[13px] font-semibold text-neutral-900">
                    {formatEngagement(item.content_strategy?.avg_engagement_rate)}
                  </dd>
                </div>
              </dl>

              {item.similarity_percentages ? (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {(
                    [
                      ["Overall", item.similarity_percentages.overall],
                      ["Services", item.similarity_percentages.services],
                      ["Tech", item.similarity_percentages.tech],
                      ["Content", item.similarity_percentages.content],
                      ["Location", item.similarity_percentages.location],
                      ["Marketing", item.similarity_percentages.marketing],
                    ] as const
                  )
                    .filter(([, value]) => typeof value === "number")
                    .slice(0, 3)
                    .map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-[#E6E8F5] bg-white p-2.5">
                        <p className="text-[10px] uppercase tracking-[0.04em] text-neutral-500">
                          {label}
                        </p>
                        <p className="mt-1 text-[13px] font-semibold text-neutral-900">
                          {formatPercent(value)}
                        </p>
                      </div>
                    ))}
                </div>
              ) : null}

              {item.match_reasons?.length ? (
                <div className="mt-3">
                  <p className="mb-1.5 text-[11px] font-medium text-neutral-500">Match reasons</p>
                  <ChipList items={item.match_reasons.slice(0, 4)} />
                </div>
              ) : null}

              <LinkedInEmployeeBlock item={item} />

              {item.services?.length ? (
                <div className="mt-3">
                  <ChipList items={item.services.slice(0, 6)} />
                </div>
              ) : null}

              {(item.profile_url || item.website || item.linkedin_url) && (
                <div className="mt-4 flex flex-wrap gap-3 text-[12px]">
                  {item.profile_url ? (
                    <a href={item.profile_url} target="_blank" rel="noreferrer" className="font-medium text-[#5B57E6] hover:underline">
                      Profile
                    </a>
                  ) : null}
                  {item.website ? (
                    <a href={item.website} target="_blank" rel="noreferrer" className="font-medium text-[#5B57E6] hover:underline">
                      Website
                    </a>
                  ) : null}
                  {item.linkedin_url ? (
                    <a href={item.linkedin_url} target="_blank" rel="noreferrer" className="font-medium text-[#5B57E6] hover:underline">
                      LinkedIn
                    </a>
                  ) : null}
                </div>
              )}
            </Card>
          </li>
        );
      })}
    </ul>
  );
}

type Props = {
  data?: CompetitorsListResponse | null;
  isLoading?: boolean;
  isError?: boolean;
  isNotFound?: boolean;
  errorMessage?: string;
  onRunAnalysis?: () => void;
  onRetry?: () => void;
  isRetrying?: boolean;
};

export default function CompetitorResults({
  data,
  isLoading,
  isError,
  isNotFound,
  errorMessage,
  onRunAnalysis,
  onRetry,
  isRetrying,
}: Props) {
  const t = useTranslations("competitors");
  const result = data?.result;
  const rawCompetitors =
    result?.competitors?.length
      ? result.competitors
      : result?.competitors_overview?.competitors?.length
        ? result.competitors_overview.competitors
        : result?.competitive_matchup?.competitors?.length
          ? result.competitive_matchup.competitors
          : data?.competitors ?? [];
  const competitors = rawCompetitors.filter(
    (item): item is CompetitorListItem =>
      Boolean(item) &&
      typeof item === "object" &&
      !("why_competitor" in item) &&
      !("offers" in item),
  );

  const hasAnalysis = Boolean(result || (data?.competitors && data.competitors.length > 0));

  if (isLoading) {
    return (
      <Card className="p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-[#ECEBFF] text-[#5B57E6]">
            <Search className="size-4 animate-pulse" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-medium text-neutral-900">{t("loading")}</p>
            <p className="mt-0.5 text-[13px] text-neutral-500">{t("emptyBody")}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (isNotFound) {
    return (
      <ApiNotFoundCard
        resource="competitors"
        onRetry={onRetry}
        isRetrying={isRetrying}
        actionLabel={onRunAnalysis ? t("runAnalysis") : undefined}
        onAction={onRunAnalysis}
      />
    );
  }

  if (isError) {
    return (
      <Card className="border-rose-200 bg-rose-50/80 p-5 sm:p-6">
        <p className="text-sm text-rose-700">{errorMessage || t("error")}</p>
      </Card>
    );
  }

  if (!hasAnalysis) {
    return (
      <ApiNotFoundCard
        resource="competitors"
        title={t("emptyTitle")}
        description={t("emptyBody")}
        actionLabel={onRunAnalysis ? t("runAnalysis") : undefined}
        onAction={onRunAnalysis}
      />
    );
  }

  const overview = result?.overview;
  const company = result?.company;
  const dna =
    result?.company_social_analysis?.company_dna ||
    result?.company_analysis?.company_dna;
  const exec = result?.report?.["01_executive_summary"];
  const actions =
    result?.report?.["11_recommended_actions"]?.actions ||
    result?.recommendations ||
    [];
  const ladder = result?.strategic_insights?.customer_insights?.market_positioning?.ladder;
  const marketScores = result?.strategic_insights?.market_position;
  const comparison = result?.competitor_vs_company_comparison;
  const reportGaps = result?.report?.["06_competitive_gaps"];
  const quantifiedGaps =
    result?.quantified_competitive_gaps ?? reportGaps?.quantified_gaps ?? null;
  const contentGaps =
    result?.strategic_insights?.content_gap?.items ??
    reportGaps?.content_gap?.items ??
    [];
  const technologyGaps =
    result?.strategic_insights?.technology_gap?.items ??
    reportGaps?.technology_gap?.items ??
    [];
  const resultError = result?.error || data?.error;
  const status = data?.status || result?.meta?.status;

  return (
    <div className="space-y-4">
      <Card className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-semibold text-neutral-900">
              {company?.name || "Competitor analysis"}
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              {overview?.market_position ||
                overview?.company_type ||
                "Latest competitor intelligence"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {status ? <Badge>{status}</Badge> : null}
            <Badge>{`${data?.competitor_count ?? result?.competitor_count ?? competitors.length} competitors`}</Badge>
            <Badge>{`${data?.post_count ?? result?.post_count ?? 0} posts`}</Badge>
          </div>
        </div>
        {resultError ? (
          <div className="mt-4 flex gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-800">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>{resultError}</span>
          </div>
        ) : null}
      </Card>

      <Section
        title="Market position"
        description={overview?.market_position_detail?.assessment || marketScores?.position_label}
        icon={Crosshair}
      >
        <KvGrid
          items={[
            { label: "Category", value: overview?.market_position_detail?.category },
            { label: "Position", value: overview?.market_position_detail?.position },
            { label: "Specialization", value: overview?.market_position_detail?.specialization },
            { label: "Geographic focus", value: overview?.market_position_detail?.geographic_focus },
            { label: "Market percentile", value: marketScores?.market_percentile },
            { label: "Brand visibility", value: marketScores?.brand_visibility },
            { label: "Content score", value: marketScores?.content_score },
            { label: "Service coverage", value: marketScores?.service_coverage },
          ]}
        />
        {ladder?.length ? (
          <div className="mt-4">
            <p className="mb-2 text-[12px] font-medium text-neutral-600">Positioning ladder</p>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {ladder.map((item) => (
                <li
                  key={`${item.label}-${item.score}`}
                  className={`rounded-2xl border p-3 ${
                    item.is_you
                      ? "border-[#5B57E6] bg-[#F6F7FD]"
                      : "border-[#E6E8F5] bg-white"
                  }`}
                >
                  <p className="text-[12px] text-neutral-500">{item.label}</p>
                  <p className="mt-1 text-[15px] font-semibold text-neutral-900">{item.score}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Section>

      <Section title="Growth opportunities" icon={TrendingUp}>
        {overview?.growth_opportunities?.length ? (
          <ul className="space-y-3">
            {overview.growth_opportunities.map((item) => (
              <li
                key={`${item.priority}-${item.area}`}
                className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {item.priority ? (
                    <span className="rounded-full bg-[#ECEBFF] px-2.5 py-0.5 text-[11px] font-medium text-[#5B57E6]">
                      {item.priority}
                    </span>
                  ) : null}
                  <p className="text-[13px] font-semibold text-neutral-900">{item.area}</p>
                </div>
                <p className="mt-2 text-[13px] leading-5 text-neutral-700">{item.action}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[13px] text-neutral-500">No growth opportunities yet.</p>
        )}
      </Section>

      <CompetitorStrategyMoves actions={actions} />
      <CompetitorComparisonInsights
        comparison={comparison}
        gaps={quantifiedGaps}
        contentGaps={contentGaps}
        technologyGaps={technologyGaps}
      />

      <Section
        title="Competitors"
        description={
          competitors.length
            ? `${competitors.length} competitors discovered`
            : result?.competitive_matchup?.summary || "No peer competitors discovered in this run."
        }
        icon={Users}
      >
        {competitors.length ? (
          <CompetitorCards competitors={competitors} />
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E6E8F5] bg-[#F8F9FF] px-4 py-6 text-center">
            <p className="text-[13px] text-neutral-600">
              No competitor profiles were returned. Company intelligence above is still available from this run.
            </p>
            {onRunAnalysis ? (
              <Button
                type="button"
                onClick={onRunAnalysis}
                className="mt-4 h-10 gap-2 rounded-full bg-[#5B57E6] px-4 text-white hover:bg-[#4A46D0]"
              >
                <Sparkles className="size-4" />
                Run analysis again
              </Button>
            ) : null}
          </div>
        )}
      </Section>
    </div>
  );
}
