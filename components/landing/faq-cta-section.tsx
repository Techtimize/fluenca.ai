"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";

// Enough cells to fill the grid area; extra cells are clipped by overflow-hidden
const X_CELLS = 15 * 14;

type FaqCtaSectionProps = {
  badge?: string;
  title?: string;
  description?: string;
  placeholder?: string;
  buttonLabel?: string;
  /** Path of the arcs image exported from Figma (inside /public). */
  arcsSrc?: string;
  /** Called with the email when the form is submitted. */
  onSubscribe?: (email: string) => void | Promise<void>;
};

export default function FaqCtaSection({
  badge = "Frequently Asked Questions",
  title = "Smart Agent-Powered Marketing Intelligence",
  description = "Fluenca’s AI agents research your business, connect data from multiple sources, and turn complex information into clear insights, strategies, and personalized marketing actions.",
  placeholder = "Enter Your Email",
  buttonLabel = "Subscribe",
  arcsSrc = "/assets/faq-arcs.svg",
  onSubscribe,
}: FaqCtaSectionProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      setLoading(true);
      await onSubscribe?.(email.trim());
      setEmail("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(60%_50%_at_0%_0%,#E3E8FF_0%,#F6F7FF_55%,#FFFFFF_100%)] px-4 py-10 sm:px-6 md:py-16">
      {/* White rounded block behind the card (as in the design) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[35%] rounded-t-[40px] bg-white" />

      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[28px] bg-[linear-gradient(100deg,#3F6BF6_0%,#4F6CF5_45%,#7A6CF0_100%)] px-6 py-10 sm:px-10 md:rounded-[36px] md:px-16 md:py-16">
        {/* Soft light glow in the center */}
        <div className="pointer-events-none absolute left-[35%] top-1/2 h-[420px] w-[520px] -translate-y-1/2 rounded-full bg-[#6C86FF]/40 blur-3xl" />

        {/* Interactive "X" grid: each X pops and brightens on hover */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-[38%] right-0 hidden grid-cols-[repeat(auto-fill,36px)] auto-rows-[36px] content-center justify-center overflow-hidden md:grid"
          style={{
            maskImage:
              "radial-gradient(ellipse at center, #000 35%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, #000 35%, transparent 80%)",
          }}
        >
          {Array.from({ length: X_CELLS }).map((_, i) => (
            <span
              key={i}
              className="group flex h-9 w-9 items-center justify-center"
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                className="text-white opacity-30 transition-[transform,opacity,filter] duration-700 ease-out group-hover:scale-[1.8] group-hover:opacity-100 group-hover:duration-150 group-hover:[filter:drop-shadow(0_0_6px_rgba(255,255,255,0.9))] motion-reduce:transition-none"
              >
                <path
                  d="M1 1l8 8M9 1L1 9"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          ))}
        </div>

        {/* Arcs image exported from Figma (public/assets/faq-arcs.svg) */}
        <Image
          src={arcsSrc}
          alt=""
          aria-hidden
          width={560}
          height={560}
          unoptimized
          priority={false}
          className="pointer-events-none absolute right-0 top-1/2 h-[75%] w-auto max-w-none -translate-y-1/2 select-none md:h-[100%]"
        />

        {/* Content */}
        <div className="relative z-10 max-w-[560px] text-white">
          <span className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs font-normal backdrop-blur-sm">
            {badge}
          </span>

          <h2 className="mt-5 text-[32px] font-normal leading-[1.15] tracking-tight sm:text-4xl md:text-[52px]">
            {title}
          </h2>

          <p className="mt-5 max-w-[520px] text-sm leading-relaxed text-white/90 md:text-base">
            {description}
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-7 flex w-full max-w-[460px] items-center gap-2 rounded-full border border-white/30 bg-white/10 p-1.5 backdrop-blur-sm"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              aria-label="Email address"
              className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white placeholder:text-white/70 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="shrink-0 rounded-full bg-white px-6 py-3 text-sm font-medium text-[#4A5FF0] transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:opacity-60"
            >
              {loading ? "Sending..." : buttonLabel}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}