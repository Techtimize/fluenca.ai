"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Gauge, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Card from "@/components/shared/card";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/errors/error-utils";
import { OnboardingDetailsQuery } from "@/routes/bussiness/Bussiness-Query";
import {
  PageSpeedApi,
  type PageSpeedResult,
  type PageSpeedStrategy as Strategy,
} from "@/routes/page-speed/page-speed.routes";

const FIELD_LABELS: Record<string, string> = {
  LARGEST_CONTENTFUL_PAINT_MS: "Largest Contentful Paint",
  INTERACTION_TO_NEXT_PAINT: "Interaction to Next Paint",
  CUMULATIVE_LAYOUT_SHIFT_SCORE: "Cumulative Layout Shift",
};

export function scoreColor(score: number | null) {
  if (score === null) return "text-neutral-500 ring-neutral-200";
  if (score >= 90) return "text-[#0F766E] ring-[#99E2D6]";
  if (score >= 50) return "text-amber-600 ring-amber-200";
  return "text-rose-600 ring-rose-200";
}

function categoryColor(category: string) {
  if (category === "FAST") return "text-[#0F766E]";
  if (category === "AVERAGE") return "text-amber-600";
  return "text-rose-600";
}

function fieldValue(id: string, percentile: number) {
  if (id === "CUMULATIVE_LAYOUT_SHIFT_SCORE") return percentile.toFixed(2);
  return percentile >= 1000 ? `${(percentile / 1000).toFixed(1)} s` : `${Math.round(percentile)} ms`;
}

function ScoreRing({ score, label, large = false }: { score: number | null; label: string; large?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className={`grid place-items-center rounded-full font-semibold ring-4 ${scoreColor(score)} ${
          large ? "size-20 text-2xl" : "size-14 text-lg"
        }`}
      >
        {score ?? "–"}
      </span>
      <span className="text-center text-[12px] text-neutral-600">{label}</span>
    </div>
  );
}

/** Full PageSpeed Insights report: scores, lab metrics, Core Web Vitals and what to fix. */
export function PageSpeedReport({ result }: { result: PageSpeedResult }) {
  const vitals = result.field_metrics.filter((m) => FIELD_LABELS[m.id]);
  const performance = result.categories.find((c) => c.id === "performance");
  const otherCategories = result.categories.filter((c) => c.id !== "performance");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="space-y-4">
          <p className="text-[13px] text-neutral-500">
            <span className="font-medium capitalize text-neutral-900">{result.strategy}</span> · {result.url}
          </p>
          <div className="flex flex-wrap gap-6">
            <ScoreRing score={performance?.score ?? result.score} label="Performance" large />
            {otherCategories.map((category) => (
              <ScoreRing key={category.id} score={category.score} label={category.title} />
            ))}
          </div>
        </div>
        {result.screenshot ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={result.screenshot}
            alt={`How ${result.url} looks on ${result.strategy}`}
            className="h-48 w-auto rounded-xl border border-[#E6E8F5] object-contain"
          />
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {result.lab_metrics.map((metric) => (
          <div key={metric.id} className="rounded-2xl bg-[#F6F7FD] px-4 py-3 ring-1 ring-[#E6E8F5]">
            <p className="text-[12px] text-neutral-500">{metric.title}</p>
            <p className="mt-1 text-lg font-semibold text-neutral-900">{metric.display_value || "–"}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-[13px] font-semibold text-neutral-900">Real visitors (Core Web Vitals)</h3>
        {vitals.length === 0 ? (
          <p className="mt-2 text-[13px] text-neutral-500">
            Google does not have enough real-visitor data for this page yet.
          </p>
        ) : (
          <ul className="mt-2 space-y-1.5 text-[13px]">
            {vitals.map((metric) => (
              <li key={metric.id} className="flex items-center justify-between gap-3">
                <span className="text-neutral-700">{FIELD_LABELS[metric.id]}</span>
                <span className={`font-medium ${categoryColor(metric.category)}`}>
                  {fieldValue(metric.id, metric.percentile)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <h3 className="text-[13px] font-semibold text-neutral-900">Speed: what to fix first</h3>
          {result.opportunities.length === 0 ? (
            <p className="mt-2 text-[13px] text-neutral-500">No major fixes suggested.</p>
          ) : (
            <ul className="mt-2 space-y-1.5 text-[13px]">
              {result.opportunities.slice(0, 6).map((fix) => (
                <li key={fix.id} className="flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate text-neutral-700">{fix.title}</span>
                  <span className="shrink-0 text-neutral-500">saves ~{(fix.savings_ms / 1000).toFixed(1)} s</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {otherCategories.map((category) => (
          <div key={category.id}>
            <h3 className="text-[13px] font-semibold text-neutral-900">
              {category.title}: {category.issues.length ? "to fix" : "all checks passed"}
            </h3>
            {category.issues.length ? (
              <ul className="mt-2 list-disc space-y-1 ps-5 text-[13px] text-neutral-700">
                {category.issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PageSpeedCard() {
  const { data: company } = OnboardingDetailsQuery();
  const [typedUrl, setTypedUrl] = useState<string | null>(null);
  const [strategy, setStrategy] = useState<Strategy>("mobile");
  const [results, setResults] = useState<Record<string, PageSpeedResult>>({});
  const url = typedUrl ?? company?.website_url ?? "";
  const check = useMutation({
    mutationFn: PageSpeedApi,
    onSuccess: (data, variables) => setResults((prev) => ({ ...prev, [`${variables.strategy}|${variables.url}`]: data })),
    onError: (error) => toast.error(getApiErrorMessage(error, "Could not check the website speed")),
  });
  const result = results[`${strategy}|${url.trim()}`];
  const pendingHere = check.isPending && check.variables?.strategy === strategy;

  const run = (nextStrategy: Strategy) => check.mutate({ url: url.trim(), strategy: nextStrategy });

  return (
    <Card className="space-y-5 p-5 sm:p-6">
      <div className="flex min-w-0 items-start gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#F6F7FD] text-[#5B57E6] ring-1 ring-[#E6E8F5]">
          <Gauge className="size-7" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="text-[16px] font-semibold text-neutral-900">Website speed</h2>
          <p className="mt-1 text-[13px] leading-5 text-neutral-500">
            Google PageSpeed Insights: performance, accessibility, best practices and SEO, with what to fix. Your company
            website is filled in; change it to check another page.
          </p>
        </div>
      </div>

      <form
        className="flex flex-wrap items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          run(strategy);
        }}
      >
        <input
          type="text"
          value={url}
          onChange={(event) => setTypedUrl(event.target.value)}
          placeholder="https://yoursite.com or a page on it"
          aria-label="Page address to check"
          className="h-10 min-w-0 flex-1 rounded-xl border border-[#E6E8F5] bg-white px-3 text-[14px]"
        />
        <div className="flex rounded-full bg-[#F6F7FD] p-1 ring-1 ring-[#E6E8F5]">
          {(["mobile", "desktop"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setStrategy(option);
                if (!results[`${option}|${url.trim()}`]) run(option);
              }}
              className={`rounded-full px-3 py-1 text-[13px] capitalize ${
                strategy === option ? "bg-white font-medium text-neutral-900 shadow-sm" : "text-neutral-500"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <Button
          type="submit"
          disabled={check.isPending}
          className="h-10 gap-2 rounded-full bg-[#5B57E6] px-5 text-white hover:bg-[#4A46D0]"
        >
          {check.isPending ? <Loader2 className="size-4 animate-spin" /> : <Gauge className="size-4" />}
          {check.isPending ? "Checking… (up to a minute)" : "Run check"}
        </Button>
      </form>

      {pendingHere && !result ? (
        <p className="flex items-center gap-2 text-[13px] text-neutral-500">
          <Loader2 className="size-4 animate-spin text-[#5B57E6]" />
          Checking the {strategy} version… this can take up to a minute.
        </p>
      ) : null}

      {result ? <PageSpeedReport result={result} /> : null}
    </Card>
  );
}
