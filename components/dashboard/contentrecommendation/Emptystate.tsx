import SharedCard from "@/components/shared/card";
import { FOCUS_RING } from "@/utils/ui-classes";
import { Lightbulb, Loader2, Sparkles } from "lucide-react";

export function EmptyState({
  onGenerate,
  isPending,
}: {
  onGenerate: () => void;
  isPending: boolean;
}) {
  return (
    <SharedCard className="relative overflow-hidden p-0">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#ECEBFF_0%,transparent_60%)]"
      />
      <div className="relative flex flex-col items-center px-5 py-8 text-center sm:py-10">
        <span className="grid size-11 place-items-center rounded-2xl bg-[#ECEBFF] text-[#5B57E6]">
          <Lightbulb className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-3 text-[15px] font-semibold text-neutral-900">No recommendations yet</h2>
        <p className="mt-1 max-w-md text-[13px] leading-5 text-neutral-500">
          Generate content ideas, themes, and post plans tailored to your company DNA.
        </p>
        <button
          type="button"
          onClick={onGenerate}
          disabled={isPending}
          className={`mt-4 inline-flex h-9 items-center gap-2 rounded-full bg-[#5B57E6] px-4 text-sm font-medium text-white hover:bg-[#4A46D0] disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS_RING}`}
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          {isPending ? "Generating…" : "Generate recommendations"}
        </button>
      </div>
    </SharedCard>
  );
}
