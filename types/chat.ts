export type ChatRole = "user" | "assistant";

export type ChatMode = "discussion" | "action";

export type ChatMessageStatus = "done" | "running" | "failed";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  status?: ChatMessageStatus;
  toolName?: string | null;
  toolResult?: Record<string, unknown> | null;
  errorMessage?: string | null;
  imageUrl?: string | null;
};

export type ChatMessageResponse = {
  message_id: string;
  role: ChatRole;
  content: string;
  tool_name: string | null;
  status: ChatMessageStatus;
  tool_result: Record<string, unknown> | null;
  error_message: string | null;
  image_url: string | null;
  created_at: string;
};

export type ChatHistoryResponse = {
  messages: ChatMessageResponse[];
};

export type SendMessageDoneEvent = {
  message_id: string | null;
  conversation_id: string | null;
  status: ChatMessageStatus;
  tool_name: string | null;
};

export type Conversation = {
  id: string;
  title: string;
  lastMessageAt: string;
  createdAt: string;
};

export type ConversationResponse = {
  conversation_id: string;
  title: string;
  last_message_at: string;
  created_at: string;
};

export type ConversationListResponse = {
  conversations: ConversationResponse[];
};
