import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/errors/error-utils";
import {
  GoogleAnalyticsConnectApi,
  GoogleAnalyticsDisconnectApi,
  GoogleAnalyticsSelectPropertyApi,
} from "./google-analytics.routes";
import { GOOGLE_ANALYTICS_KEY } from "./GoogleAnalytics-Query";

export const GoogleAnalyticsConnectMutation = () => {
  return useMutation({
    mutationFn: () => GoogleAnalyticsConnectApi(),
    onSuccess: ({ authorize_url }) => {
      window.location.assign(authorize_url);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not start the Google Analytics connection"));
    },
  });
};

export const GoogleAnalyticsSelectPropertyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (propertyId: string) => GoogleAnalyticsSelectPropertyApi(propertyId),
    onSuccess: (connection) => {
      queryClient.setQueryData(GOOGLE_ANALYTICS_KEY, connection);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not choose that property"));
    },
  });
};

export const GoogleAnalyticsDisconnectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => GoogleAnalyticsDisconnectApi(),
    onSuccess: () => {
      toast.success("Google Analytics disconnected");
      void queryClient.invalidateQueries({ queryKey: GOOGLE_ANALYTICS_KEY });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not disconnect Google Analytics"));
    },
  });
};
