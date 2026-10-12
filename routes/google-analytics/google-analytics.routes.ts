import api from "@/routes/apiClient";
import type {
  GoogleAnalyticsConnection,
  GoogleAnalyticsOverview,
  GoogleAnalyticsPropertyList,
} from "@/types/bussiness/google-analytics-type";

const GOOGLE_ANALYTICS = "/google-analytics";

export const GoogleAnalyticsConnectionApi = async (): Promise<GoogleAnalyticsConnection> => {
  const response = await api.get(GOOGLE_ANALYTICS);
  return response.data;
};

export const GoogleAnalyticsConnectApi = async (): Promise<{ authorize_url: string }> => {
  const response = await api.get(`${GOOGLE_ANALYTICS}/connect`);
  return response.data;
};

export const GoogleAnalyticsPropertiesApi = async (): Promise<GoogleAnalyticsPropertyList> => {
  const response = await api.get(`${GOOGLE_ANALYTICS}/properties`);
  return response.data;
};

export const GoogleAnalyticsSelectPropertyApi = async (
  property_id: string,
): Promise<GoogleAnalyticsConnection> => {
  const response = await api.put(`${GOOGLE_ANALYTICS}/property`, { property_id });
  return response.data;
};

export const GoogleAnalyticsOverviewApi = async (days: number): Promise<GoogleAnalyticsOverview> => {
  const response = await api.get(`${GOOGLE_ANALYTICS}/overview`, { params: { days } });
  return response.data;
};

export const GoogleAnalyticsDisconnectApi = async (): Promise<void> => {
  await api.delete(GOOGLE_ANALYTICS);
};
