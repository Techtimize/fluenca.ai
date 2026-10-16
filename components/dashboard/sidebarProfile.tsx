"use client";

import Link from "next/link";
import AssetImage from "@/components/shared/assetImage";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { UserProfileQuery } from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";
import { FOCUS_RING } from "@/utils/ui-classes";

/** The signed-in user, linking to the profile page. Compact shows just the avatar for the collapsed rail. */
export default function SidebarProfile({
  compact = false,
  active = false,
  onNavigate,
}: {
  compact?: boolean;
  active?: boolean;
  onNavigate?: () => void;
}) {
  const companyName = useAuthStore((s) => s.company_name);
  const { data } = UserProfileQuery();
  const user = data?.data?.user;
  const name = user?.full_name || companyName || "Your profile";
  const email = user?.email;
  const avatar = user?.avatar_url;
  const initial = name.charAt(0).toUpperCase();

  const picture = avatar ? (
    <AssetImage src={avatar} alt="" width={36} height={36} className="size-9 shrink-0 rounded-full object-cover" />
  ) : (
    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#5B57E6] text-sm font-semibold text-white">
      {initial}
    </span>
  );

  if (compact) {
    return (
      <Link
        href={PAGE_ROUTES.PROFILE}
        aria-label={`${name} · Profile`}
        aria-current={active ? "page" : undefined}
        title={name}
        onClick={onNavigate}
        className={`grid size-10 place-items-center rounded-full transition-shadow ${
          active ? "ring-2 ring-[#5B57E6] ring-offset-2" : "hover:ring-2 hover:ring-[#E3E6FF]"
        } ${FOCUS_RING}`}
      >
        {picture}
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
