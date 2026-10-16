import { SiteHeader } from "@/components/site-header";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
