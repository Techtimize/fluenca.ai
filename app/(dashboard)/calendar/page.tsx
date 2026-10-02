"use client";
import Link from "next/link";
import { CalendarDays, Lightbulb, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import CompetitorNinetyDayCalendar from "@/components/dashboard/competitors/CompetitorNinetyDayCalendar";
import SidebarRail, { DASHBOARD_CONTENT_OFFSET } from "@/components/dashboard/sidebarRail";
import TopBar from "@/components/dashboard/topBar";
import Card from "@/components/shared/card";
import { getApiErrorMessage } from "@/errors/error-utils";
import { CompetitorAnalysisCompetitorQuery } from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";
import { getCompanyIdProvider } from "@/provider/auth-provider";
import { ContentRecommendationMutation } from "@/routes/bussiness/Bussiness-Mutation";


export default function CalendarPage() {
  const companyId = useAuthStore((s) => s.company_id);
  const companyName = useAuthStore((s) => s.company_name);
  const { data, isLoading, isError, error, isFetching } =
    CompetitorAnalysisCompetitorQuery(companyId);
  const { mutate: recommend, isPending: isRecommending } = ContentRecommendationMutation();
  const handleRecommend = () => {
    const company_id = getCompanyIdProvider();
    if (!company_id) {
      toast.error("Company ID is missing. Please log in again.");
      return;
    }
    recommend({ company_id });
  };
  const plan = data?.result?.report?.["90_day_action_plan"];
  const hasPlan = Boolean(
    plan &&
      ((plan.days_0_30?.length ?? 0) > 0 ||
        (plan.days_31_60?.length ?? 0) > 0 ||
        (plan.days_61_90?.length ?? 0) > 0 ||
        (plan.all_actions?.length ?? 0) > 0 ||
        plan.summary),
  );
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,#E4E8FF_0%,#FFFFFF_50%)]">
      <SidebarRail />
      <div className={DASHBOARD_CONTENT_OFFSET}>
        <main className="min-w-0 space-y-4">
          <TopBar
            user={{ name: companyName || "User" }}
            placeholder="Search calendar..."
          />
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-neutral-900">90-day plan calendar</h1>
              <p className="mt-1 text-sm text-neutral-500">
                Scheduled initiatives from your latest competitor analysis.
              </p>
            </div>
            <button
              type="button"
              onClick={handleRecommend}
              disabled={isRecommending}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-[#5B57E6] px-4 text-sm font-medium text-white hover:bg-[#4A46D0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRecommending ? <Loader2 className="size-4 animate-spin" /> : <Lightbulb className="size-4" />}
              {isRecommending ? "Recommending..." : "Recommend"}
            </button>
          </div>
          {!companyId ? (
            <Card className="border-amber-200 bg-amber-50/80 p-5">
              <p className="text-sm text-amber-800">
                Company ID is missing. Complete company analysis first, then return here.
              </p>
            </Card>
          ) : null}
          {companyId && (isLoading || isFetching) && !data ? (
            <Card className="flex items-center justify-center gap-3 p-12 text-neutral-500">
              <Loader2 className="size-5 animate-spin text-[#5B57E6]" />
              <span className="text-sm">Loading your action plan…</span>
            </Card>
          ) : null}
          {companyId && isError ? (
            <Card className="border-rose-200 bg-rose-50/80 p-5">
              <p className="text-sm text-rose-800">
                {getApiErrorMessage(error, "Failed to load calendar plan")}
              </p>
            </Card>
          ) : null}
          {companyId && !isLoading && !isError && hasPlan && plan ? (
            <CompetitorNinetyDayCalendar plan={plan} startDate={data?.created_at} />
          ) : null}
          {companyId && !isLoading && !isFetching && !isError && !hasPlan ? (
            <Card className="relative overflow-hidden p-0">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#ECEBFF_0%,transparent_55%)]"
              />
              <div className="relative mx-auto flex max-w-lg flex-col items-center px-6 py-14 text-center sm:py-16">
                <span className="grid size-14 place-items-center rounded-3xl bg-[#ECEBFF] text-[#5B57E6] shadow-[0_8px_24px_rgba(91,87,230,0.18)]">
                  <CalendarDays className="size-6" aria-hidden="true" />
                </span>
                <h2 className="mt-5 text-lg font-semibold text-neutral-900">No plan available</h2>
                <p className="mt-2 text-[14px] leading-6 text-neutral-500">
                  You haven&apos;t run competitor analysis yet, or this run didn&apos;t return a
                  90-day action plan. Run the agent to generate a calendar of platform-specific
                  moves.
                </p>
                <Link
                  href="/competitor-analysis"
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#5B57E6] px-5 text-sm font-medium text-white hover:bg-[#4A46D0]"
                >
                  <Sparkles className="size-4" />
                  Run competitor analysis
                </Link>
              </div>
            </Card>
          ) : null}
        </main>
      </div>
    </div>
  );
}
