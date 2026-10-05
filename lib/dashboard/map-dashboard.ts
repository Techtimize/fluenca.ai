import { PAGE_ROUTES } from "@/constant/page-routes";
import type {
  DashboardChannel,
  DashboardCompanyCard,
  DashboardDocumentationItem,
  DashboardResponse,
} from "@/types/bussiness/dashboard-type";
import type {
  AnalyticsData,
  AnalyticsSource,
  Company,
  CompanyProfile,
  DocItem,
  Metric,
  Tone,
} from "@/types/dashboard";

export type DashboardView = {
  company: Company;
  profile: CompanyProfile;
  docs: DocItem[];
  sources: AnalyticsSource[];
  defaultSource: string;
  channels: Record<string, AnalyticsData>;
};

// Metric cards are coloured by position, matching the design.
const METRIC_TONES: Tone[] = ["green", "orange", "purple", "teal"];
const METRIC_ICONS: Record<string, string> = {
  overall_quality: "accessibility",
  differentiation: "performance",
  positioning_clarity: "seo",
  content_strength: "best-practices",
};
const FALLBACK_ICONS = ["accessibility", "performance", "seo", "best-practices"];

// The backend sends only ids; icons and links live on the frontend.
const DOC_LINKS: Record<string, { icon: string; href: string }> = {
  company: { icon: "file", href: PAGE_ROUTES.COMPANY_OVERVIEW },
  marketing: { icon: "megaphone", href: PAGE_ROUTES.DNA },
  pain_points: { icon: "layers", href: PAGE_ROUTES.DNA },
  competitors: { icon: "chart", href: PAGE_ROUTES.COMPETITOR_ANALYSIS },
};

const PRIORITIES = ["high", "medium", "low"] as const;

function hostLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }
}

function mapCompany(card: DashboardCompanyCard): Company {
  const { socials } = card;
  const instagramHandle = socials.instagram_username?.replace(/^@/, "");

  return {
    name: card.name || "Company",
    tagline: card.tagline,
    logoSrc: "/assets/techtimize-logo.png",
    tags: card.tags ?? [],
    description: card.description ?? "",
    links: [
      card.website_url
        ? { id: "web", label: hostLabel(card.website_url), iconSrc: "/assets/icons/globe.png", href: card.website_url }
        : null,
      socials.instagram_url || instagramHandle
        ? {
            id: "instagram",
            label: instagramHandle ? `@${instagramHandle}` : "Instagram",
            iconSrc: "/assets/icons/instagram.png",
            href: socials.instagram_url ?? `https://instagram.com/${instagramHandle}`,
          }
        : null,
      socials.linkedin_url
        ? { id: "linkedin", label: "LinkedIn", iconSrc: "/assets/icons/linkedin.png", href: socials.linkedin_url }
        : null,
      socials.facebook_url
        ? { id: "facebook", label: "Facebook", iconSrc: "/assets/icons/facebook.png", href: socials.facebook_url }
        : null,
    ].filter((link): link is NonNullable<typeof link> => Boolean(link)),
    competitors: (card.competitors ?? []).map((c) => ({
      id: c.id,
      name: c.name,
      logoSrc: c.logo_url,
      href: c.website_url ?? c.linkedin_url ?? c.instagram_url,
    })),
  };
}

function mapDoc(item: DashboardDocumentationItem): DocItem {
  const link = DOC_LINKS[item.id] ?? { icon: "file", href: PAGE_ROUTES.COMPANY_OVERVIEW };
  return { id: item.id, title: item.title, subtitle: item.subtitle, ...link };
}

function mapChannel(channel: DashboardChannel): AnalyticsData {
  const hasResults = channel.status === "analyzed" && channel.metrics.length > 0;

  const metrics: Metric[] = channel.metrics.map((m, index) => ({
    id: m.id,
    label: m.label,
    score: m.max ? Math.round((m.score / m.max) * 100) : m.score,
    change: m.caption,
    icon: METRIC_ICONS[m.id] ?? FALLBACK_ICONS[index % FALLBACK_ICONS.length],
    tone: METRIC_TONES[index % METRIC_TONES.length],
  }));

  return {
    emptyMessage: hasResults ? null : channel.status_message || `${channel.label} has not been analyzed yet.`,
    metrics,
    overall: {
      summary: channel.overall.summary ?? "",
      score: channel.overall.score ?? 0,
      stats: channel.overall.stats.map((stat) => ({ label: stat.label, value: stat.value })),
    },
    integrations: [],
    vitals: [],
    charts: {
      strengthsWeaknesses: channel.strengths_weaknesses.groups.map((g) => ({
        group: g.label,
        strengths: g.strengths,
        weaknesses: g.weaknesses,
      })),
      opportunitiesByPriority: PRIORITIES.map((priority) => ({
        priority: priority.toUpperCase(),
        count: channel.growth_opportunities.by_priority[priority] ?? 0,
      })),
      opportunities: channel.growth_opportunities.items,
      actions: [...channel.recommended_actions]
        .sort((a, b) => a.rank - b.rank)
        .map((a) => ({ title: a.title, impact: a.impact, effort: a.effort, priority: a.rank })),
    },
  };
}

export function mapDashboard(response: DashboardResponse): DashboardView {
  const { company_card, documentation, analytics } = response.data;

  const order = analytics.channel_order?.length ? analytics.channel_order : Object.keys(analytics.channels);
  const ids = order.filter((id) => analytics.channels[id]);

  return {
    company: mapCompany(company_card),
    profile: {
      positioning: company_card.positioning,
      linkedin_url: company_card.socials.linkedin_url,
      instagram_url: company_card.socials.instagram_url,
      instagram_username: company_card.socials.instagram_username,
    },
    docs: (documentation.items ?? []).map(mapDoc),
    sources: ids.map((id) => ({ id, label: analytics.channels[id].label })),
    defaultSource: ids.includes(analytics.default_channel) ? analytics.default_channel : (ids[0] ?? ""),
    channels: Object.fromEntries(ids.map((id) => [id, mapChannel(analytics.channels[id])])),
  };
}
