"use client";

import { useState } from "react";
import AnalyticsSection from "@/components/dashboard/cards/analyticsSection";
import ChatInput from "@/components/dashboard/chat/chatInput";
import ChatPanel from "@/components/dashboard/chat/chatPanel";
import CompanyCard from "@/components/dashboard/cards/companyCard";
import DocumentationCard from "@/components/dashboard/documentationCard";
import SidebarRail from "@/components/dashboard/sidebarRail";
import TopBar from "@/components/dashboard/topBar";
import { MOCK_DASHBOARD } from "@/lib/mock/dashboard";
import type { ChatMessage } from "@/types/chat";
import type { Device } from "@/types/dashboard";

export default function DashboardPage() {
  const data = MOCK_DASHBOARD;

  const [source, setSource] = useState(data.analytics.sources[0]);
  const [device, setDevice] = useState<Device>("mobile");

  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleSend = (text: string) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: text }]);
    setChatOpen(true);
    // TODO: call the assistant API here, then append a { role: "assistant" } message
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,#E4E8FF_0%,#FFFFFF_50%)]">
      <SidebarRail /* onLogout={...} */ />

      <div
        className={`px-4 pt-4 sm:px-6 md:pl-24 lg:pr-8 ${
          chatOpen ? "pb-4 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-4" : "pb-32"
        }`}
      >
        <main className="min-w-0">
          <TopBar user={data.user} />
          <div className={`grid gap-4 ${chatOpen ? "" : "lg:grid-cols-[minmax(0,1fr)_360px]"}`}>
            <CompanyCard company={data.company} />
            <DocumentationCard items={data.docs} />
          </div>

          <AnalyticsSection
            data={data.analytics}
            source={source}
            device={device}
            compact={chatOpen}
            onSourceChange={setSource}
            onDeviceChange={setDevice}
            onConnectIntegration={(id) => console.log("TODO: start connect flow for", id)}
          />
        </main>

        {chatOpen && (
          <ChatPanel
            messages={messages}
            onSend={handleSend}
            onClose={() => setChatOpen(false)}
            onReset={() => setMessages([])}
          />
        )}
      </div>

      {!chatOpen && <ChatInput onOpen={() => setChatOpen(true)} onSend={handleSend} />}
    </div>
  );
}