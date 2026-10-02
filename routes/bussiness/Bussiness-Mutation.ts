import { useRouter } from "next/navigation";
import { AnalyzeCompanyApi, OnboardingApi, WaitlistApi } from "./bussiness.routes";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { AnalyzeCompanyRequest, AnalyzeCompanyResponse, OnboardingRequestProps, OnboardingResponseProps } from "@/types/bussiness/onboarding-type";
import { getApiErrorMessage } from "@/errors/error-utils";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { NicheTrendsRequest } from "@/types/bussiness/neche_trends";

export function WaitlistMutation() {
    return useMutation({
        mutationFn: async (email: string) => {
            try {
                const response = await WaitlistApi(email);
                if (response?.success === false) {
                    throw new Error(response?.message || "Failed to add to waitlist");
                }
                return response;
            } catch (error) {
                throw new Error(getApiErrorMessage(error, "Failed to add to waitlist"));
            }
        },
        onSuccess: (response: { success?: boolean; message?: string }) => {
            toast.success(response?.message || "Email added to waitlist successfully");
        },
        onError: (error: unknown) => {
            toast.error(getApiErrorMessage(error, "Failed to add to waitlist"));
        },
    });
}

export function OnboardingMutation() {
    const router = useRouter();
    return useMutation({
        mutationFn: (data: OnboardingRequestProps) => OnboardingApi(data),
        onSuccess: (response: OnboardingResponseProps) => {
            toast.success(`${response.company_name ?? "Company"} details saved successfully`);
            router.push(PAGE_ROUTES.COMPANY_DETAIL);
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error, "Failed to save onboarding"));
        },
    });
}


export function AnalyzeCompanyMutation() {
    return useMutation({
        mutationFn: async (data: AnalyzeCompanyRequest) => {
            const response = await AnalyzeCompanyApi(data);
            return response;
        },
        onSuccess: (response: AnalyzeCompanyResponse) => {
            toast.success(response.success ? "Company analyzed successfully" : "Failed to analyze company");
        },
        onError: (error: unknown) => {
            toast.error(getApiErrorMessage(error, "Failed to analyze company"));
        },
    });
}

