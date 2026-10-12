"use client";

import Image from "next/image";
import { FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ScriptGenerationMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { BrandButton } from "@/components/ui/brand-button";
import type { ContentIdea } from "@/types/bussiness/content-recommendation-type";
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
  const numeric = Number(priority);
  const isTenScale = Number.isFinite(numeric) && numeric > 0 && numeric <= 10;
  const tone =
    lower.includes("high") ||
    (isTenScale ? numeric >= 8 : Number.isFinite(numeric) && numeric >= 80)
      ? "bg-rose-50 text-rose-700"
      : lower.includes("medium") ||
          (isTenScale ? numeric >= 5 : Number.isFinite(numeric) && numeric >= 50)
        ? "bg-amber-50 text-amber-700"
        : "bg-emerald-50 text-emerald-700";

  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${tone}`}>
      {isTenScale ? `P${priority}` : priority}
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
  const pack = item.production_pack;
  const description =
    item.hook ||
    item.angle ||
    item.caption ||
    item.description ||
    item.summary ||
    item.body ||
    item.content ||
    "";
  const keyPoints = item.key_points?.filter(Boolean) ?? [];
  const hashtags = item.hashtags?.filter(Boolean) ?? [];
  const abHooks = (item.ab_hooks || pack?.ab_hooks || []).filter(Boolean);
  const carouselSlides = pack?.carousel_slides || item.slides || [];
  const reelShots = pack?.reel_shot_list || [];
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

        {item.reason ? (
          <p className="line-clamp-2 text-[11px] leading-4 text-neutral-500">
            {item.reason}
          </p>
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
            {keyPoints.slice(0, 4).map((point) => (
              <li key={point} className="text-[12px] leading-4 text-neutral-600">
                · {point}
              </li>
            ))}
          </ul>
        ) : null}

        {abHooks.length ? (
          <div className="border-t border-[#EEF0F8] pt-2">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.04em] text-neutral-400">
              A/B hooks
            </p>
            <ul className="space-y-1">
              {abHooks.slice(0, 2).map((hook) => (
                <li key={hook} className="text-[11px] leading-4 text-neutral-600">
                  “{hook}”
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {carouselSlides.length ? (
          <p className="text-[11px] text-neutral-500">
            {carouselSlides.length} carousel slides ready
          </p>
        ) : null}

        {reelShots.length ? (
          <p className="text-[11px] text-neutral-500">
            {reelShots.length} reel shots mapped
          </p>
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

        {item.brand_voice_note || pack?.tone_guide ? (
          <p className="line-clamp-2 text-[10px] leading-4 text-neutral-400">
            Voice: {item.brand_voice_note || pack?.tone_guide}
          </p>
        ) : null}

        <BrandButton
          type="button"
          size="full"
          className="mt-auto"
          onClick={handleGenerateScript}
          disabled={isPending || !companyId}
        >
          {isPending ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <FileText className="size-3.5" aria-hidden="true" />
          )}
          {isPending ? "Generating script…" : "Generate script"}
        </BrandButton>
      </div>
    </li>
  );
}
