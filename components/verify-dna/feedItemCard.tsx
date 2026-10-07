import {
  CalendarDays,
  CheckCircle2,
  Globe,
  Lightbulb,
  Loader2,
  Swords,
  XCircle,
} from "lucide-react";
import { InstagramIcon, LinkedInIcon } from "@/components/shared/brandIcons";
import type { FeedItem } from "@/lib/intelligence/progress-feed";

const PRIORITY: Record<string, string> = {
  high: "bg-rose-50 text-rose-600",
  medium: "bg-amber-50 text-amber-600",
  low: "bg-emerald-50 text-emerald-600",
};

const CHIP_TONE = {
  neutral: "bg-[#EEF0FF] text-[#4338CA]",
  good: "bg-emerald-50 text-emerald-700",
  bad: "bg-rose-50 text-rose-600",
};

const LINK_ICON = {
  web: Globe,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
};

function Priority({ value }: { value?: string }) {
  if (!value) return null;
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${PRIORITY[value.toLowerCase()] ?? PRIORITY.medium}`}
    >
      {value}
    </span>
  );
}

export default function FeedItemCard({ item }: { item: FeedItem }) {
  switch (item.kind) {
    case "section":
      return (
        <div className="flex items-center gap-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5452F6]">
          {item.note.startsWith("Done") ? (
            <CheckCircle2 className="size-3.5 text-emerald-500" />
          ) : item.note.startsWith("Ran") ? (
            <XCircle className="size-3.5 text-rose-500" />
          ) : (
            <Loader2 className="size-3.5 animate-spin" />
          )}
          {item.title}
          <span className="h-px flex-1 bg-[#E6E8F5]" />
          <span className="font-medium normal-case tracking-normal text-neutral-400">
            {item.note}
          </span>
        </div>
      );

    case "text":
      return (
        <p className="text-[13px] leading-6 text-neutral-600">
          <span className="font-semibold text-neutral-900">{item.label}</span>
          {item.value ? `: ${item.value}` : null}
        </p>
      );

    case "stats":
      return (
        <div className="flex flex-wrap gap-2">
          {item.items.map((s) => (
            <span
              key={s.label}
              className="rounded-xl border border-[#E6E8F5] bg-white px-3 py-1.5 text-xs"
            >
              <span className="text-neutral-500">{s.label} </span>
              <span className="font-semibold text-neutral-900">{s.value}</span>
            </span>
          ))}
        </div>
      );

    case "chips":
      return (
        <div>
          <p className="mb-1.5 text-xs font-semibold text-neutral-900">
            {item.label}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {item.items.map((chip) => (
              <span
                key={chip}
                className={`rounded-full px-2.5 py-1 text-xs ${CHIP_TONE[item.tone ?? "neutral"]}`}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      );

    case "links":
      return (
        <div className="flex flex-wrap gap-2">
          {item.items.map((link) => {
            const Icon = LINK_ICON[link.type];
            return (
              <a
                key={link.type}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border border-[#E6E8F5] bg-white py-1 pl-1 pr-3 text-xs text-neutral-800 hover:bg-[#F6F7FD]"
              >
                <span className="grid size-6 place-items-center rounded-full bg-[#F1F3FB]">
                  <Icon className="size-3.5" />
                </span>
                {link.label}
              </a>
            );
          })}
        </div>
      );

    case "score":
      return (
        <div className="rounded-xl bg-[#F6F7FD] px-3 py-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-900">{item.label}</span>
            <span className="font-bold text-[#5452F6]">{item.score}/100</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-linear-to-r from-[#4F46E5] to-[#8B5CF6]"
              style={{ width: `${Math.max(0, Math.min(100, item.score))}%` }}
            />
          </div>
        </div>
      );

    case "competitor":
      return (
        <div className="flex items-center gap-3 rounded-xl border border-[#E6E8F5] bg-white px-3 py-2">
          <span className="grid size-8 place-items-center rounded-lg bg-[#FFF4E5] text-[#D97706]">
            <Swords className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-neutral-900">
              Competitor found: {item.name}
            </p>
            {item.website ? (
              <p className="truncate text-xs text-neutral-500">
                {item.website.replace(/^https?:\/\//, "")}
              </p>
            ) : null}
          </div>
        </div>
      );

    case "action":
      return (
        <div className="flex gap-3 rounded-xl border border-[#E6E8F5] bg-white px-3 py-2">
          <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-[#EEF0FF] text-[#5452F6]">
            <CalendarDays className="size-4" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-500">
              <span className="font-semibold text-neutral-700">
                {item.when}
              </span>
              <span>· {item.platform}</span>
              {item.format ? <span>· {item.format}</span> : null}
              <Priority value={item.priority} />
            </div>
            <p className="mt-0.5 text-[13px] leading-5 text-neutral-800">
              {item.text}
            </p>
          </div>
        </div>
      );

    case "insight":
      return (
        <div className="flex items-start gap-2 text-[13px] leading-6 text-neutral-700">
          <Lightbulb className="mt-1 size-3.5 shrink-0 text-amber-500" />
          <span>
            {item.priority ? (
              <>
                <Priority value={item.priority} />{" "}
              </>
            ) : null}
            {item.text}
          </span>
        </div>
      );
  }
}
