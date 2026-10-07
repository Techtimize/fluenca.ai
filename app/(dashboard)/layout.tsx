"use client";

import type { ReactNode } from "react";
import SidebarRail, { DASHBOARD_CONTENT_OFFSET } from "@/components/dashboard/sidebarRail";
import PageChatbot from "@/components/dashboard/chat/pageChatbot";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,#E4E8FF_0%,#FFFFFF_50%)]">
      <SidebarRail />
      <div className={DASHBOARD_CONTENT_OFFSET}>{children}</div>
      <PageChatbot />
    </div>
  );
}
