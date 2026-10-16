"use client";

import Image from "next/image";

// Enough cells to fill the grid at any width; extra cells are clipped by overflow-hidden
const X_CELLS = 30 * 14;

type FaqCtaSectionProps = {
  title?: string;
  description?: string;
  /** Your exported circle image from Figma (inside /public). */
  arcsSrc?: string;
};

export default function FaqCtaSection({
  title = "Smart Agent-Powered Marketing Intelligence",
  description = "Fluenca's AI agents research your business, connect data from multiple sources, and turn complex information into clear insights, strategies, and personalized marketing actions.",
  arcsSrc = "/assets/faq-arcs.svg",
}: FaqCtaSectionProps) {

  return (
    <section
      className="relative overflow-hidden bg-[radial-gradient(60%_50%_at_0%_0%,#E3E8FF_0%,#F6F7FF_55%,#FFFFFF_100%)] font-[family-name:var(--font-google-sans-flex)]"
    >
      {/* Frame 240: 1440 wide, card 1280 -> 80px side gaps */}
      <div className="relative mx-auto max-w-[1440px] px-4 py-10 sm:px-6 md:px-20 md:py-16">
        {/* White block behind the card (as in the design) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[35%] rounded-t-[40px] bg-white md:top-[calc(4rem+194px)]" />

          {/* Rectangle 137: 1280 x 450, radius 40 */}
          <div className="relative mx-auto min-h-[360px] w-full max-w-[1280px] overflow-hidden rounded-[28px] bg-[linear-gradient(100deg,#3659FF_0%,#4A62FA_50%,#7A6CF0_100%)] md:min-h-0 md:flex md:h-[450px] md:items-center md:rounded-[40px]">
          {/* Soft glow */}
          <div className="pointer-events-none absolute left-[35%] top-1/2 h-[420px] w-[520px] -translate-y-1/2 rounded-full bg-[#6C86FF]/40 blur-3xl" />

          {/* Interactive X grid: every X pops and brightens on hover */}
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

          {/* Your exported circle, pinned to the right edge, full card height */}
          <Image
            src={arcsSrc}
            alt=""
            aria-hidden
            width={683}
            height={386}
            unoptimized
            className="pointer-events-none absolute right-0 top-1/2 h-[75%] w-auto max-w-none -translate-y-1/2 select-none md:h-full"
          />

          {/* Content: lets the mouse pass through so every X reacts to hover */}
          <div className="pointer-events-none relative z-10 px-6 py-10 text-white sm:px-10 md:px-[60px] md:py-0">
            {/* 595 wide, 50/60, weight 500 */}
            <h2 className="mt-5 max-w-[595px] text-[32px] font-medium leading-[1.2] sm:text-4xl md:text-[50px] md:leading-[60px]">
              {title}
            </h2>

            {/* 595 wide, 17/28, weight 400 */}
            <p className="mt-5 max-w-[595px] text-sm leading-[24px] text-white/90 md:text-[17px] md:leading-[28px]">
              {description}
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}