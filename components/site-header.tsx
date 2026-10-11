import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { PAGE_ROUTES } from "@/constant/page-routes";

export interface SiteNavigationItem {
  label?: string;
  href?: string;
  hasMenu?: boolean;
}

export interface SiteHeaderProps {
  navigationItems?: readonly SiteNavigationItem[];
  signupHref?: string;
  signupLabel?: string;
  /** Kept for call-site compatibility; navbar is always white */
  variant?: "light" | "dark";
}

const DEFAULT_NAV: readonly SiteNavigationItem[] = [
  { label: "Agents", href: "/agents", hasMenu: true },
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
  { label: "Use case", href: "/use-cases" },
];

export function SiteHeader({
  navigationItems = DEFAULT_NAV,
  signupHref = PAGE_ROUTES.SIGNUP,
  signupLabel = "Sign up",
}: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 sm:px-5 sm:pt-4 lg:px-8">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-3 rounded-full border border-black/5 bg-white px-3 shadow-lg shadow-black/10 sm:h-[4.5rem] sm:gap-4 sm:px-4 lg:h-20 lg:px-5">
        {/* Logo — start */}
        <Link
          href={PAGE_ROUTES.HOME}
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
            {navigationItems.map(({ label, href, hasMenu }) => (
              <li key={label}>
                <Link
                  href={href ?? "#"}
                  className="flex h-10 items-center gap-1 whitespace-nowrap rounded-full px-3 font-body text-sm font-medium text-ink transition-colors hover:bg-black/5 sm:h-11 sm:px-4 lg:px-5"
                >
                  {label}
                  {hasMenu && (
                    <ChevronDown aria-hidden="true" className="size-3.5" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sign up — end */}
        <Link
          href={signupHref}
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-brand px-4 font-body text-sm font-semibold text-white shadow-[0_3px_0_#bfc1ff] transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:h-11 sm:px-6 lg:px-7"
        >
          {signupLabel}
        </Link>
      </div>
    </header>
  );
}
