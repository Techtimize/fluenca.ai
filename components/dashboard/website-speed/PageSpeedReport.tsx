import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Accessibility, Search, ShieldCheck, Users, Zap } from "lucide-react";
import type { PageSpeedResult } from "@/routes/page-speed/page-speed.routes";

const FIELD_LABELS: Record<string, string> = {
  LARGEST_CONTENTFUL_PAINT_MS: "Largest Contentful Paint",
  INTERACTION_TO_NEXT_PAINT: "Interaction to Next Paint",
  CUMULATIVE_LAYOUT_SHIFT_SCORE: "Cumulative Layout Shift",
};

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  accessibility: Accessibility,
  "best-practices": ShieldCheck,
  seo: Search,
};

const MAX_FIXES = 6;

/** Text + ring colour for a 0–100 score, PageSpeed-style: green 90+, amber 50–89, red below. */
export function scoreColor(score: number | null) {
  if (score === null) return "text-neutral-500 ring-neutral-200";
  if (score >= 90) return "text-[#0F9F8A] ring-[#99E2D6]";
  if (score >= 50) return "text-[#E8890C] ring-amber-200";
  return "text-rose-600 ring-rose-200";
}

function arcColors(score: number | null) {
  if (score === null) return { arc: "#D4D4D8", track: "#F4F4F5" };
  if (score >= 90) return { arc: "#14B8A6", track: "#CCF3EC" };
  if (score >= 50) return { arc: "#F5A524", track: "#FDE9C6" };
  return { arc: "#F43F5E", track: "#FDD5DD" };
}

function categoryColor(category: string) {
  if (category === "FAST") return "text-[#0F9F8A]";
  if (category === "AVERAGE") return "text-[#E8890C]";
  return "text-rose-600";
}

function fieldValue(id: string, percentile: number) {
  if (id === "CUMULATIVE_LAYOUT_SHIFT_SCORE") return percentile.toFixed(2);
  return percentile >= 1000 ? `${(percentile / 1000).toFixed(1)} s` : `${Math.round(percentile)} ms`;
}

const RING_SIZE = 88;
const RING_STROKE = 6;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

function ScoreRing({ score, label }: { score: number | null; label: string }) {
  const { arc, track } = arcColors(score);
  const filled = score === null ? 0 : (Math.max(0, Math.min(100, score)) / 100) * RING_LENGTH;

  return (
    <div className="flex w-[88px] flex-col items-center gap-2">
      <div className="relative size-[88px]">
        <svg viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} className="size-full -rotate-90" aria-hidden="true">
          <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS} fill="none" stroke={track} strokeWidth={RING_STROKE} />
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            fill="none"
            stroke={arc}
            strokeWidth={RING_STROKE}
            strokeLinecap="round"
            strokeDasharray={`${filled} ${RING_LENGTH}`}
          />
        </svg>
        <span
          className={`absolute inset-0 grid place-items-center text-2xl font-semibold ${scoreColor(score)}`}
          aria-label={`${label} score ${score ?? "unavailable"}`}
        >
          {score ?? "–"}
        </span>
      </div>
      <span className="text-center text-[13px] text-neutral-600">{label}</span>
    </div>
  );
}

function Screenshot({ result }: { result: PageSpeedResult }) {
  if (!result.screenshot) return null;
  const mobile = result.strategy === "mobile";
  return (
    <div
      className={`shrink-0 overflow-hidden bg-neutral-900 shadow-sm ${
        mobile ? "h-60 w-32 rounded-[22px] border-[5px] border-neutral-900" : "h-40 w-64 rounded-xl border-[5px] border-neutral-900"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={result.screenshot}
        alt={`How ${result.url} looks on ${result.strategy}`}
        className={`size-full object-cover object-top ${mobile ? "rounded-[17px]" : "rounded-lg"}`}
      />
    </div>
  );
}

function IconBadge({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#EEF0FF] text-[#4F46E5]">
      <Icon className="size-5" aria-hidden="true" />
    </span>
  );
}

function Block({ icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-3">
        <IconBadge icon={icon} />
        <h3 className="text-[15px] font-semibold text-neutral-900">{title}</h3>
      </div>
      <div className="mt-3 ps-[52px]">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, index) => (
        <li key={index} className="flex gap-2.5 text-[13px] leading-5 text-neutral-700">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-neutral-500" aria-hidden="true" />
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="divide-y divide-[#EEF0F8] rounded-2xl border border-[#E6E8F5] bg-white px-5 [&>*]:py-5">
      {children}
    </div>
  );
}

function CategoryBlock({ category }: { category: PageSpeedResult["categories"][number] }) {
  return (
    <Block
      icon={CATEGORY_ICONS[category.id] ?? ShieldCheck}
      title={`${category.title}: ${category.issues.length ? "to fix" : "all checks passed"}`}
    >
      {category.issues.length ? (
        <BulletList items={category.issues} />
      ) : (
        <p className="text-[13px] text-neutral-500">Nothing to fix here.</p>
      )}
    </Block>
  );
}

/** Full PageSpeed Insights report: scores, lab metrics, Core Web Vitals and what to fix. */
export function PageSpeedReport({ result }: { result: PageSpeedResult }) {
  const vitals = result.field_metrics.filter((m) => FIELD_LABELS[m.id]);
  const performance = result.categories.find((c) => c.id === "performance");
  const otherCategories = result.categories.filter((c) => c.id !== "performance");
  const seo = otherCategories.find((c) => c.id === "seo");
  const middleCategories = otherCategories.filter((c) => c.id !== "seo");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0 space-y-4">
          <p className="truncate text-[14px] text-neutral-500">
            <span className="font-semibold capitalize text-neutral-900">{result.strategy}</span>
            <span className="mx-1.5" aria-hidden="true">•</span>
            {result.url}
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <ScoreRing score={performance?.score ?? result.score} label="Performance" />
            {otherCategories.map((category) => (
              <ScoreRing key={category.id} score={category.score} label={category.title} />
            ))}
          </div>
        </div>
        <Screenshot result={result} />
      </div>

      {result.lab_metrics.length ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {result.lab_metrics.map((metric) => (
            <div key={metric.id} className="min-w-0 rounded-2xl border border-[#E6E8F5] bg-white px-5 py-4">
              <p className="truncate text-[13px] text-neutral-600">{metric.title}</p>
              <p className="mt-1.5 text-2xl font-semibold text-neutral-900">{metric.display_value || "–"}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr_1fr]">
        <Panel>
          <Block icon={Users} title="Real visitors (Core Web Vitals)">
            {vitals.length ? (
              <ul className="space-y-2 text-[13px]">
                {vitals.map((metric) => (
                  <li key={metric.id} className="flex items-center justify-between gap-3">
                    <span className="text-neutral-700">{FIELD_LABELS[metric.id]}</span>
                    <span className={`font-semibold ${categoryColor(metric.category)}`}>
                      {fieldValue(metric.id, metric.percentile)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] leading-6 text-neutral-600">
                Google does not have enough real-visitor data for this page yet.
              </p>
            )}
          </Block>
          <Block icon={Zap} title="Speed: what to fix first">
            {result.opportunities.length ? (
              <BulletList
                items={result.opportunities.slice(0, MAX_FIXES).map((fix) => (
                  <>
                    {fix.title}
                    <span className="block text-[12px] text-neutral-500">
                      saves ~{(fix.savings_ms / 1000).toFixed(1)} s
                    </span>
                  </>
                ))}
              />
            ) : (
              <p className="text-[13px] text-neutral-500">No major fixes suggested.</p>
            )}
          </Block>
        </Panel>

        {middleCategories.length ? (
          <Panel>
            {middleCategories.map((category) => (
              <CategoryBlock key={category.id} category={category} />
            ))}
          </Panel>
        ) : null}

        {seo ? (
          <Panel>
            <CategoryBlock category={seo} />
          </Panel>
        ) : null}
      </div>
    </div>
  );
}
