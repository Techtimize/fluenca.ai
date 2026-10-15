"use client";

import { Fragment, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronDown, Loader2 } from "lucide-react";
import type { AiVisibilityAnswer } from "@/routes/ai-visibility/ai-visibility.routes";
import { AiVisibilityRunQuery } from "@/routes/ai-visibility/AiVisibility-Query";
import { FOCUS_RING } from "@/utils/ui-classes";
import { ENGINE_NAMES } from "./AiVisibilityPanels";

const MAX_CHIPS = 8;
const NAMED_PREVIEW = 4;

function Status({ answer }: { answer: AiVisibilityAnswer | undefined }) {
  if (!answer || (!answer.answer_text && answer.engine !== "google_search" && !answer.mentioned)) {
    return <span className="text-[12px] text-neutral-400">No answer</span>;
  }
  if (answer.engine === "google_search") {
    return answer.google_rank ? (
      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[12px] font-semibold text-emerald-700">
        Rank #{answer.google_rank}
      </span>
    ) : (
      <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[12px] font-medium text-rose-700">Not top 10</span>
    );
  }
  return answer.mentioned ? (
    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[12px] font-semibold text-emerald-700">
      Named{answer.position ? ` #${answer.position}` : ""}
      {answer.cited ? " · cited" : ""}
    </span>
  ) : (
    <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[12px] font-medium text-rose-700">Not named</span>
  );
}

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

function sourceHost(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];
}

function AnswerText({ text }: { text: string }) {
  return (
    <div className="mt-2 max-h-80 space-y-2 overflow-y-auto break-words text-[13px] leading-5 text-neutral-700 [&_a]:text-[#4F46E5] [&_a]:underline [&_h1]:font-semibold [&_h2]:font-semibold [&_h3]:font-semibold [&_li]:ms-4 [&_ol]:list-decimal [&_strong]:font-semibold [&_strong]:text-neutral-900 [&_td]:border [&_td]:border-[#E6E8F5] [&_td]:p-1.5 [&_th]:border [&_th]:border-[#E6E8F5] [&_th]:bg-[#F8F9FD] [&_th]:p-1.5 [&_th]:text-left [&_ul]:list-disc">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noreferrer">
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[12px]">{children}</table>
            </div>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

function AnswerCard({ engine, answer }: { engine: string; answer: AiVisibilityAnswer }) {
  const [full, setFull] = useState(false);
  const sources = Array.from(new Set(answer.sources.map(sourceHost)));

  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-xl bg-white p-4 ring-1 ring-[#E6E8F5]">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] font-semibold text-neutral-900">{ENGINE_NAMES[engine]}</p>
        <Status answer={answer} />
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
          {full ? <AnswerText text={answer.answer_text} /> : null}
        </div>
      ) : null}
    </div>
  );
}

export function AnswersMatrix({
  runId,
  engines,
  peopleAlsoAsk = {},
}: {
  runId: string;
  engines: string[];
  peopleAlsoAsk?: Record<string, string[]>;
}) {
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
  const namedFor = (question: string) => {
    const counts = new Map<string, number>();
    for (const answer of data.answers) {
      if (answer.question !== question) continue;
      for (const brand of answer.brands) counts.set(brand, (counts.get(brand) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([brand]) => brand);
  };

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <table className="w-full min-w-180 table-fixed text-left text-[14px]">
          <colgroup>
            <col />
            {engines.map((engine) => (
              <col key={engine} className="w-32" />
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
              const named = namedFor(question);
              return (
                <Fragment key={question}>
                  <tr className="border-t border-[#EEF0F7] align-top">
                    <td className="py-3 pe-3">
                      <button
                        type="button"
                        onClick={() => setOpen(expanded ? null : question)}
                        className={`text-left text-neutral-900 hover:text-[#4F46E5] ${FOCUS_RING}`}
                      >
                        {question}
                      </button>
                      {named.length ? (
                        <p className="mt-1 text-[12px] text-neutral-500">
                          AI names: {named.slice(0, NAMED_PREVIEW).join(", ")}
                          {named.length > NAMED_PREVIEW ? ` +${named.length - NAMED_PREVIEW}` : ""}
                        </p>
                      ) : null}
                    </td>
                    {engines.map((engine) => (
                      <td key={engine} className="py-3 text-center">
                        <Status answer={find(question, engine)} />
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
                        {peopleAlsoAsk[question]?.length ? (
                          <div className="mb-3 rounded-xl bg-white p-4 ring-1 ring-[#E6E8F5]">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-500">
                              People also ask on Google
                            </p>
                            <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                              {peopleAlsoAsk[question].map((related) => (
                                <li key={related} className="flex items-start gap-2 text-[13px] text-neutral-700">
                                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#4F46E5]" aria-hidden="true" />
                                  {related}
                                </li>
                              ))}
                            </ul>
                            <p className="mt-2 text-[11px] text-neutral-400">
                              A post written for this question answers these in its FAQ.
                            </p>
                          </div>
                        ) : null}
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
        Named #n: the AI recommended you, at position n. Not named: it answered but recommended others. Google
        search shows your rank in the top 10. Open a question to see who it recommended and why.
      </p>
    </div>
  );
}
