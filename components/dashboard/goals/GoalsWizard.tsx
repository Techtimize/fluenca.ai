"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import GoalStepRail from "@/components/dashboard/goals/GoalStepRail";
import {
  GoalDiagnosePanel,
  GoalExecutePanel,
  GoalOptimizePanel,
  GoalPlanPanel,
} from "@/components/dashboard/goals/GoalResultPanels";
import { FacebookIcon } from "@/components/shared/brandIcons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/errors/error-utils";
import {
  GOAL_DURATIONS,
  GOAL_METRICS,
  GOAL_PLATFORMS,
  buildGoalPrompt,
  isGoalFormValid,
  type GoalFormValues,
  type GoalMetric,
  type GoalPlatform,
} from "@/lib/goals/goal-form";
import { normalizeSocialGrowthResponse } from "@/lib/goals/normalize-growth";
import { SocialGrowthMutation } from "@/routes/bussiness/Bussiness-Mutation";
import type { SocialGrowthResponse } from "@/types/bussiness/socail-growth-type";
import { FOCUS_RING } from "@/utils/ui-classes";

const INITIAL_FORM: GoalFormValues = {
  platform: "instagram",
  metric: "followers",
  currentValue: "",
  targetValue: "",
  durationDays: 90,
};

export default function GoalsWizard() {
  const [step, setStep] = useState(1);
  const [maxReached, setMaxReached] = useState(1);
  const [form, setForm] = useState<GoalFormValues>(INITIAL_FORM);
  const [result, setResult] = useState<SocialGrowthResponse | null>(null);
  const [planApproved, setPlanApproved] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(
    () => new Set(),
  );

  const { mutate: runGrowth, isPending } = SocialGrowthMutation();

  const selectedMetric = useMemo(
    () => GOAL_METRICS.find((item) => item.id === form.metric),
    [form.metric],
  );

  const goTo = (next: number) => {
    setStep(next);
    setMaxReached((prev) => Math.max(prev, next));
  };

  const handleDiagnose = () => {
    if (!isGoalFormValid(form)) {
      toast.error("Enter a valid current value, higher target, and deadline.");
      return;
    }

    const prompt = buildGoalPrompt(form);
    goTo(2);
    runGrowth(prompt, {
      onSuccess: (response) => {
        const normalized = normalizeSocialGrowthResponse(response);
        if (!normalized) {
          toast.error("Received an empty growth plan. Try again.");
          setStep(1);
          return;
        }
        if (normalized.needs_user_input && normalized.clarification_questions?.length) {
          toast.message(normalized.clarification_questions[0]);
        }
        setResult(normalized);
        toast.success("Diagnosis ready — review your situation.");
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, "Failed to diagnose goal"));
        setStep(1);
      },
    });
  };

  const handleApprovePlan = () => {
    setPlanApproved(true);
    goTo(4);
    toast.success("Plan approved. Track execution below.");
  };

  const handleRestart = () => {
    setForm(INITIAL_FORM);
    setResult(null);
    setPlanApproved(false);
    setCompletedTasks(new Set());
    setStep(1);
    setMaxReached(1);
  };

  const toggleTask = (key: string) => {
    setCompletedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="min-w-0 space-y-4">
      <GoalStepRail
        currentStep={step}
        maxReached={maxReached}
        onSelect={(next: number) => {
          if (next === 3 && !result) return;
          if (next === 4 && !planApproved && next > step) return;
          if (next >= 2 && !result && !isPending) return;
          setStep(next);
        }}
      />

      {step === 1 ? (
        <section className="overflow-hidden rounded-2xl border border-[#E6E8F5] bg-white sm:rounded-3xl">
          <div className="border-b border-[#EEF0F8] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_55%)] px-4 py-4 sm:px-6 sm:py-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5B57E6]">
              Step 1
            </p>
            <h2 className="mt-1 text-[18px] font-semibold tracking-tight text-neutral-900">
              Set your goal
            </h2>
            <p className="mt-1 max-w-2xl text-[13px] leading-5 text-neutral-500">
              Choose a platform, metric, target, and deadline. Examples: grow
              Instagram from 10K to 15K followers in 90 days, or lift LinkedIn
              engagement from 2% to 4%.
            </p>
          </div>

          <div className="space-y-5 p-4 sm:p-6">
            <div>
              <p className="mb-2 text-[12px] font-medium text-neutral-600">
                Platform
              </p>
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                {GOAL_PLATFORMS.map((platform) => {
                  const active = form.platform === platform.id;
                  return (
                    <li key={platform.id}>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            platform: platform.id as GoalPlatform,
                          }))
                        }
                        className={`${FOCUS_RING} flex w-full items-center gap-2 rounded-2xl border px-3 py-3 text-left transition-colors ${
                          active
                            ? "border-[#5B57E6] bg-[#F6F5FF]"
                            : "border-[#E6E8F5] bg-white hover:bg-[#F8F9FF]"
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
                  );
                })}
              </ul>
            </div>

            <div>
              <p className="mb-2 text-[12px] font-medium text-neutral-600">
                Metric
              </p>
              <ul className="grid gap-2 sm:grid-cols-3">
                {GOAL_METRICS.map((metric) => {
                  const active = form.metric === metric.id;
                  return (
                    <li key={metric.id}>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            metric: metric.id as GoalMetric,
                          }))
                        }
                        className={`${FOCUS_RING} w-full rounded-2xl border px-3.5 py-3 text-left transition-colors ${
                          active
                            ? "border-[#5B57E6] bg-[#F6F5FF]"
                            : "border-[#E6E8F5] bg-white hover:bg-[#F8F9FF]"
                        }`}
                      >
                        <span className="block text-[13px] font-semibold text-neutral-900">
                          {metric.label}
                        </span>
                        <span className="mt-1 block text-[12px] leading-4 text-neutral-500">
                          {metric.hint}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="min-w-0 space-y-1.5">
                <span className="text-[12px] font-medium text-neutral-600">
                  Current {selectedMetric?.unit || "value"}
                </span>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder={
                    form.metric === "engagement_rate" ? "2" : "10000"
                  }
                  value={form.currentValue}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      currentValue: e.target.value,
                    }))
                  }
                  className="h-11 rounded-full border-[#E6E8F5] bg-white px-4"
                />
              </label>
              <label className="min-w-0 space-y-1.5">
                <span className="text-[12px] font-medium text-neutral-600">
                  Target {selectedMetric?.unit || "value"}
                </span>
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
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      targetValue: e.target.value,
                    }))
                  }
                  className="h-11 rounded-full border-[#E6E8F5] bg-white px-4"
                />
              </label>
            </div>

            <div>
              <p className="mb-2 text-[12px] font-medium text-neutral-600">
                Deadline
              </p>
              <ul className="flex flex-wrap gap-2">
                {GOAL_DURATIONS.map((item) => {
                  const active = form.durationDays === item.days;
                  return (
                    <li key={item.days}>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            durationDays: item.days,
                          }))
                        }
                        className={`${FOCUS_RING} rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
                          active
                            ? "border-[#5B57E6] bg-[#5B57E6] text-white"
                            : "border-[#E6E8F5] bg-white text-neutral-700 hover:bg-[#F8F9FF]"
                        }`}
                      >
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#EEF0F8] bg-[#FCFCFF] px-4 py-3 sm:px-6">
            <p className="text-[12px] text-neutral-500">
              Fluenca will diagnose, plan, and track this goal end-to-end.
            </p>
            <Button
              type="button"
              disabled={isPending || !isGoalFormValid(form)}
              onClick={handleDiagnose}
              
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              Diagnose & plan
            </Button>
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <GoalDiagnosePanel
          form={form}
          data={result}
          isLoading={isPending || !result}
          onContinue={() => goTo(3)}
        />
      ) : null}

      {step === 3 ? (
        <GoalPlanPanel
          data={result}
          approved={planApproved}
          onApprove={handleApprovePlan}
          onBack={() => setStep(2)}
        />
      ) : null}

      {step === 4 ? (
        <GoalExecutePanel
          data={result}
          completedTasks={completedTasks}
          onToggleTask={toggleTask}
          onContinue={() => goTo(5)}
          onBack={() => setStep(3)}
        />
      ) : null}

      {step === 5 ? (
        <GoalOptimizePanel
          data={result}
          form={form}
          onRestart={handleRestart}
          onBack={() => setStep(4)}
        />
      ) : null}
    </div>
  );
}
