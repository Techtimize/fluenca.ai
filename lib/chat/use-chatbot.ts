"use client";

import { useMemo, useRef, useState } from "react";
import { mapChatHistory } from "@/lib/chat/map-chat-messages";
import type { ChatMessage, ChatMode } from "@/types/chat";
import { ChatHistoryQuery } from "@/routes/bussiness/Bussiness-Query";
import { SendMessageMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { ConversationsQuery } from "@/routes/chatbot/Chatbot-Query";

const PENDING_USER_ID = "pending-user";
const STREAMING_ASSISTANT_ID = "streaming-assistant";

export const useChatbot = (enabled = true) => {
  // null: no conversation picked yet — "New chat" state, nothing is sent to the
  // backend until the first message, which creates one and this gets set to its id.
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const conversations = ConversationsQuery(enabled);
  const { data, isLoading, isError } = ChatHistoryQuery(activeConversationId, enabled);
  const sendMessage = SendMessageMutation();

  const [pendingUserText, setPendingUserText] = useState<string | null>(null);
  const [pendingImageUrl, setPendingImageUrl] = useState<string | undefined>(undefined);
  const [streamingText, setStreamingText] = useState("");
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

  const send = (text: string, screenContext?: string, imageUrl?: string) => {
    if (sendMessage.isPending) return;

    streamedRef.current = "";
    setPendingUserText(text);
    setPendingImageUrl(imageUrl);
    setStreamingText("");

    sendMessage.mutate(
      {
        message: text,
        conversationId: activeConversationId ?? undefined,
        screenContext,
        imageUrl,
        mode,
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
    mode,
    setMode,
    conversations: conversations.data ?? [],
    activeConversationId,
    setActiveConversationId,
    startNewConversation,
  };
};
