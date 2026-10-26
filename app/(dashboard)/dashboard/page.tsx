"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import AnalyticsSection from "@/components/dashboard/cards/analyticsSection";
import { useChatOpen } from "@/components/dashboard/chat/chatShell";
import CompanyCard from "@/components/dashboard/cards/companyCard";
import { DashboardSkeleton } from "@/components/shared/skeletons";
import DocumentationCard from "@/components/dashboard/documentationCard";
import DocumentationSheet from "@/components/dashboard/documentation/documentationSheet";
import CurrentGoalSummary from "@/components/dashboard/goals/CurrentGoalSummary";
import GoalsDialog from "@/components/dashboard/goals/GoalsDialog";
import { mapDashboard } from "@/lib/dashboard/map-dashboard";
import { hasOpenGoal } from "@/lib/goals/goal-form";
import { AnalyzeCompanyDashboardQuery, CompanyGoalsQuery } from "@/routes/bussiness/Bussiness-Query";
import { AnalyzeCompanyMutation } from "@/routes/bussiness/Bussiness-Mutation";
import useAuthStore from "@/store/AuthsStore";
import type { Device, DocItem } from "@/types/dashboard";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const companyId = useAuthStore((s) => s.company_id);
  const companyName = useAuthStore((s) => s.company_name);
  const [goalsOpen, setGoalsOpen] = useState(false);
  const [openGoalId, setOpenGoalId] = useState<string | null>(null);

  const { data: goals } = CompanyGoalsQuery();
  const goalLocked = hasOpenGoal(goals);

  const openGoal = (goalId: string | null) => {
    setOpenGoalId(goalId);
    setGoalsOpen(true);
  };

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
  const [selectedSource, setSource] = useState<string | null>(null);
  const source =
    selectedSource && channels[selectedSource] ? selectedSource : defaultSource;
  const analytics = channels[source];
  const [device, setDevice] = useState<Device>("mobile");
  const chatOpen = useChatOpen();
  const [openDoc, setOpenDoc] = useState<DocItem | null>(null);

  return (
    <>
      <main className="min-w-0 max-w-full space-y-3 overflow-x-clip sm:space-y-4">
        {isError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 sm:rounded-3xl sm:px-5 sm:py-4">
            {error instanceof Error ? error.message : t("error")}
          </div>
        ) : null}

        {isLoading ? <DashboardSkeleton compact={chatOpen} /> : null}

        {!isLoading && mapped ? (
          <div
            className={`grid grid-cols-1 gap-3 sm:gap-4 ${
              chatOpen ? "" : "xl:grid-cols-[minmax(0,1.7fr)_minmax(260px,1fr)]"
            }`}
          >
            <CompanyCard
              company={mapped.company}
              profile={mapped.profile}
              companyId={companyId}
              onRefresh={handleAnalyzeCompany}
              isRefreshing={isPending}
              onCompetitorsFound={() => void refetch()}
              footer={<CurrentGoalSummary />}
            />
            {!chatOpen && mapped.docs.length ? (
              <DocumentationCard
                items={mapped.docs}
                goalLabel={t("setYourGoal")}
                onSelect={setOpenDoc}
                onSetGoal={() => openGoal(null)}
                goalLocked={goalLocked}
                lockedLabel={t("goalSet")}
                lockedHint={t("goalLockedHint")}
              />
            ) : null}
          </div>
        ) : null}

        {!isLoading && analytics ? (
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

      <DocumentationSheet
        companyId={companyId}
        item={openDoc}
        onClose={() => setOpenDoc(null)}
        analysisChannels={sources.map((s) => ({
          id: s.id,
          label: s.label,
          charts: channels[s.id]?.emptyMessage
            ? null
            : (channels[s.id]?.charts ?? null),
        }))}
        defaultAnalysisChannel={source}
      />
      <GoalsDialog
        open={goalsOpen}
        onOpenChange={setGoalsOpen}
        goalId={openGoalId}
      />
    </>
  );
}
