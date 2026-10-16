"use client";

// Client component: the tab icons are components (functions), which can't cross from server to client.
import type { ReactNode } from "react";
import { Plug, SlidersHorizontal } from "lucide-react";
import SectionTabs from "@/components/dashboard/SectionTabs";
import { PAGE_ROUTES } from "@/constant/page-routes";

const TABS = [
  { id: "connectors", label: "Connectors", href: PAGE_ROUTES.CONNECTORS, icon: Plug },
  { id: "controls", label: "Controls", href: PAGE_ROUTES.CONTROLS, icon: SlidersHorizontal },
];

/** Connected accounts and the controls for what Fluenca does with them live on one screen. */
export default function ConnectorsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-w-0 space-y-4">
      <SectionTabs tabs={TABS} label="Connectors sections" />
      {children}
    </div>
  );
}
