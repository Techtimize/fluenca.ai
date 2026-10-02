"use client";

import { useMemo } from "react";
import {
  CalendarDays,
  FileText,
  Hash,
  Lightbulb,
  Loader2,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import Card from "@/components/shared/card";
import { ContentRecommendationMutation } from "@/routes/bussiness/Bussiness-Mutation";
import type { ContentRecommendationResultResponse } from "@/types/bussiness/content-recommendation-type";
import { FOCUS_RING } from "@/utils/ui-classes";

const HIDDEN_KEYS = new Set([
  "meta",
  "success",
  "error",
  "warnings",
  "company_id",
  "prompt_id",
  "created_at",
  "status",
  "message",
]);

const TITLE_KEYS = ["title", "name", "idea", "topic", "hook", "headline", "theme", "post_type"];

const SECTION_ICONS: Record<string, LucideIcon> = {
  ideas: Lightbulb,
  content_ideas: Lightbulb,
  recommendations: Sparkles,
  themes: Hash,
  topics: Hash,
  calendar: CalendarDays,
  content_calendar: CalendarDays,
  strategy: Target,
  pillars: Target,
  posts: FileText,
  captions: FileText,
};

const humanize = (key: string) =>
  key.replace(/[_-]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const isPrimitive = (value: unknown) =>
  typeof value === "string" || typeof value === "number" || typeof value === "boolean";

function toDisplay(value: unknown): string {
  if (value == null) return "";
  if (isPrimitive(value)) return String(value);
  if (Array.isArray(value)) {
    return value.filter(isPrimitive).map(String).join(", ");
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const primary = TITLE_KEYS.map((key) => record[key]).find(
      (item) => typeof item === "string" || typeof item === "number",
    );
    if (primary != null) return String(primary);
  }
  return "";
}

function sectionIcon(label: string): LucideIcon {
  const key = label.toLowerCase().replace(/\s+/g, "_");
  return SECTION_ICONS[key] ?? Sparkles;
}

function Chip({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-[#E6E8F5] bg-[#F6F7FD] px-3 py-1 text-[12px] text-neutral-700">
      {children}
    </span>
  );
}

function IdeaCard({ item, index }: { item: Record<string, unknown>; index: number }) {
  const titleKey = TITLE_KEYS.find((key) => typeof item[key] === "string");
  const title = titleKey ? String(item[titleKey]) : `Idea ${index + 1}`;
  const rows = Object.entries(item).filter(([key, value]) => {
    if (key === titleKey) return false;
    if (isPrimitive(value)) return String(value).length > 0;
    if (Array.isArray(value)) return value.length > 0 && value.every(isPrimitive);
    return false;
  });

  const platform = typeof item.platform === "string" ? item.platform : null;
  const priority = typeof item.priority === "string" || typeof item.priority === "number"
    ? String(item.priority)
    : null;

  return (
    <li className="flex h-full flex-col rounded-2xl border border-[#E6E8F5] bg-white p-4 shadow-[0_4px_16px_rgba(17,24,39,0.03)]">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13px] font-semibold leading-5 text-neutral-900">{title}</p>
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#ECEBFF] text-[11px] font-semibold text-[#5B57E6]">
          {index + 1}
        </span>
      </div>

      {(platform || priority) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {platform ? <Chip>{platform}</Chip> : null}
          {priority ? <Chip>{`Priority · ${priority}`}</Chip> : null}
        </div>
      )}

      {rows.length ? (
        <dl className="mt-3 space-y-2 text-[12px]">
          {rows
            .filter(([key]) => key !== "platform" && key !== "priority")
            .slice(0, 6)
            .map(([key, value]) => (
              <div key={key}>
                <dt className="text-[11px] font-medium uppercase tracking-[0.04em] text-neutral-400">
                  {humanize(key)}
                </dt>
                <dd className="mt-0.5 whitespace-pre-line leading-5 text-neutral-700">
                  {toDisplay(value)}
                </dd>
              </div>
            ))}
        </dl>
      ) : null}
    </li>
  );
}

function Section({
  label,
  value,
  depth = 0,
}: {
  label: string;
  value: unknown;
  depth?: number;
}) {
  if (value === null || value === undefined || value === "") return null;
  if (Array.isArray(value) && !value.length) return null;

  const Icon = sectionIcon(label);
  const title = humanize(label);

  if (isPrimitive(value)) {
    return (
      <Card className="p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-[#ECEBFF] text-[#5B57E6]">
            <Icon className="size-4" aria-hidden="true" />
          </span>
          <h3 className="text-[15px] font-semibold text-neutral-900">{title}</h3>
        </div>
        <p className="whitespace-pre-line text-[13px] leading-6 text-neutral-700">{String(value)}</p>
      </Card>
    );
  }

  if (Array.isArray(value) && value.every(isPrimitive)) {
    return (
      <Card className="p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-[#ECEBFF] text-[#5B57E6]">
            <Icon className="size-4" aria-hidden="true" />
          </span>
          <h3 className="text-[15px] font-semibold text-neutral-900">{title}</h3>
        </div>
        <ul className="flex flex-wrap gap-2">
          {value.map((item) => (
            <li key={String(item)}>
              <Chip>{String(item)}</Chip>
            </li>
          ))}
        </ul>
      </Card>
    );
  }

  if (Array.isArray(value)) {
    return (
      <Card className="p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-[#ECEBFF] text-[#5B57E6]">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-[15px] font-semibold text-neutral-900">{title}</h3>
              <p className="text-[12px] text-neutral-500">{value.length} items</p>
            </div>
          </div>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {value.map((item, index) =>
            item && typeof item === "object" ? (
              <IdeaCard key={index} item={item as Record<string, unknown>} index={index} />
            ) : isPrimitive(item) ? (
              <li key={index}>
                <Chip>{String(item)}</Chip>
              </li>
            ) : null,
          )}
        </ul>
      </Card>
    );
  }

  if (typeof value === "object" && depth < 2) {
    const nested = Object.entries(value as Record<string, unknown>).filter(
      ([, nestedValue]) => nestedValue != null && nestedValue !== "",
    );
    if (!nested.length) return null;

    if (depth > 0) {
      return (
        <div className="space-y-3">
          <p className="text-[13px] font-semibold text-neutral-900">{title}</p>
          {nested.map(([key, nestedValue]) => (
            <div key={key}>
              <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.04em] text-neutral-400">
                {humanize(key)}
              </p>
              {isPrimitive(nestedValue) ? (
                <p className="whitespace-pre-line text-[13px] leading-5 text-neutral-700">
                  {String(nestedValue)}
                </p>
              ) : Array.isArray(nestedValue) && nestedValue.every(isPrimitive) ? (
                <ul className="flex flex-wrap gap-2">
                  {nestedValue.map((item) => (
                    <li key={String(item)}>
                      <Chip>{String(item)}</Chip>
                    </li>
                  ))}
                </ul>
              ) : (
                <Section label={key} value={nestedValue} depth={depth + 1} />
              )}
            </div>
          ))}
        </div>
      );
    }

    return (
      <Card className="space-y-5 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-[#ECEBFF] text-[#5B57E6]">
            <Icon className="size-4" aria-hidden="true" />
          </span>
          <h3 className="text-[15px] font-semibold text-neutral-900">{title}</h3>
        </div>
        <div className="space-y-4">
          {nested.map(([key, nestedValue]) => (
            <div key={key} className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-4">
              <Section label={key} value={nestedValue} depth={depth + 1} />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return null;
}

function EmptyState({
  onGenerate,
  isPending,
}: {
  onGenerate: () => void;
  isPending: boolean;
}) {
  return (
    <Card className="relative overflow-hidden p-0">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#ECEBFF_0%,transparent_55%)]"
      />
      <div className="relative mx-auto flex max-w-lg flex-col items-center px-6 py-14 text-center sm:py-16">
        <span className="grid size-14 place-items-center rounded-3xl bg-[#ECEBFF] text-[#5B57E6] shadow-[0_8px_24px_rgba(91,87,230,0.18)]">
          <Lightbulb className="size-6" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-lg font-semibold text-neutral-900">No recommendations yet</h2>
        <p className="mt-2 text-[14px] leading-6 text-neutral-500">
          Generate content ideas, themes, and post plans tailored to your company DNA and market
          position.
        </p>
        <button
          type="button"
          onClick={onGenerate}
          disabled={isPending}
          className={`mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#5B57E6] px-5 text-sm font-medium text-white hover:bg-[#4A46D0] disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS_RING}`}
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          {isPending ? "Generating…" : "Generate recommendations"}
        </button>
      </div>
    </Card>
  );
}

type Props = {
  data?: ContentRecommendationResultResponse | null;
  companyId: string;
  empty?: boolean;
};

export default function ContentRecommendations({ data, companyId, empty = false }: Props) {
  const { mutate: recommend, isPending } = ContentRecommendationMutation();

  const entries = useMemo(() => {
    if (!data) return [];
    const content = (
      data.result && typeof data.result === "object" ? data.result : data
    ) as Record<string, unknown>;
    return Object.entries(content).filter(([key, value]) => {
      if (HIDDEN_KEYS.has(key)) return false;
      if (value == null || value === "") return false;
      if (Array.isArray(value) && !value.length) return false;
      return true;
    });
  }, [data]);

  const handleGenerate = () => {
    if (!companyId) {
      toast.error("Company ID is missing. Please log in again.");
      return;
    }
    recommend({ company_id: companyId });
  };

  if (empty || !entries.length) {
    return <EmptyState onGenerate={handleGenerate} isPending={isPending} />;
  }

  return (
    <div className="space-y-4">
      {entries.map(([key, value]) => (
        <Section key={key} label={key} value={value} />
      ))}
    </div>
  );
}
