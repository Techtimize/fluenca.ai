
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { ChevronDown } from "lucide-react";
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
  { label: "Blog", href: PAGE_ROUTES.BLOG },
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

  const loggedIn =
    mounted && (isAuthenticated || Boolean(accessToken?.trim()));

  const handleLogout = () => {
    clearAuthTokenProvider();
    window.location.replace(PAGE_ROUTES.LOGIN);
  };

  return (
    <header className="sticky top-0 z-50 flex w-full justify-center pt-4">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between rounded-full bg-white/80 px-4 pr-2 transition-[background-color,box-shadow] duration-300 md:h-[60px] md:pl-5 backdrop-blur-xl shadow-sm"
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
            className="h-10 w-auto"
          />

          <span className="text-lg font-semibold tracking-tight">
            Fluenca<span className="text-[#5452F6]">.ai</span>
          </span>
        </Link>

        {/* Navigation links */}
        <ul className="flex items-center gap-3 overflow-x-auto sm:gap-6">
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
        <div className="flex shrink-0 items-center gap-2">
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
      </nav>
    </header>
  );
}
