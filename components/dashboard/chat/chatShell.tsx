"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import ChatInput from "@/components/dashboard/chat/chatInput";
import ChatPanel from "@/components/dashboard/chat/chatPanel";
import { DEFAULT_NAV } from "@/components/dashboard/sidebarRail";
import { useChatbot } from "@/lib/chat/use-chatbot";

const MAX_SCREEN_CONTEXT = 6000;
const APP_PAGES = Object.fromEntries(DEFAULT_NAV.map((item) => [item.label, item.href]));

const ChatOpenContext = createContext(false);

export const useChatOpen = () => useContext(ChatOpenContext);

export default function ChatShell({ children }: { children: ReactNode }) {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const pageRef = useRef<HTMLDivElement>(null);
  const runningActions = useRef(new Set<string>());
  const [chatOpen, setChatOpen] = useState(false);
  const chat = useChatbot();

  useEffect(() => {
    for (const m of chat.messages) {
      if (!m.toolName) continue;
      if (m.status === "running") {
        runningActions.current.add(m.id);
        continue;
      }
      if (!runningActions.current.delete(m.id)) continue;
      queryClient.invalidateQueries();
      const path = m.toolResult?.path;
      if (m.status === "done" && typeof path === "string" && path !== pathname) router.push(path);
    }
  }, [chat.messages, pathname, queryClient, router]);

  const handleSend = (text: string, imageUrl?: string) => {
    const visible = pageRef.current?.innerText.replace(/\s+/g, " ").trim() ?? "";
    const screenContext = `Page: ${pathname}. On the page: ${visible}`.slice(0, MAX_SCREEN_CONTEXT);
    chat.send(text, screenContext, imageUrl, APP_PAGES);
    setChatOpen(true);
  };

  return (
    <ChatOpenContext.Provider value={chatOpen}>
      <div
        className={
          chatOpen ? "pb-4 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-4" : "pb-32"
        }
      >
        <div ref={pageRef} className="min-w-0">
          {children}
        </div>

        {chatOpen ? (
          <ChatPanel
            messages={chat.messages}
            onSend={handleSend}
            onClose={() => setChatOpen(false)}
            isSending={chat.isSending}
            isAwaitingReply={chat.isAwaitingReply}
            isToolRunning={chat.isToolRunning}
            mode={chat.mode}
            onModeChange={chat.setMode}
            conversations={chat.conversations}
            activeConversationId={chat.activeConversationId}
            onSelectConversation={chat.setActiveConversationId}
            onReset={chat.startNewConversation}
          />
        ) : null}
      </div>

      {!chatOpen ? (
        <ChatInput onOpen={() => setChatOpen(true)} onSend={handleSend} placeholder={t("chatPlaceholder")} />
      ) : null}
    </ChatOpenContext.Provider>
  );
}
