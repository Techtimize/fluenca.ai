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

export interface GeneratedImageAsset {
  id?: string;
  scene_number?: number;
  image_url?: string;
  url?: string;
  thumbnail_url?: string;
  status?: string;
  prompt?: string;
  headline?: string;
  title?: string;
  platform?: string;
  purpose?: string;
  created_at?: string;
}

export interface ImageGenerationResponse {
  success?: boolean;
  message?: string;
  company_id?: string;
  platform?: ImageGenerationPlatform;
  purpose?: ImageGenerationPurpose;
  style?: string;
  project?: ImageGenerationProject;
  script?: ImageGenerationScript;
  scenes?: ImageGenerationScene[];
  images?: GeneratedImageAsset[];
  latest_image_url?: string;
  image_url?: string;
  status?: string;
  created_at?: string;
  meta?: {
    company_id?: string;
    timestamp?: string;
    prompt_id?: string;
    status?: string;
  };
}

/** GET /generation/image-generation/{company_id} — may be a single item, list, or wrapped. */
export type CompanyImageGenerationResponse =
  | ImageGenerationResponse
  | ImageGenerationResponse[]
  | GeneratedImageAsset[]
  | {
      results?: ImageGenerationResponse[] | GeneratedImageAsset[];
      images?: GeneratedImageAsset[];
      data?: ImageGenerationResponse | ImageGenerationResponse[] | GeneratedImageAsset[];
      items?: ImageGenerationResponse[] | GeneratedImageAsset[];
      [key: string]: unknown;
    };

export type LatestGeneratedImageResponse = ImageGenerationResponse | GeneratedImageAsset;
