"use client";

import { Loader2, Trash2 } from "lucide-react";
import { DeleteImageMutation } from "@/routes/bussiness/Bussiness-Mutation";
import useAuthStore from "@/store/AuthsStore";
import { FOCUS_RING } from "@/utils/ui-classes";

export function DeleteImageControls({
  imageId,
  label,
}: {
  imageId: string;
  label: string;
}) {
  const companyId = useAuthStore((s) => s.company_id);
  const { mutate, isPending } = DeleteImageMutation();

  if (!companyId || !imageId) return null;

  return (
    <>
      <div className="absolute right-2 top-2 z-20">
        <button
          type="button"
          aria-label={`Delete ${label}`}
          disabled={isPending}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            mutate(imageId);
          }}
          className={`grid size-8 place-items-center rounded-full border border-white/70 bg-white/95 text-neutral-500 shadow-sm backdrop-blur transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-70 ${FOCUS_RING}`}
        >
          {isPending ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <Trash2 className="size-3.5" aria-hidden="true" />
          )}
        </button>
      </div>
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
