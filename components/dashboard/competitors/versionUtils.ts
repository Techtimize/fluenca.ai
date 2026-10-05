import type {
  CompetitorAnalysisVersionItem,
  CompetitorAnalysisVersionsResponse,
  CompetitorsListResponse,
} from "@/types/bussiness/competitoranalysis-type";

export const LATEST_VERSION_VALUE = "latest";

function toVersionItem(
  entry: CompetitorAnalysisVersionItem | string | number,
): CompetitorAnalysisVersionItem | null {
  if (typeof entry === "string" || typeof entry === "number") {
    const version = String(entry).trim();
    if (!version) return null;
    return { version, label: `Version ${version}` };
  }

  if (!entry || typeof entry !== "object") return null;
  const version = String(entry.version ?? "").trim();
  if (!version) return null;

  return {
    version,
    label: entry.label || `Version ${version}`,
    created_at: entry.created_at,
    status: entry.status,
    analysis_id: entry.analysis_id,
  };
}

export function normalizeCompetitorVersions(
  data?: CompetitorAnalysisVersionsResponse | null,
): CompetitorAnalysisVersionItem[] {
  if (!data) return [];

  const rawList = Array.isArray(data)
    ? data
    : Array.isArray(data.versions)
      ? data.versions
      : Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.items)
          ? data.items
          : Array.isArray(data.results)
            ? data.results
            : [];

  const seen = new Set<string>();
  const items: CompetitorAnalysisVersionItem[] = [];

  for (const entry of rawList) {
    const item = toVersionItem(entry);
    if (!item || seen.has(item.version)) continue;
    seen.add(item.version);
    items.push(item);
  }

  return items;
}

export function asCompetitorsListResponse(
  data?: CompetitorsListResponse | null,
): CompetitorsListResponse | null {
  if (!data || typeof data !== "object") return null;
  return data;
}
