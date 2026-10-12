"use client";

import GoalsWizard from "@/components/dashboard/goals/GoalsWizard";
import TopBar from "@/components/dashboard/topBar";
import useAuthStore from "@/store/AuthsStore";

export default function GoalsPage() {
  const companyName = useAuthStore((s) => s.company_name);

  return (
    <main className="min-w-0 space-y-4 pb-6">
      {/* <TopBar
        user={{ name: companyName || "User" }}
        placeholder="Search goals..."
      /> */}
      <GoalsWizard />
    </main>
  );
}
