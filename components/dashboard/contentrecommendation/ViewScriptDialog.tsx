"use client";

import Link from "next/link";
import { FileText, Loader2 } from "lucide-react";
import { ScriptResultCard } from "@/components/dashboard/script/scriptresultcard";
import {
  findScriptResultById,
  getScriptFromResult,
  normalizeScriptResults,
} from "@/components/dashboard/script/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { getApiErrorMessage } from "@/errors/error-utils";
import { ScriptGenerationResultsByCompanyIdQuery } from "@/routes/bussiness/Bussiness-Query";
import type { ScriptGenerationResponse } from "@/types/bussiness/script-type";
import { FOCUS_RING } from "@/utils/ui-classes";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
  /** The idea's `script_id`; the script is matched on it. */
  scriptId?: string | null;
  /** Falls back to matching the script title when there is no `script_id`. */
  ideaTitle: string;
};

const sameText = (a?: string | null, b?: string | null) =>
  Boolean(a && b && a.trim().toLowerCase() === b.trim().toLowerCase());

function findIdeaScript(items: ScriptGenerationResponse[], scriptId: string | null | undefined, title: string) {
  if (scriptId) {
    const byId = findScriptResultById(items, scriptId);
    if (byId) return byId;
  }
  return (
    items.find((item) => sameText(getScriptFromResult(item)?.title, title)) ||
    items.find((item) => sameText(item.project?.name, title)) ||
    null
  );
}

export default function ViewScriptDialog({ open, onOpenChange, companyId, scriptId, ideaTitle }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(92vh,960px)] w-full max-w-[calc(100%-1rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-4xl sm:rounded-3xl">
        <DialogHeader className="shrink-0 border-b border-[#EEF0F8] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_55%)] px-4 py-4 pe-12 sm:px-6 sm:py-5">
          <DialogTitle className="flex items-center gap-2 text-[18px] font-semibold tracking-tight text-neutral-900">
            <FileText className="size-5 text-[#5B57E6]" aria-hidden="true" />
            Script
          </DialogTitle>
          <DialogDescription className="mt-1 line-clamp-2 text-[13px] leading-5 text-neutral-500">
            {ideaTitle}
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
          {/* Mounted only while open, so the results are fetched when the dialog is opened. */}
          {open ? <ScriptBody companyId={companyId} scriptId={scriptId} ideaTitle={ideaTitle} /> : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ScriptBody({ companyId, scriptId, ideaTitle }: Omit<Props, "open" | "onOpenChange">) {
  // GET /scriptGeneration/results/{company_id}?limit=20&offset=0
  const resultsQuery = ScriptGenerationResultsByCompanyIdQuery(companyId, { limit: 20, offset: 0 });

  if (resultsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-[13px] text-neutral-500" aria-busy="true">
        <Loader2 className="size-5 animate-spin text-[#5B57E6]" aria-hidden="true" />
        Loading the script…
      </div>
    );
  }

  if (resultsQuery.isError) {
    return (
      <p className="rounded-xl bg-rose-50 px-4 py-3 text-[13px] text-rose-700">
        {getApiErrorMessage(resultsQuery.error, "Could not load the script")}
      </p>
    );
  }

  const items = normalizeScriptResults(resultsQuery.data);
  const script = findIdeaScript(items, scriptId, ideaTitle);

  if (!script) {
    return (
      <div className="rounded-2xl border border-dashed border-[#E6E8F5] bg-[#FBFBFF] px-4 py-10 text-center">
        <p className="text-[13px] text-neutral-600">
          We couldn&rsquo;t find this script among your 20 most recent ones.
        </p>
        <Link
          href={PAGE_ROUTES.SCRIPT}
          className={`mt-3 inline-flex rounded-full bg-[#5B57E6] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#4A46D0] ${FOCUS_RING}`}
        >
          See all scripts
        </Link>
      </div>
    );
  }

  return <ScriptResultCard item={script} index={0} total={1} />;
}
