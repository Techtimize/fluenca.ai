"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import AnalyticsSection from "@/components/dashboard/cards/analyticsSection";
import ChatInput from "@/components/dashboard/chat/chatInput";
import ChatPanel from "@/components/dashboard/chat/chatPanel";
import CompanyCard from "@/components/dashboard/cards/companyCard";
import DocumentationCard from "@/components/dashboard/documentationCard";
import TopBar from "@/components/dashboard/topBar";
import { mapDashboard } from "@/lib/dashboard/map-dashboard";
import { useChatbot } from "@/lib/chat/use-chatbot";
import { MOCK_DASHBOARD } from "@/lib/mock/dashboard";
import { AnalyzeCompanyDashboardQuery } from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";
import type { AnalyticsData, Device } from "@/types/dashboard";

// Used until the dashboard API responds: mock data on the first tab, empty states on the rest.
const MOCK_CHANNELS: Record<string, AnalyticsData> = Object.fromEntries(
  MOCK_DASHBOARD.analyticsSources.map((s, index) => [
    s.id,
    index === 0 ? MOCK_DASHBOARD.analytics : { ...MOCK_DASHBOARD.analytics, emptyMessage: `${s.label} has not been analyzed yet.` },
  ]),
);

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const companyId = useAuthStore((s) => s.company_id);
  const companyName = useAuthStore((s) => s.company_name);

  const { data: dashboard, isError, error } = AnalyzeCompanyDashboardQuery(companyId);

  const mapped = useMemo(() => (dashboard?.data ? mapDashboard(dashboard) : null), [dashboard]);

  const company = mapped?.company ?? MOCK_DASHBOARD.company;
  const profile = mapped?.profile;
  const docs = mapped?.docs.length ? mapped.docs : MOCK_DASHBOARD.docs;
  const sources = mapped?.sources.length ? mapped.sources : MOCK_DASHBOARD.analyticsSources;
  const channels = mapped?.sources.length ? mapped.channels : MOCK_CHANNELS;
  const defaultSource = mapped?.defaultSource || sources[0]?.id || "";

  const user = {
    name: companyName || mapped?.company.name || MOCK_DASHBOARD.user.name,
  };

  // null means "use the channel the backend marks as default".
  const [selectedSource, setSource] = useState<string | null>(null);
  const source = selectedSource && channels[selectedSource] ? selectedSource : defaultSource;
  const analytics = channels[source] ?? MOCK_DASHBOARD.analytics;
  const sourceLabel = sources.find((s) => s.id === source)?.label ?? source;
  const [device, setDevice] = useState<Device>("mobile");
  const [chatOpen, setChatOpen] = useState(false);
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
  } = useChatbot();

  const screenContext = useMemo(() => {
    const bits = [`Page: Dashboard`, `Company: ${company.name}`, `Analytics source tab: ${sourceLabel} (${device})`];
    if (analytics.metrics.length) {
      bits.push(
        `Visible metric scores: ${analytics.metrics.map((m) => `${m.label} ${m.score}`).join(", ")}`,
      );
    }
    return bits.join(". ");
  }, [company.name, sourceLabel, device, analytics.metrics]);

  const handleSend = (text: string, imageUrl?: string) => {
    send(text, screenContext, imageUrl);
    setChatOpen(true);
  };

  return (
    <>
      <div
        className={
          chatOpen
            ? "pb-4 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-4"
            : "pb-32"
        }
      >
        <main className="min-w-0 space-y-4">
          <TopBar user={user} />
          {isError ? (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
              {error instanceof Error ? error.message : t("error")}
            </div>
          ) : null}

          <div className={`grid gap-4 ${chatOpen ? "" : "xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]"}`}>
            <CompanyCard company={company} profile={profile} />
            {!chatOpen ? <DocumentationCard items={docs} goalLabel={t("setYourGoal")} /> : null}
          </div>

          <AnalyticsSection
            data={analytics}
            sources={sources}
            source={source}
            device={device}
            compact={chatOpen}
            onSourceChange={setSource}
            onDeviceChange={setDevice}
          />
        </main>

        {chatOpen ? (
          <ChatPanel
            messages={messages}
            onSend={handleSend}
            onClose={() => setChatOpen(false)}
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
        ) : null}
      </div>

      {!chatOpen ? (
        <ChatInput onOpen={() => setChatOpen(true)} onSend={handleSend} placeholder={t("chatPlaceholder")} />
      ) : null}
    </>
  );
}
