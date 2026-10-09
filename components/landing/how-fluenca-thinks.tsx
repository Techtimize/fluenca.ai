"use client";

// components/landing/how-fluenca-thinks.tsx
//
// Responsive:
//  - small  (< md):  everything stacked, animation scrolls sideways so it stays readable
//  - medium (md):    stacked header (heading, then paragraph), full-width animation
//  - large  (lg+):   heading left, paragraph right, full-width animation
import Lottie from "lottie-react";
import animationData from "@/animations/how-fluenca-thinks.json";

export default function HowFluencaThinks() {
  return (
    // Rounded top corners. The section overlaps the bottom of "Why Fluenca" by the corner radius
    // (-mt-10 / -mt-14), so the lavender glow shows behind the curve.
    // That overlap is covered by the bottom padding in why-fluenca.tsx.
    <section
      id="how-fluenca-thinks"
      className="relative z-10 -mt-10 w-full rounded-t-[32px] bg-white pb-8 pt-10 md:-mt-14 md:rounded-t-[56px] md:pb-14 md:pt-14"
    >
      {/* Header row */}
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-12 lg:pl-20 lg:pr-[30px]">
        <div className="grid items-start gap-4 md:gap-6 lg:grid-cols-[1fr_510px] lg:gap-10">
          <div>
            {/* Pill (never wider than the screen) */}
            <span className="inline-flex h-[30px] max-w-full items-center justify-center whitespace-nowrap rounded-[40px] bg-[#F5F7FF] px-4 py-1 font-body text-[13px] font-normal text-indigo-500 sm:h-[34px] sm:px-5 sm:text-[15px]">
              The Intelligence Behind Fluenca
            </span>

            <h2 className="mt-3 max-w-[595px] font-display text-[28px] font-medium leading-[36px] tracking-normal text-[#1C1C1E] sm:text-[36px] sm:leading-[44px] md:text-[44px] md:leading-[54px] lg:text-[50px] lg:leading-[60px]">
              How Fluenca Thinks
              <br />
              About Your Business
            </h2>
          </div>

          <p className="max-w-[510px] font-body text-[15px] font-normal leading-[24px] tracking-normal text-[#62625F] sm:text-[16px] sm:leading-[26px] md:text-[17px] md:leading-[28px] lg:mt-[46px]">
            Fluenca brings together your business data, AI research, market
            signals, competitors, SEO, and social insights to create one clear
            picture of your business.
          </p>
        </div>
      </div>

      {/* Animation. Keeps the exact shape of the animation (so it always has a height).
          On small screens it would be tiny, so it gets a minimum width and scrolls sideways. */}
      <div className="mx-auto mt-4 w-full max-w-[1417.125px] overflow-x-auto md:mt-6 md:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          className="min-w-[760px] md:min-w-0"
          style={{ aspectRatio: `${animationData.w} / ${animationData.h}` }}
        >
          <Lottie
            animationData={animationData}
            loop
            autoplay
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </section>
  );
}