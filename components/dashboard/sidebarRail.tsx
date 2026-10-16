"use client";

import Link from "next/link";
import { useState, type FocusEvent } from "react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { LogOut, Menu, X } from "lucide-react";
import AssetImage from "@/components/shared/assetImage";
import SidebarProfile from "@/components/dashboard/sidebarProfile";
import type { NavItem } from "@/types/dashboard";
import { getIcon } from "@/utils/icon-utils";
import { FOCUS_RING } from "@/utils/ui-classes";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { clearAuthTokenProvider } from "@/provider/auth-provider";


export const DEFAULT_NAV: NavItem[] = [
  { id: "home", label: "Home", icon: "home", href: PAGE_ROUTES.DASHBOARD },
  {
    id: "content",
    label: "Content",
    icon: "lightbulb",
    href: PAGE_ROUTES.CONTENT_RECOMMENDATION,
  },
  { id: "script", label: "Script", icon: "file", href: PAGE_ROUTES.SCRIPT },
  {
    id: "content",
    label: "Content",
    icon: "layers",
    href: PAGE_ROUTES.CONTENT,
  },
  {
    id: "ai-visibility",
    label: "AI visibility",
    icon: "radar",
    href: PAGE_ROUTES.AI_VISIBILITY,
  },
  {
    id: "competitors",
    label: "Competitor analysis",
    icon: "chart",
    href: PAGE_ROUTES.COMPETITOR_ANALYSIS,
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: "calendar",
    href: PAGE_ROUTES.CALENDAR,
  },
  {
    id: "controls",
    label: "Controls",
    icon: "sliders",
    href: PAGE_ROUTES.CONTROLS,
  },
  {
    id: "connectors",
    label: "Connectors",
    icon: "plug",
    href: PAGE_ROUTES.CONNECTORS,
  },
  // { id: "trends", label: "Trends", icon: "trending", href: PAGE_ROUTES.TRENDS },
  {
    id: "analytics",
    label: "Analytics",
    icon: "activity",
    href: PAGE_ROUTES.ANALYTICS,
  },
];

type Props = {
  items?: NavItem[];
  logoSrc?: string;
};

function isActivePath(pathname: string, href: string) {
  if (!href || href === "#") return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export const DASHBOARD_CONTENT_OFFSET =
  // The rail is always collapsed in the layout; on hover it expands over the content, so this never changes.
  "max-w-full overflow-x-clip px-3 pb-10 pt-[4.5rem] sm:px-6 md:pt-4 md:ps-[5.5rem] lg:pe-8";

export default function SidebarRail({
  items = DEFAULT_NAV,
  logoSrc = "/assets/Logo.svg",
}: Props) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("common");
  const tNav = useTranslations("nav");
  // Open while the pointer is over the rail or keyboard focus is inside it.
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const collapsed = !(hovered || focused);
  const onBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
  };

  const [mobileOpenedAt, setMobileOpenedAt] = useState<string | null>(null);
  const mobileOpen = mobileOpenedAt === pathname;
  const setMobileOpen = (open: boolean) =>
    setMobileOpenedAt(open ? pathname : null);
  const isRtl = locale === "ar";

  const handleLogout = () => {
    clearAuthTokenProvider();
    window.location.replace(PAGE_ROUTES.LOGIN);
  };

  const onProfile = isActivePath(pathname, PAGE_ROUTES.PROFILE);

  const resolveLabel = (item: NavItem) =>
    tNav.has(item.id) ? tNav(item.id as "home") : item.label;

  const renderLinks = (opts: {
    showLabels: boolean;
    onNavigate?: () => void;
  }) =>
    items.map((item) => {
      const Icon = getIcon(item.icon);
      const active = isActivePath(pathname, item.href);
      const label = resolveLabel(item);
      return (
        <li key={item.id}>
          <Link
            href={item.href}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            title={label}
            onClick={opts.onNavigate}
            className={`${FOCUS_RING} ${
              opts.showLabels
                ? "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium"
                : "grid size-10 place-items-center rounded-full"
            } transition-colors ${
              active
                ? "bg-[#ECEBFF] text-[#5B57E6]"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
            }`}
          >
            <Icon className="size-4.5 shrink-0" />
            {opts.showLabels ? <span className="truncate">{label}</span> : null}
          </Link>
        </li>
      );
    });

  return (
    <>
      {/* Mobile: a fixed bar so the menu button never floats over scrolling content */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-3 border-b border-[#E6E8F5] bg-white/90 px-3 backdrop-blur-md md:hidden">
        <button
          type="button"
          aria-label={t("openNav")}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
          className={`grid size-10 place-items-center rounded-full text-neutral-700 hover:bg-neutral-100 ${FOCUS_RING}`}
        >
          <Menu className="size-5" />
        </button>
        <Link
          href={PAGE_ROUTES.DASHBOARD}
          className={`flex min-w-0 items-center gap-2 rounded-lg ${FOCUS_RING}`}
        >
          <AssetImage src={logoSrc} alt="" width={26} height={26} />
          <span className="truncate text-sm font-semibold text-neutral-900">
            {t("brand")}
          </span>
        </Link>
      </header>

      <DialogPrimitive.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Backdrop className="fixed inset-0 z-40 bg-neutral-950/30 duration-150 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 md:hidden" />
          <DialogPrimitive.Popup
            className={`fixed inset-y-0 inset-s-0 z-50 flex w-[min(18rem,calc(100vw-3rem))] flex-col bg-white px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 shadow-xl outline-none duration-200 data-open:animate-in data-closed:animate-out md:hidden ${
              isRtl
                ? "data-open:slide-in-from-right data-closed:slide-out-to-right"
                : "data-open:slide-in-from-left data-closed:slide-out-to-left"
            }`}
          >
            <div className="mb-3 flex h-11 items-center justify-between gap-3 px-1">
              <DialogPrimitive.Title className="flex min-w-0 items-center gap-2.5 text-sm font-semibold text-neutral-900">
                <AssetImage src={logoSrc} alt="" width={26} height={26} />
                <span className="truncate">{t("brand")}</span>
              </DialogPrimitive.Title>
              <DialogPrimitive.Close
                aria-label={t("closeNav")}
                className={`grid size-10 place-items-center rounded-full text-neutral-600 hover:bg-neutral-100 ${FOCUS_RING}`}
              >
                <X className="size-5" />
              </DialogPrimitive.Close>
            </div>
            <nav aria-label="Main" className="min-h-0 flex-1 overflow-y-auto">
              <ul className="space-y-1">
                {renderLinks({
                  showLabels: true,
                  onNavigate: () => setMobileOpen(false),
                })}
              </ul>
            </nav>
            <div className="mt-3 border-t border-[#EEF0F6] pt-3">
              <SidebarProfile active={onProfile} onNavigate={() => setMobileOpen(false)} />
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className={`mt-3 flex w-full items-center gap-3 rounded-2xl bg-[#5B57E6] px-3 py-3 text-sm font-medium text-white hover:bg-[#4A46D0] ${FOCUS_RING}`}
            >
              <LogOut className="size-4.5" />
              {t("logout")}
            </button>
          </DialogPrimitive.Popup>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <nav
        aria-label="Main"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={onBlur}
        className={`fixed bottom-4 inset-s-4 top-4 z-40 hidden flex-col overflow-hidden border border-[#E6E8F5] bg-white py-4 transition-[width,border-radius,padding,box-shadow] duration-200 ease-out md:flex ${
          collapsed
            ? "w-14 items-center rounded-full px-0"
            : "w-56 rounded-3xl px-3 shadow-[0_16px_40px_-12px_rgba(15,23,42,0.25)]"
        }`}
      >
        <div
          className={`flex items-center ${collapsed ? "justify-center" : "gap-3 px-1"}`}
        >
          <AssetImage src={logoSrc} alt={t("brand")} width={28} height={28} />
          {!collapsed ? (
            <span className="truncate text-sm font-semibold text-neutral-900">
              {t("brand")}
            </span>
          ) : null}
        </div>

        <ul
          className={`mt-8 flex-1 space-y-1.5 overflow-y-auto ${collapsed ? "" : "w-full"}`}
        >
          {renderLinks({ showLabels: !collapsed })}
        </ul>

        <div
          className={`mt-auto flex gap-2 ${collapsed ? "flex-col items-center" : "w-full flex-col"}`}
        >
          <div className={`mb-1 border-t border-[#EEF0F6] pt-3 ${collapsed ? "flex w-full justify-center" : "w-full"}`}>
            <SidebarProfile compact={collapsed} active={onProfile} />
          </div>
          <button
            type="button"
            onClick={handleLogout}
            aria-label={t("logout")}
            className={`${FOCUS_RING} ${
              collapsed
                ? "grid size-10 cursor-pointer place-items-center rounded-full bg-[#5B57E6] text-white hover:bg-[#4A46D0]"
                : "flex w-full items-center gap-3 rounded-2xl bg-[#5B57E6] px-3 py-2.5 text-sm font-medium text-white hover:bg-[#4A46D0]"
            }`}
          >
            <LogOut className="size-4.5" />
            {!collapsed ? <span>{t("logout")}</span> : null}
          </button>
        </div>
      </nav>
    </>
  );
}
