"use client";

import Image from "next/image";
import {
  FileText,
  Lightbulb,
  Loader2,
  Sparkles,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { ScriptGenerationMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { BrandButton } from "@/components/ui/brand-button";
import type { ContentIdea } from "@/types/bussiness/content-recommendation-type";
import { ideaToScriptRequest } from "./scriptPayload";

function PlatformBadge({ platform }: { platform: string }) {
  const lower = platform.toLowerCase();
  const isIg = lower.includes("instagram") || lower.includes("ig");
  const isLi = lower.includes("linkedin");
  const icon = isIg
    ? "/assets/insta.png"
    : isLi
      ? "/assets/linkedin.png"
      : null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        isIg
          ? "bg-[#FCE7F3] text-[#BE185D]"
          : isLi
            ? "bg-[#E8F1FB] text-[#0A66C2]"
            : "bg-[#F3F4F8] text-neutral-700"
      }`}
    >
      {icon ? (
        <Image
          src={icon}
          alt=""
          width={12}
          height={12}
          className="size-3 object-contain"
        />
      ) : null}
      {platform}
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
  const pack = item.production_pack;
  const description =
    item.description ||
    item.summary ||
    item.angle ||
    item.caption ||
    item.body ||
    item.content ||
    "";
  const purpose =
    item.objective || item.goal || item.reason || item.content_pillar || null;
  const outline = (item.key_points ?? []).filter(Boolean).slice(0, 4);
  const hooks = (
    item.ab_hooks ||
    pack?.ab_hooks ||
    (item.hook ? [item.hook] : []) ||
    (pack?.primary_hook ? [pack.primary_hook] : [])
  )
    .filter(Boolean)
    .slice(0, 3);
  const tags = [
    ...(item.hashtags ?? []),
    item.format || item.post_type,
    item.content_pillar || item.pillar,
  ]
    .filter((v): v is string => Boolean(v))
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .slice(0, 5);
  const cta = item.cta || item.call_to_action || null;

  const handleGenerateScript = () => {
    if (!companyId) {
      toast.error("Company ID is missing. Please log in again.");
      return;
    }
    generateScript(ideaToScriptRequest(companyId, item));
  };

  return (
    <li className="flex flex-col rounded-2xl border border-[#E6E8F5] bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#ECEBFF] text-[12px] font-semibold text-[#5B57E6]">
          {index + 1}
        </span>
        {platform ? <PlatformBadge platform={platform} /> : null}
      </div>

      <h4 className="mt-3 text-[15px] font-semibold leading-snug tracking-tight text-neutral-900">
        {title}
      </h4>

      {description ? (
        <p className="mt-2 line-clamp-3 text-[13px] leading-5 text-neutral-500">
          {description}
        </p>
      ) : null}

      {purpose ? (
        <p className="mt-3 flex items-start gap-1.5 text-[12px] leading-4 text-neutral-600">
          <Lightbulb
            className="mt-0.5 size-3.5 shrink-0 text-[#5B57E6]"
            aria-hidden="true"
          />
          <span>
            <span className="text-neutral-400">Content purpose:</span>{" "}
            <span className="font-medium text-neutral-800">{purpose}</span>
          </span>
        </p>
      ) : null}

      {tags.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <li key={tag}>
              <span className="inline-flex items-center rounded-full bg-[#F3F4F8] px-2.5 py-1 text-[11px] font-medium text-neutral-600">
                {tag.replace(/^#/, "")}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {(outline.length > 0 || hooks.length > 0) && (
        <div className="mt-4 grid flex-1 gap-4 border-t border-[#EEF0F8] pt-4 sm:grid-cols-2">
          {outline.length > 0 ? (
            <div className="min-w-0">
              <p className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-neutral-900">
                <FileText
                  className="size-3.5 text-[#5B57E6]"
                  aria-hidden="true"
                />
                Outline
              </p>
              <ul className="space-y-1.5">
                {outline.map((point) => (
                  <li
                    key={point}
                    className="flex gap-2 text-[12px] leading-4 text-neutral-600"
                  >
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[#5B57E6]" />
                    <span className="min-w-0">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {hooks.length > 0 ? (
            <div className="min-w-0">
              <p className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-neutral-900">
                <Sparkles
                  className="size-3.5 text-[#5B57E6]"
                  aria-hidden="true"
                />
                Hook ideas
              </p>
              <ul className="space-y-1.5">
                {hooks.map((hook) => (
                  <li
                    key={hook}
                    className="flex gap-2 text-[12px] leading-4 text-neutral-600"
                  >
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[#5B57E6]" />
                    <span className="min-w-0">“{hook}”</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}

      {cta ? (
        <p className="mt-4 flex items-start gap-1.5 text-[12px] leading-4 text-neutral-600">
          <Star
            className="mt-0.5 size-3.5 shrink-0 text-[#5B57E6]"
            aria-hidden="true"
          />
          <span>
            <span className="text-neutral-400">CTA:</span>{" "}
            <span className="font-medium text-neutral-800">{cta}</span>
          </span>
        </p>
      ) : null}

      <BrandButton
        type="button"
        size="full"
        className="mt-4"
        onClick={handleGenerateScript}
        disabled={isPending || !companyId}
      >
        {isPending ? (
          <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Sparkles className="size-3.5" aria-hidden="true" />
        )}
        {isPending ? "Generating script…" : "Generate script"}
      </BrandButton>
    </li>
  );
}
