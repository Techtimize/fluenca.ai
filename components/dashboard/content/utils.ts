import type {
  CompanyImageGenerationResponse,
  CompanyImageGenerationRun,
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
  companyId?: string;
  agentType?: string;
  version?: number;
  createdAt?: string;
  summary?: string | null;
  platform?: string;
  purpose?: string;
  aspectRatio?: string;
  style?: string;
  imagesCount: number;
  jobsCount: number;
  projectName?: string;
  tone?: string;
  title?: string;
  caption?: string;
  hook?: string;
  schedule?: string | null;
  images: ContentImageItem[];
};

export type NormalizedContentData = {
  companyId?: string;
  results: ContentGenerationResultItem[];
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

function mapRunImages(run: CompanyImageGenerationRun): ContentImageItem[] {
  const title = run.script?.title || run.project?.name;
  const images: ContentImageItem[] = [];
  const seen = new Set<string>();

  (run.generated_images ?? []).forEach((asset, index) => {
    const imageUrl = asUrl(asset.s3_url);
    if (!imageUrl) return;
    // Same URL can appear for two scenes; keep one per scene
    const key = `${imageUrl}:${asset.scene_number ?? ""}`;
    if (seen.has(key)) return;
    seen.add(key);

    const job = run.image_jobs?.find(
      (item) => item.scene_number === asset.scene_number,
    );
    images.push({
      id: job?.job_id || `${run.id}-${asset.scene_number ?? index}`,
      imageUrl,
      title,
      headline: asset.headline || job?.headline,
      prompt: job?.prompt,
      platform: job?.platform || run.platform,
      purpose: job?.purpose || run.purpose,
      sceneNumber: asset.scene_number,
      projectName: run.project?.name,
      createdAt: run.created_at,
      caption: run.script?.caption,
      aspectRatio: job?.aspect_ratio || run.aspect_ratio,
      runId: run.id,
      version: run.version,
    });
  });

  return images;
}

export function mapImageGenerationRun(
  run: CompanyImageGenerationRun,
): ContentGenerationResultItem {
  const images = mapRunImages(run);

  return {
    id: run.id,
    companyId: run.company_id,
    agentType: run.agent_type,
    version: run.version,
    createdAt: run.created_at,
    summary: run.summary,
    platform: run.platform,
    purpose: run.purpose,
    aspectRatio: run.aspect_ratio,
    style: run.style,
    imagesCount: run.images_count ?? images.length,
    jobsCount: run.image_jobs?.length ?? 0,
    projectName: run.project?.name,
    tone: run.project?.tone,
    title: run.script?.title || run.project?.name,
    caption: run.script?.caption,
    hook: run.script?.hook,
    schedule: run.schedule || null,
    images,
  };
}

export function normalizeCompanyContent(
  data?: CompanyImageGenerationResponse | null,
): NormalizedContentData {
  return {
    companyId: data?.company_id || undefined,
    results: (data?.results ?? [])
      .filter((run) => Boolean(run?.id))
      .map(mapImageGenerationRun),
  };
}
