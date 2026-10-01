"use client";

import { Sparkles } from "lucide-react";
import Card from "@/components/shared/card";

type Props = {
  insights: string[];
};

export function CompetitorsAIInsights({ insights }: Props) {
  return (
    <Card className="h-full p-5">
      <div className="flex items-center gap-2">
        <span className="grid size-9 place-items-center rounded-xl bg-[#ECEBFF] text-[#5B57E6]">
          <Sparkles className="size-4" />
        </span>
        <div>
          <h3 className="text-[15px] font-semibold text-neutral-900">AI insights</h3>
          <p className="text-[12px] text-neutral-500">Priority takeaways from this run</p>
        </div>
      </div>

      {insights.length ? (
        <ul className="mt-4 space-y-3">
          {insights.map((insight, index) => (
            <li
              key={`${insight.slice(0, 24)}-${index}`}
              className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-3 text-[13px] leading-5 text-neutral-700"
            >
              {insight}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-[13px] text-neutral-500">No insights yet.</p>
      )}
    </Card>
  );
}
