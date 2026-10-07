import { useMutation } from "@tanstack/react-query";
import { ContentRecommendationApi } from "@/routes/bussiness/bussiness.routes";
import { ContentRecommendationRequest } from "@/types/Trends/Content-recommendation-interface";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/errors/error-utils";

export function ContentRecommendationMutation() {
    return useMutation({
        mutationFn: async (data: ContentRecommendationRequest) => {
            const response = await ContentRecommendationApi(data);
            return response;
        },
        onSuccess: (response) => {
            toast.success("Content recommendations generated successfully");
        },
        onError: (error: unknown) => {
            toast.error(getApiErrorMessage(error, "Failed to generate content recommendations"));
        },
    });
}
