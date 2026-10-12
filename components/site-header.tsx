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
  signupHref?: string;
  signupLabel?: string;
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
  signupHref = PAGE_ROUTES.SIGNUP,
  signupLabel = "Sign up",
}: SiteHeaderProps) {
  const pathname = usePathname();
  const accessToken = useAuthStore((s) => s.access_token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const mounted = useHydrated();

  const loggedIn = mounted && (isAuthenticated || Boolean(accessToken?.trim()));

  const handleLogout = () => {
    clearAuthTokenProvider();
    window.location.replace(PAGE_ROUTES.LOGIN);
  };

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 sm:px-5 sm:pt-4 lg:px-8">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-3 rounded-full border border-black/5 bg-white px-3 shadow-lg shadow-black/10 sm:h-[4.5rem] sm:gap-4 sm:px-4 lg:h-20 lg:px-5">
        {/* Logo — start */}
        <Link
          href="/"
          aria-label="Fluenca home"
          className="flex shrink-0 items-center gap-2 pl-1 sm:gap-2.5 sm:pl-2"
        >
          <Image
            src="/assets/Logo.svg"
            alt="Fluenca Logo"
            width={40}
            height={48}
            priority
            className="h-9 w-auto sm:h-10 lg:h-11"
          />
          <span className="text-[17px] font-semibold tracking-tight">
            Fluenca
            <span className="text-[#5452F6]">.ai</span>
          </span>
        </Link>

        {/* Pages — center */}
        <nav
          aria-label="Main navigation"
          className="min-w-0 flex-1 overflow-x-auto"
        >
          <ul className="mx-auto flex w-max max-w-full items-center justify-center gap-0.5 sm:gap-1">
            {navigationItems.map(({ label, href, hasMenu }) => {
              const isActive = href === pathname;
              return (
                <li key={label}>
                  <Link
                    href={href ?? "#"}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex h-10 items-center gap-1 whitespace-nowrap rounded-full px-3 font-body text-sm font-medium transition-colors sm:h-11 sm:px-4 lg:px-5 ${
                      isActive
                        ? "bg-[#5452F6]/10 text-[#5452F6]"
                        : "text-ink hover:bg-black/5"
                    }`}
                  >
                    {label}
                    {hasMenu && (
                      <ChevronDown aria-hidden="true" className="size-3.5" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Auth actions — end */}
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
          ) : (
            <BrandButton href={signupHref}>{signupLabel}</BrandButton>
          )}
        </div>
      </div>
    </header>
  );
}
