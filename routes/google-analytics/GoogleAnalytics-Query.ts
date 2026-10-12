import { useQuery } from "@tanstack/react-query";
import {
  GoogleAnalyticsConnectionApi,
  GoogleAnalyticsOverviewApi,
  GoogleAnalyticsPropertiesApi,
} from "./google-analytics.routes";

export const GOOGLE_ANALYTICS_KEY = ["google-analytics"];

export const GoogleAnalyticsConnectionQuery = () => {
  return useQuery({
    queryKey: GOOGLE_ANALYTICS_KEY,
    queryFn: () => GoogleAnalyticsConnectionApi(),
    refetchOnWindowFocus: true,
  });
};

export const GoogleAnalyticsPropertiesQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: [...GOOGLE_ANALYTICS_KEY, "properties"],
    queryFn: () => GoogleAnalyticsPropertiesApi(),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

export const GoogleAnalyticsOverviewQuery = (propertyId: string | null, days: number) => {
  return useQuery({
    queryKey: [...GOOGLE_ANALYTICS_KEY, "overview", propertyId, days],
    queryFn: () => GoogleAnalyticsOverviewApi(days),
    enabled: Boolean(propertyId),
    staleTime: 5 * 60 * 1000,
  });
};
