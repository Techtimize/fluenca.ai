"use client";

import { useMemo, useRef, useState } from "react";
import { mapChatHistory } from "@/lib/chat/map-chat-messages";
import type { ChatMessage } from "@/types/chat";
import { ChatHistoryQuery } from "@/routes/bussiness/Bussiness-Query";
import { SendMessageMutation } from "@/routes/bussiness/Bussiness-Mutation";

const PENDING_USER_ID = "pending-user";
const STREAMING_ASSISTANT_ID = "streaming-assistant";

export const useChatbot = (enabled = true) => {
  const { data, isLoading, isError } = ChatHistoryQuery(enabled);
  const sendMessage = SendMessageMutation();

  const [pendingUserText, setPendingUserText] = useState<string | null>(null);
  const [pendingImageUrl, setPendingImageUrl] = useState<string | undefined>(undefined);
  const [streamingText, setStreamingText] = useState("");
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
        screenContext,
        imageUrl,
        onChunk: (chunk) => {
          streamedRef.current += chunk;
          setStreamingText(streamedRef.current);
        },
        onDone: () => {
          streamedRef.current = "";
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
  };
};
