"use client";

import { useState } from "react";
import { CalendarClock, Hand, Loader2, Pencil, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AiVisibilityMode, AiVisibilityOverview } from "@/routes/ai-visibility/ai-visibility.routes";
import {
  AiVisibilityQuestionsMutation,
  AiVisibilityRefreshQuestionsMutation,
  AiVisibilitySettingsMutation,
} from "@/routes/ai-visibility/AiVisibility-Query";
import { FOCUS_RING } from "@/utils/ui-classes";

const MODES: { id: AiVisibilityMode; title: string; text: string; icon: typeof Hand }[] = [
  {
    id: "automatic",
    title: "Automatic",
    text: "We check every week and keep your trend up to date. Costs research budget each week.",
    icon: CalendarClock,
  },
  {
    id: "manual",
    title: "Manual",
    text: "Nothing runs on its own. Press Check now when you want fresh results, once a day.",
    icon: Hand,
  },
];

export function ModeSwitch({ overview }: { overview: AiVisibilityOverview }) {
  const save = AiVisibilitySettingsMutation();
  return (
    <div role="radiogroup" aria-label="How checks run" className="grid gap-3 sm:grid-cols-2">
      {MODES.map((mode) => {
        const selected = overview.mode === mode.id;
        return (
          <button
            key={mode.id}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={save.isPending}
            onClick={() => !selected && save.mutate({ mode: mode.id })}
            className={`flex items-start gap-3 rounded-2xl border bg-white p-4 text-left transition-colors ${FOCUS_RING} ${
              selected ? "border-[#4F46E5] bg-[#F6F5FF] ring-1 ring-[#4F46E5]/20" : "border-[#E6E8F5] hover:bg-[#F8F9FF]"
            }`}
          >
            <mode.icon className={`mt-0.5 size-5 ${selected ? "text-[#4F46E5]" : "text-neutral-500"}`} aria-hidden="true" />
            <span className="min-w-0">
              <span className="block text-[15px] font-semibold text-neutral-900">{mode.title}</span>
              <span className="mt-1 block text-[13px] leading-5 text-neutral-600">{mode.text}</span>
              {selected && mode.id === "automatic" && overview.next_check_at ? (
                <span className="mt-2 block text-[12px] font-medium text-[#4F46E5]">
                  Next check {new Date(overview.next_check_at).toLocaleString()}
                </span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function QuestionsEditor({ overview }: { overview: AiVisibilityOverview }) {
  const [draft, setDraft] = useState<string | null>(null);
  const save = AiVisibilityQuestionsMutation();
  const refresh = AiVisibilityRefreshQuestionsMutation();

  if (draft !== null) {
    const lines = draft.split("\n").map((line) => line.trim()).filter(Boolean);
    return (
      <div className="space-y-3">
        <label className="block text-[13px] font-medium text-neutral-700" htmlFor="ai-questions">
          One question per line, as people would ask ChatGPT (up to 25)
        </label>
        <textarea
          id="ai-questions"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={Math.min(Math.max(lines.length + 2, 5), 14)}
          className={`w-full rounded-xl border border-[#E6E8F5] bg-white p-3 text-[14px] leading-6 text-neutral-900 ${FOCUS_RING}`}
        />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            disabled={save.isPending || lines.length === 0 || lines.length > 25}
            onClick={() => save.mutate(lines, { onSuccess: () => setDraft(null) })}
            className="h-9 rounded-full bg-[#4F46E5] px-4 text-white hover:bg-[#4338CA]"
          >
            {save.isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
            Save questions
          </Button>
          <Button type="button" variant="outline" onClick={() => setDraft(null)} className="h-9 rounded-full">
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {overview.questions.length ? (
        <ol className="space-y-2">
          {overview.questions.map((question, index) => (
            <li key={question.id} className="flex items-start gap-3 rounded-xl bg-white px-3 py-2.5 ring-1 ring-[#E6E8F5]">
              <span className="mt-0.5 text-[12px] font-semibold text-neutral-400">{String(index + 1).padStart(2, "0")}</span>
              <span className="min-w-0 flex-1 text-[14px] text-neutral-800">{question.text}</span>
              {question.ai_volume ? (
                <span className="shrink-0 text-[12px] text-neutral-500">{question.ai_volume.toLocaleString()} / mo</span>
              ) : null}
              {question.source === "user" ? (
                <span className="shrink-0 rounded-full bg-[#ECEBFF] px-2 py-0.5 text-[11px] font-medium text-[#4F46E5]">Yours</span>
              ) : null}
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-[13px] text-neutral-600">
          No questions yet. The first check picks the most asked ones from your keyword research.
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setDraft(overview.questions.map((q) => q.text).join("\n"))}
          className="h-9 gap-1.5 rounded-full"
        >
          <Pencil className="size-4" aria-hidden="true" />
          Edit questions
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={refresh.isPending || overview.questions.length === 0}
          onClick={() => refresh.mutate()}
          className="h-9 gap-1.5 rounded-full"
        >
          <RefreshCw className={`size-4 ${refresh.isPending ? "animate-spin" : ""}`} aria-hidden="true" />
          Pick fresh questions next check
        </Button>
      </div>
    </div>
  );
}
