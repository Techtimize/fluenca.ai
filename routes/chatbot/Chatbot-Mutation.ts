import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateConversationApi, RenameConversationApi, UploadAttachmentApi } from "./chatbot.routes";
import { CONVERSATIONS_KEY } from "./Chatbot-Query";
import { getApiErrorMessage } from "@/errors/error-utils";

export function UploadAttachmentMutation() {
  return useMutation({
    mutationFn: (file: File) => UploadAttachmentApi(file),
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not upload the image"));
    },
  });
}

export function CreateConversationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => CreateConversationApi(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not start a new chat"));
    },
  });
}

export function RenameConversationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, title }: { conversationId: string; title: string }) =>
      RenameConversationApi(conversationId, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not rename the chat"));
    },
  });
}
