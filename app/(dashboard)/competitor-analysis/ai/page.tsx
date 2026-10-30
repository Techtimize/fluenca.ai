"use client";

import AllCompetitorsSection from "@/components/dashboard/competitors/AllCompetitorsSection";
import useAuthStore from "@/store/AuthsStore";

export default function CompetitorAnalysisAiPage() {
  const companyId = useAuthStore((s) => s.company_id);
  return (
    <div className="min-w-0 space-y-4">
      {companyId ? <AllCompetitorsSection companyId={companyId} /> : null}
    </div>
  );
}
