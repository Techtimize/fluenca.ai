"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import ManualCompetitorResults from "@/components/dashboard/competitors/CompetitorResults";
import { asCompetitorsListResponse } from "@/components/dashboard/competitors/versionUtils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { getApiErrorMessage, isApiNotFoundError } from "@/errors/error-utils";
import { CompetitorAnalysisManualMutation } from "@/routes/bussiness/Bussiness-Mutation";
import {
  CompetitorAnalysisJobQuery,
  CompetitorAnalysisManualLatestResponseQuery,
} from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";
import type { Competitor } from "@/types/dashboard";
import { FOCUS_RING } from "@/utils/ui-classes";

const JOB_FAILED = new Set(["failed", "error", "cancelled", "canceled"]);
const JOB_DONE = new Set([...JOB_FAILED, "completed", "succeeded", "success", "ready"]);

/** Instagram handle from a profile URL ("https://instagram.com/acme/" → "@acme"). */
function instagramHandle(url: string) {
  const match = url.match(/instagram\.com\/([^/?#]+)/i);
  const handle = (match ? match[1] : url).trim().replace(/^@+/, "");
  return handle ? `@${handle}` : "";
}

function websiteUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

/** The values the manual analysis accepts for one competitor: @handle, LinkedIn URL, website. */
export function competitorInputs(competitor: Competitor) {
  return [
    competitor.instagramUrl ? instagramHandle(competitor.instagramUrl) : "",
    competitor.linkedinUrl?.trim() ?? "",
    websiteUrl(competitor.websiteUrl || competitor.href || ""),
  ].filter(Boolean);
}

type CompareRun = { names: string[]; jobId: string | null; failed: boolean };

/** Starts a manual analysis for some competitors and keeps the dialog state for its results. */
export function useCompetitorCompare() {
  const companyId = useAuthStore((s) => s.company_id);
  const mutation = CompetitorAnalysisManualMutation();
  const [open, setOpen] = useState(false);
  const [run, setRun] = useState<CompareRun | null>(null);

  const start = (competitors: Competitor[]) => {
    const values = [...new Set(competitors.flatMap(competitorInputs))];
    if (!companyId) {
      toast.error("Complete your company analysis first.");
      return;
    }
    if (!values.length) {
      toast.error("These competitors have no Instagram, LinkedIn or website to compare.");
      return;
    }
    setRun({ names: competitors.map((c) => c.name), jobId: null, failed: false });
    setOpen(true);
    mutation.mutate(
      { company_id: companyId, competitors: values },
      {
        onSuccess: (response) =>
          setRun((prev) =>
            prev && {
              ...prev,
              jobId: response?.job_id ?? null,
              failed: response?.success === false,
            },
          ),
        onError: () => setRun((prev) => prev && { ...prev, failed: true }),
      },
    );
  };

  return {
    start,
    isStarting: mutation.isPending,
    dialogProps: { open, onOpenChange: setOpen, run, isStarting: mutation.isPending, companyId: companyId ?? "" },
  };
}

/** Polls the analysis job (when the backend returns one), then shows the latest manual analysis. */
function CompareBody({ run, isStarting, companyId }: { run: CompareRun; isStarting: boolean; companyId: string }) {
  const job = CompetitorAnalysisJobQuery(run.jobId ?? "");
  const jobStatus = String(job.data?.status ?? "").toLowerCase();
  const waitingForJob = Boolean(run.jobId) && !JOB_DONE.has(jobStatus) && !job.isError;
  const running = isStarting || waitingForJob;
  const failed = run.failed || JOB_FAILED.has(jobStatus);

  const latest = CompetitorAnalysisManualLatestResponseQuery(running || failed ? "" : companyId);
  const { refetch } = latest;

  // A job that finishes after the POST returned leaves the cached results stale.
  useEffect(() => {
    if (run.jobId && JOB_DONE.has(jobStatus) && !JOB_FAILED.has(jobStatus)) void refetch();
  }, [run.jobId, jobStatus, refetch]);

  if (running) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <Loader2 className="size-6 animate-spin text-[#5B57E6]" aria-hidden="true" />
        <p className="text-[14px] font-semibold text-neutral-900">Comparing you with {run.names.join(", ")}…</p>
        <p className="max-w-sm text-[13px] text-neutral-500">
          We are reading their Instagram, LinkedIn and website. This can take a minute; you can keep this open.
        </p>
      </div>
    );
  }

  if (failed) {
    const message =
      String(job.data?.error || job.data?.message || "") || "The comparison did not finish. Try again in a moment.";
    return (
      <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-700">{message}</p>
    );
  }

  const notFound = latest.isError && isApiNotFoundError(latest.error);
  return (
    <ManualCompetitorResults
      data={asCompetitorsListResponse(latest.data)}
      isLoading={latest.isLoading || latest.isFetching}
      isError={latest.isError && !notFound}
      isNotFound={notFound}
      errorMessage={
        latest.isError && !notFound ? getApiErrorMessage(latest.error, "Failed to load the comparison") : undefined
      }
      onRetry={() => void refetch()}
      isRetrying={latest.isRefetching}
    />
  );
}

export default function CompetitorCompareDialog({
  open,
  onOpenChange,
  run,
  isStarting,
  companyId,
}: ReturnType<typeof useCompetitorCompare>["dialogProps"]) {
  const title = run?.names.length === 1 ? `You vs ${run.names[0]}` : "You vs your competitors";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="flex max-h-[min(92vh,960px)] w-full max-w-[calc(100%-1rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-5xl sm:rounded-3xl"
      >
        <DialogHeader className="shrink-0 border-b border-[#EEF0F8] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_55%)] px-4 py-4 pe-12 sm:px-6 sm:py-5">
          <DialogTitle className="text-[18px] font-semibold tracking-tight text-neutral-900">{title}</DialogTitle>
          <DialogDescription className="mt-1 text-[13px] leading-5 text-neutral-500">
            Manual competitor analysis across Instagram, LinkedIn and website. It is also saved under{" "}
            <Link
              href={PAGE_ROUTES.COMPETITOR_ANALYSIS_MANUAL}
              className={`rounded font-medium text-[#5B57E6] hover:underline ${FOCUS_RING}`}
            >
              Competitor analysis → Manual
            </Link>
            .
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
          {open && run ? <CompareBody run={run} isStarting={isStarting} companyId={companyId} /> : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
