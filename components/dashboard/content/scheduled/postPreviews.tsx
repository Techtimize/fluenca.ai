"use client";

import { Bookmark, Globe, Heart, ImageIcon, MessageCircle, MoreHorizontal, Repeat2, Send, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

export type PreviewMedia = { url: string; isVideo: boolean } | null;

const initials = (name: string) =>
  name
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("") || "?";

function Avatar({ name, className }: { name: string; className: string }) {
  return (
    <span className={cn("grid shrink-0 place-items-center rounded-full font-semibold text-white", className)} aria-hidden="true">
      {initials(name)}
    </span>
  );
}

function Media({ media, className }: { media: PreviewMedia; className?: string }) {
  if (!media) return null;
  return media.isVideo ? (
    <video src={media.url} controls muted className={cn("w-full bg-black object-contain", className)} />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element -- local blob preview, nothing to optimise
    <img src={media.url} alt="Post media" className={cn("w-full object-cover", className)} />
  );
}

/** Splits text so #hashtags can be coloured like the platform does. */
function WithHashtags({ text, className }: { text: string; className: string }) {
  return (
    <>
      {text.split(/(#[\p{L}\p{N}_]+)/u).map((part, index) =>
        part.startsWith("#") ? (
          <span key={index} className={className}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function InstagramPreview({ name, caption, media }: { name: string; caption: string; media: PreviewMedia }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#E6E8F5] bg-white">
      <header className="flex items-center gap-2.5 px-3.5 py-3">
        <span className="rounded-full bg-linear-to-tr from-[#F9CE34] via-[#EE2A7B] to-[#6228D7] p-[2px]">
          <Avatar name={name} className="size-8 bg-neutral-900 text-[11px] ring-2 ring-white" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-neutral-900">{name}</p>
          <p className="text-[11px] text-neutral-500">Business</p>
        </div>
        <MoreHorizontal className="size-4 text-neutral-500" aria-hidden="true" />
      </header>

      {media ? (
        <Media media={media} className="aspect-square" />
      ) : (
        <div className="grid aspect-square place-items-center bg-[#F6F7FD] text-neutral-400">
          <span className="flex flex-col items-center gap-2 text-[12px]">
            <ImageIcon className="size-8" aria-hidden="true" />
            Your image or video shows here
          </span>
        </div>
      )}

      <div className="flex items-center gap-3.5 px-3.5 pt-3 text-neutral-800">
        <Heart className="size-5" aria-hidden="true" />
        <MessageCircle className="size-5" aria-hidden="true" />
        <Send className="size-5" aria-hidden="true" />
        <Bookmark className="ml-auto size-5" aria-hidden="true" />
      </div>
      <div className="px-3.5 pb-3.5 pt-2">
        {caption ? (
          <p className="whitespace-pre-wrap text-[13px] leading-5 text-neutral-800">
            <span className="me-1.5 font-semibold text-neutral-900">{name}</span>
            <WithHashtags text={caption} className="text-[#4752C4]" />
          </p>
        ) : (
          <p className="text-[13px] text-neutral-400">Your caption shows here.</p>
        )}
        <p className="mt-2 text-[11px] uppercase tracking-wide text-neutral-400">Just now</p>
      </div>
    </article>
  );
}

export function LinkedInPreview({ name, text, media }: { name: string; text: string; media: PreviewMedia }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#E6E8F5] bg-white">
      <header className="flex items-start gap-2.5 px-4 pt-3.5">
        <Avatar name={name} className="size-11 rounded-lg bg-[#0A66C2] text-[13px]" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-neutral-900">{name}</p>
          <p className="flex items-center gap-1 text-[11px] text-neutral-500">
            Now · <Globe className="size-3" aria-hidden="true" />
          </p>
        </div>
        <MoreHorizontal className="size-4 text-neutral-500" aria-hidden="true" />
      </header>

      <div className="px-4 py-3">
        {text ? (
          <p className="whitespace-pre-wrap text-[13px] leading-5 text-neutral-800">
            <WithHashtags text={text} className="font-medium text-[#0A66C2]" />
          </p>
        ) : (
          <p className="text-[13px] text-neutral-400">Your post shows here.</p>
        )}
      </div>

      {media ? <Media media={media} className="max-h-96" /> : null}

      <div className="grid grid-cols-4 border-t border-[#EEF0F6] px-2 py-1.5 text-[12px] font-medium text-neutral-600">
        {[
          { icon: ThumbsUp, label: "Like" },
          { icon: MessageCircle, label: "Comment" },
          { icon: Repeat2, label: "Repost" },
          { icon: Send, label: "Send" },
        ].map(({ icon: Icon, label }) => (
          <span key={label} className="flex items-center justify-center gap-1.5 py-1.5">
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </span>
        ))}
      </div>
    </article>
  );
}
