export type GoogleTrendQueryParams = {
  geo?: string;
  category?: string | number;
  date?: string;
  time?: string;
  search_type?: string;
  hl?: string;
  q?: string;
};

export interface GoogleTrendNewsItem {
  title: string;
  url: string;
  source: string;
}

export interface GoogleTrendNowItem {
  topic: string;
  key: string;
  query: string;
  geo: string;
  geo_label: string;
  query_type: "trending" | "top" | "rising" | string;
  approx_traffic: string;
  traffic_score: number;
  value_score: number | null;
  formatted_value: string | null;
  published_at: string;
  news_items: GoogleTrendNewsItem[];
  seed_keyword: string | null;
  date: string;
  explore_url: string;
  trending_url: string;
  source: string;
  type: string;
  rising_score?: number;
}

export interface GoogleTrendFilterParam {
  label: string;
  param: string;
}

export interface GoogleTrendRegionFilter extends GoogleTrendFilterParam {
  geo: string;
}

export interface GoogleTrendTimeFilter extends GoogleTrendFilterParam {
  date: string;
}

export interface GoogleTrendCategoryFilter extends GoogleTrendFilterParam {
  id: number;
}

export interface GoogleTrendSearchTypeFilter extends GoogleTrendFilterParam {
  gprop: string;
}

export interface GoogleTrendNowFilters {
  region: GoogleTrendRegionFilter;
  time: GoogleTrendTimeFilter;
  category: GoogleTrendCategoryFilter;
  search_type: GoogleTrendSearchTypeFilter;
  q: string | null;
  explore_url: string;
}

export interface GoogleTrendNowSources {
  trending_rss: string;
  explore_api: string;
  related_widget: string;
}

export interface GoogleTrendNowResponse {
  success: boolean;
  geo: string;
  geo_label: string;
  date: string;
  date_label: string;
  category: number;
  category_label: string;
  search_type: string;
  search_type_label: string;
  q: string | null;
  mode: string;
  filters: GoogleTrendNowFilters;
  count: number;
  trends: GoogleTrendNowItem[];
  top_queries: GoogleTrendNowItem[];
  rising_queries: GoogleTrendNowItem[];
  explore_url: string;
  trending_url: string;
  sources: GoogleTrendNowSources;
}

export interface GoogleTrendTrendingResponse {
  success: boolean;
  geo: string;
  geo_label: string;
  date: string;
  hours?: number;
  count: number;
  trends: GoogleTrendNowItem[];
  source_url?: string;
  endpoint?: string;
  explore_url?: string;
  trending_url?: string;
}

export interface GoogleTrendExploreResponse {
  success: boolean;
  geo: string;
  geo_label: string;
  date: string;
  date_label?: string;
  category?: number;
  category_label?: string;
  search_type?: string;
  search_type_label?: string;
  q: string | null;
  seeds?: string[];
  filters?: GoogleTrendNowFilters;
  top_queries: GoogleTrendNowItem[];
  rising_queries: GoogleTrendNowItem[];
  trends: GoogleTrendNowItem[];
  count: number;
  endpoint?: string;
  explore_url?: string;
  trending_url?: string;
  errors?: string[];
}

export interface GoogleTrendFilterOption {
  id?: string | number;
  code?: string;
  value?: string;
  name?: string;
  label?: string;
  geo?: string;
  date?: string;
}

export interface GoogleTrendFiltersResponse {
  success?: boolean;
  message?: string;
  data?: {
    geos?: GoogleTrendFilterOption[];
    countries?: GoogleTrendFilterOption[];
    regions?: GoogleTrendFilterOption[];
    categories?: GoogleTrendFilterOption[];
    time_ranges?: GoogleTrendFilterOption[];
    times?: GoogleTrendFilterOption[];
    dates?: GoogleTrendFilterOption[];
  };
  geos?: GoogleTrendFilterOption[];
  countries?: GoogleTrendFilterOption[];
  regions?: GoogleTrendFilterOption[];
  categories?: GoogleTrendFilterOption[];
  time_ranges?: GoogleTrendFilterOption[];
  times?: GoogleTrendFilterOption[];
  dates?: GoogleTrendFilterOption[];
}

export type NormalizedTrendItem = {
  id: string;
  query: string;
  topic: string;
  searchVolume: number | null;
  approxTraffic: string | null;
  increasePercentage: number | null;
  active: boolean | null;
  categories: string[];
  relatedQueries: string[];
  startedAt: string | null;
  newsItems: GoogleTrendNewsItem[];
  exploreUrl: string | null;
  queryType: string | null;
};

export type NormalizedFilterOption = {
  id: string;
  label: string;
};

export type NormalizedTrendFilters = {
  geos: NormalizedFilterOption[];
  categories: NormalizedFilterOption[];
  timeRanges: NormalizedFilterOption[];
};

export type NormalizedExploreData = {
  series: Array<{
    label: string;
    points: Array<{ label: string; value: number }>;
  }>;
  relatedQueries: string[];
  relatedTopics: string[];
  trends: NormalizedTrendItem[];
  topQueries: NormalizedTrendItem[];
  risingQueries: NormalizedTrendItem[];
  errors: string[];
};
