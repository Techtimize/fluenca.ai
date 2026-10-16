"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { FOCUS_RING } from "@/utils/ui-classes";

export type SectionTab = { id: string; label: string; href: string; icon: LucideIcon };

/**
 * Pill switch between sibling screens that share a sidebar entry. The longest matching href wins,
 * so a nested tab (/connectors/controls) beats its parent (/connectors).
 */
export default function SectionTabs({ tabs, label }: { tabs: SectionTab[]; label: string }) {
  const pathname = usePathname();
  const active = [...tabs]
    .sort((a, b) => b.href.length - a.href.length)
    .find((tab) => pathname === tab.href || pathname.startsWith(`${tab.href}/`))?.id;

  return (
    <nav
      aria-label={label}
      className="inline-flex w-full max-w-full rounded-full border border-[#E6E8F5] bg-[#F6F7FD] p-1 sm:w-auto"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const current = active === tab.id;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            aria-current={current ? "page" : undefined}
            className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors sm:flex-none ${FOCUS_RING} ${
              current
                ? "bg-white text-[#5B57E6] shadow-[0_1px_3px_rgba(17,24,39,0.08)]"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <Icon className="size-3.5" aria-hidden="true" />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
