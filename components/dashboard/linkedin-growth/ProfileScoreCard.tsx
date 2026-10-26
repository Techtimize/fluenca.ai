"use client";

import { useState } from "react";
import { ChevronDown, ClipboardCheck, Loader2, RotateCw, Sparkles } from "lucide-react";
import { getApiErrorMessage, isApiNotFoundError } from "@/errors/error-utils";
import { RunProfileScoreMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { ProfileScoreHistoryQuery, ProfileScoreQuery } from "@/routes/bussiness/Bussiness-Query";
import type { ProfileScoreItem } from "@/types/bussiness/linkedin-growth-type";
import { FOCUS_RING } from "@/utils/ui-classes";
import {
  ChangeBadge,
  EmptyAction,
  ErrorText,
  GHOST_BUTTON,
  GrowthSection,
  LABEL,
  LoadingBlock,
  PRIMARY_BUTTON,
  ScoreRing,
  scoreColor,
} from "./ui";

/** Profile score out of 100: the top 3 fixes, then all 12 checklist items. */
export default function ProfileScoreCard() {
  const scoreQuery = ProfileScoreQuery();
  const historyQuery = ProfileScoreHistoryQuery();
  const runScore = RunProfileScoreMutation();
  const score = scoreQuery.data;
  const noScoreYet = scoreQuery.isError && isApiNotFoundError(scoreQuery.error);

  // Change against the score before this one, when there is one.
  const previous = historyQuery.data?.find((entry) => entry.id !== score?.id && entry.created_at !== score?.created_at);

  return (
    <GrowthSection
      icon={ClipboardCheck}
      title="Profile score"
      description="Your headline, About, photo, banner, featured, experience and more, against the 100-point checklist."
      action={
        score ? (
          <button type="button" onClick={() => runScore.mutate(undefined)} disabled={runScore.isPending} className={GHOST_BUTTON}>
            {runScore.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <RotateCw className="size-3.5" />}
            Re-score
          </button>
        ) : null
      }
    >
      {scoreQuery.isLoading ? (
        <LoadingBlock />
      ) : scoreQuery.isError && !noScoreYet ? (
        <ErrorText>{getApiErrorMessage(scoreQuery.error, "Could not load your profile score")}</ErrorText>
      ) : score ? (
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex flex-col items-center gap-2">
              <ScoreRing score={score.total} label="Profile score" />
              {previous ? <ChangeBadge change={score.total - previous.total} suffix="since last check" /> : null}
            </div>
            {score.top_fixes.length ? (
              <div className="flex-1">
                <p className={LABEL}>Top 3 fixes</p>
                <ol className="mt-2 space-y-2">
                  {score.top_fixes.slice(0, 3).map((fix, index) => (
                    <li key={fix.key} className="flex gap-2.5 rounded-xl bg-[#F6F9FD] p-3">
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#0A66C2] text-[11px] font-bold text-white">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="flex flex-wrap items-center gap-2 text-[13px] font-semibold text-neutral-900">
                          {fix.label}
                          <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                            +{fix.points_to_gain} pts
                          </span>
                        </p>
                        {fix.fix ? <p className="mt-0.5 text-[12px] leading-5 text-neutral-600">{fix.fix}</p> : null}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </div>
          {score.items.length ? <Checklist items={score.items} /> : null}
        </div>
      ) : (
        <EmptyAction text="Score your profile against the 100-point checklist and get your top 3 fixes.">
          <button type="button" onClick={() => runScore.mutate(undefined)} disabled={runScore.isPending} className={PRIMARY_BUTTON}>
            {runScore.isPending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {runScore.isPending ? "Scoring your profile…" : "Score my profile"}
          </button>
        </EmptyAction>
      )}
    </GrowthSection>
  );
}

function Checklist({ items }: { items: ProfileScoreItem[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-[#EEF0FA]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-medium text-neutral-700 ${FOCUS_RING}`}
      >
        All {items.length} checklist items
        <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open ? (
        <ul className="space-y-3 border-t border-[#EEF0FA] px-3 py-3">
          {items.map((item) => {
            const percent = item.max_points ? (item.points / item.max_points) * 100 : 0;
            return (
              <li key={item.key}>
                <div className="flex justify-between gap-3 text-[12px]">
                  <span className="font-medium text-neutral-800">{item.label}</span>
                  <span className="shrink-0 text-neutral-500">
                    {item.points} / {item.max_points}
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#EEF2F7]">
                  <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: scoreColor(percent) }} />
                </div>
                {item.feedback ? <p className="mt-1 text-[12px] leading-5 text-neutral-500">{item.feedback}</p> : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
