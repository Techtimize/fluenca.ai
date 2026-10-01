import type {
  GoogleTrendExploreResponse,
  GoogleTrendFilterOption,
  GoogleTrendFiltersResponse,
  GoogleTrendNowItem,
  GoogleTrendNowResponse,
  GoogleTrendTrendingResponse,
  NormalizedExploreData,
  NormalizedFilterOption,
  NormalizedTrendFilters,
  NormalizedTrendItem,
} from "@/types/bussiness/google-trends-type";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[%,+]/g, "").trim();
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function toStringValue(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

function normalizeFilterOptions(
  options: GoogleTrendFilterOption[] | undefined,
): NormalizedFilterOption[] {
  if (!options?.length) return [];
  return options
    .map((option, index) => {
      const id =
        toStringValue(option.id) ??
        toStringValue(option.code) ??
        toStringValue(option.value) ??
        toStringValue(option.geo) ??
        toStringValue(option.date) ??
        toStringValue(option.name) ??
        toStringValue(option.label) ??
        String(index);
      const label =
        toStringValue(option.label) ??
        toStringValue(option.name) ??
        toStringValue(option.code) ??
        toStringValue(option.value) ??
        id;
      return { id, label };
    })
    .filter((option) => option.id && option.label);
}

export function normalizeNowItem(
  item: GoogleTrendNowItem,
  index: number,
): NormalizedTrendItem {
  const query = item.query || item.topic || item.key;
  return {
    id: item.key || `${query}-${index}`,
    query,
    topic: item.topic || query,
    searchVolume: item.traffic_score ?? item.value_score ?? null,
    approxTraffic: item.approx_traffic || item.formatted_value || null,
    increasePercentage: item.rising_score ?? null,
    active: item.query_type === "trending" || item.query_type === "rising",
    categories: item.geo_label ? [item.geo_label] : [],
    relatedQueries: [],
    startedAt: item.published_at || item.date || null,
    newsItems: item.news_items ?? [],
    exploreUrl: item.explore_url || null,
    queryType: item.query_type || null,
  };
}

function normalizeItemsList(
  items: GoogleTrendNowItem[] | undefined,
): NormalizedTrendItem[] {
  if (!items?.length) return [];
  return items
    .map((item, index) => normalizeNowItem(item, index))
    .filter((item) => Boolean(item.query));
}

export function normalizeTrendItems(
  payload:
    | GoogleTrendNowResponse
    | GoogleTrendTrendingResponse
    | GoogleTrendExploreResponse
    | unknown,
  listKey: "trends" | "top_queries" | "rising_queries" = "trends",
): NormalizedTrendItem[] {
  const root = asRecord(payload);
  if (!root) return [];

  const typedList = root[listKey];
  if (Array.isArray(typedList) && typedList.length > 0) {
    return normalizeItemsList(typedList as GoogleTrendNowItem[]);
  }

  if (Array.isArray(root.trends)) {
    return normalizeItemsList(root.trends as GoogleTrendNowItem[]);
  }

  return [];
}

export function normalizeNowResponse(payload: GoogleTrendNowResponse | unknown): {
  trends: NormalizedTrendItem[];
  topQueries: NormalizedTrendItem[];
  risingQueries: NormalizedTrendItem[];
  meta: {
    geoLabel: string | null;
    dateLabel: string | null;
    categoryLabel: string | null;
    count: number;
    exploreUrl: string | null;
    trendingUrl: string | null;
  };
} {
  const root = asRecord(payload) as GoogleTrendNowResponse | null;
  if (!root) {
    return {
      trends: [],
      topQueries: [],
      risingQueries: [],
      meta: {
        geoLabel: null,
        dateLabel: null,
        categoryLabel: null,
        count: 0,
        exploreUrl: null,
        trendingUrl: null,
      },
    };
  }

  return {
    trends: normalizeItemsList(root.trends),
    topQueries: normalizeItemsList(root.top_queries),
    risingQueries: normalizeItemsList(root.rising_queries),
    meta: {
      geoLabel: root.geo_label ?? null,
      dateLabel: root.date_label ?? null,
      categoryLabel: root.category_label ?? null,
      count: root.count ?? 0,
      exploreUrl: root.explore_url ?? null,
      trendingUrl: root.trending_url ?? null,
    },
  };
}

export const WORLDWIDE_GEO_ID = "worldwide";

const DEFAULT_TREND_GEOS: NormalizedFilterOption[] = [
  { id: WORLDWIDE_GEO_ID, label: "Worldwide" },
  { id: "US", label: "United States" },
  { id: "GB", label: "United Kingdom" },
  { id: "CA", label: "Canada" },
  { id: "AU", label: "Australia" },
  { id: "NZ", label: "New Zealand" },
  { id: "IE", label: "Ireland" },
  { id: "IN", label: "India" },
  { id: "PK", label: "Pakistan" },
  { id: "BD", label: "Bangladesh" },
  { id: "LK", label: "Sri Lanka" },
  { id: "AE", label: "United Arab Emirates" },
  { id: "SA", label: "Saudi Arabia" },
  { id: "QA", label: "Qatar" },
  { id: "KW", label: "Kuwait" },
  { id: "BH", label: "Bahrain" },
  { id: "OM", label: "Oman" },
  { id: "EG", label: "Egypt" },
  { id: "ZA", label: "South Africa" },
  { id: "NG", label: "Nigeria" },
  { id: "KE", label: "Kenya" },
  { id: "DE", label: "Germany" },
  { id: "FR", label: "France" },
  { id: "IT", label: "Italy" },
  { id: "ES", label: "Spain" },
  { id: "PT", label: "Portugal" },
  { id: "NL", label: "Netherlands" },
  { id: "BE", label: "Belgium" },
  { id: "CH", label: "Switzerland" },
  { id: "AT", label: "Austria" },
  { id: "SE", label: "Sweden" },
  { id: "NO", label: "Norway" },
  { id: "DK", label: "Denmark" },
  { id: "FI", label: "Finland" },
  { id: "PL", label: "Poland" },
  { id: "CZ", label: "Czechia" },
  { id: "RO", label: "Romania" },
  { id: "GR", label: "Greece" },
  { id: "TR", label: "Turkey" },
  { id: "RU", label: "Russia" },
  { id: "UA", label: "Ukraine" },
  { id: "BR", label: "Brazil" },
  { id: "MX", label: "Mexico" },
  { id: "AR", label: "Argentina" },
  { id: "CL", label: "Chile" },
  { id: "CO", label: "Colombia" },
  { id: "PE", label: "Peru" },
  { id: "JP", label: "Japan" },
  { id: "KR", label: "South Korea" },
  { id: "CN", label: "China" },
  { id: "HK", label: "Hong Kong" },
  { id: "TW", label: "Taiwan" },
  { id: "SG", label: "Singapore" },
  { id: "MY", label: "Malaysia" },
  { id: "ID", label: "Indonesia" },
  { id: "TH", label: "Thailand" },
  { id: "VN", label: "Vietnam" },
  { id: "PH", label: "Philippines" },
  { id: "IL", label: "Israel" },
];

function mergeGeoOptions(
  apiGeos: NormalizedFilterOption[],
): NormalizedFilterOption[] {
  const byId = new Map<string, NormalizedFilterOption>();
  for (const geo of DEFAULT_TREND_GEOS) byId.set(geo.id, geo);
  for (const geo of apiGeos) {
    const id =
      !geo.id || geo.id.toLowerCase() === "worldwide"
        ? WORLDWIDE_GEO_ID
        : geo.id;
    byId.set(id, { ...geo, id });
  }
  return Array.from(byId.values()).sort((a, b) => {
    if (a.id === WORLDWIDE_GEO_ID) return -1;
    if (b.id === WORLDWIDE_GEO_ID) return 1;
    return a.label.localeCompare(b.label);
  });
}

export function toTrendGeoParam(geo: string): string | undefined {
  if (!geo || geo === WORLDWIDE_GEO_ID) return undefined;
  return geo;
}

const DEFAULT_TREND_CATEGORIES: NormalizedFilterOption[] = [
  { id: "0", label: "All categories" },
  { id: "3", label: "Arts & Entertainment" },
  { id: "5", label: "Autos & Vehicles" },
  { id: "7", label: "Beauty & Fitness" },
  { id: "8", label: "Books & Literature" },
  { id: "11", label: "Business & Industrial" },
  { id: "12", label: "Computers & Electronics" },
  { id: "13", label: "Finance" },
  { id: "14", label: "Food & Drink" },
  { id: "16", label: "Games" },
  { id: "18", label: "Health" },
  { id: "19", label: "Hobbies & Leisure" },
  { id: "20", label: "Home & Garden" },
  { id: "22", label: "Internet & Telecom" },
  { id: "23", label: "Jobs & Education" },
  { id: "24", label: "Law & Government" },
  { id: "25", label: "News" },
  { id: "26", label: "Online Communities" },
  { id: "29", label: "People & Society" },
  { id: "30", label: "Pets & Animals" },
  { id: "31", label: "Real Estate" },
  { id: "32", label: "Reference" },
  { id: "33", label: "Science" },
  { id: "34", label: "Shopping" },
  { id: "35", label: "Sports" },
  { id: "36", label: "Travel" },
];

function mergeCategoryOptions(
  apiCategories: NormalizedFilterOption[],
): NormalizedFilterOption[] {
  const byId = new Map<string, NormalizedFilterOption>();
  for (const category of DEFAULT_TREND_CATEGORIES) {
    byId.set(category.id, category);
  }
  for (const category of apiCategories) {
    byId.set(category.id, category);
  }
  return Array.from(byId.values()).sort((a, b) => {
    if (a.id === "0") return -1;
    if (b.id === "0") return 1;
    return a.label.localeCompare(b.label);
  });
}

export function normalizeTrendFilters(
  payload: GoogleTrendFiltersResponse | unknown,
): NormalizedTrendFilters {
  const root = asRecord(payload);
  const data = asRecord(root?.data) ?? root ?? {};

  const geos = normalizeFilterOptions(
    (data.geos as GoogleTrendFilterOption[] | undefined) ??
      (data.countries as GoogleTrendFilterOption[] | undefined) ??
      (data.regions as GoogleTrendFilterOption[] | undefined),
  );
  const categories = normalizeFilterOptions(
    data.categories as GoogleTrendFilterOption[] | undefined,
  );
  const timeRanges = normalizeFilterOptions(
    (data.time_ranges as GoogleTrendFilterOption[] | undefined) ??
      (data.times as GoogleTrendFilterOption[] | undefined) ??
      (data.dates as GoogleTrendFilterOption[] | undefined),
  );

  return {
    geos: mergeGeoOptions(geos),
    categories: mergeCategoryOptions(categories),
    timeRanges:
      timeRanges.length > 0
        ? timeRanges
        : [
            { id: "now 1-d", label: "Past day" },
            { id: "now 7-d", label: "Past 7 days" },
            { id: "today 1-m", label: "Past month" },
            { id: "today 3-m", label: "Past 3 months" },
            { id: "today 12-m", label: "Past 12 months" },
          ],
  };
}

export function normalizeExploreData(
  payload: GoogleTrendExploreResponse | unknown,
): NormalizedExploreData {
  const root = asRecord(payload) as GoogleTrendExploreResponse | null;
  if (!root) {
    return {
      series: [],
      relatedQueries: [],
      relatedTopics: [],
      trends: [],
      topQueries: [],
      risingQueries: [],
      errors: [],
    };
  }

  const topQueries = normalizeItemsList(root.top_queries);
  const risingQueries = normalizeItemsList(root.rising_queries);
  const trends = normalizeItemsList(root.trends);

  const relatedQueries = [
    ...topQueries.map((item) => item.query),
    ...risingQueries.map((item) => item.query),
  ].filter((query, index, list) => list.indexOf(query) === index);

  const relatedTopics = trends
    .map((item) => item.topic)
    .filter((topic, index, list) => list.indexOf(topic) === index);

  const scoreSeries = [...topQueries, ...risingQueries]
    .slice(0, 12)
    .map((item) => ({
      label: item.query,
      value: item.searchVolume ?? item.increasePercentage ?? 0,
    }))
    .filter((point) => point.value > 0);

  return {
    series:
      scoreSeries.length > 0
        ? [{ label: root.q ? `Interest for “${root.q}”` : "Related interest", points: scoreSeries }]
        : [],
    relatedQueries,
    relatedTopics,
    trends,
    topQueries,
    risingQueries,
    errors: root.errors ?? [],
  };
}

export function formatVolume(value: number | null): string {
  if (value == null) return "—";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(value);
}

export function formatTraffic(value: string | null, fallback: number | null): string {
  if (value) return value;
  return formatVolume(fallback);
}

export function formatPercent(value: number | null): string {
  if (value == null) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value}%`;
}
