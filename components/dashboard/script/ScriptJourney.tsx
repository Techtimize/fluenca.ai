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
  accent: string;
}> = [
  {
    step: 1,
    title: "Pick a content idea",
    description: "Start from recommendations tailored to your brand DNA.",
    icon: Lightbulb,
    accent: "bg-[#FFF4ED] text-[#C2410C]",
  },
  {
    step: 2,
    title: "Generate a script",
    description: "AI writes the hook, body, caption, and CTA for that idea.",
    icon: FileText,
    accent: "bg-[#ECEBFF] text-[#5B57E6]",
  },
  {
    step: 3,
    title: "Build scenes & cast",
    description: "You get scene-by-scene direction plus character notes.",
    icon: Users,
    accent: "bg-[#ECFDF5] text-[#047857]",
  },
  {
    step: 4,
    title: "Create visuals",
    description: "Use the script next in Content to generate images or clips.",
    icon: ImageIcon,
    accent: "bg-[#E8F1FB] text-[#0A66C2]",
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
    <section className="overflow-hidden rounded-[28px] border border-[#E6E8F5] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_55%)] p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 max-w-2xl">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5B57E6] ring-1 ring-[#E6E8F5]">
            <Clapperboard className="size-3.5" aria-hidden="true" />
            Script studio
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-[28px]">
            Turn ideas into ready-to-shoot scripts
          </h1>
          <p className="mt-2 text-[14px] leading-6 text-neutral-600">
            Fluenca writes the story for each content idea — hook, dialogue,
            scenes, and characters — so you know exactly what to film or design
            next.
          </p>
          {scriptCount > 0 ? (
            <p className="mt-3 text-[13px] font-medium text-neutral-500">
              {scriptCount} script{scriptCount === 1 ? "" : "s"} ready below
            </p>
          ) : null}
        </div>

        {showCta ? (
          <Link
            href={PAGE_ROUTES.CONTENT_RECOMMENDATION}
            className={`group inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-[#5B57E6] px-5 text-sm font-medium text-white shadow-[0_8px_24px_rgba(91,87,230,0.25)] transition-transform hover:bg-[#4A46D0] active:scale-[0.98] ${FOCUS_RING}`}
          >
            <Sparkles className="size-4 animate-sparkle-glow" aria-hidden="true" />
            Start from an idea
            <span className="grid size-7 place-items-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        ) : null}
      </div>

      <ol className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {STEPS.map((item, index) => {
          const Icon = item.icon;
          return (
            <li
              key={item.step}
              className="relative rounded-2xl border border-white/80 bg-white/90 p-4 shadow-[0_1px_0_rgba(15,23,42,0.02)]"
            >
              {index < STEPS.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute -right-2 top-1/2 z-10 hidden h-px w-4 -translate-y-1/2 bg-[#D8D6F5] xl:block"
                />
              ) : null}
              <div className="flex items-center gap-2.5">
                <span
                  className={`grid size-9 place-items-center rounded-xl ${item.accent}`}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
                  Step {item.step}
                </span>
              </div>
              <h2 className="mt-3 text-[14px] font-semibold text-neutral-900">
                {item.title}
              </h2>
              <p className="mt-1.5 text-[12px] leading-5 text-neutral-500">
                {item.description}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
