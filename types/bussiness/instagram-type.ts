export interface InstagramProfileIdRequest {
  username: string;
}

export interface InstagramProfileInfoRequest {
  username: string;
}

export interface InstagramPostEngagementRequest {
  username: string;
  post_url: string;
}

export interface InstagramProfileIdResponse {
  success?: boolean;
  message?: string;
  error?: string | null;
  username?: string;
  profile_id?: string | number | null;
  id?: string | number | null;
  [key: string]: unknown;
}

export interface InstagramProfileInfoResponse {
  success?: boolean;
  message?: string;
  error?: string | null;
  username?: string;
  /** Connector API fields */
  instagram_id?: string | number | null;
  name?: string | null;
  bio?: string | null;
  website?: string | null;
  followers?: number | null;
  following?: number | null;
  posts?: number | null;
  profile_picture?: string | null;
  /** Alternate / legacy field names */
  full_name?: string | null;
  biography?: string | null;
  profile_pic_url?: string | null;
  followers_count?: number | null;
  follows_count?: number | null;
  media_count?: number | null;
  is_business?: boolean | null;
  is_private?: boolean | null;
  [key: string]: unknown;
}

export interface NormalizedInstagramProfile {
  instagramId: string | null;
  username: string | null;
  name: string | null;
  bio: string | null;
  website: string | null;
  followers: number | null;
  following: number | null;
  posts: number | null;
  profilePicture: string | null;
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

export function normalizeInstagramProfileInfo(
  data?: InstagramProfileInfoResponse | null,
): NormalizedInstagramProfile {
  if (!data) {
    return {
      instagramId: null,
      username: null,
      name: null,
      bio: null,
      website: null,
      followers: null,
      following: null,
      posts: null,
      profilePicture: null,
    };
  }

  const nested =
    data.data && typeof data.data === "object" && !Array.isArray(data.data)
      ? (data.data as InstagramProfileInfoResponse)
      : data.profile &&
          typeof data.profile === "object" &&
          !Array.isArray(data.profile)
        ? (data.profile as InstagramProfileInfoResponse)
        : null;
  const source = nested ? { ...data, ...nested } : data;

  return {
    instagramId: asTrimmedString(
      source.instagram_id ?? source.profile_id ?? source.id ?? null,
    ),
    username: asTrimmedString(source.username),
    name: asTrimmedString(source.name ?? source.full_name),
    bio: asTrimmedString(source.bio ?? source.biography),
    website: asTrimmedString(source.website),
    followers: asFiniteNumber(source.followers ?? source.followers_count),
    following: asFiniteNumber(source.following ?? source.follows_count),
    posts: asFiniteNumber(source.posts ?? source.media_count),
    profilePicture: asTrimmedString(
      source.profile_picture ?? source.profile_pic_url,
    ),
  };
}

export interface InstagramPostEngagementResponse {
  success?: boolean;
  message?: string;
  error?: string | null;
  username?: string;
  post_url?: string;
  likes?: number | null;
  like_count?: number | null;
  comments?: number | null;
  comments_count?: number | null;
  engagement?: number | null;
  [key: string]: unknown;
}

/** @deprecated Use InstagramPostEngagementRequest */
export type InstagramPostLikeRequest = InstagramPostEngagementRequest;
/** @deprecated Use InstagramPostEngagementResponse */
export type InstagramPostLikeResponse = InstagramPostEngagementResponse;

export interface InstagramProfileContentRequest {
  username: string;
}

export interface InstagramMediaItem {
  id?: string | number | null;
  media_id?: string | number | null;
  media_url?: string | null;
  image_url?: string | null;
  thumbnail_url?: string | null;
  permalink?: string | null;
  post_url?: string | null;
  caption?: string | null;
  like_count?: number | null;
  likes?: number | null;
  comments_count?: number | null;
  comments?: number | null;
  timestamp?: string | null;
  created_at?: string | null;
  media_type?: string | null;
  [key: string]: unknown;
}

export interface InstagramProfileContentResponse {
  success?: boolean;
  message?: string;
  error?: string | null;
  username?: string;
  media?: InstagramMediaItem[];
  posts?: InstagramMediaItem[];
  items?: InstagramMediaItem[];
  data?:
    | InstagramMediaItem[]
    | {
        media?: InstagramMediaItem[];
        posts?: InstagramMediaItem[];
        items?: InstagramMediaItem[];
        [key: string]: unknown;
      };
  count?: number;
  [key: string]: unknown;
}

export function normalizeInstagramProfileContent(
  data?: InstagramProfileContentResponse | InstagramMediaItem[] | null,
): InstagramMediaItem[] {
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

export function instagramMediaImageUrl(item?: InstagramMediaItem | null) {
  if (!item) return null;
  const value =
    item.thumbnail_url ||
    item.media_url ||
    item.image_url ||
    null;
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
