"use client";

import type { ReactNode } from "react";
import SidebarRail, { DASHBOARD_CONTENT_OFFSET } from "@/components/dashboard/sidebarRail";
import { PAGE_ROUTES } from "@/constant/page-routes";
import type { NavItem } from "@/types/dashboard";

const SUPERADMIN_NAV: NavItem[] = [
  { id: "users", label: "Users", icon: "users", href: PAGE_ROUTES.SUPERADMIN_USERS },
];

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,#E4E8FF_0%,#FFFFFF_50%)]">
      <SidebarRail items={SUPERADMIN_NAV} />
      <div className={DASHBOARD_CONTENT_OFFSET}>{children}</div>
    </div>
  );
}
