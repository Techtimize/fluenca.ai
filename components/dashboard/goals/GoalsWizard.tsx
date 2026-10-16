"use client";

import { useState } from "react";
import { toast } from "sonner";
import GoalSetupForm from "@/components/dashboard/goals/GoalSetupForm";
import GoalStepRail from "@/components/dashboard/goals/GoalStepRail";
import { GoalDiagnosePanel, GoalPlanPanel } from "@/components/dashboard/goals/GoalResultPanels";
import {
  buildCreateGoalRequest,
  createInitialGoalForm,
  getGoalFormError,
  goalToForm,
  type GoalFormValues,
} from "@/lib/goals/goal-form";
import { normalizeSocialGrowthResponse } from "@/lib/goals/normalize-growth";
import {
  ApproveGoalMutation,
  CreateGoalMutation,
  DiagnoseGoalMutation,
} from "@/routes/bussiness/Bussiness-Mutation";
import type { GoalDetailResponse, GoalStatus } from "@/types/bussiness/goal-type";
import type { SocialGrowthResponse } from "@/types/bussiness/socail-growth-type";

const APPROVED_STATUSES: GoalStatus[] = ["active", "paused", "completed", "failed"];

/** Wizard state for reopening a saved goal at the step it has reached. */
function stateFromGoal(detail: GoalDetailResponse) {
  const form = goalToForm(detail.goal);
  const result = normalizeSocialGrowthResponse(detail.growth_result);
  const approved =
    Boolean(detail.goal.approved_at) ||
    APPROVED_STATUSES.includes(detail.goal.status);
  const step = result ? 3 : 1;
  return {
    form,
    result,
    approved,
    step,
    goal: { id: detail.goal.id, formKey: JSON.stringify(form) },
  };
}

type Props = {
  /** A saved goal to reopen; omit to set a new one. */
  initialGoal?: GoalDetailResponse | null;
};

export default function GoalsWizard({ initialGoal }: Props) {
  const [initial] = useState(() =>
    initialGoal ? stateFromGoal(initialGoal) : null,
  );
  const [step, setStep] = useState(initial?.step ?? 1);
  const [maxReached, setMaxReached] = useState(initial?.step ?? 1);
  const [form, setForm] = useState<GoalFormValues>(
    () => initial?.form ?? createInitialGoalForm(),
  );
  const [result, setResult] = useState<SocialGrowthResponse | null>(
    initial?.result ?? null,
  );
  const [planApproved, setPlanApproved] = useState(initial?.approved ?? false);

  // The goal created for the current form; reused when re-diagnosing an unchanged form.
  const [goal, setGoal] = useState<{ id: string; formKey: string } | null>(
    initial?.goal ?? null,
  );

  const { mutateAsync: createGoal, isPending: isCreating } =
    CreateGoalMutation();
  const { mutate: diagnoseGoal, isPending: isDiagnosing } =
    DiagnoseGoalMutation();
  const { mutate: approveGoal, isPending: isApproving } = ApproveGoalMutation();

  const isPending = isCreating || isDiagnosing;

  const goTo = (next: number) => {
    setStep(next);
    setMaxReached((prev) => Math.max(prev, next));
  };

  const handleDiagnose = async () => {
    const formError = getGoalFormError(form);
    if (formError) {
      toast.error(formError);
      return;
    }

    const formKey = JSON.stringify(form);
    let goalId = goal?.formKey === formKey ? goal.id : null;
    goTo(2);

    if (!goalId) {
      try {
        const created = await createGoal(buildCreateGoalRequest(form));
        goalId = created.goal_id;
        setGoal({ id: goalId, formKey });
      } catch {
        setStep(1);
        return;
      }
    }

    diagnoseGoal(goalId, {
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
      onError: () => setStep(1),
    });
  };

  const handleApprovePlan = () => {
    if (planApproved || !goal) return;
    approveGoal(goal.id, { onSuccess: () => setPlanApproved(true) });
  };

  return (
    <div className="min-w-0 space-y-4">
      <GoalStepRail
        currentStep={step}
        maxReached={maxReached}
        onSelect={(next: number) => {
          if (next === 3 && !result) return;
          if (next >= 2 && !result && !isPending) return;
          setStep(next);
        }}
      />

      {step === 1 ? (
        <GoalSetupForm
          form={form}
          onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
          onSubmit={handleDiagnose}
          isPending={isPending}
        />
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
          platform={form.platform}
          approved={planApproved}
          isApproving={isApproving}
          onApprove={handleApprovePlan}
          onBack={() => setStep(2)}
        />
      ) : null}
    </div>
  );
}
