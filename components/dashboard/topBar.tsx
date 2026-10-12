"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import AssetImage from "@/components/shared/assetImage";
import { PAGE_ROUTES } from "@/constant/page-routes";
import type { UserSummary } from "@/types/dashboard";
import { FOCUS_RING } from "@/utils/ui-classes";

type Props = {
  user?: UserSummary;
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
  const displayName = user?.name || t("brand");
  const avatarSrc = user?.avatarSrc;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
      {/* Leaves room for the fixed mobile menu button on the start edge */}
      <div className="min-w-0 flex-1 ps-12 md:ps-0 md:max-w-xl">
        <form
          role="search"
          className="relative hidden md:block"
          onSubmit={(e) => {
            e.preventDefault();
            onSearch?.(String(new FormData(e.currentTarget).get("q") ?? ""));
          }}
        >
          <span className="sr-only">{resolvedPlaceholder}</span>
        </form>
      </div>

      <div className="ms-auto flex shrink-0 items-center gap-2 sm:gap-3">
        {showLanguageSwitcher ? (
          <>
            <LanguageSwitcher
              variant="light"
              className="hidden sm:inline-flex"
            />
            <LanguageSwitcher
              variant="light"
              compact
              className="sm:hidden"
            />
          </>
        ) : null}
        <Link
          href={PAGE_ROUTES.PROFILE}
          aria-label={`${displayName} · Profile`}
          title="Profile"
          className={`shrink-0 rounded-full transition-opacity hover:opacity-90 ${FOCUS_RING}`}
        >
          {avatarSrc ? (
            <AssetImage
              src={avatarSrc}
              alt={displayName}
              width={40}
              height={40}
              className="size-10 rounded-full object-cover"
            />
          ) : (
            <span className="grid size-10 place-items-center rounded-full bg-[#5B57E6] text-sm font-semibold text-white">
              {initial}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
