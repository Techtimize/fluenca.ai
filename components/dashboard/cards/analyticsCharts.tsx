import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import type { AnalyticsCharts, GrowthOpportunity } from "@/types/dashboard";

// Light, bright fills; every bar carries a value label, so the light tones stay readable.
const STRENGTH = "#818CF8";
const WEAKNESS = "#FB7185";
const SINGLE = "#818CF8";

const LEVELS = ["High", "Medium", "Low"];

const PRIORITY_DOT: Record<string, string> = {
  high: "bg-[#F43F5E]",
  medium: "bg-[#F59E0B]",
  low: "bg-[#10B981]",
};

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className="flex flex-col rounded-2xl border border-[#E6E8F5] bg-white p-5">
      <h3 className="text-[13px] font-semibold text-neutral-900">{title}</h3>
      <p className="mb-5 mt-1 text-xs text-neutral-500">{subtitle}</p>
      {children}
    </section>
  );
}

function Bar({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  const width = max ? (value / max) * 100 : 0;
  return (
    <div className="group flex items-center gap-2" title={label}>
      <div className="h-2.5 flex-1 rounded-r-full bg-neutral-50">
        <div className="h-full rounded-r-[4px]" style={{ width: `${width}%`, backgroundColor: color }} />
      </div>
      <span className="w-5 text-right text-[12px] font-medium text-neutral-800">{value}</span>
    </div>
  );
}

/* ---------- Strengths vs weaknesses (two series, grouped bars) ---------- */
function StrengthsWeaknessesChart({ data }: { data: AnalyticsCharts["strengthsWeaknesses"] }) {
  const max = Math.max(1, ...data.flatMap((row) => [row.strengths, row.weaknesses]));
  return (
    <ChartCard title="Strengths vs Weaknesses" subtitle="Signals found by the analysis">
      <div className="flex-1 space-y-5">
        {data.map((row) => (
          <div key={row.group}>
            <p className="mb-2 text-xs font-medium text-neutral-700">{row.group}</p>
            <div className="space-y-1.5">
              <Bar value={row.strengths} max={max} color={STRENGTH} label={`${row.group} strengths: ${row.strengths}`} />
              <Bar value={row.weaknesses} max={max} color={WEAKNESS} label={`${row.group} weaknesses: ${row.weaknesses}`} />
            </div>
          </div>
        ))}
      </div>
      <ul className="mt-5 flex gap-4 text-xs text-neutral-600">
        <li className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm" style={{ backgroundColor: STRENGTH }} /> Strengths
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm" style={{ backgroundColor: WEAKNESS }} /> Weaknesses
        </li>
      </ul>
    </ChartCard>
  );
}

/* ---------- Growth opportunities by priority (single series, column bars) ---------- */
function OpportunityList({ items }: { items: GrowthOpportunity[] }) {
  return (
    <ul className="mt-5 space-y-2 border-t border-neutral-100 pt-4">
      {items.map((item) => (
        <li key={item.id}>
          <details className="group rounded-xl bg-[#F6F7FD] px-3 py-2.5">
            <summary className="flex cursor-pointer list-none items-start gap-2 [&::-webkit-details-marker]:hidden">
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-700">
                  <span className={`size-1.5 rounded-full ${PRIORITY_DOT[item.priority?.toLowerCase()] ?? "bg-neutral-400"}`} aria-hidden="true" />
                  {item.area}
                  <span className="sr-only">, {item.priority} priority</span>
                </span>
                <span className="mt-1 block text-xs text-neutral-800">{item.finding}</span>
              </span>
              <ChevronDown className="mt-0.5 size-3.5 shrink-0 text-neutral-500 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <dl className="mt-2 space-y-1.5 text-[11px] leading-4">
              <div>
                <dt className="font-medium text-neutral-500">Why it matters</dt>
                <dd className="text-neutral-700">{item.impact}</dd>
              </div>
              <div>
                <dt className="font-medium text-neutral-500">Next step</dt>
                <dd className="text-neutral-700">{item.action}</dd>
              </div>
            </dl>
          </details>
        </li>
      ))}
    </ul>
  );
}

function OpportunitiesChart({
  data,
  items = [],
}: {
  data: AnalyticsCharts["opportunitiesByPriority"];
  items?: GrowthOpportunity[];
}) {
  const max = Math.max(1, ...data.map((row) => row.count));
  const total = data.reduce((sum, row) => sum + row.count, 0);
  return (
    <ChartCard title="Growth Opportunities" subtitle={`${total} opportunities by priority`}>
      <div className="flex flex-1 items-end justify-around gap-4 border-b border-neutral-200 pt-6">
        {data.map((row) => (
          <div key={row.priority} className="flex h-40 w-12 flex-col items-center justify-end" title={`${row.priority}: ${row.count}`}>
            <span className="mb-1 text-[12px] font-medium text-neutral-800">{row.count}</span>
            <div
              className="w-full rounded-t-[4px]"
              style={{ height: `${(row.count / max) * 100}%`, minHeight: row.count ? 4 : 0, backgroundColor: SINGLE }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-around gap-4">
        {data.map((row) => (
          <span key={row.priority} className="w-12 text-center text-[11px] font-medium text-neutral-500">
            {row.priority}
          </span>
        ))}
      </div>
      {items.length ? <OpportunityList items={items} /> : null}
    </ChartCard>
  );
}

/* ---------- Recommended actions: impact vs effort matrix ---------- */
function ImpactEffortMatrix({ data }: { data: AnalyticsCharts["actions"] }) {
  const level = (value: string) => LEVELS.find((item) => item.toLowerCase() === value?.toLowerCase());
  const efforts = [...LEVELS].reverse(); // Low effort on the left

  return (
    <ChartCard title="Impact vs Effort" subtitle="Recommended actions — top-left are quick wins">
      <div className="flex gap-2">
        <div className="flex flex-col justify-around text-[11px] text-neutral-500">
          {LEVELS.map((impact) => (
            <span key={impact} className="h-16 leading-[4rem]">{impact}</span>
          ))}
        </div>
        <div className="grid flex-1 grid-cols-3 gap-0.5">
          {LEVELS.map((impact) =>
            efforts.map((effort) => {
              const items = data.filter((item) => level(item.impact) === impact && level(item.effort) === effort);
              const quickWin = impact === "High" && effort === "Low";
              return (
                <div
                  key={`${impact}-${effort}`}
                  className={`flex h-16 flex-wrap content-center justify-center gap-1 rounded-md ${quickWin ? "bg-emerald-50" : "bg-[#F6F7FD]"}`}
                >
                  {items.map((item, index) => (
                    <span
                      key={item.title}
                      title={`${item.title} — impact ${item.impact}, effort ${item.effort}`}
                      className="grid size-6 place-items-center rounded-full bg-[#818CF8] text-[11px] font-semibold text-white ring-2 ring-white"
                    >
                      {item.priority ?? index + 1}
                    </span>
                  ))}
                </div>
              );
            }),
          )}
        </div>
      </div>
      <div className="mt-1 flex gap-2">
        <span className="w-[42px]" />
        <div className="grid flex-1 grid-cols-3 text-center text-[11px] text-neutral-500">
          {efforts.map((effort) => (
            <span key={effort}>{effort}</span>
          ))}
        </div>
      </div>
      <p className="mt-1 text-center text-[10px] uppercase tracking-[0.06em] text-neutral-400">Effort →</p>
      <ol className="mt-4 space-y-1 text-xs text-neutral-600">
        {data.map((item, index) => (
          <li key={item.title} className="flex gap-2">
            <span className="font-semibold text-neutral-800">{item.priority ?? index + 1}.</span>
            {item.title}
          </li>
        ))}
      </ol>
    </ChartCard>
  );
}

export default function AnalyticsChartsRow({ charts }: { charts: AnalyticsCharts }) {
  return (
    <>
      <StrengthsWeaknessesChart data={charts.strengthsWeaknesses} />
      <OpportunitiesChart data={charts.opportunitiesByPriority} items={charts.opportunities} />
      {charts.actions.length ? <ImpactEffortMatrix data={charts.actions} /> : null}
    </>
  );
}
