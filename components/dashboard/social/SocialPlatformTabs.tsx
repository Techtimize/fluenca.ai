"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FacebookIcon } from "@/components/shared/brandIcons";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { FOCUS_RING } from "@/utils/ui-classes";
import { cn } from "cn";

const TABS = [
  {
    id: "instagram" as const,
    label: "Instagram",
    href: PAGE_ROUTES.SOCIAL_INSTAGRAM,
  },
  {
    id: "facebook" as const,
    label: "Facebook",
    href: PAGE_ROUTES.SOCIAL_FACEBOOK,
  },
  {
    id: "linkedin" as const,
    label: "LinkedIn",
    href: PAGE_ROUTES.SOCIAL_LINKEDIN,
  },
];

export function SocialPlatformTabs() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2">
      {TABS.map((tab) => {
        const active =
          pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              `inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-[13px] font-semibold transition-colors ${FOCUS_RING}`,
              active
                ? "bg-[#5B57E6] text-white"
                : "border border-[#E6E8F5] bg-white text-neutral-700 hover:bg-[#F6F7FD]",
            )}
          >
            {tab.id === "facebook" ? (
              <FacebookIcon className="size-4" />
            ) : (
              <Image
                src={tab.id === "instagram" ? "/assets/insta.png" : "/assets/linkedin.png"}
                alt=""
                width={16}
                height={16}
                className="size-4 object-contain"
              />
            )}
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
