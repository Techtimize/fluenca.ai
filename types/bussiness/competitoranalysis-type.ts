export interface CompetitorAnalysisRequest {
  company_id: string;
  mode?: "ai" | "manual";
  competitors?: string[];
}

export interface CompetitorAnalysisAsyncResponse {
  success?: boolean;
  message?: string;
  error?: string | null;
  job_id?: string;
  analysis_id?: string | null;
  status?: string;
}

export type CompetitorAnalysisResponse = CompetitorAnalysisAsyncResponse;

export interface CompetitorAnalysisJobResponse {
  success?: boolean;
  message?: string;
  error?: string | null;
  job_id?: string;
  analysis_id?: string | null;
  company_id?: string;
  status?: string;
  result?: unknown;
  [key: string]: unknown;
}

export interface CompetitorThemeShare {
  theme?: string;
  count?: number;
  share_pct?: number;
}

export interface CompetitorMediaTypeShare {
  type?: string;
  count?: number;
  share_pct?: number;
}

export interface CompetitorCategoryShare {
  category?: string;
  count?: number;
  share_pct?: number;
}

export interface CompetitorListContentStrategy {
  themes?: CompetitorThemeShare[];
  post_count?: number;
  media_types?: CompetitorMediaTypeShare[];
  top_hashtags?: string[];
  caption_style?: Record<string, number>;
  content_focus?: string;
  primary_format?: string;
  content_categories?: CompetitorCategoryShare[];
  avg_engagement_rate?: number;
  best_performing_format?: {
    format?: string;
    post_count?: number;
    avg_engagement_rate?: number;
  };
  primary_content_category?: string;
}

export interface CompetitorLinkedInEmployee {
  name?: string;
  level?: string;
  title?: string;
  designation?: string;
  source?: string;
  evidence?: string;
  linkedin_url?: string | null;
}

export interface CompetitorJobOpening {
  source?: string;
  snippet?: string;
  location?: string | null;
  job_title?: string;
  linkedin_url?: string | null;
}

export type CompetitorSizeRange = {
  min?: number | string | null;
  max?: number | string | null;
};

export interface CompetitorLinkedInAnalysis {
  signals?: string[];
  is_hiring?: boolean | null;
  open_roles?: number | null;
  post_count?: number | null;
  b2b_signals?: string[];
  company_size?: string | CompetitorSizeRange | null;
  sample_posts?: Array<{
    text?: string;
    source?: string;
    linkedin_url?: string | null;
  }>;
  active_hiring?: boolean | null;
  content_themes?: string[];
  employee_count?: number | null;
  avg_post_length?: number | null;
  is_thought_leader?: boolean | null;
  positioning_focus?: string | null;
  job_openings_count?: number | null;
  thought_leadership_posts?: number | null;
  thought_leadership_score?: number | null;
}

export interface CompetitorListItem {
  analysis_id?: string;
  prompt_id?: string;
  created_at?: string;
  company_name?: string;
  username?: string;
  name?: string;
  followers?: number | null;
  profile_url?: string;
  profile_picture_url?: string;
  image_url?: string;
  bio?: string | null;
  website?: string | null;
  discovered_by?: string;
  match_score?: number | null;
  match_reasons?: string[];
  content_strategy?: CompetitorListContentStrategy;
  post_count?: number | null;
  posts?: unknown[];
  industry?: string;
  services?: string[];
  technologies?: string[];
  keywords?: string[];
  linkedin_url?: string | null;
  linkedin_username?: string | null;
  threat_level?: string | null;
  is_hiring?: boolean | null;
  company_size?: string | CompetitorSizeRange | null;
  employee_count?: number | null;
  employees?: CompetitorLinkedInEmployee[];
  job_openings?: CompetitorJobOpening[];
  hiring_signals?: string[] | string | null;
  authenticity?: number | null;
  similarity?: number | null;
  niche_match?: number | null;
  region_match?: number | null;
  similarity_percentages?: {
    tech?: number;
    content?: number;
    overall?: number;
    location?: number;
    services?: number;
    marketing?: number;
  };
  social_warnings?: string[];
  linkedin_analysis?: CompetitorLinkedInAnalysis;
  instagram_analysis?: Record<string, unknown>;
  linkedin_company_size?: string | CompetitorSizeRange | null;
  linkedin_employee_range?: string | CompetitorSizeRange | null;
  linkedin_total_employees?: number | null;
  linkedin_profiles_sampled?: number | null;
}

export interface CompetitorChannelScore {
  score?: number | null;
  status?: string | null;
  strengths?: string[];
  weaknesses?: string[];
  followers?: number | null;
  engagement_rate?: number | null;
  content_strength?: number | null;
  audience_strength?: number | null;
}

export interface CompetitorGrowthOpportunity {
  area?: string;
  action?: string;
  priority?: string;
}

export interface CompetitorMarketPositionDetail {
  category?: string;
  position?: string;
  strengths?: string[];
  assessment?: string;
  weaknesses?: string[];
  specialization?: string;
  enterprise_focus?: string;
  geographic_focus?: string;
}

export interface CompetitorOverview {
  region?: string;
  key_insight?: string;
  company_type?: string;
  posts_analyzed?: number;
  market_position?: string;
  digital_presence?: {
    label?: string;
    score?: number | null;
    channels?: {
      website?: CompetitorChannelScore;
      linkedin?: CompetitorChannelScore;
      instagram?: CompetitorChannelScore;
    };
  };
  competitors_analyzed?: number;
  growth_opportunities?: CompetitorGrowthOpportunity[];
  market_position_detail?: CompetitorMarketPositionDetail;
}

export interface CompetitorCompanyExtractedSignals {
  name?: string | null;
  summary?: string | null;
  keywords?: string[];
  services?: string[];
  linkedin_url?: string | null;
  technologies?: string[];
  instagram_url?: string | null;
  flagship_services?: string[];
  linkedin_username?: string | null;
  target_industries?: string[];
  instagram_username?: string | null;
}

export interface CompetitorCompany {
  name?: string;
  website?: string;
  market?: string;
  region?: string;
  one_liner?: string;
  competitor_criteria?: string;
  services?: string[];
  linkedin_url?: string | null;
  instagram_url?: string | null;
  instagram?: CompetitiveBriefInstagramProfile;
  website_profile?: CompetitiveBriefWebsiteProfile;
  extracted_signals?: CompetitorCompanyExtractedSignals;
  flagship_services?: string[];
  instagram_username?: string | null;
}

export interface CompetitiveBriefLink {
  url?: string;
  verified?: boolean;
  username?: string;
  profile_picture_url?: string;
  followers?: number;
  following?: number;
  media_count?: number;
  posts_count?: number;
  post_count?: number;
  is_hiring?: boolean | null;
  profiles_sampled?: number;
  company_size?: string | null;
  total_employees?: number | null;
}

export interface CompetitiveBriefInstagramProfile {
  username?: string;
  followers?: number;
  following?: number;
  media_count?: number;
  posts_count?: number;
  post_count?: number;
  profile_url?: string;
  profile_picture_url?: string;
  name?: string;
  posts?: CompetitiveBriefInstagramPost[];
}

export interface CompetitiveBriefWebsiteProfile {
  url?: string;
  products?: string[];
  services?: string[];
  industries?: string[];
  description?: string;
  positioning?: string;
  technologies?: string[];
  pricing_model?: string;
  business_model?: string;
  target_audience?: string;
}

export interface CompetitiveBriefEmployee {
  name?: string;
  level?: string;
  title?: string;
  source?: string;
  designation?: string;
  linkedin_url?: string | null;
  evidence?: string;
}

export interface CompetitiveBriefCompetitorLinks {
  website?: CompetitiveBriefLink;
  linkedin?: CompetitiveBriefLink;
  instagram?: CompetitiveBriefLink;
}

export interface CompetitiveBriefOffers {
  core_offers?: string[];
  primary_cta?: string;
  pricing_model?: string;
}

export interface CompetitiveBriefOverlap {
  audience?: string[];
  services?: string[];
  geography?: string;
}

export interface CompetitiveBriefPositioning {
  proof_points?: string[];
  differentiators?: string[];
  primary_message?: string;
  secondary_messages?: string[];
}

export interface CompetitiveBriefTalkingPoint {
  theme?: string;
  channel?: string;
  evidence?: string;
}

export interface CompetitiveBriefCompeteChannel {
  how?: string;
  channel?: string;
}

export interface CompetitiveBriefCompetitor {
  name?: string;
  username?: string;
  profile_url?: string;
  profile_picture_url?: string;
  image_url?: string;
  followers?: number;
  following?: number;
  media_count?: number;
  posts_count?: number;
  posts?: CompetitiveBriefInstagramPost[];
  website?: CompetitiveBriefWebsiteProfile;
  linkedin_url?: string | null;
  is_hiring?: boolean | null;
  employees?: CompetitiveBriefEmployee[];
  employee_count?: number | null;
  linkedin_followers?: number | null;
  linkedin_post_count?: number | null;
  linkedin_company_size?: string | null;
  linkedin_total_employees?: number | null;
  linkedin_profiles_sampled?: number | null;
  links?: CompetitiveBriefCompetitorLinks;
  offers?: CompetitiveBriefOffers;
  missing?: string[];
  overlap?: CompetitiveBriefOverlap;
  positioning?: string | CompetitiveBriefPositioning;
  what_they_sell?: string[];
  who_they_target?: string[];
  threat_level?: string | null;
  talking_about?: CompetitiveBriefTalkingPoint[];
  threat_reason?: string;
  why_competitor?: string;
  target_audience?: string[];
  competition_type?: string;
  evidence_quality?: string;
  where_they_compete?: CompetitiveBriefCompeteChannel[];
}

export interface CompetitiveBriefLinkedInSide {
  name?: string;
  linkedin_url?: string | null;
  linkedin_followers?: number | null;
  linkedin_company_size?: string | null;
  linkedin_total_employees?: number | null;
  linkedin_profiles_sampled?: number | null;
  linkedin_post_count?: number | null;
  employees?: CompetitiveBriefEmployee[];
  is_hiring?: boolean | null;
}

export interface CompetitiveBriefLinkedInComparison {
  columns?: string[];
  rows?: CompetitiveBriefComparisonRow[];
  your_company?: CompetitiveBriefLinkedInSide;
  competitors?: CompetitiveBriefLinkedInSide[];
  so_what?: string;
}

export interface CompetitiveBriefWebsiteComparison {
  columns?: string[];
  rows?: CompetitiveBriefComparisonRow[];
  your_company?: CompetitiveBriefWebsiteProfile;
  competitors?: Array<CompetitiveBriefWebsiteProfile & { name?: string }>;
  so_what?: string;
}

export interface CompetitiveBriefCustomerProblemItem {
  problem?: string;
  why_it_matters?: string;
  competitors_involved?: string[];
}

export interface CompetitiveBriefCustomerProblem {
  summary?: string;
  problems?: CompetitiveBriefCustomerProblemItem[];
}

export interface CompetitiveBriefGapItem {
  gap?: string;
  evidence?: string;
  competitors_involved?: string[];
}

export interface CompetitiveBriefOpportunityItem {
  gap?: string;
  why_it_matters?: string;
  opportunity?: string;
  why?: string;
  type?: string;
}

export interface CompetitiveBriefRecommendedAction {
  action?: string;
  why?: string;
  how?: string;
  effort?: string;
  impact?: string;
}

export interface CompetitiveBriefComparisonRow {
  area?: string;
  your_company?: string;
  competitors?: Record<string, string>;
  insight?: string;
}

export interface CompetitiveBriefComparison {
  columns?: string[];
  rows?: CompetitiveBriefComparisonRow[];
  so_what?: string;
}

export interface CompetitiveBriefInstagramPost {
  competitor_name?: string;
  username?: string;
  id?: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
  likes?: number;
  comments?: number;
  engagement_rate?: number;
  hashtags?: string[];
}

export interface CompetitiveBriefOwnedTopic {
  owner?: string;
  topic?: string;
}

export interface CompetitiveBriefContentGaps {
  unowned_topics?: string[];
  you_should_explore?: string[];
  owned_by_competitors?: CompetitiveBriefOwnedTopic[];
}

export interface CompetitiveBriefOpportunity {
  why?: string;
  type?: string;
  opportunity?: string;
  gap?: string;
  why_it_matters?: string;
}

export interface CompetitiveBriefPositioningGaps {
  weak_messaging?: string[];
  crowded_messages?: string[];
  your_differentiation?: string[];
}

export interface CompetitiveBriefPriorityAction {
  why?: string;
  action?: string;
  effort?: string;
  impact?: string;
}

export interface CompetitiveBriefLandscapeSegment {
  segment?: string;
  competitors?: string[];
  how_they_compete?: string;
}

export interface CompetitiveBriefLandscape {
  summary?: string;
  segments?: CompetitiveBriefLandscapeSegment[];
}

export interface CompetitiveBriefStrategy {
  content_gaps?: CompetitiveBriefContentGaps;
  opportunities?: CompetitiveBriefOpportunity[];
  threat_signals?: string[];
  positioning_gaps?: CompetitiveBriefPositioningGaps;
  priority_actions?: CompetitiveBriefPriorityAction[];
  competitive_landscape?: CompetitiveBriefLandscape;
}

export interface CompetitiveBriefWhitespaceGap {
  gap?: string;
  area?: string;
  evidence?: string;
  confidence?: string;
  opportunity?: string;
  competitors_involved?: string[];
}

export interface CompetitiveBriefCrowdedArea {
  area?: string;
  note?: string;
  competitors?: string[];
}

export interface CompetitiveBriefMarketWhitespace {
  gaps?: CompetitiveBriefWhitespaceGap[];
  crowded_areas?: CompetitiveBriefCrowdedArea[];
  whitespace_summary?: string;
}

export interface CompetitorResultMeta {
  mode?: string;
  status?: string;
  version?: string | number;
  platforms?: string[];
  timestamp?: string;
  agent_mode?: string;
  post_limit?: number;
  serverless?: boolean;
  duration_sec?: number;
  tavily_calls?: number;
  skip_linkedin?: boolean;
  linkedin_calls?: number;
  prompt_version?: string;
  firecrawl_calls?: number;
  instagram_calls?: number;
  response_format?: string;
  competitor_limit?: number;
  discovery_source?: string;
  api_call_breakdown?: CompetitorApiCallBreakdown;
}

export interface CompetitorDna {
  pricing?: string[];
  keywords?: string[];
  services?: string[];
  industries?: string[];
  pain_points?: string[];
  positioning?: string | null;
  technologies?: string[];
  business_model?: string | null;
  differentiators?: string[];
  target_audience?: string[];
  value_proposition?: string | null;
}

export interface CompetitorRecommendedAction {
  title?: string;
  action?: string;
  effort?: string;
  impact?: string;
  category?: string;
  priority?: string | number;
  timeline?: string | null;
}

export interface CompetitorReportSectionIndexItem {
  id?: string;
  key?: string;
  title?: string;
}

export interface CompetitorExecutiveSummarySection {
  score?: number | null;
  region?: string;
  strengths?: string[];
  weaknesses?: string[];
  key_insight?: string;
  summary_text?: string;
  biggest_threat?: string | null;
  posts_analyzed?: number;
  biggest_opportunity?: string | null;
  competitors_analyzed?: number;
}

export interface CompetitorNinetyDayPlan {
  summary?: string;
  days_0_30?: CompetitorRecommendedAction[];
  days_31_60?: CompetitorRecommendedAction[];
  days_61_90?: CompetitorRecommendedAction[];
  all_actions?: CompetitorRecommendedAction[];
}

export interface CompetitorQuantifiedGapItem {
  item?: string;
  title?: string;
  gap?: string;
  name?: string;
  description?: string;
  action?: string;
  category?: string;
  type?: string;
  priority?: string | number;
  impact?: string;
  competitor?: string;
  competitor_name?: string;
  competitor_count?: number | null;
  metric?: string;
  your_value?: string | number | null;
  competitor_value?: string | number | null;
  gap_size?: number | null;
  gap_score?: number | null;
  score?: number | null;
  market_coverage_pct?: number | null;
}

export interface CompetitorQuantifiedGaps {
  gaps?: CompetitorQuantifiedGapItem[];
  summary?: string;
  categories?: Record<
    string,
    {
      top_gaps?: CompetitorQuantifiedGapItem[];
      gap_count?: number;
      avg_gap_score?: number;
    }
  >;
  total_gaps?: number;
  competitor_count?: number;
  high_priority_gaps?: number;
}

export interface CompetitorReportGapsSection {
  niche_gaps?: Record<string, unknown>;
  content_gap?: { items?: Array<string | Record<string, unknown>>; question?: string };
  legacy_gaps?: unknown[];
  technology_gap?: {
    items?: Array<string | Record<string, unknown>>;
    summary?: string;
    question?: string;
  };
  quantified_gaps?: CompetitorQuantifiedGaps;
  missing_services?: {
    items?: Array<string | Record<string, unknown>>;
    summary?: string;
    question?: string;
    total_missing?: number;
  };
}

export interface CompetitorReport {
  section_index?: CompetitorReportSectionIndexItem[];
  "01_executive_summary"?: CompetitorExecutiveSummarySection;
  "02_company_position"?: Record<string, unknown>;
  "03_digital_presence"?: Record<string, unknown>;
  "04_market_position"?: CompetitorMarketPositionDetail & Record<string, unknown>;
  "05_competitor_landscape"?: Record<string, unknown>;
  "06_competitive_gaps"?: CompetitorReportGapsSection;
  "07_linkedin_analysis"?: Record<string, unknown>;
  "08_content_analysis"?: Record<string, unknown>;
  "09_hashtag_analysis"?: Record<string, unknown>;
  "10_strategic_opportunities"?: Record<string, unknown>;
  "11_recommended_actions"?: { actions?: CompetitorRecommendedAction[] };
  "90_day_action_plan"?: CompetitorNinetyDayPlan;
}

export interface CompetitorMarketLadderItem {
  label?: string;
  score?: number;
  is_you?: boolean;
}

export interface CompetitorStrategicMarketPosition {
  question?: string;
  content_score?: number;
  position_label?: string;
  brand_visibility?: number;
  service_coverage?: number;
  market_percentile?: number;
  overall_similarity?: number;
  technology_coverage?: number;
  engagement_vs_market?: number;
}

export interface CompetitorStrategicInsights {
  seo_gap?: { question?: string; missing_keywords?: string[] };
  threats?: { items?: string[] };
  content_gap?: { items?: Array<string | Record<string, unknown>>; question?: string };
  opportunities?: {
    high_priority?: CompetitorRecommendedAction[];
    medium_priority?: CompetitorRecommendedAction[];
  };
  growth_signals?: { leaders?: string[]; question?: string };
  technology_gap?: {
    items?: Array<string | Record<string, unknown>>;
    summary?: string;
    question?: string;
  };
  market_position?: CompetitorStrategicMarketPosition;
  content_strategy?: {
    question?: string;
    top_formats?: string[];
    top_categories?: string[];
  };
  missing_services?: {
    items?: string[];
    summary?: string;
    question?: string;
    total_missing?: number;
  };
  posting_behavior?: {
    question?: string;
    best_posting_days?: string[];
    best_posting_time?: string;
    your_posts_per_week?: number;
    market_average_posts_per_week?: number;
  };
  customer_insights?: {
    version?: number;
    principles?: string[];
    next_actions?: {
      actions?: CompetitorRecommendedAction[];
      summary?: string;
      question?: string;
    };
    opportunity_gaps?: {
      gaps?: string[];
      summary?: string;
      question?: string;
    };
    real_competitors?: {
      summary?: string;
      question?: string;
      competitors?: CompetitorListItem[];
    };
    market_positioning?: {
      ladder?: CompetitorMarketLadderItem[];
      question?: string;
      position_label?: string;
      brand_visibility?: number;
      service_coverage?: number;
      technology_coverage?: number;
      engagement_vs_market?: number;
      similarity_to_market?: number;
      differentiation_opportunity?: string;
    };
  };
}

export interface CompetitorMatchupCompany {
  name?: string;
  social?: {
    followers?: number | null;
    content_themes?: string[];
    primary_format?: string | null;
    posting_frequency?: string | null;
    avg_engagement_rate?: number | null;
  };
  website?: string | null;
  industry?: string | null;
  keywords?: string[];
  services?: string[];
  technologies?: string[];
  target_audience?: string[];
}

export interface CompetitorCompetitiveMatchup {
  company?: CompetitorMatchupCompany;
  summary?: string;
  competitors?: CompetitorListItem[];
  competitor_count?: number;
  high_threat_count?: number;
}

export interface CompetitorOverlapComparison {
  summary?: string;
  shared?: string[];
  overlap?: string[];
  common?: string[];
  unique_to_company?: string[];
  unique_to_you?: string[];
  company_only?: string[];
  your_only?: string[];
  unique_to_competitor?: string[];
  competitor_only?: string[];
  missing?: string[];
  gap?: string[];
  shared_count?: number;
  company_only_count?: number;
  competitor_only_count?: number;
  overlap_score?: number | null;
  overlap_pct?: number | null;
  score?: number | null;
}

export interface CompetitorSocialSnapshot {
  followers?: number | null;
  content_themes?: string[];
  primary_format?: string | null;
  posting_frequency?: string | null;
  avg_engagement_rate?: number | null;
}

export interface CompetitorSocialComparison {
  summary?: string;
  company?: CompetitorSocialSnapshot;
  competitor?: CompetitorSocialSnapshot;
  delta?: {
    follower_gap?: number | null;
    engagement_gap_pct?: number | null;
    company_ahead_on_followers?: boolean;
    company_ahead_on_engagement?: boolean;
    competitor_ahead_on_followers?: boolean;
    competitor_ahead_on_engagement?: boolean;
  };
  /** Legacy flat fields */
  followers?: number | null;
  company_followers?: number | null;
  competitor_followers?: number | null;
  your_followers?: number | null;
  their_followers?: number | null;
  avg_engagement_rate?: number | null;
  company_engagement?: number | null;
  competitor_engagement?: number | null;
  your_engagement?: number | null;
  their_engagement?: number | null;
  content_themes?: string[];
  company_themes?: string[];
  competitor_themes?: string[];
  primary_format?: string | null;
  posting_frequency?: string | null;
  company_posting_frequency?: string | null;
  competitor_posting_frequency?: string | null;
}

export interface CompetitorContentComparison {
  summary?: string;
  themes?: string[];
  shared_themes?: string[];
  company_themes?: string[];
  competitor_themes?: string[];
  competitor_only_themes?: string[];
  company_primary_format?: string | null;
  competitor_primary_format?: string | null;
  formats?: string[];
  shared_formats?: string[];
  company_formats?: string[];
  competitor_formats?: string[];
  gaps?: string[];
  missing_topics?: string[];
  dominant_themes?: string[];
}

export interface CompetitorSimilarityDimension {
  verdict?: string;
  similarity_pct?: number;
  overlap_pct?: number;
  shared_themes?: string[];
  competitor_only_themes?: string[];
}

export interface CompetitorSideBySideComparison {
  name?: string;
  competitor_name?: string;
  company_name?: string;
  username?: string;
  website?: string | null;
  industry?: string | null;
  match_score?: number | null;
  overall_similarity_pct?: number | null;
  threat_level?: string | null;
  profile_picture_url?: string | null;
  image_url?: string | null;
  competitor?: CompetitorMatchupCompany & {
    username?: string;
    is_hiring?: boolean | null;
    company_size?: string | null;
    linkedin_url?: string | null;
    linkedin_company_size?: string | null;
    linkedin_employee_range?: string | null;
    linkedin_total_employees?: number | null;
    linkedin_profiles_sampled?: number | null;
  };
  service_comparison?: CompetitorOverlapComparison;
  services_comparison?: CompetitorOverlapComparison;
  technology_comparison?: CompetitorOverlapComparison;
  social_comparison?: CompetitorSocialComparison;
  content_comparison?: CompetitorContentComparison;
  content?: CompetitorContentComparison;
  hiring_comparison?: {
    company_is_hiring?: boolean | null;
    competitor_is_hiring?: boolean | null;
  };
  competitive_position?: {
    summary?: string;
    position?: string;
    similarity_pct?: number;
  };
  similarity_dimensions?: {
    content?: CompetitorSimilarityDimension;
    location?: CompetitorSimilarityDimension;
    services?: CompetitorSimilarityDimension;
    marketing?: CompetitorSimilarityDimension;
    technology?: CompetitorSimilarityDimension;
  };
  services?: string[];
  technologies?: string[];
  keywords?: string[];
}

export interface CompetitorVsCompanyComparison {
  company?: CompetitorMatchupCompany;
  summary?: string;
  comparisons?: CompetitorSideBySideComparison[];
  competitor_count?: number;
}

export interface CompetitorApiCallBreakdown {
  tavily_search?: number;
  tavily_extract?: number;
  linkedin_tavily?: number;
  firecrawl_scrape?: number;
  firecrawl_search?: number;
  linkedin_playwright_pages?: number;
}

export interface CompetitorAnalysisResult {
  meta?: CompetitorResultMeta;
  error?: string | null;
  report?: CompetitorReport;
  company?: CompetitorCompany;
  success?: boolean;
  summary?: string;
  strategy?: CompetitiveBriefStrategy;
  market_whitespace?: CompetitiveBriefMarketWhitespace;
  excluded_competitors?: string[];
  customer_problem?: CompetitiveBriefCustomerProblem;
  opportunities?: CompetitiveBriefOpportunityItem[];
  recommended_actions?: CompetitiveBriefRecommendedAction[];
  competitive_comparison?: CompetitiveBriefComparison;
  website_comparison?: CompetitiveBriefWebsiteComparison;
  linkedin_comparison?: CompetitiveBriefLinkedInComparison;
  instagram_content?: CompetitiveBriefInstagramPost[];
  competitors_instagram?: CompetitiveBriefInstagramProfile[];
  user_instagram?: CompetitiveBriefInstagramProfile;
  brand_images?: Record<string, unknown>;
  analysis?: Record<string, unknown>;
  overview?: CompetitorOverview;
  ai_report?: Record<string, unknown> | null;
  web_crawl?: Record<string, unknown> | null;
  post_count?: number;
  competitors?: Array<CompetitorListItem | CompetitiveBriefCompetitor>;
  gap_analysis?: Record<string, unknown> | null;
  matching_mode?: string;
  company_profile?: Record<string, unknown> | null;
  filters_applied?: Record<string, unknown> | null;
  market_insights?: Record<string, unknown> | null;
  recommendations?: CompetitorRecommendedAction[];
  company_analysis?: {
    instagram?: Record<string, unknown>;
    is_hiring?: boolean | null;
    company_dna?: CompetitorDna;
    company_size?: string | null;
    job_openings?: string[];
    linkedin_url?: string | null;
    social_handles?: Record<string, unknown>;
    linkedin_content_themes?: string[];
  };
  competitive_gaps?: CompetitiveBriefGapItem[] | Record<string, unknown> | null;
  competitor_count?: number;
  customer_insights?: Record<string, unknown> | null;
  similarity_scores?: Array<Record<string, unknown>>;
  discovery_warnings?: string[];
  strategic_insights?: CompetitorStrategicInsights;
  competitive_matchup?: CompetitorCompetitiveMatchup;
  search_intelligence?: Record<string, unknown> | null;
  competitors_overview?: {
    region?: string;
    competitors?: CompetitorListItem[];
    market_summary?: Record<string, unknown>;
    posts_analyzed?: number;
    total_competitors?: number;
  };
  content_intelligence?: Record<string, unknown> | null;
  business_intelligence?: Record<string, unknown> | null;
  company_social_analysis?: {
    company_dna?: CompetitorDna;
    user_linkedin?: Record<string, unknown>;
    detected_niche?: string | null;
    social_handles?: Record<string, unknown>;
    user_instagram?: Record<string, unknown>;
    audience_pain_points?: string[];
  };
  competitor_intelligence?: Record<string, unknown> | null;
  competitor_website_intel?: Array<Record<string, unknown>>;
  quantified_competitive_gaps?: CompetitorQuantifiedGaps;
  competitor_intelligence_report?: Record<string, unknown> | null;
  competitor_vs_company_comparison?: CompetitorVsCompanyComparison;
}

export interface CompetitorsListResponse {
  success?: boolean;
  analysis_id?: string | null;
  prompt_id?: string | null;
  company_id?: string;
  created_at?: string;
  status?: string;
  summary?: string;
  competitor_count?: number;
  post_count?: number;
  result?: CompetitorAnalysisResult | null;
  error?: string | null;
  version?: string | number | null;
  analysis_count?: number;
  count?: number;
  company?: CompetitorCompany;
  competitors?: Array<CompetitorListItem | CompetitiveBriefCompetitor>;
  customer_problem?: CompetitiveBriefCustomerProblem;
  competitive_gaps?: CompetitiveBriefGapItem[];
  opportunities?: CompetitiveBriefOpportunityItem[];
  recommended_actions?: CompetitiveBriefRecommendedAction[];
  competitive_comparison?: CompetitiveBriefComparison;
  website_comparison?: CompetitiveBriefWebsiteComparison;
  linkedin_comparison?: CompetitiveBriefLinkedInComparison;
  instagram_content?: CompetitiveBriefInstagramPost[];
  competitors_instagram?: CompetitiveBriefInstagramProfile[];
  user_instagram?: CompetitiveBriefInstagramProfile;
  brand_images?: Record<string, unknown>;
  meta?: CompetitorResultMeta;
}

export interface CompetitorAnalysisVersionItem {
  version: string;
  label?: string;
  created_at?: string;
  status?: string;
  analysis_id?: string;
}

export type CompetitorAnalysisVersionsResponse =
  | CompetitorAnalysisVersionItem[]
  | string[]
  | number[]
  | {
      versions?: Array<CompetitorAnalysisVersionItem | string | number>;
      data?: Array<CompetitorAnalysisVersionItem | string | number>;
      items?: Array<CompetitorAnalysisVersionItem | string | number>;
      results?: Array<CompetitorAnalysisVersionItem | string | number>;
      [key: string]: unknown;
    };

export interface CompetitorAnalysisManualRequest {
  company_id: string;
  competitors: string[];
}
