import type {
  ContentSuggestion,
  ScriptGenerationRequest,
} from "@/types/bussiness/script-type";

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item) => typeof item === "string" || typeof item === "number")
      .map(String);
  }
  if (typeof value === "string" && value.trim()) return [value];
  return [];
}

function asSlides(value: unknown): ContentSuggestion["slides"] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((slide): slide is Record<string, unknown> => Boolean(slide) && typeof slide === "object")
    .map((slide, index) => ({
      slide_number:
        typeof slide.slide_number === "number" ? slide.slide_number : index + 1,
      headline: asString(slide.headline ?? slide.title, `Slide ${index + 1}`),
      body: asString(slide.body ?? slide.text ?? slide.content),
      image_prompt: asString(slide.image_prompt ?? slide.visual_prompt),
    }));
}

export function ideaToScriptRequest(
  companyId: string,
  item: Record<string, unknown>,
): ScriptGenerationRequest {
  const title = asString(
    item.title ?? item.name ?? item.idea ?? item.topic ?? item.headline ?? item.theme,
    "Untitled idea",
  );
  const caption = asString(
    item.caption ?? item.description ?? item.summary ?? item.body ?? item.content,
  );
  const hook = asString(item.hook ?? item.headline, title);
  const scriptBrief = asString(
    item.script_brief ?? item.brief ?? item.angle ?? caption,
    title,
  );
  const style = asString(item.style, "modern");
  const contentType = asString(item.content_type, "image");
  const durationSeconds =
    typeof item.duration_seconds === "number" && item.duration_seconds > 0
      ? item.duration_seconds
      : 15;
  const userRequest = asString(
    item.user_request,
    `Generate a script for this content idea: ${title}`,
  );

  const content_suggestion: ContentSuggestion = {
    title,
    caption,
    cta: asString(item.cta ?? item.call_to_action, "Learn more"),
    format: asString(item.format ?? item.post_type ?? item.content_format, "post"),
    hook,
    image_prompt: asString(item.image_prompt ?? item.visual_prompt ?? item.visual),
    key_points: asStringArray(item.key_points ?? item.points ?? item.bullets ?? item.hashtags),
    platform: asString(item.platform ?? item.channel, "instagram"),
    script_brief: scriptBrief,
    slides: asSlides(item.slides),
    content_type: contentType,
    duration_seconds: durationSeconds,
    style,
    user_request: userRequest,
  };

  return {
    company_id: companyId,
    content_suggestion,
    content_type: "image",
    aspect_ratio: "1:1",
    duration_seconds: durationSeconds,
    style,
    user_request: userRequest,
  };
}
