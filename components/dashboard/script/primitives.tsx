import type { ReactNode } from "react";
import AssetImage from "@/components/shared/assetImage";

const PLATFORM_ASSET_ICONS: Record<string, string> = {
  instagram: "/assets/insta.png",
  insta: "/assets/insta.png",
  ig: "/assets/insta.png",
  linkedin: "/assets/linkedin.png",
  "linked-in": "/assets/linkedin.png",
  li: "/assets/linkedin.png",
};

function platformAssetSrc(platform?: string | null) {
  if (!platform) return null;
  const key = platform.trim().toLowerCase().replace(/\s+/g, "");
  return PLATFORM_ASSET_ICONS[key] ?? null;
}

function platformLabel(platform: string) {
  const key = platform.trim().toLowerCase().replace(/\s+/g, "");
  if (key === "instagram" || key === "insta" || key === "ig") return "Instagram";
  if (key === "linkedin" || key === "linked-in" || key === "li") return "LinkedIn";
  return platform;
}

export function MetaChip({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  if (value == null || value === "") return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#E6E8F5] bg-[#F6F7FD] px-2.5 py-1 text-[11px] text-neutral-700">
      <span className="font-medium text-neutral-500">{label}</span>
      <span className="font-semibold text-neutral-800">{value}</span>
    </span>
  );
}

export function PlatformChip({
  platform,
}: {
  platform?: string | null;
}) {
  if (platform == null || platform === "") return null;
  const iconSrc = platformAssetSrc(platform);
  const label = platformLabel(platform);

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E6E8F5] bg-[#F6F7FD] px-2.5 py-1 text-[11px] text-neutral-700">
      {iconSrc ? (
        <AssetImage
          src={iconSrc}
          alt=""
          width={14}
          height={14}
          className="size-3.5 object-contain"
        />
      ) : null}
      <span className="font-semibold text-neutral-800">{label}</span>
    </span>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  if (!children) return null;
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-neutral-400">
        {label}
      </p>
      <div className="mt-1 text-[13px] leading-5 text-neutral-700">{children}</div>
    </div>
  );
}
