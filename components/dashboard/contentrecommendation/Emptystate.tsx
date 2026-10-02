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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#ECEBFF_0%,transparent_55%)]"
      />
      <div className="relative mx-auto flex max-w-lg flex-col items-center px-6 py-14 text-center sm:py-16">
        <span className="grid size-14 place-items-center rounded-3xl bg-[#ECEBFF] text-[#5B57E6] shadow-[0_8px_24px_rgba(91,87,230,0.18)]">
          <Lightbulb className="size-6" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-lg font-semibold text-neutral-900">No recommendations yet</h2>
        <p className="mt-2 text-[14px] leading-6 text-neutral-500">
          Generate content ideas, themes, and post plans tailored to your company DNA and market
          position.
        </p>
        <button
          type="button"
          onClick={onGenerate}
          disabled={isPending}
          className={`mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#5B57E6] px-5 text-sm font-medium text-white hover:bg-[#4A46D0] disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS_RING}`}
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          {isPending ? "Generating…" : "Generate recommendations"}
        </button>
      </div>
    </SharedCard>
  );
}
