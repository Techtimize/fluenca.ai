export type PlanId = "growth" | "accelerator" | "command";

export interface PlanUsage {
  label: string;
  used: number;
  limit: number;
}

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  features: readonly string[];
  note: string;
  usage: readonly PlanUsage[];
  cta: string;
  href: string;
  popular?: boolean;
}

export const plans: readonly Plan[] = [
  {
    id: "growth",
    name: "Growth",
    description:
      "Post on your connected social media and increase your social media presence.",
    features: [
      "Connect your social media accounts",
      "Create and schedule posts",
      "Grow your audience with AI suggestions",
      "Track basic performance insights",
      "Access to all AI agents",
    ],
    note: "Perfect for individuals and small businesses looking to build their online presence.",
    usage: [
      { label: "Company Analysis", used: 7, limit: 10 },
      { label: "Manual Competitor Analysis", used: 3, limit: 10 },
      { label: "AI Competitor Analysis", used: 5, limit: 10 },
      { label: "Script Generation", used: 42, limit: 100 },
      { label: "Image Generation", used: 18, limit: 50 },
    ],
    cta: "Get Started",
    href: "/signup",
  },
  {
    id: "accelerator",
    name: "Accelerator",
    description:
      "Scale your marketing efforts and reach a wider audience, faster.",
    features: [
      "Everything in Growth",
      "Post on multiple social media platforms",
      "Advanced AI content suggestions",
      "Higher usage limits for all AI agents",
      "Priority processing for faster results",
      "Save and reuse your best content",
    ],
    note: "Ideal for growing businesses and marketing teams that need more reach and efficiency.",
    usage: [
      { label: "Company Analysis", used: 30, limit: 30 },
      { label: "Manual Competitor Analysis", used: 30, limit: 30 },
      { label: "AI Competitor Analysis", used: 30, limit: 30 },
      { label: "Script Generation", used: 500, limit: 500 },
      { label: "Image Generation", used: 200, limit: 200 },
    ],
    cta: "Upgrade Plan",
    href: "/signup?plan=accelerator",
    popular: true,
  },
  {
    id: "command",
    name: "Command",
    description:
      "Run your marketing at scale with full control and advanced features.",
    features: [
      "Everything in Accelerator",
      "Unlimited social media posting",
      "Advanced analytics & detailed reports",
      "Team collaboration & multiple workspaces",
      "API access & custom integrations",
      "Dedicated support",
    ],
    note: "Built for agencies and high-volume teams that need complete control and flexibility.",
    usage: [
      { label: "Company Analysis", used: 100, limit: 100 },
      { label: "Manual Competitor Analysis", used: 100, limit: 100 },
      { label: "AI Competitor Analysis", used: 100, limit: 100 },
      { label: "Script Generation", used: 1000, limit: 1000 },
      { label: "Image Generation", used: 500, limit: 500 },
    ],
    cta: "Upgrade Plan",
    href: "/signup?plan=command",
  },
];

// Static for now. Later, replace the body with a real call to your agents/API.
export async function getPlans(): Promise<readonly Plan[]> {
  return plans;
}