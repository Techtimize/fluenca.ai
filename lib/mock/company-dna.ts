import type { AnalyzeCompanyDna } from "@/types/bussiness/analyzecompany-type";

export type CompanyDnaPageData = {
  company: {
    name: string;
    industry: string;
    region: string;
    website: string;
    tagline: string;
    logoSrc: string;
  };
  summary: string;
  dna: AnalyzeCompanyDna;
  snapshot: {
    companyType: string;
    marketPosition: string;
    businessMaturity: string;
    digitalPresenceScore: number;
  };
};


export const MOCK_COMPANY_DNA: CompanyDnaPageData = {
  company: {
    name: "Techtimize",
    industry: "Software / AI Engineering",
    region: "GCC & MENA",
    website: "https://techtimize.co",
    tagline: "AI · NATIVE ENGINEERING",
    logoSrc: "/assets/techtimize-logo.png",
  },
  summary:
    "Techtimize is an AI-native engineering partner that designs and ships full-stack products, cloud systems, and workflow automation for GCC and MENA businesses — with deep local compliance and AWS Bahrain expertise.",
  dna: {
    services: [
      "AI integrations",
      "Full-stack web products",
      "Cloud architecture",
      "Workflow automation",
      "MVP delivery",
      "Enterprise platforms",
    ],
    keywords: [
      "AI-native",
      "engineering partner",
      "GCC",
      "MENA",
      "AWS Bahrain",
      "PDPL",
      "NCA ECC",
      "MVP in 4 weeks",
    ],
    technologies: [
      "Next.js",
      "React",
      "Node.js",
      "Python",
      "AWS",
      "OpenAI",
      "PostgreSQL",
      "Docker",
    ],
    target_audience: [
      "Growth-stage startups in GCC",
      "Mid-market FinTech companies",
      "Enterprises modernizing legacy workflows",
      "Founders needing fast MVP delivery",
    ],
    positioning:
      "The AI-native engineering partner for GCC & MENA — combining product speed with regional compliance depth.",
    value_proposition:
      "Ship production-ready AI and software products in weeks, not quarters, with teams that already understand PDPL, NCA ECC, and AWS Bahrain deployments.",
    business_model: "B2B services — project-based and retained engineering partnerships",
    pricing: [
      "Project-based delivery",
      "Retainer engineering pods",
      "MVP packages (~4 weeks)",
      "Enterprise custom quotes",
    ],
    industries: ["FinTech", "SaaS", "Healthcare tech", "E-commerce", "Government-adjacent"],
    pain_points: [
      "Slow agency delivery cycles",
      "Limited AI implementation talent in-region",
      "Compliance uncertainty for cloud workloads",
      "Fragmented vendor stacks across product and infra",
    ],
    differentiators: [
      "Average MVP delivery in four weeks",
      "Deep GCC/MENA regulatory fluency",
      "AWS Bahrain (me-south-1) specialization",
      "AI-first product and engineering practice",
      "End-to-end from discovery to production",
    ],
  },
  snapshot: {
    companyType: "B2B engineering services",
    marketPosition: "Specialist challenger",
    businessMaturity: "Growth",
    digitalPresenceScore: 78,
  },
};
