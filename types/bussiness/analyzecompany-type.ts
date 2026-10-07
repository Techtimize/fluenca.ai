export type AnalyzeCompanyRequest = {
  company_data: string;
  company_id: string;
};

export type AnalyzeCompanySocialInstagram = {
  username: string;
  analyzed: boolean;
};

export type AnalyzeCompanySocialLinkedIn = {
  url: string;
  is_hiring: boolean;
  analyzed: boolean;
};

export type AnalyzeCompanyWebsiteSignals = {
  summary: string;
  crawled: boolean;
};

export type AnalyzeCompanyBrandImages = {
  logo_url?: string | null;
  linkedin_url?: string | null;
  instagram_url?: string | null;
  linkedin_image_url?: string | null;
  instagram_image_url?: string | null;
  website_url?: string | null;
  [key: string]: string | null | undefined;
};

export type AnalyzeCompanyProfile = {
  name: string;
  website: string;
  industry: string;
  region: string;
  instagram_username: string;
  instagram_url: string;
  linkedin_url: string;
  services: string[];
  flagship_services: string[];
  technologies: string[];
  keywords: string[];
  target_audience: string[];
  pain_points: string[];
  positioning: string;
  value_proposition: string;
  business_model: string;
  brand_images?: AnalyzeCompanyBrandImages | null;
};

export type AnalyzeCompanyBrief = AnalyzeCompanyProfile & {
  geography: string[];
  industries_targeted: string[];
  pricing_signals: string[];
  instagram: AnalyzeCompanySocialInstagram;
  linkedin: AnalyzeCompanySocialLinkedIn;
  website_signals: AnalyzeCompanyWebsiteSignals;
};

export type AnalyzeCompanyConfigPatch = {
  company: AnalyzeCompanyProfile;
  company_name: string;
  company_website: string;
  company_instagram_username: string;
  company_linkedin_url: string;
  detected_niche: string;
  niche_keywords: string[];
  user_instagram_analyzed: boolean;
  user_linkedin_analyzed: boolean;
  skip_company_analysis: boolean;
  company_description: string;
};

export type AnalyzeCompanySummary = {
  version: number;
  source: string;
  brief: AnalyzeCompanyBrief;
  summary_text: string;
  config_patch: AnalyzeCompanyConfigPatch;
};

export type AnalyzeCompanyDna = {
  services: string[];
  keywords: string[];
  technologies: string[];
  target_audience: string[];
  positioning: string | null;
  value_proposition: string;
  business_model: string;
  pricing: string[];
  industries: string[];
  pain_points: string[];
  differentiators: string[];
};

export type AnalyzeCompanyAnalysis = {
  company_dna: AnalyzeCompanyDna;
  is_hiring: boolean | null;
  company_size: string | null;
  job_openings: string[];
  linkedin_url: string | null;
  linkedin_content_themes: string[];
  instagram: Record<string, unknown>;
  social_handles: Record<string, unknown>;
};

export type AnalyzeCompanyExecutiveSnapshot = {
  company_type: string;
  business_model: string;
  primary_market: string;
  primary_customers: string[];
  core_offering: string;
  market_position: string;
  business_maturity: string;
  overall_digital_presence_score: number;
};

export type AnalyzeCompanyDigitalPresenceChannel = {
  score: number | null;
  strengths?: string[];
  weaknesses?: string[];
  followers?: number | null;
  engagement_rate?: number | null;
  content_strength?: number | null;
  audience_strength?: number | null;
  status?: string;
};

export type AnalyzeCompanyDigitalPresence = {
  overall_score: number;
  website: AnalyzeCompanyDigitalPresenceChannel;
  instagram: AnalyzeCompanyDigitalPresenceChannel;
  linkedin: AnalyzeCompanyDigitalPresenceChannel;
};

export type AnalyzeCompanyMarketPosition = {
  category: string;
  position: string;
  specialization: string;
  service_breadth: string;
  geographic_focus: string;
  enterprise_focus: string;
  differentiation_strength: number;
  positioning_clarity: number;
  assessment: string;
};

export type AnalyzeCompanyPositioningAnalysis = {
  what_you_are_known_for: string[];
  what_is_unclear: string[];
  recommended_positioning: string;
};

export type AnalyzeCompanyStrengthsAndWeaknesses = {
  strengths: string[];
  weaknesses: string[];
};

export type AnalyzeCompanyGrowthOpportunity = {
  priority: string;
  area: string;
  finding: string;
  impact: string;
  action: string;
};

export type AnalyzeCompanyRecommendedAction = {
  priority: number;
  title: string;
  category: string;
  impact: string;
  effort: string;
  action: string;
};

export type AnalyzeCompanyApiCallBreakdown = {
  tavily_search: number;
  tavily_extract: number;
  linkedin_playwright_pages: number;
  linkedin_tavily: number;
  firecrawl_scrape: number;
  firecrawl_search: number;
};

export type AnalyzeCompanyMeta = {
  status: string;
  duration_sec: number;
  timestamp: string;
  agent_mode: string;
  company_id: string;
  tavily_calls: number;
  instagram_calls: number;
  linkedin_calls: number;
  firecrawl_calls: number;
  api_call_breakdown: AnalyzeCompanyApiCallBreakdown;
  prompt_id: string | null;
  analysis_id: string | null;
  storage_error?: string | null;
};

export type AnalyzeCompanyResponse = {
  success?: boolean;
  error?: string | null;
  company: AnalyzeCompanyProfile;
  brand_images?: AnalyzeCompanyBrandImages | null;
  company_summary: AnalyzeCompanySummary;
  company_analysis: AnalyzeCompanyAnalysis;
  executive_snapshot: AnalyzeCompanyExecutiveSnapshot;
  digital_presence: AnalyzeCompanyDigitalPresence;
  market_position: AnalyzeCompanyMarketPosition;
  positioning_analysis: AnalyzeCompanyPositioningAnalysis;
  strengths_and_weaknesses: AnalyzeCompanyStrengthsAndWeaknesses;
  growth_opportunities: AnalyzeCompanyGrowthOpportunity[];
  recommended_actions: AnalyzeCompanyRecommendedAction[];
  warnings: string[];
  meta: AnalyzeCompanyMeta;
};

export interface AnalyzeCompanyResultsResponse {
  success: boolean;
  analysis_id: string;
  prompt_id: string | null;
  company_id: string;
  created_at: string;
  status: string;
  summary: string;
  result: AnalyzeCompanyResponse;
}
