"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import ChatInput from "@/components/dashboard/chat/chatInput";
import ChatPanel from "@/components/dashboard/chat/chatPanel";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { useChatbot } from "@/lib/chat/use-chatbot";

const PAGE_NAMES: [string, string][] = [
  [PAGE_ROUTES.COMPANY_OVERVIEW, "Company overview"],
  [PAGE_ROUTES.TRENDS, "Trends"],
  [PAGE_ROUTES.DNA, "Company DNA"],
  [PAGE_ROUTES.CONTENT_RECOMMENDATION, "Content recommendation"],
  [PAGE_ROUTES.COMPETITOR_ANALYSIS, "Competitor analysis"],
  [PAGE_ROUTES.COMPETITORS, "Competitors"],
  [PAGE_ROUTES.SCRIPT, "Script"],
  [PAGE_ROUTES.CONTENT, "Content"],
  [PAGE_ROUTES.BLOGS, "Blogs"],
  [PAGE_ROUTES.CALENDAR, "Calendar"],
];

function pageName(pathname: string) {
  const match = PAGE_NAMES.find(([href]) => pathname === href || pathname.startsWith(`${href}/`));
  return match?.[1] ?? "Dashboard";
}

export default function PageChatbot() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const {
    messages,
    send,
    isSending,
    isAwaitingReply,
    isToolRunning,
    mode,
    setMode,
    conversations,
    activeConversationId,
    setActiveConversationId,
    startNewConversation,
  } = useChatbot(open);

  if (pathname === PAGE_ROUTES.DASHBOARD) return null;

  const screenContext = `Page: ${pageName(pathname)}. Path: ${pathname}`;

  const handleSend = (text: string) => {
    send(text, screenContext);
    setOpen(true);
  };

  if (!open) {
    return <ChatInput onOpen={() => setOpen(true)} onSend={handleSend} />;
  }

  return (
    <div className="lg:fixed lg:bottom-4 lg:right-4 lg:top-4 lg:z-40 lg:w-[380px]">
      <ChatPanel
        messages={messages}
        onSend={handleSend}
        onClose={() => setOpen(false)}
        isSending={isSending}
        isAwaitingReply={isAwaitingReply}
        isToolRunning={isToolRunning}
        mode={mode}
        onModeChange={setMode}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        onReset={startNewConversation}
      />
    </div>
  );
}
