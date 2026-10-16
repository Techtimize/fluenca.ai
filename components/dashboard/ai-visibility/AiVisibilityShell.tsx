"use client";

import type { ReactNode } from "react";
import { FileText, Radar } from "lucide-react";
import SectionTabs from "@/components/dashboard/SectionTabs";
import { PAGE_ROUTES } from "@/constant/page-routes";

const TABS = [
  { id: "visibility", label: "AI visibility", href: PAGE_ROUTES.AI_VISIBILITY, icon: Radar },
  { id: "blogs", label: "Blogs", href: PAGE_ROUTES.BLOGS, icon: FileText },
];

/** AI visibility and the blog writer share one screen: gaps found here become blog posts there. */
export default function AiVisibilityShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-w-0 space-y-4">
      <SectionTabs tabs={TABS} label="AI visibility sections" />
      {children}
    </div>
  );
}
