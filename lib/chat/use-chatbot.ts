"use client";

import { useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DecideActionApi } from "@/routes/chatbot/chatbot.routes";
import { useSessionValue } from "@/lib/chat/chat-session-store";
import { mapChatHistory } from "@/lib/chat/map-chat-messages";
import type { ChatMessage, ChatMode } from "@/types/chat";
import { ChatHistoryQuery } from "@/routes/bussiness/Bussiness-Query";
import { SendMessageMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { ConversationsQuery } from "@/routes/chatbot/Chatbot-Query";

const PENDING_USER_ID = "pending-user";
const STREAMING_ASSISTANT_ID = "streaming-assistant";

type LiveTurn = {
  userId: string | null;
  assistantId: string | null;
  userText: string;
  imageUrl?: string;
  text: string;
};

function mergeLiveTurn(history: ChatMessage[], live: LiveTurn | null): ChatMessage[] {
  if (!live) return history;
  const savedUser = live.userId ? history.find((m) => m.id === live.userId) : undefined;
  const savedReply = live.assistantId ? history.find((m) => m.id === live.assistantId) : undefined;
  const replyDone = savedReply !== undefined && savedReply.status !== "running";
  const merged = history.filter((m) => m.id !== live.assistantId || replyDone);
  if (!savedUser) {
    merged.push({ id: live.userId ?? PENDING_USER_ID, role: "user", content: live.userText, imageUrl: live.imageUrl });
  }
  if (!replyDone && live.text) {
    merged.push({ id: live.assistantId ?? STREAMING_ASSISTANT_ID, role: "assistant", content: live.text, status: "running" });
  }
  return merged;
}
const CONVERSATION_KEY = "fluenca-chat-conversation";

export const useChatbot = (enabled = true) => {
  const [activeConversationId, setActiveConversationId] = useSessionValue(CONVERSATION_KEY);

  const conversations = ConversationsQuery(enabled);
  const { data, isLoading, isError } = ChatHistoryQuery(activeConversationId, enabled);
  const sendMessage = SendMessageMutation();

  const [live, setLive] = useState<LiveTurn | null>(null);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [mode, setMode] = useState<ChatMode>("action");
  const streamedRef = useRef("");

  const history = useMemo(() => mapChatHistory(data?.messages), [data?.messages]);

  const messages = useMemo(() => mergeLiveTurn(history, live), [history, live]);

  const selectConversation = (conversationId: string | null) => {
    setLive(null);
    setActiveConversationId(conversationId);
  };

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
    setLive({ userId: null, assistantId: null, userText: text, imageUrl, text: "" });
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
        onStart: (ids) => {
          setLive((turn) => (turn ? { ...turn, userId: ids.user_message_id, assistantId: ids.message_id } : turn));
          if (ids.conversation_id !== activeConversationId) setActiveConversationId(ids.conversation_id);
        },
        onStep: (label) => setCurrentStep(label),
        onChunk: (chunk) => {
          streamedRef.current += chunk;
          const textSoFar = streamedRef.current;
          setLive((turn) => (turn ? { ...turn, text: textSoFar } : turn));
        },
        onReset: (full) => {
          streamedRef.current = full;
          setLive((turn) => (turn ? { ...turn, text: full } : turn));
        },
        onDone: (event) => {
          if (event.conversation_id && event.conversation_id !== activeConversationId) {
            setActiveConversationId(event.conversation_id);
          }
        },
      },
      {
        onSettled: () => {
          setCurrentStep(null);
          setLive((turn) => (turn?.assistantId ? turn : null));
        },
      },
    );
  };

  const startNewConversation = () => {
    if (sendMessage.isPending) return;
    selectConversation(null);
  };

  const isAwaitingReply = sendMessage.isPending && !live?.text;
  const isToolRunning = history.some((m) => m.status === "running");

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
    setActiveConversationId: selectConversation,
    startNewConversation,
  };
};
