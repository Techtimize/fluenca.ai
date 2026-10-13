import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/errors/error-utils";
import {
  SearchConsoleConnectApi,
  SearchConsoleConnectionApi,
  SearchConsoleDisconnectApi,
  SearchConsoleIndexCheckApi,
  SearchConsoleInspectApi,
  SearchConsoleOverviewApi,
  SearchConsoleSelectSiteApi,
  SearchConsoleSitemapsApi,
  SearchConsoleSitesApi,
} from "./search-console.routes";

export const SEARCH_CONSOLE_KEY = ["search-console"];
const FIVE_MINUTES = 5 * 60 * 1000;

export const SearchConsoleConnectionQuery = () =>
  useQuery({ queryKey: SEARCH_CONSOLE_KEY, queryFn: SearchConsoleConnectionApi, refetchOnWindowFocus: true });

export const SearchConsoleSitesQuery = (enabled: boolean) =>
  useQuery({ queryKey: [...SEARCH_CONSOLE_KEY, "sites"], queryFn: SearchConsoleSitesApi, enabled, staleTime: FIVE_MINUTES });

export const SearchConsoleOverviewQuery = (siteUrl: string | null, days: number) =>
  useQuery({
    queryKey: [...SEARCH_CONSOLE_KEY, "overview", siteUrl, days],
    queryFn: () => SearchConsoleOverviewApi(days),
    enabled: Boolean(siteUrl),
    staleTime: FIVE_MINUTES,
  });

export const SearchConsoleSitemapsQuery = (siteUrl: string | null) =>
  useQuery({
    queryKey: [...SEARCH_CONSOLE_KEY, "sitemaps", siteUrl],
    queryFn: SearchConsoleSitemapsApi,
    enabled: Boolean(siteUrl),
    staleTime: FIVE_MINUTES,
  });

export const SearchConsoleConnectMutation = () =>
  useMutation({
    mutationFn: SearchConsoleConnectApi,
    onSuccess: ({ authorize_url }) => window.location.assign(authorize_url),
    onError: (error) => toast.error(getApiErrorMessage(error, "Could not start the Search Console connection")),
  });

export const SearchConsoleSelectSiteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: SearchConsoleSelectSiteApi,
    onSuccess: (connection) => queryClient.setQueryData(SEARCH_CONSOLE_KEY, connection),
    onError: (error) => toast.error(getApiErrorMessage(error, "Could not choose that website")),
  });
};

export const SearchConsoleIndexCheckMutation = () =>
  useMutation({
    mutationFn: SearchConsoleIndexCheckApi,
    onError: (error) => toast.error(getApiErrorMessage(error, "Could not check the index status")),
  });

export const SearchConsoleInspectMutation = () =>
  useMutation({
    mutationFn: SearchConsoleInspectApi,
    onError: (error) => toast.error(getApiErrorMessage(error, "Could not inspect that page")),
  });

export const SearchConsoleDisconnectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: SearchConsoleDisconnectApi,
    onSuccess: () => {
      toast.success("Search Console disconnected");
      void queryClient.invalidateQueries({ queryKey: SEARCH_CONSOLE_KEY });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Could not disconnect Search Console")),
  });
};
