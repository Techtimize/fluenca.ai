"use client";

import { useCallback, useState } from "react";
import { Mic, Paperclip, Send } from "lucide-react";
import { useSpeechInput } from "@/lib/chat/use-speech-input";
import { FOCUS_RING } from "@/utils/ui-classes";

type Props = {
  onSend: (message: string) => void;
  onOpen?: () => void; // called when the bar gets focus (opens the chat panel)
  placeholder?: string;
};

// Fixed to the bottom of the screen, so it stays visible while the page scrolls.
export default function ChatInput({ onSend, onOpen, placeholder = "Ask anything about marketing ..." }: Props) {
  const [message, setMessage] = useState("");
  const [voiceBaseText, setVoiceBaseText] = useState("");

  const handleTranscript = useCallback(
    (transcript: string) => {
      setMessage(voiceBaseText ? `${voiceBaseText} ${transcript}` : transcript);
    },
    [voiceBaseText],
  );
  const speech = useSpeechInput(handleTranscript);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const text = message.trim();
        if (!text) return;
        onSend(text);
        setMessage("");
      }}
      className="fixed bottom-4 left-1/2 z-30 flex w-[min(580px,calc(100%-2rem))] -translate-x-1/2 items-center gap-2 rounded-full border border-[#E6E8F5] bg-white p-2 pl-4 shadow-lg md:translate-x-[calc(-50%+2.5rem)]"
    >
      <button
        type="button"
        disabled
        aria-label="Attach a file (coming soon)"
        title="Coming soon"
        className="cursor-not-allowed text-neutral-300"
      >
        <Paperclip className="size-4" />
      </button>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onFocus={onOpen}
        placeholder={placeholder}
        aria-label="Ask anything about marketing"
        className="h-9 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-neutral-500"
      />
      <button
        type="button"
        disabled={!speech.isSupported}
        onClick={() => {
          onOpen?.();
          if (!speech.isListening) setVoiceBaseText(message);
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
        aria-label="Send message"
        className={`grid size-10 place-items-center rounded-full bg-[#5B57E6] text-white hover:bg-[#4A46D0] ${FOCUS_RING}`}
      >
        <Send className="size-4" />
      </button>
    </form>
  );
}
