"use client";

import Image from "next/image";
import { FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ScriptGenerationMutation } from "@/routes/bussiness/Bussiness-Mutation";
import type { ContentIdea } from "@/types/bussiness/content-recommendation-type";
import { FOCUS_RING } from "@/utils/ui-classes";
import { Chip } from "./chipsandsection";
import { ideaToScriptRequest } from "./scriptPayload";

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
    lower.includes("high") || Number(priority) >= 80
      ? "bg-rose-50 text-rose-700"
      : lower.includes("medium") || Number(priority) >= 50
        ? "bg-amber-50 text-amber-700"
        : "bg-emerald-50 text-emerald-700";

  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${tone}`}>
      {priority}
    </span>
  );
}

function ideaTitle(item: ContentIdea, index: number) {
  return (
    item.title ||
    item.name ||
    item.idea ||
    item.topic ||
    item.headline ||
    item.theme ||
    `Idea ${index + 1}`
  );
}

export default function IdeaCard({
  item,
  index,
  companyId,
}: {
  item: ContentIdea;
  index: number;
  companyId: string;
}) {
  const { mutate: generateScript, isPending } = ScriptGenerationMutation();

  const title = ideaTitle(item, index);
  const platform = item.platform || item.channel || null;
  const priority =
    item.priority != null
      ? String(item.priority)
      : item.priority_score != null
        ? String(item.priority_score)
        : null;
  const description =
    item.caption ||
    item.description ||
    item.summary ||
    item.angle ||
    item.hook ||
    item.body ||
    item.content ||
    "";
  const keyPoints = item.key_points?.filter(Boolean) ?? [];
  const hashtags = item.hashtags?.filter(Boolean) ?? [];
  const meta = [
    item.format || item.post_type,
    item.content_pillar || item.pillar,
    item.objective || item.goal,
    item.target_audience,
    item.date,
  ].filter(Boolean) as string[];

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
          </div>
        )}

        {description ? (
          <p className="line-clamp-3 text-[12px] leading-5 text-neutral-600">{description}</p>
        ) : null}

        {meta.length ? (
          <ul className="flex flex-wrap gap-1">
            {meta.map((value) => (
              <li key={value}>
                <Chip>{value}</Chip>
              </li>
            ))}
          </ul>
        ) : null}

        {keyPoints.length ? (
          <ul className="space-y-1 border-t border-[#EEF0F8] pt-2">
            {keyPoints.slice(0, 3).map((point) => (
              <li key={point} className="text-[12px] leading-4 text-neutral-600">
                · {point}
              </li>
            ))}
          </ul>
        ) : null}

        {hashtags.length ? (
          <ul className="flex flex-wrap gap-1">
            {hashtags.slice(0, 4).map((tag) => (
              <li key={tag}>
                <Chip>{tag}</Chip>
              </li>
            ))}
          </ul>
        ) : null}

        {item.cta || item.call_to_action ? (
          <p className="text-[11px] font-medium text-[#5B57E6]">
            CTA: {item.cta || item.call_to_action}
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleGenerateScript}
          disabled={isPending || !companyId}
          className={`mt-auto bg-brand-600 cursor-pointer hover:bg-brand-700 text-white inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-[#D8D6F5] bg-[#F6F5FF] text-[12px] font-medium text-[#5B57E6] hover:bg-[#ECEBFF] disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS_RING}`}
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
