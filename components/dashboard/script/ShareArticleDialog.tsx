"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && url.hostname.includes(".");
  } catch {
    return false;
  }
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultText: string;
  isPending: boolean;
  /** Text and link only: with an image_url LinkedIn shows the image and drops the link preview. */
  onShare: (body: { text: string; link: string }) => void;
};

/** Mounted fresh on each open so the fields start from the script's caption. */
function ShareForm({ defaultText, isPending, onShare, onCancel }: Omit<Props, "open" | "onOpenChange"> & { onCancel: () => void }) {
  const [text, setText] = useState(defaultText);
  const [link, setLink] = useState("");
  const [touched, setTouched] = useState(false);
  const url = normalizeUrl(link);
  const linkError = touched && !isValidUrl(url) ? "Enter the article's full web address." : null;
  const canShare = isValidUrl(url) && text.trim().length > 0 && !isPending;

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setTouched(true);
        if (canShare) onShare({ text: text.trim(), link: url });
      }}
    >
      <label className="block">
        <span className="text-[13px] font-medium text-neutral-700">Article link</span>
        <input
          type="url"
          inputMode="url"
          value={link}
          onChange={(event) => setLink(event.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="https://yourblog.com/article"
          aria-invalid={Boolean(linkError)}
          aria-describedby="article-link-help"
          className="mt-2 h-11 w-full rounded-xl border border-[#E6E8F5] bg-white px-3.5 text-[14px] text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-[#5B57E6] focus:ring-2 focus:ring-[#5B57E6]/20 aria-invalid:border-rose-300"
        />
        <span id="article-link-help" className={`mt-1.5 block text-[12px] ${linkError ? "text-rose-600" : "text-neutral-500"}`}>
          {linkError ?? "LinkedIn builds the preview card (title, image) from this link."}
        </span>
      </label>

      <label className="block">
        <span className="text-[13px] font-medium text-neutral-700">Post text</span>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={5}
          className="mt-2 w-full resize-y rounded-xl border border-[#E6E8F5] bg-white px-3.5 py-2.5 text-[14px] leading-6 text-neutral-900 outline-none focus:border-[#5B57E6] focus:ring-2 focus:ring-[#5B57E6]/20"
        />
      </label>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={!canShare}>
          {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}
          {isPending ? "Sharing…" : "Share on LinkedIn"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function ShareArticleDialog({ open, onOpenChange, ...props }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share article on LinkedIn</DialogTitle>
          <DialogDescription>Posts your text with a link to the article.</DialogDescription>
        </DialogHeader>
        {open ? <ShareForm {...props} onCancel={() => onOpenChange(false)} /> : null}
      </DialogContent>
    </Dialog>
  );
}
