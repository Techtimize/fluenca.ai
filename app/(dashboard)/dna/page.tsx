"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  Crosshair,
  Dna,
  Globe2,
  Layers3,
  Sparkles,
  Target,
  Users,
  Wrench,
} from "lucide-react";
import TopBar from "@/components/dashboard/topBar";
import Card from "@/components/shared/card";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { MOCK_COMPANY_DNA } from "@/lib/mock/company-dna";
import { MOCK_DASHBOARD } from "@/lib/mock/dashboard";
import { FOCUS_RING } from "@/utils/ui-classes";
import { AnalyzeCompanyResultsApi } from "@/routes/bussiness/bussiness.routes";
import useAuthStore from "@/store/AuthsStore";
import { AnalyzeCompanyResultsQuery } from "@/routes/bussiness/Bussiness-Query";

type DnaSection = {
  id: string;
  title: string;
  icon: typeof Dna;
};

const SECTIONS: DnaSection[] = [
  { id: "overview", title: "DNA overview", icon: Dna },
  { id: "positioning", title: "Positioning", icon: Crosshair },
  { id: "audience", title: "Audience", icon: Users },
  { id: "services", title: "Services & tech", icon: Wrench },
  { id: "market", title: "Market signals", icon: Layers3 },
  { id: "differentiators", title: "Differentiators", icon: Sparkles },
];

function Chip({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-[#E6E8F5] bg-[#F6F7FD] px-3 py-1 text-[12px] text-neutral-700">
      {children}
    </span>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card className="p-5 sm:p-6">
      <h3 className="text-[15px] font-semibold text-neutral-900">{title}</h3>
      {description ? (
        <p className="mt-1 text-[13px] leading-5 text-neutral-500">{description}</p>
      ) : null}
      <div className="mt-4">{children}</div>
    </Card>
  );
}

export default function DnaPage() {
  const data = MOCK_COMPANY_DNA;
  const [activeId, setActiveId] = useState(SECTIONS[0].id);

  const tagCount = useMemo(
    () =>
      data.dna.services.length +
      data.dna.keywords.length +
      data.dna.technologies.length +
      data.dna.target_audience.length +
      data.dna.differentiators.length,
    [data.dna],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting);
        if (hit) setActiveId(hit.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const { company_user_id }: { company_user_id: string } = useAuthStore();
  const { data: analyzeCompanyResults } = AnalyzeCompanyResultsQuery(company_user_id);

  return (
    <main className="min-w-0">
          <TopBar user={MOCK_DASHBOARD.user} placeholder="Search company DNA..." />

          <div className="grid w-full gap-4 lg:grid-cols-[320px_1fr]">
            <aside className="rounded-3xl border border-[#E6E8F5] bg-white/80 p-5 backdrop-blur lg:sticky lg:top-6 lg:self-start">
              <div className="flex items-start gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-[#ECEBFF] text-[#5B57E6]">
                  <Dna className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h1 className="text-base font-semibold text-neutral-900">Company DNA</h1>
                  <p className="mt-1 text-xs leading-5 text-neutral-500">
                    Distilled positioning, audience, and offer signals from your analysis.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={data.company.logoSrc}
                    alt={`${data.company.name} logo`}
                    width={120}
                    height={36}
                    className="h-9 w-auto object-contain"
                  />
                </div>
                <p className="mt-3 text-[13px] font-semibold text-neutral-900">
                  {data.company.name}
                </p>
                <p className="mt-0.5 text-[11px] uppercase tracking-[0.08em] text-[#5B57E6]">
                  {data.company.tagline}
                </p>
                <ul className="mt-3 flex flex-col gap-1.5 text-[12px] text-neutral-600">
                  <li className="flex items-center gap-2">
                    <Building2 className="size-3.5 text-neutral-400" aria-hidden="true" />
                    {data.company.industry}
                  </li>
                  <li className="flex items-center gap-2">
                    <Globe2 className="size-3.5 text-neutral-400" aria-hidden="true" />
                    {data.company.region}
                  </li>
                  <li className="flex items-center gap-2">
                    <Target className="size-3.5 text-neutral-400" aria-hidden="true" />
                    {tagCount} DNA signals
                  </li>
                </ul>
              </div>

              <nav aria-label="DNA sections" className="mt-4">
                <ul className="flex flex-col gap-1">
                  {SECTIONS.map((section) => {
                    const active = section.id === activeId;
                    const Icon = section.icon;
                    return (
                      <li key={section.id}>
                        <button
                          type="button"
                          onClick={() => scrollTo(section.id)}
                          aria-current={active ? "true" : undefined}
                          className={`flex w-full items-center gap-2.5 border-l-2 px-2.5 py-2.5 text-left text-[13px] transition-colors ${FOCUS_RING} ${
                            active
                              ? "border-[#5B57E6] font-medium text-[#5B57E6]"
                              : "border-transparent text-neutral-700 hover:text-neutral-950"
                          }`}
                        >
                          <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                          <span>{section.title}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <Link
                href={PAGE_ROUTES.COMPANY_OVERVIEW}
                className={`mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#E6E8F5] bg-white text-sm font-medium text-neutral-800 hover:bg-[#F6F7FD] ${FOCUS_RING}`}
              >
                Open company overview
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </aside>

            <div className="flex min-w-0 flex-col gap-4">
              <section id="overview" className="scroll-mt-8">
                <Card className="overflow-hidden p-0">
                  <div className="bg-gradient-to-r from-[#2E2A9E] to-[#5B57E6] px-5 py-6 text-white sm:px-6">
                    <p className="text-[12px] uppercase tracking-[0.12em] text-white/70">
                      Value proposition
                    </p>
                    <h2 className="mt-2 max-w-3xl text-xl font-semibold leading-snug sm:text-2xl">
                      {data.dna.value_proposition}
                    </h2>
                    <p className="mt-3 max-w-2xl text-[13px] leading-6 text-white/80">
                      {data.summary}
                    </p>
                  </div>
                  <ul className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
                    {[
                      { label: "Company type", value: data.snapshot.companyType },
                      { label: "Market position", value: data.snapshot.marketPosition },
                      { label: "Maturity", value: data.snapshot.businessMaturity },
                      {
                        label: "Digital presence",
                        value: `${data.snapshot.digitalPresenceScore}/100`,
                      },
                    ].map((item) => (
                      <li
                        key={item.label}
                        className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] px-4 py-3"
                      >
                        <p className="text-[11px] text-neutral-500">{item.label}</p>
                        <p className="mt-1 text-[13px] font-semibold text-neutral-900">
                          {item.value}
                        </p>
                      </li>
                    ))}
                  </ul>
                </Card>
              </section>

              <section id="positioning" className="scroll-mt-8">
                <div className="grid gap-4 lg:grid-cols-2">
                  <SectionCard
                    title="Positioning"
                    description="How the brand should show up in market conversations."
                  >
                    <p className="text-[13px] leading-6 text-neutral-700">
                      {data.dna.positioning}
                    </p>
                    <p className="mt-4 text-[12px] font-medium text-neutral-500">
                      Business model
                    </p>
                    <p className="mt-1 text-[13px] leading-6 text-neutral-800">
                      {data.dna.business_model}
                    </p>
                  </SectionCard>

                  <SectionCard
                    title="Pricing signals"
                    description="Commercial patterns detected from public materials."
                  >
                    <ul className="flex flex-wrap gap-2">
                      {data.dna.pricing.map((item) => (
                        <li key={item}>
                          <Chip>{item}</Chip>
                        </li>
                      ))}
                    </ul>
                  </SectionCard>
                </div>
              </section>

              <section id="audience" className="scroll-mt-8">
                <div className="grid gap-4 lg:grid-cols-2">
                  <SectionCard
                    title="Target audience"
                    description="Who the company is optimized to win."
                  >
                    <ul className="flex flex-col gap-2">
                      {data.dna.target_audience.map((item) => (
                        <li
                          key={item}
                          className="rounded-2xl border border-[#E6E8F5] bg-white px-4 py-3 text-[13px] text-neutral-800"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </SectionCard>

                  <SectionCard
                    title="Industries served"
                    description="Vertical focus inferred from services and case signals."
                  >
                    <ul className="flex flex-wrap gap-2">
                      {data.dna.industries.map((item) => (
                        <li key={item}>
                          <Chip>{item}</Chip>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 text-[12px] font-medium text-neutral-500">
                      Keywords
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {data.dna.keywords.map((item) => (
                        <li key={item}>
                          <Chip>{item}</Chip>
                        </li>
                      ))}
                    </ul>
                  </SectionCard>
                </div>
              </section>

              <section id="services" className="scroll-mt-8">
                <div className="grid gap-4 lg:grid-cols-2">
                  <SectionCard title="Core services">
                    <ul className="flex flex-wrap gap-2">
                      {data.dna.services.map((item) => (
                        <li key={item}>
                          <Chip>{item}</Chip>
                        </li>
                      ))}
                    </ul>
                  </SectionCard>

                  <SectionCard title="Technologies">
                    <ul className="flex flex-wrap gap-2">
                      {data.dna.technologies.map((item) => (
                        <li key={item}>
                          <Chip>{item}</Chip>
                        </li>
                      ))}
                    </ul>
                  </SectionCard>
                </div>
              </section>

              <section id="market" className="scroll-mt-8">
                <SectionCard
                  title="Customer pain points"
                  description="Problems this company is positioned to solve."
                >
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {data.dna.pain_points.map((item) => (
                      <li
                        key={item}
                        className="rounded-2xl border border-[#E6E8F5] bg-[#FFF8F5] px-4 py-3 text-[13px] text-neutral-800"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </SectionCard>
              </section>

              <section id="differentiators" className="scroll-mt-8">
                <SectionCard
                  title="What makes them different"
                  description="Proof points that should carry into messaging and content."
                >
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {data.dna.differentiators.map((item, index) => (
                      <li
                        key={item}
                        className="flex gap-3 rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] px-4 py-4"
                      >
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#ECEBFF] text-[12px] font-semibold text-[#5B57E6]">
                          {index + 1}
                        </span>
                        <p className="text-[13px] leading-5 text-neutral-800">{item}</p>
                      </li>
                    ))}
                  </ul>
                </SectionCard>
              </section>
            </div>
          </div>
        </main>
  );
}
