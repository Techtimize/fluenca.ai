import { InstagramMediaItem } from "@/types/bussiness/instagram-type";

export function engagementRate(
    posts: InstagramMediaItem[],
    followers?: number | null,
  ) {
    if (!followers || followers <= 0 || posts.length === 0) return null;
    let likesTotal = 0;
    let commentsTotal = 0;
    for (const post of posts) {
      const likes = Number(post.like_count ?? post.likes ?? 0);
      const comments = Number(post.comments_count ?? post.comments ?? 0);
      if (Number.isFinite(likes)) likesTotal += likes;
      if (Number.isFinite(comments)) commentsTotal += comments;
    }
    const avg = (likesTotal + commentsTotal) / posts.length;
    return (avg / followers) * 100;
  }

  export type MediaFilter = "all" | "posts" | "reels";

export function isReel(item: InstagramMediaItem) {
  const type = String(item.media_type || item.product_type || "")
    .toLowerCase()
    .trim();
  return (
    type.includes("reel") ||
    type.includes("video") ||
    type === "igtv" ||
    type === "clips"
  );
}

export function formatPostDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}  