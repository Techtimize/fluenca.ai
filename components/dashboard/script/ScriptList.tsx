"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clapperboard,
  Film,
  ImageIcon,
  Loader2,
  Link2,
  PenLine,
  Quote,
  Send,
  Users,
} from "lucide-react";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { Button } from "@/components/ui/button";
import {
  isPublishSucceeded,
  markContentPosted,
  usePostedContent,
} from "@/lib/content/posted-content";
import { TextPostDialog } from "@/components/dashboard/content/textPosts";
import {
  CreateTextPostMutation,
  ImageGenerationMutation,
  LinkedInPublishMutation,
} from "@/routes/bussiness/Bussiness-Mutation";
import { CompanyTextPostsQuery } from "@/routes/bussiness/Bussiness-Query";
import { isTextPostPosted, type TextPost } from "@/types/bussiness/text-post-type";
import type { ImageGenerationRequest } from "@/types/bussiness/imagegeneration-type";
import type { ScriptGenerationResponse } from "@/types/bussiness/script-type";
import { FOCUS_RING } from "@/utils/ui-classes";
import { MetaChip, PlatformChip } from "./primitives";
import ShareArticleDialog from "./ShareArticleDialog";
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

type PublishMode = "visual" | "text" | "article";

/**
 * What the script turns into:
 * - "image" / "video": generate visuals first, then publish with the image.
 * - "text": POST /generation/text-post builds the post, then LinkedIn publish with its generation_id.
 * - Article format: share text + link on LinkedIn, which builds the preview card from the link.
 */
function publishModeOf(item: ScriptGenerationResponse): PublishMode {
  const script = getScriptFromResult(item);
  const format = item.project?.format?.trim().toLowerCase();
  if (format === "article") return "article";
  const contentType = (
    script?.content_type ||
    item.content_type ||
    item.project?.content_type ||
    item.meta?.content_type ||
    ""
  )
    .trim()
    .toLowerCase();
  return contentType === "text" ? "text" : "visual";
}

function ScriptListItem({
  item,
  index,
  featured = false,
}: {
  item: ScriptGenerationResponse;
  index: number;
  featured?: boolean;
}) {
  const script = getScriptFromResult(item);
  const id = getScriptResultId(item);
  const title = item.project?.name || script?.title || `Script ${index + 1}`;
  const href = id ? PAGE_ROUTES.SCRIPT_DETAIL(id) : PAGE_ROUTES.SCRIPT;
  const sceneCount = item.scenes?.length ?? 0;
  const characterCount = item.characters?.length ?? 0;
  const payload = toImageGenerationRequest(item);
  const blurb =
    script?.logline || script?.hook || item.project?.description || null;
  const previewScenes = (item.scenes ?? []).slice(0, featured ? 4 : 3);

  const { mutate: generateImage, isPending } = ImageGenerationMutation();
  const publishLinkedIn = LinkedInPublishMutation();
  const posted = usePostedContent();
  const [shareOpen, setShareOpen] = useState(false);
  const mode = publishModeOf(item);
  const postKey = id ? `script:${id}` : null;
  // Articles are tracked in this browser; text posts carry their own publish_status from the backend.
  const postedInfo = mode === "article" && postKey ? posted[postKey] : undefined;
  const postText = (script?.caption || script?.body || script?.hook || "").trim();

  const companyId = item.company_id || item.meta?.company_id || null;
  const textPosts = CompanyTextPostsQuery(mode === "text" ? companyId : null);
  const existingPost = id ? (textPosts.data ?? []).find((post) => post.script_id === id) ?? null : null;
  const createTextPost = CreateTextPostMutation();
  const [draft, setDraft] = useState<TextPost | null>(null);
  // The dialog shows the freshest copy: the saved post once the list has it, else the one just created.
  const dialogPost = draft ? (existingPost ?? draft) : null;

  const writeTextPost = () => {
    if (existingPost) {
      setDraft(existingPost);
      return;
    }
    if (!companyId || !id) return;
    createTextPost.mutate({ company_id: companyId, script_id: id }, { onSuccess: setDraft });
  };

  const recordPost = (response: unknown) => {
    if (!postKey || !isPublishSucceeded(response)) return false;
    markContentPosted(postKey, { platform: "linkedin", postedAt: new Date().toISOString() });
    return true;
  };

  const shareArticle = (body: { text: string; link: string }) =>
    publishLinkedIn.mutate(body, {
      onSuccess: (response) => {
        if (recordPost(response)) setShareOpen(false);
      },
    });

  return (
    <li
      className={`group/card flex h-full flex-col overflow-hidden rounded-[24px] border border-[#E6E8F5] bg-white transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#C8C6F5] hover:shadow-[0_16px_40px_rgba(91,87,230,0.1)] ${
        featured ? "md:col-span-2 xl:col-span-2" : ""
      }`}
    >
      <div className="h-1 w-full bg-gradient-to-r from-[#2E2A9E] via-[#5B57E6] to-[#A5B4FC]" />

      <div
        className={`flex flex-1 flex-col gap-4 p-4 sm:p-5 ${
          featured ? "lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(220px,0.8fr)] lg:gap-6" : ""
        }`}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Link
            href={href}
            className={`group flex items-start justify-between gap-3 rounded-xl ${FOCUS_RING}`}
          >
            <div className="flex min-w-0 items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#ECEBFF] text-[#5B57E6] ring-1 ring-[#E6E8F5]">
                <Clapperboard className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
                  Script {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-0.5 truncate text-[16px] font-semibold tracking-tight text-neutral-900 transition-colors group-hover:text-[#5B57E6]">
                  {title}
                </h3>
              </div>
            </div>
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#F6F5FF] text-[#5B57E6] transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </span>
          </Link>

          {blurb ? (
            <div className="relative rounded-2xl bg-[#F8F9FF] px-3.5 py-3">
              <Quote
                className="absolute right-3 top-3 size-4 text-[#C8C6F5]"
                aria-hidden="true"
              />
              <p
                className={`pr-6 text-[13px] leading-5 text-neutral-600 ${
                  featured ? "line-clamp-4" : "line-clamp-2"
                }`}
              >
                {blurb}
              </p>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-1.5">
            <PlatformChip platform={item.project?.platform} />
            <MetaChip label="Format" value={item.project?.format} />
            <MetaChip label="Tone" value={item.project?.tone} />
          </div>

          <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-3 text-[12px] text-neutral-500">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F6F7FD] px-2.5 py-1">
                <Film className="size-3.5 text-[#5B57E6]" aria-hidden="true" />
                {sceneCount} scene{sceneCount === 1 ? "" : "s"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F6F7FD] px-2.5 py-1">
                <Users className="size-3.5 text-[#5B57E6]" aria-hidden="true" />
                {characterCount} cast
              </span>
            </div>

            {(mode === "article" && postedInfo) || (mode === "text" && isTextPostPosted(existingPost)) ? (
              <button
                type="button"
                onClick={mode === "text" ? writeTextPost : undefined}
                disabled={mode !== "text"}
                className={`inline-flex h-8 items-center gap-1.5 rounded-full bg-emerald-50 px-3 text-[12px] font-semibold text-emerald-700 ring-1 ring-emerald-200 disabled:cursor-default ${FOCUS_RING}`}
              >
                <CheckCircle2 className="size-3.5" aria-hidden="true" />
                Posted on LinkedIn
              </button>
            ) : mode === "text" ? (
              <Button
                type="button"
                size="sm"
                disabled={!companyId || !id || createTextPost.isPending || textPosts.isLoading}
                onClick={writeTextPost}
              >
                {createTextPost.isPending ? (
                  <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                ) : existingPost ? (
                  <Send className="size-3.5" aria-hidden="true" />
                ) : (
                  <PenLine className="size-3.5" aria-hidden="true" />
                )}
                {createTextPost.isPending ? "Writing post…" : existingPost ? "Review & publish" : "Generate post"}
              </Button>
            ) : mode === "article" ? (
              <Button type="button" size="sm" onClick={() => setShareOpen(true)}>
                <Link2 className="size-3.5" aria-hidden="true" />
                Share article
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                disabled={!payload || isPending}
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
                {isPending ? "Generating…" : "Generate post"}
              </Button>
            )}
          </div>
        </div>

        {previewScenes.length ? (
          <div
            className={`rounded-[18px] border border-[#EEF0F8] bg-[#FBFBFF] p-3 ${
              featured ? "" : "mt-1"
            }`}
          >
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
              Scene preview
            </p>
            <ul className="space-y-2">
              {previewScenes.map((scene, sceneIndex) => {
                const label =
                  scene.headline ||
                  scene.action ||
                  scene.body_text ||
                  `Scene ${scene.scene_number ?? sceneIndex + 1}`;
                return (
                  <li
                    key={`${scene.scene_number ?? sceneIndex}-${label.slice(0, 24)}`}
                    className="flex items-start gap-2.5"
                  >
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg bg-white text-[10px] font-bold tabular-nums text-[#5B57E6] ring-1 ring-[#E6E8F5]">
                      {scene.scene_number ?? sceneIndex + 1}
                    </span>
                    <p className="line-clamp-2 text-[12px] leading-4 text-neutral-600">
                      {label}
                    </p>
                  </li>
                );
              })}
            </ul>
            {sceneCount > previewScenes.length ? (
              <p className="mt-2 text-[11px] text-neutral-400">
                +{sceneCount - previewScenes.length} more scenes
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {mode === "text" ? (
        <TextPostDialog post={dialogPost} open={dialogPost !== null} onOpenChange={(open) => !open && setDraft(null)} />
      ) : null}

      {mode === "article" ? (
        <ShareArticleDialog
          open={shareOpen}
          onOpenChange={setShareOpen}
          defaultText={postText}
          isPending={publishLinkedIn.isPending}
          onShare={shareArticle}
        />
      ) : null}
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
    <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item, index) => (
        <ScriptListItem
          key={getScriptResultId(item) || `${index}`}
          item={item}
          index={index}
          featured={index === 0 && items.length > 1}
        />
      ))}
    </ul>
  );
}
