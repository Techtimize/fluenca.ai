import { PAGE_ROUTES } from "@/constant/page-routes";
import type { AnalyzeCompanyResponse } from "@/types/bussiness/analyzecompany-type";
import type { AnalyticsData, Company, DocItem, Metric } from "@/types/dashboard";

function hostLabel(url?: string | null): string {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }
}

function truncate(text: string, max = 72): string {
  const clean = text.trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

function scoreMetric(
  id: string,
  label: string,
  score: number | null | undefined,
  tone: Metric["tone"],
  icon: string,
): Metric {
  const value = typeof score === "number" ? Math.round(score) : 0;
  return {
    id,
    label,
    score: value,
    change: value > 0 ? `${value}/100` : "—",
    icon,
    tone,
  };
}

export type DashboardAnalyzeView = {
  company: Company;
  docs: DocItem[];
  analytics: AnalyticsData;
  insights: {
    summaryText: string;
    detectedNiche: string;
    services: string[];
    targetAudience: string[];
    painPoints: string[];
    positioning: string;
    valueProposition: string;
    businessModel: string;
    pricing: string[];
    websiteSignals: string;
    instagram: { username: string; analyzed: boolean };
    linkedin: { url: string; isHiring: boolean; analyzed: boolean };
    links: {
      website: string;
      instagramUsername: string;
      linkedinUrl: string;
    };
    executiveSnapshot: AnalyzeCompanyResponse["executive_snapshot"];
    websiteChannel: AnalyzeCompanyResponse["digital_presence"]["website"];
    marketPosition: AnalyzeCompanyResponse["market_position"];
    positioningAnalysis: AnalyzeCompanyResponse["positioning_analysis"];
    strengthsAndWeaknesses: AnalyzeCompanyResponse["strengths_and_weaknesses"];
    growthOpportunities: AnalyzeCompanyResponse["growth_opportunities"];
    recommendedActions: AnalyzeCompanyResponse["recommended_actions"];
  };
};

export function mapAnalyzeCompanyToDashboard(
  data: AnalyzeCompanyResponse,
): DashboardAnalyzeView {
  const company = data.company ?? data.company_summary?.brief;
  const brief = data.company_summary?.brief;
  const config = data.company_summary?.config_patch;
  const dna = data.company_analysis?.company_dna;

  const website =
    config?.company_website || company?.website || brief?.website || "";
  const instagramUsername =
    config?.company_instagram_username ||
    company?.instagram_username ||
    brief?.instagram?.username ||
    "";
  const linkedinUrl =
    config?.company_linkedin_url ||
    company?.linkedin_url ||
    brief?.linkedin?.url ||
    "";

  const summaryText =
    data.company_summary?.summary_text ||
    config?.company_description ||
    "";
  const detectedNiche =
    config?.detected_niche || company?.industry || brief?.industry || "";
  const positioning =
    dna?.positioning ||
    company?.positioning ||
    brief?.positioning ||
    "";
  const services =
    dna?.services?.length
      ? dna.services
      : company?.services?.length
        ? company.services
        : brief?.services ?? [];
  const targetAudience =
    dna?.target_audience?.length
      ? dna.target_audience
      : company?.target_audience?.length
        ? company.target_audience
        : brief?.target_audience ?? [];
  const painPoints =
    dna?.pain_points?.length
      ? dna.pain_points
      : company?.pain_points?.length
        ? company.pain_points
        : brief?.pain_points ?? [];
  const valueProposition =
    dna?.value_proposition ||
    company?.value_proposition ||
    brief?.value_proposition ||
    "";
  const businessModel =
    dna?.business_model ||
    company?.business_model ||
    brief?.business_model ||
    data.executive_snapshot?.business_model ||
    "";
  const pricing = dna?.pricing?.length
    ? dna.pricing
    : brief?.pricing_signals ?? [];

  const tags = [
    detectedNiche,
    data.executive_snapshot?.company_type,
    data.market_position?.position,
    ...services.slice(0, 2),
  ].filter((tag, index, arr): tag is string =>
    Boolean(tag) && arr.indexOf(tag) === index,
  );

  const mappedCompany: Company = {
    name: company?.name || config?.company_name || "Company",
    tagline: detectedNiche || positioning || "Company intelligence",
    logoSrc: "/assets/techtimize-logo.png",
    tags,
    description: summaryText,
    links: [
      website
        ? {
            id: "web",
            label: hostLabel(website) || website,
            iconSrc: "/assets/icons/globe.png",
            href: website.startsWith("http") ? website : `https://${website}`,
          }
        : null,
      instagramUsername
        ? {
            id: "instagram",
            label: `@${instagramUsername.replace(/^@/, "")}`,
            iconSrc: "/assets/icons/instagram.png",
            href: `https://instagram.com/${instagramUsername.replace(/^@/, "")}`,
          }
        : null,
      linkedinUrl
        ? {
            id: "linkedin",
            label: hostLabel(linkedinUrl) || "LinkedIn",
            iconSrc: "/assets/icons/facebook.png",
            href: linkedinUrl,
          }
        : null,
    ].filter((link): link is NonNullable<typeof link> => Boolean(link)),
    competitors: [],
  };

  const docs: DocItem[] = [
    {
      id: "company",
      title: "Company Information",
      subtitle: truncate(
        [company?.industry, company?.region].filter(Boolean).join(" · ") ||
          "Detail our AI agents collected",
      ),
      icon: "file",
      href: PAGE_ROUTES.COMPANY_OVERVIEW,
    },
    {
      id: "dna",
      title: "Company DNA",
      subtitle: truncate(positioning || valueProposition || "Positioning, audience, and offer signals."),
      icon: "dna",
      href: PAGE_ROUTES.DNA,
    },
    {
      id: "marketing",
      title: "Marketing Position",
      subtitle: truncate(
        data.market_position?.assessment ||
          data.market_position?.position ||
          "Market positioning insights.",
      ),
      icon: "megaphone",
      href: "#market-position",
    },
    {
      id: "pain",
      title: "Pain Points",
      subtitle: truncate(
        painPoints[0] ||
          `${data.strengths_and_weaknesses?.weaknesses?.length ?? 0} weakness signals found.`,
      ),
      icon: "layers",
      href: "#strengths-weaknesses",
    },
    {
      id: "actions",
      title: "Recommended Actions",
      subtitle: truncate(
        data.recommended_actions?.[0]?.title ||
          `${data.recommended_actions?.length ?? 0} prioritized actions.`,
      ),
      icon: "chart",
      href: "#recommended-actions",
    },
  ];

  const presence = data.digital_presence;
  const channelScores = [presence?.website?.score, presence?.instagram?.score, presence?.linkedin?.score];
  const analyzedChannels = channelScores.filter((score) => typeof score === "number").length;
  const channelStatus = (channel?: { score: number | null; status?: string }) =>
    typeof channel?.score === "number" ? `${Math.round(channel.score)}/100` : channel?.status || "Not analyzed";
  const priorities = ["HIGH", "MEDIUM", "LOW"];

  const analytics: AnalyticsData = {
    sources: ["Website", "Instagram", "LinkedIn"],
    metrics: [
      scoreMetric("website", "Website", presence?.website?.score, "green", "accessibility"),
      scoreMetric("differentiation", "Differentiation", data.market_position?.differentiation_strength, "orange", "performance"),
      scoreMetric("clarity", "Positioning clarity", data.market_position?.positioning_clarity, "purple", "seo"),
      {
        id: "channels",
        label: "Channels analyzed",
        score: Math.round((analyzedChannels / channelScores.length) * 100),
        change: `${analyzedChannels} of ${channelScores.length} channels`,
        icon: "best-practices",
        tone: "teal",
      },
    ],
    overall: {
      summary:
        data.executive_snapshot?.market_position ||
        "Digital presence overview from company analysis",
      score: presence?.overall_score ?? 0,
      mobile: presence?.website?.score ?? 0,
      desktop: presence?.linkedin?.score ?? presence?.instagram?.score ?? 0,
      stats: [
        { label: "Instagram", value: channelStatus(presence?.instagram) },
        { label: "LinkedIn", value: channelStatus(presence?.linkedin) },
      ],
    },
    integrations: [],
    vitals: [],
    charts: {
      strengthsWeaknesses: [
        {
          group: "Company",
          strengths: data.strengths_and_weaknesses?.strengths?.length ?? 0,
          weaknesses: data.strengths_and_weaknesses?.weaknesses?.length ?? 0,
        },
        {
          group: "Website",
          strengths: presence?.website?.strengths?.length ?? 0,
          weaknesses: presence?.website?.weaknesses?.length ?? 0,
        },
      ],
      opportunitiesByPriority: priorities.map((priority) => ({
        priority,
        count: (data.growth_opportunities ?? []).filter(
          (item) => item.priority?.toUpperCase() === priority,
        ).length,
      })),
      actions: (data.recommended_actions ?? [])
        .filter((item) => item.title)
        .map((item) => ({
          title: item.title,
          impact: item.impact,
          effort: item.effort,
          priority: item.priority ?? null,
        })),
    },
  };

  return {
    company: mappedCompany,
    docs,
    analytics,
    insights: {
      summaryText,
      detectedNiche,
      services,
      targetAudience,
      painPoints,
      positioning,
      valueProposition,
      businessModel,
      pricing,
      websiteSignals: brief?.website_signals?.summary || "",
      instagram: {
        username: brief?.instagram?.username || instagramUsername,
        analyzed: Boolean(brief?.instagram?.analyzed ?? config?.user_instagram_analyzed),
      },
      linkedin: {
        url: brief?.linkedin?.url || linkedinUrl,
        isHiring: Boolean(brief?.linkedin?.is_hiring),
        analyzed: Boolean(brief?.linkedin?.analyzed ?? config?.user_linkedin_analyzed),
      },
      links: {
        website,
        instagramUsername,
        linkedinUrl,
      },
      executiveSnapshot: data.executive_snapshot,
      websiteChannel: data.digital_presence?.website,
      marketPosition: data.market_position,
      positioningAnalysis: data.positioning_analysis,
      strengthsAndWeaknesses: data.strengths_and_weaknesses,
      growthOpportunities: data.growth_opportunities ?? [],
      recommendedActions: data.recommended_actions ?? [],
    },
  };
}
