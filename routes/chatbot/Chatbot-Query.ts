import { useQuery } from "@tanstack/react-query";
import { ChatHistoryApi } from "./chatbot.routes";

export const CHAT_HISTORY_KEY = ["chat-history"];

export const ChatHistoryQuery = (enabled = true) => {
  return useQuery({
    queryKey: CHAT_HISTORY_KEY,
    queryFn: () => ChatHistoryApi(),
    enabled,
    refetchInterval: (query) => {
      const messages = query.state.data?.messages ?? [];
      const last = messages[messages.length - 1];
      return last?.status === "running" ? 3000 : false;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
