"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import AnalyticsSection from "@/components/dashboard/cards/analyticsSection";
import AnalyzeCompanyInsights from "@/components/dashboard/analyzeCompanyInsights";
import ChatInput from "@/components/dashboard/chat/chatInput";
import ChatPanel from "@/components/dashboard/chat/chatPanel";
import CompanyCard from "@/components/dashboard/cards/companyCard";
import DocumentationCard from "@/components/dashboard/documentationCard";
import TopBar from "@/components/dashboard/topBar";
import { mapAnalyzeCompanyToDashboard } from "@/lib/dashboard/map-analyze-company";
import { MOCK_DASHBOARD } from "@/lib/mock/dashboard";
import { AnalyzeCompanyResultsQuery } from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";
import type { ChatMessage } from "@/types/chat";
import type { Device } from "@/types/dashboard";
import type { AnalyzeCompanyResultsResponse } from "@/types/bussiness/analyzecompany-type";
import { stripMarkdown } from "@/utils/text-utils";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const companyId = useAuthStore((s) => s.company_user_id);
  const company_name = useAuthStore((s) => s.company_name);

  const {
    data: analyzeResults,
    isLoading,
    isFetching,
    isError,
    error,
  } = AnalyzeCompanyResultsQuery(companyId);

  const mapped = useMemo(
    () => (analyzeResults ? mapAnalyzeCompanyToDashboard(analyzeResults) : null),
    [analyzeResults],
  );

  const hasCompanyId = Boolean(companyId);
  const showLoading = hasCompanyId && (isLoading || isFetching) && !mapped;
  const company = mapped?.company ?? (hasCompanyId ? null : MOCK_DASHBOARD.company);
  // summary_text sits inside the results API's `result` wrapper.
  const result = (analyzeResults as AnalyzeCompanyResultsResponse | undefined)?.result;
  const summaryText = result?.company_summary?.summary_text;
  const docs = mapped?.docs ?? (hasCompanyId ? [] : MOCK_DASHBOARD.docs);
  // Analytics graphs are built from the unwrapped analysis.
  const resultAnalytics = useMemo(
    () => (result ? mapAnalyzeCompanyToDashboard(result).analytics : null),
    [result],
  );
  const analytics = resultAnalytics ?? mapped?.analytics ?? MOCK_DASHBOARD.analytics;
  const user = {
    name: company_name || mapped?.company.name || MOCK_DASHBOARD.user.name,
  };

  const [source, setSource] = useState(analytics.sources[0]);
  const [device, setDevice] = useState<Device>("mobile");
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleSend = (text: string) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: text }]);
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
        <main className="min-w-0">
          <TopBar user={user} />

          {!hasCompanyId ? (
            <div className="mb-4 rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
              {t("noCompanyId")}
            </div>
          ) : null}

          {showLoading ? (
            <div className="rounded-3xl border border-[#E6E8F5] bg-white/90 px-5 py-8 text-sm text-neutral-600">
              Loading company analysis…
            </div>
          ) : null}

          {isError ? (
            <div className="mb-4 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
              {error instanceof Error ? error.message : "Failed to load company analysis."}
            </div>
          ) : null}

          {company ? (
            <div className={`grid gap-4 ${chatOpen ? "" : "lg:grid-cols-[minmax(0,1fr)_360px]"}`}>
              <CompanyCard company={summaryText ? { ...company, description: stripMarkdown(summaryText) } : company} profile={result?.company} />
              <DocumentationCard items={docs} />
            </div>
          ) : null}

          {mapped ? (
            <>
              <AnalyticsSection
                data={analytics}
                source={source}
                device={device}
                compact={chatOpen}
                onSourceChange={setSource}
                onDeviceChange={setDevice}
                onConnectIntegration={(id) => console.log("TODO: start connect flow for", id)}
              />
              {/* {analyzeResults ? <AnalyzeCompanyInsights data={analyzeResults} /> : null} */}
            </>
          ) : null}
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
    </>
  );
}
