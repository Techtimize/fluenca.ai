export type ContentExecutionItemStatus =
  | "planned"
  | "queued"
  | "scripted"
  | "imaged"
  | "publishing"
  | "published"
  | "failed"
  | "skipped"
  | "agent_mode_disabled"
  | string;

export type ContentExecutionRunStatus =
  | "pending"
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "partial"
  | string;

export interface ContentExecutionSettings {
  auto_publish_enabled?: boolean;
  agent_mode_enabled?: boolean;
  company_id?: string;
  require_approval?: boolean;
  timezone?: string | null;
  platforms?: string[];
  updated_at?: string | null;
  [key: string]: unknown;
}

export interface ContentExecutionSettingsRequest {
  auto_publish_enabled?: boolean;
  agent_mode_enabled?: boolean;
  require_approval?: boolean;
  timezone?: string;
  platforms?: string[];
}

export interface ContentExecutionSettingsResponse {
  success?: boolean;
  message?: string;
  error?: string | null;
  settings?: ContentExecutionSettings;
  auto_publish_enabled?: boolean;
  agent_mode_enabled?: boolean;
  [key: string]: unknown;
}

export interface ContentExecutionAgentModeRequest {
  enabled: boolean;
}

export interface ContentExecutionAgentModeResponse {
  success?: boolean;
  message?: string;
  error?: string | null;
  enabled?: boolean;
  agent_mode_enabled?: boolean;
  settings?: ContentExecutionSettings;
  [key: string]: unknown;
}

export interface ContentExecutionRunRequest {
  company_id?: string;
  date?: string;
  force?: boolean;
}

export interface ContentExecutionRunResponse {
  success?: boolean;
  message?: string;
  error?: string | null;
  run_id?: string;
  job_id?: string;
  status?: ContentExecutionRunStatus;
  company_id?: string;
  queued?: boolean;
  [key: string]: unknown;
}

export interface ContentExecutionDailyResponse {
  success?: boolean;
  message?: string;
  error?: string | null;
  companies_queued?: number;
  run_ids?: string[];
  status?: ContentExecutionRunStatus;
  [key: string]: unknown;
}

export interface ContentExecutionItem {
  id?: string;
  calendar_item_id?: string;
  company_id?: string;
  date?: string;
  platform?: string;
  status?: ContentExecutionItemStatus;
  title?: string;
  topic?: string;
  hook?: string;
  caption?: string;
  cta?: string;
  format?: string;
  script_id?: string | null;
  image_ids?: string[];
  image_url?: string | null;
  publish_post_id?: string | null;
  permalink?: string | null;
  error?: string | null;
  published_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: unknown;
}

export type ContentExecutionItemsResponse =
  | ContentExecutionItem[]
  | {
      success?: boolean;
      message?: string;
      error?: string | null;
      items?: ContentExecutionItem[];
      data?: ContentExecutionItem[] | { items?: ContentExecutionItem[] };
      results?: ContentExecutionItem[];
      count?: number;
      [key: string]: unknown;
    };

export interface ContentExecutionRun {
  id?: string;
  run_id?: string;
  job_id?: string;
  company_id?: string;
  status?: ContentExecutionRunStatus;
  trigger?: "daily" | "manual" | "cron" | string;
  date?: string;
  items_total?: number;
  items_published?: number;
  items_failed?: number;
  items_skipped?: number;
  error?: string | null;
  started_at?: string | null;
  finished_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  logs?: string[];
  [key: string]: unknown;
}

export type ContentExecutionRunsResponse =
  | ContentExecutionRun[]
  | {
      success?: boolean;
      message?: string;
      error?: string | null;
      runs?: ContentExecutionRun[];
      data?: ContentExecutionRun[] | { runs?: ContentExecutionRun[] };
      results?: ContentExecutionRun[];
      count?: number;
      [key: string]: unknown;
    };

export function normalizeContentExecutionItems(
  data?: ContentExecutionItemsResponse | null,
): ContentExecutionItem[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.results)) return data.results;
  if (data.data) {
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.data.items)) return data.data.items;
  }
  return [];
}

export function normalizeContentExecutionRuns(
  data?: ContentExecutionRunsResponse | null,
): ContentExecutionRun[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.runs)) return data.runs;
  if (Array.isArray(data.results)) return data.results;
  if (data.data) {
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.data.runs)) return data.data.runs;
  }
  return [];
}
