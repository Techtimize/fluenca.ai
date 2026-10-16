import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Check, FileText, Image as ImageIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getPlans } from "@/constant/plans";
import FooterSection from "@/components/landing/footer-section";

export const metadata: Metadata = {
  title: "Plans",
  description: "Simple plans to grow your brand with AI.",
};

/* Only these usage rows are shown, with their icons */
const usageIcons: Record<string, LucideIcon> = {
  "Company Analysis": Building2,
  "Script Generation": FileText,
  "Image Generation": ImageIcon,
};

const formatNumber = (n: number) => n.toLocaleString("en-US");

export default async function PlansPage() {
  const plans = await getPlans();

  return (
    <>
      <main className="relative overflow-hidden bg-linear-to-b from-white via-[#FAF8FF] to-[#F1ECFF]">
        {/* Soft purple glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-0 size-[420px] rounded-full bg-[#E9E2FF]/70 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-48 size-[420px] rounded-full bg-[#F0EAFF]/80 blur-3xl"
        />

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-14 pt-8 sm:px-6 sm:pt-10 md:px-8 lg:px-10 lg:pb-16 lg:pt-12">
          {/* Intro */}
          <div className="flex flex-col items-center text-center">
            <h1 className="mt-0 font-display text-[30px] font-semibold leading-[38px] text-[#2B1B63] sm:text-[40px] sm:leading-[48px] md:text-[48px] md:leading-[56px] lg:text-[52px] lg:leading-[60px]">
              Power Your Marketing,{" "}
              <span className="bg-linear-to-r from-[#6D45E8] to-[#A78BFA] bg-clip-text text-transparent">
                Your Way
              </span>
            </h1>
          </div>

          {/* Plan cards: identical width, height, border and shadow */}
          <div className="mx-auto mt-8 grid max-w-[1180px] grid-cols-1 gap-6 sm:mt-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {plans.map((plan, index) => {
              /* On tablet the 3rd card sits centered on its own row,
                 with the same width as the other two */
              const thirdCardTablet =
                index === 2
                  ? "md:col-span-2 md:w-[calc(50%-0.75rem)] md:justify-self-center lg:col-span-1 lg:w-full lg:justify-self-stretch"
                  : "";

              const usage = plan.usage.filter(({ label }) => label in usageIcons);

              return (
                <article
                  key={plan.id}
                  className={`relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#E4DCFB] bg-white shadow-[0_10px_30px_rgba(109,69,232,0.10)] ${thirdCardTablet}`}
                >
                  {/* Free / Paid badge */}
                  <span
                    className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${
                      index === 0
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-[#F1ECFF] text-[#6D45E8]"
                    }`}
                  >
                    {index === 0 ? "Free" : "Paid"}
                  </span>
                  {/* Card header */}
                  <div className="px-5 pb-5 pt-6 sm:px-6">
                    <div className="flex size-[52px] items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-[#E4DCFB]">
                      <Image
                        src="/assets/Logo.svg"
                        alt={`${plan.name} plan logo`}
                        width={30}
                        height={30}
                        className="shrink-0"
                      />
                    </div>

                    <h2 className="mt-4 font-display text-[26px] font-semibold leading-[32px] text-[#2B1B63] sm:text-[28px] sm:leading-[34px]">
                      {plan.name}
                    </h2>
                    <p className="mt-2 min-h-[44px] max-w-[320px] font-body text-caption leading-[22px] text-[#6B6490]">
                      {plan.description}
                    </p>
                  </div>

                  {/* Card body */}
                  <div className="flex flex-1 flex-col px-5 pb-6 sm:px-6">
                    {/* flex-1 pushes Includes and the button to the bottom,
                        so they line up across cards */}
                    <ul className="flex-1 space-y-3">
                      {plan.features.slice(0, 4).map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-3 font-body text-caption text-[#6B6490]"
                        >
                          <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-[#7B5CF5] text-white">
                            <Check
                              aria-hidden="true"
                              className="size-3.5"
                              strokeWidth={3}
                            />
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Includes */}
                    <div className="mt-6 border-t border-[#E4DCFB] pt-5">
                      <p className="font-body text-[12px] font-medium uppercase tracking-wide text-[#7B5CF5]">
                        Includes
                      </p>

                      <ul className="mt-3 space-y-3.5">
                        {usage.map(({ label, used, limit }) => {
                          const Icon = usageIcons[label];
                          return (
                            <li
                              key={label}
                              className="flex items-center justify-between gap-3 font-body text-[13px] text-[#6B6490]"
                            >
                              <span className="flex min-w-0 items-center gap-2.5">
                                <Icon
                                  aria-hidden="true"
                                  className="size-4 shrink-0 text-[#7B5CF5]"
                                />
                                <span className="truncate">{label}</span>
                              </span>
                              <span className="whitespace-nowrap">
                                <span className="font-semibold text-[#4A2CB0]">
                                  {formatNumber(used)}
                                </span>
                                <span className="text-[#8B7FC0]">
                                  {" "}/ {formatNumber(limit)}
                                </span>
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* CTA */}
                    <Link
                      href={plan.href}
                      className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#6D45E8] to-[#7B5CF5] px-6 font-body text-caption font-medium text-white shadow-[0_3px_0_#cfc3f7] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7B5CF5]"
                    >
                      {plan.cta}
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </main>
      <FooterSection />
    </>
  );
}