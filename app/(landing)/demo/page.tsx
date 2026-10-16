import type { Metadata } from "next";
import {
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import DashboardPreview from "@/components/landing/demo/DashboardPreview";
import DemoRequestForm from "@/components/landing/demo/DemoRequestForm";

export const metadata: Metadata = {
  title: "Book a Demo",
  description:
    "Get a personalized walkthrough of Fluenca's AI-powered marketing platform.",
};

const HIGHLIGHTS = ["Personalized demo", "No commitment", "Expert guidance"];

const FEATURES = [
  {
    title: "Goal-Driven Strategy",
    body: "Set your business goals and get a customized 30-day plan tailored to your industry and audience.",
    icon: Target,
  },
  {
    title: "AI-Powered Content",
    body: "Generate high-quality posts, blogs, and campaigns that match your brand voice and audience.",
    icon: Sparkles,
  },
  {
    title: "Smart Execution",
    body: "Schedule, publish, and manage your content across multiple channels with ease.",
    icon: CalendarCheck,
  },
  {
    title: "Real Performance Insights",
    body: "Track what's working, get actionable recommendations, and improve over time.",
    icon: BarChart3,
  },
  {
    title: "Built for Teams",
    body: "Collaborate, get approvals, and keep everyone aligned on your marketing goals.",
    icon: Users,
  },
];

export default function DemoPage() {
  return (
    // Negative top margin pulls the background under the floating navbar (72px, 76px on md+)
    <main className="relative -mt-[72px] overflow-x-clip bg-[linear-gradient(180deg,#F7F7FF_0%,#FFFFFF_60%)] pt-[72px] md:-mt-[76px] md:pt-[76px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 size-[520px] rounded-full bg-[#ECEBFF]/60 blur-3xl"
      />

      <section className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12 lg:pt-16">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#ECEBFF] px-3 py-1 text-[13px] font-medium text-[#5B57E6]">
            <span className="size-1.5 rounded-full bg-[#5B57E6]" aria-hidden="true" />
            See Fluenca in Action
          </span>
          <h1 className="mt-5 text-[34px] font-bold leading-[1.15] tracking-tight text-[#14123A] sm:text-[44px]">
            Book a Demo and See How Fluenca Can Grow Your Brand
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-7 text-neutral-600">
            Get a personalized walkthrough of Fluenca&apos;s AI-powered marketing platform and
            discover how it can help you plan, create, and execute content that drives real
            business results.
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-neutral-700">
                <CheckCircle2 className="size-4.5 text-[#5B57E6]" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <DashboardPreview />
          </div>
        </div>

        <div className="min-w-0 lg:pt-2">
          <DemoRequestForm />
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5B57E6]">
            Why Fluenca
          </p>
          <h2 className="mt-3 text-[26px] font-bold tracking-tight text-[#14123A] sm:text-[32px]">
            Everything You Need to Grow, Powered by AI
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[15px] text-neutral-500">
            From strategy to execution, Fluenca helps you turn your marketing goals into
            measurable results.
          </p>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {FEATURES.map(({ title, body, icon: Icon }) => (
            <li
              key={title}
              className="rounded-2xl border border-[#E6E8F5] bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)]"
            >
              <span className="grid size-11 place-items-center rounded-full bg-[#F1F0FF] text-[#5B57E6]">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-[15px] font-semibold text-neutral-900">{title}</h3>
              <p className="mt-2 text-[13px] leading-5 text-neutral-500">{body}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
