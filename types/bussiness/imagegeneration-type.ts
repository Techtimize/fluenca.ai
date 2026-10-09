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
  images_id?: string;
  run_created_at?: string;
  run_platform?: ImageGenerationPlatform;
  run_purpose?: ImageGenerationPurpose;
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

export interface CompanyImageGenerationListResponse {
  success?: boolean;
  company_id?: string;
  count?: number;
  images_count?: number;
  results?: ImageGenerationResult[];
  generated_images?: GeneratedImageAsset[];
  images?: GeneratedImageAsset[];
  data?: ImageGenerationResult | ImageGenerationResult[] | GeneratedImageAsset[];
  items?: ImageGenerationResult[] | GeneratedImageAsset[];
  [key: string]: unknown;
}

export type CompanyImageGenerationResponse =
  | CompanyImageGenerationListResponse
  | ImageGenerationResult
  | ImageGenerationResult[]
  | GeneratedImageAsset[];

export type LatestGeneratedImageResponse = ImageGenerationResult | GeneratedImageAsset;
