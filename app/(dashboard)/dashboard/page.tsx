"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import AnalyticsSection from "@/components/dashboard/cards/analyticsSection";
import ChatInput from "@/components/dashboard/chat/chatInput";
import ChatPanel from "@/components/dashboard/chat/chatPanel";
import CompanyCard from "@/components/dashboard/cards/companyCard";
import DocumentationCard from "@/components/dashboard/documentationCard";
import TopBar from "@/components/dashboard/topBar";
import { mapDashboard } from "@/lib/dashboard/map-dashboard";
import { useChatbot } from "@/lib/chat/use-chatbot";
import { AnalyzeCompanyDashboardQuery } from "@/routes/bussiness/Bussiness-Query";
import { AnalyzeCompanyMutation } from "@/routes/bussiness/Bussiness-Mutation";
import useAuthStore from "@/store/AuthsStore";
import type { Device } from "@/types/dashboard";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const companyId = useAuthStore((s) => s.company_id);
  const companyName = useAuthStore((s) => s.company_name);

  const {
    data: dashboard,
    isLoading,
    isError,
    error,
    refetch,
  } = AnalyzeCompanyDashboardQuery(companyId);

  const { mutate: analyzeCompany, isPending } = AnalyzeCompanyMutation();

  const mapped = useMemo(
    () => (dashboard?.data ? mapDashboard(dashboard) : null),
    [dashboard],
  );

  const handleAnalyzeCompany = () => {
    if (!companyId || isPending) return;

    const companyData =
      mapped?.company.description ||
      mapped?.company.coreOffering ||
      mapped?.profile.core_offering ||
      mapped?.company.name ||
      companyName ||
      "";

    analyzeCompany(
      {
        company_id: companyId,
        company_data: companyData,
      },
      {
        onSettled: () => {
          void refetch();
        },
      },
    );
  };

  const sources = mapped?.sources ?? [];
  const channels = mapped?.channels ?? {};
  const defaultSource = mapped?.defaultSource || sources[0]?.id || "";
  const user = { name: companyName || mapped?.company.name || "" };
  const [selectedSource, setSource] = useState<string | null>(null);
  const source =
    selectedSource && channels[selectedSource] ? selectedSource : defaultSource;
  const analytics = channels[source];
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

  const screenContext = [
    `Page: Dashboard`,
    `Company: ${mapped?.company.name ?? ""}`,
    `Analytics source tab: ${sourceLabel} (${device})`,
    analytics?.metrics.length
      ? `Visible metric scores: ${analytics.metrics.map((m) => `${m.label} ${m.score}`).join(", ")}`
      : "",
  ]
    .filter(Boolean)
    .join(". ");

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

          {isLoading ? (
            <div className="grid min-h-[40vh] place-items-center">
              <Loader2 className="size-7 animate-spin text-[#5452F6]" />
            </div>
          ) : null}

          {mapped ? (
            <div
              className={`grid gap-4 ${chatOpen ? "" : "xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]"}`}
            >
              <CompanyCard
                company={mapped.company}
                profile={mapped.profile}
                onRefresh={handleAnalyzeCompany}
                isRefreshing={isPending}
              />
              {!chatOpen && mapped.docs.length ? (
                <DocumentationCard
                  items={mapped.docs}
                  goalLabel={t("setYourGoal")}
                />
              ) : null}
            </div>
          ) : null}

          {analytics ? (
            <AnalyticsSection
              data={analytics}
              sources={sources}
              source={source}
              device={device}
              compact={chatOpen}
              onSourceChange={setSource}
              onDeviceChange={setDevice}
            />
          ) : null}
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
        <ChatInput
          onOpen={() => setChatOpen(true)}
          onSend={handleSend}
          placeholder={t("chatPlaceholder")}
        />
      ) : null}
    </>
  );
}
