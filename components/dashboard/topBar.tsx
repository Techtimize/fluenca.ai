"use client";

import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import AssetImage from "@/components/shared/assetImage";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { PAGE_ROUTES } from "@/constant/page-routes";
import type { UserSummary } from "@/types/dashboard";
import { FOCUS_RING } from "@/utils/ui-classes";

type Props = {
  user: UserSummary;
  onSearch?: (query: string) => void;
  placeholder?: string;
  showLanguageSwitcher?: boolean;
};

export default function TopBar({
  user,
  onSearch,
  placeholder,
  showLanguageSwitcher = true,
}: Props) {
  const t = useTranslations("common");
  const tTop = useTranslations("topBar");
  const resolvedPlaceholder = placeholder ?? tTop("searchPortal");

  return (
    <header className="mb-4 flex items-center gap-4">
      <form
        role="search"
        className="relative flex-1 md:max-w-xl"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch?.(String(new FormData(e.currentTarget).get("q") ?? ""));
        }}
      >
        <Search className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
        <input
          name="q"
          type="search"
          placeholder={resolvedPlaceholder}
          aria-label={t("search")}
          className="h-11 w-full rounded-full border border-[#E6E8F5] bg-white pe-4 ps-11 text-sm outline-none placeholder:text-neutral-500 focus:ring-2 focus:ring-[#5B57E6]/30"
        />
      </form>

      <div className="ms-auto flex items-center gap-3">
        {showLanguageSwitcher ? <LanguageSwitcher variant="light" className="hidden sm:inline-flex" /> : null}
        {showLanguageSwitcher ? <LanguageSwitcher variant="light" compact className="sm:hidden" /> : null}
        <button
          type="button"
          aria-label={t("notifications")}
          className={`grid size-10 place-items-center rounded-full border border-[#E6E8F5] bg-white text-neutral-700 hover:bg-neutral-50 ${FOCUS_RING}`}
        >
          <Bell className="size-4" />
        </button>
        <Link
          href={PAGE_ROUTES.COMPANY_OVERVIEW}
          aria-label={`${user.name} · Company overview`}
          title="Company overview"
          className={`shrink-0 rounded-full transition-opacity hover:opacity-90 ${FOCUS_RING}`}
        >
          {user.avatarSrc ? (
            <AssetImage
              src={user.avatarSrc}
              alt={user.name}
              width={40}
              height={40}
              className="size-10 rounded-full object-cover"
            />
          ) : (
            <span className="grid size-10 place-items-center rounded-full bg-[#5B57E6] text-sm font-semibold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
