"use client";

import GoalCard from "@/components/dashboard/goals/GoalCard";
import { CompanyGoalsQuery } from "@/routes/bussiness/Bussiness-Query";
import type { Goal, GoalStatus } from "@/types/bussiness/goal-type";

const HIDDEN_STATUSES: GoalStatus[] = ["cancelled"];

/** The list comes newest first; show the latest goal that hasn't been cancelled. */
function pickCurrentGoal(goals?: Goal[]) {
  return goals?.find((goal) => !HIDDEN_STATUSES.includes(goal.status));
}

type Props = {
  onOpen: (goalId: string) => void;
};

export default function CurrentGoalSummary({ onOpen }: Props) {
  const { data: goals } = CompanyGoalsQuery();
  const goal = pickCurrentGoal(goals);
  if (!goal) return null;
  return <GoalCard goal={goal} label="Current goal" onOpen={onOpen} className="mt-4" />;
}
