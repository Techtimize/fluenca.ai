"use client";

import Link from "next/link";
import { Plug } from "lucide-react";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { FOCUS_RING } from "@/utils/ui-classes";

export function SocialNotConnected({
  platform,
  accentClassName,
}: {
  platform: string;
  accentClassName: string;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-16 text-center">
      <span
        className={`grid size-14 place-items-center rounded-3xl ${accentClassName}`}
      >
        <Plug className="size-6" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-lg font-semibold text-neutral-900">
        {platform} isn’t connected
      </h2>
      <p className="mt-2 text-[14px] leading-6 text-neutral-500">
        Connect {platform} in Integrations to view this profile and its content
        here.
      </p>
      <Link
        href={PAGE_ROUTES.INTEGRATIONS}
        className={`mt-6 inline-flex h-11 items-center rounded-full bg-[#5B57E6] px-5 text-sm font-medium text-white hover:bg-[#4A46D0] ${FOCUS_RING}`}
      >
        Open Integrations
      </Link>
    </div>
  );
}
