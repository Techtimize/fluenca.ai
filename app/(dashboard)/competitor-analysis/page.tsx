import { redirect } from "next/navigation";
import { PAGE_ROUTES } from "@/constant/page-routes";

export default function CompetitorAnalysisPage() {
  redirect(PAGE_ROUTES.COMPETITOR_ANALYSIS_AI);
}
