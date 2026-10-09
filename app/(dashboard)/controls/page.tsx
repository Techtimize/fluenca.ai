"use client";

import { ControlsPageContent } from "@/components/dashboard/content-execution/ControlsPage";
import TopBar from "@/components/dashboard/topBar";
import useAuthStore from "@/store/AuthsStore";

export default function ControlsPage() {
  const companyId = useAuthStore((s) => s.company_id);
  const companyName = useAuthStore((s) => s.company_name);

  return (
    <main className="min-w-0 space-y-4 pb-6">
      <TopBar
        user={{ name: companyName || "User" }}
        placeholder="Search controls..."
      />
      <ControlsPageContent companyId={companyId} />
    </main>
  );
}
