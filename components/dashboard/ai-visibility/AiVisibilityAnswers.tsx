"use client";

import { useState } from "react";
import { Check, ChevronDown, Loader2, Minus, X } from "lucide-react";
import type { AiVisibilityAnswer } from "@/routes/ai-visibility/ai-visibility.routes";
import { AiVisibilityRunQuery } from "@/routes/ai-visibility/AiVisibility-Query";
import { FOCUS_RING } from "@/utils/ui-classes";
import { ENGINE_NAMES } from "./AiVisibilityPanels";

function Cell({ answer }: { answer: AiVisibilityAnswer | undefined }) {
  if (!answer) return <Minus className="mx-auto size-4 text-neutral-300" aria-label="Not asked" />;
  if (answer.engine === "google_search") {
    return answer.google_rank ? (
      <span className="text-[13px] font-semibold text-emerald-600">#{answer.google_rank}</span>
    ) : (
      <X className="mx-auto size-4 text-rose-500" aria-label="Not in the top 10" />
    );
  }
  if (!answer.mentioned) return <X className="mx-auto size-4 text-rose-500" aria-label="Not mentioned" />;
  return (
    <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-emerald-600">
      <Check className="size-4" aria-hidden="true" />
      {answer.position ? `#${answer.position}` : ""}
      {answer.cited ? <span className="text-[11px] font-medium text-[#4F46E5]">cited</span> : null}
    </span>
  );
}

function highlight(text: string, brands: string[]) {
  if (!brands.length) return text;
  const pattern = new RegExp(`(${brands.map((b) => b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return text.split(pattern).map((part, index) =>
    index % 2 ? (
      <mark key={index} className="rounded bg-[#ECEBFF] px-0.5 text-[#3730A3]">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

export function AnswersMatrix({ runId, engines }: { runId: string; engines: string[] }) {
  const { data, isLoading, isError } = AiVisibilityRunQuery(runId);
  const [open, setOpen] = useState<string | null>(null);

  if (isLoading) {
    return (
      <p className="flex items-center gap-2 text-[13px] text-neutral-500">
        <Loader2 className="size-4 animate-spin text-[#5B57E6]" aria-hidden="true" />
        Loading the answers…
      </p>
    );
  }
  if (isError || !data) return <p className="text-[13px] text-rose-700">Could not load the answers.</p>;

  const questions = Array.from(new Set(data.answers.map((a) => a.question)));
  const find = (question: string, engine: string) =>
    data.answers.find((a) => a.question === question && a.engine === engine);

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <table className="w-full min-w-160 text-left text-[14px]">
          <thead>
            <tr className="text-[12px] uppercase tracking-[0.06em] text-neutral-500">
              <th className="py-2 font-medium">Question</th>
              {engines.map((engine) => (
                <th key={engine} className="py-2 text-center font-medium">
                  {ENGINE_NAMES[engine] ?? engine}
                </th>
              ))}
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => {
              const expanded = open === question;
              return (
                <tr key={question} className="border-t border-[#EEF0F7] align-top">
                  <td className="py-3 pe-3 text-neutral-900">
                    {question}
                    {expanded ? (
                      <div className="mt-3 space-y-3">
                        {engines
                          .filter((engine) => engine !== "google_search")
                          .map((engine) => {
                            const answer = find(question, engine);
                            if (!answer) return null;
                            return (
                              <div key={engine} className="rounded-xl bg-[#F8F9FD] p-3 ring-1 ring-[#E6E8F5]">
                                <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-neutral-500">
                                  {ENGINE_NAMES[engine]} said
                                </p>
                                <p className="mt-1.5 max-h-56 overflow-y-auto whitespace-pre-wrap text-[13px] leading-5 text-neutral-700">
                                  {answer.answer_text ? highlight(answer.answer_text, answer.brands) : "No answer this time."}
                                </p>
                                {answer.sources.length ? (
                                  <p className="mt-2 truncate text-[12px] text-neutral-500">
                                    Sources: {answer.sources.slice(0, 4).map((s) => s.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]).join(", ")}
                                  </p>
                                ) : null}
                              </div>
                            );
                          })}
                      </div>
                    ) : null}
                  </td>
                  {engines.map((engine) => (
                    <td key={engine} className="py-3 text-center">
                      <Cell answer={find(question, engine)} />
                    </td>
                  ))}
                  <td className="py-2 text-end">
                    <button
                      type="button"
                      onClick={() => setOpen(expanded ? null : question)}
                      aria-expanded={expanded}
                      aria-label={expanded ? "Hide what AI said" : "Show what AI said"}
                      className={`grid size-8 place-items-center rounded-full text-neutral-500 hover:bg-[#EEF0FF] hover:text-[#4F46E5] ${FOCUS_RING}`}
                    >
                      <ChevronDown className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-[12px] text-neutral-500">
        ✓ #n means the AI named you, at position n. Google search shows your rank in the top 10.
      </p>
    </div>
  );
}
