import { LandingHero } from "@/components/landing-hero";
import { SiteHeader } from "@/components/site-header";
import HowItWorks from "@/components/landing/how-it-works"; // NEW
import { ComingSoonPage } from "./coming-soon/ComingSoonPage";
import WhyFluenca from "@/components/landing/why-fluenca";
import HowFluencaThinks from "@/components/landing/how-fluenca-thinks";
import FaqSection from "@/components/landing/faq-section";
import TestimonialsSection from "@/components/landing/testimonials-section";
import CaseStudiesSection from "@/components/landing/case-studies-section";
import FaqCtaSection from "@/components/landing/faq-cta-section";
<FaqCtaSection arcsSrc="/assets/faq-arcs.svg" />
import FooterSection from "@/components/landing/footer-section";

const navigationItems = [
  { label: "Agents", href: "/agents", hasMenu: true },
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
  { label: "Use case", href: "/use-cases" },
] as const;

export default function Home() {
  return (
    // <ComingSoonPage />
    <div className="flex min-h-screen flex-col bg-[radial-gradient(ellipse_at_15%_100%,rgba(219,224,255,0.7)_0%,rgba(255,255,255,0)_42%)]">
      <SiteHeader
        navigationItems={navigationItems}
        signupHref="/signup"
        signupLabel="Sign up"
      />
      <main className="flex flex-1 flex-col">
        <LandingHero
          eyebrow="Say the goal. Get the plan."
          titleLead="Your "
          titleHighlight="AI agents"
          titleTail=" study your competitors and write your next win."
          description="Set your goal and let AI agents analyze what’s working across your market. Get ready-to-use insights, content, and campaigns without the guesswork."
          imageSrc="/assets/flowcircle.svg"
          imageAlt="Fluenca workflow diagram connecting research, planning, publishing, analytics, and content creation agents."
          actions={[
            { label: "Get Started", href: "/signup", variant: "primary" },
            { label: "Sign Up Now", href: "/signup", variant: "secondary" },
          ]}
        />
        <HowItWorks />
        <WhyFluenca />
        <HowFluencaThinks />
        <FaqSection />
        <TestimonialsSection />
        <CaseStudiesSection />
        <FaqCtaSection />
      </main>
      <FooterSection />
    </div>
  );
}