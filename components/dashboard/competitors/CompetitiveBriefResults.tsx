"use client";

import type { ReactNode } from "react";
import {
  AlertTriangle,
  Building2,
  Crosshair,
  ExternalLink,
  Lightbulb,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import ApiNotFoundCard from "@/components/notfound";
import Card from "@/components/shared/card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import type {
  CompetitiveBriefCompetitor,
  CompetitiveBriefStrategy,
  CompetitorsListResponse,
} from "@/types/bussiness/competitoranalysis-type";
import { FOCUS_RING } from "@/utils/ui-classes";

function Chip({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-[#E6E8F5] bg-[#F6F7FD] px-3 py-1 text-[12px] text-neutral-700">
      {children}
    </span>
  );
}

function ChipList({ items }: { items?: string[] | null }) {
  const labels = (items ?? []).filter(Boolean);
  if (!labels.length) return <p className="text-[13px] text-neutral-500">No data yet</p>;
  return (
    <ul className="flex flex-wrap gap-2">
      {labels.map((item) => (
        <li key={item}>
          <Chip>{item}</Chip>
        </li>
      ))}
    </ul>
  );
}

function Section({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon?: typeof Target;
  children: ReactNode;
}) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-start gap-3">
        {Icon ? (
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#ECEBFF] text-[#5B57E6]">
            <Icon className="size-4" aria-hidden="true" />
          </span>
        ) : null}
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold text-neutral-900">{title}</h3>
          {description ? (
            <p className="mt-1 text-[13px] leading-5 text-neutral-500">{description}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </Card>
  );
}

function MetaCard({ label, value }: { label: string; value?: string | number | null }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-3">
      <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-neutral-500">{label}</p>
      <p className="mt-1 break-words text-[13px] font-medium text-neutral-900">{String(value)}</p>
    </div>
  );
}

function threatTone(level?: string | null) {
  const lower = (level || "").toLowerCase();
  if (lower === "high") return "bg-rose-50 text-rose-700 ring-rose-200";
  if (lower === "medium") return "bg-amber-50 text-amber-800 ring-amber-200";
  if (lower === "low") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  return "bg-[#F6F7FD] text-neutral-700 ring-[#E6E8F5]";
}

function impactTone(value?: string) {
  const lower = (value || "").toLowerCase();
  if (lower === "high") return "bg-[#ECEBFF] text-[#5B57E6]";
  if (lower === "medium") return "bg-amber-50 text-amber-800";
  return "bg-neutral-100 text-neutral-600";
}

function isBriefCompetitor(item: unknown): item is CompetitiveBriefCompetitor {
  if (!item || typeof item !== "object") return false;
  const record = item as Record<string, unknown>;
  return (
    "why_competitor" in record ||
    "offers" in record ||
    "talking_about" in record ||
    "links" in record
  );
}

function ExternalLinkPill({
  href,
  label,
  verified,
}: {
  href?: string;
  label: string;
  verified?: boolean;
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-[#5B57E6] ring-1 ring-[#E6E8F5] hover:bg-[#F6F7FD] ${FOCUS_RING}`}
    >
      <ExternalLink className="size-3" aria-hidden="true" />
      {label}
      {verified ? <span className="text-[10px] text-emerald-600">✓</span> : null}
    </a>
  );
}

function StrategyBlocks({ strategy }: { strategy?: CompetitiveBriefStrategy | null }) {
  if (!strategy) return null;

  return (
    <div className="space-y-4">
      {strategy.competitive_landscape ? (
        <Section
          title="Competitive landscape"
          description={strategy.competitive_landscape.summary}
          icon={Crosshair}
        >
          <ul className="space-y-3">
            {(strategy.competitive_landscape.segments || []).map((segment, index) => (
              <li
                key={`${segment.segment}-${index}`}
                className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-4"
              >
                <p className="text-[13px] font-semibold text-neutral-900">{segment.segment}</p>
                {segment.how_they_compete ? (
                  <p className="mt-1 text-[13px] leading-5 text-neutral-600">
                    {segment.how_they_compete}
                  </p>
                ) : null}
                {segment.competitors?.length ? (
                  <div className="mt-3">
                    <ChipList items={segment.competitors} />
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {strategy.opportunities?.length ? (
        <Section title="Opportunities" icon={Lightbulb}>
          <ul className="space-y-3">
            {strategy.opportunities.map((item, index) => (
              <li
                key={`${item.opportunity}-${index}`}
                className="rounded-2xl border border-[#E6E8F5] bg-white p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {item.type ? (
                    <span className="rounded-full bg-[#ECEBFF] px-2.5 py-0.5 text-[11px] font-medium capitalize text-[#5B57E6]">
                      {item.type}
                    </span>
                  ) : null}
                  <p className="text-[13px] font-semibold text-neutral-900">{item.opportunity}</p>
                </div>
                {item.why ? (
                  <p className="mt-2 text-[13px] leading-5 text-neutral-600">{item.why}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {strategy.priority_actions?.length ? (
        <Section title="Priority actions" icon={Target}>
          <ul className="space-y-3">
            {strategy.priority_actions.map((item, index) => (
              <li
                key={`${item.action}-${index}`}
                className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {item.impact ? (
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${impactTone(item.impact)}`}
                    >
                      Impact {item.impact}
                    </span>
                  ) : null}
                  {item.effort ? (
                    <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-medium capitalize text-neutral-600 ring-1 ring-[#E6E8F5]">
                      Effort {item.effort}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-[13px] font-semibold text-neutral-900">{item.action}</p>
                {item.why ? (
                  <p className="mt-1 text-[13px] leading-5 text-neutral-600">{item.why}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {(strategy.content_gaps || strategy.positioning_gaps) ? (
        <Section title="Gaps & differentiation" icon={TrendingUp}>
          <div className="grid gap-4 lg:grid-cols-2">
            {strategy.content_gaps ? (
              <div className="rounded-2xl border border-[#E6E8F5] bg-white p-4">
                <p className="text-[12px] font-semibold text-neutral-800">Content gaps</p>
                <div className="mt-3 space-y-3">
                  <div>
                    <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-neutral-400">
                      Unowned topics
                    </p>
                    <ChipList items={strategy.content_gaps.unowned_topics} />
                  </div>
                  {strategy.content_gaps.you_should_explore?.length ? (
                    <div>
                      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-neutral-400">
                        Explore
                      </p>
                      <ChipList items={strategy.content_gaps.you_should_explore} />
                    </div>
                  ) : null}
                  {strategy.content_gaps.owned_by_competitors?.length ? (
                    <div>
                      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-neutral-400">
                        Owned by competitors
                      </p>
                      <ul className="space-y-2">
                        {strategy.content_gaps.owned_by_competitors.map((item, index) => (
                          <li
                            key={`${item.owner}-${item.topic}-${index}`}
                            className="text-[13px] text-neutral-700"
                          >
                            <span className="font-medium">{item.topic}</span>
                            {item.owner ? (
                              <span className="text-neutral-400"> · {item.owner}</span>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {strategy.positioning_gaps ? (
              <div className="rounded-2xl border border-[#E6E8F5] bg-white p-4">
                <p className="text-[12px] font-semibold text-neutral-800">Positioning gaps</p>
                <div className="mt-3 space-y-3">
                  <div>
                    <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-neutral-400">
                      Your differentiation
                    </p>
                    <ChipList items={strategy.positioning_gaps.your_differentiation} />
                  </div>
                  <div>
                    <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-neutral-400">
                      Weak messaging
                    </p>
                    <ChipList items={strategy.positioning_gaps.weak_messaging} />
                  </div>
                  <div>
                    <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-neutral-400">
                      Crowded messages
                    </p>
                    <ChipList items={strategy.positioning_gaps.crowded_messages} />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </Section>
      ) : null}
    </div>
  );
}

function CompetitorBriefCards({ competitors }: { competitors: CompetitiveBriefCompetitor[] }) {
  return (
    <ul className="grid gap-4 lg:grid-cols-2">
      {competitors.map((item, index) => (
        <li key={`${item.name || "competitor"}-${index}`}>
          <Card className="h-full p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-[15px] font-semibold text-neutral-900">{item.name || "Competitor"}</p>
                {item.competition_type ? (
                  <p className="mt-0.5 text-[12px] capitalize text-neutral-500">
                    {item.competition_type} competition
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {item.threat_level ? (
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ring-1 ${threatTone(item.threat_level)}`}
                  >
                    {item.threat_level} threat
                  </span>
                ) : null}
                {item.evidence_quality ? (
                  <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-medium capitalize text-neutral-600 ring-1 ring-[#E6E8F5]">
                    Evidence {item.evidence_quality}
                  </span>
                ) : null}
              </div>
            </div>

            {item.why_competitor ? (
              <p className="mt-3 text-[13px] leading-5 text-neutral-600">{item.why_competitor}</p>
            ) : null}

            {item.threat_reason ? (
              <p className="mt-2 rounded-xl bg-rose-50/70 px-3 py-2 text-[12px] leading-5 text-rose-800">
                {item.threat_reason}
              </p>
            ) : null}

            {item.positioning?.primary_message ? (
              <div className="mt-3 rounded-xl border border-[#E6E8F5] bg-[#F8F9FF] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
                  Positioning
                </p>
                <p className="mt-1 text-[13px] leading-5 text-neutral-800">
                  {item.positioning.primary_message}
                </p>
              </div>
            ) : null}

            <div className="mt-3 flex flex-wrap gap-2">
              <ExternalLinkPill
                href={item.links?.website?.url}
                label="Website"
                verified={item.links?.website?.verified}
              />
              <ExternalLinkPill
                href={item.links?.linkedin?.url}
                label="LinkedIn"
                verified={item.links?.linkedin?.verified}
              />
              <ExternalLinkPill
                href={item.links?.instagram?.url}
                label={item.links?.instagram?.username || "Instagram"}
                verified={item.links?.instagram?.verified}
              />
            </div>

            {item.offers?.core_offers?.length ? (
              <div className="mt-4">
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-neutral-400">
                  Core offers
                </p>
                <ChipList items={item.offers.core_offers} />
                {item.offers.pricing_model ? (
                  <p className="mt-2 text-[12px] text-neutral-500">{item.offers.pricing_model}</p>
                ) : null}
              </div>
            ) : null}

            {item.target_audience?.length ? (
              <div className="mt-4">
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-neutral-400">
                  Target audience
                </p>
                <ChipList items={item.target_audience} />
              </div>
            ) : null}

            {item.overlap ? (
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <MetaCard label="Overlap audience" value={item.overlap.audience?.join(", ")} />
                <MetaCard label="Overlap services" value={item.overlap.services?.join(", ")} />
                <MetaCard label="Geography" value={item.overlap.geography} />
              </div>
            ) : null}

            {item.positioning?.differentiators?.length ? (
              <div className="mt-4">
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-neutral-400">
                  Differentiators
                </p>
                <ChipList items={item.positioning.differentiators} />
              </div>
            ) : null}

            {item.missing?.length ? (
              <div className="mt-4">
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-neutral-400">
                  Missing
                </p>
                <ChipList items={item.missing} />
              </div>
            ) : null}

            {item.talking_about?.length ? (
              <div className="mt-4">
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-neutral-400">
                  Talking about
                </p>
                <ul className="space-y-2">
                  {item.talking_about.map((point, pointIndex) => (
                    <li
                      key={`${point.theme}-${pointIndex}`}
                      className="rounded-xl border border-[#E6E8F5] bg-white p-3"
                    >
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="text-[12px] font-semibold text-neutral-900">{point.theme}</p>
                        {point.channel ? (
                          <span className="rounded-full bg-[#F6F7FD] px-2 py-0.5 text-[10px] text-neutral-500">
                            {point.channel}
                          </span>
                        ) : null}
                      </div>
                      {point.evidence ? (
                        <p className="mt-1 text-[12px] leading-5 text-neutral-600">{point.evidence}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {item.where_they_compete?.length ? (
              <div className="mt-4">
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-neutral-400">
                  Where they compete
                </p>
                <ul className="space-y-2">
                  {item.where_they_compete.map((entry, entryIndex) => (
                    <li key={`${entry.channel}-${entryIndex}`} className="text-[13px] text-neutral-700">
                      {entry.channel ? (
                        <span className="font-medium text-neutral-900">{entry.channel}: </span>
                      ) : null}
                      {entry.how}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Card>
        </li>
      ))}
    </ul>
  );
}

type Props = {
  data?: CompetitorsListResponse | null;
  isLoading?: boolean;
  isError?: boolean;
  isNotFound?: boolean;
  errorMessage?: string;
  onRunAnalysis?: () => void;
  onRetry?: () => void;
  isRetrying?: boolean;
};

export default function CompetitiveBriefResults({
  data,
  isLoading,
  isError,
  isNotFound,
  errorMessage,
  onRunAnalysis,
  onRetry,
  isRetrying,
}: Props) {
  const result = data?.result;
  const competitors = (result?.competitors || data?.competitors || []).filter(isBriefCompetitor);
  const summary = data?.summary || result?.summary;
  const company = result?.company;
  const strategy = result?.strategy;
  const whitespace = result?.market_whitespace;
  const hasAnalysis = Boolean(result || summary || competitors.length);

  if (isLoading) {
    return (
      <Card className="p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-[#ECEBFF] text-[#5B57E6]">
            <Search className="size-4 animate-pulse" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-medium text-neutral-900">Loading AI competitor brief…</p>
            <p className="mt-0.5 text-[13px] text-neutral-500">
              Fetching the latest competitive analysis.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (isNotFound) {
    return (
      <ApiNotFoundCard
        resource="competitors"
        onRetry={onRetry}
        isRetrying={isRetrying}
        actionLabel={onRunAnalysis ? "Run competitor analysis" : undefined}
        onAction={onRunAnalysis}
      />
    );
  }

  if (isError) {
    return (
      <Card className="border-rose-200 bg-rose-50/80 p-5 sm:p-6">
        <p className="text-sm text-rose-700">
          {errorMessage || "Failed to load AI competitor analysis"}
        </p>
      </Card>
    );
  }

  if (!hasAnalysis) {
    return (
      <ApiNotFoundCard
        resource="competitors"
        title="No AI competitor brief yet"
        description="Run AI discovery to generate a competitive brief for your company."
        actionLabel={onRunAnalysis ? "Run competitor analysis" : undefined}
        onAction={onRunAnalysis}
      />
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-5 sm:p-6">
        {company?.competitor_criteria ? (
          <p className="mt-4 rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] px-4 py-3 text-[13px] leading-5 text-neutral-700">
            <span className="font-semibold text-neutral-900">Competitor criteria: </span>
            {company.competitor_criteria}
          </p>
        ) : null}

        {result?.error || data?.error ? (
          <div className="mt-4 flex gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-800">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>{result?.error || data?.error}</span>
          </div>
        ) : null}
      </Card>

      <Section
        title="Competitors"
        description={
          competitors.length
            ? `${competitors.length} competitors discovered`
            : "No peer competitors discovered in this run."
        }
        icon={Users}
      >
        {competitors.length ? (
          <CompetitorBriefCards competitors={competitors} />
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E6E8F5] bg-[#F8F9FF] px-4 py-6 text-center">
            <p className="text-[13px] text-neutral-600">
              No competitor profiles were returned for this brief.
            </p>
            {onRunAnalysis ? (
              <Button
                type="button"
                onClick={onRunAnalysis}
                className="mt-4 h-10 gap-2 rounded-full bg-[#5B57E6] px-4 text-white hover:bg-[#4A46D0]"
              >
                <Sparkles className="size-4" />
                Run analysis again
              </Button>
            ) : null}
          </div>
        )}
      </Section>

      <StrategyBlocks strategy={strategy} />

      {whitespace ? (
        <Section
          title="Market whitespace"
          description={whitespace.whitespace_summary}
          icon={Building2}
        >
          {whitespace.gaps?.length ? (
            <ul className="space-y-3">
              {whitespace.gaps.map((gap, index) => (
                <li
                  key={`${gap.gap}-${index}`}
                  className="rounded-2xl border border-[#E6E8F5] bg-white p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {gap.area ? (
                      <span className="rounded-full bg-[#ECEBFF] px-2.5 py-0.5 text-[11px] font-medium text-[#5B57E6]">
                        {gap.area}
                      </span>
                    ) : null}
                    {gap.confidence ? (
                      <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-medium capitalize text-neutral-600 ring-1 ring-[#E6E8F5]">
                        {gap.confidence} confidence
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-[13px] font-semibold text-neutral-900">{gap.gap}</p>
                  {gap.evidence ? (
                    <p className="mt-1 text-[13px] leading-5 text-neutral-600">{gap.evidence}</p>
                  ) : null}
                  {gap.opportunity ? (
                    <p className="mt-2 text-[13px] leading-5 text-neutral-800">
                      <span className="font-medium">Opportunity: </span>
                      {gap.opportunity}
                    </p>
                  ) : null}
                  {gap.competitors_involved?.length ? (
                    <div className="mt-3">
                      <ChipList items={gap.competitors_involved} />
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}

          {whitespace.crowded_areas?.length ? (
            <div className="mt-4">
              <p className="mb-2 text-[12px] font-semibold text-neutral-800">Crowded areas</p>
              <ul className="grid gap-3 md:grid-cols-2">
                {whitespace.crowded_areas.map((area, index) => (
                  <li
                    key={`${area.area}-${index}`}
                    className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-4"
                  >
                    <p className="text-[13px] font-semibold text-neutral-900">{area.area}</p>
                    {area.note ? (
                      <p className="mt-1 text-[13px] leading-5 text-neutral-600">{area.note}</p>
                    ) : null}
                    {area.competitors?.length ? (
                      <div className="mt-3">
                        <ChipList items={area.competitors} />
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Section>
      ) : null}
    </div>
  );
}
