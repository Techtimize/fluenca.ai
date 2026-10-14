import { useQuery } from "@tanstack/react-query";
import { PageSpeedApi, type PageSpeedStrategy } from "./page-speed.routes";

const THIRTY_MINUTES = 30 * 60 * 1000;

/** A check takes up to a minute, so results are kept for a while instead of re-run on every visit. */
export const PageSpeedQuery = (url: string, strategy: PageSpeedStrategy, enabled = true) =>
  useQuery({
    queryKey: ["page-speed", url, strategy],
    queryFn: () => PageSpeedApi({ url, strategy }),
    enabled,
    staleTime: THIRTY_MINUTES,
    gcTime: THIRTY_MINUTES,
    retry: false,
    refetchOnWindowFocus: false,
  });
