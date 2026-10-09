"use client";

import { useRouter } from "next/navigation";
import { AnalyzeCompanyApi, AnalyzeCompanyResultsApi, AnswerQuestionApi, BlogPostApi, CompetitorAnalysisAiApi, CompetitorAnalysisAsyncApi, CompetitorAnalysisManualApi, ContentExecutionDailyApi, ContentExecutionRunApi, ContentRecommendationApi, DeleteImageApi, FacebookConnectApi, FacebookPublishApi, ImageGenerationApi, InstagramLoginApi, InstagramPublishApi, IntelligenceRunApi, LinkedInPublishApi, OnboardingApi, RetryDnaApi, RetryKeywordsApi, ScriptGenerationApi, SocialAccountConnectApi, SocialAccountDisconnectApi, UpdateContentExecutionAgentModeApi, UpdateContentExecutionSettingsApi, WaitlistApi } from "./bussiness.routes";
import type {
  FacebookPublishRequest,
  InstagramPublishRequest,
  LinkedInPublishRequest,
} from "@/types/bussiness/social-accounts-type";
import type {
  ContentExecutionAgentModeRequest,
  ContentExecutionRunRequest,
  ContentExecutionSettingsRequest,
} from "@/types/bussiness/content-execution-type";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnswerQuestionRequestProps, IntakeQuestion, IntakeResponseProps } from "@/types/company-details-type";
import { OnboardingRequestProps, OnboardingResponseProps } from "@/types/bussiness/onboarding-type";
import { AnalyzeCompanyRequest, AnalyzeCompanyResponse } from "@/types/bussiness/analyzecompany-type";
import { getApiErrorMessage } from "@/errors/error-utils";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { setCompanyIdProvider, setOnboardingCompletedProvider } from "@/provider/auth-provider";
import { CompetitorAnalysisAsyncResponse, CompetitorAnalysisManualRequest, CompetitorAnalysisRequest } from "@/types/bussiness/competitoranalysis-type";
import { ContentRecommendationRequest, ContentRecommendationResponse } from "@/types/bussiness/content-recommendation-type";
import { ChatMode, SendMessageDoneEvent } from "@/types/chat";
import { SendMessageApi } from "../chatbot/chatbot.routes";
import { ScriptGenerationRequest, ScriptGenerationResponse } from "@/types/bussiness/script-type";
import { ImageGenerationRequest, ImageGenerationResponse } from "@/types/bussiness/imagegeneration-type";
import { IntelligenceRunRequest, IntelligenceRunResponse } from "@/types/bussiness/intelligence-type";
import useAuthStore from "@/store/AuthsStore";


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
            setCompanyIdProvider(companyId);
            setOnboardingCompletedProvider(true);
            const resultsKey = ["analyze-company-results", companyId] as const;
            queryClient.setQueryData(resultsKey, response);
            try {
                const results = await AnalyzeCompanyResultsApi(companyId);
                queryClient.setQueryData(resultsKey, results);
            } catch {
                toast.error("Failed to get company analysis results");
            }

            queryClient.invalidateQueries({
              queryKey: ["analyze-company-dashboard", companyId],
            });
            queryClient.invalidateQueries({
              queryKey: ["analyze-company-results", companyId],
            });
            toast.success("Company analyzed successfully");
            router.push(PAGE_ROUTES.DASHBOARD);
        },
        onError: (error: unknown) => {
            toast.error(getApiErrorMessage(error, "Failed to analyze company"));
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

export const DeleteImageMutation = () => {
  const queryClient = useQueryClient();
  const companyId = useAuthStore((s) => s.company_id);

  return useMutation({
    mutationFn: (image_id: string) => {
      if (!companyId) {
        throw new Error("Company ID is missing");
      }
      return DeleteImageApi(companyId, image_id);
    },
    onSuccess: () => {
      toast.success("Image deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["company-image-generation-results", companyId],
      });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to delete image"));
    },
  });
};

export const IntelligenceRunMutation = () => {
  return useMutation({
    mutationFn: (data: IntelligenceRunRequest) => IntelligenceRunApi(data),
    onSuccess: (response: IntelligenceRunResponse) => {
      if (response?.success === false) {
        toast.error("We couldn't start building your workspace. Please try again.");
        return;
      }
      toast.success("We're building your workspace. This takes a few minutes.");
    },
    onError: () => {
      toast.error("We couldn't start building your workspace. Please try again.");
    },
  });
};


export const RetryKeywordsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => RetryKeywordsApi(),
    onSuccess: (response) => {
      queryClient.setQueryData(["keywords"], response);
      toast.success("Keyword research started again.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to start keyword research"));
    },
  });
};

export const BlogPostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (brief_id: string) => BlogPostApi(brief_id),
    onSuccess: (post) => {
      toast.success("Writing your blog post. It is usually ready within a minute.");
      queryClient.setQueryData(["blog-post", post.id], post);
      void queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to start the blog post"));
    },
  });
};

function getAuthorizeUrl(data: { authorize_url?: string } | null | undefined) {
  const url = data?.authorize_url?.trim();
  if (!url) {
    throw new Error("No authorize URL returned");
  }
  return url;
}

export function InstagramConnectMutation() {
  return useMutation({
    mutationFn: async () => {
      const response = await InstagramLoginApi();
      return getAuthorizeUrl(response);
    },
    onSuccess: (authorizeUrl) => {
      toast.message("Redirecting to Instagram…");
      window.location.assign(authorizeUrl);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to start Instagram connection"));
    },
  });
}

export function FacebookConnectMutation() {
  return useMutation({
    mutationFn: async () => {
      const response = await FacebookConnectApi();
      return getAuthorizeUrl(response);
    },
    onSuccess: (authorizeUrl) => {
      toast.message("Redirecting to Facebook…");
      window.location.assign(authorizeUrl);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to start Facebook connection"));
    },
  });
}

export function LinkedInConnectMutation() {
  return useMutation({
    mutationFn: async () => {
      const response = await SocialAccountConnectApi("linkedin");
      return getAuthorizeUrl(response);
    },
    onSuccess: (authorizeUrl) => {
      toast.message("Redirecting to LinkedIn…");
      window.location.assign(authorizeUrl);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to start LinkedIn connection"));
    },
  });
}

export function SocialAccountDisconnectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (platform: string) => SocialAccountDisconnectApi(platform),
    onSuccess: (_response, platform) => {
      const labels: Record<string, string> = {
        instagram: "Instagram disconnected",
        facebook: "Facebook disconnected",
        linkedin: "LinkedIn disconnected",
      };
      toast.success(labels[platform] || `${platform} disconnected`);
      void queryClient.invalidateQueries({ queryKey: ["social-accounts"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to disconnect account"));
    },
  });
}


export function InstagramPublishMutation() {
  return useMutation({
    mutationFn: (data: InstagramPublishRequest) => InstagramPublishApi(data),
    onSuccess: (response) => {
      if (response?.success === false) {
        toast.error(
          response.error || response.message || "Failed to publish to Instagram",
        );
        return;
      }
      toast.success(response?.message || "Published to Instagram");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to publish to Instagram"));
    },
  });
}

export function FacebookPublishMutation() {
  return useMutation({
    mutationFn: (data: FacebookPublishRequest) => FacebookPublishApi(data),
    onSuccess: (response) => {
      if (response?.success === false) {
        toast.error(
          response.error || response.message || "Failed to publish to Facebook",
        );
        return;
      }
      toast.success(response?.message || "Published to Facebook");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to publish to Facebook"));
    },
  });
}

export function UpdateContentExecutionSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ContentExecutionSettingsRequest) =>
      UpdateContentExecutionSettingsApi(data),
    onSuccess: (response, variables) => {
      if (response?.success === false) {
        toast.error(
          response.error ||
            response.message ||
            "Failed to update content execution settings",
        );
        return;
      }

      if (typeof variables.agent_mode_enabled === "boolean") {
        const agentOn =
          response?.settings?.agent_mode_enabled ??
          response?.agent_mode_enabled ??
          variables.agent_mode_enabled;
        toast.success(agentOn ? "Agent mode enabled" : "Agent mode disabled");
      } else if (typeof variables.auto_publish_enabled === "boolean") {
        const autoOn =
          response?.settings?.auto_publish_enabled ??
          response?.auto_publish_enabled ??
          variables.auto_publish_enabled;
        toast.success(autoOn ? "Auto-publish enabled" : "Auto-publish disabled");
      } else {
        toast.success(response?.message || "Settings updated");
      }

      void queryClient.invalidateQueries({
        queryKey: ["content-execution-settings"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["content-execution-agent-mode"],
      });
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, "Failed to update content execution settings"),
      );
    },
  });
}

/** Agent mode toggle. ON → orchestrator can run; OFF → company skipped. */
export function UpdateContentExecutionAgentModeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ContentExecutionAgentModeRequest) =>
      UpdateContentExecutionAgentModeApi(data),
    onSuccess: (response, variables) => {
      if (response?.success === false) {
        toast.error(
          response.error || response.message || "Failed to update agent mode",
        );
        return;
      }
      const enabled =
        response?.enabled ??
        response?.agent_mode_enabled ??
        response?.settings?.agent_mode_enabled ??
        variables.enabled;
      toast.success(enabled ? "Agent mode enabled" : "Agent mode disabled");
      void queryClient.invalidateQueries({
        queryKey: ["content-execution-agent-mode"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["content-execution-settings"],
      });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to update agent mode"));
    },
  });
}

export function ContentExecutionRunMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data?: ContentExecutionRunRequest) =>
      ContentExecutionRunApi(data),
    onSuccess: (response) => {
      if (response?.success === false) {
        toast.error(
          response.error ||
            response.message ||
            "Failed to queue content execution",
        );
        return;
      }
      toast.success(response?.message || "Content execution queued");
      void queryClient.invalidateQueries({
        queryKey: ["content-execution-items"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["content-execution-runs"],
      });
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, "Failed to queue content execution"),
      );
    },
  });
}

export function ContentExecutionDailyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => ContentExecutionDailyApi(),
    onSuccess: (response) => {
      if (response?.success === false) {
        toast.error(
          response.error || response.message || "Failed to start daily sweep",
        );
        return;
      }
      toast.success(response?.message || "Daily content sweep queued");
      void queryClient.invalidateQueries({
        queryKey: ["content-execution-runs"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["content-execution-items"],
      });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to start daily sweep"));
    },
  });
}


export function LinkedInPublishMutation() {
  return useMutation({
    mutationFn: (data: LinkedInPublishRequest) => LinkedInPublishApi(data),
    onSuccess: (response) => {
      if (response?.success === false) {
        toast.error(
          response.error || response.message || "Failed to publish to LinkedIn",
        );
        return;
      }
      toast.success(response?.message || "Published to LinkedIn");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to publish to LinkedIn"));
    },
  });
}