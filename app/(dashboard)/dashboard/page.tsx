"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import AnalyticsSection from "@/components/dashboard/cards/analyticsSection";
import { useChatOpen } from "@/components/dashboard/chat/chatShell";
import CompanyCard from "@/components/dashboard/cards/companyCard";
import { DashboardSkeleton } from "@/components/shared/skeletons";
import DocumentationCard from "@/components/dashboard/documentationCard";
import DocumentationSheet from "@/components/dashboard/documentation/documentationSheet";
import TopBar from "@/components/dashboard/topBar";
import { mapDashboard } from "@/lib/dashboard/map-dashboard";
import { AnalyzeCompanyDashboardQuery } from "@/routes/bussiness/Bussiness-Query";
import {
  AnalyzeCompanyMutation,
  InstagramConnectMutation,
} from "@/routes/bussiness/Bussiness-Mutation";
import useAuthStore from "@/store/AuthsStore";
import type { Device, DocItem } from "@/types/dashboard";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const companyId = useAuthStore((s) => s.company_id);
  const companyName = useAuthStore((s) => s.company_name);
  const { mutate: connectInstagram } = InstagramConnectMutation();

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
  const [device, setDevice] = useState<Device>("mobile");
  const chatOpen = useChatOpen();
  const [openDoc, setOpenDoc] = useState<DocItem | null>(null);

  return (
    <>
      <main className="min-w-0 space-y-4">
        <TopBar user={user} />
        {isError ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
            {error instanceof Error ? error.message : t("error")}
          </div>
        ) : null}

        {isLoading ? <DashboardSkeleton compact={chatOpen} /> : null}

        {!isLoading && mapped ? (
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
                onSelect={setOpenDoc}
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
            onConnectIntegration={(id) => {
              if (id === "instagram") {
                connectInstagram();
                return;
              }
              router.push(PAGE_ROUTES.INTEGRATIONS);
            }}
          />
        ) : null}
      </main>

      <DocumentationSheet
        companyId={companyId}
        item={openDoc}
        onClose={() => setOpenDoc(null)}
      />
    </>
  );
}
