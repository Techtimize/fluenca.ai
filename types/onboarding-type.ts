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
  instagram_username?: string | null;
  linkedin_url?: string | null;
  completed: boolean;
  completed_at: string | null;
}