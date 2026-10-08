"use client";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ChevronDown, Target } from "lucide-react";
import { Button, Input } from "@base-ui/react";
import { waitlistPlaceholders } from "@/constant/waitlist";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { WaitlistMutation } from "@/routes/bussiness/Bussiness-Mutation";
import heroAnimation from "@/animations/hero-diagram.json";

// Lottie needs the browser, so skip server rendering
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
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
  { label: "Use case", href: "/use-case" },
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
      {/* Soft light-purple glow at the bottom of the hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-linear-to-t from-[#E4E6FF] via-[#F1F2FF] to-transparent"
      />

      {/* Header: fixed so it never disappears on scroll */}
      <header className="fixed inset-x-0 top-0 z-50 w-full bg-white/80 backdrop-blur-md">
        <div className="mx-auto grid h-16 w-full max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 md:px-8 lg:px-10">
          {/* Logo lockup */}
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
            <Link
              href="/signup"
              className="inline-flex h-10 items-center justify-center rounded-full bg-brand px-5 font-body text-caption font-medium text-white shadow-[0_3px_0_#bfc1ff] transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:px-6"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Spacing at the END is exactly as in your original (flex-1 + pb-12 / md:pb-16 / lg:pb-16).
          Small + medium screens: top padding clears the 64px fixed header. */}
      <section className="mx-auto grid w-full max-w-[1440px] flex-1 items-center gap-6 px-4 pb-12 pt-[84px] sm:gap-8 sm:px-6 sm:pt-[92px] md:px-8 md:pb-16 md:pt-[96px] lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:px-10 lg:pb-16 lg:pt-16">
        {/* lg: nudged up a little so the left text lines up with the diagram */}
        <div className="relative flex flex-col items-start lg:-top-8">
          {/* Eyebrow */}
          <p className="mb-3 inline-flex h-[38px] items-center gap-[10px] rounded-[40px] border border-[#E3E8FF] bg-white/20 px-4 py-[7px] font-body text-[13px] text-brand sm:mb-4 sm:h-[42px] sm:px-5 sm:text-caption">
            <Target aria-hidden="true" className="size-4 shrink-0" />
            {eyebrow}
          </p>

          {/* H1: grows with the screen (28 -> 32 -> 40 -> 44px) */}
          <h1 className="w-full font-display text-[28px] font-medium leading-[36px] tracking-normal text-ink sm:text-[32px] sm:leading-[40px] md:max-w-[520px] md:text-[40px] md:leading-[48px] lg:max-w-[449px] lg:text-[44px] lg:leading-[53px]">
            {titleLead}
            <span className="text-brand">{titleHighlight}</span>
            {titleTail}
          </h1>

          {/* Description */}
          <p className="mt-3 w-full font-body text-[15px] font-normal leading-[24px] tracking-normal text-[#1C1C1E] sm:mt-4 md:max-w-[520px] md:text-[16px] md:leading-[26px] lg:max-w-[449px]">
            {description}
          </p>

          {/* Buttons row */}
          <div className="mt-5 flex w-fit flex-wrap items-center gap-3 sm:mt-6">
            {actions.map(({ label, href, variant }) => (
              <Link
                key={label}
                href={href}
                className={`inline-flex h-12 min-w-[144px] items-center justify-center gap-[10px] rounded-[50px] px-5 py-[14px] font-body text-caption font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-[144px] sm:px-7 ${
                  variant === "primary"
                    ? "bg-linear-to-r from-brand to-[#7B5CF5] text-white shadow-[0_3px_0_#bfc1ff] hover:opacity-90"
                    : "border border-transparent text-brand [background:linear-gradient(#fff,#fff)_padding-box,linear-gradient(to_right,#4F60FF,#7B5CF5)_border-box] hover:text-brand-700 sm:w-[150px]"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

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
        <div className="relative mx-auto aspect-square w-full max-w-[380px] sm:max-w-[460px] md:max-w-[520px] lg:-top-12 lg:max-w-[560px] xl:-top-16 xl:max-w-[612px]">
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