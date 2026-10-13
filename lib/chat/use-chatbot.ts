"use client";

import { useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DecideActionApi } from "@/routes/chatbot/chatbot.routes";
import { mapChatHistory } from "@/lib/chat/map-chat-messages";
import type { ChatMessage, ChatMode } from "@/types/chat";
import { ChatHistoryQuery } from "@/routes/bussiness/Bussiness-Query";
import { SendMessageMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { ConversationsQuery } from "@/routes/chatbot/Chatbot-Query";

const PENDING_USER_ID = "pending-user";
const STREAMING_ASSISTANT_ID = "streaming-assistant";

export const useChatbot = (enabled = true) => {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const conversations = ConversationsQuery(enabled);
  const { data, isLoading, isError } = ChatHistoryQuery(activeConversationId, enabled);
  const sendMessage = SendMessageMutation();

  const [pendingUserText, setPendingUserText] = useState<string | null>(null);
  const [pendingImageUrl, setPendingImageUrl] = useState<string | undefined>(undefined);
  const [streamingText, setStreamingText] = useState("");
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [mode, setMode] = useState<ChatMode>("action");
  const streamedRef = useRef("");

  const history = useMemo(() => mapChatHistory(data?.messages), [data?.messages]);

  const messages = useMemo(() => {
    const live: ChatMessage[] = [...history];

    if (pendingUserText !== null) {
      live.push({
        id: PENDING_USER_ID,
        role: "user",
        content: pendingUserText,
        imageUrl: pendingImageUrl,
      });
    }
    if (streamingText) {
      live.push({
        id: STREAMING_ASSISTANT_ID,
        role: "assistant",
        content: streamingText,
        status: "running",
      });
    }

    return live;
  }, [history, pendingUserText, pendingImageUrl, streamingText]);

  const queryClient = useQueryClient();
  const decide = useMutation({
    mutationFn: ({ messageId, confirm }: { messageId: string; confirm: boolean }) => DecideActionApi(messageId, confirm),
    onSettled: () => queryClient.invalidateQueries(),
    onError: () => toast.error("That action could not be completed."),
  });

  const send = (
    text: string,
    screenContext?: string,
    imageUrl?: string,
    pages?: Record<string, string>,
    pagePath?: string,
  ) => {
    if (sendMessage.isPending) return;

    streamedRef.current = "";
    setPendingUserText(text);
    setPendingImageUrl(imageUrl);
    setStreamingText("");
    setCurrentStep(null);

    sendMessage.mutate(
      {
        message: text,
        conversationId: activeConversationId ?? undefined,
        screenContext,
        imageUrl,
        mode,
        pages,
        pagePath,
        onStep: (label) => setCurrentStep(label),
        onChunk: (chunk) => {
          streamedRef.current += chunk;
          setStreamingText(streamedRef.current);
        },
        onDone: (event) => {
          streamedRef.current = "";
          if (event.conversation_id && event.conversation_id !== activeConversationId) {
            setActiveConversationId(event.conversation_id);
          }
        },
      },
      {
        onSettled: () => {
          setPendingUserText(null);
          setPendingImageUrl(undefined);
          setStreamingText("");
          setCurrentStep(null);
        },
      },
    );
  };

  const startNewConversation = () => {
    if (sendMessage.isPending) return;
    setActiveConversationId(null);
    setPendingUserText(null);
    setPendingImageUrl(undefined);
    setStreamingText("");
  };

  const isAwaitingReply = sendMessage.isPending && !streamingText;
  const isToolRunning = history[history.length - 1]?.status === "running";

  return {
    messages,
    send,
    isLoading,
    isError,
    isSending: sendMessage.isPending,
    isAwaitingReply,
    isToolRunning,
    currentStep,
    decideAction: (messageId: string, confirm: boolean) => decide.mutate({ messageId, confirm }),
    isDeciding: decide.isPending,
    mode,
    setMode,
    conversations: conversations.data ?? [],
    activeConversationId,
    setActiveConversationId,
    startNewConversation,
  };
};
