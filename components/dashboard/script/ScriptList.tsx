"use client";

import Link from "next/link";
import {
  ArrowRight,
  Clapperboard,
  Film,
  ImageIcon,
  Loader2,
  Users,
} from "lucide-react";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { Button } from "@/components/ui/button";
import { ImageGenerationMutation } from "@/routes/bussiness/Bussiness-Mutation";
import type { ImageGenerationRequest } from "@/types/bussiness/imagegeneration-type";
import type { ScriptGenerationResponse } from "@/types/bussiness/script-type";
import { FOCUS_RING } from "@/utils/ui-classes";
import { MetaChip } from "./primitives";
import { getScriptFromResult, getScriptResultId } from "./utils";

function toImageGenerationRequest(
  item: ScriptGenerationResponse,
): ImageGenerationRequest | null {
  const companyId = item.company_id || item.meta?.company_id;
  if (!companyId) return null;

  const script = getScriptFromResult(item);
  const scenes = (item.scenes ?? []).map((scene, index) => ({
    scene_number: scene.scene_number ?? index + 1,
    action: scene.action ?? "",
    body_text: scene.body_text ?? "",
    headline: scene.headline ?? "",
    visual_prompt: scene.visual_prompt ?? item.visual_prompt ?? "",
    image_url: scene.image_url,
  }));

  return {
    company_id: companyId,
    platform: item.project?.platform || "instagram",
    purpose: "post",
    style: item.meta?.style || "default",
    project: {
      name: item.project?.name || script?.title || "Script",
      tone: item.project?.tone || "default",
    },
    script: {
      title: script?.title || item.project?.name || "Untitled script",
      caption: script?.caption || "",
      cta: script?.cta || "",
      hook: script?.hook || "",
    },
    scenes,
  };
}

function ScriptListItem({
  item,
  index,
}: {
  item: ScriptGenerationResponse;
  index: number;
}) {
  const script = getScriptFromResult(item);
  const id = getScriptResultId(item);
  const title = item.project?.name || script?.title || `Script ${index + 1}`;
  const href = id ? PAGE_ROUTES.SCRIPT_DETAIL(id) : PAGE_ROUTES.SCRIPT;
  const sceneCount = item.scenes?.length ?? 0;
  const characterCount = item.characters?.length ?? 0;
  const payload = toImageGenerationRequest(item);

  const { mutate: generateImage, isPending } = ImageGenerationMutation();

  return (
    <li className="flex h-full flex-col overflow-hidden rounded-[22px] border border-[#E6E8F5] bg-white transition-all hover:border-[#C8C6F5] hover:shadow-[0_8px_24px_rgba(91,87,230,0.08)]">
      <div className="h-1 w-full bg-gradient-to-r from-[#2E2A9E] via-[#5B57E6] to-[#818CF8]" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link
          href={href}
          className={`group flex items-start justify-between gap-3 rounded-xl ${FOCUS_RING}`}
        >
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#ECEBFF] text-[#5B57E6]">
              <Clapperboard className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
                Script {index + 1}
              </p>
              <h3 className="mt-0.5 truncate text-[15px] font-semibold text-neutral-900 group-hover:text-[#5B57E6]">
                {title}
              </h3>
            </div>
          </div>
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#F6F5FF] text-[#5B57E6] transition-transform group-hover:translate-x-0.5">
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </span>
        </Link>

        {script?.logline || script?.hook ? (
          <p className="line-clamp-2 text-[13px] leading-5 text-neutral-600">
            {script.logline || script.hook}
          </p>
        ) : item.project?.description ? (
          <p className="line-clamp-2 text-[13px] leading-5 text-neutral-600">
            {item.project.description}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-1.5 pt-1">
          <MetaChip label="Platform" value={item.project?.platform} />
          <MetaChip label="Format" value={item.project?.format} />
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-500">
            <span className="inline-flex items-center gap-1">
              <Film className="size-3" aria-hidden="true" />
              {sceneCount} scene{sceneCount === 1 ? "" : "s"}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="size-3" aria-hidden="true" />
              {characterCount} character{characterCount === 1 ? "" : "s"}
            </span>
          </div>

          <Button
            type="button"
            size="sm"
            disabled={!payload || isPending}
            className="shrink-0 bg-[#5B57E6] text-white hover:bg-[#4A46D4]"
            onClick={() => {
              if (!payload) return;
              generateImage(payload);
            }}
          >
            {isPending ? (
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <ImageIcon className="size-3.5" aria-hidden="true" />
            )}
            {isPending ? "Generating…" : "Generate"}
          </Button>
        </div>
      </div>
    </li>
  );
}

export default function ScriptList({
  items,
}: {
  items: ScriptGenerationResponse[];
}) {
  if (!items.length) return null;

  return (
    <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item, index) => (
        <ScriptListItem
          key={getScriptResultId(item) || `${index}`}
          item={item}
          index={index}
        />
      ))}
    </ul>
  );
}
