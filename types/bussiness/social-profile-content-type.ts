export interface SocialProfileMediaItem {
  id?: string | number | null;
  media_id?: string | number | null;
  media_url?: string | null;
  image_url?: string | null;
  thumbnail_url?: string | null;
  full_picture?: string | null;
  picture?: string | null;
  permalink?: string | null;
  post_url?: string | null;
  url?: string | null;
  caption?: string | null;
  message?: string | null;
  text?: string | null;
  title?: string | null;
  like_count?: number | null;
  likes?: number | null;
  reactions?: number | null;
  comments_count?: number | null;
  comments?: number | null;
  shares_count?: number | null;
  shares?: number | null;
  timestamp?: string | null;
  created_at?: string | null;
  created_time?: string | null;
  media_type?: string | null;
  [key: string]: unknown;
}

export interface SocialProfileContentRequest {
  media_limit?: number;
}

export interface SocialProfileContentResponse {
  success?: boolean;
  message?: string;
  error?: string | null;
  username?: string;
  media?: SocialProfileMediaItem[];
  posts?: SocialProfileMediaItem[];
  items?: SocialProfileMediaItem[];
  data?:
    | SocialProfileMediaItem[]
    | {
        media?: SocialProfileMediaItem[];
        posts?: SocialProfileMediaItem[];
        items?: SocialProfileMediaItem[];
        [key: string]: unknown;
      };
  count?: number;
  [key: string]: unknown;
}

export function normalizeSocialProfileContent(
  data?: SocialProfileContentResponse | SocialProfileMediaItem[] | null,
): SocialProfileMediaItem[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;

  if (Array.isArray(data.media)) return data.media;
  if (Array.isArray(data.posts)) return data.posts;
  if (Array.isArray(data.items)) return data.items;

  if (data.data) {
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.data.media)) return data.data.media;
    if (Array.isArray(data.data.posts)) return data.data.posts;
    if (Array.isArray(data.data.items)) return data.data.items;
  }

  return [];
}

export function socialMediaImageUrl(item?: SocialProfileMediaItem | null) {
  if (!item) return null;
  const value =
    item.thumbnail_url ||
    item.media_url ||
    item.image_url ||
    item.full_picture ||
    item.picture ||
    null;
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function socialMediaCaption(item?: SocialProfileMediaItem | null) {
  if (!item) return "";
  const value = item.caption || item.message || item.text || item.title || "";
  return typeof value === "string" ? value.trim() : "";
}

export function socialMediaLikes(item?: SocialProfileMediaItem | null) {
  if (!item) return null;
  const value = item.like_count ?? item.likes ?? item.reactions;
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function socialMediaComments(item?: SocialProfileMediaItem | null) {
  if (!item) return null;
  const value = item.comments_count ?? item.comments;
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function socialMediaDate(item?: SocialProfileMediaItem | null) {
  if (!item) return null;
  const value = item.timestamp || item.created_at || item.created_time || null;
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function socialMediaHref(item?: SocialProfileMediaItem | null) {
  if (!item) return undefined;
  const value = item.permalink || item.post_url || item.url || undefined;
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
