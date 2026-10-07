// constant/how-it-works.ts
// Plain data only. Edit the text here without touching any component.
export type StepVisual = "company-form" | "insights" | "analytics" | "score";

export const HOW_IT_WORKS_HEADING = {
  left: "Let AI Understand Your Business First",
  rightStart: "From",
  rightBold1: "Business Data",
  rightMid: "to",
  rightBold2: "Marketing Intelligence",
};

export const HOW_IT_WORKS_STEPS: { title: string; text: string; visual: StepVisual }[] = [
  {
    title: "Tell us about your company",
    text: "Add your website, industry, products or services, and language. Fluenca.ai will research your business and build your Company DNA from streams you confirm.",
    visual: "company-form",
  },
  {
    title: "Review Your Business Insights",
    text: "Our AI agents research your business and prepare key insights for review. Refine the information if needed, then unlock deeper analytics, recommendations, and personalized suggestions for your goals.",
    visual: "insights",
  },
  {
    title: "Turn Insights Into Marketing That Works",
    text: "Explore your analytics, set your goals, and let Fluenca's AI agents turn your business intelligence into action. Create blogs, case studies, social content, campaigns, and more all tailored to your business and goals.",
    visual: "analytics",
  },
  {
    title: "From Your Goals to Great Content",
    text: "Get a personalized content plan based on your goals, then preview, schedule, and publish content that moves your business forward.",
    visual: "score",
  },
];