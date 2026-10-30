/* LinkedIn people & company search (/linkedin/people/*). Results come from context.dev as-is,
   so unavailable details are null or empty lists. */

// ---------- People search ----------

export interface PeopleSearchFilters {
  /** Two-letter country codes, e.g. ["AE", "GB"]. */
  countries?: string[];
  years_of_experience_min?: number | null;
  years_of_experience_max?: number | null;
}

/** POST /linkedin/people/search — for the next page send the same query and filters with `cursor`. */
export interface PeopleSearchRequest {
  query: string;
  filters?: PeopleSearchFilters | null;
  cursor?: string | null;
}

export interface PeopleSearchLocation {
  country_code?: string | null;
  region?: string | null;
  city?: string | null;
}

export interface PeopleSearchRole {
  title?: string | null;
  seniority?: string | null;
  functions?: string[] | null;
  started_on?: string | null;
  company?: { name?: string | null; domain?: string | null } | null;
}

export interface PeopleSearchPerson {
  name: string;
  description?: string | null;
  /** Public profile URLs, e.g. LinkedIn. */
  profiles?: string[] | null;
  location?: PeopleSearchLocation | null;
  role?: PeopleSearchRole | null;
  years_of_experience?: number | null;
  is_founder?: boolean | null;
  skills?: string[] | null;
  schools?: string[] | null;
}

export interface PeopleSearchResponse {
  results: PeopleSearchPerson[];
  /** null on the last page. */
  next_cursor: string | null;
  request_id?: string;
}

// ---------- Person detail ----------

/** POST /linkedin/people/detail — an email, profile URLs, or a first and last name with a company. */
export interface PersonDetailRequest {
  email?: string;
  social_urls?: string[];
  name?: { first: string; last: string };
  company?: { name?: string; domain?: string };
  location?: { city?: string; region?: string; country?: string };
}

export interface PartialDate {
  year: number;
  month?: number | null;
  day?: number | null;
}

export interface PersonOrganization {
  name: string;
  domain?: string | null;
}

export interface PersonRole {
  title: string;
  organization: PersonOrganization;
  location?: string | null;
  description?: string | null;
  start_date?: PartialDate | null;
  end_date?: PartialDate | null;
  is_current?: boolean | null;
}

export interface PersonEducation {
  institution?: PersonOrganization | null;
  degree?: string | null;
  field_of_study?: string | null;
  description?: string | null;
  start_date?: PartialDate | null;
  end_date?: PartialDate | null;
}

export interface PersonDetail {
  name?: { full?: string | null; first?: string | null; last?: string | null } | null;
  email?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  location?: {
    display?: string | null;
    city?: string | null;
    region?: string | null;
    country?: string | null;
    country_code?: string | null;
  } | null;
  social_urls: string[];
  website_urls: string[];
  current_role?: PersonRole | null;
  current_role_status: "present" | "none" | "unknown";
  experience: PersonRole[];
  education: PersonEducation[];
  skills: string[];
  last_updated?: string | null;
  checked_at?: string | null;
}

export type PersonDetailMatch =
  | { status: "candidate"; score: number; person: PersonDetail }
  | { status: "not_found"; score?: null; person?: null };

export interface PersonDetailResponse {
  match: PersonDetailMatch;
}

// ---------- Company search ----------

export interface CompanySearchFilters {
  /** Headquarters countries, e.g. ["AE"]. */
  countries?: string[];
  employees_min?: number | null;
  employees_max?: number | null;
}

/** POST /linkedin/people/companies/search — paging works like people search. */
export interface CompanySearchRequest {
  query: string;
  filters?: CompanySearchFilters | null;
  cursor?: string | null;
}

export interface CompanySearchResult {
  name: string;
  domain?: string | null;
  description?: string | null;
  organization_type?: string | null;
  operating_status?: string | null;
  industries?: string[] | null;
  founded_year?: number | null;
  headquarters?: {
    country_code?: string | null;
    region?: string | null;
    city?: string | null;
  } | null;
  /** `count` when the exact headcount is known, otherwise a min–max range (max null = open-ended). */
  employees?: { count?: number | null; min?: number | null; max?: number | null } | null;
  revenue?: { min_usd?: number | null; max_usd?: number | null } | null;
  funding?: {
    stage?: string | null;
    total_usd?: number | null;
    round_count?: number | null;
    latest_round?: { type?: string | null; date?: string | null; amount_usd?: number | null } | null;
  } | null;
}

export interface CompanySearchResponse {
  results: CompanySearchResult[];
  next_cursor: string | null;
  request_id?: string;
}
