export interface OnboardingRequestProps {
  company_name: string;
  industry: string;
  primary_product_or_service: string;
  language: string;
  website_url: string;
  target_country: string;
  target_city?: string | null;
  instagram_username?: string | null;
  linkedin_url?: string | null;
}
export interface OnboardingResponseProps {
  company_id: string;
  company_name: string | null;
  industry: string | null;
  primary_product_or_service: string | null;
  language: string | null;
  website_url: string | null;
  target_country: string | null;
  target_city: string | null;
  completed: boolean;
  completed_at: string | null;
}


export type AnalyzeCompanyRequest = {
  website_url?: string;
  company_data: string;
  region: string;
  company_id: string;
  instagram_username: string;
  linkedin_url?: string;
};



export type CompanySocialInstagram = {
  username: string;
  analyzed: boolean;
};

export type CompanySocialLinkedIn = {
  url: string;
  is_hiring: boolean;
  analyzed: boolean;
};

export type CompanyWebsiteSignals = {
  summary: string;
  crawled: boolean;
};

export type CompanySummary = {
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
  industries_targeted: string[];
  business_model: string;
  pricing_signals: string[];
  value_proposition: string;
  pain_points: string[];
  positioning: string;
  instagram: CompanySocialInstagram;
  linkedin: CompanySocialLinkedIn;
  website_signals: CompanyWebsiteSignals;
};

export type ConfigPatchCompany = {
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
};

export type ConfigPatch = {
  company: ConfigPatchCompany;
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

export type CompanyDna = {
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

export type CompanyAnalysis = {
  company_dna: CompanyDna;
  is_hiring: boolean | null;
  company_size: string | null;
  job_openings: string[];
  linkedin_url: string | null;
  linkedin_content_themes: string[];
  instagram: Record<string, unknown>;
  social_handles: Record<string, unknown>;
};

export type ExecutiveSnapshot = {
  company_type: string;
  business_model: string;
  primary_market: string;
  primary_customers: string[];
  core_offering: string;
  market_position: string;
  business_maturity: string;
  overall_digital_presence_score: number;
};

export type DigitalPresenceChannel = {
  score: number | null;
  strengths?: string[];
  weaknesses?: string[];
  followers?: number | null;
  engagement_rate?: number | null;
  content_strength?: number | null;
  audience_strength?: number | null;
  status?: string;
};

export type DigitalPresence = {
  overall_score: number;
  website: DigitalPresenceChannel;
  instagram: DigitalPresenceChannel;
  linkedin: DigitalPresenceChannel;
};

export type MarketPosition = {
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

export type PositioningAnalysis = {
  what_you_are_known_for: string[];
  what_is_unclear: string[];
  recommended_positioning: string;
};

export type StrengthsAndWeaknesses = {
  strengths: string[];
  weaknesses: string[];
};

export type GrowthOpportunity = {
  priority: string;
  area: string;
  finding: string;
  impact: string;
  action: string;
};

export type RecommendedAction = {
  priority: number;
  title: string;
  category: string;
  impact: string;
  effort: string;
  action: string;
};

export type ApiCallBreakdown = {
  tavily_search: number;
  tavily_extract: number;
  linkedin_playwright_pages: number;
  linkedin_tavily: number;
  firecrawl_scrape: number;
  firecrawl_search: number;
};

export type AnalysisMeta = {
  status: string;
  duration_sec: number;
  timestamp: string;
  agent_mode: string;
  company_id: string;
  tavily_calls: number;
  instagram_calls: number;
  linkedin_calls: number;
  firecrawl_calls: number;
  api_call_breakdown: ApiCallBreakdown;
  prompt_id: string | null;
  analysis_id: string | null;
  storage_error: string | null;
};

export type AnalyzeCompanyResponse = {
  success: boolean;
  error: string | null;
  company_summary: CompanySummary;
  summary_text: string;
  config_patch: ConfigPatch;
  company_analysis: CompanyAnalysis;
  executive_snapshot: ExecutiveSnapshot;
  digital_presence: DigitalPresence;
  market_position: MarketPosition;
  positioning_analysis: PositioningAnalysis;
  strengths_and_weaknesses: StrengthsAndWeaknesses;
  growth_opportunities: GrowthOpportunity[];
  recommended_actions: RecommendedAction[];
  warnings: string[];
  meta: AnalysisMeta;
};
