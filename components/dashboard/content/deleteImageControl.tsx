"use client";

import { Loader2, Trash2 } from "lucide-react";
import { DeleteImageMutation } from "@/routes/bussiness/Bussiness-Mutation";
import useAuthStore from "@/store/AuthsStore";
import { FOCUS_RING } from "@/utils/ui-classes";
import { cn } from "@/lib/utils";

export function DeleteImageControls({
  imageId,
  label,
  variant = "overlay",
}: {
  imageId: string;
  label: string;
  variant?: "overlay" | "inline";
}) {
  const companyId = useAuthStore((s) => s.company_id);
  const { mutate, isPending } = DeleteImageMutation();

  if (!companyId || !imageId) return null;

  const button = (
    <button
      type="button"
      aria-label={`Delete ${label}`}
      disabled={isPending}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        mutate(imageId);
      }}
      className={cn(
        `grid size-8 place-items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${FOCUS_RING}`,
        variant === "inline"
          ? "bg-[#FFF1F2] text-rose-500 hover:bg-rose-100"
          : "border border-white/70 bg-white/95 text-neutral-500 shadow-sm backdrop-blur hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600",
      )}
    >
      {isPending ? (
        <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
      ) : (
        <Trash2 className="size-3.5" aria-hidden="true" />
      )}
    </button>
  );

  if (variant === "inline") {
    return (
      <div className="relative shrink-0">
        {button}
        {isPending ? (
          <span className="sr-only" aria-live="polite">
            Deleting
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <>
      <div className="absolute right-2 top-2 z-20">{button}</div>
      {isPending ? (
        <div className="absolute inset-0 z-10 grid place-items-center bg-white/55 backdrop-blur-[1px]">
          <Loader2
            className="size-7 animate-spin text-[#5B57E6]"
            aria-label="Deleting"
          />
        </div>
      ) : null}
    </>
  );
}
