"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { Check, Loader2, Sparkles } from "lucide-react";
import { FacebookIcon } from "@/components/shared/brandIcons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  GOAL_DURATIONS,
  GOAL_METRICS,
  GOAL_MODES,
  GOAL_PLATFORMS,
  GOAL_TASK_TYPES,
  MAX_POSTS_PER_WEEK,
  MIN_GOAL_DAYS,
  buildGoalPrompt,
  deadlineInDays,
  getGoalFormError,
  summarizeGoal,
  type GoalFormValues,
} from "@/lib/goals/goal-form";
import { FOCUS_RING } from "@/utils/ui-classes";

const CHIP_ACTIVE = "border-[#5B57E6] bg-[#F6F5FF]";
const CHIP_IDLE = "border-[#E6E8F5] bg-white hover:bg-[#F8F9FF]";
const FIELD_CLASS = "h-11 rounded-full border-[#E6E8F5] bg-white px-4";
const TEXTAREA_CLASS = "rounded-2xl border-[#E6E8F5] bg-white px-4 py-3";

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="text-[12px] font-medium text-neutral-600">{title}</p>
      {hint ? (
        <p className="mt-0.5 text-[11px] text-neutral-400">{hint}</p>
      ) : null}
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block min-w-0 space-y-1.5">
      <span className="text-[12px] font-medium text-neutral-600">{label}</span>
      {children}
      {hint ? (
        <span className="block text-[11px] text-neutral-400">{hint}</span>
      ) : null}
    </label>
  );
}

type Props = {
  form: GoalFormValues;
  onChange: (patch: Partial<GoalFormValues>) => void;
  onSubmit: () => void;
  isPending: boolean;
};

export default function GoalSetupForm({
  form,
  onChange,
  onSubmit,
  isPending,
}: Props) {
  const metric = GOAL_METRICS.find((item) => item.id === form.metric);
  const error = getGoalFormError(form);

  const toggleTaskType = (id: GoalFormValues["allowedTaskTypes"][number]) => {
    const selected = form.allowedTaskTypes.includes(id);
    onChange({
      allowedTaskTypes: selected
        ? form.allowedTaskTypes.filter((item) => item !== id)
        : [...form.allowedTaskTypes, id],
    });
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-[#E6E8F5] bg-white sm:rounded-3xl">
      <div className="border-b border-[#EEF0F8] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_55%)] px-4 py-4 sm:px-6 sm:py-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5B57E6]">
          Step 1
        </p>
        <h2 className="mt-1 text-[18px] font-semibold tracking-tight text-neutral-900">
          Set your goal
        </h2>
        <p className="mt-1 max-w-2xl text-[13px] leading-5 text-neutral-500">
          Choose a platform, metric, target, and deadline, then set the rules
          Fluenca works within.
        </p>
      </div>

      <div className="space-y-6 p-4 sm:p-6">
        <Section title="Goal for">
          <ul className="grid gap-2 sm:grid-cols-2">
            {GOAL_MODES.map((mode) => (
              <li key={mode.id}>
                <button
                  type="button"
                  onClick={() => onChange({ mode: mode.id })}
                  className={`${FOCUS_RING} w-full rounded-2xl border px-3.5 py-3 text-left transition-colors ${
                    form.mode === mode.id ? CHIP_ACTIVE : CHIP_IDLE
                  }`}
                >
                  <span className="block text-[13px] font-semibold text-neutral-900">
                    {mode.label}
                  </span>
                  <span className="mt-0.5 block text-[12px] text-neutral-500">
                    {mode.hint}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Platform">
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {GOAL_PLATFORMS.map((platform) => (
              <li key={platform.id}>
                <button
                  type="button"
                  onClick={() => onChange({ platform: platform.id })}
                  className={`${FOCUS_RING} flex w-full items-center gap-2 rounded-2xl border px-3 py-3 text-left transition-colors ${
                    form.platform === platform.id ? CHIP_ACTIVE : CHIP_IDLE
                  }`}
                >
                  <span className="grid size-8 place-items-center rounded-xl bg-[#F6F7FD] ring-1 ring-[#E6E8F5]">
                    {platform.id === "facebook" ? (
                      <FacebookIcon className="size-4 text-[#1877F2]" />
                    ) : platform.iconSrc ? (
                      <Image
                        src={platform.iconSrc}
                        alt=""
                        width={16}
                        height={16}
                        className="size-4 object-contain"
                      />
                    ) : null}
                  </span>
                  <span className="truncate text-[13px] font-medium text-neutral-900">
                    {platform.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Metric">
          <ul className="grid gap-2 sm:grid-cols-3">
            {GOAL_METRICS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onChange({ metric: item.id })}
                  className={`${FOCUS_RING} w-full rounded-2xl border px-3.5 py-3 text-left transition-colors ${
                    form.metric === item.id ? CHIP_ACTIVE : CHIP_IDLE
                  }`}
                >
                  <span className="block text-[13px] font-semibold text-neutral-900">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-[12px] leading-4 text-neutral-500">
                    {item.hint}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Section>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={`Current ${metric?.unit || "value"} (baseline)`}>
            <Input
              type="text"
              inputMode="decimal"
              placeholder={form.metric === "engagement_rate" ? "2" : "10000"}
              value={form.currentValue}
              onChange={(e) => onChange({ currentValue: e.target.value })}
              className={FIELD_CLASS}
            />
          </Field>
          <Field label={`Target ${metric?.unit || "value"}`}>
            <Input
              type="text"
              inputMode="decimal"
              placeholder={
                form.metric === "engagement_rate"
                  ? "4"
                  : form.metric === "leads"
                    ? "50"
                    : "15000"
              }
              value={form.targetValue}
              onChange={(e) => onChange({ targetValue: e.target.value })}
              className={FIELD_CLASS}
            />
          </Field>
        </div>

        <Section
          title="Deadline"
          hint={`At least ${MIN_GOAL_DAYS} days from today.`}
        >
          <div className="flex flex-wrap items-center gap-2">
            {GOAL_DURATIONS.map((item) => {
              const date = deadlineInDays(item.days);
              const active = form.deadline === date;
              return (
                <button
                  key={item.days}
                  type="button"
                  onClick={() => onChange({ deadline: date })}
                  className={`${FOCUS_RING} rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
                    active
                      ? "border-[#5B57E6] bg-[#5B57E6] text-white"
                      : "border-[#E6E8F5] bg-white text-neutral-700 hover:bg-[#F8F9FF]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <Input
              type="date"
              aria-label="Deadline date"
              min={deadlineInDays(MIN_GOAL_DAYS)}
              value={form.deadline}
              onChange={(e) => onChange({ deadline: e.target.value })}
              className="h-10 w-auto rounded-full border-[#E6E8F5] bg-white px-4"
            />
          </div>
        </Section>

        <div className="grid gap-3">
          <Field label="Objective" hint="Leave blank to use the summary shown.">
            <Input
              type="text"
              placeholder={summarizeGoal(form)}
              value={form.objective}
              onChange={(e) => onChange({ objective: e.target.value })}
              className={FIELD_CLASS}
            />
          </Field>
          <Field
            label="Description"
            hint="Context for the agent. Leave blank to send an auto-generated brief."
          >
            <Textarea
              rows={3}
              placeholder={buildGoalPrompt(form)}
              value={form.description}
              onChange={(e) => onChange({ description: e.target.value })}
              className={TEXTAREA_CLASS}
            />
          </Field>
        </div>

        <div className="space-y-4 rounded-2xl border border-[#E6E8F5] bg-[#FCFCFF] p-4">
          <div>
            <p className="text-[13px] font-semibold text-neutral-900">
              Constraints
            </p>
            <p className="mt-0.5 text-[12px] text-neutral-500">
              The limits Fluenca works within while executing this goal.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Posts per week" hint={`0–${MAX_POSTS_PER_WEEK}`}>
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                max={MAX_POSTS_PER_WEEK}
                step={1}
                value={form.postsPerWeek}
                onChange={(e) => onChange({ postsPerWeek: e.target.value })}
                className={FIELD_CLASS}
              />
            </Field>
            <Field label="Budget (USD)" hint="0 means organic only.">
              <Input
                type="number"
                inputMode="decimal"
                min={0}
                value={form.budgetUsd}
                onChange={(e) => onChange({ budgetUsd: e.target.value })}
                className={FIELD_CLASS}
              />
            </Field>
          </div>

          <div className="flex items-start justify-between gap-3 rounded-2xl border border-[#E6E8F5] bg-white px-3.5 py-3">
            <div>
              <p className="text-[13px] font-medium text-neutral-900">
                Approve everything
              </p>
              <p className="mt-0.5 text-[12px] text-neutral-500">
                {form.approveEverything
                  ? "Every task waits for your approval before it runs."
                  : "Fluenca runs routine tasks without asking first."}
              </p>
            </div>
            <Switch
              aria-label="Approve everything"
              checked={form.approveEverything}
              onCheckedChange={(checked) =>
                onChange({ approveEverything: checked })
              }
              className="mt-1"
            />
          </div>

          <Section title="Allowed task types">
            <ul className="flex flex-wrap gap-2">
              {GOAL_TASK_TYPES.map((item) => {
                const active = form.allowedTaskTypes.includes(item.id);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleTaskType(item.id)}
                      className={`${FOCUS_RING} flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors ${
                        active
                          ? "border-[#5B57E6] bg-[#F6F5FF] text-[#5B57E6]"
                          : "border-[#E6E8F5] bg-white text-neutral-600 hover:bg-[#F8F9FF]"
                      }`}
                    >
                      {active ? <Check className="size-3.5" /> : null}
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </Section>

          <Field label="Notes" hint="Anything the agent should avoid or keep in mind.">
            <Textarea
              rows={2}
              placeholder="e.g. No giveaways, keep the tone professional"
              value={form.notes}
              onChange={(e) => onChange({ notes: e.target.value })}
              className={TEXTAREA_CLASS}
            />
          </Field>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#EEF0F8] bg-[#FCFCFF] px-4 py-3 sm:px-6">
        <p
          className={`text-[12px] ${error ? "text-[#BE123C]" : "text-neutral-500"}`}
          aria-live="polite"
        >
          {error || "Fluenca will diagnose, plan, and track this goal end-to-end."}
        </p>
        <Button type="button" disabled={isPending || !!error} onClick={onSubmit}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          Diagnose & plan
        </Button>
      </div>
    </section>
  );
}
