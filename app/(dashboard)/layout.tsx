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

  // Company DNA is shown without the sidebar
  const hideSidebar = pathname === PAGE_ROUTES.DNA;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,#E4E8FF_0%,#FFFFFF_50%)]">
      {hideSidebar ? null : <SidebarRail />}
      <div
        className={
          hideSidebar
            ? "max-w-full overflow-x-clip px-3 pb-10 pt-4 sm:px-6 lg:px-8"
            : DASHBOARD_CONTENT_OFFSET
        }
      >
        <ChatShell>{children}</ChatShell>
      </div>
    </div>
  );
}
