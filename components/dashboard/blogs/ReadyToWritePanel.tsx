import { FileText, Loader2, PenLine, Sparkles } from "lucide-react";
import type { BriefListItem, KeywordRunStatus } from "@/types/bussiness/blog-type";
import { FOCUS_RING } from "@/utils/ui-classes";

const volume = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

type Props = {
  briefs: BriefListItem[];
  researchStatus?: KeywordRunStatus;
  pendingBriefId: string | null;
  onWrite: (briefId: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
};

/** Blog briefs that have no post yet, highest priority first, each one click away from a draft. */
export default function ReadyToWritePanel({
  briefs,
  researchStatus,
  pendingBriefId,
  onWrite,
  isGenerating,
  onGenerate,
}: Props) {
  // Re-running research replaces the current ideas, so only offer it when there are none to work from.
  const canGenerate = researchStatus === "not_started" || researchStatus === "failed";
  const researching = researchStatus === "researching" || isGenerating;

  return (
    <section className="min-w-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-neutral-900">
            Ready to Write
            <span className="rounded-full bg-[#EEF0FF] px-2 py-0.5 text-[11px] font-semibold text-[#4544C9]">
              {briefs.length}
            </span>
          </h2>
          <p className="mt-1 text-[12px] text-neutral-500">
            High-priority blog topics, ready for you to turn into drafts.
          </p>
        </div>
        {canGenerate || researching ? (
          <button
            type="button"
            onClick={onGenerate}
            disabled={researching}
            className={`inline-flex h-10 items-center gap-2 rounded-full bg-linear-to-r from-[#4F46E5] to-[#6D6AF5] px-4 text-[13px] font-semibold text-white shadow-[0_6px_16px_-6px_rgba(79,70,229,0.6)] hover:opacity-95 disabled:opacity-70 ${FOCUS_RING}`}
          >
            {researching ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles className="size-4" aria-hidden="true" />
            )}
            {researching ? "Finding ideas…" : "Generate Ideas"}
          </button>
        ) : null}
      </div>

      <div className="mt-4 rounded-2xl border border-[#E6E8F5] bg-white">
        {briefs.length ? (
          <ul className="divide-y divide-[#EEF0F8]">
            {briefs.map((brief) => {
              const pending = pendingBriefId === brief.brief_id;
              return (
                <li key={brief.brief_id} className="flex items-start gap-3 px-4 py-4">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#EEF0FF] text-[#5B57E6]">
                    <FileText className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold leading-5 text-neutral-900">{brief.title}</p>
                    <p className="mt-1 text-[12px] text-neutral-500">
                      Keyword: <span className="text-neutral-700">{brief.primary_keyword}</span>
                    </p>
                    <p className="mt-1.5 text-[11px] text-neutral-500">
                      {volume.format(brief.total_volume)} searches / month
                      <span className="mx-1.5" aria-hidden="true">•</span>
                      Priority #{brief.rank}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onWrite(brief.brief_id)}
                    disabled={pending}
                    className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-[#E6E8F5] bg-white px-3.5 text-[13px] font-medium text-[#4544C9] transition-colors hover:bg-[#F6F5FF] disabled:opacity-60 ${FOCUS_RING}`}
                  >
                    {pending ? (
                      <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                    ) : (
                      <PenLine className="size-3.5" aria-hidden="true" />
                    )}
                    Write
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="px-4 py-10 text-center text-[13px] text-neutral-500">
            {researching
              ? "Finding blog topics for your brand…"
              : "Every topic has a post. New ideas appear here after the next keyword research."}
          </p>
        )}
      </div>
    </section>
  );
}
