"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Paperclip, RotateCcw, Send, Settings, Sparkles, X } from "lucide-react";
import Card from "@/components/shared/card";
import type { ChatMessage } from "@/types/chat";
import { FOCUS_RING } from "@/utils/ui-classes";

type Props = {
  messages: ChatMessage[];
  onSend: (message: string) => void;
  onClose: () => void;
  onReset?: () => void;
  onOpenSettings?: () => void;
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
  title = "Influ.AI",
  subtitle = "Marketing Agent",
  placeholder = "Ask anything about marketing ...",
}: Props) {
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  // Keep the newest message in view.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <Card
      as="aside"
      className="flex flex-col overflow-hidden max-lg:fixed max-lg:inset-2 max-lg:z-40 max-lg:bg-white lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]"
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[#E6E8F5] px-4 py-3">
        <span className="grid size-9 place-items-center rounded-full bg-[#ECEBFF] text-[#5B57E6]">
          <Sparkles className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[13px] font-semibold text-neutral-900">{title}</h2>
          <p className="truncate text-xs text-neutral-500">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          aria-label="Start a new chat"
          className={`rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100 ${FOCUS_RING}`}
        >
          <RotateCcw className="size-4" />
        </button>
        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="Chat settings"
          className={`rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100 ${FOCUS_RING}`}
        >
          <Settings className="size-4" />
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className={`rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100 ${FOCUS_RING}`}
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Messages */}
      <div role="log" aria-live="polite" className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
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
              {m.content}
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const text = draft.trim();
          if (!text) return;
          onSend(text);
          setDraft("");
        }}
        className="m-3 flex items-center gap-2 rounded-full border border-[#E6E8F5] bg-white p-2 pl-4"
      >
        <button type="button" aria-label="Attach a file" className="text-neutral-600 hover:text-neutral-900">
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
        <button type="button" aria-label="Use voice input" className="text-neutral-600 hover:text-neutral-900">
          <Mic className="size-4" />
        </button>
        <button
          type="submit"
          aria-label="Send message"
          className={`grid size-10 place-items-center rounded-full bg-[#5B57E6] text-white hover:bg-[#4A46D0] ${FOCUS_RING}`}
        >
          <Send className="size-4" />
        </button>
      </form>
    </Card>
  );
}