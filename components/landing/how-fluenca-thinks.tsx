"use client";

// components/landing/how-fluenca-thinks.tsx
import Lottie from "lottie-react";
import animationData from "@/animations/how-fluenca-thinks.json";

export default function HowFluencaThinks() {
  return (
    <section id="how-fluenca-thinks" className="w-full bg-white py-10 md:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="px-6 py-10 md:px-10">
          <div className="grid items-start gap-6 md:grid-cols-[3fr_2fr] md:gap-10">
            <div>
              <span className="inline-block rounded-full border border-indigo-100 bg-indigo-50/60 px-3 py-1 text-[11px] font-normal text-indigo-500">
                The Intelligence Behind Fluenca
              </span>
              <h2 className="mt-3 text-3xl font-medium leading-[1.15] tracking-tight text-slate-900 md:text-[40px]">
                How Fluenca Thinks
                <br />
                About Your Business
              </h2>
            </div>

            <p className="max-w-sm text-[13px] leading-relaxed text-slate-600 md:ml-auto md:mt-10">
              Fluenca brings together your business data, AI research, market
              signals, competitors, SEO, and social insights to create one clear
              picture of your business.
            </p>
          </div>

          {/* Animation (Lottie) */}
          {/* The box gets the same shape as your animation, so it always has a height */}
          <div
            className="mt-10 w-full"
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
      </div>
    </section>
  );
}