import SharedCard from "@/components/shared/card";
import type {
  InstagramPerformanceSummary,
  OpportunityScore,
  PlannerHandoff,
  TrendSignal,
} from "@/types/bussiness/content-recommendation-type";
import { Chip } from "./chipsandsection";
import SectionHeader from "./sectionHeader";

export function PlannerHandoffSection({
  handoff,
}: {
  handoff?: PlannerHandoff | null;
}) {
  if (!handoff?.plan_summary && handoff?.action_count == null) return null;

  return (
    <SharedCard className="p-4">
      <SectionHeader label="planner_handoff" />
      {handoff.plan_summary ? (
        <p className="text-[13px] leading-5 text-neutral-700">
          {handoff.plan_summary}
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {typeof handoff.action_count === "number" ? (
          <span className="rounded-full bg-[#ECEBFF] px-2.5 py-1 text-[11px] font-semibold text-[#5B57E6]">
            {handoff.action_count} actions
          </span>
        ) : null}
        {typeof handoff.calendar_items_linked === "number" ? (
          <span className="rounded-full bg-[#F6F7FD] px-2.5 py-1 text-[11px] font-medium text-neutral-600">
            {handoff.calendar_items_linked} calendar items linked
          </span>
        ) : null}
      </div>
    </SharedCard>
  );
}

export function TrendSignalsSection({ signals }: { signals: TrendSignal[] }) {
  if (!signals.length) return null;

  return (
    <SharedCard className="p-4">
      <SectionHeader label="trend_signals" count={signals.length} />
      <ul className="grid gap-2 sm:grid-cols-2">
        {signals.map((signal, index) => {
          const title =
            signal.topic || signal.signal || `Signal ${index + 1}`;
          return (
            <li
              key={`${title}-${index}`}
              className="rounded-xl border border-[#E6E8F5] bg-[#FAFBFF] p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[13px] font-semibold text-neutral-900">
                  {title}
                </p>
                {typeof signal.score === "number" ? (
                  <span className="rounded-full bg-[#ECEBFF] px-2 py-0.5 text-[10px] font-semibold text-[#5B57E6]">
                    {signal.score}
                  </span>
                ) : null}
              </div>
              {signal.platform ? (
                <p className="mt-1 text-[11px] capitalize text-neutral-500">
                  {signal.platform}
                </p>
              ) : null}
              {signal.reason ? (
                <p className="mt-1.5 text-[12px] text-neutral-600">
                  {signal.reason}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </SharedCard>
  );
}

export function OpportunityScoresSection({
  scores,
}: {
  scores: OpportunityScore[];
}) {
  if (!scores.length) return null;

  return (
    <SharedCard className="p-4">
      <SectionHeader label="opportunity_scores" count={scores.length} />
      <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {scores.map((item, index) => {
          const title = item.name || item.topic || `Opportunity ${index + 1}`;
          return (
            <li
              key={`${title}-${index}`}
              className="rounded-xl border border-[#E6E8F5] p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[13px] font-semibold text-neutral-900">
                  {title}
                </p>
                {typeof item.score === "number" ? (
                  <span className="rounded-full bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-semibold text-[#047857]">
                    {item.score}
                  </span>
                ) : null}
              </div>
              {item.platform ? (
                <p className="mt-1 text-[11px] capitalize text-neutral-500">
                  {item.platform}
                </p>
              ) : null}
              {item.reason ? (
                <p className="mt-1.5 text-[12px] text-neutral-600">{item.reason}</p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </SharedCard>
  );
}

export function InstagramPerformanceSection({
  performance,
}: {
  performance?: InstagramPerformanceSummary | null;
}) {
  if (!performance) return null;

  const insightEntries = Object.entries(performance.account_insights || {}).filter(
    ([, value]) => value != null && value !== "",
  );
  const hasContent =
    performance.summary ||
    performance.post_count != null ||
    performance.average_engagement_rate != null ||
    performance.best_topics?.length ||
    performance.best_formats?.length ||
    insightEntries.length;

  if (!hasContent) return null;

  return (
    <SharedCard className="p-4">
      <SectionHeader label="instagram_performance" />
      <div className="space-y-3">
        {performance.summary ? (
          <p className="text-[13px] leading-5 text-neutral-700">
            {performance.summary}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {performance.post_count != null ? (
            <span className="rounded-full bg-[#F6F7FD] px-2.5 py-1 text-[11px] text-neutral-600">
              {performance.post_count} posts
            </span>
          ) : null}
          {performance.average_engagement_rate != null ? (
            <span className="rounded-full bg-[#ECEBFF] px-2.5 py-1 text-[11px] font-semibold text-[#5B57E6]">
              {performance.average_engagement_rate}% avg engagement
            </span>
          ) : null}
          {performance.source ? (
            <span className="rounded-full bg-[#F6F7FD] px-2.5 py-1 text-[11px] text-neutral-500">
              Source · {performance.source}
            </span>
          ) : null}
        </div>

        {performance.best_formats?.length ? (
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-neutral-400">
              Best formats
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {performance.best_formats.map((item) => (
                <li key={item}>
                  <Chip>{item}</Chip>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {performance.best_topics?.length ? (
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-neutral-400">
              Best topics
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {performance.best_topics.map((item) => (
                <li key={item}>
                  <Chip>{item}</Chip>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {insightEntries.length ? (
          <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {insightEntries.map(([key, value]) => (
              <li
                key={key}
                className="rounded-lg bg-[#F6F7FD] px-2.5 py-1.5 text-[11px] text-neutral-600"
              >
                <span className="capitalize">{key.replace(/_/g, " ")}</span>
                <span className="ml-1 font-semibold text-neutral-900">
                  {String(value)}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </SharedCard>
  );
}
