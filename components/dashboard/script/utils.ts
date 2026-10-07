import type {
  ScriptGenerationResponse,
  ScriptGenerationResultsResponse,
} from "@/types/bussiness/script-type";

export const SCRIPT_PAGE_LIMIT = 20;

export type ScriptPaginationMeta = {
  total: number | null;
  limit: number;
  offset: number;
  hasPrevious: boolean;
  hasNext: boolean;
};

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

function readNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function getScriptPaginationMeta(
  data: ScriptGenerationResultsResponse | null | undefined,
  items: ScriptGenerationResponse[],
  params: { limit: number; offset: number },
): ScriptPaginationMeta {
  const { limit, offset } = params;
  const record =
    data && typeof data === "object" && !Array.isArray(data)
      ? (data as Record<string, unknown>)
      : null;

  const total =
    readNumber(record?.total) ??
    readNumber(record?.total_count) ??
    readNumber(record?.count) ??
    null;

  const hasPrevious = offset > 0;
  const hasNextFromFlags =
    record?.has_more === true ||
    record?.has_next === true ||
    readNumber(record?.next_offset) !== null;

  const hasNext =
    hasNextFromFlags ||
    (total !== null ? offset + items.length < total : items.length >= limit);

  return {
    total,
    limit,
    offset,
    hasPrevious,
    hasNext,
  };
}

export function getScriptFromResult(item: ScriptGenerationResponse) {
  return item.script ?? item.project?.script ?? null;
}

export function getScriptResultId(item: ScriptGenerationResponse): string | null {
  const script = getScriptFromResult(item);
  const id =
    item.id ||
    script?.id ||
    item.project?.id ||
    item.meta?.prompt_id ||
    null;
  return id ? String(id) : null;
}

export function findScriptResultById(
  items: ScriptGenerationResponse[],
  id: string,
): ScriptGenerationResponse | null {
  if (!id) return null;
  return (
    items.find((item) => getScriptResultId(item) === id) ||
    items.find((item) => item.script?.id === id) ||
    items.find((item) => item.project?.id === id) ||
    items.find((item) => item.meta?.prompt_id === id) ||
    null
  );
}
