"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import GoalSetupForm from "@/components/dashboard/goals/GoalSetupForm";
import GoalStepRail from "@/components/dashboard/goals/GoalStepRail";
import {
  GoalDiagnosePanel,
  GoalExecutePanel,
  GoalPlanPanel,
} from "@/components/dashboard/goals/GoalResultPanels";
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
  UpdateGoalTaskMutation,
} from "@/routes/bussiness/Bussiness-Mutation";
import { GoalByIdQuery } from "@/routes/bussiness/Bussiness-Query";
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
  const step = approved ? 4 : result ? 3 : 1;
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
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(
    () => new Set(),
  );

  // The goal created for the current form; reused when re-diagnosing an unchanged form.
  const [goal, setGoal] = useState<{ id: string; formKey: string } | null>(
    initial?.goal ?? null,
  );

  const { mutateAsync: createGoal, isPending: isCreating } =
    CreateGoalMutation();
  const { mutate: diagnoseGoal, isPending: isDiagnosing } =
    DiagnoseGoalMutation();
  const { mutate: approveGoal, isPending: isApproving } = ApproveGoalMutation();
  const { mutate: updateTask } = UpdateGoalTaskMutation();
  const { data: goalDetail } = GoalByIdQuery(planApproved ? goal?.id : null);

  const isPending = isCreating || isDiagnosing;

  // After approval the goal holds live tasks and measured progress.
  const liveResult = useMemo(() => {
    if (!planApproved || !goalDetail) return result;
    const growth =
      normalizeSocialGrowthResponse(goalDetail.growth_result) || result;
    if (!growth) return null;
    return {
      ...growth,
      tasks: goalDetail.tasks?.length ? goalDetail.tasks : growth.tasks,
      goal_progress: goalDetail.goal_progress || growth.goal_progress,
      goal_status: goalDetail.goal?.status || growth.goal_status,
    };
  }, [planApproved, goalDetail, result]);

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
    if (planApproved) {
      goTo(4);
      return;
    }
    if (!goal) return;
    approveGoal(goal.id, {
      onSuccess: () => {
        setPlanApproved(true);
        goTo(4);
      },
    });
  };

  const handleRestart = () => {
    setForm(createInitialGoalForm());
    setResult(null);
    setGoal(null);
    setPlanApproved(false);
    setCompletedTasks(new Set());
    setStep(1);
    setMaxReached(1);
  };

  const toggleTask = (key: string, done: boolean) => {
    setCompletedTasks((prev) => {
      const next = new Set(prev);
      if (done) next.add(key);
      else next.delete(key);
      return next;
    });

    const isLiveTask = liveResult?.tasks?.some((task) => task.id === key);
    if (!goal || !isLiveTask) return;
    updateTask({
      goal_id: goal.id,
      task_id: key,
      status: done ? "done" : "pending",
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

      {step === 4 ? (
        <GoalExecutePanel
          data={liveResult}
          completedTasks={completedTasks}
          onToggleTask={toggleTask}
          onRestart={handleRestart}
          onBack={() => setStep(3)}
        />
      ) : null}
    </div>
  );
}
