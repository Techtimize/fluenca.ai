"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import ChatInput from "@/components/dashboard/chat/chatInput";
import ChatPanel from "@/components/dashboard/chat/chatPanel";
import { useChatbot } from "@/lib/chat/use-chatbot";

const MAX_SCREEN_CONTEXT = 6000;
const MAX_CONTROLS = 150;
const CONTROL_PREFIX = "control:";

const ChatOpenContext = createContext(false);

export const useChatOpen = () => useContext(ChatOpenContext);

const plain = (text: string | null | undefined) => (text ?? "").replace(/\s+/g, " ").trim();

function screenControls(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>("a[href], button")).filter(
    (el) =>
      !el.closest("[data-chat]") &&
      !el.hasAttribute("disabled") &&
      el.getClientRects().length > 0 &&
      plain(el.getAttribute("aria-label") || el.textContent) !== "",
  );
}

function controlLabel(el: HTMLElement): string {
  const own = plain(el.getAttribute("aria-label") || el.textContent);
  const row = plain(el.closest("li, tr, article")?.textContent);
  return (row && !row.startsWith(own) ? `${own} (${row.slice(0, 60)})` : own).slice(0, 100);
}

export default function ChatShell({ children }: { children: ReactNode }) {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const pageRef = useRef<HTMLDivElement>(null);
  const runningActions = useRef(new Set<string>());
  const sentControls = useRef<HTMLElement[]>([]);
  const awaitingReply = useRef(false);
  const lastIdAtSend = useRef<string | undefined>(undefined);
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

    const last = chat.messages[chat.messages.length - 1];
    if (!awaitingReply.current || last?.role !== "assistant" || last.status === "running") return;
    if (last.id === lastIdAtSend.current) return;
    awaitingReply.current = false;
    const target = last.toolResult?.path;
    if (last.toolName !== "navigate_to_page" || typeof target !== "string") return;
    if (target.startsWith(CONTROL_PREFIX)) {
      const control = sentControls.current[Number(target.slice(CONTROL_PREFIX.length))];
      if (control?.isConnected) control.click();
    } else if (target !== pathname) {
      router.push(target);
    }
  }, [chat.messages, pathname, queryClient, router]);

  const handleSend = (text: string, imageUrl?: string) => {
    const visible = plain(pageRef.current?.innerText);
    const screenContext = `Page: ${pathname}. On the page: ${visible}`.slice(0, MAX_SCREEN_CONTEXT);
    const controls: Record<string, string> = {};
    sentControls.current = [];
    for (const el of screenControls()) {
      const label = controlLabel(el);
      if (label in controls || sentControls.current.length >= MAX_CONTROLS) continue;
      controls[label] = `${CONTROL_PREFIX}${sentControls.current.length}`;
      sentControls.current.push(el);
    }
    awaitingReply.current = true;
    lastIdAtSend.current = chat.messages[chat.messages.length - 1]?.id;
    chat.send(text, screenContext, imageUrl, controls);
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
          <div data-chat className="contents">
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
          </div>
        ) : null}
      </div>

      {!chatOpen ? (
        <div data-chat className="contents">
          <ChatInput onOpen={() => setChatOpen(true)} onSend={handleSend} placeholder={t("chatPlaceholder")} />
        </div>
      ) : null}
    </ChatOpenContext.Provider>
  );
}
