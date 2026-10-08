"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  History,
  MessageSquarePlus,
  Mic,
  Search,
  Send,
  Settings,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
import Card from "@/components/shared/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSpeechInput } from "@/lib/chat/use-speech-input";
import type { ChatMessage, ChatMode, Conversation } from "@/types/chat";
import { FOCUS_RING } from "@/utils/ui-classes";

type Capability = {
  id: string;
  name: string;
  description: string;
  examplePrompt: string;
  needsActionMode: boolean;
};

const CAPABILITIES: Capability[] = [
  {
    id: "analyze_company",
    name: "Analyze your business",
    description: "Reads your own website and public presence: positioning, services, strengths and weaknesses.",
    examplePrompt: "Analyze my business and tell me where I'm strong and where I'm weak.",
    needsActionMode: true,
  },
  {
    id: "analyze_competitors",
    name: "Analyze competitors",
    description: "Finds and analyzes competitors: their content, engagement, and gaps versus you.",
    examplePrompt: "Who are my main competitors and what are they doing better than me?",
    needsActionMode: true,
  },
  {
    id: "analyze_niche_trends",
    name: "Find trending topics",
    description: "Researches what's trending and what your audience cares about right now.",
    examplePrompt: "What's trending in my niche right now that I should be talking about?",
    needsActionMode: true,
  },
  {
    id: "get_content_ideas",
    name: "Get content ideas",
    description: "Builds a content strategy and specific post ideas for your business.",
    examplePrompt: "Give me content ideas for this month.",
    needsActionMode: true,
  },
  {
    id: "build_growth_plan",
    name: "Build a growth plan",
    description: "Builds a full strategy — goals, platforms, content, tasks — from a goal you describe.",
    examplePrompt: "Build me a growth plan to get to 10K followers on Instagram.",
    needsActionMode: true,
  },
  {
    id: "fetch_or_search_link",
    name: "Read a link or search the web",
    description: "Paste a URL and it reads it, or ask it to search the web for something.",
    examplePrompt: "Search the web for the latest SEO trends for home-service businesses.",
    needsActionMode: true,
  },
];

type Props = {
  messages: ChatMessage[];
  onSend: (message: string) => void;
  onClose: () => void;
  onReset?: () => void;
  onOpenSettings?: () => void;
  isSending?: boolean;
  isAwaitingReply?: boolean;
  isToolRunning?: boolean;
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  conversations?: Conversation[];
  activeConversationId?: string | null;
  onSelectConversation?: (conversationId: string) => void;
  title?: string;
  subtitle?: string;
  placeholder?: string;
};

function formatRelativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export default function ChatPanel({
  messages,
  onSend,
  onClose,
  onReset,
  onOpenSettings,
  isSending = false,
  isAwaitingReply = false,
  isToolRunning = false,
  mode,
  onModeChange,
  conversations = [],
  activeConversationId = null,
  onSelectConversation,
  title = "FLUENCA.AI",
  subtitle = "Marketing Agent",
  placeholder = "Ask anything about marketing ...",
}: Props) {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [voiceBaseText, setVoiceBaseText] = useState("");
  const [capabilitiesOpen, setCapabilitiesOpen] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Grows with the text up to ~5 lines, then scrolls internally instead of clipping.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [draft]);

  const tryCapability = (capability: Capability) => {
    if (capability.needsActionMode && mode !== "action") onModeChange("action");
    setDraft(capability.examplePrompt);
    setCapabilitiesOpen(false);
  };

  const handleTranscript = useCallback(
    (transcript: string) => {
      setDraft(voiceBaseText ? `${voiceBaseText} ${transcript}` : transcript);
    },
    [voiceBaseText],
  );
  const speech = useSpeechInput(handleTranscript);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isAwaitingReply, isToolRunning]);

  return (
    <Card
      as="aside"
      className="relative flex flex-col overflow-hidden max-lg:fixed max-lg:inset-2 max-lg:z-40 max-lg:bg-white lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]"
    >
      <div className="flex items-center gap-3 border-b border-[#E6E8F5] px-4 py-3">
        <span className="grid size-9 place-items-center rounded-full bg-[#ECEBFF] text-[#5B57E6]">
          <Sparkles className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[13px] font-semibold text-neutral-900">{title}</h2>
          <p className="truncate text-xs text-neutral-500">{subtitle}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Chat history"
            title="Chat history"
            className={`rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100 ${FOCUS_RING}`}
          >
            <History className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 min-w-64">
            {onReset ? (
              <>
                <DropdownMenuItem onClick={onReset}>
                  <MessageSquarePlus className="size-4" />
                  New chat
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            ) : null}
            {conversations.length === 0 ? (
              <p className="px-1.5 py-2 text-xs text-neutral-400">No past chats yet.</p>
            ) : (
              conversations.map((conversation) => (
                <DropdownMenuItem
                  key={conversation.id}
                  onClick={() => onSelectConversation?.(conversation.id)}
                  className={conversation.id === activeConversationId ? "bg-[#ECEBFF]" : undefined}
                >
                  <span className="min-w-0 flex-1 truncate">{conversation.title}</span>
                  <span className="shrink-0 text-[10px] text-neutral-400">
                    {formatRelativeTime(conversation.lastMessageAt)}
                  </span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          type="button"
          onClick={() => setCapabilitiesOpen(true)}
          aria-label="What can this assistant do?"
          title="What can this assistant do?"
          className={`rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100 ${FOCUS_RING}`}
        >
          <Wand2 className="size-4" />
        </button>
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

      <div className="flex items-center gap-1 border-b border-[#E6E8F5] px-4 py-2">
        <button
          type="button"
          onClick={() => onModeChange("discussion")}
          aria-pressed={mode === "discussion"}
          className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            mode === "discussion"
              ? "bg-[#ECEBFF] text-[#5B57E6]"
              : "text-neutral-500 hover:bg-neutral-100"
          }`}
        >
          Discussion
        </button>
        <button
          type="button"
          onClick={() => onModeChange("action")}
          aria-pressed={mode === "action"}
          className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            mode === "action" ? "bg-[#ECEBFF] text-[#5B57E6]" : "text-neutral-500 hover:bg-neutral-100"
          }`}
        >
          Action
        </button>
      </div>

      <div role="log" aria-live="polite" className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && !isAwaitingReply ? (
          <div className="mt-8 space-y-3 text-center">
            <p className="text-xs text-neutral-500">Ask me anything, or try one of these:</p>
            <div className="flex flex-wrap justify-center gap-1.5 px-2">
              {CAPABILITIES.map((capability) => (
                <button
                  key={capability.id}
                  type="button"
                  onClick={() => tryCapability(capability)}
                  className="rounded-full border border-[#E6E8F5] bg-white px-3 py-1.5 text-[11px] font-medium text-neutral-700 hover:bg-[#F6F7FD]"
                >
                  {capability.name}
                </button>
              ))}
            </div>
          </div>
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
              {m.status === "failed" ? (
                <span className="mt-1 block text-xs text-rose-600">
                  {m.errorMessage || "That message failed."}
                </span>
              ) : null}
              {m.status === "running" && m.toolName ? (
                <span className="mt-1 block text-xs text-neutral-500">Running {m.toolName.replaceAll("_", " ")}</span>
              ) : null}
              {typeof m.toolResult?.path === "string" ? (
                <button
                  type="button"
                  onClick={() => router.push(m.toolResult!.path as string)}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#5B57E6] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#4A46D0]"
                >
                  Go there
                  <ArrowRight className="size-3.5" />
                </button>
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

      {speech.isListening ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-white/95 backdrop-blur-sm">
          <span className="relative flex size-20 items-center justify-center">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-rose-400 opacity-60" />
            <span className="absolute inline-flex size-14 animate-pulse rounded-full bg-rose-100" />
            <span className="relative grid size-12 place-items-center rounded-full bg-rose-500 text-white shadow-lg">
              <Mic className="size-6" />
            </span>
          </span>
          <div className="text-center">
            <p className="text-sm font-semibold text-neutral-900">Listening…</p>
            <p className="mt-1 max-w-[220px] text-xs text-neutral-500">
              {draft || "Speak now — your words will fill the message box."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => speech.toggle()}
            className="rounded-full bg-neutral-900 px-5 py-2 text-xs font-medium text-white hover:bg-neutral-800"
          >
            Stop listening
          </button>
        </div>
      ) : null}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const text = draft.trim();
          if (isSending) return;
          if (!text) return;
          onSend(text);
          setDraft("");
        }}
        className="m-3 flex items-center gap-2 rounded-2xl border border-[#E6E8F5] bg-white p-2 pl-4"
      >
        <textarea
          ref={textareaRef}
          autoFocus
          rows={1}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
          placeholder={placeholder}
          aria-label="Message the assistant"
          className="min-w-0 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm leading-5 outline-none placeholder:text-neutral-500"
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
          disabled={isSending}
          aria-label="Send message"
          className={`grid size-10 shrink-0 place-items-center rounded-full bg-[#5B57E6] text-white hover:bg-[#4A46D0] disabled:opacity-50 ${FOCUS_RING}`}
        >
          <Send className="size-4" />
        </button>
      </form>

      <Dialog open={capabilitiesOpen} onOpenChange={setCapabilitiesOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>What can I do?</DialogTitle>
            <DialogDescription>
              In Action mode I can run any of these. In Discussion mode I only talk — none of
              these run automatically. Click one to fill the message box.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] space-y-1 overflow-y-auto">
            {CAPABILITIES.map((capability) => (
              <button
                key={capability.id}
                type="button"
                onClick={() => tryCapability(capability)}
                className="flex w-full items-start gap-2.5 rounded-lg p-2 text-left hover:bg-neutral-100"
              >
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-[#ECEBFF] text-[#5B57E6]">
                  {capability.id === "fetch_or_search_link" ? (
                    <Search className="size-3.5" />
                  ) : (
                    <Wand2 className="size-3.5" />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-neutral-900">{capability.name}</span>
                  <span className="block text-xs text-neutral-500">{capability.description}</span>
                </span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
