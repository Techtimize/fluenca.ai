import { useQuery } from "@tanstack/react-query";
import { ContentRecommendationResultApi } from "./contentRecommendation.routes";

export const ContentRecommendationResultQuery = (company_id: string) => {
    return useQuery({
        queryKey: ["content-recommendation-result", company_id],
        queryFn: () => ContentRecommendationResultApi(company_id),
        enabled: Boolean(company_id),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
}
