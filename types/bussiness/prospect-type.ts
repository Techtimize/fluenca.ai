/* Prospect finder: ideal customer profiles (ICPs) → background search runs → shortlist of prospects. */

// ---------- Ideal customer profiles ----------

export const ICP_NICHE_TYPES = ["b2b", "local", "uk", "enterprise"] as const;
export type IcpNicheType = (typeof ICP_NICHE_TYPES)[number];

export interface IcpCompanyFilters {
  industries: string[];
  employee_range: string[];
  /** ISO country codes, e.g. "GB". */
  countries: string[];
  cities: string[];
  keywords: string[];
  tech_used: string[];
  sic_codes: string[];
  osm_tags: string[];
}

export interface IcpPeopleFilters {
  titles: string[];
  seniority: string[];
}

export interface Icp {
  /** Set by the server, e.g. "icp_1". */
  id?: string;
  summary: string;
  why: string;
  niche_type: IcpNicheType;
  company: IcpCompanyFilters;
  people: IcpPeopleFilters;
  signals: string[];
  queries: string[];
  exclude_domains: string[];
}

/** GET / POST / PUT /prospects/icp */
export interface IcpResponse {
  icps: Icp[];
  version?: number;
  created_at?: string;
  updated_at?: string;
}

/** POST /prospects/icp — every field is optional; the DNA fills the gaps. */
export interface BuildIcpRequest {
  niche?: string;
  country?: string;
  goal?: string;
}

/** PUT /prospects/icp — saved as a new version. */
export interface UpdateIcpRequest {
  icps: Icp[];
}

// ---------- Search runs ----------

export type ProspectRunStatus = "queued" | "running" | "ready" | "failed";

export interface ProspectRun {
  id: string;
  status: ProspectRunStatus;
  /** What the search is doing right now, e.g. "finding companies". */
  stage?: string | null;
  icp_id?: string | null;
  /** Progress counters, e.g. { companies: 40, people: 96 }. */
  counts?: Record<string, number> | null;
  error?: string | null;
  created_at?: string;
  finished_at?: string | null;
}

/** POST /prospects/runs — the first profile is used when left out. */
export interface StartProspectRunRequest {
  icp_id?: string;
}

export const isRunFinished = (status?: ProspectRunStatus) => status === "ready" || status === "failed";

// ---------- Prospects ----------

export const PROSPECT_STATUSES = ["new", "saved", "contacted", "replied", "dismissed"] as const;
export type ProspectStatus = (typeof PROSPECT_STATUSES)[number];

/** The statuses PATCH /prospects/{id}/status accepts ("saved" goes through POST /save). */
export const SETTABLE_PROSPECT_STATUSES = ["new", "contacted", "replied", "dismissed"] as const;
export type SettableProspectStatus = (typeof SETTABLE_PROSPECT_STATUSES)[number];

export type EmailStatus = "verified" | "risky" | "unverified" | "none";
export type EnrichStatus = "none" | "queued" | "running" | "ready" | "failed";

export const isEnriching = (status?: EnrichStatus | null) => status === "queued" || status === "running";

export interface ProspectPerson {
  id: string;
  name: string;
  title?: string | null;
  linkedin_url?: string | null;
  email?: string | null;
  email_status: EmailStatus;
  role_fit?: string | number | null;
  prospect_score?: number | null;
}

export interface ProspectBrief {
  who_they_are: string;
  happening_now: string[];
  likely_challenge: string;
  why_they_fit: string;
  opening_angle: string;
}

/** An email draft can come as plain text or with its own subject line. */
export type EmailDraft = string | { subject?: string; body?: string };

export interface ProspectDraft {
  person_id?: string | null;
  linkedin_connect?: string | null;
  linkedin_message?: string | null;
  email_first?: EmailDraft | null;
  email_follow_up?: EmailDraft | null;
}

export interface Prospect {
  id: string;
  name: string;
  domain?: string | null;
  website?: string | null;
  industry?: string | null;
  country?: string | null;
  city?: string | null;
  employee_range?: string | null;
  /** Why this company made the shortlist. */
  reason?: string | null;
  score?: number | null;
  status: ProspectStatus;
  enrich_status?: EnrichStatus | null;
  run_id?: string | null;
  /** Best first, up to 3 in the shortlist. */
  people: ProspectPerson[];
  /** Only on GET /prospects/{id}. */
  brief?: ProspectBrief | null;
  drafts?: ProspectDraft[];
}

export interface ProspectsParams {
  run_id?: string | null;
  status?: ProspectStatus | null;
}

export interface UpdateProspectStatusRequest {
  status: SettableProspectStatus;
}
