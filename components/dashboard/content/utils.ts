import type {
  CompanyImageGenerationResponse,
  GeneratedImageAsset,
  ImageGenerationResponse,
} from "@/types/bussiness/imagegeneration-type";

export type ContentImageItem = {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string;
  title?: string;
  headline?: string;
  prompt?: string;
  platform?: string;
  purpose?: string;
  status?: string;
  sceneNumber?: number;
  projectName?: string;
  createdAt?: string;
};

function asUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:image") ||
    trimmed.startsWith("/")
  ) {
    return trimmed;
  }
  return null;
}

function pushImage(
  items: ContentImageItem[],
  partial: Omit<ContentImageItem, "id"> & { id?: string },
) {
  if (!partial.imageUrl) return;
  const id =
    partial.id ||
    `${partial.imageUrl}-${partial.sceneNumber ?? items.length}-${items.length}`;
  if (items.some((item) => item.imageUrl === partial.imageUrl && item.sceneNumber === partial.sceneNumber)) {
    return;
  }
  items.push({ ...partial, id });
}

function collectFromAsset(
  items: ContentImageItem[],
  asset: GeneratedImageAsset,
  extras?: Partial<ContentImageItem>,
) {
  const imageUrl = asUrl(asset.image_url) || asUrl(asset.url) || asUrl(asset.thumbnail_url);
  if (!imageUrl) return;
  pushImage(items, {
    id: asset.id,
    imageUrl,
    thumbnailUrl: asUrl(asset.thumbnail_url) || undefined,
    title: asset.title || extras?.title,
    headline: asset.headline || extras?.headline,
    prompt: asset.prompt || extras?.prompt,
    platform: asset.platform || extras?.platform,
    purpose: asset.purpose || extras?.purpose,
    status: asset.status || extras?.status,
    sceneNumber: asset.scene_number,
    projectName: extras?.projectName,
    createdAt: asset.created_at || extras?.createdAt,
  });
}

function collectFromResponse(items: ContentImageItem[], response: ImageGenerationResponse) {
  const extras: Partial<ContentImageItem> = {
    title: response.script?.title || response.project?.name,
    platform: response.platform,
    purpose: response.purpose,
    status: response.status || response.meta?.status,
    projectName: response.project?.name,
    createdAt: response.created_at || response.meta?.timestamp,
  };

  if (Array.isArray(response.images)) {
    response.images.forEach((asset) => collectFromAsset(items, asset, extras));
  }

  if (Array.isArray(response.scenes)) {
    response.scenes.forEach((scene) => {
      const imageUrl = asUrl(scene.image_url);
      if (!imageUrl) return;
      pushImage(items, {
        imageUrl,
        title: extras.title,
        headline: scene.headline,
        prompt: scene.visual_prompt,
        platform: extras.platform,
        purpose: extras.purpose,
        status: extras.status,
        sceneNumber: scene.scene_number,
        projectName: extras.projectName,
        createdAt: extras.createdAt,
      });
    });
  }

  const latest = asUrl(response.latest_image_url) || asUrl(response.image_url);
  if (latest) {
    pushImage(items, {
      imageUrl: latest,
      ...extras,
    });
  }
}

function isAsset(value: unknown): value is GeneratedImageAsset {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return Boolean(asUrl(record.image_url) || asUrl(record.url) || asUrl(record.thumbnail_url));
}

function isResponse(value: unknown): value is ImageGenerationResponse {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return Boolean(
    record.project ||
      record.script ||
      record.scenes ||
      record.images ||
      record.latest_image_url ||
      record.image_url ||
      record.meta,
  );
}

export function normalizeCompanyImages(
  data?: CompanyImageGenerationResponse | null,
): ContentImageItem[] {
  const items: ContentImageItem[] = [];
  if (!data) return items;

  if (Array.isArray(data)) {
    data.forEach((entry) => {
      if (isAsset(entry)) collectFromAsset(items, entry);
      else if (isResponse(entry)) collectFromResponse(items, entry);
    });
    return items;
  }

  if (typeof data !== "object") return items;

  if (isResponse(data)) {
    collectFromResponse(items, data);
  }

  if (isAsset(data)) {
    collectFromAsset(items, data);
  }

  const record = data as Record<string, unknown>;
  for (const key of ["results", "images", "items", "data"]) {
    const value = record[key];
    if (Array.isArray(value)) {
      value.forEach((entry) => {
        if (isAsset(entry)) collectFromAsset(items, entry);
        else if (isResponse(entry)) collectFromResponse(items, entry);
        else if (typeof entry === "string") {
          const url = asUrl(entry);
          if (url) pushImage(items, { imageUrl: url });
        }
      });
    } else if (isAsset(value)) {
      collectFromAsset(items, value);
    } else if (isResponse(value)) {
      collectFromResponse(items, value);
    } else if (typeof value === "string") {
      const url = asUrl(value);
      if (url) pushImage(items, { imageUrl: url });
    }
  }

  return items;
}
