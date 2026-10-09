// Response of GET /analyzeCompany/dashboard/{company_id}/documentation.
// Each key matches an `id` in the dashboard's documentation.items.

export interface DocumentationSocials {
  linkedin_url?: string | null;
  instagram_url?: string | null;
  facebook_url?: string | null;
}

export interface CompanyDocumentationDetails {
  name: string;
  website?: string | null;
  industry?: string | null;
  region?: string | null;
  business_model?: string | null;
  business_maturity?: string | null;
  summary?: string | null;
  core_offering?: string | null;
  services?: string[];
  technologies?: string[];
  target_audience?: string[];
  industries_targeted?: string[];
  socials?: DocumentationSocials;
}

export interface ContentPillar {
  name: string;
  services?: string[];
  topics?: string[];
}

export interface MarketingDocumentationDetails {
  positioning?: string | null;
  value_proposition?: string | null;
  assessment?: string | null;
  scores?: {
    positioning_clarity?: number | null;
    differentiation_strength?: number | null;
  };
  attributes?: {
    specialization?: string | null;
    service_breadth?: string | null;
    enterprise_focus?: string | null;
    geographic_focus?: string | null;
  };
  known_for?: string[];
  what_is_unclear?: string[];
  keywords?: string[];
  content_pillars?: ContentPillar[];
}

export interface PainPointsDocumentationDetails {
  pain_points?: string[];
  who_feels_it?: string[];
  how_you_solve_it?: string[];
}

export interface DocumentationCompetitor {
  id: string;
  name: string;
  logo_url?: string | null;
  website_url?: string | null;
  instagram_url?: string | null;
  linkedin_url?: string | null;
  why_competitor?: string | null;
}

export interface CompetitorsDocumentationDetails {
  count?: number;
  matching_criteria?: string[];
  items?: DocumentationCompetitor[];
}

export interface DocumentationSection<T> {
  id: string;
  title: string;
  subtitle: string;
  details: T;
}

export interface DashboardDocumentationData {
  company?: DocumentationSection<CompanyDocumentationDetails>;
  marketing?: DocumentationSection<MarketingDocumentationDetails>;
  pain_points?: DocumentationSection<PainPointsDocumentationDetails>;
  competitors?: DocumentationSection<CompetitorsDocumentationDetails>;
}

export type DashboardDocumentationId = keyof DashboardDocumentationData;

export interface DashboardDocumentationResponse {
  success: boolean;
  data: DashboardDocumentationData;
}
