"use client";

import { usePathname } from "next/navigation";
import { SITE_HEADER_ROUTES, SiteHeader } from "@/components/site-header";
import { PAGE_ROUTES } from "@/constant/page-routes";

const HIDDEN_ROUTES: readonly string[] = [PAGE_ROUTES.COMING_SOON];

function matches(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export function SiteHeaderShell() {
  const pathname = usePathname();
  const hidden = HIDDEN_ROUTES.some((route) => matches(pathname, route));
  const showHeader =
    !hidden && SITE_HEADER_ROUTES.some((route) => matches(pathname, route));

  return showHeader ? <SiteHeader /> : null;
}
