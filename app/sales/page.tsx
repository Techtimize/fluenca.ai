import type { Metadata } from "next";
import { Suspense } from "react";
import { Sparkles, Users, Headphones, Mail } from "lucide-react";
import SalesForm from "./SalesForm";

export const metadata: Metadata = {
  title: "Contact Sales",
  description:
    "Tell us about your business and our sales team will help you find the right plan.",
};

const benefits = [
  { icon: Sparkles, label: "Personalised plan recommendation" },
  { icon: Users, label: "Custom limits for your team" },
  { icon: Headphones, label: "Dedicated onboarding support" },
] as const;

export default function SalesPage() {
  return (
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

      <div className="relative z-10 mx-auto grid w-full max-w-[1180px] grid-cols-1 items-start gap-10 px-4 pb-14 pt-8 sm:px-6 sm:pt-10 md:px-8 lg:grid-cols-2 lg:gap-14 lg:px-10 lg:pb-16 lg:pt-14">
        {/* Left: pitch */}
        <div className="lg:pt-6">
          <p className="inline-flex min-h-[38px] items-center gap-2 rounded-[40px] border border-[#E4DCFB] bg-white/70 px-4 py-1.5 font-body text-[13px] text-[#6D45E8] sm:min-h-[42px] sm:px-5 sm:text-caption">
            <Sparkles aria-hidden="true" className="size-4 shrink-0" />
            Talk to our sales team
          </p>

          <h1 className="mt-4 font-display text-[30px] font-semibold leading-[38px] text-[#2B1B63] sm:text-[40px] sm:leading-[48px] md:text-[48px] md:leading-[56px] lg:text-[52px] lg:leading-[60px]">
            Let&apos;s find the{" "}
            <span className="bg-linear-to-r from-[#6D45E8] to-[#A78BFA] bg-clip-text text-transparent">
              right plan
            </span>{" "}
            for you
          </h1>

          <p className="mt-4 max-w-[460px] font-body text-[15px] leading-[24px] text-[#6B6490] md:text-[16px] md:leading-[26px]">
            Tell us a bit about your business and our team will get back to you
            within 1 business day.
          </p>

          <ul className="mt-8 space-y-4">
            {benefits.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-3.5 font-body text-[15px] text-[#2B1B63]"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] text-[#6D45E8]">
                  <Icon aria-hidden="true" className="size-[18px]" />
                </span>
                {label}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex max-w-[460px] items-center gap-3.5 rounded-2xl border border-[#E4DCFB] bg-[#F6F3FF] px-[18px] py-4">
            <Mail aria-hidden="true" className="size-[22px] shrink-0 text-[#6D45E8]" />
            <div>
              <p className="font-body text-[14px] font-semibold text-[#2B1B63]">
                marketing@fluenca.ai
              </p>
              <p className="mt-0.5 font-body text-[13px] text-[#6B6490]">
                We reply Mon to Fri
              </p>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <Suspense fallback={null}>
          <SalesForm />
        </Suspense>
      </div>
    </main>
  );
}