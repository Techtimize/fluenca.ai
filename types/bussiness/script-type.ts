export interface ScriptGenerationRequest {
  aspect_ratio: "1:1";
  company_id: string;
  content_suggestion: ContentSuggestion;
  content_type: "image";
  duration_seconds: number;
  style: string;
  user_request: string;
}

export interface ContentSuggestion {
  caption: string;
  cta: string;
  format: string;
  hook: string;
  image_prompt: string;
  key_points: string[];
  platform: string;
  script_brief: string;
  slides: {
    body: string;
    headline: string;
    image_prompt: string;
    slide_number: number;
  }[];
  title: string;
  content_type: string;
  duration_seconds: number;
  style: string;
  user_request: string;
}

export interface Script {
  id: string;
  title: string;
  logline: string;
  body: string;
  caption: string;
  hook: string;
  cta: string;
  content_type: string;
  created_at: string;
  updated_at: string;
}

export interface Scene {
  id: string;
  scene_number: number;
  duration: number;
  location: string;
  time_of_day: string;
  characters: string[];
  dialogue: string[];
  narration: string;
  action: string;
  camera: string;
  visual_style: string;
  visual_prompt: string;
  media_type: string;
  headline: string;
  body_text: string;
  image_url: string;
  video_url: string;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  appearance: string;
  personality: string;
  voice: string;
  reference_image_url: string;
}

export interface ScriptProject {
  id: string;
  name: string;
  description: string;
  audience: string;
  tone: string;
  duration_seconds: number;
  aspect_ratio: string;
  content_type: string;
  platform: string;
  format: string;
  script?: Script;
}

export interface ScriptGenerationMeta {
  duration_sec?: number;
  timestamp?: string;
  agent_mode?: string;
  company_id?: string;
  content_type?: string;
  aspect_ratio?: string;
  style?: string;
  duration_seconds?: number;
  status?: string;
  prompt_id?: string;
  project_analyzer?: string;
  script_writer?: string;
  character_manager?: string;
  scene_planner?: string;
}

export interface ScriptGenerationResponse {
  id?: string;
  company_id?: string;
  content_type?: string;
  project?: ScriptProject;
  script?: Script;
  characters?: Character[];
  scenes?: Scene[];
  visual_prompt?: string;
  logs?: string[];
  meta?: ScriptGenerationMeta;
  script_writer?: string;
  character_manager?: string;
  scene_planner?: string;
}

export interface ScriptGenerationResultsParams {
  limit?: number;
  offset?: number;
}

export interface ScriptGenerationResultsPage {
  results?: ScriptGenerationResponse[];
  scripts?: ScriptGenerationResponse[];
  data?: ScriptGenerationResponse[] | ScriptGenerationResponse;
  items?: ScriptGenerationResponse[];
  total?: number;
  total_count?: number;
  count?: number;
  limit?: number;
  offset?: number;
  page?: number;
  has_more?: boolean;
  has_next?: boolean;
  next_offset?: number;
  [key: string]: unknown;
}

export type ScriptGenerationResultsResponse =
  | ScriptGenerationResponse
  | ScriptGenerationResponse[]
  | ScriptGenerationResultsPage;
