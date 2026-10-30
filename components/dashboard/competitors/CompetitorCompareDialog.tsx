"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import CompareResults from "@/components/dashboard/competitors/CompareResults";
import { asCompetitorsListResponse } from "@/components/dashboard/competitors/versionUtils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { getApiErrorMessage } from "@/errors/error-utils";
import { CompetitorAnalysisManualMutation } from "@/routes/bussiness/Bussiness-Mutation";
import {
  CompetitorAnalysisJobQuery,
  CompetitorAnalysisManualLatestResponseQuery,
  TRACKED_COMPETITORS_KEY,
} from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";
import type { CompetitorsListResponse } from "@/types/bussiness/competitoranalysis-type";
import type { Competitor } from "@/types/dashboard";
import { FOCUS_RING } from "@/utils/ui-classes";

const JOB_FAILED = new Set(["failed", "error", "cancelled", "canceled"]);
const JOB_DONE = new Set([...JOB_FAILED, "completed", "succeeded", "success", "ready"]);


export const COMPARE_ALL_ID = "__all__";


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

export function competitorInputs(competitor: Competitor) {
  return [
    competitor.instagramUrl ? instagramHandle(competitor.instagramUrl) : "",
    competitor.linkedinUrl?.trim() ?? "",
    websiteUrl(competitor.websiteUrl || competitor.href || ""),
  ].filter(Boolean);
}

type CompareRun = { id: string; names: string[]; jobId: string | null; failed: boolean };

export function useCompetitorCompare() {
  const companyId = useAuthStore((s) => s.company_id);
  const mutation = CompetitorAnalysisManualMutation();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [run, setRun] = useState<CompareRun | null>(null);
  const [result, setResult] = useState<CompetitorsListResponse | null>(null);

  const job = CompetitorAnalysisJobQuery(run?.jobId ?? "");
  const jobStatus = String(job.data?.status ?? "").toLowerCase();
  const waitingForJob = Boolean(run?.jobId) && !JOB_DONE.has(jobStatus) && !job.isError;
  const runFailed = Boolean(run?.failed) || JOB_FAILED.has(jobStatus);
  const waitingForMutation = mutation.isPending;

  const shouldFetchLatest =
    Boolean(run) && !open && !runFailed && !waitingForMutation && !waitingForJob && Boolean(companyId);
  const latest = CompetitorAnalysisManualLatestResponseQuery(shouldFetchLatest ? companyId : "");

  useEffect(() => {
    if (!run || open) return;
    if (runFailed) {
      const message =
        String(job.data?.error || job.data?.message || "") ||
        "The comparison did not finish. Try again in a moment.";
      toast.error(message);
      setRun(null);
      return;
    }

    if (!shouldFetchLatest) return;
    if (latest.isSuccess) {
      const parsed = asCompetitorsListResponse(latest.data);
      if (parsed) {
        setResult(parsed);
        setOpen(true);
        // The compared competitors now show as "Compared".
        void queryClient.invalidateQueries({ queryKey: TRACKED_COMPETITORS_KEY });
      } else {
        toast.error("The comparison did not return any data. Try again in a moment.");
        setRun(null);
      }
      return;
    }

    if (latest.isError) {
      toast.error(getApiErrorMessage(latest.error, "Failed to load the comparison"));
      setRun(null);
    }
  }, [run, open, runFailed, shouldFetchLatest, latest.isSuccess, latest.isError, latest.data, latest.error, job.data?.error, job.data?.message]);

  const start = (competitors: Competitor[], id: string) => {
    const values = [...new Set(competitors.flatMap(competitorInputs))];
    if (!companyId) {
      toast.error("Complete your company analysis first.");
      return;
    }
    if (!values.length) {
      toast.error("These competitors have no Instagram, LinkedIn or website to compare.");
      return;
    }
    setResult(null);
    setRun({ id, names: competitors.map((c) => c.name), jobId: null, failed: false });
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

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setRun(null);
      setResult(null);
    }
  };

  return {
    start,
    isBusy: Boolean(run) && !open,
    isComparing: (id: string) => Boolean(run && run.id === id && !open),
    dialogProps: { open, onOpenChange: handleOpenChange, run, result },
  };
}

export default function CompetitorCompareDialog({
  open,
  onOpenChange,
  run,
  result,
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
            How you compare, what to do next, and what they post. It&rsquo;s also saved under{" "}
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
          {open && run && result ? <CompareResults data={result} competitorNames={run.names} /> : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
