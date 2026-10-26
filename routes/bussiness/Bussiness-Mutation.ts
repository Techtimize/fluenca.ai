"use client";

import { useRouter } from "next/navigation";
import { AnalyzeCompanyApi, AnalyzeCompanyResultsApi, AnswerQuestionApi, BlogImageApi, BlogPostApi, CompetitorAnalysisAiApi, CompetitorAnalysisAsyncApi, CompetitorAnalysisManualApi, ContentExecutionDailyApi, ContentExecutionRunApi, ContentRecommendationApi, DeleteImageApi, EditUserProfileApi, FacebookConnectApi, FacebookPublishApi, ImageGenerationApi, InstagramLoginApi, LinkedInLoginApi, InstagramPublishApi, IntelligenceRunApi, LinkedInPublishApi, OnboardingApi, XLoginApi, XPublishApi, RetryDnaApi, RetryKeywordsApi, ScriptGenerationApi, SocialAccountDisconnectApi, UpdateContentExecutionAgentModeApi, UpdateContentExecutionSettingsApi, WaitlistApi, ContactUsApi, CreateGoalApi, DiagnoseGoalApi, ApproveGoalApi, UpdateGoalTaskApi, ScheduleImageGenerationApi, FindCompetitorApi } from "./bussiness.routes";
import type {
  FacebookPublishRequest,
  InstagramPublishRequest,
  LinkedInPublishRequest,
  XPublishRequest,
} from "@/types/bussiness/social-accounts-type";
import type {
  ContentExecutionAgentModeRequest,
  ContentExecutionRunRequest,
  ContentExecutionSettingsRequest,
} from "@/types/bussiness/content-execution-type";
import { toast } from "sonner";
import { isPostedResponse } from "@/lib/content/posted-content";
import type { ContactUsRequest } from "@/types/bussiness/contact-type";
import type { StreamStart } from "@/routes/chatbot/chatbot.routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnswerQuestionRequestProps, IntakeQuestion, IntakeResponseProps } from "@/types/company-details-type";
import { OnboardingRequestProps, OnboardingResponseProps } from "@/types/bussiness/onboarding-type";
import { AnalyzeCompanyRequest, AnalyzeCompanyResponse } from "@/types/bussiness/analyzecompany-type";
import type { BlogImageRequest } from "@/types/bussiness/blog-type";
import { getApiErrorMessage, isApiNotFoundError } from "@/errors/error-utils";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { setCompanyIdProvider, setOnboardingCompletedProvider } from "@/provider/auth-provider";
import { CompetitorAnalysisAsyncResponse, CompetitorAnalysisManualRequest, CompetitorAnalysisRequest } from "@/types/bussiness/competitoranalysis-type";
import { ContentRecommendationRequest, ContentRecommendationResponse } from "@/types/bussiness/content-recommendation-type";
import { ChatMode, SendMessageDoneEvent } from "@/types/chat";
import { SendMessageApi } from "../chatbot/chatbot.routes";
import { ScriptGenerationRequest, ScriptGenerationResponse } from "@/types/bussiness/script-type";
import { ImageGenerationRequest, ImageGenerationResponse, ImageGenerationScheduleRequest } from "@/types/bussiness/imagegeneration-type";
import { IntelligenceRunRequest, IntelligenceRunResponse } from "@/types/bussiness/intelligence-type";
import useAuthStore from "@/store/AuthsStore";
import type { EditProfileRequest } from "@/types/bussiness/user-profile-type";
import type { CreateGoalRequest, UpdateGoalTaskRequest } from "@/types/bussiness/goal-type";
import { GOALS_KEY, GOOGLE_ANALYTICS_KEY, SCHEDULED_POSTS_KEY, SEARCH_CONSOLE_KEY, TEXT_POSTS_KEY, goalKey, scheduledPostKey } from "./Bussiness-Query";
import type { CreateTextPostRequest } from "@/types/bussiness/text-post-type";
import { CreateTextPostApi } from "./bussiness.routes";
import {
  BuildProspectIcpApi,
  ExportProspectsCsvApi,
  RegenerateProspectDraftsApi,
  SaveProspectApi,
  StartProspectRunApi,
  UpdateProspectIcpApi,
  UpdateProspectStatusApi,
} from "./bussiness.routes";
import { PROSPECT_ICP_KEY, PROSPECT_RUNS_KEY, PROSPECTS_KEY, prospectKey, prospectRunKey } from "./Bussiness-Query";
import type {
  BuildIcpRequest,
  SettableProspectStatus,
  StartProspectRunRequest,
  UpdateIcpRequest,
} from "@/types/bussiness/prospect-type";
import {
  CancelWeekPostApi,
  GenerateWeekPostsApi,
  ProfileRewriteApi,
  RunLinkedInScoreApi,
  RunProfileScoreApi,
  ScheduleWeekPostApi,
} from "./bussiness.routes";
import { LINKEDIN_SCORE_KEY, PROFILE_SCORE_KEY, WEEK_POSTS_KEY } from "./Bussiness-Query";
import type { ProfileScoreRequest, ScheduleWeekPostRequest } from "@/types/bussiness/linkedin-growth-type";
import {
  AddFollowUpApi,
  CarouselApi,
  CompleteCoachTaskApi,
  CompleteFollowUpApi,
  ContentPlanApi,
  PostCheckApi,
  PublishCarouselApi,
  RepurposeApi,
  UndoCoachTaskApi,
  WritePostApi,
} from "./bussiness.routes";
import { COACH_TODAY_KEY, FOLLOW_UPS_KEY } from "./Bussiness-Query";
import type {
  AddFollowUpRequest,
  CarouselRequest,
  ContentPlanGoal,
  PostCheckRequest,
  PublishCarouselRequest,
  WritePostRequest,
} from "@/types/bussiness/linkedin-coach-type";
import type { CreateScheduledPostRequest, UpdateScheduledPostRequest } from "@/types/bussiness/scheduled-post-type";
import {
  GoogleAnalyticsConnectApi,
  GoogleAnalyticsDisconnectApi,
  DeleteGoalApi,
  PauseGoalApi,
  ResumeGoalApi,
  GoogleAnalyticsSelectPropertyApi,
  SearchConsoleConnectApi,
  SearchConsoleDisconnectApi,
  SearchConsoleIndexCheckApi,
  SearchConsoleInspectApi,
  SearchConsoleSelectSiteApi,
  CreateScheduledPostApi,
  UpdateScheduledPostApi,
  CancelScheduledPostApi,
  DeleteScheduledPostApi,
} from "./bussiness.routes";

export function EditUserProfileMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ user_id, data }: { user_id: string; data: EditProfileRequest }) => {
            const response = await EditUserProfileApi(user_id, data);
            if (response?.success === false) {
                throw new Error(response?.message || "Failed to update profile");
            }
            return response;
        },
        onSuccess: (response) => {
            toast.success(response?.message || "Profile updated successfully");
            queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        },
        onError: (error: unknown) => {
            toast.error(getApiErrorMessage(error, "Failed to update profile"));
        },
    });
}


export function ContactUsMutation() {
    return useMutation({
        mutationFn: (data: ContactUsRequest) => ContactUsApi(data),
        onError: (error: unknown) => {
            // 422 (e.g. an invalid date) carries a readable message
            toast.error(getApiErrorMessage(error, "Couldn't send your request. Please try again."));
        },
    });
}

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
    return useMutation({
        mutationFn: (data: OnboardingRequestProps) => OnboardingApi(data),
        onSuccess: (response: OnboardingResponseProps) => {
            toast.success(`${response.company_name ?? "Company"} details saved successfully`);
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
  pages?: Record<string, string>;
  pagePath?: string;
  onStart?: (ids: StreamStart) => void;
  onStep?: (label: string) => void;
  onChunk: (text: string) => void;
  onReset?: (text: string) => void;
  onDone: (event: SendMessageDoneEvent) => void;
};

export const SendMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ message, conversationId, screenContext, imageUrl, mode, pages, pagePath, onStart, onStep, onChunk, onReset, onDone }: SendMessageVariables) =>
      SendMessageApi(message, { onStart, onStep, onChunk, onReset, onDone }, { conversationId, screenContext, imageUrl, mode, pages, pagePath }),
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

export const ScheduleImageGenerationMutation = () => {
  const queryClient = useQueryClient();
  const companyId = useAuthStore((s) => s.company_id);

  return useMutation({
    mutationFn: (data: ImageGenerationScheduleRequest) => ScheduleImageGenerationApi(data),
    onSuccess: () => {
      toast.success("Post scheduled");
      void queryClient.invalidateQueries({
        queryKey: ["company-image-generation-results", companyId],
      });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to schedule post"));
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

export const BlogImageMutation = (blogPostId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: BlogImageRequest) => BlogImageApi(blogPostId, body),
    onSuccess: (post) => {
      queryClient.setQueryData(["blog-post", post.id], post);
      void queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "The image could not be created"));
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
    mutationFn: async (context?: string) => {
      const response = await InstagramLoginApi(context);
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
    mutationFn: async (context?: string) => {
      const response = await LinkedInLoginApi(context);
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

export function XConnectMutation() {
  return useMutation({
    mutationFn: async (context?: string) => {
      const response = await XLoginApi(context);
      return getAuthorizeUrl(response);
    },
    onSuccess: (authorizeUrl) => {
      toast.message("Redirecting to X…");
      window.location.href = authorizeUrl;
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to start X connection"));
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
        x: "X disconnected",
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

      if (typeof response?.status === "string" && !isPostedResponse(response)) {
        toast.error(response.error || `Instagram post ${response.status}`);
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

      if (typeof response?.status === "string" && !isPostedResponse(response)) {
        toast.error(response.error || `Facebook post ${response.status}`);
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LinkedInPublishRequest) => LinkedInPublishApi(data),
    onSuccess: (response, data) => {
      // A text post's publish_status changes either way, so refresh the list.
      if ("generation_id" in data && data.generation_id) {
        void queryClient.invalidateQueries({ queryKey: TEXT_POSTS_KEY });
      }
      if (response?.success === false) {
        toast.error(
          response.error || response.message || "Failed to publish to LinkedIn",
        );
        return;
      }

      if (typeof response?.status === "string" && !isPostedResponse(response)) {
        toast.error(response.error || `LinkedIn post ${response.status}`);
        return;
      }
      toast.success(response?.message || "Published to LinkedIn");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to publish to LinkedIn"));
    },
  });
}

export function XPublishMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: XPublishRequest) => XPublishApi(data),
    onSuccess: () => {
      toast.success("Posted to X");
    },
    onError: (error) => {
      if (isApiNotFoundError(error)) {
        toast.error("X isn't connected. Connect X to post.");
        void queryClient.invalidateQueries({ queryKey: ["social-accounts"] });
        return;
      }
      toast.error(getApiErrorMessage(error, "Failed to post to X"));
    },
  });
}

export function CreateGoalMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGoalRequest) => CreateGoalApi(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: GOALS_KEY });
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Failed to create goal"));
    },
  });
}

export function DiagnoseGoalMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (goal_id: string) => DiagnoseGoalApi(goal_id),
    onSuccess: (_response, goal_id) => {
      void queryClient.invalidateQueries({ queryKey: GOALS_KEY });
      void queryClient.invalidateQueries({ queryKey: goalKey(goal_id) });
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Failed to diagnose goal"));
    },
  });
}

export function ApproveGoalMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (goal_id: string) => ApproveGoalApi(goal_id),
    onSuccess: (response, goal_id) => {
      queryClient.setQueryData(goalKey(goal_id), response);
      void queryClient.invalidateQueries({ queryKey: GOALS_KEY });
      toast.success("Plan approved. Fluenca is executing your goal.");
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Failed to approve plan"));
    },
  });
}

export function UpdateGoalTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateGoalTaskRequest) => UpdateGoalTaskApi(data),
    onSuccess: (_response, { goal_id, status }) => {
      void queryClient.invalidateQueries({ queryKey: goalKey(goal_id) });
      void queryClient.invalidateQueries({ queryKey: GOALS_KEY });
      if (status === "approved") toast.success("Task approved");
      if (status === "rejected") toast.success("Task rejected");
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Failed to update task"));
    },
  });
}

export function GoogleAnalyticsConnectMutation() {
  return useMutation({
    mutationFn: (context?: string) => GoogleAnalyticsConnectApi(context),
    onSuccess: ({ authorize_url }) => {
      window.location.assign(authorize_url);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not start the Google Analytics connection"));
    },
  });
}

export function GoogleAnalyticsSelectPropertyMutation() {
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
}

export function GoogleAnalyticsDisconnectMutation() {
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
}

/** Sends the browser to Google's sign-in; Google returns via the backend callback. */
export function SearchConsoleConnectMutation() {
  return useMutation({
    mutationFn: (context?: string) => SearchConsoleConnectApi(context),
    onSuccess: ({ authorize_url }) => {
      window.location.assign(authorize_url);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not start the Search Console connection"));
    },
  });
}

export function SearchConsoleSelectSiteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (siteUrl: string) => SearchConsoleSelectSiteApi(siteUrl),
    onSuccess: (connection) => {
      queryClient.setQueryData(SEARCH_CONSOLE_KEY, connection);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not choose that website"));
    },
  });
}

/** Checks whether the site's key pages are indexed; run on demand. */
export function SearchConsoleIndexCheckMutation() {
  return useMutation({
    mutationFn: () => SearchConsoleIndexCheckApi(),
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not check the index status"));
    },
  });
}

export function SearchConsoleInspectMutation() {
  return useMutation({
    mutationFn: (url: string) => SearchConsoleInspectApi(url),
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not inspect that page"));
    },
  });
}

export function SearchConsoleDisconnectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => SearchConsoleDisconnectApi(),
    onSuccess: () => {
      toast.success("Search Console disconnected");
      void queryClient.invalidateQueries({ queryKey: SEARCH_CONSOLE_KEY });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not disconnect Search Console"));
    },
  });
}

export function DeleteGoalMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (goal_id: string) => DeleteGoalApi(goal_id),
    onSuccess: (_response, goal_id) => {
      queryClient.removeQueries({ queryKey: goalKey(goal_id) });
      void queryClient.invalidateQueries({ queryKey: GOALS_KEY });
      toast.success("Goal deleted");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to delete goal"));
    },
  });
}

/** Pause or resume a goal's agent; both refresh the goal list and that goal's details. */
function useGoalStatusMutation(
  request: (goal_id: string) => Promise<unknown>,
  messages: { success: string; error: string },
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (goal_id: string) => request(goal_id),
    onSuccess: (_response, goal_id) => {
      void queryClient.invalidateQueries({ queryKey: GOALS_KEY });
      void queryClient.invalidateQueries({ queryKey: goalKey(goal_id) });
      toast.success(messages.success);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, messages.error));
    },
  });
}

export function PauseGoalMutation() {
  return useGoalStatusMutation(PauseGoalApi, {
    success: "Goal paused. Fluenca won't run new tasks until you resume it.",
    error: "Failed to pause goal",
  });
}

export function ResumeGoalMutation() {
  return useGoalStatusMutation(ResumeGoalApi, {
    success: "Goal resumed",
    error: "Failed to resume goal",
  });
}

export function CreateScheduledPostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      body,
      onProgress,
    }: {
      body: CreateScheduledPostRequest;
      onProgress?: (percent: number) => void;
    }) => CreateScheduledPostApi(body, onProgress),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: SCHEDULED_POSTS_KEY });
      toast.success("Post scheduled");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to schedule post"));
    },
  });
}

export function UpdateScheduledPostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ post_id, body }: { post_id: string; body: UpdateScheduledPostRequest }) =>
      UpdateScheduledPostApi(post_id, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: SCHEDULED_POSTS_KEY });
      toast.success("Scheduled post updated");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to update scheduled post"));
    },
  });
}

export function CancelScheduledPostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post_id: string) => CancelScheduledPostApi(post_id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: SCHEDULED_POSTS_KEY });
      toast.success("Scheduled post cancelled");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to cancel scheduled post"));
    },
  });
}

export function DeleteScheduledPostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post_id: string) => DeleteScheduledPostApi(post_id),
    onSuccess: (_response, post_id) => {
      queryClient.removeQueries({ queryKey: scheduledPostKey(post_id) });
      void queryClient.invalidateQueries({ queryKey: SCHEDULED_POSTS_KEY });
      toast.success("Scheduled post deleted");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to delete scheduled post"));
    },
  });
}

export function CreateTextPostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateTextPostRequest) => CreateTextPostApi(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: TEXT_POSTS_KEY });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to write the post"));
    },
  });
}

export function FindCompetitorMutation() {
  return useMutation({
    mutationFn: (company_id: string) => FindCompetitorApi(company_id),
    onSuccess: () => {
      toast.success("Competitor analysis started successfully");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to find competitors"));
    },
  });
}
// ---------- Prospect finder ----------

const PROSPECT_LIST_KEY = [...PROSPECTS_KEY, "list"];

/** Builds 2–3 profiles from the DNA (takes 10–40 seconds). */
export function BuildProspectIcpMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body?: BuildIcpRequest) => BuildProspectIcpApi(body),
    onSuccess: (data) => {
      queryClient.setQueryData(PROSPECT_ICP_KEY, data);
      toast.success("Your ideal customer profiles are ready");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to build customer profiles"));
    },
  });
}

/** Saves edited profiles as a new version. */
export function UpdateProspectIcpMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateIcpRequest) => UpdateProspectIcpApi(body),
    onSuccess: (data) => {
      queryClient.setQueryData(PROSPECT_ICP_KEY, data);
      toast.success("Profile saved");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to save the profile"));
    },
  });
}

/** Starts a search in the background; ProspectRunQuery polls it from there. */
export function StartProspectRunMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body?: StartProspectRunRequest) => StartProspectRunApi(body),
    onSuccess: (run) => {
      queryClient.setQueryData(prospectRunKey(run.id), run);
      void queryClient.invalidateQueries({ queryKey: PROSPECT_RUNS_KEY });
      toast.success("Search started. This can take a few minutes.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to start the search"));
    },
  });
}

/** Saves a prospect; its emails, brief and drafts are then written in the background. */
export function SaveProspectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (prospect_id: string) => SaveProspectApi(prospect_id),
    onSuccess: (_response, prospect_id) => {
      void queryClient.invalidateQueries({ queryKey: prospectKey(prospect_id) });
      void queryClient.invalidateQueries({ queryKey: PROSPECT_LIST_KEY });
      toast.success("Prospect saved. Writing the brief and drafts now.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to save the prospect"));
    },
  });
}

export function UpdateProspectStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ prospect_id, status }: { prospect_id: string; status: SettableProspectStatus }) =>
      UpdateProspectStatusApi(prospect_id, { status }),
    onSuccess: (_response, { prospect_id }) => {
      void queryClient.invalidateQueries({ queryKey: prospectKey(prospect_id) });
      void queryClient.invalidateQueries({ queryKey: PROSPECT_LIST_KEY });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to update the status"));
    },
  });
}

export function RegenerateProspectDraftsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ prospect_id, person_id }: { prospect_id: string; person_id?: string }) =>
      RegenerateProspectDraftsApi(prospect_id, person_id),
    onSuccess: (_response, { prospect_id }) => {
      void queryClient.invalidateQueries({ queryKey: prospectKey(prospect_id) });
      toast.success("Drafts rewritten");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to rewrite the drafts"));
    },
  });
}

/** Downloads the saved prospects as a CSV file. */
export function ExportProspectsCsvMutation() {
  return useMutation({
    mutationFn: () => ExportProspectsCsvApi(),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `prospects-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to export prospects"));
    },
  });
}

// ---------- LinkedIn growth ----------

export function RunProfileScoreMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body?: ProfileScoreRequest) => RunProfileScoreApi(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PROFILE_SCORE_KEY });
      toast.success("Profile scored");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to score your profile"));
    },
  });
}

/** Returns the headline and About options directly; read them from `data`. */
export function ProfileRewriteMutation() {
  return useMutation({
    mutationFn: () => ProfileRewriteApi(),
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to rewrite your headline and About"));
    },
  });
}

export function GenerateWeekPostsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => GenerateWeekPostsApi(),
    onSuccess: (data) => {
      queryClient.setQueryData(WEEK_POSTS_KEY, data);
      toast.success("Your first week of posts is ready");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to write your posts"));
    },
  });
}

/** Schedules a post, optionally with edited text. */
export function ScheduleWeekPostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ post_id, body }: { post_id: string; body: ScheduleWeekPostRequest }) =>
      ScheduleWeekPostApi(post_id, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: WEEK_POSTS_KEY });
      toast.success("Post scheduled");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to schedule the post"));
    },
  });
}

export function CancelWeekPostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post_id: string) => CancelWeekPostApi(post_id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: WEEK_POSTS_KEY });
      toast.success("Scheduled post cancelled");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to cancel the post"));
    },
  });
}

export function RunLinkedInScoreMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => RunLinkedInScoreApi(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: LINKEDIN_SCORE_KEY });
      toast.success("LinkedIn Score updated");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to update your LinkedIn Score"));
    },
  });
}

// ---------- LinkedIn coach ----------

/** Marks a task done (or undoes it); the response is the updated checklist with streak and points. */
export function ToggleCoachTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ task_id, done }: { task_id: string; done: boolean }) =>
      done ? CompleteCoachTaskApi(task_id) : UndoCoachTaskApi(task_id),
    onSuccess: (data) => {
      if (data?.tasks) queryClient.setQueryData(COACH_TODAY_KEY, data);
      else void queryClient.invalidateQueries({ queryKey: COACH_TODAY_KEY });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to update the task"));
    },
  });
}

export function AddFollowUpMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AddFollowUpRequest) => AddFollowUpApi(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: FOLLOW_UPS_KEY });
      toast.success("Follow-up added with a draft reply");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to add the follow-up"));
    },
  });
}

export function CompleteFollowUpMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (follow_up_id: string) => CompleteFollowUpApi(follow_up_id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: FOLLOW_UPS_KEY });
      void queryClient.invalidateQueries({ queryKey: COACH_TODAY_KEY });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to update the follow-up"));
    },
  });
}

/** The plan comes back on `data`. */
export function ContentPlanMutation() {
  return useMutation({
    mutationFn: (goal: ContentPlanGoal) => ContentPlanApi(goal),
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to plan next week"));
    },
  });
}

/** The slides come back on `data`. */
export function CarouselMutation() {
  return useMutation({
    mutationFn: (body: CarouselRequest) => CarouselApi(body),
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to make the carousel"));
    },
  });
}

export function PublishCarouselMutation() {
  return useMutation({
    mutationFn: (body: PublishCarouselRequest) => PublishCarouselApi(body),
    onSuccess: () => {
      toast.success("Carousel published to LinkedIn");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to publish the carousel"));
    },
  });
}

/** Saves the drafts on the server; they also come back on `data`. */
export function RepurposeMutation() {
  return useMutation({
    mutationFn: () => RepurposeApi(),
    onSuccess: () => {
      toast.success("Your top post was repurposed into 2 drafts");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to repurpose your top post"));
    },
  });
}

export function PostCheckMutation() {
  return useMutation({
    mutationFn: (body: PostCheckRequest) => PostCheckApi(body),
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to check the post"));
    },
  });
}

export function WritePostMutation() {
  return useMutation({
    mutationFn: (body: WritePostRequest) => WritePostApi(body),
    onSuccess: () => {
      toast.success("Post written and saved as a draft");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to write the post"));
    },
  });
}

