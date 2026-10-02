import { useQuery } from "@tanstack/react-query";
import { ListConversationsApi } from "./chatbot.routes";

export const CONVERSATIONS_KEY = ["chat-conversations"];

export const ConversationsQuery = (enabled = true) => {
  return useQuery({
    queryKey: CONVERSATIONS_KEY,
    queryFn: () => ListConversationsApi(),
    enabled,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
