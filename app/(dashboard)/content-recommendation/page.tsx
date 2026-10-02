"use client";

import { Loader2 } from "lucide-react";
import ContentRecommendations from "@/components/dashboard/contentRecommendations";
import SidebarRail, { DASHBOARD_CONTENT_OFFSET } from "@/components/dashboard/sidebarRail";
import TopBar from "@/components/dashboard/topBar";
import Card from "@/components/shared/card";
import { getApiErrorMessage } from "@/errors/error-utils";
import useAuthStore from "@/store/AuthsStore";
import { ContentRecommendationResultQuery } from "@/routes/bussiness/Bussiness-Query";

export default function ContentRecommendationPage() {
  const companyId = useAuthStore((s) => s.company_id);
  const companyName = useAuthStore((s) => s.company_name);
  const { data, isLoading, isError, error } = ContentRecommendationResultQuery(companyId);

return (
<div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,#E4E8FF_0%,#FFFFFF_50%)]">
      <SidebarRail />

      <div className={DASHBOARD_CONTENT_OFFSET}>
        <main className="min-w-0 space-y-4">
          <TopBar user={{ name: companyName || "User" }} placeholder="Search recommendations..." />

          <div>
            <h1 className="text-xl font-semibold text-neutral-900">Content recommendation</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Content ideas and plans generated for your company.
            </p>
          </div>

          {!companyId ? (
            <Card className="border-amber-200 bg-amber-50/80 p-5">
              <p className="text-sm text-amber-800">Company ID is missing. Please log in again.</p>
            </Card>
          ) : null}

          {companyId && isLoading ? (
            <Card className="flex items-center justify-center gap-3 p-12 text-neutral-500">
              <Loader2 className="size-5 animate-spin text-[#5B57E6]" />
              <span className="text-sm">Loading recommendations…</span>
            </Card>
          ) : null}

          {companyId && isError ? (
            <Card className="border-rose-200 bg-rose-50/80 p-5">
              <p className="text-sm text-rose-800">
                {getApiErrorMessage(error, "Failed to load content recommendations")}
              </p>
            </Card>
          ) : null}

          {data ? <ContentRecommendations data={data} /> : null}
        </main>
      </div>
    </div>
  );
}