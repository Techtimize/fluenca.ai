"use client";

import { CompetitorsPageClient } from "@/components/dashboard/competitors/CompetitorsPageClient";
import TopBar from "@/components/dashboard/topBar";
import useAuthStore from "@/store/AuthsStore";

export default function CompetitorsDashboardPage() {
  const companyName = useAuthStore((s) => s.company_name);

  return (
    <main className="min-w-0 space-y-4">
      <TopBar
        user={{ name: companyName || "User" }}
        placeholder="Search competitors..."
      />
      <CompetitorsPageClient />
    </main>
  );
}
