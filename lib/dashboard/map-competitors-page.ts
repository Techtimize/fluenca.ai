import type {
  CompetitiveBriefCompetitor,
  CompetitorListItem,
  CompetitorsListResponse,
} from "@/types/bussiness/competitoranalysis-type";
import type {
  ChartSegment,
  CompetitorRow,
  CompetitorsPageData,
  HashtagItem,
  StatMetric,
} from "@/types/bussiness/dashboard";

const CHART_COLORS = ["#5B57E6", "#0A66C2", "#0F766E", "#B45309", "#C13584", "#0369A1"];

function formatCompact(value?: number | null) {
  if (typeof value !== "number") return "0";
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function competitorName(item: CompetitorListItem) {
  return item.name || item.company_name || item.username || "Competitor";
}

function competitorHandle(item: CompetitorListItem) {
  if (item.username) return item.username.startsWith("@") ? item.username : `@${item.username}`;
  return item.company_name || item.website || "—";
}

function websiteUrl(
  website?: string | null | { url?: string },
): string | null | undefined {
  if (!website) return website;
  if (typeof website === "string") return website;
  return website.url || null;
}

function isBriefCompetitor(
  item: CompetitorListItem | CompetitiveBriefCompetitor,
): item is CompetitiveBriefCompetitor {
  return (
    typeof item === "object" &&
    item !== null &&
    ("why_competitor" in item ||
      "what_they_sell" in item ||
      "links" in item ||
      (typeof (item as CompetitiveBriefCompetitor).website === "object" &&
        (item as CompetitiveBriefCompetitor).website !== null))
  );
}

function toCompetitorListItem(
  item: CompetitorListItem | CompetitiveBriefCompetitor,
): CompetitorListItem {
  if (!isBriefCompetitor(item)) {
    return {
      ...item,
      website: websiteUrl(item.website) ?? item.website,
    };
  }

  return {
    name: item.name,
    username: item.username,
    profile_url: item.profile_url || item.links?.instagram?.url,
    profile_picture_url:
      item.profile_picture_url ||
      item.image_url ||
      item.links?.instagram?.profile_picture_url,
    image_url: item.image_url || item.profile_picture_url,
    followers: item.followers ?? item.links?.instagram?.followers ?? null,
    website: websiteUrl(item.website) ?? item.links?.website?.url ?? null,
    linkedin_url: item.linkedin_url || item.links?.linkedin?.url || null,
    post_count:
      item.posts_count ??
      item.media_count ??
      item.links?.instagram?.media_count ??
      (Array.isArray(item.posts) ? item.posts.length : null),
    posts: item.posts,
    threat_level: item.threat_level,
    is_hiring: item.is_hiring,
    employee_count:
      item.linkedin_total_employees ?? item.employee_count ?? null,
    linkedin_company_size: item.linkedin_company_size,
    linkedin_total_employees: item.linkedin_total_employees,
    linkedin_profiles_sampled: item.linkedin_profiles_sampled,
    services: item.what_they_sell || item.website?.services,
    technologies: item.website?.technologies,
    company_size: item.linkedin_company_size,
  };
}

export function normalizeCompetitorsList(
  items?: Array<CompetitorListItem | CompetitiveBriefCompetitor> | null,
): CompetitorListItem[] {
  return (items ?? []).map(toCompetitorListItem);
}

function getCompetitors(data: CompetitorsListResponse): CompetitorListItem[] {
  const raw =
    data.result?.competitors ??
    data.result?.competitors_overview?.competitors ??
    data.result?.competitive_matchup?.competitors ??
    data.competitors ??
    [];

  return normalizeCompetitorsList(raw);
}

function buildStats(data: CompetitorsListResponse, competitors: CompetitorListItem[]): StatMetric[] {
  const avgEngagement =
    competitors.reduce((sum, item) => sum + (item.content_strategy?.avg_engagement_rate ?? 0), 0) /
    Math.max(competitors.length, 1);

  const planCount =
    (data.result?.report?.["90_day_action_plan"]?.days_0_30?.length ?? 0) +
    (data.result?.report?.["90_day_action_plan"]?.days_31_60?.length ?? 0) +
    (data.result?.report?.["90_day_action_plan"]?.days_61_90?.length ?? 0);

  return [
    {
      id: "competitors",
      label: "Competitors",
      value: String(data.competitor_count ?? competitors.length),
      subtitle: data.result?.matching_mode ? `${data.result.matching_mode} match` : "Discovered peers",
      iconVariant: "competitors",
    },
    {
      id: "posts",
      label: "Posts analyzed",
      value: formatCompact(data.post_count ?? data.result?.post_count ?? 0),
      subtitle: data.result?.overview?.region || "All platforms",
      iconVariant: "posts",
    },
    {
      id: "engagement",
      label: "Avg. engagement",
      value: `${avgEngagement.toFixed(2)}%`,
      subtitle: "Across competitors",
      iconVariant: "engagement",
    },
    {
      id: "calendar",
      label: "Plan actions",
      value: String(planCount),
      subtitle: "90-day initiatives",
      iconVariant: "calendar",
    },
  ];
}

function buildTopCompetitors(competitors: CompetitorListItem[]): CompetitorRow[] {
  return competitors.slice(0, 8).map((item, index) => ({
    rank: index + 1,
    handle: competitorHandle(item),
    name: competitorName(item),
    followers: item.followers ?? 0,
    avgEngagement: item.content_strategy?.avg_engagement_rate ?? 0,
    posts: item.post_count ?? item.content_strategy?.post_count ?? (Array.isArray(item.posts) ? item.posts.length : 0),
    growth: typeof item.similarity_percentages?.overall === "number" ? item.similarity_percentages.overall : 0,
    imageUrl: item.profile_picture_url || item.image_url || undefined,
    matchScore: typeof item.match_score === "number" ? item.match_score : undefined,
    website: item.website || undefined,
  }));
}

function buildSegmentsFromMedia(competitors: CompetitorListItem[]): ChartSegment[] {
  const totals = new Map<string, number>();
  competitors.forEach((item) => {
    item.content_strategy?.media_types?.forEach((media) => {
      const key = media.type || "Other";
      totals.set(key, (totals.get(key) ?? 0) + (media.count ?? media.share_pct ?? 1));
    });
  });
  return Array.from(totals.entries()).map(([label, value], index) => ({
    label,
    value,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));
}

function buildSegmentsFromThemes(competitors: CompetitorListItem[]): ChartSegment[] {
  const totals = new Map<string, number>();
  competitors.forEach((item) => {
    item.content_strategy?.themes?.forEach((theme) => {
      const key = theme.theme || "Theme";
      totals.set(key, (totals.get(key) ?? 0) + (theme.count ?? theme.share_pct ?? 1));
    });
  });
  return Array.from(totals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, value], index) => ({
      label,
      value,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));
}

function buildHashtags(competitors: CompetitorListItem[]): HashtagItem[] {
  const totals = new Map<string, number>();
  competitors.forEach((item) => {
    item.content_strategy?.top_hashtags?.forEach((tag) => {
      const key = tag.startsWith("#") ? tag : `#${tag}`;
      totals.set(key, (totals.get(key) ?? 0) + 1);
    });
  });
  const rows = Array.from(totals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  const maxCount = rows[0]?.[1] ?? 1;
  return rows.map(([tag, count]) => ({ tag, count, maxCount }));
}

function buildInsights(data: CompetitorsListResponse): string[] {
  const insights: string[] = [];
  const overview = data.result?.overview;
  if (overview?.key_insight) insights.push(overview.key_insight);
  overview?.growth_opportunities?.slice(0, 3).forEach((item) => {
    if (item.action) insights.push(`${item.area ? `${item.area}: ` : ""}${item.action}`);
  });
  data.result?.quantified_competitive_gaps?.gaps?.slice(0, 2).forEach((gap) => {
    const label = gap.item || gap.title || gap.category;
    if (label) insights.push(`Gap · ${label}${gap.priority ? ` (${gap.priority})` : ""}`);
  });
  if (!insights.length && data.summary) insights.push(data.summary.slice(0, 220));
  return insights.slice(0, 5);
}

function buildTopics(competitors: CompetitorListItem[], data: CompetitorsListResponse): string[] {
  const fromThemes = competitors
    .flatMap((item) => item.content_strategy?.themes?.map((theme) => theme.theme || "") ?? [])
    .filter(Boolean);

  const fromContentGap = (data.result?.strategic_insights?.content_gap?.items ?? [])
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        return String(record.theme || record.topic || record.title || record.item || "");
      }
      return "";
    })
    .filter(Boolean);

  return Array.from(new Set([...fromThemes, ...fromContentGap])).slice(0, 8);
}

export function mapCompetitorsPageData(data: CompetitorsListResponse): CompetitorsPageData {
  const competitors = getCompetitors(data);
  const companyName = data.result?.company?.name || "Your company";
  const createdAt = data.created_at ? new Date(data.created_at) : null;

  return {
    company: {
      name: companyName,
      subtitle:
        data.result?.overview?.market_position ||
        data.result?.overview?.company_type ||
        "Competitor intelligence",
      logoInitials: companyName.slice(0, 2).toUpperCase(),
    },
    lastUpdated: createdAt
      ? createdAt.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
      : "Just now",
    stats: buildStats(data, competitors),
    topCompetitors: buildTopCompetitors(competitors),
    contentTypes: buildSegmentsFromMedia(competitors),
    contentThemes: buildSegmentsFromThemes(competitors),
    hashtags: buildHashtags(competitors),
    trendingTopics: buildTopics(competitors, data),
    aiInsights: buildInsights(data),
  };
}
