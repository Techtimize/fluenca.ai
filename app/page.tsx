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
import { LandingHero } from "@/components/landing-hero";
import { ComingSoonPage } from "./coming-soon/ComingSoonPage";

export default function Home() {
  return (
    <ComingSoonPage/>
    // <div className="flex min-h-dvh flex-col overflow-x-clip bg-white">
    //   <main className="relative z-10 flex flex-1 flex-col bg-white">
    //   <LandingHero
    //       eyebrow="Say the goal. Get the plan."
    //       titleLead="Your "
    //       titleHighlight="AI agents"
    //       titleTail=" study your competitors and write your next win."
    //       description="Set your goal and let AI agents analyze what’s working across your market. Get ready-to-use insights, content, and campaigns without the guesswork."
    //       imageSrc="/assets/flowcircle.svg"
    //       imageAlt="Fluenca workflow diagram connecting research, planning, publishing, analytics, and content creation agents."
    //       actions={[
    //         { label: "Get Started", href: "/signup", variant: "primary" },
    //         { label: "Sign Up Now", href: "/signup", variant: "secondary" },
    //       ]}
    //     />
    //     <HowItWorks />
    //     <WhyFluenca />
    //     <HowFluencaThinks />
    //     <CaseStudiesSection />
    //     <TestimonialsSection />
    //     <FaqSection />
    //     <FaqCtaSection />
    //   </main>
    //   <FooterSection />
    // </div>
  );
}
