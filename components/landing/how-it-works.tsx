// components/landing/how-it-works.tsx
import type { ReactNode } from "react";
import StepRow from "@/components/landing/step-row";
import CompanyFormMockup from "@/components/landing/mockups/company-form-mockup";
import InsightsMockup from "@/components/landing/mockups/insights-mockup";
import AnalyticsMockup from "@/components/landing/mockups/analytics-mockup";
import ScoreMockup from "@/components/landing/mockups/score-mockup";
import {
  HOW_IT_WORKS_HEADING as H,
  HOW_IT_WORKS_STEPS,
  type StepVisual,
} from "@/constant/how-it-works";

const visuals: Record<StepVisual, ReactNode> = {
  "company-form": <CompanyFormMockup />,
  insights: <InsightsMockup />,
  analytics: <AnalyticsMockup />,
  score: <ScoreMockup />,
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-start gap-6 md:grid-cols-2 md:gap-16">
          <h2 className="max-w-xs text-xl font-medium leading-snug text-slate-800 md:text-2xl">
            {H.left}
          </h2>
          <h2 className="text-3xl font-semibold leading-tight text-indigo-500 md:text-4xl">
            {H.rightStart} <span className="text-slate-900">{H.rightBold1}</span>
            <br />
            {H.rightMid} <span className="text-slate-900">{H.rightBold2}</span>
          </h2>
        </div>

        <div className="mt-12 flex flex-col gap-10 md:mt-16 md:gap-16">
          {HOW_IT_WORKS_STEPS.map((s) => (
            <StepRow key={s.title} title={s.title} text={s.text} visual={visuals[s.visual]} />
          ))}
        </div>
      </div>
    </section>
  );
}