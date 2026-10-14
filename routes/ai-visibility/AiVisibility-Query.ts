import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/errors/error-utils";
import {
  AiVisibilityCheckApi,
  AiVisibilityGapPostApi,
  AiVisibilityOverviewApi,
  AiVisibilityQuestionsApi,
  AiVisibilityRefreshQuestionsApi,
  AiVisibilityRunApi,
  AiVisibilitySettingsApi,
  type AiVisibilityOverview,
} from "./ai-visibility.routes";

export const AI_VISIBILITY_KEY = ["ai-visibility"];
const POLL_MS = 5000;

export const AiVisibilityQuery = () =>
  useQuery({
    queryKey: AI_VISIBILITY_KEY,
    queryFn: AiVisibilityOverviewApi,
    refetchInterval: (query) => (query.state.data?.active ? POLL_MS : false),
    refetchOnWindowFocus: false,
  });

export const AiVisibilityRunQuery = (runId: string | null) =>
  useQuery({
    queryKey: ["ai-visibility-run", runId],
    queryFn: () => AiVisibilityRunApi(runId as string),
    enabled: Boolean(runId),
    staleTime: Infinity,
  });

const useOverviewMutation = <T,>(fn: (input: T) => Promise<AiVisibilityOverview>, fallback: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: (overview) => queryClient.setQueryData(AI_VISIBILITY_KEY, overview),
    onError: (error) => toast.error(getApiErrorMessage(error, fallback)),
  });
};

export const AiVisibilityCheckMutation = () =>
  useOverviewMutation<void>(() => AiVisibilityCheckApi(), "Could not start the check");

export const AiVisibilitySettingsMutation = () =>
  useOverviewMutation(AiVisibilitySettingsApi, "Could not save the setting");

export const AiVisibilityQuestionsMutation = () =>
  useOverviewMutation(AiVisibilityQuestionsApi, "Could not save the questions");

export const AiVisibilityRefreshQuestionsMutation = () =>
  useOverviewMutation<void>(() => AiVisibilityRefreshQuestionsApi(), "Could not refresh the questions");

export const AiVisibilityGapPostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AiVisibilityGapPostApi,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blog-posts"] }),
    onError: (error) => toast.error(getApiErrorMessage(error, "Could not start the blog post")),
  });
};
