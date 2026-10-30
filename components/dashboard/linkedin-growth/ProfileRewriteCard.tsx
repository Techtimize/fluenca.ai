"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, PenLine, RotateCw, Sparkles, XCircle } from "lucide-react";
import { ProfileRewriteMutation } from "@/routes/bussiness/Bussiness-Mutation";
import type { RewriteOption } from "@/types/bussiness/linkedin-growth-type";
import { FOCUS_RING } from "@/utils/ui-classes";
import { CopyButton, EmptyAction, GHOST_BUTTON, GrowthSection, LABEL, PRIMARY_BUTTON } from "./ui";

type Tab = "headline" | "about";

/** 3 headline and 2–3 About options, written from the DNA in the story bank voice. */
export default function ProfileRewriteCard({ hasProfileScore }: { hasProfileScore: boolean }) {
  const rewrite = ProfileRewriteMutation();
  const [tab, setTab] = useState<Tab>("headline");
  const data = rewrite.data;
  const options = (tab === "headline" ? data?.headlines : data?.abouts) ?? [];

  return (
    <GrowthSection
      icon={PenLine}
      title="Headline and About, rewritten"
      description="Written from your Company DNA in your voice, starting from your last-scored profile. Pick one and paste it into LinkedIn."
      action={
        data ? (
          <button type="button" onClick={() => rewrite.mutate()} disabled={rewrite.isPending} className={GHOST_BUTTON}>
            {rewrite.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <RotateCw className="size-3.5" />}
            New options
          </button>
        ) : null
      }
    >
      {data ? (
        <div>
          <div className="inline-flex rounded-full bg-[#F1F4F9] p-1" role="tablist" aria-label="Section">
            {(["headline", "about"] as const).map((value) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={tab === value}
                onClick={() => setTab(value)}
                className={`rounded-full px-4 py-1.5 text-[12px] font-medium ${FOCUS_RING} ${
                  tab === value ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
                }`}
              >
                {value === "headline" ? `Headline (${data.headlines.length})` : `About (${data.abouts.length})`}
              </button>
            ))}
          </div>
          <ol className="mt-3 space-y-3">
            {options.map((option, index) => (
              <li key={option.text}>
                <OptionCard option={option} index={index} isHeadline={tab === "headline"} />
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <EmptyAction
          text={
            hasProfileScore
              ? "Get 3 headline options and 2–3 About options to pick from."
              : "Score your profile first, so the rewrite starts from where you are now."
          }
        >
          <button type="button" onClick={() => rewrite.mutate()} disabled={rewrite.isPending || !hasProfileScore} className={PRIMARY_BUTTON}>
            {rewrite.isPending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {rewrite.isPending ? "Writing options…" : "Write my options"}
          </button>
        </EmptyAction>
      )}
    </GrowthSection>
  );
}

function OptionCard({ option, index, isHeadline }: { option: RewriteOption; index: number; isHeadline: boolean }) {
  return (
    <article className="rounded-xl border border-[#EEF0FA] p-3">
      <div className="flex items-center justify-between gap-2">
        <span className={LABEL}>Option {index + 1}</span>
        <CopyButton text={option.text} />
      </div>
      <p className={`mt-1.5 whitespace-pre-wrap text-neutral-800 ${isHeadline ? "text-[14px] font-medium" : "text-[13px] leading-6"}`}>
        {option.text}
      </p>

      {option.before_see_more ? (
        <div className="mt-3 rounded-lg bg-[#F6F9FD] p-2.5">
          <p className={LABEL}>Before “see more”</p>
          <p className="mt-1 text-[12px] leading-5 text-neutral-700">
            {option.before_see_more}
            <span className="text-neutral-400">… see more</span>
          </p>
        </div>
      ) : null}

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px]">
        {option.headline_check ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${
              option.headline_check.passed ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
            }`}
          >
            {option.headline_check.passed ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />}
            Headline check {option.headline_check.passed ? "passed" : "needs work"}
          </span>
        ) : null}
        {option.ai_feel ? (
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 font-medium text-neutral-600">
            AI feel: {option.ai_feel.label ?? Math.round(option.ai_feel.score)}
          </span>
        ) : null}
      </div>
      {option.headline_check?.notes?.length ? (
        <ul className="mt-1.5 list-disc space-y-0.5 ps-4 text-[11px] text-neutral-500">
          {option.headline_check.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
