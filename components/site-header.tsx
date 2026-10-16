
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { BrandButton } from "@/components/ui/brand-button";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { clearAuthTokenProvider } from "@/provider/auth-provider";
import useAuthStore from "@/store/AuthsStore";

export interface SiteNavigationItem {
  label?: string;
  href?: string;
  hasMenu?: boolean;
}

export interface SiteHeaderProps {
  navigationItems?: readonly SiteNavigationItem[];
  variant?: "light" | "dark";
}

const DEFAULT_NAV: readonly SiteNavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Agents", href: PAGE_ROUTES.AGENTS },
  // { label: "Blog", href: PAGE_ROUTES.BLOG },
  { label: "Plans", href: PAGE_ROUTES.PLANS },
];

export const SITE_HEADER_ROUTES: readonly string[] = [
  "/",
  ...DEFAULT_NAV.map(({ href }) => href ?? "").filter(Boolean),
];

const subscribeNoop = () => () => {};

function useHydrated() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

export function SiteHeader({
  navigationItems = DEFAULT_NAV,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const accessToken = useAuthStore((s) => s.access_token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const mounted = useHydrated();
  // Keyed to the path so navigating closes the mobile menu without an effect.
  const [menuOpenedAt, setMenuOpenedAt] = useState<string | null>(null);
  const menuOpen = menuOpenedAt === pathname;
  const setMenuOpen = (open: boolean) => setMenuOpenedAt(open ? pathname : null);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpenedAt(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const loggedIn =
    mounted && (isAuthenticated || Boolean(accessToken?.trim()));

  const handleLogout = () => {
    clearAuthTokenProvider();
    window.location.replace(PAGE_ROUTES.LOGIN);
  };

  return (
    <header className="sticky top-0 z-50 flex w-full justify-center px-3 pt-3 sm:px-4 md:pt-4">
      <nav
        aria-label="Main navigation"
        className="relative mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 rounded-full bg-white/80 pl-3 pr-2 shadow-sm backdrop-blur-xl transition-[background-color,box-shadow] duration-300 sm:pl-4 md:h-[60px] md:pl-5"
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="Fluenca home"
          className="flex shrink-0 items-center gap-2"
        >
          <Image
            src="/assets/Logo.svg"
            alt="Fluenca Logo"
            width={40}
            height={48}
            priority
            className="h-8 w-auto md:h-10"
          />

          <span className="text-base font-semibold tracking-tight md:text-lg">
            Fluenca<span className="text-[#5452F6]">.ai</span>
          </span>
        </Link>

        {/* Navigation links (desktop; mobile uses the menu below) */}
        <ul className="hidden items-center gap-6 md:flex">
          {navigationItems.map(({ label, href, hasMenu }) => {
            const isActive = href === pathname;

            return (
              <li key={label} className="shrink-0">
                <Link
                  href={href ?? "#"}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-1 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#5452F6]"
                      : "text-gray-700 hover:text-[#5452F6]"
                  }`}
                >
                  {label}

                  {hasMenu && (
                    <ChevronDown
                      aria-hidden="true"
                      className="size-4"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Authentication buttons */}
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          {loggedIn ? (
            <>
              <BrandButton
                type="button"
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </BrandButton>
              <BrandButton href={PAGE_ROUTES.DASHBOARD}>Dashboard</BrandButton>
            </>
          ) : pathname !== PAGE_ROUTES.DEMO ? (
            <BrandButton href={PAGE_ROUTES.DEMO}>Book a Demo</BrandButton>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="site-mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="grid size-10 shrink-0 place-items-center rounded-full text-gray-800 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5452F6]/40 md:hidden"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        {menuOpen ? (
          <div
            id="site-mobile-menu"
            className="absolute inset-x-0 top-full mt-2 rounded-3xl border border-gray-100 bg-white p-2 shadow-lg md:hidden"
          >
            <ul className="space-y-0.5">
              {navigationItems.map(({ label, href }) => {
                const isActive = href === pathname;
                return (
                  <li key={label}>
                    <Link
                      href={href ?? "#"}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setMenuOpen(false)}
                      className={`flex h-12 items-center rounded-2xl px-4 text-[15px] font-medium transition-colors ${
                        isActive
                          ? "bg-[#EEF0FF] text-[#5452F6]"
                          : "text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-2 flex flex-col gap-2 border-t border-gray-100 px-2 pb-2 pt-3">
              {loggedIn ? (
                <>
                  <BrandButton href={PAGE_ROUTES.DASHBOARD} className="w-full">
                    Dashboard
                  </BrandButton>
                  <BrandButton
                    type="button"
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full"
                  >
                    Logout
                  </BrandButton>
                </>
              ) : pathname !== PAGE_ROUTES.DEMO ? (
                <BrandButton href={PAGE_ROUTES.DEMO} className="w-full">
                  Book a Demo
                </BrandButton>
              ) : null}
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
