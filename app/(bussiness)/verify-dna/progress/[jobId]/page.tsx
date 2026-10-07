"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Circle,
  Lightbulb,
  Loader2,
  PenLine,
  Search,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import Mascot from "@/components/shared/mascot";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { IntelligenceJobQuery } from "@/routes/bussiness/Bussiness-Query";
import type { IntelligenceJobResponse } from "@/types/bussiness/intelligence-type";

const STEPS: {
  name: string;
  label: string;
  agent: string;
  start: string;
  Icon: LucideIcon;
}[] = [
  {
    name: "analyze_company",
    label: "Company analysis",
    agent: "Research Agent",
    start: "Reading your website and social profiles",
    Icon: Building2,
  },
  {
    name: "discover_competitors",
    label: "Competitor discovery",
    agent: "Discovery Agent",
    start: "Looking for your competitors",
    Icon: Search,
  },
  {
    name: "competitor_analysis",
    label: "Competitor analysis",
    agent: "Market Agent",
    start: "Comparing competitors' content and positioning",
    Icon: Users,
  },
  {
    name: "planner",
    label: "Content strategy",
    agent: "Strategy Agent",
    start: "Planning your content strategy",
    Icon: CalendarDays,
  },
  {
    name: "content_recommendation",
    label: "Content ideas",
    agent: "Content Agent",
    start: "Generating content ideas for your audience",
    Icon: Lightbulb,
  },
  {
    name: "script_generation",
    label: "Scripts",
    agent: "Script Agent",
    start: "Writing ready-to-film scripts",
    Icon: PenLine,
  },
];

const VISIBLE_LINES = 6; // fully typed lines kept on the card, plus the one being typed
const TYPE_SPEED_MS = 22; // per character tick
const LINE_PAUSE_MS = 450; // pause after a line finishes typing

const RING_RADIUS = 24;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

type Line = { id: string; label: string; value: string };

const list = (value: unknown) =>
  Array.isArray(value)
    ? value.filter((v): v is string => typeof v === "string")
    : [];

// Append-only report built from the job; ids stay stable between polls.
function buildReport(job?: IntelligenceJobResponse): Line[] {
  const lines: Line[] = [];
  for (const { name, label, start } of STEPS) {
    const step = job?.steps?.[name];
    if (!step || step.status === "pending") continue;
    lines.push({
      id: `${name}:start`,
      label,
      value: step.status === "completed" ? `${start} — done` : `${start}…`,
    });

    const company =
      name === "analyze_company"
        ? (step.result?.company as Record<string, unknown> | undefined)
        : undefined;
    if (!company) continue;
    const facts: [string, unknown][] = [
      ["Company name", company.name],
      ["Industry", company.industry],
      ["Market", company.region],
      ["Target audience", list(company.target_audience).join(", ")],
      ["Key services", list(company.flagship_services).join(", ")],
      ["Pain points", list(company.pain_points).join("; ")],
      ["Positioning", company.positioning],
    ];
    facts.forEach(([factLabel, value], i) => {
      if (typeof value === "string" && value)
        lines.push({ id: `${name}:fact:${i}`, label: factLabel, value });
    });
  }
  return lines;
}

export default function IntelligenceProgressPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { jobId } = useParams<{ jobId: string }>();
  const { data: job, isError, error } = IntelligenceJobQuery(jobId);

  const status = job?.status;
  const isFailed = isError || status === "failed";
  const report = useMemo(() => buildReport(job), [job]);

  // Typewriter: `done` lines are fully shown, the next one types out `typed` characters.
  const [done, setDone] = useState(0);
  const [typed, setTyped] = useState(0);
  const current = report[done];
  const currentText = current ? `${current.label}: ${current.value}` : "";
  useEffect(() => {
    if (!current?.id) return;
    const timer =
      typed < currentText.length
        ? window.setTimeout(() => setTyped((n) => n + 2), TYPE_SPEED_MS)
        : window.setTimeout(() => {
            setDone((n) => n + 1);
            setTyped(0);
          }, LINE_PAUSE_MS);
    return () => window.clearTimeout(timer);
  }, [current?.id, currentText.length, typed]);

  const isReady = status === "completed" && done >= report.length;
  const doneCount = STEPS.filter(
    (s) => job?.steps?.[s.name]?.status === "completed",
  ).length;
  const percent = Math.round((doneCount / STEPS.length) * 100);

  const handled = useRef(false);
  useEffect(() => {
    if (handled.current) return;
    if (isReady) {
      handled.current = true;
      queryClient.invalidateQueries(); // pages refetch the freshly saved results
      toast.success("Your workspace is ready!");
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
      router.replace(PAGE_ROUTES.VERIFY_DNA);
    }
  }, [isReady, isFailed, error, queryClient, router]);

  const companyName = job?.company_name || "Your company";
  const shownLines = report.slice(Math.max(0, done - VISIBLE_LINES), done);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F8FF] px-4 py-12">
      {/* soft background glows */}
      <div className="pointer-events-none absolute -left-32 -top-32 size-[28rem] rounded-full bg-[#C7CBFF]/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-1/3 size-[26rem] rounded-full bg-[#E4D4FF]/50 blur-3xl" />

      <div className="relative mx-auto max-w-3xl">
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
          Six specialist agents are working through your report right now.
        </p>

        <div className="mt-10 grid items-start gap-6 sm:grid-cols-[170px_minmax(0,1fr)]">
          {/* Agents: vertical timeline on the left, horizontal strip on phones */}
          <ol className="relative flex gap-4 overflow-x-auto pb-1 sm:flex-col sm:gap-5 sm:overflow-visible sm:pb-0 sm:pt-2">
            <span className="absolute bottom-5 left-5 top-7 hidden w-0.5 rounded-full bg-[#E3E5F0] sm:block" />
            <span
              className="absolute left-5 top-7 hidden w-0.5 rounded-full bg-linear-to-b from-[#22C55E] to-[#5452F6] transition-[height] duration-700 sm:block"
              style={{
                height: `calc((100% - 3rem) * ${doneCount / (STEPS.length - 1)})`,
              }}
            />
            {STEPS.map(({ name, agent, Icon }) => {
              const s = job?.steps?.[name]?.status ?? "pending";
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
                    {agent}
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
                    {doneCount} / {STEPS.length}
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

              <ul
                aria-live="polite"
                className="min-h-64 space-y-3 p-6 text-sm leading-6"
              >
                {shownLines.map((line) => (
                  <li
                    key={line.id}
                    className="animate-in text-neutral-600 duration-300 fade-in"
                  >
                    <span className="font-semibold text-neutral-900">
                      {line.label}:
                    </span>{" "}
                    {line.value}
                  </li>
                ))}

                {current ? (
                  <li className="text-neutral-600">
                    <span className="font-semibold text-neutral-900">
                      {currentText.slice(
                        0,
                        Math.min(typed, current.label.length + 1),
                      )}
                    </span>
                    {currentText.slice(current.label.length + 1, typed)}
                    <span className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 animate-pulse bg-[#5452F6]" />
                  </li>
                ) : null}

                {/* placeholder bars for what's still coming */}
                {!isReady
                  ? ["w-3/4", "w-11/12", "w-2/3"].map((w) => (
                      <li
                        key={w}
                        className={`h-3 animate-pulse rounded-full bg-[#EEF0F8] ${w}`}
                      />
                    ))
                  : null}
              </ul>
            </section>

            {/* Steps */}
            <ol className="mt-6 grid gap-2 sm:grid-cols-2">
              {STEPS.map(({ name, label }) => {
                const s = job?.steps?.[name]?.status ?? "pending";
                return (
                  <li
                    key={name}
                    className="flex items-center gap-2.5 rounded-2xl border border-[#E6E8F5] bg-white px-3.5 py-2.5 text-[13px] text-neutral-800"
                  >
                    {s === "running" ? (
                      <Loader2 className="size-4 animate-spin text-[#5452F6]" />
                    ) : s === "completed" ? (
                      <CheckCircle2 className="size-4 text-[#16A34A]" />
                    ) : s === "failed" ? (
                      <XCircle className="size-4 text-[#E11D48]" />
                    ) : (
                      <Circle className="size-4 text-neutral-300" />
                    )}
                    <span className={s === "pending" ? "text-neutral-400" : ""}>
                      {label}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}
