"use client";

import { Plug } from "lucide-react";
import { BrandButton } from "@/components/ui/brand-button";
import { PAGE_ROUTES } from "@/constant/page-routes";

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
      <BrandButton href={PAGE_ROUTES.CONNECTORS} className="mt-6">
        Open Integrations
      </BrandButton>
    </div>
  );
}
