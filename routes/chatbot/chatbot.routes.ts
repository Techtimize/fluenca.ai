import { clearAuthTokenProvider, getAuthTokenProvider } from "@/provider/auth-provider";
import { PAGE_ROUTES } from "@/constant/page-routes";
import api from "@/routes/apiClient";
import { BUSSINESSENDPOINT } from "@/routes/bussiness/Bussiness-Endpoint";
import type {
  ChatHistoryResponse,
  ChatMode,
  Conversation,
  ConversationListResponse,
  ConversationResponse,
  SendMessageDoneEvent,
} from "@/types/chat";

const mapConversation = (c: ConversationResponse): Conversation => ({
  id: c.conversation_id,
  title: c.title,
  lastMessageAt: c.last_message_at,
  createdAt: c.created_at,
});

export const ListConversationsApi = async (): Promise<Conversation[]> => {
  const response = await api.get<ConversationListResponse>(BUSSINESSENDPOINT.CONVERSATIONS);
  return response.data.conversations.map(mapConversation);
};

export const CreateConversationApi = async (): Promise<Conversation> => {
  const response = await api.post<ConversationResponse>(BUSSINESSENDPOINT.CONVERSATIONS);
  return mapConversation(response.data);
};

export const RenameConversationApi = async (conversationId: string, title: string): Promise<Conversation> => {
  const response = await api.patch<ConversationResponse>(
    BUSSINESSENDPOINT.conversation(conversationId),
    { title },
  );
  return mapConversation(response.data);
};

export const ChatHistoryApi = async (conversationId: string): Promise<ChatHistoryResponse> => {
  const response = await api.get<ChatHistoryResponse>(BUSSINESSENDPOINT.conversationMessages(conversationId));
  return response.data;
};

export const UploadAttachmentApi = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post<{ url: string }>(BUSSINESSENDPOINT.ATTACHMENTS, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.url;
};

type StreamHandlers = {
  onChunk: (text: string) => void;
  onDone: (event: SendMessageDoneEvent) => void;
};

const parseEvent = (block: string) => {
  let name = "message";
  const dataLines: string[] = [];

  for (const line of block.split("\n")) {
    if (line.startsWith("event:")) name = line.slice(6).trim();
    else if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
  }

  if (!dataLines.length) return null;

  try {
    return { name, data: JSON.parse(dataLines.join("\n")) };
  } catch {
    return null;
  }
};

type SendMessageOptions = {
  conversationId?: string;
  screenContext?: string;
  imageUrl?: string;
  mode?: ChatMode;
};

export const SendMessageApi = async (
  message: string,
  handlers: StreamHandlers,
  options: SendMessageOptions = {},
): Promise<void> => {
  const token = getAuthTokenProvider();

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${BUSSINESSENDPOINT.MESSAGES}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      message,
      conversation_id: options.conversationId || undefined,
      screen_context: options.screenContext || undefined,
      image_url: options.imageUrl || undefined,
      mode: options.mode,
    }),
  });

  if (response.status === 401) {
    clearAuthTokenProvider();
    window.location.href = PAGE_ROUTES.LOGIN;
    throw new Error("Unauthorized access");
  }

  if (response.status === 403) {
    const body = await response.json().catch(() => null);
    if (body?.code === "account_suspended") {
      clearAuthTokenProvider();
      window.location.href = PAGE_ROUTES.LOGIN;
      throw new Error("This account has been suspended. Please contact support.");
    }
  }

  if (!response.ok || !response.body) {
    throw new Error(`The assistant could not be reached (${response.status})`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split("\n\n");
    buffer = blocks.pop() ?? "";

    for (const block of blocks) {
      const event = parseEvent(block);
      if (!event) continue;
      if (event.name === "chunk") handlers.onChunk(event.data.text ?? "");
      else if (event.name === "done") handlers.onDone(event.data as SendMessageDoneEvent);
    }
  }
};
