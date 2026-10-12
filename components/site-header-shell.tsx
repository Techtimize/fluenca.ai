"use client";

import { usePathname } from "next/navigation";
import { SITE_HEADER_ROUTES, SiteHeader } from "@/components/site-header";

export function SiteHeaderShell() {
  const pathname = usePathname();
  const showHeader = SITE_HEADER_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  return showHeader ? <SiteHeader /> : null;
}
