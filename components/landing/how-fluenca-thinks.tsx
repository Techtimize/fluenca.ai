"use client";

// components/landing/how-fluenca-thinks.tsx
import Lottie from "lottie-react";
import animationData from "@/animations/how-fluenca-thinks.json";

export default function HowFluencaThinks() {
  return (
    // Rounded top corners. The section overlaps the bottom of "Why Fluenca" by exactly the corner
    // radius area (-mt-10 / -mt-14), so the lavender glow shows behind the curve.
    // That overlap is added back as bottom padding in why-fluenca.tsx, so the visible gap stays the same.
    <section
      id="how-fluenca-thinks"
      className="relative z-10 -mt-10 w-full rounded-t-[40px] bg-white pb-10 pt-12 md:-mt-14 md:rounded-t-[56px] md:pb-16 md:pt-16"
    >
      {/* Header row: heading on the left, paragraph on the right */}
      <div className="mx-auto w-full max-w-360 px-6 md:px-12 lg:pl-20 lg:pr-[30px]">
        <div className="grid items-start gap-6 md:grid-cols-[1fr_510px] md:gap-10">
          <div>
            {/* Pill: 274 x 34, radius 40, padding 4/20, gap 10, bg #F5F7FF */}
            <span className="inline-flex h-[34px] w-[274px] max-w-full items-center justify-center gap-[10px] whitespace-nowrap rounded-[40px] bg-[#F5F7FF] px-5 py-1 font-body text-[15px] font-normal text-indigo-500">
              The Intelligence Behind Fluenca
            </span>

            {/* Heading: 595 x 120, 500, 50px / 60px */}
            <h2 className="mt-3 w-[595px] max-w-full font-display text-[50px] leading-[60px] font-medium tracking-normal text-[#1C1C1E]">
              How Fluenca Thinks
              <br />
              About Your Business
            </h2>
          </div>

          {/* Paragraph: 510 x 84, 400, 17px / 28px */}
          <p className="w-[510px] max-w-full font-body text-[17px] leading-[28px] font-normal tracking-normal text-[#62625F] md:mt-[46px]">
            Fluenca brings together your business data, AI research, market
            signals, competitors, SEO, and social insights to create one clear
            picture of your business.
          </p>
        </div>
      </div>

      {/* Animation (Lottie): up to 1417 wide, keeps the exact shape of your animation (1417 x 389) */}
      {/* The box gets the same shape as your animation, so it always has a height */}
      <div
        className="mx-auto mt-4 w-full max-w-[1417.125px] md:mt-6"
        style={{ aspectRatio: `${animationData.w} / ${animationData.h}` }}
      >
        <Lottie
          animationData={animationData}
          loop
          autoplay
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </section>
  );
}