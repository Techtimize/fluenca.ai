"use client";

import { ControlsPageContent } from "@/components/dashboard/content-execution/ControlsPage";
import useAuthStore from "@/store/AuthsStore";

export default function ControlsPage() {
  const companyId = useAuthStore((s) => s.company_id);

  return (
    <main className="min-w-0 space-y-4 pb-6">
      <ControlsPageContent companyId={companyId} />
    </main>
  );
}
