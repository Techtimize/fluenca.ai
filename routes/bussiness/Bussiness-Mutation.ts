import { useRouter } from "next/navigation";
import { AnalyzeCompanyApi, AnalyzeCompanyResultsApi, AnswerQuestionApi, CompetitorAnalysisAiApi, CompetitorAnalysisAsyncApi, CompetitorAnalysisManualApi, CompleteIntakeApi, ContentRecommendationApi, ImageGenerationApi, OnboardingApi, RetryDnaApi, ScriptGenerationApi, WaitlistApi } from "./bussiness.routes";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnswerQuestionRequestProps, IntakeQuestion, IntakeResponseProps } from "@/types/company-details-type";
import { OnboardingRequestProps, OnboardingResponseProps } from "@/types/bussiness/onboarding-type";
import { AnalyzeCompanyRequest, AnalyzeCompanyResponse } from "@/types/bussiness/analyzecompany-type";
import { getApiErrorMessage } from "@/errors/error-utils";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { setCompanyUserIdProvider, setOnboardingCompletedProvider } from "@/provider/auth-provider";
import { CompetitorAnalysisAsyncResponse, CompetitorAnalysisManualRequest, CompetitorAnalysisRequest } from "@/types/bussiness/competitoranalysis-type";
import { ContentRecommendationRequest, ContentRecommendationResponse } from "@/types/bussiness/content-recommendation-type";
import { ChatMode, SendMessageDoneEvent } from "@/types/chat";
import { SendMessageApi } from "../chatbot/chatbot.routes";
import { ScriptGenerationRequest, ScriptGenerationResponse } from "@/types/bussiness/script-type";
import { ImageGenerationRequest, ImageGenerationResponse } from "@/types/bussiness/imagegeneration-type";

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
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AnalyzeCompanyRequest) => AnalyzeCompanyApi(data),
        onSuccess: async (response: AnalyzeCompanyResponse) => {
            if (response.success === false) {
                toast.error(response.error || "Failed to analyze company");
                return;
            }

            const companyId = response.meta?.company_id;
            if (!companyId) {
                toast.error("Company ID missing from analysis response");
                return;
            }
            setCompanyUserIdProvider(companyId);
            setOnboardingCompletedProvider(true);
            const resultsKey = ["analyze-company-results", companyId] as const;
            queryClient.setQueryData(resultsKey, response);
            try {
                const results = await AnalyzeCompanyResultsApi(companyId);
                queryClient.setQueryData(resultsKey, results);
            } catch {
                toast.error("Failed to get company analysis results");
            }

            toast.success("Company analyzed successfully");
            router.push(PAGE_ROUTES.DASHBOARD);
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


export function CompetitorAnalysisAsyncMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CompetitorAnalysisRequest) => CompetitorAnalysisAsyncApi(data),
        onSuccess: (response: CompetitorAnalysisAsyncResponse, variables) => {
            if (response?.success === false) {
                toast.error(response.error || response.message || "Failed to analyze competitors");
                return;
            }
            queryClient.invalidateQueries({
                queryKey: ["competitor-analysis-competitor", variables.company_id],
            });
            toast.success(response?.message || "Competitor analysis started successfully");
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error, "Failed to analyze competitor"));
        },
    });
}

export function CompetitorAnalysisAiMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (company_id: string) => CompetitorAnalysisAiApi(company_id),
        onSuccess: (response: CompetitorAnalysisAsyncResponse, company_id) => {
            if (response?.success === false) {
                toast.error(response.error || response.message || "Failed to analyze competitors");
                return;
            }
            queryClient.invalidateQueries({ queryKey: ["competitor-analysis-ai-versions", company_id] });
            queryClient.invalidateQueries({ queryKey: ["competitor-analysis-ai-latest-response", company_id] });
            toast.success(response?.message || "Competitor analysis started successfully");
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error, "Failed to analyze competitor"));
        },
    });
}

export function CompetitorAnalysisManualMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CompetitorAnalysisManualRequest) => CompetitorAnalysisManualApi(data),
        onSuccess: (response: CompetitorAnalysisAsyncResponse, variables) => {
            if (response?.success === false) {
                toast.error(response.error || response.message || "Failed to analyze competitors");
                return;
            }
            queryClient.invalidateQueries({
                queryKey: ["competitor-analysis-manual-versions", variables.company_id],
            });
            queryClient.invalidateQueries({
                queryKey: ["competitor-analysis-manual-latest-response", variables.company_id],
            });
            toast.success(response?.message || "Competitor analysis started successfully");
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error, "Failed to analyze competitor"));
        },
    });
}

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
          queryClient.invalidateQueries({ queryKey: ["content-recommendation-result", variables.company_id] });
          router.push(PAGE_ROUTES.CONTENT_RECOMMENDATION);
      },
      onError: (error) => {
          toast.error(getApiErrorMessage(error, "Failed to get content recommendations"));
      },
  });
}

type SendMessageVariables = {
  message: string;
  conversationId?: string;
  screenContext?: string;
  imageUrl?: string;
  mode?: ChatMode;
  onChunk: (text: string) => void;
  onDone: (event: SendMessageDoneEvent) => void;
};

export const SendMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ message, conversationId, screenContext, imageUrl, mode, onChunk, onDone }: SendMessageVariables) =>
      SendMessageApi(message, { onChunk, onDone }, { conversationId, screenContext, imageUrl, mode }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-history"] });
      queryClient.invalidateQueries({ queryKey: ["chat-conversations"] });
    },
    onError: (error: Error) => {
      toast("The assistant is unavailable", { description: error.message });
    },
  });
};


export const ScriptGenerationMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ScriptGenerationRequest) => ScriptGenerationApi(data),
    onSuccess: (_response: ScriptGenerationResponse, variables) => {
      toast.success("Script generated successfully");
      queryClient.invalidateQueries({
        queryKey: ["script-generation-results", variables.company_id],
      });
      router.push(PAGE_ROUTES.SCRIPT);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to generate script"));
    },
  });
};


export const ImageGenerationMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ImageGenerationRequest) => ImageGenerationApi(data),
    onSuccess: (_response: ImageGenerationResponse, variables) => {
      toast.success("Image generated successfully");
      queryClient.invalidateQueries({
        queryKey: ["company-image-generation-results", variables.company_id],
      });
      router.push(PAGE_ROUTES.CONTENT);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to generate image"));
    },
  });
};