"use client";

import type { ReactNode } from "react";
import Card from "@/components/shared/card";

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function CompetitorsChartCard({ title, description, children }: Props) {
  return (
    <Card className="p-5">
      <div className="mb-4">
        <h3 className="text-[15px] font-semibold text-neutral-900">{title}</h3>
        {description ? <p className="mt-1 text-[13px] text-neutral-500">{description}</p> : null}
      </div>
      {children}
    </Card>
  );
}
