"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Bell,
  Building2,
  Crosshair,
  Dna,
  Layers3,
  Loader2,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { CompetitorAnalysisAsyncMutation, RetryDnaMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { CompetitorAnalysisJobQuery, DnaQuery, OnboardingDetailsQuery } from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";
import { FOCUS_RING } from "@/utils/ui-classes";

const HIDDEN_SECTION_TITLES = new Set([
  "voice & tone",
  "voice and tone",
  "things to avoid",
  "company & team",
  "company and team",
]);

const JOB_SUCCESS_STATUSES = new Set(["completed", "succeeded", "success", "ready"]);
const JOB_FAILED_STATUSES = new Set(["failed", "error", "cancelled", "canceled"]);

function getSectionIcon(key: string, title: string): LucideIcon {
  const haystack = `${key} ${title}`.toLowerCase();
  if (haystack.includes("audience") || haystack.includes("customer")) return Users;
  if (haystack.includes("position") || haystack.includes("offer")) return Crosshair;
  if (haystack.includes("service") || haystack.includes("product")) return Layers3;
  if (haystack.includes("tech") || haystack.includes("stack")) return Wrench;
  if (haystack.includes("company") || haystack.includes("brand")) return Building2;
  if (haystack.includes("dna")) return Dna;
  return Sparkles;
}

export default function VerifyDna() {
  const t = useTranslations("verifyDna");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const company_user_id = useAuthStore((state) => state.company_user_id);
  const { data: dna, isLoading } = DnaQuery();
  const { data: onboarding } = OnboardingDetailsQuery();
  const { mutate: retryDna, isPending: isRetrying } = RetryDnaMutation();
  const { mutate: competitorAnalysisAsync, isPending: isCompetitorAnalysisAsync } =
    CompetitorAnalysisAsyncMutation();

  const [activeId, setActiveId] = useState("");
  const [jobId, setJobId] = useState("");
  const handledJobRef = useRef<string | null>(null);

  const {
    data: competitorAnalysisJob,
    isLoading: isCompetitorAnalysisJobLoading,
    isFetching: isCompetitorAnalysisJobFetching,
  } = CompetitorAnalysisJobQuery(jobId);

  const isReady = dna?.status === "ready";
  const isFailed = dna?.status === "failed";
  const isBuilding =
    isLoading || dna?.status === "generating" || dna?.status === "not_started";

  const companyId = onboarding?.company_id || company_user_id;
  const companyData =
    dna?.document?.trim() ||
    (dna?.sections ?? [])
      .map((section) => `## ${section.title}\n${section.text}`)
      .join("\n\n");

  const jobStatus = String(competitorAnalysisJob?.status ?? "").toLowerCase();
  const isJobFailed = JOB_FAILED_STATUSES.has(jobStatus);
  const isJobSuccess = JOB_SUCCESS_STATUSES.has(jobStatus);
  const isPollingJob =
    Boolean(jobId) && !isJobSuccess && !isJobFailed;
  const isWorking =
    isCompetitorAnalysisAsync ||
    isPollingJob ||
    (Boolean(jobId) && (isCompetitorAnalysisJobLoading || isCompetitorAnalysisJobFetching) && !isJobFailed);

  const sections = useMemo(
    () =>
      (dna?.sections ?? [])
        .filter((section) => {
          const title = section.title.replace(/^#+\s*/, "").trim().toLowerCase();
          const key = section.key.trim().toLowerCase().replace(/[_-]+/g, " ");
          return !HIDDEN_SECTION_TITLES.has(title) && !HIDDEN_SECTION_TITLES.has(key);
        })
        .map((section) => ({
          ...section,
          id: section.key || section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          Icon: getSectionIcon(section.key, section.title),
        })),
    [dna?.sections],
  );

  useEffect(() => {
    if (!sections.length) return;
    setActiveId((current) => current || sections[0].id);

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting);
        if (hit) setActiveId(hit.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    if (!jobId || !jobStatus) return;
    if (handledJobRef.current === `${jobId}:${jobStatus}`) return;

    if (isJobSuccess) {
      handledJobRef.current = `${jobId}:${jobStatus}`;
      toast.success(
        typeof competitorAnalysisJob?.message === "string"
          ? competitorAnalysisJob.message
          : t("jobComplete"),
      );
      router.push(PAGE_ROUTES.DASHBOARD);
      return;
    }

    if (isJobFailed) {
      handledJobRef.current = `${jobId}:${jobStatus}`;
      toast.error(
        (typeof competitorAnalysisJob?.error === "string" && competitorAnalysisJob.error) ||
          (typeof competitorAnalysisJob?.message === "string" && competitorAnalysisJob.message) ||
          t("jobFailed"),
      );
    }
  }, [
    competitorAnalysisJob?.error,
    competitorAnalysisJob?.message,
    isJobFailed,
    isJobSuccess,
    jobId,
    jobStatus,
    router,
    t,
  ]);

  const scrollTo = (id: string) => {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleContinue = () => {
    if (!companyId) {
      toast.error(t("toastMissingCompanyId"));
      return;
    }

    handledJobRef.current = null;
    setJobId("");

    competitorAnalysisAsync(
      {
        company_id: companyId,
        mode: "ai",
      },
      {
        onSuccess: (response) => {
          if (response?.success === false) return;

          const nextJobId = response?.job_id?.trim();
          if (!nextJobId) {
            toast.error(t("toastMissingJobId"));
            return;
          }

          setJobId(nextJobId);
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,#E9ECFF_0%,#FFFFFF_45%)]">
      <header className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        <Link href={PAGE_ROUTES.HOME} className="flex items-center gap-2">
          <Image
            src="/assets/Logo.svg"
            alt="Fluenca.ai"
            width={28}
            height={28}
            className="size-7"
          />
          <span className="text-lg font-semibold tracking-wide text-neutral-900">
            fluenca<span className="text-[#5B57E6]">.ai</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <LanguageSwitcher variant="light" />
          <button
            type="button"
            aria-label={tCommon("notifications")}
            className={`grid size-10 place-items-center rounded-full border border-[#E6E8F5] bg-white text-neutral-700 hover:bg-neutral-50 ${FOCUS_RING}`}
          >
            <Bell className="size-4" />
          </button>
          <div className="grid size-10 place-items-center rounded-full bg-[#5B57E6] text-sm font-semibold text-white">
            U
          </div>
        </div>
      </header>

      <main className="w-full px-4 pb-16 pt-2 sm:px-6 lg:px-10">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-[#5B57E6]">
            {t("eyebrow")}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-sm leading-6 text-neutral-500 sm:text-[15px]">
            {t("subtitle")}
          </p>
        </div>

        {isBuilding ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-sm text-neutral-500">
            <Loader2 className="size-7 animate-spin text-[#5B57E6]" />
            <p className="font-medium text-neutral-700">{t("building")}</p>
            <p className="max-w-sm text-center text-xs text-neutral-500">
              {t("buildingHint")}
            </p>
          </div>
        ) : null}

        {isFailed ? (
          <div className="flex min-h-[40vh] flex-col items-start justify-center gap-4">
            <h2 className="text-xl font-semibold text-neutral-900">
              {t("failedTitle")}
            </h2>
            <p className="max-w-lg text-sm leading-6 text-[#B42318]">
              {dna?.error || t("failedFallback")}
            </p>
            <button
              type="button"
              onClick={() => retryDna()}
              disabled={isRetrying}
              className={`h-11 rounded-full bg-[#5B57E6] px-6 text-sm font-semibold text-white hover:bg-[#4A46D0] disabled:opacity-60 ${FOCUS_RING}`}
            >
              {isRetrying ? tCommon("retrying") : tCommon("tryAgain")}
            </button>
          </div>
        ) : null}

        {isReady && sections.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14">
            <aside className="lg:sticky lg:top-6 lg:self-start">
              <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.12em] text-neutral-400">
                {t("sections")}
              </p>
              <nav aria-label="DNA sections">
                <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
                  {sections.map((section, index) => {
                    const active = section.id === activeId;
                    const Icon = section.Icon;
                    return (
                      <li key={section.id} className="shrink-0">
                        <button
                          type="button"
                          onClick={() => scrollTo(section.id)}
                          aria-current={active ? "true" : undefined}
                          className={`flex w-full items-center gap-2.5 rounded-full px-3 py-2.5 text-left text-[13px] transition-colors lg:rounded-none lg:border-l-2 lg:px-2.5 ${FOCUS_RING} ${
                            active
                              ? "bg-[#ECEBFF] font-medium text-[#5B57E6] lg:border-[#5B57E6] lg:bg-transparent"
                              : "bg-white/70 text-neutral-700 hover:text-neutral-950 lg:border-transparent lg:bg-transparent"
                          }`}
                        >
                          <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                          <span className="truncate">
                            {index + 1}. {section.title}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>

            <div className="min-w-0">
              {sections.map((section, index) => {
                const Icon = section.Icon;
                return (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-8 border-t border-[#E6E8F5] py-10 first:border-t-0 first:pt-0"
                  >
                    <div className="mb-5 flex items-start gap-3">
                      <span className="mt-0.5 grid size-10 place-items-center rounded-2xl bg-[#ECEBFF] text-[#5B57E6]">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#5B57E6]">
                          Part {String(index + 1).padStart(2, "0")}
                        </p>
                        <h2 className="mt-1 text-xl font-semibold text-neutral-900 sm:text-2xl">
                          {section.title}
                        </h2>
                      </div>
                    </div>

                    <div className="w-full space-y-4 pl-0 sm:pl-[52px]">
                      {section.text
                        .split(/\n{2,}/)
                        .map((paragraph) => paragraph.trim())
                        .filter(Boolean)
                        .map((paragraph) => (
                          <p
                            key={paragraph.slice(0, 48)}
                            className="whitespace-pre-line text-[15px] leading-7 text-neutral-700 sm:text-base sm:leading-8"
                          >
                            {paragraph}
                          </p>
                        ))}
                    </div>
                  </section>
                );
              })}

              <div className="flex flex-col gap-3 border-t border-[#E6E8F5] pt-8 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-neutral-500">{t("continueHint")}</p>
                  {isPollingJob ? (
                    <p className="mt-1 text-xs text-[#5B57E6]">{t("pollingJob")}</p>
                  ) : null}
                  {isJobFailed ? (
                    <p className="mt-1 text-xs text-[#B42318]">{t("jobFailed")}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={isWorking || !companyId || !companyData}
                  className={`inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2E2A9E] to-[#5B57E6] px-8 text-sm font-semibold text-white hover:from-[#4A46D0] hover:to-[#6B67E6] disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS_RING}`}
                >
                  {isWorking ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      {isPollingJob ? t("pollingJob") : t("analyzing")}
                    </>
                  ) : (
                    t("continue")
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {isReady && !isBuilding && !isFailed && sections.length === 0 ? (
          <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm font-medium text-neutral-700">{t("empty")}</p>
            <button
              type="button"
              onClick={() => retryDna()}
              disabled={isRetrying}
              className={`h-11 rounded-full bg-[#5B57E6] px-6 text-sm font-semibold text-white hover:bg-[#4A46D0] disabled:opacity-60 ${FOCUS_RING}`}
            >
              {isRetrying ? tCommon("retrying") : t("generateAgain")}
            </button>
          </div>
        ) : null}
      </main>
    </div>
  );
}
