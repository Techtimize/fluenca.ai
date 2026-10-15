import { PenLine, Sparkles } from "lucide-react";

const HIGHLIGHTS = ["SEO Optimized", "Audience Focused", "Brand Aligned"];

/** Decorative "draft document" illustration, drawn with CSS so no image asset is needed. */
function DraftIllustration() {
  return (
    <div className="relative hidden h-32 w-80 shrink-0 md:block" aria-hidden="true">
      <div className="absolute inset-y-2 left-6 w-40 rotate-[-6deg] rounded-2xl bg-white/90 p-4 shadow-[0_18px_40px_-18px_rgba(79,70,229,0.45)] ring-1 ring-[#E3E6FF]">
        <span className="grid size-8 place-items-center rounded-full bg-[#4F46E5] text-white shadow-sm">
          <PenLine className="size-4" />
        </span>
        <span className="mt-3 block h-1.5 w-24 rounded-full bg-[#DCE0FA]" />
        <span className="mt-2 block h-1.5 w-28 rounded-full bg-[#E7EAFB]" />
        <span className="mt-2 block h-1.5 w-20 rounded-full bg-[#E7EAFB]" />
        <span className="mt-2 block h-1.5 w-24 rounded-full bg-[#E7EAFB]" />
      </div>
      <span className="absolute left-36 top-0 inline-flex rotate-[-8deg] items-center gap-1 rounded-lg bg-[#5B57E6] px-2 py-1 text-[10px] font-semibold text-white shadow-sm">
        <Sparkles className="size-3" />
        AI Powered
      </span>
      <span className="absolute right-2 top-8 rotate-[-10deg] font-[cursive] text-[13px] leading-tight text-[#4F46E5]">
        From idea
        <br />
        to publish
      </span>
      <svg viewBox="0 0 80 40" className="absolute bottom-6 right-16 h-8 w-16 text-[#6366F1]" fill="none">
        <path d="M76 6c-6 20-28 26-44 18-6-3-6-9 0-9 8 0 6 14-14 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M22 28l-6 5 8 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function BlogWriterHero() {
  return (
    <section className="overflow-hidden rounded-[24px] border border-[#E6E8F5] bg-[linear-gradient(110deg,#EEF0FF_0%,#F6F4FF_55%,#E9E6FF_100%)] px-5 py-5 sm:px-7">
      <div className="flex items-center justify-between gap-6">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/80 text-[#5B57E6] ring-1 ring-[#E3E6FF]">
              <Sparkles className="size-4.5" aria-hidden="true" />
            </span>
            <h2 className="text-lg font-semibold tracking-tight text-neutral-900 sm:text-xl">
              Create More Impactful Content
            </h2>
          </div>
          <p className="mt-2 text-[13px] text-neutral-600 sm:ps-12">
            Let AI find the best blog topics for your audience and business goals.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2 sm:ps-12">
            {HIGHLIGHTS.map((item) => (
              <li
                key={item}
                className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-[#3F3D9E] shadow-[0_1px_0_rgba(15,23,42,0.03)] ring-1 ring-[#E3E6FF]"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <DraftIllustration />
      </div>
    </section>
  );
}
