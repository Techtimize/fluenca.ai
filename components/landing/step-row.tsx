// components/landing/step-row.tsx
import type { ReactNode } from "react";
import LayersIcon from "@/components/shared/layers-icon";
import VisualCard from "@/components/shared/visual-card";

type StepRowProps = {
  title: string;
  text: string;
  visual: ReactNode;
  reverse?: boolean; // put the visual on the left
};

export default function StepRow({ title, text, visual, reverse = false }: StepRowProps) {
  return (
    <div className="grid items-center gap-6 md:grid-cols-2 md:gap-16">
      <div className={`max-w-sm ${reverse ? "md:order-2" : ""}`}>
        <LayersIcon />
        <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
      </div>
      <VisualCard>{visual}</VisualCard>
    </div>
  );
}