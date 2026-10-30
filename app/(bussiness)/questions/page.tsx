"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import IntakeQuestions from "@/components/onboarding/IntakeQuestions";
import { PAGE_ROUTES } from "@/constant/page-routes";

/* ---------- Top bar ---------- */
function TopBar() {
  const router = useRouter();

  // Opened directly (no history), there is nothing to go back to, so fall back to the dashboard.
  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push(PAGE_ROUTES.DASHBOARD);
  };

  return (
    <header className="py-5">
      <div className="flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/Logo.svg" alt="" className="size-7" />
        <span className="text-lg font-semibold tracking-wide text-neutral-900">
          FLUENCA
        </span>
      </div>

      <button
        type="button"
        onClick={goBack}
        className="group mt-5 inline-flex items-center gap-2 rounded-full py-1 pe-3 text-sm font-medium text-neutral-600 transition-colors hover:text-[#5B57E6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B57E6]/40"
      >
        <span className="grid size-8 place-items-center rounded-full border border-[#E6E8F5] bg-white shadow-sm transition-colors group-hover:border-[#D7D5FF] group-hover:bg-[#F3F2FF]">
          <ArrowLeft
            className="size-4 transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
        </span>
        Back
      </button>
    </header>
  );
}

export default function QuestionsPage() {
  const router = useRouter();

  // Answers are saved one by one as they're edited, so completing only leaves the page.
  const handleComplete = () => router.push(PAGE_ROUTES.DASHBOARD);

  return (
    <main className="mx-auto w-full max-w-7xl min-w-0 px-4 pb-10 sm:px-6 lg:px-10">
      <TopBar />
      <IntakeQuestions onComplete={handleComplete} />
    </main>
  );
}
