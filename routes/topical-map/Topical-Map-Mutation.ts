import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "@/errors/error-utils";
import type { AddTopicRequest, UpdateTopicRequest } from "@/types/bussiness/topical-map-type";
import {
  AddTopicApi,
  ApproveTopicalMapApi,
  DeleteTopicApi,
  RetryTopicalMapApi,
  UpdateTopicApi,
} from "./topical-map.routes";
import { TOPICAL_MAP_KEY } from "./Topical-Map-Query";

export const AddTopicMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddTopicRequest) => AddTopicApi(data),
    onSuccess: (response) => {
      queryClient.setQueryData(TOPICAL_MAP_KEY, response);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to add topic"));
    },
  });
};

export const UpdateTopicMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ topicId, data }: { topicId: string; data: UpdateTopicRequest }) =>
      UpdateTopicApi(topicId, data),
    onSuccess: (response) => {
      queryClient.setQueryData(TOPICAL_MAP_KEY, response);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to update topic"));
    },
  });
};

export const DeleteTopicMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (topicId: string) => DeleteTopicApi(topicId),
    onSuccess: (response) => {
      queryClient.setQueryData(TOPICAL_MAP_KEY, response);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to delete topic"));
    },
  });
};

export const ApproveTopicalMapMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => ApproveTopicalMapApi(),
    onSuccess: (response) => {
      queryClient.setQueryData(TOPICAL_MAP_KEY, response);
      void queryClient.invalidateQueries({ queryKey: ["keywords"] });
      toast.success("Topical map approved. Keyword research has started; your blog briefs will be ready in a few minutes.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to approve topical map"));
    },
  });
};

export const RetryTopicalMapMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => RetryTopicalMapApi(),
    onSuccess: (response) => {
      queryClient.setQueryData(TOPICAL_MAP_KEY, response);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to rebuild topical map"));
    },
  });
};
