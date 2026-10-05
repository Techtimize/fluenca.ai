import type { ChatMessage, ChatMessageResponse } from "@/types/chat";

export const mapChatMessage = (message: ChatMessageResponse): ChatMessage => ({
  id: message.message_id,
  role: message.role,
  content: message.content,
  status: message.status,
  toolName: message.tool_name,
  toolResult: message.tool_result,
  errorMessage: message.error_message,
  imageUrl: message.image_url,
});

export const mapChatHistory = (messages: ChatMessageResponse[] = []): ChatMessage[] =>
  messages.map(mapChatMessage);
