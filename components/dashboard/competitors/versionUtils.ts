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

  if (data.result && typeof data.result === "object") {
    const { meta: _m, analysis_id: _a, prompt_id: _p, company_id: _c, ...safe } = data;
    const { meta: _rm, ...safeResult } = data.result;
    return {
      ...safe,
      summary: safe.summary || safeResult.summary || safeResult.customer_problem?.summary,
      competitor_count:
        safe.competitor_count ??
        safeResult.competitor_count ??
        safeResult.competitors?.length,
      post_count: safe.post_count ?? safeResult.post_count,
      result: safeResult,
      company: safe.company || safeResult.company,
      competitors: safe.competitors || safeResult.competitors,
      customer_problem: safe.customer_problem || safeResult.customer_problem,
      competitive_gaps: safe.competitive_gaps || (Array.isArray(safeResult.competitive_gaps) ? safeResult.competitive_gaps : undefined),
      opportunities: safe.opportunities || safeResult.opportunities,
      recommended_actions: safe.recommended_actions || safeResult.recommended_actions,
      competitive_comparison: safe.competitive_comparison || safeResult.competitive_comparison,
      website_comparison: safe.website_comparison || safeResult.website_comparison,
      linkedin_comparison: safe.linkedin_comparison || safeResult.linkedin_comparison,
      instagram_content: safe.instagram_content || safeResult.instagram_content,
      competitors_instagram:
        safe.competitors_instagram || safeResult.competitors_instagram,
      user_instagram: safe.user_instagram || safeResult.user_instagram,
      brand_images: safe.brand_images || safeResult.brand_images,
    };
  }

  if (data.company || data.competitors || data.customer_problem) {
    const {
      meta: _meta,
      analysis_id: _analysisId,
      prompt_id: _promptId,
      company_id: _companyId,
      ...rest
    } = data;

    return {
      success: rest.success,
      summary: rest.customer_problem?.summary || rest.summary,
      competitor_count: rest.competitors?.length ?? rest.competitor_count,
      post_count: rest.post_count,
      company: rest.company,
      competitors: rest.competitors,
      customer_problem: rest.customer_problem,
      competitive_gaps: rest.competitive_gaps,
      opportunities: rest.opportunities,
      recommended_actions: rest.recommended_actions,
      competitive_comparison: rest.competitive_comparison,
      website_comparison: rest.website_comparison,
      linkedin_comparison: rest.linkedin_comparison,
      instagram_content: rest.instagram_content,
      competitors_instagram: rest.competitors_instagram,
      user_instagram: rest.user_instagram,
      brand_images: rest.brand_images,
      result: {
        success: rest.success,
        company: rest.company,
        competitors: rest.competitors,
        customer_problem: rest.customer_problem,
        competitive_gaps: rest.competitive_gaps,
        opportunities: rest.opportunities,
        recommended_actions: rest.recommended_actions,
        competitive_comparison: rest.competitive_comparison,
        website_comparison: rest.website_comparison,
        linkedin_comparison: rest.linkedin_comparison,
        instagram_content: rest.instagram_content,
        competitors_instagram: rest.competitors_instagram,
        user_instagram: rest.user_instagram,
        brand_images: rest.brand_images,
        competitor_count: rest.competitors?.length ?? rest.competitor_count,
        post_count: rest.post_count,
        summary: rest.customer_problem?.summary || rest.summary,
      },
    };
  }

  const { meta: _meta, analysis_id: _a, prompt_id: _p, company_id: _c, ...safe } = data;
  return safe;
}

