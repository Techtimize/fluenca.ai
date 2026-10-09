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

export interface SocialProfileLocale {
  country?: string | null;
  language?: string | null;
  [key: string]: unknown;
}

export interface SocialProfileContentResponse {
  success?: boolean;
  message?: string;
  error?: string | null;
  platform?: string | null;
  person_id?: string | number | null;
  name?: string | null;
  email?: string | null;
  picture?: string | null;
  locale?: SocialProfileLocale | null;
  posts_count_returned?: number | null;
  posts_unavailable_reason?: string | null;
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

export interface NormalizedLinkedInProfile {
  personId: string | null;
  name: string | null;
  email: string | null;
  picture: string | null;
  country: string | null;
  language: string | null;
  postsCountReturned: number | null;
  postsUnavailableReason: string | null;
}

function asTrimmedString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function asFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function normalizeLinkedInProfileContent(
  data?: SocialProfileContentResponse | null,
): NormalizedLinkedInProfile {
  if (!data) {
    return {
      personId: null,
      name: null,
      email: null,
      picture: null,
      country: null,
      language: null,
      postsCountReturned: null,
      postsUnavailableReason: null,
    };
  }

  const nested =
    data.data && typeof data.data === "object" && !Array.isArray(data.data)
      ? (data.data as SocialProfileContentResponse)
      : null;
  const source = nested ? { ...data, ...nested } : data;
  const locale =
    source.locale && typeof source.locale === "object"
      ? source.locale
      : null;

  return {
    personId: asTrimmedString(source.person_id),
    name: asTrimmedString(source.name),
    email: asTrimmedString(source.email),
    picture: asTrimmedString(source.picture),
    country: asTrimmedString(locale?.country),
    language: asTrimmedString(locale?.language),
    postsCountReturned: asFiniteNumber(source.posts_count_returned),
    postsUnavailableReason: asTrimmedString(source.posts_unavailable_reason),
  };
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
