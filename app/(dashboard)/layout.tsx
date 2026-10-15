"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import ChatShell from "@/components/dashboard/chat/chatShell";
import SidebarRail, { DASHBOARD_CONTENT_OFFSET } from "@/components/dashboard/sidebarRail";
import { PAGE_ROUTES } from "@/constant/page-routes";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Home is the public landing page: render it with only the site header
  if (pathname === PAGE_ROUTES.HOME) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,#E4E8FF_0%,#FFFFFF_50%)]">
      <SidebarRail />
      <div className={DASHBOARD_CONTENT_OFFSET}>
        <ChatShell>{children}</ChatShell>
      </div>
    </div>
  );
}
