import Link from "next/link";
import {
  ArrowRight,
  Clapperboard,
  FileText,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { FOCUS_RING } from "@/utils/ui-classes";

const FLOW = [
  {
    title: "Open content recommendations",
    detail: "Browse AI ideas matched to your market and pillars.",
  },
  {
    title: "Tap Generate script on an idea",
    detail: "We’ll draft the full script, scenes, and characters.",
  },
  {
    title: "Review everything here",
    detail: "Come back to this page to read, refine, and move to visuals.",
  },
];

const DELIVERABLES = [
  "Hook, logline, caption, and CTA",
  "Scene-by-scene action & dialogue",
  "Characters with voice and look",
  "Visual prompts ready for Content",
];

export default function ScriptEmptyState() {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-dashed border-[#D8D6F5] bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(91,87,230,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(129,140,248,0.08),transparent_45%)]"
      />

      <div className="relative grid gap-8 p-5 sm:p-7 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <span className="grid size-12 place-items-center rounded-2xl bg-[#ECEBFF] text-[#5B57E6] ring-1 ring-[#E6E8F5]">
            <FileText className="size-5" aria-hidden="true" />
          </span>
          <h2 className="mt-4 max-w-[22ch] text-balance text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">
            No scripts yet — here’s what happens next
          </h2>
          <p className="mt-2 max-w-xl text-[14px] leading-6 text-neutral-600">
            Scripts aren’t generated on this page. You start from a content idea,
            Fluenca writes the script for you, then results land here as a full
            production brief.
          </p>

          <ol className="mt-6 space-y-3">
            {FLOW.map((item, index) => (
              <li
                key={item.title}
                className="flex gap-3 rounded-2xl border border-[#EEF0F8] bg-white/80 px-3.5 py-3"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#5B57E6] text-[12px] font-bold text-white">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-neutral-900">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[13px] leading-5 text-neutral-500">
                    {item.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <Link
            href={PAGE_ROUTES.CONTENT_RECOMMENDATION}
            className={`mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#5B57E6] px-5 text-sm font-medium text-white shadow-[0_10px_28px_rgba(91,87,230,0.24)] transition-[background-color,transform] hover:bg-[#4A46D0] active:scale-[0.98] ${FOCUS_RING}`}
          >
            <Lightbulb className="size-4" aria-hidden="true" />
            Choose an idea to script
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-[22px] border border-[#E6E8F5] bg-white p-5 shadow-[0_12px_36px_rgba(91,87,230,0.08)]">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-xl bg-[#ECEBFF] text-[#5B57E6]">
              <Clapperboard className="size-3.5" aria-hidden="true" />
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
              You’ll receive
            </p>
          </div>
          <ul className="mt-4 space-y-2.5">
            {DELIVERABLES.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 rounded-xl bg-[#F8F9FF] px-3 py-2.5 text-[13px] text-neutral-700"
              >
                <Sparkles
                  className="mt-0.5 size-3.5 shrink-0 text-[#5B57E6]"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
