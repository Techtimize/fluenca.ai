import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ContentRecommendationApi } from "./contentRecommendation.routes";
import { ContentRecommendationRequest, ContentRecommendationResponse } from "@/types/bussiness/content-recommendation-type";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { getApiErrorMessage } from "@/errors/error-utils";

export function ContentRecommendationMutation() {
    const router = useRouter();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ContentRecommendationRequest) => ContentRecommendationApi(data),
        onSuccess: (response: ContentRecommendationResponse, variables) => {
            if (!response?.success) {
                toast.error(response?.message || "Failed to generate content recommendations");
                return;
            }
            toast.success(response.message || "Content recommendations generated");
            // Load the fresh results on the next page.
            queryClient.invalidateQueries({ queryKey: ["content-recommendation-result", variables.company_id] });
            router.push(PAGE_ROUTES.CONTENT_RECOMMENDATION);
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error, "Failed to get content recommendations"));
        },
    });
}
