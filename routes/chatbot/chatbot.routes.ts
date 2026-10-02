import { clearAuthTokenProvider, getAuthTokenProvider } from "@/provider/auth-provider";
import { PAGE_ROUTES } from "@/constant/page-routes";
import api from "@/routes/apiClient";
import { BUSSINESSENDPOINT } from "@/routes/bussiness/Bussiness-Endpoint";
import type { ChatHistoryResponse, SendMessageDoneEvent } from "@/types/chat";

export const ChatHistoryApi = async (): Promise<ChatHistoryResponse> => {
  const response = await api.get<ChatHistoryResponse>(BUSSINESSENDPOINT.MESSAGES);
  return response.data;
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

export const SendMessageApi = async (message: string, handlers: StreamHandlers): Promise<void> => {
  const token = getAuthTokenProvider();

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${BUSSINESSENDPOINT.MESSAGES}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ message }),
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
