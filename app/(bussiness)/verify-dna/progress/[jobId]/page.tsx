"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  CalendarDays,
  Check,
  Dna,
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

const STEP_ICONS: Record<string, LucideIcon> = {
  generate_dna: Dna,
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

const VISIBLE_ITEMS = 14;
const REVEAL_MS = 750;
const REVEAL_FAST_MS = 300;

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
      // router.replace(PAGE_ROUTES.DASHBOARD);
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
    <main className="relative min-h-screen overflow-hidden bg-[#F7F8FF] px-4 pb-16 pt-12 sm:pt-16">
      {/* soft background glows + dot grid */}
      <div className="pointer-events-none absolute -left-32 -top-32 size-112 rounded-full bg-[#C7CBFF]/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-1/3 size-104 rounded-full bg-[#E4D4FF]/50 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(84,82,246,0.08)_1px,transparent_0)] bg-size-[22px_22px] mask-[linear-gradient(to_bottom,black,transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl">
        {/* Heading */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E0E2FB] bg-white/80 px-3.5 py-1.5 text-xs font-medium text-[#5452F6] shadow-sm backdrop-blur">
            <span className="relative flex size-2">
              {!isReady ? (
                <span className="absolute inset-0 animate-ping rounded-full bg-[#22C55E]/60" />
              ) : null}
              <span className="relative size-2 rounded-full bg-[#22C55E]" />
            </span>
            {isReady ? "Analysis complete" : "Live analysis"}
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-neutral-900 sm:text-5xl sm:leading-[1.1]">
            Our AI agents are analyzing
            <br />
            <span className="bg-linear-to-r from-[#4F46E5] to-[#8B5CF6] bg-clip-text text-transparent">
              your company
            </span>
          </h1>
          <p className="mt-4 text-sm text-neutral-500 sm:text-base">
            Working through {stepNames.length} steps of your report right now.
          </p>
        </div>

        {/* Timeline | report | spacer: the equal side columns keep the report centred under the heading */}
        <div className="mt-10 grid items-start gap-6 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,640px)_minmax(0,1fr)] lg:gap-10">
          {/* Agents: vertical timeline beside the report, horizontal strip on smaller screens */}
          <ol className="relative mx-auto flex max-w-full gap-3 overflow-x-auto pb-2 lg:mx-0 lg:flex-col lg:gap-6 lg:justify-self-end lg:overflow-visible lg:pb-0 lg:pt-4">
            {/* Line runs between the first and last circle centres (circles are 64px; list has 16px top padding). */}
            <span className="absolute bottom-8 left-8 top-12 hidden w-0.5 rounded-full bg-[#E3E5F0] lg:block" />
            <span
              className="absolute left-8 top-12 hidden w-0.5 rounded-full bg-linear-to-b from-[#22C55E] to-[#5452F6] transition-[height] duration-700 lg:block"
              style={{
                height: `calc((100% - 5rem) * ${Math.min(1, doneCount / Math.max(1, stepNames.length - 1))})`,
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
                    ? "border-[#5452F6] bg-linear-to-br from-white to-[#EEEDFF] shadow-[0_0_0_6px_rgba(84,82,246,0.10),0_8px_24px_-6px_rgba(84,82,246,0.55)]"
                    : s === "failed"
                      ? "border-[#F43F5E] bg-[#FFF1F3] text-[#E11D48]"
                      : "border-[#E3E5F0] bg-white text-neutral-300";
              return (
                <li
                  key={name}
                  className="relative flex w-24 shrink-0 flex-col items-center gap-2 lg:w-56 lg:flex-row lg:gap-3.5"
                >
                  <span
                    className={`relative grid size-16 shrink-0 place-items-center rounded-full border-2 transition-all duration-500 ${ring}`}
                  >
                    {s === "running" ? (
                      <>
                        <span className="absolute -inset-1 animate-ping rounded-full border-2 border-[#5452F6]/30" />
                        {/* The mascot works on the current step; done steps go back to their icon.
                            n_mascot_3_head.gif is the robot cropped from n_mascot_3.gif at 3x this size, so it stays sharp. */}
                        <span className="absolute inset-0.5 overflow-hidden rounded-full">
                          <Mascot
                            src="/mascots/n_mascot_3_head.gif"
                            size={64}
                            alt={`${humanize(name)} in progress`}
                            priority
                            className="size-full"
                          />
                        </span>
                      </>
                    ) : (
                      <Icon className="size-6" />
                    )}
                    {s === "completed" ? (
                      <span className="absolute -bottom-0.5 -right-0.5 grid size-5.5 place-items-center rounded-full border-2 border-white bg-[#22C55E] text-white">
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                    ) : null}
                  </span>
                  <span
                    className={`text-center text-[11px] leading-tight lg:text-left lg:text-sm ${
                      s === "running"
                        ? "font-semibold text-[#5452F6]"
                        : s === "pending"
                          ? "text-neutral-400"
                          : "font-medium text-neutral-800"
                    }`}
                  >
                    {humanize(name)}
                    <span
                      className={`mt-1 hidden w-fit rounded-full px-2 py-0.5 text-[11px] font-medium lg:block ${
                        s === "completed"
                          ? "bg-[#ECFDF3] text-[#16A34A]"
                          : s === "running"
                            ? "bg-[#EEEDFF] text-[#5452F6]"
                            : s === "failed"
                              ? "bg-[#FFF1F3] text-[#E11D48]"
                              : "bg-neutral-100 text-neutral-400"
                      }`}
                    >
                      {sub}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>

          {/* Live report */}
          <section className="w-full min-w-0 overflow-hidden rounded-3xl border border-white bg-white/90 shadow-[0_30px_70px_-30px_rgba(79,70,229,0.5)] ring-1 ring-[#E6E8F5] backdrop-blur">
            <div className="relative flex items-center gap-3 overflow-hidden bg-linear-to-r from-[#F5F4FF] via-white to-[#F8F2FF] px-6 pb-5 pt-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-[#4F46E5] to-[#8B5CF6] text-white shadow-[0_8px_20px_-8px_rgba(79,70,229,0.8)]">
                <Sparkles className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-neutral-900">
                  {companyName} — report
                </p>
                <p className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <span
                    className={`size-1.5 rounded-full bg-[#22C55E] ${isReady ? "" : "animate-pulse"}`}
                  />
                  {isReady ? "Report ready" : "Building live…"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <p className="hidden text-right text-[11px] leading-tight text-neutral-500 sm:block">
                  <span className="text-sm font-semibold text-neutral-900">
                    {doneCount}
                  </span>{" "}
                  / {stepNames.length}
                  <br />
                  steps done
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
            {/* thin overall progress bar under the header */}
            <div className="h-1 bg-[#EEF0F6]">
              <div
                className="h-full bg-linear-to-r from-[#4F46E5] to-[#8B5CF6] transition-[width] duration-700 ease-out"
                style={{ width: `${Math.max(percent, 3)}%` }}
              />
            </div>

            {/* Live feed: newest at the bottom, older items drift up and fade out */}
            <ul
              aria-live="polite"
              className="flex h-112 flex-col justify-end gap-3 overflow-hidden p-6 mask-[linear-gradient(to_bottom,transparent,black_18%)]"
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
                <li className="flex shrink-0 items-center gap-2 rounded-xl bg-[#F7F7FF] px-3 py-2.5 text-xs text-neutral-500">
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

          {/* Empty column that balances the timeline so the report stays centred */}
          <div aria-hidden="true" className="hidden lg:block" />
        </div>
      </div>
    </main>
  );
}
