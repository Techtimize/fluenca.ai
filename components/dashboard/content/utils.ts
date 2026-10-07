import type {
  CompanyImageGenerationListResponse,
  CompanyImageGenerationResponse,
  GeneratedImageAsset,
  ImageGenerationResult,
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
  caption?: string;
  aspectRatio?: string;
  runId?: string;
  version?: number;
};

export type ContentGenerationResultItem = {
  id: string;
  version?: number;
  createdAt?: string;
  success: boolean;
  status?: string;
  summary?: string | null;
  platform?: string;
  purpose?: string;
  aspectRatio?: string;
  style?: string;
  imagesCount: number;
  jobsCount: number;
  durationSec?: number;
  projectName?: string;
  tone?: string;
  title?: string;
  caption?: string;
  hook?: string;
  cta?: string;
  images: ContentImageItem[];
};

export type NormalizedContentData = {
  companyId?: string;
  count: number;
  imagesCount: number;
  results: ContentGenerationResultItem[];
  images: ContentImageItem[];
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

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function assetImageUrl(asset: GeneratedImageAsset): string | null {
  return (
    asUrl(asset.s3_url) ||
    asUrl(asset.url) ||
    asUrl(asset.image_url) ||
    asUrl(asset.thumbnail_url)
  );
}

function mapAsset(
  asset: GeneratedImageAsset,
  extras?: Partial<ContentImageItem>,
  index = 0,
): ContentImageItem | null {
  const imageUrl = assetImageUrl(asset);
  if (!imageUrl) return null;

  const id =
    asset.id ||
    asset.images_id ||
    asset.job_id ||
    `${imageUrl}-${asset.scene_number ?? index}`;

  return {
    id: String(id),
    imageUrl,
    thumbnailUrl: asUrl(asset.thumbnail_url) || undefined,
    title: asset.title || extras?.title,
    headline: asset.headline || extras?.headline,
    prompt: asset.prompt || extras?.prompt,
    platform: asset.platform || asset.run_platform || extras?.platform,
    purpose: asset.purpose || asset.run_purpose || extras?.purpose,
    status: asset.status || extras?.status,
    sceneNumber: asset.scene_number,
    projectName: extras?.projectName,
    createdAt: asset.created_at || asset.run_created_at || extras?.createdAt,
    caption: extras?.caption,
    aspectRatio: asset.aspect_ratio || extras?.aspectRatio,
    runId: asset.images_id || extras?.runId,
    version: extras?.version,
  };
}

function isAsset(value: unknown): value is GeneratedImageAsset {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return Boolean(
    asUrl(record.s3_url) ||
      asUrl(record.url) ||
      asUrl(record.image_url) ||
      asUrl(record.thumbnail_url),
  );
}

function isResult(value: unknown): value is ImageGenerationResult {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return Boolean(
    record.generated_images ||
      record.image_jobs ||
      record.project ||
      record.script ||
      record.scenes ||
      record.images ||
      record.latest_image_url ||
      record.image_url ||
      record.version != null ||
      record.prompt_id ||
      record.agent_type === "image_generation",
  );
}

function mapResultImages(result: ImageGenerationResult): ContentImageItem[] {
  const extras: Partial<ContentImageItem> = {
    title: result.script?.title || result.project?.name,
    caption: result.script?.caption,
    platform: result.platform,
    purpose: result.purpose,
    status: result.status,
    projectName: result.project?.name,
    createdAt: result.created_at,
    aspectRatio: result.aspect_ratio,
    runId: result.id,
    version: result.version,
  };

  const images: ContentImageItem[] = [];
  const seen = new Set<string>();

  const push = (item: ContentImageItem | null) => {
    if (!item) return;
    const key = `${item.imageUrl}:${item.sceneNumber ?? ""}`;
    if (seen.has(key)) return;
    seen.add(key);
    images.push(item);
  };

  (result.generated_images ?? []).forEach((asset, index) => {
    push(mapAsset(asset, extras, index));
  });

  (result.images ?? []).forEach((asset, index) => {
    push(mapAsset(asset, extras, index));
  });

  (result.scenes ?? []).forEach((scene, index) => {
    const imageUrl = asUrl(scene.image_url);
    if (!imageUrl) return;
    push({
      id: `${result.id || "scene"}-${scene.scene_number ?? index}`,
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
      caption: extras.caption,
      aspectRatio: extras.aspectRatio,
      runId: extras.runId,
      version: extras.version,
    });
  });

  const latest = asUrl(result.latest_image_url) || asUrl(result.image_url);
  if (latest) {
    push({
      id: `${result.id || "latest"}-${latest}`,
      imageUrl: latest,
      ...extras,
    });
  }

  return images;
}

export function mapImageGenerationResult(
  result: ImageGenerationResult,
  index = 0,
): ContentGenerationResultItem {
  const images = mapResultImages(result);
  const id = String(result.id || result.prompt_id || `result-${index}`);

  return {
    id,
    version: result.version,
    createdAt: result.created_at,
    success: result.success === true || result.status === "success",
    status: result.status,
    summary: result.summary,
    platform: result.platform,
    purpose: result.purpose,
    aspectRatio: result.aspect_ratio,
    style: result.style,
    imagesCount: asNumber(result.images_count) ?? images.length,
    jobsCount: asNumber(result.jobs_count) ?? result.image_jobs?.length ?? 0,
    durationSec: asNumber(result.duration_sec),
    projectName: result.project?.name,
    tone: result.project?.tone,
    title: result.script?.title || result.project?.name,
    caption: result.script?.caption,
    hook: result.script?.hook,
    cta: result.script?.cta,
    images,
  };
}

function collectFlatImages(
  data: CompanyImageGenerationListResponse | ImageGenerationResult,
): ContentImageItem[] {
  const images: ContentImageItem[] = [];
  const seen = new Set<string>();

  const push = (item: ContentImageItem | null) => {
    if (!item) return;
    const key = `${item.imageUrl}:${item.sceneNumber ?? ""}`;
    if (seen.has(key)) return;
    seen.add(key);
    images.push(item);
  };

  const record = data as CompanyImageGenerationListResponse;
  (record.generated_images ?? []).forEach((asset, index) => {
    push(
      mapAsset(
        asset,
        {
          platform: asset.run_platform,
          purpose: asset.run_purpose,
          createdAt: asset.run_created_at,
          runId: asset.images_id,
        },
        index,
      ),
    );
  });

  return images;
}

export function normalizeCompanyContent(
  data?: CompanyImageGenerationResponse | null,
): NormalizedContentData {
  const empty: NormalizedContentData = {
    count: 0,
    imagesCount: 0,
    results: [],
    images: [],
  };

  if (!data) return empty;

  if (Array.isArray(data)) {
    const results = data
      .filter(isResult)
      .map((entry, index) => mapImageGenerationResult(entry, index));
    const assets = data
      .filter(isAsset)
      .map((asset, index) => mapAsset(asset, undefined, index))
      .filter((item): item is ContentImageItem => Boolean(item));

    const images =
      assets.length > 0
        ? assets
        : results.flatMap((result) => result.images);

    return {
      count: results.length || images.length,
      imagesCount: images.length,
      results,
      images,
    };
  }

  if (typeof data !== "object") return empty;

  const list = data as CompanyImageGenerationListResponse;
  const rawResults = Array.isArray(list.results)
    ? list.results
    : Array.isArray(list.items)
      ? list.items
      : Array.isArray(list.data)
        ? list.data
        : isResult(list.data)
          ? [list.data]
          : isResult(data)
            ? [data as ImageGenerationResult]
            : [];

  const results = rawResults
    .filter(isResult)
    .map((entry, index) => mapImageGenerationResult(entry, index));

  let images = collectFlatImages(list);

  if (!images.length) {
    const legacyImages = Array.isArray(list.images) ? list.images : [];
    images = legacyImages
      .filter(isAsset)
      .map((asset, index) => mapAsset(asset, undefined, index))
      .filter((item): item is ContentImageItem => Boolean(item));
  }

  if (!images.length) {
    images = results.flatMap((result) => result.images);
  }

  return {
    companyId: typeof list.company_id === "string" ? list.company_id : undefined,
    count: asNumber(list.count) ?? results.length,
    imagesCount: asNumber(list.images_count) ?? images.length,
    results,
    images,
  };
}

/** @deprecated Prefer normalizeCompanyContent — kept for older call sites. */
export function normalizeCompanyImages(
  data?: CompanyImageGenerationResponse | null,
): ContentImageItem[] {
  return normalizeCompanyContent(data).images;
}
