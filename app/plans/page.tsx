import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  Crown,
  FileText,
  Headphones,
  Image as ImageIcon,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { getPlans, type PlanId } from "@/constant/plans";

export const metadata: Metadata = {
  title: "Plans",
  description:
    "From building your social presence to running full-scale campaigns, pick the plan that fits your goals.",
};

/* Icons for the "Includes" rows, matched by label */
const usageIcons: Record<string, LucideIcon> = {
  "Company Analysis": BarChart3,
  "Manual Competitor Analysis": Users,
  "AI Competitor Analysis": Bot,
  "Script Generation": FileText,
  "Image Generation": ImageIcon,
};

/* Icon shown inside the note box of each plan */
const noteIcons: Record<PlanId, LucideIcon> = {
  growth: BarChart3,
  accelerator: Zap,
  command: Crown,
};

/* White + purple only. Only colors differ per plan, never sizes. */
const styles: Record<
  PlanId,
  {
    header: string;
    logoTile: string;
    logo: string;
    title: string;
    description: string;
    label: string;
    check: string;
    noteIcon: string;
    usageValue: string;
    button: string;
  }
> = {
  growth: {
    header: "bg-linear-to-b from-[#F3EFFF] to-white",
    logoTile: "bg-white shadow-sm ring-1 ring-[#E4DCFB]",
    logo: "",
    title: "text-[#2B1B63]",
    description: "text-[#6B6490]",
    label: "text-[#8B7FC0]",
    check: "bg-[#9B83F7] text-white",
    noteIcon: "text-[#7B5CF5]",
    usageValue: "text-[#2B1B63]",
    button: "bg-linear-to-r from-[#6D45E8] to-[#9B83F7]",
  },
  accelerator: {
    header: "bg-linear-to-br from-[#6D45E8] via-[#7B5CF5] to-[#A78BFA]",
    logoTile: "bg-white/20 ring-1 ring-white/30",
    logo: "brightness-0 invert",
    title: "text-white",
    description: "text-white/85",
    label: "text-[#7B5CF5]",
    check: "bg-[#7B5CF5] text-white",
    noteIcon: "text-[#7B5CF5]",
    usageValue: "text-[#6D45E8]",
    button: "bg-linear-to-r from-[#6D45E8] to-[#8B6CF7]",
  },
  command: {
    header: "bg-linear-to-br from-[#4A2CB0] via-[#5B34D6] to-[#7B5CF5]",
    logoTile: "bg-white/20 ring-1 ring-white/30",
    logo: "brightness-0 invert",
    title: "text-white",
    description: "text-white/85",
    label: "text-[#6D45E8]",
    check: "bg-[#5B34D6] text-white",
    noteIcon: "text-[#5B34D6]",
    usageValue: "text-[#4A2CB0]",
    button: "bg-linear-to-r from-[#4A2CB0] to-[#6D45E8]",
  },
};

const trustItems = [
  { icon: Zap, label: "All AI Agents Included" },
  { icon: ShieldCheck, label: "Secure & Reliable" },
  { icon: Headphones, label: "24/7 Support" },
] as const;

const formatNumber = (n: number) => n.toLocaleString("en-US");

export default async function PlansPage() {
  const plans = await getPlans();

  return (
    <>
      <SiteHeader />

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
            <p className="inline-flex min-h-[38px] items-center gap-2 rounded-[40px] border border-[#E4DCFB] bg-white/70 px-4 py-1.5 font-body text-[13px] text-[#6D45E8] sm:min-h-[42px] sm:px-5 sm:text-caption">
              <Sparkles aria-hidden="true" className="size-4 shrink-0" />
              Choose the plan that fits your goals
            </p>

            <h1 className="mt-4 font-display text-[30px] font-semibold leading-[38px] text-[#2B1B63] sm:text-[40px] sm:leading-[48px] md:text-[48px] md:leading-[56px] lg:text-[52px] lg:leading-[60px]">
              Power Your Marketing,{" "}
              <span className="bg-linear-to-r from-[#6D45E8] to-[#A78BFA] bg-clip-text text-transparent">
                Your Way
              </span>
            </h1>

            <p className="mt-4 max-w-[640px] font-body text-[15px] leading-[24px] text-[#6B6490] md:text-[16px] md:leading-[26px]">
              From building your social presence to running full-scale
              campaigns, our plans give you the right tools to grow, at every
              stage.
            </p>
          </div>

          {/* Plan cards: identical width, height, border and shadow */}
          <div className="mx-auto mt-8 grid max-w-[1180px] grid-cols-1 gap-6 sm:mt-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {plans.map((plan, index) => {
              const s = styles[plan.id];
              const NoteIcon = noteIcons[plan.id];

              /* On tablet the 3rd card sits centered on its own row,
                 with the same width as the other two */
              const thirdCardTablet =
                index === 2
                  ? "md:col-span-2 md:w-[calc(50%-0.75rem)] md:justify-self-center lg:col-span-1 lg:w-full lg:justify-self-stretch"
                  : "";

              return (
                <article
                  key={plan.id}
                  className={`relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#E4DCFB] bg-white shadow-[0_10px_30px_rgba(109,69,232,0.10)] ${thirdCardTablet}`}
                >
                  {/* Card header */}
                  <div className={`relative px-5 pb-6 pt-6 sm:px-6 ${s.header}`}>
                    {plan.popular && (
                      <span className="absolute right-4 top-5 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 font-body text-[12px] font-medium text-[#6D45E8] shadow-sm sm:right-5 sm:text-[13px]">
                        <Crown aria-hidden="true" className="size-3.5" />
                        Most Popular
                      </span>
                    )}

                    <div
                      className={`flex size-[52px] items-center justify-center rounded-2xl ${s.logoTile}`}
                    >
                      <Image
                        src="/assets/Logo.svg"
                        alt={`${plan.name} plan logo`}
                        width={30}
                        height={30}
                        className={`shrink-0 ${s.logo}`}
                      />
                    </div>

                    <h2
                      className={`mt-4 font-display text-[26px] font-semibold leading-[32px] sm:text-[28px] sm:leading-[34px] ${s.title}`}
                    >
                      {plan.name}
                    </h2>
                    <p
                      className={`mt-2 min-h-[44px] max-w-[320px] font-body text-caption leading-[22px] ${s.description}`}
                    >
                      {plan.description}
                    </p>
                  </div>

                  {/* Card body */}
                  <div className="flex flex-1 flex-col px-5 pb-6 pt-5 sm:px-6">
                    <p
                      className={`font-body text-[12px] font-medium uppercase tracking-wide ${s.label}`}
                    >
                      What you get
                    </p>

                    {/* flex-1 pushes everything below to the bottom,
                        so the note, Includes and button line up across cards */}
                    <ul className="mt-3 flex-1 space-y-2.5">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2.5 font-body text-caption text-[#2B1B63]"
                        >
                          <span
                            className={`mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full ${s.check}`}
                          >
                            <Check
                              aria-hidden="true"
                              className="size-3"
                              strokeWidth={3}
                            />
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Note box */}
                    <div className="mt-5 flex min-h-[76px] items-center gap-3 rounded-2xl bg-[#F6F3FF] px-4 py-3 text-[#5E5587]">
                      <NoteIcon
                        aria-hidden="true"
                        className={`size-5 shrink-0 ${s.noteIcon}`}
                      />
                      <p className="font-body text-[13px] leading-[19px]">
                        {plan.note}
                      </p>
                    </div>

                    {/* Includes */}
                    <p
                      className={`mt-5 font-body text-[12px] font-medium uppercase tracking-wide ${s.label}`}
                    >
                      Includes
                    </p>

                    <ul className="mt-3 space-y-3">
                      {plan.usage.map(({ label, used, limit }) => {
                        const Icon = usageIcons[label] ?? BarChart3;
                        return (
                          <li
                            key={label}
                            className="flex items-center justify-between gap-3 font-body text-[13px] text-[#6B6490]"
                          >
                            <span className="flex min-w-0 items-center gap-2.5">
                              <Icon
                                aria-hidden="true"
                                className="size-4 shrink-0 text-[#8B7FC0]"
                              />
                              <span className="truncate">{label}</span>
                            </span>
                            <span className="whitespace-nowrap">
                              <span className={`font-semibold ${s.usageValue}`}>
                                {formatNumber(used)}
                              </span>
                              <span className="text-[#8B7FC0]">
                                /{formatNumber(limit)}
                              </span>
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    {/* CTA */}
                    <Link
                      href={plan.href}
                      className={`mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-6 font-body text-caption font-medium text-white shadow-[0_3px_0_#cfc3f7] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7B5CF5] ${s.button}`}
                    >
                      {plan.cta}
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Trust strip */}
          <ul className="mx-auto mt-10 flex max-w-[800px] flex-col items-center justify-center gap-4 sm:flex-row sm:gap-0">
            {trustItems.map(({ icon: Icon, label }, i) => (
              <li
                key={label}
                className={`flex items-center gap-3 font-body text-caption text-[#6B6490] sm:px-6 lg:px-8 ${
                  i > 0 ? "sm:border-l sm:border-[#E4DCFB]" : ""
                }`}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] text-[#6D45E8]">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}