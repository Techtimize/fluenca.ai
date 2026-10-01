"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import AssetImage from "@/components/shared/assetImage";
import type { NavItem } from "@/types/dashboard";
import { getIcon } from "@/utils/icon-utils";
import { FOCUS_RING } from "@/utils/ui-classes";
import { PAGE_ROUTES } from "@/constant/page-routes";

const DEFAULT_NAV: NavItem[] = [
  { id: "home", label: "Home", icon: "home", href: PAGE_ROUTES.DASHBOARD },
  { id: "dashboard", label: "Dashboard", icon: "dashboard", href: "#" },
  { id: "trends", label: "Trends", icon: "trending", href: PAGE_ROUTES.TRENDS },
  { id: "overview", label: "Company overview", icon: "clipboard", href: PAGE_ROUTES.COMPANY_OVERVIEW },
  { id: "dna", label: "Company DNA", icon: "dna", href: PAGE_ROUTES.DNA },
  { id: "billing", label: "Billing", icon: "billing", href: "#" },
];

type Props = {
  items?: NavItem[];
  logoSrc?: string;
  onLogout?: () => void;
};

export default function SidebarRail({ items = DEFAULT_NAV, logoSrc = "/assets/Logo.svg", onLogout }: Props) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="fixed bottom-4 left-4 top-4 z-20 hidden w-14 flex-col items-center rounded-full border border-[#E6E8F5] bg-white py-4 md:flex"
    >
      <AssetImage src={logoSrc} alt="Influ" width={28} height={28} />
      <ul className="mt-8 space-y-2">
        {items.map((item) => {
          const Icon = getIcon(item.icon);
          const active = pathname === item.href;
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className={`grid size-10 place-items-center rounded-full transition-colors ${FOCUS_RING} ${
                  active ? "bg-[#ECEBFF] text-[#5B57E6]" : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <Icon className="size-[18px]" />
              </Link>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={onLogout}
        aria-label="Log out"
        className={`mt-auto grid size-10 place-items-center rounded-full bg-[#5B57E6] text-white hover:bg-[#4A46D0] ${FOCUS_RING}`}
      >
        <LogOut className="size-[18px]" />
      </button>
    </nav>
  );
}