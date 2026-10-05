import { useQuery } from "@tanstack/react-query";
import { TopicalMapApi } from "./topical-map.routes";

export const TOPICAL_MAP_KEY = ["topical-map"];

export const TopicalMapQuery = (enabled = true) => {
  return useQuery({
    queryKey: TOPICAL_MAP_KEY,
    queryFn: () => TopicalMapApi(),
    enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "generating" ? 3000 : false;
    },
    refetchOnWindowFocus: false,
  });
};
