"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import AnalyticsSection from "@/components/dashboard/cards/analyticsSection";
import ChatInput from "@/components/dashboard/chat/chatInput";
import ChatPanel from "@/components/dashboard/chat/chatPanel";
import CompanyCard from "@/components/dashboard/cards/companyCard";
import DocumentationCard from "@/components/dashboard/documentationCard";
import TopBar from "@/components/dashboard/topBar";
import { mapAnalyzeCompanyToDashboard } from "@/lib/dashboard/map-analyze-company";
import { useChatbot } from "@/lib/chat/use-chatbot";
import { MOCK_DASHBOARD } from "@/lib/mock/dashboard";
import { AnalyzeCompanyResultsQuery } from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";
import type { Device } from "@/types/dashboard";
import type { AnalyzeCompanyResultsResponse } from "@/types/bussiness/analyzecompany-type";
import { stripMarkdown } from "@/utils/text-utils";

const DOC_ORDER = ["company", "marketing", "pain", "competitors"] as const;

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const companyId = useAuthStore((s) => s.company_id);
  const companyName = useAuthStore((s) => s.company_name);

  const {
    data: analyzeResults,
    isError,
    error,
  } = AnalyzeCompanyResultsQuery(companyId);

  const mapped = useMemo(() => {
    const payload = analyzeResults as AnalyzeCompanyResultsResponse | AnalyzeCompanyResultsResponse["result"] | undefined;
    if (!payload) return null;
    const analysis =
      payload && typeof payload === "object" && "result" in payload
        ? (payload as AnalyzeCompanyResultsResponse).result
        : (payload as AnalyzeCompanyResultsResponse["result"]);
    return analysis ? mapAnalyzeCompanyToDashboard(analysis) : null;
  }, [analyzeResults]);

  const result = (analyzeResults as AnalyzeCompanyResultsResponse | undefined)?.result;
  const summaryText = result?.company_summary?.summary_text;

  const company = mapped?.company
    ? {
        ...mapped.company,
        description: summaryText ? stripMarkdown(summaryText) : mapped.company.description,
      }
    : MOCK_DASHBOARD.company;

  const docSource = mapped?.docs?.length ? mapped.docs : MOCK_DASHBOARD.docs;
  const preferredDocs = DOC_ORDER.map((id) => docSource.find((item) => item.id === id)).filter(
    Boolean,
  ) as typeof MOCK_DASHBOARD.docs;
  const docs = preferredDocs.length ? preferredDocs : docSource.slice(0, 4);

  const analytics = mapped?.analytics ?? MOCK_DASHBOARD.analytics;
  const user = {
    name: companyName || mapped?.company.name || MOCK_DASHBOARD.user.name,
  };

  const [selectedSource, setSource] = useState(analytics.sources[0] ?? "Website");
  // Fall back to the first available source when the selection is no longer present.
  const source = analytics.sources.includes(selectedSource)
    ? selectedSource
    : (analytics.sources[0] ?? "Website");
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
    const bits = [`Page: Dashboard`, `Company: ${company.name}`, `Analytics source tab: ${source} (${device})`];
    if (analytics.metrics.length) {
      bits.push(
        `Visible metric scores: ${analytics.metrics.map((m) => `${m.label} ${m.score}`).join(", ")}`,
      );
    }
    return bits.join(". ");
  }, [company.name, source, device, analytics.metrics]);

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
            <CompanyCard company={company} profile={result?.company} />
            {!chatOpen ? <DocumentationCard items={docs} goalLabel={t("setYourGoal")} /> : null}
          </div>

          <AnalyticsSection
            data={analytics}
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
