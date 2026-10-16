export const SCHEDULED_POST_PLATFORMS = ["instagram", "facebook", "linkedin"] as const;

/** Text-only posts (no file) are supported on these platforms. */
export const TEXT_POST_PLATFORMS: readonly ScheduledPostPlatform[] = ["linkedin"];
export type ScheduledPostPlatform = (typeof SCHEDULED_POST_PLATFORMS)[number];

export type ScheduledPostStatus =
  | "scheduled"
  | "publishing"
  | "published"
  | "partially_published"
  | "failed"
  | "cancelled"
  | (string & {});

export const SCHEDULED_POST_LIMITS = {
  image: { types: ["image/jpeg", "image/png"], maxBytes: 8 * 1024 * 1024, label: "JPEG/PNG up to 8 MB" },
  video: { types: ["video/mp4", "video/quicktime"], maxBytes: 300 * 1024 * 1024, label: "MP4/MOV up to 300 MB" },
} as const;

/** One platform's outcome once the post has gone out (or failed to). */
export interface ScheduledPostPlatformResult {
  platform: string;
  status?: string;
  error?: string | null;
  post_id?: string | null;
  permalink?: string | null;
  url?: string | null;
  published_at?: string | null;
}

export interface ScheduledPost {
  id: string;
  platforms: string[];
  scheduled_at: string;
  caption?: string | null;
  status: ScheduledPostStatus;
  file_url?: string | null;
  media_url?: string | null;
  media_type?: string | null;
  content_type?: string | null;
  file_name?: string | null;
  error?: string | null;
  results?: ScheduledPostPlatformResult[] | Record<string, Omit<ScheduledPostPlatformResult, "platform">> | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateScheduledPostRequest {
  /** Omitted for a LinkedIn text post. */
  file?: File | null;
  platforms: ScheduledPostPlatform[];
  /** ISO 8601 with an explicit offset, e.g. 2026-10-20T18:00:00+05:00. */
  scheduled_at: string;
  caption?: string;
  /** The saved text post being scheduled, so the backend can update its publish_status. */
  generation_id?: string;
}

export interface UpdateScheduledPostRequest {
  scheduled_at?: string;
  platforms?: ScheduledPostPlatform[];
  caption?: string;
}

/** Local time as ISO 8601 with the browser's offset, since the backend requires a timezone. */
export function toOffsetIso(date: Date) {
  const pad = (n: number) => String(Math.abs(n)).padStart(2, "0");
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:00` +
    `${sign}${pad(Math.trunc(offset / 60))}:${pad(offset % 60)}`
  );
}

export function scheduledPostMediaUrl(post: ScheduledPost) {
  return post.file_url || post.media_url || null;
}

export function isScheduledPostVideo(post: ScheduledPost) {
  const type = `${post.media_type ?? ""} ${post.content_type ?? ""}`.toLowerCase();
  if (type.includes("video")) return true;
  if (type.includes("image")) return false;
  return /\.(mp4|mov)(\?|$)/i.test(post.file_name || scheduledPostMediaUrl(post) || "");
}

/** Per-platform results, whether the backend sends them as a list or keyed by platform. */
export function scheduledPostResults(post: ScheduledPost): ScheduledPostPlatformResult[] {
  if (!post.results) return [];
  if (Array.isArray(post.results)) return post.results;
  return Object.entries(post.results).map(([platform, result]) => ({ platform, ...result }));
}
