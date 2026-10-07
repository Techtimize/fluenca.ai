"use client";

import {
  AtSign,
  Crosshair,
  FileText,
  Gauge,
  Globe2,
  Layers3,
  Share2,
  Sparkles,
} from "lucide-react";
import Card from "@/components/shared/card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import type {
  CompetitorContentComparison,
  CompetitorOverlapComparison,
  CompetitorQuantifiedGapItem,
  CompetitorQuantifiedGaps,
  CompetitorSideBySideComparison,
  CompetitorSocialComparison,
  CompetitorVsCompanyComparison,
} from "@/types/bussiness/competitoranalysis-type";

function formatNumber(value?: number | null) {
  if (typeof value !== "number") return "—";
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function formatPercent(value?: number | null) {
  if (typeof value !== "number") return "—";
  return `${Math.round(value <= 1 ? value * 100 : value)}%`;
}

function formatEngagement(value?: number | null) {
  if (typeof value !== "number") return "—";
  return `${value.toFixed(2)}%`;
}

function formatPostingFrequency(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (typeof value !== "object" || Array.isArray(value)) return "";

  const record = value as Record<string, unknown>;
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

  return parts.join(" · ");
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
      const formatted = formatPostingFrequency(record);
      if (formatted) return formatted;
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
        record.impact != null ? String(record.impact) : null,
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

function ChipList({
  items,
  empty = "None",
}: {
  items?: unknown[] | null;
  empty?: string;
}) {
  const labels = (items ?? []).map(toDisplayLabel).filter(Boolean);
  if (!labels.length) {
    return <p className="text-[12px] text-neutral-400">{empty}</p>;
  }
  return (
    <ul className="flex flex-wrap gap-1.5">
      {labels.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="rounded-full border border-[#E6E8F5] bg-white px-2.5 py-1 text-[11px] text-neutral-700"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(toDisplayLabel).filter(Boolean);
}

function overlapLists(block?: CompetitorOverlapComparison | null) {
  if (!block) {
    return { shared: [] as string[], yours: [] as string[], theirs: [] as string[], score: null as number | null };
  }
  return {
    shared: asStringList(block.shared || block.overlap || block.common),
    yours: asStringList(
      block.unique_to_company || block.unique_to_you || block.company_only || block.your_only,
    ),
    theirs: asStringList(
      block.unique_to_competitor || block.competitor_only || block.missing || block.gap,
    ),
    score:
      typeof block.overlap_pct === "number"
        ? block.overlap_pct
        : typeof block.overlap_score === "number"
          ? block.overlap_score
          : typeof block.score === "number"
            ? block.score
            : null,
  };
}

function contentLists(block?: CompetitorContentComparison | null) {
  if (!block) {
    return {
      shared: [] as string[],
      yours: [] as string[],
      theirs: [] as string[],
      gaps: [] as string[],
      formats: [] as string[],
    };
  }
  return {
    shared: asStringList(block.shared_themes || block.themes),
    yours: asStringList(block.company_themes),
    theirs: asStringList(
      block.competitor_only_themes || block.competitor_themes || block.dominant_themes,
    ),
    gaps: asStringList(block.gaps || block.missing_topics),
    formats: asStringList(
      [
        block.company_primary_format,
        block.competitor_primary_format,
        ...(block.formats || []),
        ...(block.shared_formats || []),
        ...(block.competitor_formats || []),
      ].filter(Boolean),
    ),
  };
}

function comparisonLabel(item: CompetitorSideBySideComparison) {
  return (
    item.competitor?.name ||
    item.name ||
    item.competitor_name ||
    item.company_name ||
    item.competitor?.username ||
    item.username ||
    "Competitor"
  );
}

function gapTitle(item: CompetitorQuantifiedGapItem) {
  return (
    toDisplayLabel(item.item) ||
    toDisplayLabel(item.title) ||
    toDisplayLabel(item.gap) ||
    toDisplayLabel(item.name) ||
    toDisplayLabel(item.category) ||
    "Competitive gap"
  );
}

function OverlapBlock({
  title,
  Icon,
  block,
}: {
  title: string;
  Icon: typeof Layers3;
  block?: CompetitorOverlapComparison | null;
}) {
  if (!block) return null;
  const lists = overlapLists(block);
  const hasData =
    lists.shared.length || lists.yours.length || lists.theirs.length || lists.score != null || block.summary;

  if (!hasData) return null;

  return (
    <div className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-xl bg-white text-[#5B57E6] ring-1 ring-[#E6E8F5]">
            <Icon className="size-4" />
          </span>
          <h5 className="text-[13px] font-semibold text-neutral-900">{title}</h5>
        </div>
        {lists.score != null ? (
          <span className="text-[12px] font-medium text-[#5B57E6]">
            Overlap {formatPercent(lists.score)}
          </span>
        ) : null}
      </div>
      {block.summary ? (
        <p className="mt-2 text-[12px] leading-5 text-neutral-600">{block.summary}</p>
      ) : null}
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div>
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-neutral-400">
            Shared
          </p>
          <ChipList items={lists.shared} />
        </div>
        <div>
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-emerald-600">
            You only
          </p>
          <ChipList items={lists.yours} />
        </div>
        <div>
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-rose-600">
            Competitor only
          </p>
          <ChipList items={lists.theirs} />
        </div>
      </div>
    </div>
  );
}

function SocialBlock({ block }: { block?: CompetitorSocialComparison | null }) {
  if (!block) return null;

  const yourFollowers =
    block.company?.followers ?? block.your_followers ?? block.company_followers ?? block.followers;
  const theirFollowers =
    block.competitor?.followers ?? block.their_followers ?? block.competitor_followers;
  const yourEngagement =
    block.company?.avg_engagement_rate ??
    block.your_engagement ??
    block.company_engagement ??
    block.avg_engagement_rate;
  const theirEngagement =
    block.competitor?.avg_engagement_rate ??
    block.their_engagement ??
    block.competitor_engagement;
  const themes = asStringList(
    block.company?.content_themes ||
      block.competitor?.content_themes ||
      block.content_themes ||
      block.company_themes ||
      block.competitor_themes,
  );
  const primaryFormat =
    block.company?.primary_format ||
    block.competitor?.primary_format ||
    block.primary_format;
  const postingFrequency = formatPostingFrequency(
    block.company?.posting_frequency ||
      block.competitor?.posting_frequency ||
      block.posting_frequency ||
      block.company_posting_frequency ||
      block.competitor_posting_frequency,
  );
  const primaryFormatLabel = toDisplayLabel(primaryFormat);

  const hasMetrics =
    yourFollowers != null ||
    theirFollowers != null ||
    yourEngagement != null ||
    theirEngagement != null ||
    primaryFormatLabel ||
    postingFrequency ||
    themes.length ||
    block.summary ||
    block.delta;

  if (!hasMetrics) return null;

  return (
    <div className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-4">
      <div className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-xl bg-white text-[#C13584] ring-1 ring-[#E6E8F5]">
          <AtSign className="size-4" />
        </span>
        <h5 className="text-[13px] font-semibold text-neutral-900">Social comparison</h5>
      </div>
      {block.summary ? (
        <p className="mt-2 text-[12px] leading-5 text-neutral-600">{block.summary}</p>
      ) : null}
      <dl className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl bg-white p-3 ring-1 ring-[#E6E8F5]">
          <dt className="text-[11px] text-neutral-400">Your followers</dt>
          <dd className="mt-1 text-[13px] font-semibold text-neutral-900">
            {formatNumber(yourFollowers)}
          </dd>
        </div>
        <div className="rounded-xl bg-white p-3 ring-1 ring-[#E6E8F5]">
          <dt className="text-[11px] text-neutral-400">Their followers</dt>
          <dd className="mt-1 text-[13px] font-semibold text-neutral-900">
            {formatNumber(theirFollowers)}
          </dd>
        </div>
        <div className="rounded-xl bg-white p-3 ring-1 ring-[#E6E8F5]">
          <dt className="text-[11px] text-neutral-400">Your engagement</dt>
          <dd className="mt-1 text-[13px] font-semibold text-neutral-900">
            {formatEngagement(yourEngagement)}
          </dd>
        </div>
        <div className="rounded-xl bg-white p-3 ring-1 ring-[#E6E8F5]">
          <dt className="text-[11px] text-neutral-400">Their engagement</dt>
          <dd className="mt-1 text-[13px] font-semibold text-neutral-900">
            {formatEngagement(theirEngagement)}
          </dd>
        </div>
      </dl>
      {block.delta ? (
        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
          {block.delta.follower_gap != null ? (
            <span className="rounded-full border border-[#E6E8F5] bg-white px-2.5 py-1 text-neutral-600">
              Follower gap · {formatNumber(block.delta.follower_gap)}
            </span>
          ) : null}
          {block.delta.company_ahead_on_followers ? (
            <span className="rounded-full bg-[#E6F7F4] px-2.5 py-1 text-[#0F766E]">
              Ahead on followers
            </span>
          ) : null}
          {block.delta.competitor_ahead_on_followers ? (
            <span className="rounded-full bg-[#FEE2E2] px-2.5 py-1 text-[#B91C1C]">
              Behind on followers
            </span>
          ) : null}
          {block.delta.company_ahead_on_engagement ? (
            <span className="rounded-full bg-[#E6F7F4] px-2.5 py-1 text-[#0F766E]">
              Ahead on engagement
            </span>
          ) : null}
          {block.delta.competitor_ahead_on_engagement ? (
            <span className="rounded-full bg-[#FEE2E2] px-2.5 py-1 text-[#B91C1C]">
              Behind on engagement
            </span>
          ) : null}
        </div>
      ) : null}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 text-[11px] font-medium text-neutral-500">Format / cadence</p>
          <p className="text-[12px] text-neutral-700">
            {[primaryFormatLabel, postingFrequency].filter(Boolean).join(" · ") || "—"}
          </p>
        </div>
        <div>
          <p className="mb-1.5 text-[11px] font-medium text-neutral-500">Themes</p>
          <ChipList items={themes} />
        </div>
      </div>
    </div>
  );
}

function ContentBlock({ block }: { block?: CompetitorContentComparison | null }) {
  if (!block) return null;
  const lists = contentLists(block);
  const hasData =
    lists.shared.length ||
    lists.yours.length ||
    lists.theirs.length ||
    lists.gaps.length ||
    lists.formats.length ||
    block.summary;

  if (!hasData) return null;

  return (
    <div className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-4">
      <div className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-xl bg-white text-[#B45309] ring-1 ring-[#E6E8F5]">
          <Share2 className="size-4" />
        </span>
        <h5 className="text-[13px] font-semibold text-neutral-900">Content comparison</h5>
      </div>
      {block.summary ? (
        <p className="mt-2 text-[12px] leading-5 text-neutral-600">{block.summary}</p>
      ) : null}
      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div>
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-neutral-400">
            Shared themes
          </p>
          <ChipList items={lists.shared} />
        </div>
        <div>
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-emerald-600">
            Your themes
          </p>
          <ChipList items={lists.yours} />
        </div>
        <div>
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-rose-600">
            Competitor themes
          </p>
          <ChipList items={lists.theirs} />
        </div>
        <div>
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-[#5B57E6]">
            Content gaps
          </p>
          <ChipList items={lists.gaps.length ? lists.gaps : lists.formats} />
        </div>
      </div>
    </div>
  );
}

function ComparisonCard({ item, index }: { item: CompetitorSideBySideComparison; index: number }) {
  const name = comparisonLabel(item);
  const competitor = item.competitor;
  const image = item.profile_picture_url || item.image_url || undefined;
  const content = item.content_comparison || item.content;
  const servicesBlock = item.services_comparison || item.service_comparison;
  const username = competitor?.username || item.username;
  const website = competitor?.website || item.website;
  const similarity =
    item.competitive_position?.similarity_pct ??
    item.overall_similarity_pct ??
    (typeof item.match_score === "number"
      ? item.match_score <= 1
        ? Math.round(item.match_score * 100)
        : item.match_score
      : null);
  const dimensions = item.similarity_dimensions
    ? Object.entries(item.similarity_dimensions)
    : [];

  return (
    <article className="rounded-3xl border border-[#E6E8F5] bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={name} imageUrl={image ?? undefined} size="md" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] font-semibold tracking-wider text-neutral-400">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h4 className="text-[14px] font-semibold text-neutral-900">{name}</h4>
            </div>
            <p className="mt-0.5 text-[12px] text-neutral-500">
              {[username, website, competitor?.linkedin_url].filter(Boolean).join(" · ") ||
                "Side-by-side comparison"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {similarity != null ? <Badge>{`Similarity ${similarity}%`}</Badge> : null}
          {typeof item.match_score === "number" ? (
            <Badge>{`Match ${formatPercent(item.match_score)}`}</Badge>
          ) : null}
          {item.competitive_position?.position ? (
            <Badge>{item.competitive_position.position}</Badge>
          ) : null}
          {item.hiring_comparison?.competitor_is_hiring ? <Badge>Hiring</Badge> : null}
        </div>
      </div>

      {item.competitive_position?.summary ? (
        <p className="mt-3 text-[13px] leading-5 text-neutral-600">
          {item.competitive_position.summary}
        </p>
      ) : null}

      {dimensions.length ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {dimensions.map(([key, dim]) => (
            <div
              key={key}
              className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-3"
            >
              <p className="text-[11px] font-medium capitalize text-neutral-500">{key}</p>
              <p className="mt-1 text-[15px] font-semibold text-neutral-900">
                {typeof dim?.similarity_pct === "number" ? `${dim.similarity_pct}%` : "—"}
              </p>
              {dim?.verdict ? (
                <p className="mt-1 text-[11px] text-neutral-500">{dim.verdict.replace(/_/g, " ")}</p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-4 space-y-3">
        <OverlapBlock title="Service comparison" Icon={Layers3} block={servicesBlock} />
        <OverlapBlock
          title="Technology comparison"
          Icon={Globe2}
          block={item.technology_comparison}
        />
        <SocialBlock block={item.social_comparison} />
        <ContentBlock block={content} />
      </div>
    </article>
  );
}

function GapCard({ item, index }: { item: CompetitorQuantifiedGapItem; index: number }) {
  return (
    <li className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] font-semibold tracking-wider text-neutral-400">
          {String(index + 1).padStart(2, "0")}
        </span>
        {item.priority != null ? (
          <span className="rounded-full bg-[#ECEBFF] px-2.5 py-0.5 text-[11px] font-medium text-[#5B57E6]">
            {String(item.priority)}
          </span>
        ) : null}
        {item.category || item.type ? (
          <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] text-neutral-600 ring-1 ring-[#E6E8F5]">
            {item.category || item.type}
          </span>
        ) : null}
        <p className="text-[13px] font-semibold capitalize text-neutral-900">{gapTitle(item)}</p>
      </div>
      {(item.description || item.action) && (
        <p className="mt-2 text-[13px] leading-5 text-neutral-600">
          {toDisplayLabel(item.description || item.action)}
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-neutral-600">
        {item.competitor_count != null ? (
          <span className="rounded-full border border-[#E6E8F5] bg-white px-2.5 py-1">
            {item.competitor_count} competitors
          </span>
        ) : null}
        {item.gap_score != null || item.score != null ? (
          <span className="rounded-full border border-[#E6E8F5] bg-white px-2.5 py-1">
            Gap score · {toDisplayLabel(item.gap_score ?? item.score)}
          </span>
        ) : null}
        {item.market_coverage_pct != null ? (
          <span className="rounded-full border border-[#E6E8F5] bg-white px-2.5 py-1">
            Market coverage · {formatPercent(item.market_coverage_pct)}
          </span>
        ) : null}
        {item.competitor || item.competitor_name ? (
          <span className="rounded-full border border-[#E6E8F5] bg-white px-2.5 py-1">
            vs {toDisplayLabel(item.competitor || item.competitor_name)}
          </span>
        ) : null}
        {item.impact ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-[#E6E8F5] bg-white px-2.5 py-1">
            <Gauge className="size-3 text-[#5B57E6]" />
            {toDisplayLabel(item.impact)}
          </span>
        ) : null}
      </div>
    </li>
  );
}

type Props = {
  comparison?: CompetitorVsCompanyComparison | null;
  gaps?: CompetitorQuantifiedGaps | null;
  contentGaps?: unknown[] | null;
  technologyGaps?: unknown[] | null;
};

export default function CompetitorComparisonInsights({
  comparison,
  gaps,
  contentGaps,
  technologyGaps,
}: Props) {
  const comparisons = comparison?.comparisons ?? [];
  const gapItems = gaps?.gaps ?? [];
  const company = comparison?.company;
  const hasCompanySnapshot =
    !!company &&
    Boolean(
      company.services?.length ||
        company.technologies?.length ||
        company.keywords?.length ||
        company.target_audience?.length ||
        company.social,
    );

  const hasAnything =
    comparison?.summary ||
    comparisons.length ||
    hasCompanySnapshot ||
    gaps?.summary ||
    gapItems.length ||
    contentGaps?.length ||
    technologyGaps?.length;

  if (!hasAnything) return null;

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden p-0">
        <div className="border-b border-[#E6E8F5] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_55%)] px-5 py-5 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="grid size-10 place-items-center rounded-2xl bg-[#ECEBFF] text-[#5B57E6]">
                <Crosshair className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-[15px] font-semibold text-neutral-900">
                  Competitor vs company
                </h3>
                <p className="mt-1 max-w-2xl text-[13px] leading-5 text-neutral-500">
                  {comparison?.summary ||
                    "Side-by-side service, technology, social, and content overlap."}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-[12px]">
              <span className="rounded-full bg-white px-3 py-1 font-medium text-neutral-700 ring-1 ring-[#E6E8F5]">
                {comparison?.competitor_count ?? comparisons.length} compared
              </span>
              {gaps?.total_gaps != null ? (
                <span className="rounded-full bg-white px-3 py-1 font-medium text-neutral-700 ring-1 ring-[#E6E8F5]">
                  {gaps.total_gaps} gaps
                </span>
              ) : null}
              {gaps?.high_priority_gaps ? (
                <span className="rounded-full bg-[#FEE2E2] px-3 py-1 font-medium text-[#B91C1C]">
                  {gaps.high_priority_gaps} high priority
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {hasCompanySnapshot ? (
          <div className="border-b border-[#EEF0F8] px-5 py-5 sm:px-6">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-[#5B57E6]" />
              <h4 className="text-[13px] font-semibold text-neutral-900">
                Your company snapshot
                {company?.name ? ` · ${company.name}` : ""}
              </h4>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div>
                <p className="mb-2 text-[12px] font-medium text-neutral-600">Services</p>
                <ChipList items={company?.services} />
              </div>
              <div>
                <p className="mb-2 text-[12px] font-medium text-neutral-600">Technologies</p>
                <ChipList items={company?.technologies} />
              </div>
              <div>
                <p className="mb-2 text-[12px] font-medium text-neutral-600">Keywords</p>
                <ChipList items={company?.keywords} />
              </div>
              <div>
                <p className="mb-2 text-[12px] font-medium text-neutral-600">Target audience</p>
                <ChipList items={company?.target_audience} />
              </div>
            </div>
            {company?.social ? (
              <dl className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-3">
                  <dt className="text-[11px] text-neutral-400">Followers</dt>
                  <dd className="mt-1 text-[13px] font-semibold text-neutral-900">
                    {formatNumber(company.social.followers)}
                  </dd>
                </div>
                <div className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-3">
                  <dt className="text-[11px] text-neutral-400">Engagement</dt>
                  <dd className="mt-1 text-[13px] font-semibold text-neutral-900">
                    {formatEngagement(company.social.avg_engagement_rate)}
                  </dd>
                </div>
                <div className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-3">
                  <dt className="text-[11px] text-neutral-400">Primary format</dt>
                  <dd className="mt-1 text-[13px] font-semibold text-neutral-900">
                    {company.social.primary_format || "—"}
                  </dd>
                </div>
                <div className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-3">
                  <dt className="text-[11px] text-neutral-400">Posting frequency</dt>
                  <dd className="mt-1 text-[13px] font-semibold text-neutral-900">
                    {formatPostingFrequency(company.social.posting_frequency) || "—"}
                  </dd>
                </div>
              </dl>
            ) : null}
          </div>
        ) : null}

        <div className="space-y-4 px-5 py-5 sm:px-6">
          {comparisons.length ? (
            comparisons.map((item, index) => (
              <ComparisonCard
                key={`${comparisonLabel(item)}-${index}`}
                item={item}
                index={index}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-[#E6E8F5] bg-[#F8F9FF] px-4 py-8 text-center">
              <FileText className="mx-auto size-5 text-neutral-300" />
              <p className="mt-2 text-[13px] text-neutral-500">
                No side-by-side competitor comparisons in this run yet.
              </p>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#ECEBFF] text-[#5B57E6]">
              <Layers3 className="size-4" />
            </span>
            <div>
              <h3 className="text-[15px] font-semibold text-neutral-900">
                Quantified competitive gaps
              </h3>
              <p className="mt-1 text-[13px] leading-5 text-neutral-500">
                {gaps?.summary || "Service, technology, and content gaps versus peers."}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {gaps?.total_gaps != null ? <Badge>{`${gaps.total_gaps} total`}</Badge> : null}
            {gaps?.high_priority_gaps != null ? (
              <Badge>{`${gaps.high_priority_gaps} high`}</Badge>
            ) : null}
            {gaps?.competitor_count != null ? (
              <Badge>{`${gaps.competitor_count} competitors`}</Badge>
            ) : null}
          </div>
        </div>

        {gapItems.length ? (
          <ul className="mt-4 space-y-3">
            {gapItems.map((item, index) => (
              <GapCard key={`${gapTitle(item)}-${index}`} item={item} index={index} />
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-[13px] text-neutral-500">No quantified gaps returned for this run.</p>
        )}

        {(contentGaps?.length || technologyGaps?.length) ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {contentGaps?.length ? (
              <div className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-4">
                <p className="mb-2 text-[12px] font-medium text-neutral-600">Content gaps</p>
                <ChipList items={contentGaps} />
              </div>
            ) : null}
            {technologyGaps?.length ? (
              <div className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-4">
                <p className="mb-2 text-[12px] font-medium text-neutral-600">Technology gaps</p>
                <ChipList items={technologyGaps} />
              </div>
            ) : null}
          </div>
        ) : null}
      </Card>
    </div>
  );
}
