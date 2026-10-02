"use client";

import Image from "next/image";
import { FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ScriptGenerationMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { FOCUS_RING } from "@/utils/ui-classes";
import { Chip } from "./chipsandsection";
import { ideaToScriptRequest } from "./scriptPayload";
import { humanize, isPrimitive } from "./utils";

const TITLE_KEYS = ["title", "name", "idea", "topic", "hook", "headline", "theme", "post_type"];
const SKIP_KEYS = new Set(["platform", "priority", "channel"]);
const DESC_KEYS = ["description", "summary", "caption", "body", "content", "angle"];

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

function PlatformBadge({ platform }: { platform: string }) {
  const lower = platform.toLowerCase();
  const isIg = lower.includes("instagram") || lower.includes("ig");
  const isLi = lower.includes("linkedin");
  const icon = isIg ? "/assets/insta.png" : isLi ? "/assets/linkedin.png" : null;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
        isIg
          ? "bg-[#FCE7F3] text-[#BE185D]"
          : isLi
            ? "bg-[#E8F1FB] text-[#0A66C2]"
            : "border border-[#E6E8F5] bg-[#F6F7FD] text-neutral-700"
      }`}
    >
      {icon ? (
        <Image src={icon} alt="" width={12} height={12} className="size-3 rounded-[2px] object-contain" />
      ) : null}
      {platform}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const lower = priority.toLowerCase();
  const tone =
    lower.includes("high") || lower === "1"
      ? "bg-rose-50 text-rose-700"
      : lower.includes("medium") || lower === "2"
        ? "bg-amber-50 text-amber-700"
        : "bg-emerald-50 text-emerald-700";

  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${tone}`}>
      {priority}
    </span>
  );
}

export default function IdeaCard({
  item,
  index,
  companyId,
}: {
  item: Record<string, unknown>;
  index: number;
  companyId: string;
}) {
  const { mutate: generateScript, isPending } = ScriptGenerationMutation();

  const titleKey = TITLE_KEYS.find((key) => typeof item[key] === "string");
  const title = titleKey ? String(item[titleKey]) : `Idea ${index + 1}`;

  const rows = Object.entries(item).filter(([key, value]) => {
    if (key === titleKey || SKIP_KEYS.has(key)) return false;
    if (isPrimitive(value)) return String(value).length > 0;
    if (Array.isArray(value)) return value.length > 0 && value.every(isPrimitive);
    return false;
  });

  const platform =
    typeof item.platform === "string"
      ? item.platform
      : typeof item.channel === "string"
        ? item.channel
        : null;
  const priority =
    typeof item.priority === "string" || typeof item.priority === "number"
      ? String(item.priority)
      : null;

  const descriptionRow = rows.find(([key]) => DESC_KEYS.includes(key));
  const otherRows = rows.filter(([key]) => key !== descriptionRow?.[0]).slice(0, 3);

  const handleGenerateScript = () => {
    if (!companyId) {
      toast.error("Company ID is missing. Please log in again.");
      return;
    }
    generateScript(ideaToScriptRequest(companyId, item));
  };

  return (
    <li className="flex flex-col overflow-hidden rounded-xl border border-[#E6E8F5] bg-white transition-colors hover:border-[#C8C6F5]">
      <div className="h-0.5 w-full bg-gradient-to-r from-[#2E2A9E] via-[#5B57E6] to-[#818CF8]" />

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[13px] font-semibold leading-snug text-neutral-900">{title}</p>
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#ECEBFF] text-[10px] font-semibold text-[#5B57E6]">
            {index + 1}
          </span>
        </div>

        {(platform || priority) && (
          <div className="flex flex-wrap gap-1">
            {platform ? <PlatformBadge platform={platform} /> : null}
            {priority ? <PriorityBadge priority={priority} /> : null}
          </div>
        )}

        {descriptionRow ? (
          <p className="line-clamp-3 text-[12px] leading-5 text-neutral-600">
            {toDisplay(descriptionRow[1])}
          </p>
        ) : null}

        {otherRows.length ? (
          <dl className="space-y-1.5 border-t border-[#EEF0F8] pt-2">
            {otherRows.map(([key, value]) => (
              <div key={key} className="min-w-0">
                <dt className="text-[10px] font-medium uppercase tracking-[0.04em] text-neutral-400">
                  {humanize(key)}
                </dt>
                <dd className="mt-0.5 text-[12px] leading-4 text-neutral-700">
                  {Array.isArray(value) && value.every(isPrimitive) ? (
                    <ul className="mt-1 flex flex-wrap gap-1">
                      {value.slice(0, 4).map((tag) => (
                        <li key={String(tag)}>
                          <Chip>{String(tag)}</Chip>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="line-clamp-2">{toDisplay(value)}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <button
          type="button"
          onClick={handleGenerateScript}
          disabled={isPending || !companyId}
          className={`mt-auto inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-[#D8D6F5] bg-[#F6F5FF] text-[12px] font-medium text-[#5B57E6] hover:bg-[#ECEBFF] disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS_RING}`}
        >
          {isPending ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <FileText className="size-3.5" aria-hidden="true" />
          )}
          {isPending ? "Generating script…" : "Generate script"}
        </button>
      </div>
    </li>
  );
}
