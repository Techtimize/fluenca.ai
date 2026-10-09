"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, LogOut, Menu, X } from "lucide-react";
import AssetImage from "@/components/shared/assetImage";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import type { NavItem } from "@/types/dashboard";
import { getIcon } from "@/utils/icon-utils";
import { FOCUS_RING } from "@/utils/ui-classes";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { clearAuthTokenProvider } from "@/provider/auth-provider";

const STORAGE_KEY = "fluenca-sidebar-collapsed";
const COLLAPSED_PAD = "5.5rem";
const EXPANDED_PAD = "15.5rem";

const DEFAULT_NAV: NavItem[] = [
  { id: "home", label: "Home", icon: "home", href: PAGE_ROUTES.DASHBOARD },
  { id: "trends", label: "Trends", icon: "trending", href: PAGE_ROUTES.TRENDS },
  { id: "dna", label: "Company DNA", icon: "dna", href: PAGE_ROUTES.DNA },
  {
    id: "content-recommendation",
    label: "Content recommendation",
    icon: "lightbulb",
    href: PAGE_ROUTES.CONTENT_RECOMMENDATION,
  },
  { id: "script", label: "Script", icon: "file", href: PAGE_ROUTES.SCRIPT },
  { id: "content", label: "Content", icon: "layers", href: PAGE_ROUTES.CONTENT },
  { id: "blogs", label: "Blogs", icon: "clipboard", href: PAGE_ROUTES.BLOGS },
  {
    id: "competitors",
    label: "Competitor analysis",
    icon: "chart",
    href: PAGE_ROUTES.COMPETITOR_ANALYSIS,
  },
  { id: "calendar", label: "Calendar", icon: "calendar", href: PAGE_ROUTES.CALENDAR },
  {
    id: "controls",
    label: "Controls",
    icon: "sliders",
    href: PAGE_ROUTES.CONTROLS,
  },
  {
    id: "social",
    label: "Social profiles",
    icon: "users",
    href: PAGE_ROUTES.SOCIAL,
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: "plug",
    href: PAGE_ROUTES.INTEGRATIONS,
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

function setContentPad(collapsed: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty(
    "--sidebar-content-pad",
    collapsed ? COLLAPSED_PAD : EXPANDED_PAD,
  );
}

export const DASHBOARD_CONTENT_OFFSET =
  "px-4 pb-10 pt-16 sm:px-6 md:pt-4 md:ps-[var(--sidebar-content-pad,5.5rem)] lg:pe-8 transition-[padding] duration-200";

export default function SidebarRail({ items = DEFAULT_NAV, logoSrc = "/assets/Logo.svg" }: Props) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("common");
  const tNav = useTranslations("nav");
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isRtl = locale === "ar";

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const nextCollapsed = stored === null ? true : stored === "true";
      setCollapsed(nextCollapsed);
      setContentPad(nextCollapsed);
    } catch {
      setContentPad(true);
    }
  }, []);

  useEffect(() => {
    setContentPad(collapsed);
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed));
    } catch {
      console.error("Error saving sidebar collapsed state");
    }
  }, [collapsed]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    clearAuthTokenProvider();
    window.location.replace(PAGE_ROUTES.LOGIN);
  };

  const toggleCollapsed = () => setCollapsed((prev) => !prev);

  const resolveLabel = (item: NavItem) =>
    tNav.has(item.id) ? tNav(item.id as "home") : item.label;

  const renderLinks = (opts: { showLabels: boolean; onNavigate?: () => void }) =>
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
            <Icon className="size-[18px] shrink-0" />
            {opts.showLabels ? <span className="truncate">{label}</span> : null}
          </Link>
        </li>
      );
    });

  const ExpandIcon = isRtl ? ChevronLeft : ChevronRight;
  const CollapseIcon = isRtl ? ChevronRight : ChevronLeft;

  return (
    <>
      <button
        type="button"
        aria-label={t("openNav")}
        onClick={() => setMobileOpen(true)}
        className={`fixed start-4 top-4 z-30 grid size-10 place-items-center rounded-full border border-[#E6E8F5] bg-white text-neutral-700 shadow-sm md:hidden ${FOCUS_RING}`}
      >
        <Menu className="size-4" />
      </button>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label={t("closeNav")}
            className="absolute inset-0 bg-neutral-950/30"
            onClick={() => setMobileOpen(false)}
          />
          <nav
            aria-label="Main"
            className="absolute bottom-4 start-4 top-4 flex w-[min(18rem,calc(100vw-2rem))] flex-col rounded-3xl border border-[#E6E8F5] bg-white p-4 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AssetImage src={logoSrc} alt={t("brand")} width={28} height={28} />
                <span className="text-sm font-semibold text-neutral-900">{t("brand")}</span>
              </div>
              <button
                type="button"
                aria-label={t("closeNav")}
                onClick={() => setMobileOpen(false)}
                className={`grid size-8 place-items-center rounded-full text-neutral-600 hover:bg-neutral-100 ${FOCUS_RING}`}
              >
                <X className="size-4" />
              </button>
            </div>
            <ul className="flex-1 space-y-1.5 overflow-y-auto">
              {renderLinks({ showLabels: true, onNavigate: () => setMobileOpen(false) })}
            </ul>
            <button
              type="button"
              onClick={handleLogout}
              className={`mt-3 flex w-full items-center gap-3 rounded-2xl bg-[#5B57E6] px-3 py-2.5 text-sm font-medium text-white hover:bg-[#4A46D0] ${FOCUS_RING}`}
            >
              <LogOut className="size-[18px]" />
              {t("logout")}
            </button>
          </nav>
        </div>
      ) : null}

      <nav
        aria-label="Main"
        className={`fixed bottom-4 start-4 top-4 z-20 hidden flex-col border border-[#E6E8F5] bg-white py-4 transition-[width,border-radius,padding] duration-200 md:flex ${
          collapsed ? "w-14 items-center rounded-full px-0" : "w-56 rounded-3xl px-3"
        }`}
      >
        <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3 px-1"}`}>
          <AssetImage src={logoSrc} alt={t("brand")} width={28} height={28} />
          {!collapsed ? (
            <span className="truncate text-sm font-semibold text-neutral-900">{t("brand")}</span>
          ) : null}
        </div>

        <ul className={`mt-8 flex-1 space-y-1.5 overflow-y-auto ${collapsed ? "" : "w-full"}`}>
          {renderLinks({ showLabels: !collapsed })}
        </ul>

        <div className={`mt-auto flex gap-2 ${collapsed ? "flex-col items-center" : "w-full flex-col"}`}>
          <button
            type="button"
            aria-label={collapsed ? t("expandSidebar") : t("collapseSidebar")}
            onClick={toggleCollapsed}
            className={`${FOCUS_RING} ${
              collapsed
                ? "grid size-10 place-items-center rounded-full text-neutral-600 hover:bg-neutral-100"
                : "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            {collapsed ? <ExpandIcon className="size-4" /> : <CollapseIcon className="size-[18px]" />}
            {!collapsed ? <span>{t("collapse")}</span> : null}
          </button>

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
            <LogOut className="size-[18px]" />
            {!collapsed ? <span>{t("logout")}</span> : null}
          </button>
        </div>
      </nav>
    </>
  );
}
