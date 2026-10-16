/** A LinkedIn text post built from a script (POST /generation/text-post), saved as generated content. */
export interface TextPost {
  id?: string;
  generation_id?: string;
  company_id?: string;
  script_id?: string | null;
  text?: string;
  post?: string;
  content?: string;
  platform?: string;
  hashtags?: string[] | null;
  /** "posted" once live; "not_posted" before publishing or when it failed. */
  publish_status?: "posted" | "not_posted" | (string & {}) | null;
  publish_error?: string | null;
  error?: string | null;
  posted_at?: string | null;
  created_at?: string | null;
  [key: string]: unknown;
}

export interface CreateTextPostRequest {
  company_id: string;
  /** A saved script; the endpoint loads it and rewrites it as a text post. */
  script_id: string;
}

/** The id LinkedIn publish expects as generation_id. */
export function textPostId(post?: TextPost | null) {
  const id = post?.generation_id ?? post?.id;
  return id ? String(id) : null;
}

export function textPostText(post?: TextPost | null) {
  return (post?.text ?? post?.post ?? post?.content ?? "").trim();
}

export function isTextPostPosted(post?: TextPost | null) {
  return String(post?.publish_status ?? "").toLowerCase() === "posted";
}

export function textPostError(post?: TextPost | null) {
  return post?.publish_error ?? post?.error ?? null;
}

/** Unwraps a single post from { text_post } / { data } or returns it as is. */
export function unwrapTextPost(data: unknown): TextPost {
  const body = (data ?? {}) as { text_post?: TextPost; data?: TextPost };
  return body.text_post ?? body.data ?? (data as TextPost);
}

/** Accepts a bare array or a { text_posts } / { items } / { results } / { data } wrapper. */
export function unwrapTextPosts(data: unknown): TextPost[] {
  if (Array.isArray(data)) return data;
  const body = (data ?? {}) as Record<string, unknown>;
  for (const key of ["text_posts", "items", "results", "data"]) {
    if (Array.isArray(body[key])) return body[key] as TextPost[];
  }
  return [];
}
