export type Tone = "green" | "orange" | "purple" | "teal" | "sky" | "rose";
export type VitalStatus = "good" | "needs" | "poor";
export type Device = "mobile" | "desktop";

export type UserSummary = { name: string; avatarSrc?: string };
export type NavItem = { id: string; label: string; icon: string; href: string };

export type CompanyLink = {
  id: string;
  label: string;
  iconSrc: string;
  href?: string;
  imageUrl?: string | null;
};

export type Competitor = {
  id: string;
  name: string;
  logoSrc?: string | null;
  href?: string | null;
  websiteUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  instagramImageUrl?: string | null;
  linkedinImageUrl?: string | null;
};

export type Company = {
  name: string;
  tagline: string;
  logoSrc: string;
  logoUrl?: string | null;
  instagramImageUrl?: string | null;
  linkedinImageUrl?: string | null;
  coreOffering?: string | null;
  tags: string[];
  description: string;
  links: CompanyLink[];
  competitors: Competitor[];
};

// Positioning line and social links shown under the company description.
export type CompanyProfile = {
  positioning?: string | null;
  core_offering?: string | null;
  linkedin_url?: string | null;
  instagram_url?: string | null;
  instagram_username?: string | null;
};

export type DocItem = { id: string; title: string; subtitle: string; icon: string; href: string };

export type Metric = {
  id: string;
  label: string;
  score: number;
  change: string;
  icon: string;
  tone: Tone;
};

export type OverallPerformance = {
  summary: string;
  score: number;
  mobile?: number;
  desktop?: number;
  // When set, these replace the Mobile / Desktop boxes under the gauge.
  stats?: { label: string; value: string }[];
};

export type GrowthOpportunity = {
  id: string;
  area: string;
  priority: string;
  finding: string;
  impact: string;
  action: string;
};

export type AnalyticsCharts = {
  strengthsWeaknesses: { group: string; strengths: number; weaknesses: number }[];
  opportunitiesByPriority: { priority: string; count: number }[];
  opportunities?: GrowthOpportunity[];
  actions: { title: string; impact: string; effort: string; priority: number | null }[];
};

export type Integration = {
  id: string;
  title: string;
  subtitle: string;
  logoSrc: string;
  previewColor: string; // placeholder chart color until the real chart exists
  locked?: boolean;
};

export type Vital = { id: string; label: string; value: string; status: VitalStatus };
export type VitalsGroup = { id: string; title: string; summary: string; vitals: Vital[] };

export type AnalyticsSource = { id: string; label: string };

export type AnalyticsData = {
  // When set, the channel has no results and this message replaces the cards.
  emptyMessage?: string | null;
  metrics: Metric[];
  overall: OverallPerformance;
  integrations: Integration[];
  vitals: VitalsGroup[];
  charts?: AnalyticsCharts;
};

export type DashboardData = {
  user: UserSummary;
  company: Company;
  docs: DocItem[];
  analyticsSources: AnalyticsSource[];
  analytics: AnalyticsData;
};