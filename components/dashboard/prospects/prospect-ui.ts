import type {
  CandidateOutcome,
  EmailStatus,
  ProspectRunStatus,
  ProspectStatus,
} from "@/types/bussiness/prospect-type";

// Shared labels and badge styles for the prospect finder.

export const PROSPECT_STATUS_LABEL: Record<ProspectStatus, string> = {
  new: "New",
  saved: "Saved",
  contacted: "Contacted",
  replied: "Replied",
  dismissed: "Dismissed",
};

export const PROSPECT_STATUS_STYLE: Record<ProspectStatus, string> = {
  new: "bg-[#EEF0FF] text-[#4544C9]",
  saved: "bg-violet-50 text-violet-700",
  contacted: "bg-sky-50 text-sky-700",
  replied: "bg-emerald-50 text-emerald-700",
  dismissed: "bg-neutral-100 text-neutral-500",
};

export const EMAIL_STATUS_LABEL: Record<EmailStatus, string> = {
  verified: "Verified",
  risky: "Risky",
  unverified: "Unverified",
  none: "No email",
};

export const EMAIL_STATUS_STYLE: Record<EmailStatus, string> = {
  verified: "bg-emerald-50 text-emerald-700",
  risky: "bg-amber-50 text-amber-700",
  unverified: "bg-neutral-100 text-neutral-600",
  none: "bg-neutral-100 text-neutral-400",
};

export const RUN_STATUS_LABEL: Record<ProspectRunStatus, string> = {
  queued: "Queued",
  running: "Searching",
  ready: "Ready",
  failed: "Failed",
};

export const RUN_STATUS_STYLE: Record<ProspectRunStatus, string> = {
  queued: "bg-neutral-100 text-neutral-600",
  running: "bg-[#EEF0FF] text-[#4544C9]",
  ready: "bg-emerald-50 text-emerald-700",
  failed: "bg-rose-50 text-rose-700",
};

export const CANDIDATE_OUTCOME_LABEL: Record<CandidateOutcome, string> = {
  shortlisted: "Shortlisted",
  over_limit: "Over limit",
  below_fit: "Below fit",
  not_a_fit: "Not a fit",
  check_failed: "Check failed",
  not_checked: "Not checked",
  pending: "Pending",
};

export const CANDIDATE_OUTCOME_STYLE: Record<CandidateOutcome, string> = {
  shortlisted: "bg-emerald-50 text-emerald-700",
  over_limit: "bg-sky-50 text-sky-700",
  below_fit: "bg-amber-50 text-amber-700",
  not_a_fit: "bg-rose-50 text-rose-700",
  check_failed: "bg-rose-50 text-rose-700",
  not_checked: "bg-neutral-100 text-neutral-500",
  pending: "bg-[#EEF0FF] text-[#4544C9]",
};

export const BADGE ="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium";

export const CARD = "rounded-2xl border border-[#E6E8F5] bg-white";

export const FIELD_INPUT =
  "h-10 w-full rounded-xl border border-[#E6E8F5] bg-white px-3 text-[13px] text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-[#5B57E6] focus:ring-2 focus:ring-[#5B57E6]/20";

export const PRIMARY_BUTTON =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#5B57E6] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#4A46D0] disabled:opacity-55";

export const SECONDARY_BUTTON =
  "inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-medium text-neutral-700 ring-1 ring-[#E6E8F5] hover:bg-neutral-50 disabled:opacity-55";

/** "finding_companies" → "Finding companies" */
export const humanize = (value: string) => {
  const text = value.replace(/[_-]+/g, " ").trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/** "Oct 26, 14:05" */
export const formatDateTime = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
};

/** "a, b" ⇄ ["a", "b"] for the comma-separated inputs. */
export const toList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const fromList = (items?: string[]) => (items ?? []).join(", ");
