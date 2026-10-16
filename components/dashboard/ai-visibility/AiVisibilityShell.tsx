"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Radar } from "lucide-react";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { FOCUS_RING } from "@/utils/ui-classes";

const TABS = [
  { id: "visibility", label: "AI visibility", href: PAGE_ROUTES.AI_VISIBILITY, icon: Radar },
  { id: "blogs", label: "Blogs", href: PAGE_ROUTES.BLOGS, icon: FileText },
] as const;

/** AI visibility and the blog writer share one screen: gaps found here become blog posts there. */
export default function AiVisibilityShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const onBlogs = pathname === PAGE_ROUTES.BLOGS || pathname.startsWith(`${PAGE_ROUTES.BLOGS}/`);
  const active = onBlogs ? "blogs" : "visibility";

  return (
    <div className="min-w-0 space-y-4">
      <nav
        aria-label="AI visibility sections"
        className="inline-flex w-full max-w-full rounded-full border border-[#E6E8F5] bg-[#F6F7FD] p-1 sm:w-auto"
      >
        {TABS.map((tab) => {
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

      {children}
    </div>
  );
}
