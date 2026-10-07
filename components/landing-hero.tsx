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
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Soft light-purple glow at the bottom of the hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-linear-to-t from-[#E4E6FF] via-[#F1F2FF] to-transparent"
      />

      {/* Header: fixed so it never disappears on scroll */}
      <header className="fixed inset-x-0 top-0 z-50 w-full bg-white/80 backdrop-blur-md">
        <div className="mx-auto grid h-16 w-full max-w-360 grid-cols-[1fr_auto_1fr] items-center px-6 md:px-8 lg:px-10">
          {/* Logo lockup: 138 x 40 */}
          <Link href="/" className="flex h-10 w-[138px] items-center gap-2">
            <Image
              src="/assets/logo.svg"
              alt="fluenca.ai logo"
              width={28}
              height={28}
              priority
              className="shrink-0"
            />
            <span className="whitespace-nowrap font-display text-body font-medium text-brand">fluenca.ai</span>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full bg-brand-50 p-1 md:flex">
            {/* Agents: 113 x 40, radius 100, padding 7/20, gap 6, white */}
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
              className="inline-flex h-10 items-center justify-center rounded-full bg-brand px-6 font-body text-caption font-medium text-white shadow-[0_3px_0_#bfc1ff] transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* pt-8 -> pt-24 so content clears the fixed header (64px + your original 32px) */}
      {/* pb-24: extra bottom space so the rounded 'How it works' section (which overlaps up to 56px) never covers the animation */}
      <section className="mx-auto grid w-full max-w-360 flex-1 items-center gap-8 px-6 pb-24 pt-24 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:px-10 lg:pb-24 lg:pt-24">
        <div className="flex flex-col items-start">
          {/* Eyebrow: hug x 42, radius 40, border 1px #E3E8FF, padding 7/20, gap 10, white 20% */}
          <p className="mb-4 inline-flex h-[42px] items-center gap-[10px] rounded-[40px] border border-[#E3E8FF] bg-white/20 px-5 py-[7px] font-body text-caption text-brand">
            <Target aria-hidden="true" className="size-4" />
            {eyebrow}
          </p>

          {/* H1: 449 x 159, Google Sans Flex, 500, 44px / 53px, letter spacing 0 */}
          <h1 className="w-[449px] max-w-full font-display text-[44px] leading-[53px] font-medium tracking-normal text-ink">
            {titleLead}
            <span className="text-brand">{titleHighlight}</span>
            {titleTail}
          </h1>

          {/* Description: 449 x 78, 400, 16px / 26px, #1C1C1E */}
          <p className="mt-4 w-[449px] max-w-full font-body text-[16px] leading-[26px] font-normal tracking-normal text-[#1C1C1E]">
            {description}
          </p>

          {/* Buttons row: hug (306), height 48, gap 12 */}
          <div className="mt-6 flex h-12 w-fit flex-wrap items-center gap-3">
            {actions.map(({ label, href, variant }) => (
              <Link
                key={label}
                href={href}
                className={`inline-flex h-12 items-center justify-center gap-[10px] rounded-[50px] px-7 py-[14px] font-body text-caption font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  variant === "primary"
                    ? "w-[144px] bg-linear-to-r from-brand to-[#7B5CF5] text-white shadow-[0_3px_0_#bfc1ff] hover:opacity-90"
                    : "w-[150px] border border-transparent text-brand [background:linear-gradient(#fff,#fff)_padding-box,linear-gradient(to_right,#4F60FF,#7B5CF5)_border-box] hover:text-brand-700"
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

        {/* Diagram side: Lottie animation, 612 x 612 */}
        <div className="relative mx-auto aspect-square w-full max-w-[612px]">
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