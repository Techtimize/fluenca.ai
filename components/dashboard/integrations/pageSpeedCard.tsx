"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Gauge, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Card from "@/components/shared/card";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/errors/error-utils";
import api from "@/routes/apiClient";
import { OnboardingDetailsQuery } from "@/routes/bussiness/Bussiness-Query";

type Strategy = "mobile" | "desktop";

interface PageSpeedResult {
  url: string;
  strategy: Strategy;
  score: number | null;
  lab_metrics: { id: string; title: string; display_value: string; score: number | null }[];
  field_metrics: { id: string; percentile: number; category: string }[];
  field_category: string | null;
  opportunities: { id: string; title: string; display_value: string; savings_ms: number }[];
}

const FIELD_LABELS: Record<string, string> = {
  LARGEST_CONTENTFUL_PAINT_MS: "Largest Contentful Paint",
  INTERACTION_TO_NEXT_PAINT: "Interaction to Next Paint",
  CUMULATIVE_LAYOUT_SHIFT_SCORE: "Cumulative Layout Shift",
};

const checkPageSpeed = async (params: { url?: string; strategy: Strategy }): Promise<PageSpeedResult> =>
  (await api.get("/page-speed", { params: { strategy: params.strategy, url: params.url || undefined } })).data;

function scoreColor(score: number | null) {
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

export default function PageSpeedCard() {
  const [strategy, setStrategy] = useState<Strategy>("mobile");
  const { data: company } = OnboardingDetailsQuery();
  const [typedUrl, setTypedUrl] = useState<string | null>(null);
  const url = typedUrl ?? company?.website_url ?? "";
  const check = useMutation({
    mutationFn: checkPageSpeed,
    onError: (error) => toast.error(getApiErrorMessage(error, "Could not check the website speed")),
  });
  const result = check.data;
  const vitals = (result?.field_metrics ?? []).filter((m) => FIELD_LABELS[m.id]);

  return (
    <Card className="space-y-5 p-5 sm:p-6">
      <div className="flex min-w-0 items-start gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#F6F7FD] text-[#5B57E6] ring-1 ring-[#E6E8F5]">
          <Gauge className="size-7" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="text-[16px] font-semibold text-neutral-900">Website speed</h2>
          <p className="mt-1 text-[13px] leading-5 text-neutral-500">
            Google PageSpeed Insights: how fast your website loads and what to fix. Your company website is filled in;
            change it to check another page.
          </p>
        </div>
      </div>

      <form
        className="flex flex-wrap items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          check.mutate({ url: url.trim(), strategy });
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
              onClick={() => setStrategy(option)}
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

      {result ? (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-4">
            <span
              className={`grid size-20 place-items-center rounded-full text-2xl font-semibold ring-4 ${scoreColor(result.score)}`}
            >
              {result.score ?? "–"}
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-medium capitalize text-neutral-900">Performance · {result.strategy}</p>
              <p className="truncate text-[13px] text-neutral-500">{result.url}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            {result.lab_metrics.map((metric) => (
              <div key={metric.id} className="rounded-2xl bg-[#F6F7FD] px-4 py-3 ring-1 ring-[#E6E8F5]">
                <p className="text-[12px] text-neutral-500">{metric.title}</p>
                <p className="mt-1 text-lg font-semibold text-neutral-900">{metric.display_value}</p>
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

          <div>
            <h3 className="text-[13px] font-semibold text-neutral-900">What to fix first</h3>
            {result.opportunities.length === 0 ? (
              <p className="mt-2 text-[13px] text-neutral-500">No major fixes suggested.</p>
            ) : (
              <ul className="mt-2 space-y-1.5 text-[13px]">
                {result.opportunities.slice(0, 5).map((fix) => (
                  <li key={fix.id} className="flex items-center justify-between gap-3">
                    <span className="min-w-0 truncate text-neutral-700">{fix.title}</span>
                    <span className="shrink-0 text-neutral-500">
                      saves ~{(fix.savings_ms / 1000).toFixed(1)} s
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </Card>
  );
}
