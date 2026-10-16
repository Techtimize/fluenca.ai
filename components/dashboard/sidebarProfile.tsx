"use client";

import Link from "next/link";
import AssetImage from "@/components/shared/assetImage";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { UserProfileQuery } from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";
import { FOCUS_RING } from "@/utils/ui-classes";

/** First letters of the first two words: "Acme Digital Labs" → "AD". */
function companyInitials(name: string) {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
  return letters || "?";
}

/**
 * The signed-in user, linking to the profile page.
 * In the desktop rail the row keeps one layout and only fades the text, so expanding never reflows it.
 */
export default function SidebarProfile({
  rail = false,
  expanded = true,
  active = false,
  onNavigate,
}: {
  rail?: boolean;
  /** Rail only: whether the rail is open and the name should show. */
  expanded?: boolean;
  active?: boolean;
  onNavigate?: () => void;
}) {
  const companyName = useAuthStore((s) => s.company_name);
  const { data } = UserProfileQuery();
  const user = data?.data?.user;
  const company = data?.data?.company;
  const name = user?.full_name || companyName || "Your profile";
  const email = user?.email;
  const logo = company?.logo_url;
  const initials = companyInitials(company?.name || companyName || name);

  // The company logo stands for the account; its initials are the fallback.
  const picture = logo ? (
    <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-white ring-1 ring-[#E6E8F5]">
      <AssetImage src={logo} alt="" width={36} height={36} className="size-7 object-contain" />
    </span>
  ) : (
    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#5B57E6] text-[13px] font-semibold text-white">
      {initials}
    </span>
  );

  if (rail) {
    return (
      <Link
        href={PAGE_ROUTES.PROFILE}
        aria-label={`${name} · Profile`}
        aria-current={active ? "page" : undefined}
        onClick={onNavigate}
        className={`flex h-12 w-full items-center rounded-full transition-colors ${
          active ? "bg-[#ECEBFF]" : "hover:bg-neutral-100"
        } ${FOCUS_RING}`}
      >
        <span className="grid w-11.5 shrink-0 place-items-center">{picture}</span>
        <span
          className={`min-w-0 flex-1 pe-3 transition-opacity duration-200 ${
            expanded ? "opacity-100 delay-100" : "opacity-0"
          }`}
          aria-hidden="true"
        >
          <span className="block truncate text-sm font-medium text-neutral-900">{name}</span>
          {email ? <span className="block truncate text-xs text-neutral-500">{email}</span> : null}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={PAGE_ROUTES.PROFILE}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={`flex w-full items-center gap-3 rounded-2xl px-2 py-2 transition-colors ${
        active ? "bg-[#ECEBFF]" : "hover:bg-neutral-100"
      } ${FOCUS_RING}`}
    >
      {picture}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-neutral-900">{name}</span>
        {email ? <span className="block truncate text-xs text-neutral-500">{email}</span> : null}
      </span>
    </Link>
  );
}
