// Response of GET /analyzeCompany/dashboard/{company_id}.
// Every channel uses the same shape; a channel that was not analyzed keeps all keys with empty values.

export type DashboardLevel = "high" | "medium" | "low";
export type DashboardChannelId = "website" | "instagram" | "linkedin";
export type DashboardChannelStatus = "analyzed" | "not_analyzed" | "failed";
export type DashboardDocId = "company" | "marketing" | "pain_points" | "competitors";

export interface DashboardSocials {
  linkedin_url: string | null;
  instagram_url: string | null;
  instagram_username: string | null;
  facebook_url: string | null;
}

export interface DashboardCompetitor {
  id: string;
  name: string;
  website_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  logo_url: string | null;
  why_competitor?: string | null;
  confidence?: number | null;
  instagram_image_url?: string | null;
  linkedin_image_url?: string | null;
}

export interface DashboardCompanyCard {
  name: string;
  tagline: string;
  website_url: string | null;
  description: string;
  positioning: string | null;
  core_offering?: string | null;
  logo_url?: string | null;
  instagram_image_url?: string | null;
  linkedin_image_url?: string | null;
  tags: string[];
  socials: DashboardSocials;
  competitors: DashboardCompetitor[];
}

export interface DashboardDocumentationItem {
  id: DashboardDocId | string;
  title: string;
  subtitle: string;
}

export interface DashboardDocumentation {
  items: DashboardDocumentationItem[];
}

export interface DashboardMetric {
  id: string;
  label: string;
  score: number;
  max: number;
  change: number | null;
  caption: string;
}

export interface DashboardStat {
  id: string;
  label: string;
  value: string;
}

export interface DashboardOverall {
  score: number | null;
  summary: string | null;
  stats: DashboardStat[];
}

export interface DashboardStrengthsWeaknessesGroup {
  id: string;
  label: string;
  strengths: number;
  weaknesses: number;
  // The actual signals behind the counts; currently sent for the channel group only.
  strength_points?: string[];
  weakness_points?: string[];
}

export interface DashboardGrowthOpportunity {
  id: string;
  area: string;
  priority: DashboardLevel;
  finding: string;
  impact: string;
  action: string;
}

export interface DashboardGrowthOpportunities {
  total: number;
  by_priority: Record<DashboardLevel, number>;
  items: DashboardGrowthOpportunity[];
}

export interface DashboardRecommendedAction {
  rank: number;
  title: string;
  impact: DashboardLevel;
  effort: DashboardLevel;
}

export interface DashboardChannel {
  label: string;
  status: DashboardChannelStatus;
  status_message: string | null;
  metrics: DashboardMetric[];
  overall: DashboardOverall;
  strengths_weaknesses: { groups: DashboardStrengthsWeaknessesGroup[] };
  growth_opportunities: DashboardGrowthOpportunities;
  recommended_actions: DashboardRecommendedAction[];
}

export interface DashboardAnalytics {
  default_channel: DashboardChannelId | string;
  channel_order: (DashboardChannelId | string)[];
  channels: Record<string, DashboardChannel>;
}

export interface DashboardResponse {
  success: boolean;
  company_id: string;
  analysis_id: string;
  status: string;
  generated_at: string;
  data: {
    company_card: DashboardCompanyCard;
    documentation: DashboardDocumentation;
    analytics: DashboardAnalytics;
  };
}
