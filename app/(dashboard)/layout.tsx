"use client";

import type { ReactNode } from "react";
import ChatShell from "@/components/dashboard/chat/chatShell";
import SidebarRail, { DASHBOARD_CONTENT_OFFSET } from "@/components/dashboard/sidebarRail";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,#E4E8FF_0%,#FFFFFF_50%)]">
      <SidebarRail />
      <div className={DASHBOARD_CONTENT_OFFSET}>
        <ChatShell>{children}</ChatShell>
      </div>
    </div>
  );
}
