import type { ReactNode } from "react";
import { Lock, MoreVertical } from "lucide-react";
import AssetImage from "@/components/shared/assetImage";
import Card from "@/components/shared/card";
import type { Integration } from "@/types/dashboard";
import { FOCUS_RING } from "@/utils/ui-classes";

const BAR_HEIGHTS = [45, 75, 60, 95, 65, 85, 50, 70];

function PlaceholderChart({ color, blurred }: { color: string; blurred: boolean }) {
  return (
    <div
      className={`flex h-full items-end gap-1.5 px-3 pt-4 transition sm:gap-4 sm:px-6 sm:pt-6 ${blurred ? "blur-md" : ""}`}
      aria-hidden={blurred}
    >
      {BAR_HEIGHTS.map((h, i) => (
        <div key={i} className="flex-1 rounded-t-xl" style={{ height: `${h}%`, background: color }} />
      ))}
    </div>
  );
}

type Props = {
  integration: Integration;
  onConnect?: (id: string) => void;
  children?: ReactNode;
};

export default function IntegrationCard({ integration, onConnect, children }: Props) {
  const { id, title, subtitle, logoSrc, previewColor, locked = false } = integration;

  return (
    <Card className="min-w-0 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <AssetImage src={logoSrc} alt="" width={36} height={36} className="size-9 shrink-0 object-contain" />
          <div className="min-w-0">
            <h3 className="truncate text-[13px] font-semibold text-neutral-900">{title}</h3>
            <p className="truncate text-xs text-neutral-500">{subtitle}</p>
          </div>
        </div>
        <button type="button" aria-label={`${title} options`} className="shrink-0 rounded-md p-1 text-neutral-500 hover:bg-neutral-100">
          <MoreVertical className="size-4" />
        </button>
      </div>

      <div className="relative mt-4 h-44 overflow-hidden rounded-2xl bg-[#F6F7FD] sm:h-56">
        {locked ? (
          <PlaceholderChart color={previewColor} blurred />
        ) : (
          children ?? <PlaceholderChart color={previewColor} blurred={false} />
        )}

        {locked && (
          <div className="absolute inset-0 grid place-items-center">
            <button
              type="button"
              onClick={() => onConnect?.(id)}
              aria-label={`Connect ${title} to unlock`}
              className={`grid size-14 place-items-center rounded-full bg-white/80 text-neutral-500 shadow-sm hover:bg-white hover:text-neutral-800 ${FOCUS_RING}`}
            >
              <Lock className="size-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}