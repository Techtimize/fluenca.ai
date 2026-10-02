"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Mic, Paperclip, RotateCcw, Send, Settings, Sparkles, X } from "lucide-react";
import Card from "@/components/shared/card";
import { useSpeechInput } from "@/lib/chat/use-speech-input";
import { UploadAttachmentMutation } from "@/routes/chatbot/Chatbot-Mutation";
import type { ChatMessage } from "@/types/chat";
import { FOCUS_RING } from "@/utils/ui-classes";

type Props = {
  messages: ChatMessage[];
  onSend: (message: string, imageUrl?: string) => void;
  onClose: () => void;
  onReset?: () => void;
  onOpenSettings?: () => void;
  isSending?: boolean;
  isAwaitingReply?: boolean;
  isToolRunning?: boolean;
  title?: string;
  subtitle?: string;
  placeholder?: string;
};

export default function ChatPanel({
  messages,
  onSend,
  onClose,
  onReset,
  onOpenSettings,
  isSending = false,
  isAwaitingReply = false,
  isToolRunning = false,
  title = "Influ.AI",
  subtitle = "Marketing Agent",
  placeholder = "Ask anything about marketing ...",
}: Props) {
  const [draft, setDraft] = useState("");
  const [voiceBaseText, setVoiceBaseText] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTranscript = useCallback(
    (transcript: string) => {
      setDraft(voiceBaseText ? `${voiceBaseText} ${transcript}` : transcript);
    },
    [voiceBaseText],
  );
  const speech = useSpeechInput(handleTranscript);
  const uploadAttachment = UploadAttachmentMutation();

  const clearAttachment = () => {
    setPreviewUrl(null);
    uploadAttachment.reset();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    uploadAttachment.mutate(file, { onError: () => clearAttachment() });
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isAwaitingReply, isToolRunning]);

  return (
    <Card
      as="aside"
      className="flex flex-col overflow-hidden max-lg:fixed max-lg:inset-2 max-lg:z-40 max-lg:bg-white lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]"
    >
      <div className="flex items-center gap-3 border-b border-[#E6E8F5] px-4 py-3">
        <span className="grid size-9 place-items-center rounded-full bg-[#ECEBFF] text-[#5B57E6]">
          <Sparkles className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[13px] font-semibold text-neutral-900">{title}</h2>
          <p className="truncate text-xs text-neutral-500">{subtitle}</p>
        </div>
        {onReset ? (
          <button
            type="button"
            onClick={onReset}
            aria-label="Start a new chat"
            className={`rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100 ${FOCUS_RING}`}
          >
            <RotateCcw className="size-4" />
          </button>
        ) : null}
        {onOpenSettings ? (
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Chat settings"
            className={`rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100 ${FOCUS_RING}`}
          >
            <Settings className="size-4" />
          </button>
        ) : null}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className={`rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100 ${FOCUS_RING}`}
        >
          <X className="size-4" />
        </button>
      </div>

      <div role="log" aria-live="polite" className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && !isAwaitingReply ? (
          <p className="mt-8 text-center text-xs text-neutral-500">Ask me anything about your marketing.</p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-[13px] leading-5 ${
                m.role === "user"
                  ? "ml-auto rounded-br-md bg-[#ECEBFF] text-neutral-900"
                  : "mr-auto rounded-bl-md border border-[#E6E8F5] bg-[#F6F7FD] text-neutral-800"
              }`}
            >
              {m.imageUrl ? (
                <Image
                  src={m.imageUrl}
                  alt="Attached"
                  width={240}
                  height={180}
                  className="mb-2 max-h-48 w-full rounded-lg object-cover"
                  unoptimized
                />
              ) : null}
              {m.content}
              {m.status === "failed" ? (
                <span className="mt-1 block text-xs text-rose-600">
                  {m.errorMessage || "That message failed."}
                </span>
              ) : null}
              {m.status === "running" && m.toolName ? (
                <span className="mt-1 block text-xs text-neutral-500">Running {m.toolName}…</span>
              ) : null}
            </div>
          ))
        )}

        {isAwaitingReply ? (
          <div className="mr-auto max-w-[85%] rounded-2xl rounded-bl-md border border-[#E6E8F5] bg-[#F6F7FD] px-3 py-2 text-[13px] text-neutral-500">
            Thinking…
          </div>
        ) : null}

        {isToolRunning && !isSending ? (
          <p className="text-center text-xs text-neutral-500">Working on it. This can take a while.</p>
        ) : null}

        <div ref={endRef} />
      </div>

      {previewUrl ? (
        <div className="mx-3 mb-1 flex items-center gap-2 rounded-lg border border-[#E6E8F5] bg-[#F6F7FD] p-2">
          <div className="relative size-10 shrink-0 overflow-hidden rounded">
            <Image src={previewUrl} alt="Attachment preview" fill unoptimized className="object-cover" />
          </div>
          <span className="flex-1 truncate text-xs text-neutral-600">
            {uploadAttachment.isPending ? "Uploading…" : uploadAttachment.isError ? "Upload failed" : "Attached"}
          </span>
          {uploadAttachment.isPending ? (
            <Loader2 className="size-3.5 shrink-0 animate-spin text-neutral-500" />
          ) : null}
          <button
            type="button"
            onClick={clearAttachment}
            aria-label="Remove attachment"
            className="shrink-0 text-neutral-500 hover:text-neutral-700"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : null}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const text = draft.trim();
          const imageUrl = uploadAttachment.data;
          if (isSending || uploadAttachment.isPending) return;
          if (!text && !imageUrl) return;
          onSend(text || "What do you think of this image?", imageUrl);
          setDraft("");
          clearAttachment();
        }}
        className="m-3 flex items-center gap-2 rounded-full border border-[#E6E8F5] bg-white p-2 pl-4"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Attach an image"
          className="text-neutral-600 hover:text-neutral-900"
        >
          <Paperclip className="size-4" />
        </button>
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          aria-label="Message the assistant"
          className="h-9 min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-neutral-500"
        />
        <button
          type="button"
          disabled={!speech.isSupported}
          onClick={() => {
            if (!speech.isListening) setVoiceBaseText(draft);
            speech.toggle();
          }}
          aria-label={speech.isSupported ? "Use voice input" : "Voice input not supported in this browser"}
          title={speech.isSupported ? undefined : "Voice input not supported in this browser"}
          className={
            speech.isListening
              ? "animate-pulse text-rose-600"
              : speech.isSupported
                ? "text-neutral-600 hover:text-neutral-900"
                : "cursor-not-allowed text-neutral-300"
          }
        >
          <Mic className="size-4" />
        </button>
        <button
          type="submit"
          disabled={isSending || uploadAttachment.isPending}
          aria-label="Send message"
          className={`grid size-10 place-items-center rounded-full bg-[#5B57E6] text-white hover:bg-[#4A46D0] disabled:opacity-50 ${FOCUS_RING}`}
        >
          <Send className="size-4" />
        </button>
      </form>
    </Card>
  );
}
