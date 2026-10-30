"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FocusEvent } from "react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Menu, Power, X } from "lucide-react";
import AssetImage from "@/components/shared/assetImage";
import SidebarProfile from "@/components/dashboard/sidebarProfile";
import type { NavItem } from "@/types/dashboard";
import { getIcon } from "@/utils/icon-utils";
import { FOCUS_RING } from "@/utils/ui-classes";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { clearAuthTokenProvider } from "@/provider/auth-provider";

const LOGOUT_BG =
  "bg-[#4F5BFF] shadow-[0_6px_16px_-8px_rgba(84,90,255,0.7)] transition-opacity hover:opacity-90";

const LOGOUT_STYLE = { backgroundImage: "linear-gradient(135deg, #3659FF 0%, #8157F7 100%)" };

export const DEFAULT_NAV: NavItem[] = [
  { id: "home", label: "Home", icon: "home", href: PAGE_ROUTES.DASHBOARD },
  {
    id: "content-ideas",
    label: "Ideas",
    icon: "lightbulb",
    href: PAGE_ROUTES.CONTENT_RECOMMENDATION,
  },
  { id: "script", label: "Script", icon: "file", href: PAGE_ROUTES.SCRIPT },
  {
    id: "visuals",
    label: "Visuals",
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
  { id: "news", label: "News", icon: "news", href: PAGE_ROUTES.NEWS },
  { id: "prospects", label: "Prospects", icon: "target", href: PAGE_ROUTES.PROSPECTS },
  // { id: "linkedin-growth", label: "LinkedIn growth", icon: "trending", href: PAGE_ROUTES.LINKEDIN_GROWTH },
  // { id: "linkedin-coach", label: "LinkedIn coach", icon: "clipboard", href: PAGE_ROUTES.LINKEDIN_COACH },
];

type Props = {
  items?: NavItem[];
  logoSrc?: string;
};

function isActivePath(pathname: string, href: string) {
  if (!href || href === "#") return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

const OPEN_DELAY_MS = 80;
const CLOSE_DELAY_MS = 180;

const railLabel = (expanded: boolean) =>
  `min-w-0 truncate whitespace-nowrap transition-opacity duration-200 ${expanded ? "opacity-100 delay-100" : "opacity-0"}`;

export const DASHBOARD_CONTENT_OFFSET =
  "max-w-full overflow-x-clip px-3 pb-10 pt-[4.5rem] sm:px-6 md:pt-4 md:ps-24 lg:pe-8";

export default function SidebarRail({
  items = DEFAULT_NAV,
  logoSrc = "/assets/Logo.svg",
}: Props) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("common");
  const tNav = useTranslations("nav");

  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const expanded = hovered || focused;
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleHover = (next: boolean) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setHovered(next), next ? OPEN_DELAY_MS : CLOSE_DELAY_MS);
  };
  useEffect(
    () => () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    },
    [],
  );
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
              style={LOGOUT_STYLE}
              className={`mt-3 flex w-full items-center gap-3 rounded-2xl ${LOGOUT_BG} px-3 py-3 text-sm font-medium text-white ${FOCUS_RING}`}
            >
              <Power className="size-4.5" aria-hidden="true" />
              {t("logout")}
            </button>
          </DialogPrimitive.Popup>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      {/*
        Desktop rail. Its shape and row layout never change: every row keeps its icon in a fixed
        46px column, so widening the rail only reveals the labels. Only the width animates.
      */}
      <nav
        aria-label="Main"
        onMouseEnter={() => scheduleHover(true)}
        onMouseLeave={() => scheduleHover(false)}
        onFocus={() => setFocused(true)}
        onBlur={onBlur}
        className={`fixed bottom-4 inset-s-4 top-4 z-40 hidden flex-col overflow-hidden rounded-[32px] border border-[#E6E8F5] bg-white px-2 py-4 transition-[width,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[width] motion-reduce:transition-none md:flex ${
          expanded ? "w-60 shadow-[0_16px_40px_-12px_rgba(15,23,42,0.25)]" : "w-16 shadow-none"
        }`}
      >
        <div className="flex h-10 shrink-0 items-center">
          <span className="grid w-11.5 shrink-0 place-items-center">
            <AssetImage src={logoSrc} alt={t("brand")} width={28} height={28} />
          </span>
          <span className={`text-sm font-semibold text-neutral-900 ${railLabel(expanded)}`} aria-hidden="true">
            {t("brand")}
          </span>
        </div>

        <ul className="mt-6 min-h-0 flex-1 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-none [&::-webkit-scrollbar]:hidden">
          {items.map((item) => {
            const Icon = getIcon(item.icon);
            const active = isActivePath(pathname, item.href);
            const label = resolveLabel(item);
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  aria-label={label}
                  aria-current={active ? "page" : undefined}
                  title={expanded ? undefined : label}
                  className={`flex h-11 w-full items-center rounded-full text-sm font-medium transition-colors ${FOCUS_RING} ${
                    active
                      ? "bg-[#ECEBFF] text-[#5B57E6]"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                  }`}
                >
                  <span className="grid w-11.5 shrink-0 place-items-center">
                    <Icon className="size-4.5" />
                  </span>
                  <span className={`pe-3 ${railLabel(expanded)}`} aria-hidden="true">
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-3 shrink-0 space-y-2 border-t border-[#EEF0F6] pt-3">
          <SidebarProfile rail expanded={expanded} active={onProfile} />
          <button
            type="button"
            onClick={handleLogout}
            aria-label={t("logout")}
            style={LOGOUT_STYLE}
            className={`flex h-11 w-full cursor-pointer items-center rounded-full text-sm font-medium text-white ${LOGOUT_BG} ${FOCUS_RING}`}
          >
            <span className="grid w-11.5 shrink-0 place-items-center">
              <Power className="size-4.5" aria-hidden="true" />
            </span>
            <span className={`pe-3 ${railLabel(expanded)}`} aria-hidden="true">
              {t("logout")}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
