"use client";

import { Gauge, Loader2, RotateCw, Sparkles } from "lucide-react";
import { getApiErrorMessage, isApiNotFoundError } from "@/errors/error-utils";
import { RunLinkedInScoreMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { LinkedInScoreHistoryQuery, LinkedInScoreQuery } from "@/routes/bussiness/Bussiness-Query";
import type { LinkedInScore } from "@/types/bussiness/linkedin-growth-type";
import {
  ChangeBadge,
  EmptyAction,
  ErrorText,
  formatDate,
  GHOST_BUTTON,
  GrowthSection,
  LABEL,
  LoadingBlock,
  PRIMARY_BUTTON,
  ScoreRing,
  scoreColor,
} from "./ui";

const PILLARS = [
  { key: "profile", label: "Profile" },
  { key: "posting", label: "Posting" },
  { key: "engagement", label: "Engagement" },
  { key: "network", label: "Network" },
] as const;
const PILLAR_MAX = 25;

/** Profile, posting, engagement and network (25 points each), with a growth chart from the history. */
export default function LinkedInScoreCard() {
  const scoreQuery = LinkedInScoreQuery();
  const historyQuery = LinkedInScoreHistoryQuery();
  const runScore = RunLinkedInScoreMutation();
  const score = scoreQuery.data;
  const noScoreYet = scoreQuery.isError && isApiNotFoundError(scoreQuery.error);

  return (
    <GrowthSection
      icon={Gauge}
      title="Your LinkedIn Score"
      description="Profile, posting, engagement and network, 25 points each. Update it any time to watch it grow."
      action={
        score ? (
          <button type="button" onClick={() => runScore.mutate()} disabled={runScore.isPending} className={GHOST_BUTTON}>
            {runScore.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <RotateCw className="size-3.5" />}
            Update
          </button>
        ) : null
      }
    >
      {scoreQuery.isLoading ? (
        <LoadingBlock />
      ) : scoreQuery.isError && !noScoreYet ? (
        <ErrorText>{getApiErrorMessage(scoreQuery.error, "Could not load your LinkedIn Score")}</ErrorText>
      ) : score ? (
        <div className="space-y-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex flex-col items-center gap-2">
              <ScoreRing score={score.total} label="LinkedIn Score" />
              {score.change_since_first != null ? <ChangeBadge change={score.change_since_first} suffix="since first score" /> : null}
            </div>
            <dl className="flex-1 space-y-3">
              {PILLARS.map(({ key, label }) => {
                const value = score[key] ?? 0;
                const percent = (value / PILLAR_MAX) * 100;
                return (
                  <div key={key}>
                    <div className="flex justify-between text-[12px]">
                      <dt className="font-medium text-neutral-700">{label}</dt>
                      <dd className="text-neutral-500">
                        {Math.round(value)} / {PILLAR_MAX}
                      </dd>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-[#EEF2F7]">
                      <div
                        className="h-full rounded-full transition-[width] duration-700"
                        style={{ width: `${percent}%`, backgroundColor: scoreColor(percent) }}
                      />
                    </div>
                  </div>
                );
              })}
            </dl>
          </div>
          {historyQuery.data && historyQuery.data.length > 1 ? <GrowthChart history={historyQuery.data} /> : null}
        </div>
      ) : (
        <EmptyAction text="Get your starting score so you can watch it grow.">
          <button type="button" onClick={() => runScore.mutate()} disabled={runScore.isPending} className={PRIMARY_BUTTON}>
            {runScore.isPending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {runScore.isPending ? "Scoring…" : "Get my score"}
          </button>
        </EmptyAction>
      )}
    </GrowthSection>
  );
}

const CHART_W = 320;
const CHART_H = 80;
const CHART_PAD = 6;

/** Line chart of the total score over time, oldest on the left. */
function GrowthChart({ history }: { history: LinkedInScore[] }) {
  const points = [...history].sort(
    (a, b) => new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime(),
  );
  const x = (index: number) => CHART_PAD + (index / (points.length - 1)) * (CHART_W - CHART_PAD * 2);
  const y = (total: number) => CHART_PAD + (1 - total / 100) * (CHART_H - CHART_PAD * 2);
  const line = points.map((point, index) => `${x(index)},${y(point.total)}`).join(" ");
  const area = `${x(0)},${CHART_H} ${line} ${x(points.length - 1)},${CHART_H}`;

  return (
    <div>
      <p className={LABEL}>Growth</p>
      <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="mt-2 h-20 w-full" preserveAspectRatio="none" role="img" aria-label="LinkedIn Score over time">
        <defs>
          <linearGradient id="linkedin-score-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0A66C2" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0A66C2" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#linkedin-score-area)" />
        <polyline points={line} fill="none" stroke="#0A66C2" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-1 flex justify-between text-[11px] text-neutral-400">
        <span>{formatDate(points[0].created_at)}</span>
        <span>{formatDate(points[points.length - 1].created_at)}</span>
      </div>
    </div>
  );
}
