import { SiteHeader } from "@/components/site-header";
import { OfficeHero } from "@/components/herosection/office-hero";
import MeetThePipeline from "@/components/landing/meet-the-pipeline";
import HowItWorks from "@/components/landing/how-it-works";
import WhyFluenca from "@/components/landing/why-fluenca";
import HowFluencaThinks from "@/components/landing/how-fluenca-thinks";
import FaqSection from "@/components/landing/faq-section";
import TestimonialsSection from "@/components/landing/testimonials-section";
import CaseStudiesSection from "@/components/landing/case-studies-section";
import FaqCtaSection from "@/components/landing/faq-cta-section";
import FooterSection from "@/components/landing/footer-section";

const navigationItems = [
  { label: "Agents", href: "/agents", hasMenu: true },
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
  { label: "Use case", href: "/use-cases" },
] as const;

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip bg-white">
      <SiteHeader
        navigationItems={navigationItems}
        signupHref="/signup"
        signupLabel="Sign up"
        variant="light"
      />
      <div className="relative h-[calc(100dvh-5.5rem)] min-h-[calc(100svh-5.5rem)] shrink-0 sm:h-[calc(100dvh-6rem)] sm:min-h-[calc(100svh-6rem)] lg:h-[calc(100dvh-6.5rem)] lg:min-h-[calc(100svh-6.5rem)]">
        <OfficeHero />
      </div>
      <main className="relative z-10 flex flex-1 flex-col bg-white">
        <MeetThePipeline />
        <HowItWorks />
        <WhyFluenca />
        <HowFluencaThinks />
        <CaseStudiesSection />
        <TestimonialsSection />
        <FaqSection />
        <FaqCtaSection />
      </main>
      <FooterSection />
    </div>
  );
}
