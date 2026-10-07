export interface Company {
  industry: string;
  name: string;
  services: string[];
  target_audience: string[];
}

export interface ContentOpportunity {
  priority: string;
  topic: string;
}

export interface TopFormat {
  competitor_usage_pct: number;
  format: string;
}

export interface TopTopic {
  competitor_usage_pct: number;
  topic: string;
}

export interface ContentIntelligence {
  content_opportunities: ContentOpportunity[];
  top_formats: TopFormat[];
  top_topics: TopTopic[];
}

export interface ActionItem {
  priority: string;
  title: string;
}

export interface NinetyDayActionPlan {
  days_0_30: ActionItem[];
  days_31_60: ActionItem[];
  days_61_90: ActionItem[];
  summary: string;
}

export interface ContentRecommendationRequest {
  business_goals: string[];
  calendar_days: number;
  company: Company;
  company_id: string;
  content_intelligence: ContentIntelligence;
  idea_count: number;
  ninety_day_action_plan: NinetyDayActionPlan;
  platforms: string[];
}
