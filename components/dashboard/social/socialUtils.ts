import type { ContentGenerationResultItem, ContentImageItem } from "@/components/dashboard/content/utils";
import type { SocialAccount } from "@/types/bussiness/social-accounts-type";

export type SocialPlatformId = "instagram" | "facebook" | "linkedin";

export function accountHandle(account?: SocialAccount | null) {
  const value =
    account?.username ||
    account?.external_account_name ||
    account?.account_name ||
    account?.display_name ||
    null;
  if (!value) return null;
  return String(value).replace(/^@/, "");
}

export function accountDisplayName(account?: SocialAccount | null) {
  return (
    account?.display_name ||
    account?.account_name ||
    account?.external_account_name ||
    accountHandle(account) ||
    null
  );
}

export function formatCount(value?: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en", {
    notation: value >= 10000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

export function platformPosts(
  results: ContentGenerationResultItem[],
  platform: SocialPlatformId,
): Array<{
  id: string;
  imageUrl?: string;
  caption?: string;
  title?: string;
  createdAt?: string;
  images: ContentImageItem[];
}> {
  const target = platform.toLowerCase();
  const posts: Array<{
    id: string;
    imageUrl?: string;
    caption?: string;
    title?: string;
    createdAt?: string;
    images: ContentImageItem[];
  }> = [];

  results.forEach((item) => {
    const itemPlatform = String(item.platform || "").toLowerCase();
    const matches =
      itemPlatform.includes(target) ||
      item.images.some((image) =>
        String(image.platform || "").toLowerCase().includes(target),
      );
    if (!matches) return;

    if (item.images.length > 1 && target === "instagram") {
      item.images.forEach((image, index) => {
        posts.push({
          id: `${item.id}-${image.id || index}`,
          imageUrl: image.imageUrl,
          caption: item.caption || image.caption || item.hook,
          title: item.title || image.title || image.headline,
          createdAt: image.createdAt || item.createdAt,
          images: [image],
        });
      });
      return;
    }

    posts.push({
      id: item.id,
      imageUrl: item.images[0]?.imageUrl,
      caption: item.caption || item.hook || item.summary || undefined,
      title: item.title || item.projectName,
      createdAt: item.createdAt,
      images: item.images,
    });
  });

  return posts;
}
