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

// ---------- Run candidates ----------

/** Every company a search found, in the order the API sends them (shortlisted first). */
export const CANDIDATE_OUTCOMES = [
  "shortlisted",
  "over_limit",
  "below_fit",
  "not_a_fit",
  "check_failed",
  "not_checked",
  "pending",
] as const;
export type CandidateOutcome = (typeof CANDIDATE_OUTCOMES)[number];

export interface ProspectCandidate {
  name: string;
  domain: string | null;
  source: string;
  source_url: string | null;
  signals: string[];
  city: string | null;
  country: string | null;
  outcome: CandidateOutcome;
  /** Set once the company was checked. */
  fit_score: number | null;
  /** Why it is not on the shortlist; null when it is. */
  reason: string | null;
  what_they_do: string | null;
  why_fit: string | null;
}

/** GET /prospects/runs/{run_id}/candidates query params. */
export interface ProspectCandidatesRequest {
  outcome?: CandidateOutcome | null;
}

/** GET /prospects/runs/{run_id}/candidates */
export interface ProspectCandidatesResponse {
  run_id: string;
  run_status: ProspectRunStatus;
  /** How many candidates have each outcome, before the `outcome` filter. */
  counts: Partial<Record<CandidateOutcome, number>>;
  items: ProspectCandidate[];
}

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

/** A recent fact about the company (news, hiring, funding, launches), with where it came from. */
export interface HappeningNowItem {
  fact: string;
  source_url?: string | null;
  date?: string | null;
}

export interface ProspectBrief {
  who_they_are: string;
  happening_now: HappeningNowItem[];
  likely_challenge: string;
  why_they_fit: string;
  opening_angle: string;
  sources?: string[];
  generated_at?: string | null;
}

export type ProspectDraftKind = "linkedin_connect" | "linkedin_message" | "email_first" | "email_follow_up";

/** One outreach draft; a person gets one of each kind. */
export interface ProspectDraft {
  id: string;
  person_id?: string | null;
  kind: ProspectDraftKind;
  /** Only emails have a subject. */
  subject?: string | null;
  body: string;
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
