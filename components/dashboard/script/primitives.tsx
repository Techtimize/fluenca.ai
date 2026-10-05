import type { ReactNode } from "react";

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
