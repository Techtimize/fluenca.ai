import Link from "next/link";
import {
  Clapperboard,
  FileText,
  ImageIcon,
  Lightbulb,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { FOCUS_RING } from "@/utils/ui-classes";

const STEPS: Array<{
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
  tone: string;
}> = [
  {
    step: 1,
    title: "Pick an idea",
    description: "Start from recommendations matched to your brand DNA.",
    icon: Lightbulb,
    tone: "bg-[#FFF4ED] text-[#C2410C]",
  },
  {
    step: 2,
    title: "Generate script",
    description: "AI drafts the hook, body, caption, and CTA.",
    icon: FileText,
    tone: "bg-[#ECEBFF] text-[#5B57E6]",
  },
  {
    step: 3,
    title: "Scenes & cast",
    description: "Get shot direction and character notes ready to film.",
    icon: Users,
    tone: "bg-[#ECFDF5] text-[#047857]",
  },
  {
    step: 4,
    title: "Create visuals",
    description: "Send the brief into Content for images or clips.",
    icon: ImageIcon,
    tone: "bg-[#E8F1FB] text-[#0A66C2]",
  },
];

type Props = {
  scriptCount?: number;
  showCta?: boolean;
};

export default function ScriptJourney({
  scriptCount = 0,
  showCta = true,
}: Props) {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-[#E6E8F5] bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_0%_-20%,rgba(91,87,230,0.16),transparent_55%),radial-gradient(ellipse_80%_60%_at_100%_0%,rgba(129,140,248,0.12),transparent_50%),linear-gradient(180deg,#FBFBFF_0%,#FFFFFF_58%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-8 size-56 rounded-full bg-[#5B57E6]/[0.06] blur-3xl"
      />

      <div className="relative grid gap-8 p-5 sm:p-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-end lg:gap-10">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5B57E6] shadow-[0_1px_0_rgba(15,23,42,0.04)] ring-1 ring-[#E6E8F5]">
              <Clapperboard className="size-3.5" aria-hidden="true" />
              Script studio
            </p>
            {scriptCount > 0 ? (
              <span className="inline-flex items-center rounded-full bg-[#ECEBFF] px-2.5 py-1 text-[11px] font-semibold tabular-nums text-[#5B57E6]">
                {scriptCount} ready
              </span>
            ) : null}
          </div>

          <h1 className="mt-4 max-w-[18ch] text-balance text-[28px] font-semibold leading-[1.12] tracking-tight text-neutral-900 sm:text-[34px]">
            Turn ideas into ready-to-shoot scripts
          </h1>
          <p className="mt-3 max-w-xl text-[14px] leading-6 text-neutral-600 sm:text-[15px]">
            Fluenca writes the story for each content idea — hook, dialogue,
            scenes, and characters — so you know exactly what to film or design
            next.
          </p>

          {showCta ? (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={PAGE_ROUTES.CONTENT_RECOMMENDATION}
                className={`group inline-flex h-11 items-center gap-2 rounded-full bg-[#5B57E6] px-5 text-sm font-medium text-white shadow-[0_10px_28px_rgba(91,87,230,0.28)] transition-[background-color,transform] hover:bg-[#4A46D0] active:scale-[0.98] ${FOCUS_RING}`}
              >
                <Sparkles
                  className="size-4 animate-sparkle-glow"
                  aria-hidden="true"
                />
                Start from an idea
                <span className="grid size-7 place-items-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
              <p className="text-[12px] text-neutral-500">
                Scripts appear here after you generate from an idea.
              </p>
            </div>
          ) : null}
        </div>

        <aside className="relative overflow-hidden rounded-[22px] border border-[#E6E8F5] bg-white/80 p-4 shadow-[0_12px_40px_rgba(91,87,230,0.08)] backdrop-blur-sm sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400">
              How it flows
            </p>
            <span className="rounded-full bg-[#F6F7FD] px-2 py-0.5 text-[10px] font-medium text-neutral-500">
              4 steps
            </span>
          </div>

          <ol className="relative mt-4 space-y-0">
            {STEPS.map((item, index) => {
              const Icon = item.icon;
              const isLast = index === STEPS.length - 1;
              return (
                <li key={item.step} className="relative flex gap-3 pb-4 last:pb-0">
                  {!isLast ? (
                    <span
                      aria-hidden="true"
                      className="absolute left-[17px] top-9 h-[calc(100%-12px)] w-px bg-gradient-to-b from-[#D8D6F5] to-transparent"
                    />
                  ) : null}
                  <span
                    className={`relative z-[1] grid size-9 shrink-0 place-items-center rounded-xl ${item.tone}`}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
                        {String(item.step).padStart(2, "0")}
                      </span>
                      <h2 className="text-[13px] font-semibold text-neutral-900">
                        {item.title}
                      </h2>
                    </div>
                    <p className="mt-1 text-[12px] leading-5 text-neutral-500">
                      {item.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </aside>
      </div>
    </section>
  );
}
