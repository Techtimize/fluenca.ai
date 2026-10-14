export type ImageGenerationPlatform =
  | "instagram"
  | "linkedin"
  | "facebook"
  | "tiktok"
  | string;

export type ImageGenerationPurpose =
  | "carousel"
  | "single"
  | "story"
  | "post"
  | string;

export interface ImageGenerationProject {
  name: string;
  tone: string;
  company_id?: string;
}

export interface ImageGenerationScene {
  scene_number: number;
  action: string;
  body_text: string;
  headline: string;
  visual_prompt: string;
  image_url?: string;
}

export interface ImageGenerationScript {
  title: string;
  caption: string;
  cta: string;
  hook: string;
}

export interface ImageGenerationRequest {
  company_id: string;
  platform: ImageGenerationPlatform;
  project: ImageGenerationProject;
  purpose: ImageGenerationPurpose;
  scenes: ImageGenerationScene[];
  script: ImageGenerationScript;
  style: string;
}

export interface ImageJob {
  job_id?: string;
  prompt?: string;
  purpose?: ImageGenerationPurpose;
  headline?: string;
  platform?: ImageGenerationPlatform;
  aspect_ratio?: string;
  scene_number?: number;
}

export interface GeneratedImageAsset {
  id?: string;
  job_id?: string;
  scene_number?: number;
  image_url?: string;
  url?: string;
  s3_url?: string;
  s3_key?: string;
  s3_bucket?: string;
  thumbnail_url?: string;
  status?: string;
  prompt?: string;
  headline?: string;
  title?: string;
  platform?: ImageGenerationPlatform;
  purpose?: ImageGenerationPurpose;
  aspect_ratio?: string;
  filename?: string;
  mime_type?: string;
  model?: string;
  bytes?: number;
  company_id?: string;
  created_at?: string;
}

export interface ImageGenerationResult {
  id?: string;
  prompt_id?: string;
  company_id?: string;
  version?: number;
  created_at?: string;
  success?: boolean;
  status?: string;
  summary?: string | null;
  platform?: ImageGenerationPlatform;
  purpose?: ImageGenerationPurpose;
  aspect_ratio?: string;
  style?: string;
  images_count?: number;
  jobs_count?: number;
  duration_sec?: number;
  project?: ImageGenerationProject;
  script?: ImageGenerationScript;
  image_jobs?: ImageJob[];
  generated_images?: GeneratedImageAsset[];
  scenes?: ImageGenerationScene[];
  images?: GeneratedImageAsset[];
  latest_image_url?: string;
  image_url?: string;
  message?: string;
  agent_type?: string;
  meta?: {
    company_id?: string;
    timestamp?: string;
    prompt_id?: string;
    status?: string;
  };
}

export type ImageGenerationResponse = ImageGenerationResult;

export type ScheduleablePlatform = "instagram" | "facebook" | "linkedin" | "x";

export interface ImageGenerationScheduleRequest {
  platform: ScheduleablePlatform;
  id: string;
  schedule: string;
}

export interface ImageGenerationScheduleResponse {
  success: boolean;
  id: string;
  company_id: string;
  platform: ScheduleablePlatform;
  schedule: string;
}

/* ---------- GET /generation/image-generation/{company_id} ---------- */

export interface CompanyImageGenerationImage {
  s3_url: string;
  headline: string;
  scene_number: number;
}

export interface CompanyImageGenerationRun {
  id: string;
  company_id: string;
  agent_type: string;
  version: number;
  created_at: string;
  platform: ImageGenerationPlatform;
  purpose: ImageGenerationPurpose;
  style: string;
  aspect_ratio: string;
  images_count: number;
  summary: string | null;
  /** ISO date-time the post is scheduled for; null when not scheduled */
  schedule: string | null;
  project: Pick<ImageGenerationProject, "name" | "tone">;
  script: Pick<ImageGenerationScript, "title" | "caption" | "hook">;
  image_jobs: ImageJob[];
  generated_images: CompanyImageGenerationImage[];
}

export interface CompanyImageGenerationResponse {
  company_id: string;
  results: CompanyImageGenerationRun[];
}

export type LatestGeneratedImageResponse = ImageGenerationResult | GeneratedImageAsset;
