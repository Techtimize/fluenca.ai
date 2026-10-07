"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  CalendarDays,
  Lightbulb,
  PenLine,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import Mascot from "@/components/shared/mascot";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { IntelligenceJobQuery } from "@/routes/bussiness/Bussiness-Query";
import FeedItemCard from "@/components/verify-dna/feedItemCard";
import { buildFeed, humanize } from "@/lib/intelligence/progress-feed";
import type { IntelligenceJobResponse } from "@/types/bussiness/intelligence-type";

// Icon per step shown in the side timeline; unknown steps get a generic icon.
const STEP_ICONS: Record<string, LucideIcon> = {
  analyze_company: Building2,
  competitor_analysis: Users,
  planner: CalendarDays,
  content_recommendation: Lightbulb,
  script_generation: PenLine,
};
const DEFAULT_STEPS = Object.keys(STEP_ICONS);

// Backend sub-steps that are not in `pages`; they count towards the listed step.
const SUB_STEPS: Record<string, string[]> = {
  competitor_analysis: ["discover_competitors"],
};

type StepState = { status: string; seconds: number | null };

function stepState(
  job: IntelligenceJobResponse | undefined,
  name: string,
): StepState {
  const parts = [...(SUB_STEPS[name] ?? []), name]
    .map((n) => job?.steps?.[n])
    .filter(Boolean);
  const statuses = parts.map((p) => p!.status);
  const status = statuses.includes("failed")
    ? "failed"
    : statuses.includes("running")
      ? "running"
      : statuses.length && statuses.every((st) => st === "completed")
        ? "completed"
        : statuses.includes("completed")
          ? "running" // a sub-step finished, the main one is next
          : "pending";
  const seconds = parts.reduce((sum, p) => sum + (p!.duration_sec ?? 0), 0);
  return { status, seconds: seconds ? Math.round(seconds) : null };
}

const VISIBLE_ITEMS = 14; // older items scroll off the top of the feed
const REVEAL_MS = 750; // pace of the stream
const REVEAL_FAST_MS = 300; // used when many items are waiting

const RING_RADIUS = 24;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

export default function IntelligenceProgressPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { jobId } = useParams<{ jobId: string }>();
  const { data: job, isError, error } = IntelligenceJobQuery(jobId);

  const status = job?.status;
  const isFailed = isError || status === "failed";
  const feed = useMemo(() => buildFeed(job), [job]);

  // Reveal one item at a time so results stream past; speed up when a big result lands.
  const [revealed, setRevealed] = useState(0);
  const shown = Math.min(revealed, feed.length);
  useEffect(() => {
    if (shown >= feed.length) return;
    const backlog = feed.length - shown;
    const timer = window.setTimeout(
      () => setRevealed(shown + 1),
      backlog > 6 ? REVEAL_FAST_MS : REVEAL_MS,
    );
    return () => window.clearTimeout(timer);
  }, [shown, feed.length]);

  // Steps are the job's `pages`; before the first poll, show the usual five.
  const stepNames = job?.pages ? Object.keys(job.pages) : DEFAULT_STEPS;
  const states = Object.fromEntries(
    stepNames.map((name) => [name, stepState(job, name)]),
  );
  const isReady = status === "completed" && shown >= feed.length;
  const doneCount = stepNames.filter(
    (name) => states[name].status === "completed",
  ).length;
  const percent = Math.round((doneCount / stepNames.length) * 100);
  const runningStep = stepNames.find(
    (name) => states[name].status === "running",
  );

  const handled = useRef(false);
  useEffect(() => {
    if (handled.current) return;
    if (isReady) {
      handled.current = true;
      queryClient.invalidateQueries(); // pages refetch the freshly saved results
      toast.success("Your workspace is ready!");
      // TODO: re-enable after the UI work on this page is done.
      router.replace(PAGE_ROUTES.DASHBOARD);
    } else if (isFailed) {
      handled.current = true;
      const notFound =
        (error as { response?: { status?: number } } | null)?.response
          ?.status === 404;
      toast.error(
        notFound
          ? "We couldn't find this analysis. Please start again."
          : "Something went wrong. Please try again.",
      );
      router.replace(PAGE_ROUTES.DNA);
    }
  }, [isReady, isFailed, error, queryClient, router]);

  const companyName = job?.company_name || "Your company";
  const visibleItems = feed.slice(Math.max(0, shown - VISIBLE_ITEMS), shown);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F8FF] px-4 py-12">
      {/* soft background glows */}
      <div className="pointer-events-none absolute -left-32 -top-32 size-[28rem] rounded-full bg-[#C7CBFF]/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-1/3 size-[26rem] rounded-full bg-[#E4D4FF]/50 blur-3xl" />

      <div className="relative mx-auto max-w-4xl">
        <Mascot
          src="/mascots/n_mascot_3.gif"
          size={120}
          priority
          className="mx-auto mb-2 size-24 sm:size-30"
        />
        <h1 className="text-center text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          Our AI agents are analyzing
          <br />
          <span className="bg-linear-to-r from-[#4F46E5] to-[#8B5CF6] bg-clip-text text-transparent">
            your company
          </span>
        </h1>
        <p className="mt-3 text-center text-sm text-neutral-500 sm:text-base">
          Working through {stepNames.length} steps of your report right now.
        </p>

        <div className="mt-10 grid items-start gap-6 sm:grid-cols-[190px_minmax(0,1fr)]">
          {/* Agents: vertical timeline on the left, horizontal strip on phones */}
          <ol className="relative flex gap-4 overflow-x-auto pb-1 sm:flex-col sm:gap-5 sm:overflow-visible sm:pb-0 sm:pt-2">
            <span className="absolute bottom-5 left-5 top-7 hidden w-0.5 rounded-full bg-[#E3E5F0] sm:block" />
            <span
              className="absolute left-5 top-7 hidden w-0.5 rounded-full bg-linear-to-b from-[#22C55E] to-[#5452F6] transition-[height] duration-700 sm:block"
              style={{
                height: `calc((100% - 3rem) * ${Math.min(1, doneCount / Math.max(1, stepNames.length - 1))})`,
              }}
            />
            {stepNames.map((name) => {
              const { status: s, seconds } = states[name];
              const Icon = STEP_ICONS[name] ?? Sparkles;
              const sub =
                s === "completed"
                  ? seconds
                    ? `Done · ${seconds}s`
                    : "Done"
                  : s === "running"
                    ? "Working…"
                    : s === "failed"
                      ? "Failed"
                      : "Queued";
              const ring =
                s === "completed"
                  ? "border-[#22C55E] bg-[#ECFDF3] text-[#16A34A]"
                  : s === "running"
                    ? "border-[#5452F6] bg-white text-[#5452F6] shadow-[0_0_0_5px_rgba(84,82,246,0.12),0_0_20px_rgba(84,82,246,0.45)]"
                    : s === "failed"
                      ? "border-[#F43F5E] bg-[#FFF1F3] text-[#E11D48]"
                      : "border-[#E3E5F0] bg-white text-neutral-300";
              return (
                <li
                  key={name}
                  className="relative flex shrink-0 flex-col items-center gap-2 sm:flex-row sm:gap-3"
                >
                  <span
                    className={`relative grid size-10 shrink-0 place-items-center rounded-full border-2 transition-all duration-500 ${ring}`}
                  >
                    {s === "running" ? (
                      <span className="absolute inset-0 animate-ping rounded-full border-2 border-[#5452F6]/40" />
                    ) : null}
                    <Icon className="size-4.5" />
                  </span>
                  <span
                    className={`text-center text-[11px] leading-tight sm:text-left sm:text-[13px] ${
                      s === "running"
                        ? "font-semibold text-[#5452F6]"
                        : s === "pending"
                          ? "text-neutral-400"
                          : "font-medium text-neutral-800"
                    }`}
                  >
                    {humanize(name)}
                    <span className="mt-0.5 hidden text-[11px] font-normal text-neutral-400 sm:block">
                      {sub}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>

          <div className="min-w-0">
            {/* Live report */}
            <section className="overflow-hidden rounded-3xl border border-[#E6E8F5] bg-white/90 shadow-[0_20px_50px_-24px_rgba(79,70,229,0.45)] backdrop-blur">
              <div className="flex items-center gap-3 px-6 pb-4 pt-6">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-[#4F46E5] to-[#8B5CF6] text-white">
                  <Sparkles className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-neutral-900">
                    {companyName} — report
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <span className="size-1.5 animate-pulse rounded-full bg-[#22C55E]" />
                    Building live…
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <p className="hidden text-right text-[11px] leading-tight text-neutral-500 sm:block">
                    {doneCount} / {stepNames.length}
                    <br />
                    steps
                  </p>
                  {/* circular progress ring around the percentage */}
                  <div
                    className="relative size-14"
                    role="progressbar"
                    aria-valuenow={percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <svg viewBox="0 0 56 56" className="size-full -rotate-90">
                      <defs>
                        <linearGradient
                          id="progress-ring"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#4F46E5" />
                          <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx="28"
                        cy="28"
                        r={RING_RADIUS}
                        fill="none"
                        stroke="#EEF0F6"
                        strokeWidth="5"
                      />
                      <circle
                        cx="28"
                        cy="28"
                        r={RING_RADIUS}
                        fill="none"
                        stroke="url(#progress-ring)"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray={RING_LENGTH}
                        strokeDashoffset={
                          RING_LENGTH * (1 - Math.max(percent, 3) / 100)
                        }
                        className="transition-[stroke-dashoffset] duration-700 ease-out"
                      />
                    </svg>
                    <span className="absolute inset-0 grid place-items-center text-[13px] font-bold text-neutral-900">
                      {percent}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="h-px bg-[#EEF0F6]" />

              {/* Live feed: newest at the bottom, older items drift up and fade out */}
              <ul
                aria-live="polite"
                className="flex h-[28rem] flex-col justify-end gap-3 overflow-hidden p-6 mask-[linear-gradient(to_bottom,transparent,black_18%)]"
              >
                {visibleItems.map((item) => (
                  <li
                    key={item.id}
                    className="shrink-0 animate-in duration-500 fade-in slide-in-from-bottom-4"
                  >
                    <FeedItemCard item={item} />
                  </li>
                ))}
                {!isReady ? (
                  <li className="flex shrink-0 items-center gap-2 text-xs text-neutral-400">
                    <span className="flex gap-1">
                      {[0, 150, 300].map((delay) => (
                        <span
                          key={delay}
                          className="size-1.5 animate-bounce rounded-full bg-[#8B5CF6]"
                          style={{ animationDelay: `${delay}ms` }}
                        />
                      ))}
                    </span>
                    {runningStep
                      ? `${humanize(runningStep)} in progress…`
                      : "Connecting to our AI agents…"}
                  </li>
                ) : null}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
