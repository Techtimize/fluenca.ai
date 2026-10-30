"use client";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, ChevronDown, Play, ShieldCheck, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Button, Input } from "@base-ui/react";
import { BrandButton } from "@/components/ui/brand-button";
import { waitlistPlaceholders } from "@/constant/waitlist";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { WaitlistMutation } from "@/routes/bussiness/Bussiness-Mutation";
import heroAnimation from "@/animations/hero-diagram.json";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export interface HeroAction {
  label: string;
  href: string;
  variant: "primary" | "secondary";
}

export interface LandingHeroProps {
  eyebrow: string;
  titleLead: string;
  titleHighlight: string;
  titleTail: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  actions: readonly HeroAction[];
}

const navLinks = [
  { label: "Blogs", href: "/blog" },
  { label: "Plans", href: "/plans" },
  { label: "Use cases", href: "/use-case" },
] as const;

const highlights = [
  { icon: Zap, label: "Save hours of research" },
  { icon: TrendingUp, label: "Data-driven decisions" },
  { icon: ShieldCheck, label: "Built for growth" },
] as const;

export function LandingHero({
  eyebrow,
  titleLead,
  titleHighlight,
  titleTail,
  description,
  imageSrc,
  imageAlt,
  actions,
}: LandingHeroProps) {
  const { mutate: waitlistMutation, isPending: waitlistIsPending } = WaitlistMutation();
  const handleWaitlist = (email: string) => {
    waitlistMutation(email);
  }
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col overflow-hidden md:min-h-screen">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-linear-to-t from-[#E4E6FF] via-[#F1F2FF] to-transparent"
      />
      {/* Lavender wave, bottom-left */}
      <svg
        aria-hidden="true"
        viewBox="0 0 600 420"
        preserveAspectRatio="none"
        className="pointer-events-none absolute bottom-0 left-0 -z-10 h-[260px] w-[75%] sm:h-[320px] sm:w-[55%] lg:h-[420px] lg:w-[42%]"
      >
        <defs>
          <linearGradient id="hero-wave" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#DCDDFB" />
            <stop offset="100%" stopColor="#ECEBFD" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <path
          d="M0 0 C120 10 190 90 250 190 C310 290 400 370 600 420 L0 420 Z"
          fill="url(#hero-wave)"
        />
      </svg>      {/* <header className="fixed inset-x-0 top-0 z-50 w-full bg-white/80 backdrop-blur-md">
        <div className="mx-auto grid h-16 w-full max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 md:px-8 lg:px-10">
          <Link href="/" className="flex h-10 w-[138px] items-center gap-2">
            <Image
              src="/assets/Logo.svg"
              alt="fluenca.ai logo"
              width={28}
              height={28}
              priority
              className="shrink-0"
            />
            <span className="whitespace-nowrap font-display text-body font-medium text-brand">fluenca.ai</span>
          </Link>
          <nav className="hidden items-center gap-1 rounded-full bg-brand-50 p-1 md:flex">
            <button
              type="button"
              className="inline-flex h-10 w-[113px] items-center justify-center gap-1.5 rounded-[100px] bg-white px-5 py-[7px] font-body text-caption font-medium text-ink shadow-sm"
            >
              Agents
              <ChevronDown aria-hidden="true" className="size-3.5" />
            </button>
            {navLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="rounded-full px-4 py-1.5 font-body text-caption text-ink transition-colors hover:text-brand"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex justify-end">
            <BrandButton href="/signup">Sign up</BrandButton>
          </div>
        </div>
      </header> */}

      <section className="mx-auto grid w-full max-w-360 flex-1 items-center gap-6 px-4 pb-12 pt-[84px] sm:gap-8 sm:px-6 sm:pt-[92px] md:px-8 md:pb-16 md:pt-[96px] lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:px-10 lg:pb-16 lg:pt-16">
        <div className="relative flex flex-col items-start lg:-top-8">
          {/* Eyebrow */}
          <p className="mb-5 inline-flex h-9.5 items-center gap-2 rounded-full bg-[#EEF0FF] px-4 font-body text-[13px] font-medium text-brand sm:mb-6 sm:h-[40px] sm:px-5 sm:text-caption">
            <Sparkles aria-hidden="true" className="size-4 shrink-0" />
            {eyebrow}
          </p>
          <h1 className="w-full font-display text-[34px] font-bold leading-[1.15] tracking-tight text-[#14163A] sm:text-[42px] md:max-w-[560px] md:text-[48px] lg:max-w-[540px] lg:text-[52px]">
            {titleLead}
            <span className="text-brand">{titleHighlight}</span>
            {titleTail}
          </h1>
          <p className="mt-4 w-full font-body text-[15px] leading-[26px] text-[#5B5F7A] sm:mt-5 md:max-w-[500px] md:text-[17px] md:leading-[28px]">
            {description}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4">
            {actions.map(({ label, href, variant }) => (
              <Link
                key={label}
                href={href}
                className={`group inline-flex h-14 items-center justify-center gap-2 rounded-full px-7 font-body text-[15px] font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:px-8 ${
                  variant === "primary"
                    ? "bg-linear-to-r from-[#4F46E5] to-[#6D5DF6] text-white shadow-[0_12px_28px_-10px_rgba(79,70,229,0.7)] hover:opacity-95"
                    : "border border-[#E3E5F5] bg-white/70 text-brand hover:border-brand/40 hover:bg-white"
                }`}
              >
                {variant === "secondary" && <Play aria-hidden="true" className="size-4 fill-current" />}
                {label}
                {variant === "primary" && (
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
                )}
              </Link>
            ))}
          </div>

          <ul className="mt-9 flex flex-wrap items-center gap-y-4 sm:mt-10">
            {highlights.map(({ icon: Icon, label }, index) => (
              <li
                key={label}
                className={`flex items-center gap-3 pr-5 sm:pr-6 ${index > 0 ? "border-l border-[#E3E5F5] pl-5 sm:pl-6" : ""}`}
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#EEF0FF] text-brand">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <span className="max-w-22.5 font-body text-[13px] leading-4.5 text-[#5B5F7A]">{label}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 w-full max-w-lg">
            {/* <div className="relative w-full max-w-md">
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-14 w-full rounded-full border border-gray-300 bg-white pl-5 pr-36"
              />

              <Button
                className="cursor-pointer border-none absolute right-1.5 top-1/2 h-11 -translate-y-1/2 rounded-full px-5 bg-brand text-white shadow-[0_3px_0_#bfc1ff] hover:bg-brand-700"
              >
                Join Waitlist
              </Button>
            </div> */}
            {/* <PlaceholdersAndVanishInput
              placeholders={waitlistPlaceholders}
              onChange={() => {}}
              onSubmit={(e) => {
                const form = e.currentTarget;
                const emailInput = form.elements.namedItem("email") as HTMLInputElement | null;
                const email = emailInput?.value?.trim() ?? "";
                if (email) handleWaitlist(email);
              }}
            /> */}
          </div>
        </div>

        {/* Diagram side: Lottie animation (square). The animation file has empty space around the circles,
            so on large screens the box is moved UP (lg:-top-12 / xl:-top-16). `top` only moves it visually:
            it does not change the height of the section, so the spacing at the end stays the same. */}
        <div className="relative mx-auto aspect-square w-full max-w-95 sm:max-w-115 md:max-w-130 lg:-top-12 lg:max-w-140 xl:-top-16 xl:max-w-153">
          <Lottie
            animationData={heroAnimation}
            loop
            autoplay
            aria-label={imageAlt}
            className="h-full w-full"
          />
        </div>
      </section>
    </div>
  );
}