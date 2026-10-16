"use client";

import type { ReactNode } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SocialGrowthResponse } from "@/types/bussiness/socail-growth-type";
import { summarizeGoal, type GoalFormValues } from "@/lib/goals/goal-form";

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-[#E6E8F5] bg-white px-3.5 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
        {label}
      </p>
      <p className="mt-1 truncate text-[18px] font-semibold tabular-nums text-neutral-900">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-[11px] leading-4 text-neutral-500">{hint}</p>
      ) : null}
    </div>
  );
}

function PanelShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-[#E6E8F5] bg-white sm:rounded-3xl">
      <div className="border-b border-[#EEF0F8] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_55%)] px-4 py-4 sm:px-6 sm:py-5">
        <h2 className="text-[16px] font-semibold tracking-tight text-neutral-900">
          {title}
        </h2>
        <p className="mt-1 max-w-2xl text-[13px] leading-5 text-neutral-500">
          {description}
        </p>
      </div>
      <div className="space-y-4 p-4 sm:p-6">{children}</div>
      {footer ? (
        <div className="border-t border-[#EEF0F8] bg-[#FCFCFF] px-4 py-3 sm:px-6">
          {footer}
        </div>
      ) : null}
    </section>
  );
}

export function GoalDiagnosePanel({
  form,
  data,
  isLoading,
  onContinue,
}: {
  form: GoalFormValues;
  data?: SocialGrowthResponse | null;
  isLoading?: boolean;
  onContinue: () => void;
}) {
  if (isLoading) {
    return (
      <PanelShell
        title="Diagnosing your situation"
        description="Fluenca is reviewing profiles, content performance, audience signals, competitors, and posting consistency."
      >
        <div className="flex items-center gap-3 rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] px-4 py-6">
          <Loader2 className="size-5 animate-spin text-[#5B57E6]" />
          <div>
            <p className="text-sm font-medium text-neutral-900">
              Running diagnosis for {summarizeGoal(form)}
            </p>
            <p className="mt-0.5 text-[13px] text-neutral-500">
              This usually takes under a minute.
            </p>
          </div>
        </div>
      </PanelShell>
    );
  }

  const gap = data?.growth_gap;
  const report = data?.performance_report;
  const assumptions = data?.goal?.assumptions || [];
  const issues = data?.issues || [];

  return (
    <PanelShell
      title="Current situation"
      description="A snapshot of where you are versus the goal, and what is holding growth back."
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[12px] text-neutral-500">
            Goal: {summarizeGoal(form)}
          </p>
          <Button
            type="button"
            onClick={onContinue}
            
          >
            Build plan
            <ArrowRight className="size-4" />
          </Button>
        </div>
      }
    >
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Current followers"
          value={String(gap?.current_followers ?? report?.followers ?? "—")}
        />
        <StatCard
          label="Target followers"
          value={String(gap?.target_followers ?? "—")}
        />
        <StatCard
          label="Daily growth needed"
          value={
            gap?.required_daily_growth != null
              ? String(Math.round(gap.required_daily_growth))
              : "—"
          }
          hint="Net new followers / day"
        />
        <StatCard
          label="Engagement now"
          value={
            report?.engagement_rate != null
              ? `${report.engagement_rate}%`
              : gap?.engagement_gap != null
                ? `${gap.engagement_gap} gap`
                : "—"
          }
        />
      </div>

      {assumptions.length ? (
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
            Assumptions
          </p>
          <ul className="space-y-2">
            {assumptions.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-[#E6E8F5] bg-[#F8F9FF] px-3 py-2.5 text-[13px] text-neutral-700"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {issues.length ? (
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
            <AlertTriangle className="size-3.5 text-[#C2410C]" />
            Weaknesses & risks
          </p>
          <ul className="space-y-2">
            {issues.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-[#F3E7DC] bg-[#FFFBF7] px-3 py-2.5 text-[13px] text-neutral-700"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-[#E6E8F5] px-3 py-4 text-center text-[13px] text-neutral-500">
          No major issues flagged in this diagnosis.
        </p>
      )}
    </PanelShell>
  );
}

export function GoalPlanPanel({
  data,
  platform,
  approved,
  isApproving = false,
  onApprove,
  onBack,
}: {
  data?: SocialGrowthResponse | null;
  platform: string;
  approved: boolean;
  isApproving?: boolean;
  onApprove: () => void;
  onBack: () => void;
}) {
  const actions = data?.strategy?.strategy || [];
  const pillars = data?.content_plan?.pillars || [];
  const schedule = data?.platform_strategies?.[platform]?.posting_schedule;
  const opportunities = data?.strategy?.opportunities_used || [];

  return (
    <PanelShell
      title="Measurable plan"
      description="Weekly targets, content themes, posting frequency, and experiments — approve to put Fluenca to work."
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="h-10 rounded-full px-4"
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={onApprove}
            disabled={isApproving || approved}
          >
            {isApproving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Approving…
              </>
            ) : approved ? (
              <>
                <CheckCircle2 className="size-4" />
                Plan approved
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Approve plan
              </>
            )}
          </Button>
        </div>
      }
    >
      {schedule ? (
        <div className="grid gap-2 sm:grid-cols-3">
          <StatCard label="Reels / week" value={String(schedule.reels_per_week)} />
          <StatCard
            label="Carousels / week"
            value={String(schedule.carousels_per_week)}
          />
          <StatCard
            label="Stories"
            value={schedule.stories_daily ? "Daily" : "As needed"}
          />
        </div>
      ) : null}

      {pillars.length ? (
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
            Content themes
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {pillars.map((pillar, index) => (
              <li
                key={`${pillar.name}-${index}`}
                className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-3.5"
              >
                <p className="text-[13px] font-semibold text-neutral-900">
                  {pillar.name}
                </p>
                {pillar.description ? (
                  <p className="mt-1 text-[12px] leading-5 text-neutral-600">
                    {pillar.description}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {actions.length ? (
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
            Required actions
          </p>
          <ul className="space-y-2">
            {actions.map((action, index) => (
              <li
                key={`${action.objective}-${index}`}
                className="rounded-2xl border border-[#E6E8F5] p-3.5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#ECEBFF] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-[#5B57E6]">
                    {action.platform || "All"}
                  </span>
                  {action.kpi ? (
                    <span className="text-[11px] text-neutral-500">
                      KPI · {action.kpi}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-[13px] font-semibold text-neutral-900">
                  {action.objective}
                </p>
                {action.why ? (
                  <p className="mt-1 text-[12px] leading-5 text-neutral-600">
                    {action.why}
                  </p>
                ) : null}
                {action.actions?.length ? (
                  <ul className="mt-2 space-y-1">
                    {action.actions.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-[12px] text-neutral-700"
                      >
                        <ArrowRight className="mt-0.5 size-3 shrink-0 text-[#5B57E6]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-[#E6E8F5] px-3 py-4 text-center text-[13px] text-neutral-500">
          No strategy actions returned for this run.
        </p>
      )}

      {opportunities.length ? (
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
            <Lightbulb className="size-3.5 text-[#047857]" />
            Experiments
          </p>
          <ul className="space-y-2">
            {opportunities.map((item, index) => (
              <li
                key={`${item.opportunity}-${index}`}
                className="rounded-xl border border-[#D1FAE5] bg-[#F7FFFB] px-3 py-2.5"
              >
                <p className="text-[13px] font-semibold text-neutral-900">
                  {item.opportunity}
                </p>
                {item.reason ? (
                  <p className="mt-1 text-[12px] text-neutral-600">{item.reason}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </PanelShell>
  );
}
