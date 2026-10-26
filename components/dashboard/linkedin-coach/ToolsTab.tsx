"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, BookMarked, Loader2, PenSquare, ShieldCheck, Target } from "lucide-react";
import {
  CopyButton,
  ErrorText,
  GrowthSection,
  LABEL,
  LoadingBlock,
  PRIMARY_BUTTON,
} from "@/components/dashboard/linkedin-growth/ui";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { getApiErrorMessage } from "@/errors/error-utils";
import { PostCheckMutation, WritePostMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { HookFormulasQuery } from "@/routes/bussiness/Bussiness-Query";
import { FOCUS_RING } from "@/utils/ui-classes";
import DraftScheduler from "./DraftScheduler";

const TEXTAREA =
  "w-full rounded-xl border border-[#E6E8F5] bg-white p-3 text-[13px] leading-5 outline-none placeholder:text-neutral-400 focus:border-[#0A66C2] focus:ring-2 focus:ring-[#0A66C2]/20";

/** Whenever you need it: check a post, write from a brief, hook formulas and prospects. */
export default function ToolsTab() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-2">
        <PostCheckCard />
        <WritePostCard />
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <HookFormulasCard />
        <ProspectsCard />
      </div>
    </div>
  );
}

function PostCheckCard() {
  const [text, setText] = useState("");
  const check = PostCheckMutation();
  const result = check.data;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    check.mutate({ text: text.trim() });
  };

  return (
    <GrowthSection
      icon={ShieldCheck}
      title="Write or fix a post"
      description="Removes the AI-written feel, scores your first line and runs the post lint."
    >
      <form onSubmit={submit} className="space-y-3">
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={7} placeholder="Paste your post" className={TEXTAREA} />
        <button type="submit" disabled={check.isPending || !text.trim()} className={PRIMARY_BUTTON}>
          {check.isPending ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
          Check post
        </button>
      </form>

      {result ? (
        <div className="mt-4 space-y-3 rounded-xl bg-[#F6F9FD] p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className={LABEL}>Cleaned-up post</p>
            <div className="flex items-center gap-2">
              {result.first_line_score != null ? (
                <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-neutral-600 ring-1 ring-[#EEF0FA]">
                  First line {Math.round(result.first_line_score)}
                </span>
              ) : null}
              <CopyButton text={result.text} />
            </div>
          </div>
          <p className="whitespace-pre-wrap text-[13px] leading-5 text-neutral-800">{result.text}</p>
          {result.lint?.length ? (
            <ul className="space-y-0.5 text-[12px] text-amber-700">
              {result.lint.map((issue) => (
                <li key={issue} className="flex gap-1">
                  <AlertTriangle className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                  {issue}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[12px] text-emerald-700">No lint issues.</p>
          )}
        </div>
      ) : null}
    </GrowthSection>
  );
}

function WritePostCard() {
  const [brief, setBrief] = useState("");
  const write = WritePostMutation();
  const draft = write.data;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    write.mutate({ brief: brief.trim() });
  };

  return (
    <GrowthSection icon={PenSquare} title="Write from a brief" description="Describe the post and get one ready draft in your voice, saved to your drafts.">
      <form onSubmit={submit} className="space-y-3">
        <textarea
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          rows={4}
          placeholder="e.g. A post about our new client win with a dental group in Dubai"
          className={TEXTAREA}
        />
        <button type="submit" disabled={write.isPending || !brief.trim()} className={PRIMARY_BUTTON}>
          {write.isPending ? <Loader2 className="size-4 animate-spin" /> : <PenSquare className="size-4" />}
          {write.isPending ? "Writing…" : "Write post"}
        </button>
      </form>

      {draft ? (
        <div className="mt-4 space-y-3 rounded-xl bg-[#F6F9FD] p-3">
          <div className="flex items-center justify-between gap-2">
            <p className={LABEL}>Draft</p>
            <CopyButton text={draft.text} />
          </div>
          <p className="whitespace-pre-wrap text-[13px] leading-5 text-neutral-800">{draft.text}</p>
          {/* Keyed so a new draft gets a fresh scheduler */}
          <DraftScheduler key={draft.id} draftId={draft.id} />
        </div>
      ) : null}
    </GrowthSection>
  );
}

function HookFormulasCard() {
  const formulasQuery = HookFormulasQuery();
  const formulas = formulasQuery.data ?? [];

  return (
    <GrowthSection icon={BookMarked} title="Hook formulas" description={`${formulas.length || 21} proven ways to open a post.`}>
      {formulasQuery.isLoading ? (
        <LoadingBlock />
      ) : formulasQuery.isError ? (
        <ErrorText>{getApiErrorMessage(formulasQuery.error, "Could not load the hook formulas")}</ErrorText>
      ) : (
        <ol className="grid max-h-[28rem] gap-2 overflow-y-auto pe-1 sm:grid-cols-2">
          {formulas.map((formula) => (
            <li key={formula.name} className="rounded-xl border border-[#EEF0FA] p-3">
              <p className="text-[13px] font-semibold text-neutral-900">{formula.name}</p>
              <p className="mt-1 text-[12px] text-neutral-600">{formula.formula}</p>
              {formula.example ? <p className="mt-1.5 text-[12px] italic text-neutral-500">“{formula.example}”</p> : null}
            </li>
          ))}
        </ol>
      )}
    </GrowthSection>
  );
}

function ProspectsCard() {
  return (
    <GrowthSection icon={Target} title="Find prospects" description="Build ideal customer profiles and get a shortlist of people to reach out to.">
      <Link href={PAGE_ROUTES.PROSPECTS} className={`${PRIMARY_BUTTON} w-fit ${FOCUS_RING}`}>
        Open prospect finder
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </GrowthSection>
  );
}
