export type ChatRole = "user" | "assistant";

export type ChatMessageStatus = "done" | "running" | "failed";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  status?: ChatMessageStatus;
  toolName?: string | null;
  toolResult?: Record<string, unknown> | null;
  errorMessage?: string | null;
};

export type ChatMessageResponse = {
  message_id: string;
  role: ChatRole;
  content: string;
  tool_name: string | null;
  status: ChatMessageStatus;
  tool_result: Record<string, unknown> | null;
  error_message: string | null;
  created_at: string;
};

export type ChatHistoryResponse = {
  messages: ChatMessageResponse[];
};

export type SendMessageDoneEvent = {
  message_id: string;
  status: ChatMessageStatus;
  tool_name: string | null;
};
