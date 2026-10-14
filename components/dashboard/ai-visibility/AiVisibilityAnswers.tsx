"use client";

import { Fragment, useState } from "react";
import { Check, ChevronDown, Loader2, Minus, X } from "lucide-react";
import type { AiVisibilityAnswer } from "@/routes/ai-visibility/ai-visibility.routes";
import { AiVisibilityRunQuery } from "@/routes/ai-visibility/AiVisibility-Query";
import { FOCUS_RING } from "@/utils/ui-classes";
import { ENGINE_NAMES } from "./AiVisibilityPanels";

const TABLE_DIVIDER = /^\s*\|?\s*:?-{2,}/;
const MARKDOWN_LINK = /\[([^\]]+)\]\((https?:[^)]+)\)/g;
const BARE_SOURCE = /\(\s*\[?[a-z0-9.-]+\.[a-z]{2,}\]?\s*\)/gi;

export function readableAnswer(text: string): string {
  return text
    .split("\n")
    .filter((line) => !TABLE_DIVIDER.test(line))
    .map((line) => {
      const cleaned = line
        .replace(MARKDOWN_LINK, "$1")
        .replace(BARE_SOURCE, "")
        .replace(/\*\*|__|`/g, "")
        .replace(/^#{1,6}\s+/, "")
        .replace(/\\[()[\]]/g, "")
        .replace(/\\text\{([^}]*)\}/g, "$1")
        .replace(/\\times/g, "×")
        .replace(/\s?(\[\d+\])+/g, "");
      if (!cleaned.trim().startsWith("|")) return cleaned;
      return cleaned
        .split("|")
        .map((cell) => cell.trim())
        .filter(Boolean)
        .join(" · ");
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

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

function sourceHost(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];
}

const MAX_CHIPS = 8;

function Chips({ items, tone }: { items: string[]; tone: "brand" | "source" }) {
  const shown = items.slice(0, MAX_CHIPS);
  const style =
    tone === "brand" ? "bg-[#ECEBFF] text-[#3730A3]" : "bg-[#F1F3F9] text-neutral-700 ring-1 ring-[#E6E8F5]";
  return (
    <span className="flex flex-wrap gap-1.5">
      {shown.map((item) => (
        <span key={item} className={`max-w-full truncate rounded-full px-2 py-0.5 text-[12px] font-medium ${style}`}>
          {item}
        </span>
      ))}
      {items.length > shown.length ? (
        <span className="px-1 py-0.5 text-[12px] text-neutral-500">+{items.length - shown.length} more</span>
      ) : null}
    </span>
  );
}

function AnswerCard({ engine, answer }: { engine: string; answer: AiVisibilityAnswer }) {
  const [full, setFull] = useState(false);
  const sources = Array.from(new Set(answer.sources.map(sourceHost)));
  const badge = !answer.answer_text
    ? { text: "No answer", style: "bg-neutral-100 text-neutral-600" }
    : answer.mentioned
      ? { text: `Named you${answer.position ? ` #${answer.position}` : ""}`, style: "bg-emerald-50 text-emerald-700" }
      : { text: "Not named", style: "bg-rose-50 text-rose-700" };

  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-xl bg-white p-4 ring-1 ring-[#E6E8F5]">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] font-semibold text-neutral-900">{ENGINE_NAMES[engine]}</p>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${badge.style}`}>{badge.text}</span>
      </div>

      <div className="space-y-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-500">Recommends</p>
        {answer.brands.length ? (
          <Chips items={answer.brands} tone="brand" />
        ) : (
          <p className="text-[12px] text-neutral-500">No brands named</p>
        )}
      </div>

      {sources.length ? (
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-500">Sources it used</p>
          <Chips items={sources} tone="source" />
        </div>
      ) : null}

      {answer.answer_text ? (
        <div className="mt-auto border-t border-[#EEF0F7] pt-2">
          <button
            type="button"
            onClick={() => setFull(!full)}
            aria-expanded={full}
            className={`inline-flex items-center gap-1 rounded text-[12px] font-medium text-[#4F46E5] hover:underline ${FOCUS_RING}`}
          >
            {full ? "Hide full answer" : "Read full answer"}
            <ChevronDown className={`size-3.5 transition-transform ${full ? "rotate-180" : ""}`} aria-hidden="true" />
          </button>
          {full ? (
            <p className="mt-2 max-h-80 overflow-y-auto whitespace-pre-wrap break-words text-[13px] leading-5 text-neutral-700">
              {highlight(readableAnswer(answer.answer_text), answer.brands)}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
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
  const worded = engines.filter((engine) => engine !== "google_search");

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <table className="w-full min-w-160 table-fixed text-left text-[14px]">
          <colgroup>
            <col />
            {engines.map((engine) => (
              <col key={engine} className="w-28" />
            ))}
            <col className="w-12" />
          </colgroup>
          <thead>
            <tr className="text-[12px] uppercase tracking-[0.06em] text-neutral-500">
              <th className="py-2 font-medium">Question</th>
              {engines.map((engine) => (
                <th key={engine} className="whitespace-nowrap py-2 text-center font-medium">
                  {ENGINE_NAMES[engine] ?? engine}
                </th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => {
              const expanded = open === question;
              return (
                <Fragment key={question}>
                  <tr className="border-t border-[#EEF0F7] align-top">
                    <td className="py-3 pe-3 text-neutral-900">{question}</td>
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
                        <ChevronDown
                          className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                          aria-hidden="true"
                        />
                      </button>
                    </td>
                  </tr>
                  {expanded ? (
                    <tr>
                      <td colSpan={engines.length + 2} className="pb-4">
                        <div className="grid gap-3 lg:grid-cols-3">
                          {worded.map((engine) => {
                            const answer = find(question, engine);
                            return answer ? <AnswerCard key={engine} engine={engine} answer={answer} /> : null;
                          })}
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-[12px] text-neutral-500">
        ✓ #n means the AI named you, at position n. Google search shows your rank in the top 10. ✗ means not named.
      </p>
    </div>
  );
}
