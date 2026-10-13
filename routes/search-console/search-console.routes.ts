import api from "@/routes/apiClient";
import type {
  IndexCheck,
  SearchConsoleConnection,
  SearchConsoleOverview,
  SearchConsoleSite,
  Sitemap,
  UrlInspection,
} from "@/types/bussiness/search-console-type";

const SEARCH_CONSOLE = "/search-console";

export const SearchConsoleConnectionApi = async (): Promise<SearchConsoleConnection> =>
  (await api.get(SEARCH_CONSOLE)).data;

export const SearchConsoleConnectApi = async (): Promise<{ authorize_url: string }> =>
  (await api.get(`${SEARCH_CONSOLE}/connect`)).data;

export const SearchConsoleSitesApi = async (): Promise<{ items: SearchConsoleSite[] }> =>
  (await api.get(`${SEARCH_CONSOLE}/sites`)).data;

export const SearchConsoleSelectSiteApi = async (site_url: string): Promise<SearchConsoleConnection> =>
  (await api.put(`${SEARCH_CONSOLE}/site`, { site_url })).data;

export const SearchConsoleOverviewApi = async (days: number): Promise<SearchConsoleOverview> =>
  (await api.get(`${SEARCH_CONSOLE}/overview`, { params: { days } })).data;

export const SearchConsoleSitemapsApi = async (): Promise<{ site_url: string; items: Sitemap[] }> =>
  (await api.get(`${SEARCH_CONSOLE}/sitemaps`)).data;

export const SearchConsoleIndexCheckApi = async (): Promise<IndexCheck> =>
  (await api.get(`${SEARCH_CONSOLE}/index-check`)).data;

export const SearchConsoleInspectApi = async (url: string): Promise<UrlInspection> =>
  (await api.post(`${SEARCH_CONSOLE}/inspect`, { url })).data;

export const SearchConsoleDisconnectApi = async (): Promise<void> => {
  await api.delete(SEARCH_CONSOLE);
};
