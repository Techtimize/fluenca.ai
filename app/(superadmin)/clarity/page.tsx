"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Filter, Flame, LayoutDashboard, MousePointerClick, PlayCircle } from "lucide-react";
import { CLARITY_LINKS, CLARITY_PROJECT_ID } from "@/lib/analytics/clarity";
import { FOCUS_RING } from "@/utils/ui-classes";

const VIEWS: { href: string; title: string; description: string; icon: LucideIcon }[] = [
  {
    href: CLARITY_LINKS.dashboard,
    title: "Dashboard",
    description: "Sessions, pages per visit, scroll depth, and rage or dead clicks across the site.",
    icon: LayoutDashboard,
  },
  {
    href: CLARITY_LINKS.recordings,
    title: "Recordings",
    description: "Replay real sessions to see exactly how each company moves through Fluenca.",
    icon: PlayCircle,
  },
  {
    href: CLARITY_LINKS.heatmaps,
    title: "Heatmaps",
    description: "Where people click and how far they scroll on each page.",
    icon: Flame,
  },
];

/** Superadmin hub for Microsoft Clarity: every company's sessions, recordings and heatmaps. */
export default function ClarityPage() {
  return (
    <main className="min-w-0 space-y-4 pb-6">
      <section className="rounded-[28px] border border-[#E6E8F5] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_55%)] p-5 sm:p-7">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5B57E6] ring-1 ring-[#E6E8F5]">
          <MousePointerClick className="size-3.5" aria-hidden="true" />
          Microsoft Clarity
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">Company activity</h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-6 text-neutral-600">
          Clarity records how every company uses Fluenca. Each session is labelled with the company, so you can watch
          one company&apos;s visits or compare them all.
        </p>
        <p className="mt-3 text-[12px] text-neutral-500">
          Project <span className="font-mono text-neutral-700">{CLARITY_PROJECT_ID}</span>
        </p>
      </section>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {VIEWS.map(({ href, title, description, icon: Icon }) => (
          <li key={title}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className={`group flex h-full flex-col rounded-[24px] border border-[#E6E8F5] bg-white p-5 transition-[border-color,box-shadow] hover:border-[#C8C6F5] hover:shadow-[0_12px_32px_rgba(91,87,230,0.08)] ${FOCUS_RING}`}
            >
              <span className="grid size-11 place-items-center rounded-2xl bg-[#ECEBFF] text-[#5B57E6]">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-[16px] font-semibold text-neutral-900">{title}</h2>
              <p className="mt-1 flex-1 text-[13px] leading-5 text-neutral-500">{description}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#5B57E6]">
                Open in Clarity
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </span>
            </a>
          </li>
        ))}
      </ul>

      <section className="rounded-[24px] border border-[#E6E8F5] bg-white p-5">
        <h2 className="flex items-center gap-2 text-[15px] font-semibold text-neutral-900">
          <Filter className="size-4 text-[#5B57E6]" aria-hidden="true" />
          See one company
        </h2>
        <ol className="mt-3 list-decimal space-y-1.5 ps-5 text-[13px] leading-6 text-neutral-600">
          <li>Open Recordings or Heatmaps above.</li>
          <li>
            Choose <span className="font-medium text-neutral-800">Filters → Custom tags</span>, then pick{" "}
            <span className="font-mono text-neutral-800">company</span> (name) or{" "}
            <span className="font-mono text-neutral-800">company_id</span>.
          </li>
          <li>
            Or search <span className="font-medium text-neutral-800">Custom user ID</span> for the company id; sessions
            also show the company name as the user label.
          </li>
        </ol>
        <p className="mt-3 text-[12px] text-neutral-500">
          Only signed-in visits carry a company. Visits to public pages show as anonymous. New data can take up to two
          hours to appear in Clarity.
        </p>
      </section>
    </main>
  );
}
