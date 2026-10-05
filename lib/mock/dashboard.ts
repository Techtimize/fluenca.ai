import type { DashboardData } from "@/types/dashboard";
import { PAGE_ROUTES } from "@/constant/page-routes";

// Temporary data. Delete this file once the API is connected.
// Image paths point to files inside /public/assets.
export const MOCK_DASHBOARD: DashboardData = {
  user: { name: "User" },
  company: {
    name: "Techtimize",
    tagline: "AI · NATIVE ENGINEERING",
    logoSrc: "/assets/techtimize-logo.png",
    tags: ["AI-Native Engineering", "FinTech", "B2B service provider"],
    description:
      "Techtimize is an engineering services partner that designs and delivers AI integrations, full-stack web products, cloud architecture, and workflow automation. Clients engage the team to build everything from MVPs to enterprise platforms, with a stated average MVP delivery time of four weeks. The firm specializes in the GCC and MENA region, with deep expertise in local regulatory compliance (PDPL, NCA ECC) and AWS Bahrain (me-south-1) deployments.",
    links: [
      { id: "web", label: "techtimze.co", iconSrc: "/assets/icons/globe.png" },
      { id: "instagram", label: "techtimze.pk", iconSrc: "/assets/icons/instagram.png" },
      { id: "facebook", label: "techtimze.pk", iconSrc: "/assets/icons/facebook.png" },
    ],
    competitors: [
      { id: "tkxel", name: "tkxel.com", logoSrc: "/assets/competitors/tkxel.png" },
      { id: "devsinc", name: "devsinc.com", logoSrc: "/assets/competitors/devsinc.png" },
      { id: "systemltd", name: "systemltd.com", logoSrc: "/assets/competitors/systemltd.png" },
    ],
  },
  docs: [
    { id: "company", title: "Company Information", subtitle: "Detail our ai agents collected", icon: "file", href: PAGE_ROUTES.COMPANY_OVERVIEW },
    { id: "marketing", title: "Marketing Position", subtitle: "Strong technical expertise, broad focus.", icon: "megaphone", href: PAGE_ROUTES.DNA },
    { id: "pain", title: "Pain Points", subtitle: "Growth and development gaps.", icon: "layers", href: PAGE_ROUTES.DNA },
    { id: "competitors", title: "Competitors Analytics", subtitle: "Growth and development gaps.", icon: "chart", href: PAGE_ROUTES.COMPETITOR_ANALYSIS },
  ],
  analyticsSources: [
    { id: "website", label: "Website" },
    { id: "instagram", label: "Instagram" },
    { id: "linkedin", label: "LinkedIn" },
  ],
  analytics: {
    metrics: [
      { id: "accessibility", label: "Accessibility", score: 92, change: "12.75%", icon: "accessibility", tone: "green" },
      { id: "performance", label: "Performance", score: 75, change: "10.00%", icon: "performance", tone: "orange" },
      { id: "best-practices", label: "Best Practices", score: 75, change: "25.01%", icon: "best-practices", tone: "purple" },
      { id: "seo", label: "SEO", score: 75, change: "12.75%", icon: "seo", tone: "teal" },
    ],
    overall: { summary: "Your website is performing well overall", score: 80.5, mobile: 65, desktop: 94 },
    integrations: [
      { id: "ga", title: "Google Analytics", subtitle: "Traffic & Behavior", logoSrc: "/assets/integrations/google-analytics.png", previewColor: "linear-gradient(#F5A623,#E08A0B)", locked: true },
      { id: "gsc", title: "Search console", subtitle: "Search ranking", logoSrc: "/assets/integrations/search-console.png", previewColor: "linear-gradient(#B9B6F5,#DAD8FA)", locked: true },
    ],
    vitals: [
      {
        id: "mobile",
        title: "Core Web Vitals (Mobile)",
        summary: "Your website is performing well overall",
        vitals: [
          { id: "lcp", label: "LCP", value: "0.8s", status: "good" },
          { id: "fcp", label: "FCP", value: "0.8s", status: "needs" },
          { id: "tbt", label: "TBT", value: "0.8s", status: "poor" },
          { id: "cls", label: "CLS", value: "0.8s", status: "good" },
        ],
      },
      {
        id: "desktop",
        title: "Core Web Vitals (Desktop)",
        summary: "Your website is performing well overall",
        vitals: [
          { id: "lcp", label: "LCP", value: "0.8s", status: "good" },
          { id: "fcp", label: "FCP", value: "0.8s", status: "needs" },
          { id: "tbt", label: "TBT", value: "0.8s", status: "poor" },
          { id: "cls", label: "CLS", value: "0.8s", status: "good" },
        ],
      },
    ],
  },
};