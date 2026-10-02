import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SendMessageApi } from "./chatbot.routes";
import { CHAT_HISTORY_KEY } from "./Chatbot-Query";
import type { SendMessageDoneEvent } from "@/types/chat";

type SendMessageVariables = {
  message: string;
  onChunk: (text: string) => void;
  onDone: (event: SendMessageDoneEvent) => void;
};

export const SendMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ message, onChunk, onDone }: SendMessageVariables) =>
      SendMessageApi(message, { onChunk, onDone }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_HISTORY_KEY });
    },
    onError: (error: Error) => {
      toast("The assistant is unavailable", { description: error.message });
    },
  });
};
