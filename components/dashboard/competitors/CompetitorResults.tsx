"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Briefcase,
  Building2,
  Crosshair,
  Globe2,
  Search,
  Sparkles,
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
import { FOCUS_RING } from "@/utils/ui-classes";

type ChannelScore = {
  score?: number | null;
  status?: string | null;
  followers?: number | null;
  engagement_rate?: number | null;
  strengths?: string[];
  weaknesses?: string[];
  score_reason?: string | null;
  content_strength?: number | null;
  audience_strength?: number | null;
};

type WebsiteIntelItem = {
  name?: string | null;
  website?: string | null;
  username?: string | null;
  intelligence?: {
    company_name?: string | null;
    url?: string | null;
    description?: string | null;
    positioning?: string | null;
    services?: string[];
    features?: string[];
  } | null;
};

type LinkedInReportCompetitor = {
  name?: string | null;
  website?: string | null;
  linkedin_url?: string | null;
  hiring?: boolean | null;
  industry?: string | null;
  employees?: CompetitorLinkedInEmployee[];
  tagline?: string | null;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function asChannelScore(value: unknown): ChannelScore | null {
  const record = asRecord(value);
  if (!record) return null;
  return record as ChannelScore;
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim() !== "");
}

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
    // API sometimes returns posting cadence as an object
    if (
      "posts_per_week" in record ||
      "avg_days_between_posts" in record ||
      ("post_count" in record && "date_range_days" in record)
    ) {
      const parts: string[] = [];
      if (typeof record.posts_per_week === "number") {
        parts.push(`${record.posts_per_week} posts/week`);
      }
      if (typeof record.avg_days_between_posts === "number") {
        parts.push(`every ${record.avg_days_between_posts} days`);
      }
      if (typeof record.post_count === "number") {
        if (typeof record.date_range_days === "number") {
          parts.push(`${record.post_count} posts / ${record.date_range_days}d`);
        } else if (!parts.length) {
          parts.push(`${record.post_count} posts`);
        }
      }
      if (parts.length) return parts.join(" · ");
    }
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
  aside,
}: {
  title: string;
  description?: string;
  icon?: typeof Crosshair;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
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
        {aside}
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

function ChannelScoreCard({
  title,
  iconSrc,
  channel,
  fallbackLabel,
}: {
  title: string;
  iconSrc: string;
  channel?: ChannelScore | null;
  fallbackLabel?: string;
}) {
  if (!channel) return null;
  const hasContent =
    channel.score != null ||
    channel.status ||
    channel.followers != null ||
    channel.engagement_rate != null ||
    channel.strengths?.length ||
    channel.weaknesses?.length ||
    channel.score_reason;

  if (!hasContent) return null;

  return (
    <div className="rounded-2xl border border-[#E6E8F5] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#F6F7FD] ring-1 ring-[#E6E8F5]">
            <Image src={iconSrc} alt="" width={16} height={16} className="size-4 object-contain" />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-neutral-900">{title}</p>
            {channel.status ? (
              <p className="mt-0.5 text-[12px] text-neutral-500">{channel.status}</p>
            ) : fallbackLabel ? (
              <p className="mt-0.5 text-[12px] text-neutral-500">{fallbackLabel}</p>
            ) : null}
          </div>
        </div>
        {channel.score != null ? (
          <span className="rounded-full bg-[#ECEBFF] px-2.5 py-1 text-[12px] font-semibold tabular-nums text-[#5B57E6]">
            {Math.round(channel.score)}/100
          </span>
        ) : null}
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2">
        {channel.followers != null ? (
          <div className="rounded-xl bg-[#F8F9FF] p-2.5">
            <dt className="text-[10px] uppercase tracking-[0.04em] text-neutral-400">Followers</dt>
            <dd className="mt-1 text-[13px] font-semibold text-neutral-900">
              {formatNumber(channel.followers)}
            </dd>
          </div>
        ) : null}
        {channel.engagement_rate != null ? (
          <div className="rounded-xl bg-[#F8F9FF] p-2.5">
            <dt className="text-[10px] uppercase tracking-[0.04em] text-neutral-400">Engagement</dt>
            <dd className="mt-1 text-[13px] font-semibold text-neutral-900">
              {formatEngagement(channel.engagement_rate)}
            </dd>
          </div>
        ) : null}
        {channel.audience_strength != null ? (
          <div className="rounded-xl bg-[#F8F9FF] p-2.5">
            <dt className="text-[10px] uppercase tracking-[0.04em] text-neutral-400">Audience</dt>
            <dd className="mt-1 text-[13px] font-semibold text-neutral-900">
              {formatNumber(channel.audience_strength)}
            </dd>
          </div>
        ) : null}
        {channel.content_strength != null ? (
          <div className="rounded-xl bg-[#F8F9FF] p-2.5">
            <dt className="text-[10px] uppercase tracking-[0.04em] text-neutral-400">Content</dt>
            <dd className="mt-1 text-[13px] font-semibold text-neutral-900">
              {formatNumber(channel.content_strength)}
            </dd>
          </div>
        ) : null}
      </dl>

      {channel.score_reason ? (
        <p className="mt-3 text-[12px] leading-5 text-neutral-600">{channel.score_reason}</p>
      ) : null}

      {channel.strengths?.length ? (
        <div className="mt-3">
          <p className="mb-1.5 text-[11px] font-medium text-emerald-700">Strengths</p>
          <ChipList items={channel.strengths.slice(0, 4)} />
        </div>
      ) : null}
      {channel.weaknesses?.length ? (
        <div className="mt-3">
          <p className="mb-1.5 text-[11px] font-medium text-rose-600">Weaknesses</p>
          <ChipList items={channel.weaknesses.slice(0, 4)} />
        </div>
      ) : null}
    </div>
  );
}

function InstagramChannelSection({
  yourScore,
  yourUsername,
  yourProfileUrl,
  yourImageUrl,
  competitors,
}: {
  yourScore?: ChannelScore | null;
  yourUsername?: string | null;
  yourProfileUrl?: string | null;
  yourImageUrl?: string | null;
  competitors: CompetitorListItem[];
}) {
  const instagramCompetitors = competitors.filter(
    (item) => item.username || item.instagram_analysis || item.profile_url,
  );
  if (!yourScore && !yourUsername && !instagramCompetitors.length) return null;

  return (
    <Section
      title="Instagram comparison"
      description="Start with social presence — your score versus competitor Instagram profiles."
      icon={Users}
      aside={
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F6F7FD] px-2.5 py-1 text-[11px] font-medium text-neutral-600 ring-1 ring-[#E6E8F5]">
          <Image src="/assets/insta.png" alt="" width={14} height={14} className="size-3.5 object-contain" />
          Instagram first
        </span>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-3">
          <ChannelScoreCard
            title="Your Instagram"
            iconSrc="/assets/insta.png"
            channel={yourScore}
            fallbackLabel={yourUsername ? `@${yourUsername.replace(/^@/, "")}` : undefined}
          />
          {yourUsername ? (
            <div className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-4">
              <div className="flex items-center gap-3">
                <Avatar
                  name={yourUsername}
                  imageUrl={yourImageUrl || undefined}
                  size="lg"
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
                    Your profile
                  </p>
                  {yourProfileUrl ? (
                    <a
                      href={yourProfileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`mt-0.5 inline-flex text-[14px] font-semibold text-[#5B57E6] hover:underline ${FOCUS_RING}`}
                    >
                      @{yourUsername.replace(/^@/, "")}
                    </a>
                  ) : (
                    <p className="mt-0.5 text-[14px] font-semibold text-neutral-900">
                      @{yourUsername.replace(/^@/, "")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {instagramCompetitors.map((item, index) => {
            const analysis = item.instagram_analysis as
              | {
                  username?: string;
                  followers?: number | null;
                  post_count?: number | null;
                  primary_format?: string | null;
                  bio?: string | null;
                  posting_frequency?: unknown;
                }
              | undefined;
            const handle = item.username || analysis?.username;
            const display = handle
              ? handle.startsWith("@")
                ? handle
                : `@${handle}`
              : competitorLabel(item);
            return (
              <li
                key={`instagram-${index}-${handle || item.name || "competitor"}`}
                className="rounded-2xl border border-[#E6E8F5] bg-white p-4"
              >
                <div className="flex items-start gap-3">
                  <Avatar
                    name={display}
                    imageUrl={item.profile_picture_url || item.image_url}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <Image
                        src="/assets/insta.png"
                        alt=""
                        width={14}
                        height={14}
                        className="size-3.5 object-contain"
                      />
                      <p className="truncate text-[13px] font-semibold text-neutral-900">
                        {display}
                      </p>
                    </div>
                    {item.name && item.name !== handle ? (
                      <p className="mt-0.5 truncate text-[12px] text-neutral-500">{item.name}</p>
                    ) : null}
                  </div>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-[#F8F9FF] p-2.5">
                    <dt className="text-[10px] uppercase tracking-[0.04em] text-neutral-400">
                      Followers
                    </dt>
                    <dd className="mt-1 text-[13px] font-semibold text-neutral-900">
                      {formatNumber(item.followers ?? analysis?.followers)}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-[#F8F9FF] p-2.5">
                    <dt className="text-[10px] uppercase tracking-[0.04em] text-neutral-400">
                      Posts
                    </dt>
                    <dd className="mt-1 text-[13px] font-semibold text-neutral-900">
                      {formatNumber(
                        item.post_count ??
                          analysis?.post_count ??
                          (Array.isArray(item.posts) ? item.posts.length : null),
                      )}
                    </dd>
                  </div>
                </dl>
                {analysis?.primary_format || analysis?.bio ? (
                  <p className="mt-3 line-clamp-2 text-[12px] leading-5 text-neutral-600">
                    {analysis.primary_format || analysis.bio}
                  </p>
                ) : item.bio ? (
                  <p className="mt-3 line-clamp-2 text-[12px] leading-5 text-neutral-600">
                    {item.bio}
                  </p>
                ) : null}
                {item.profile_url ? (
                  <a
                    href={item.profile_url}
                    target="_blank"
                    rel="noreferrer"
                    className={`mt-3 inline-flex text-[12px] font-medium text-[#5B57E6] hover:underline ${FOCUS_RING}`}
                  >
                    View Instagram
                  </a>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}

function WebsiteChannelSection({
  yourScore,
  yourWebsite,
  yourServices,
  websiteIntel,
}: {
  yourScore?: ChannelScore | null;
  yourWebsite?: string | null;
  yourServices?: string[] | null;
  websiteIntel: WebsiteIntelItem[];
}) {
  if (!yourScore && !yourWebsite && !websiteIntel.length) return null;

  return (
    <Section
      title="Website comparison"
      description="Positioning, services, and proof signals from competitor sites."
      icon={Globe2}
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="space-y-3">
          <ChannelScoreCard
            title="Your website"
            iconSrc="/assets/globe.png"
            channel={yourScore}
            fallbackLabel={yourWebsite || undefined}
          />
          {yourWebsite || yourServices?.length ? (
            <div className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
                Your site
              </p>
              {yourWebsite ? (
                <a
                  href={yourWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className={`mt-1 inline-flex break-all text-[13px] font-semibold text-[#5B57E6] hover:underline ${FOCUS_RING}`}
                >
                  {yourWebsite.replace(/^https?:\/\//, "")}
                </a>
              ) : null}
              {yourServices?.length ? (
                <div className="mt-3">
                  <ChipList items={yourServices.slice(0, 6)} />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <ul className="grid gap-3 md:grid-cols-2">
          {websiteIntel.map((item, index) => {
            const intel = item.intelligence;
            const name = intel?.company_name || item.name || `Site ${index + 1}`;
            const url = intel?.url || item.website;
            return (
              <li
                key={`website-${index}-${name}-${url || "no-url"}`}
                className="rounded-2xl border border-[#E6E8F5] bg-white p-4"
              >
                <div className="flex items-start gap-2.5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#ECEBFF] text-[#5B57E6]">
                    <Building2 className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold text-neutral-900">{name}</p>
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className={`mt-0.5 inline-flex truncate text-[12px] text-[#5B57E6] hover:underline ${FOCUS_RING}`}
                      >
                        {url.replace(/^https?:\/\//, "")}
                      </a>
                    ) : null}
                  </div>
                </div>
                {intel?.description || intel?.positioning ? (
                  <p className="mt-3 line-clamp-3 text-[12px] leading-5 text-neutral-600">
                    {intel.description || intel.positioning}
                  </p>
                ) : null}
                {intel?.services?.length ? (
                  <div className="mt-3">
                    <ChipList items={intel.services.slice(0, 4)} />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}

function LinkedInChannelSection({
  yourScore,
  yourLinkedInUrl,
  reportCompetitors,
  competitors,
}: {
  yourScore?: ChannelScore | null;
  yourLinkedInUrl?: string | null;
  reportCompetitors: LinkedInReportCompetitor[];
  competitors: CompetitorListItem[];
}) {
  const listCompetitors = competitors.filter(
    (item) => item.linkedin_url || item.linkedin_analysis || item.employees?.length,
  );
  const linkedInItems = reportCompetitors.length ? reportCompetitors : listCompetitors;
  const seenLinkedIn = new Set<string>();
  const uniqueLinkedInItems = linkedInItems.filter((item) => {
    const record = item as LinkedInReportCompetitor & CompetitorListItem;
    const key = (
      record.linkedin_url ||
      record.name ||
      record.company_name ||
      record.username ||
      ""
    )
      .toLowerCase()
      .trim();
    if (!key) return true;
    if (seenLinkedIn.has(key)) return false;
    seenLinkedIn.add(key);
    return true;
  });

  if (!yourScore && !yourLinkedInUrl && !uniqueLinkedInItems.length) {
    return null;
  }

  return (
    <Section
      title="LinkedIn comparison"
      description="Hiring signals, leadership profiles, and company reach."
      icon={Briefcase}
      aside={
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F6F7FD] px-2.5 py-1 text-[11px] font-medium text-neutral-600 ring-1 ring-[#E6E8F5]">
          <Image
            src="/assets/linkedin.png"
            alt=""
            width={14}
            height={14}
            className="size-3.5 object-contain"
          />
          LinkedIn
        </span>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="space-y-3">
          <ChannelScoreCard
            title="Your LinkedIn"
            iconSrc="/assets/linkedin.png"
            channel={yourScore}
          />
          {yourLinkedInUrl ? (
            <div className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
                Your company page
              </p>
              <a
                href={yourLinkedInUrl}
                target="_blank"
                rel="noreferrer"
                className={`mt-1 inline-flex break-all text-[13px] font-semibold text-[#5B57E6] hover:underline ${FOCUS_RING}`}
              >
                View LinkedIn
              </a>
            </div>
          ) : null}
        </div>

        <ul className="grid gap-3 md:grid-cols-2">
          {uniqueLinkedInItems.map((item, index) => {
            const isListItem = "linkedin_analysis" in item || "match_score" in item;
            const listItem = isListItem ? (item as CompetitorListItem) : null;
            const reportItem = !isListItem ? (item as LinkedInReportCompetitor) : null;
            const name =
              reportItem?.name ||
              listItem?.name ||
              listItem?.company_name ||
              `Competitor ${index + 1}`;
            const url = reportItem?.linkedin_url || listItem?.linkedin_url;
            const hiring =
              reportItem?.hiring ?? listItem?.is_hiring ?? listItem?.linkedin_analysis?.is_hiring;
            const employees = reportItem?.employees || listItem?.employees || [];
            const employeeCount =
              listItem?.linkedin_total_employees ??
              listItem?.linkedin_analysis?.employee_count ??
              listItem?.employee_count ??
              employees.length;

            return (
              <li
                key={`linkedin-${index}-${name}-${url || "no-url"}`}
                className="rounded-2xl border border-[#E6E8F5] bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-2.5">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#F6F7FD] ring-1 ring-[#E6E8F5]">
                      <Image
                        src="/assets/linkedin.png"
                        alt=""
                        width={16}
                        height={16}
                        className="size-4 object-contain"
                      />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold text-neutral-900">{name}</p>
                      {url ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className={`mt-0.5 inline-flex text-[12px] text-[#5B57E6] hover:underline ${FOCUS_RING}`}
                        >
                          View LinkedIn
                        </a>
                      ) : null}
                    </div>
                  </div>
                  {hiring === true ? (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-emerald-700">
                      Hiring
                    </span>
                  ) : hiring === false ? (
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-neutral-500">
                      Not hiring
                    </span>
                  ) : null}
                </div>

                <dl className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-[#F8F9FF] p-2.5">
                    <dt className="text-[10px] uppercase tracking-[0.04em] text-neutral-400">
                      Employees
                    </dt>
                    <dd className="mt-1 text-[13px] font-semibold text-neutral-900">
                      {formatNumber(employeeCount)}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-[#F8F9FF] p-2.5">
                    <dt className="text-[10px] uppercase tracking-[0.04em] text-neutral-400">
                      Profiles
                    </dt>
                    <dd className="mt-1 text-[13px] font-semibold text-neutral-900">
                      {formatNumber(
                        listItem?.linkedin_profiles_sampled ?? employees.length,
                      )}
                    </dd>
                  </div>
                </dl>

                {employees.length ? (
                  <ul className="mt-3 space-y-2">
                    {employees.slice(0, 3).map((employee, empIndex) => (
                      <li
                        key={`${employee.name || empIndex}`}
                        className="rounded-xl border border-[#E6E8F5] bg-[#FBFBFF] px-2.5 py-2"
                      >
                        <p className="text-[12px] font-semibold text-neutral-900">
                          {employee.name || `Leader ${empIndex + 1}`}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-[11px] text-neutral-500">
                          {employee.designation || employee.title || "LinkedIn profile"}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : reportItem?.tagline ? (
                  <p className="mt-3 text-[12px] leading-5 text-neutral-600">{reportItem.tagline}</p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
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

export default function ManualCompetitorResults({
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
  const summary = data?.summary || result?.summary || overview?.key_insight;

  const digitalPresence = asRecord(result?.report?.["03_digital_presence"]);
  const instagramScore = asChannelScore(digitalPresence?.instagram);
  const websiteScore = asChannelScore(digitalPresence?.website);
  const linkedinScore = asChannelScore(digitalPresence?.linkedin);

  const userInstagram = asRecord(
    asRecord(result?.company_analysis)?.user_instagram,
  );
  const yourInstagramUsername =
    (typeof userInstagram?.username === "string" && userInstagram.username) ||
    company?.instagram_username ||
    null;
  const yourInstagramImage =
    (typeof userInstagram?.profile_picture_url === "string" &&
      userInstagram.profile_picture_url) ||
    null;
  const yourInstagramUrl =
    company?.instagram_url ||
    (yourInstagramUsername
      ? `https://www.instagram.com/${yourInstagramUsername.replace(/^@/, "")}/`
      : null);

  const websiteIntel = (
    Array.isArray(result?.competitor_website_intel)
      ? result.competitor_website_intel
      : []
  ) as WebsiteIntelItem[];

  const linkedinReport = asRecord(result?.report?.["07_linkedin_analysis"]);
  const linkedinReportCompetitors = (
    Array.isArray(linkedinReport?.competitors) ? linkedinReport.competitors : []
  ) as LinkedInReportCompetitor[];

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden p-0">
        <div className="border-b border-[#E6E8F5] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_55%)] px-5 py-5 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5B57E6]">
                Manual competitor brief
              </p>
              <h2 className="mt-1 text-[18px] font-semibold tracking-tight text-neutral-900">
                {company?.name || "Competitor analysis"}
              </h2>
              {summary ? (
                <p className="mt-2 max-w-3xl text-[13px] leading-5 text-neutral-600">
                  {summary}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              {status ? <Badge>{status}</Badge> : null}
              <Badge>{`${data?.competitor_count ?? result?.competitor_count ?? competitors.length} competitors`}</Badge>
              <Badge>{`${data?.post_count ?? result?.post_count ?? 0} posts`}</Badge>
            </div>
          </div>
          {resultError ? (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-800">
              {String(resultError)}
            </div>
          ) : null}
        </div>
      </Card>

      <InstagramChannelSection
        yourScore={instagramScore}
        yourUsername={yourInstagramUsername}
        yourProfileUrl={yourInstagramUrl}
        yourImageUrl={yourInstagramImage}
        competitors={competitors}
      />

      <WebsiteChannelSection
        yourScore={websiteScore}
        yourWebsite={company?.website}
        yourServices={asStringList(company?.services)}
        websiteIntel={websiteIntel}
      />

      <LinkedInChannelSection
        yourScore={linkedinScore}
        yourLinkedInUrl={company?.linkedin_url}
        reportCompetitors={linkedinReportCompetitors}
        competitors={competitors}
      />

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
