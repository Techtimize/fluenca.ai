"use client";

import { useState, type FormEvent } from "react";
import { ExternalLink, Loader2, Send } from "lucide-react";
import Card from "@/components/shared/card";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage, isApiNotFoundError } from "@/errors/error-utils";
import { XPublishMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { X_MAX_TEXT_LENGTH } from "@/types/bussiness/social-accounts-type";

function imageUrlError(value: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? null : "Image URL must start with https://";
  } catch {
    return "Enter a valid image URL";
  }
}

export default function XComposer({ onConnect }: { onConnect: () => void }) {
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const { mutate: publish, isPending, data, error, reset } = XPublishMutation();

  const trimmedText = text.trim();
  const trimmedImage = imageUrl.trim();
  const remaining = X_MAX_TEXT_LENGTH - text.length;
  const imageError = imageUrlError(trimmedImage);
  const canPost =
    (trimmedText.length > 0 || trimmedImage.length > 0) &&
    remaining >= 0 &&
    !imageError &&
    !isPending;
  const notConnected = isApiNotFoundError(error);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canPost) return;
    publish(
      {
        ...(trimmedText ? { text: trimmedText } : {}),
        ...(trimmedImage ? { image_url: trimmedImage } : {}),
      },
      {
        onSuccess: () => {
          setText("");
          setImageUrl("");
        },
      },
    );
  };

  return (
    <Card className="p-5 sm:p-6">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <h2 className="text-[16px] font-semibold text-neutral-900">Post to X</h2>
          <p className="mt-1 text-[13px] text-neutral-500">
            Add text, an image, or both. Put any links inside the text.
          </p>
        </div>

        <div className="rounded-2xl border border-[#E6E8F5] bg-white focus-within:ring-2 focus-within:ring-[#5B57E6]/40">
          <textarea
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              if (data || error) reset();
            }}
            rows={4}
            placeholder="What's happening?"
            aria-label="Post text"
            className="block w-full resize-none rounded-2xl bg-transparent px-4 py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
          />
          <div className="flex justify-end px-4 pb-2">
            <span
              className={`text-xs tabular-nums ${
                remaining < 0
                  ? "font-semibold text-rose-600"
                  : remaining <= 20
                    ? "text-amber-600"
                    : "text-neutral-400"
              }`}
              aria-live="polite"
            >
              {text.length}/{X_MAX_TEXT_LENGTH}
            </span>
          </div>
        </div>

        <div>
          <input
            type="url"
            value={imageUrl}
            onChange={(event) => {
              setImageUrl(event.target.value);
              if (data || error) reset();
            }}
            placeholder="Image URL (optional, public https, 5 MB max)"
            aria-label="Image URL"
            className="h-11 w-full rounded-2xl border border-[#E6E8F5] bg-white px-4 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-[#5B57E6]/40"
          />
          {imageError ? (
            <p className="mt-1 text-xs text-rose-600">{imageError}</p>
          ) : null}
        </div>

        {notConnected ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-sm text-amber-800">X isn&apos;t connected.</p>
            <Button type="button" size="sm" onClick={onConnect}>
              Connect X
            </Button>
          </div>
        ) : error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {getApiErrorMessage(error, "Failed to post to X")}
          </p>
        ) : null}

        {data?.post_url ? (
          <a
            href={data.post_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5B57E6] hover:underline"
          >
            View on X
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        ) : null}

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!canPost}
            className="h-11 gap-2 rounded-full bg-[#5B57E6] px-5 text-white hover:bg-[#4A46D0]"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            Post
          </Button>
        </div>
      </form>
    </Card>
  );
}
