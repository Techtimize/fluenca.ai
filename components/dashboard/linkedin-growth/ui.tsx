"use client";

import { useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { FOCUS_RING } from "@/utils/ui-classes";

// Shared pieces for the LinkedIn growth page.

export const PRIMARY_BUTTON = `inline-flex items-center justify-center gap-2 rounded-full bg-[#0A66C2] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#09579f] disabled:opacity-55 ${FOCUS_RING}`;

export const GHOST_BUTTON = `inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium text-neutral-600 ring-1 ring-[#E6E8F5] hover:bg-neutral-50 disabled:opacity-55 ${FOCUS_RING}`;

export const LABEL = "text-[11px] font-semibold uppercase tracking-wide text-neutral-400";

/** Green from 75%, amber from 50%, red below. */
export const scoreColor = (percent: number) => (percent >= 75 ? "#16A34A" : percent >= 50 ? "#F59E0B" : "#E11D48");

export function GrowthSection({
  icon: Icon,
  title,
  description,
  action,
  className = "",
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`flex flex-col rounded-2xl border border-[#E6E8F5] bg-white p-5 ${className}`}>
      <header className="flex flex-wrap items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#E8F1FB] text-[#0A66C2]">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-[15px] font-semibold text-neutral-900">{title}</h2>
          <p className="mt-0.5 text-[12px] leading-5 text-neutral-500">{description}</p>
        </div>
        {action}
      </header>
      <div className="mt-4 flex flex-1 flex-col">{children}</div>
    </section>
  );
}

/** Dashed box with one call to action, for features that haven't been run yet. */
export function EmptyAction({ text, children }: { text: string; children?: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#D6E4F5] px-4 py-8 text-center">
      <p className="max-w-sm text-[13px] text-neutral-500">{text}</p>
      {children}
    </div>
  );
}

export function LoadingBlock() {
  return <div className="h-36 animate-pulse rounded-xl bg-[#F6F8FC]" aria-busy="true" />;
}

export function ErrorText({ children }: { children: ReactNode }) {
  return <p className="rounded-xl bg-rose-50 px-4 py-3 text-[13px] text-rose-700">{children}</p>;
}

const RING_RADIUS = 42;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

/** Circular score gauge. */
export function ScoreRing({
  score,
  label,
  max = 100,
  className = "size-28",
}: {
  score: number;
  label: string;
  max?: number;
  className?: string;
}) {
  const percent = Math.max(0, Math.min(100, (score / (max || 100)) * 100));
  return (
    <div className={`relative shrink-0 ${className}`} role="meter" aria-label={label} aria-valuenow={Math.round(score)} aria-valuemin={0} aria-valuemax={max}>
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle cx="50" cy="50" r={RING_RADIUS} fill="none" stroke="#EEF2F7" strokeWidth="9" />
        <circle
          cx="50"
          cy="50"
          r={RING_RADIUS}
          fill="none"
          stroke={scoreColor(percent)}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={RING_LENGTH}
          strokeDashoffset={RING_LENGTH * (1 - percent / 100)}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[26px] font-bold leading-none text-neutral-900">{Math.round(score)}</span>
        <span className="mt-1 text-[11px] text-neutral-500">/ {max}</span>
      </span>
    </div>
  );
}

/** "+4" / "−2" / "±0" change badge. */
export function ChangeBadge({ change, suffix }: { change: number; suffix: string }) {
  const tone = change > 0 ? "bg-emerald-50 text-emerald-700" : change < 0 ? "bg-rose-50 text-rose-700" : "bg-neutral-100 text-neutral-500";
  const sign = change > 0 ? "+" : change < 0 ? "−" : "±";
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${tone}`}>
      {sign}
      {Math.abs(Math.round(change))} {suffix}
    </span>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy. Select the text and copy it instead.");
    }
  };
  return (
    <button type="button" onClick={() => void copy()} className={GHOST_BUTTON}>
      {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export const formatDate = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};
