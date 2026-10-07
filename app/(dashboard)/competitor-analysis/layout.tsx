import CompetitorAnalysisShell from "@/components/dashboard/competitors/CompetitorAnalysisShell";

export default function CompetitorAnalysisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CompetitorAnalysisShell>{children}</CompetitorAnalysisShell>;
}
