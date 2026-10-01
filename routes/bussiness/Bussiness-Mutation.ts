import { useRouter } from "next/navigation";
import { AnalyzeCompanyApi, OnboardingApi, RetryDnaApi, WaitlistApi } from "./bussiness.routes";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnswerQuestionApi, CompleteIntakeApi } from "../company-details/companyDetails.routes";
import { AnswerQuestionRequestProps, IntakeQuestion, IntakeResponseProps } from "@/types/company-details-type";
import { AnalyzeCompanyRequest, AnalyzeCompanyResponse, OnboardingRequestProps, OnboardingResponseProps } from "@/types/bussiness/onboarding-type";
import { getApiErrorMessage } from "@/errors/error-utils";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { setOnboardingCompletedProvider } from "@/provider/auth-provider";

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

export function CompleteIntakeMutation() {
    const router = useRouter();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => CompleteIntakeApi(),
        onSuccess: (response: IntakeResponseProps) => {
            queryClient.setQueryData(['intake'], response);
            setOnboardingCompletedProvider(true);
            toast.success("Company overview saved successfully");
            router.push(PAGE_ROUTES.VERIFY_DNA);
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error, "Failed to save company overview"));
        },
    });
}

export function AnswerQuestionMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: AnswerQuestionRequestProps) => AnswerQuestionApi(data),
        onSuccess: (updated: IntakeQuestion) => {
            queryClient.setQueryData<IntakeResponseProps>(['intake'], (intake) => {
                if (!intake) return intake;

                const sections = intake.sections.map((section) => ({
                    ...section,
                    questions: section.questions.map((question) =>
                        question.question_id === updated.question_id ? updated : question,
                    ),
                }));

                const questions = sections.flatMap((section) => section.questions);
                const confirmed = questions.filter((q) => q.status === 'confirmed').length;
                const drafted_by_ai = questions.filter((q) => q.status === 'drafted_by_ai').length;
                const needs_input = questions.filter((q) => q.status === 'needs_input').length;
                const required_unanswered = questions.filter(
                    (q) => q.required && !(q.answer && q.answer.trim()),
                ).length;

                return {
                    ...intake,
                    sections,
                    summary: {
                        total: questions.length,
                        confirmed,
                        drafted_by_ai,
                        needs_input,
                        required_unanswered,
                    },
                };
            });
            toast.success("Answer saved");
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error, "Failed to save answer"));
        },
    });
}

export function RetryDnaMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => RetryDnaApi(),
        onSuccess: (response) => {
            queryClient.setQueryData(['dna'], response);
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error, "Failed to rebuild company DNA"));
        },
    });
}
