import type {
  ScriptGenerationResponse,
  ScriptGenerationResultsResponse,
} from "@/types/bussiness/script-type";

function looksLikeScriptResult(value: unknown): value is ScriptGenerationResponse {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return Boolean(
    record.project ||
      record.script ||
      record.scenes ||
      record.characters ||
      record.visual_prompt ||
      record.meta,
  );
}

export function normalizeScriptResults(
  data?: ScriptGenerationResultsResponse | null,
): ScriptGenerationResponse[] {
  if (!data) return [];

  if (Array.isArray(data)) {
    return data.filter(looksLikeScriptResult);
  }

  if (typeof data !== "object") return [];

  if (looksLikeScriptResult(data)) {
    return [data];
  }

  const record = data as Record<string, unknown>;
  for (const key of ["results", "scripts", "items", "data"]) {
    const value = record[key];
    if (Array.isArray(value)) {
      return value.filter(looksLikeScriptResult);
    }
    if (looksLikeScriptResult(value)) {
      return [value];
    }
  }

  return [];
}

export function getScriptFromResult(item: ScriptGenerationResponse) {
  return item.script ?? item.project?.script ?? null;
}
