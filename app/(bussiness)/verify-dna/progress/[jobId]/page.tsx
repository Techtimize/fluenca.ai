"use client";

import { useParams, useRouter } from "next/navigation";
import IntelligenceProgress from "@/components/onboarding/IntelligenceProgress";
import { PAGE_ROUTES } from "@/constant/page-routes";

export default function IntelligenceProgressPage() {
  const router = useRouter();
  const { jobId } = useParams<{ jobId: string }>();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F8FF] px-4 pb-16 pt-4 sm:pt-6">
      <div className="pointer-events-none absolute -left-32 -top-32 size-112 rounded-full bg-[#C7CBFF]/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-1/3 size-104 rounded-full bg-[#E4D4FF]/50 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(84,82,246,0.08)_1px,transparent_0)] bg-size-[22px_22px] mask-[linear-gradient(to_bottom,black,transparent_70%)]" />

      <IntelligenceProgress
        jobId={jobId}
        onReady={() => router.replace(PAGE_ROUTES.DASHBOARD)}
        onFailed={() => router.replace(PAGE_ROUTES.DNA)}
      />
    </main>
  );
}
