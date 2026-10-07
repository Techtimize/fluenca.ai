"use client";

// components/landing/how-it-works.tsx
//
// Scroll section:
//  - the blue card stays pinned (sticky) on the right
//  - every time you scroll down to the next step:
//      * the left text blends into the next text (soft fade, NO blur)
//      * the right side blends into the next animation (soft fade)
//      * the icon on the left switches to the next logo (1, 2, 3, 4)
//  - each step is always fully sharp and clear when you stop scrolling
//  - the "x" marks on the blue background pop + glow when the mouse touches them
//
// ⚠️ Do not put "overflow-hidden" on the <section> below, it would break "sticky".

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";

import step1Animation from "@/animations/how-it-works-1.json";
import step2Animation from "@/animations/how-it-works-2.json";
import step3Animation from "@/animations/how-it-works-3.json";
import step4Animation from "@/animations/how-it-works-4.json";

/* ---------------------------------------------------------------
   THE 4 STEPS  (text + which animation belongs to each step)
---------------------------------------------------------------- */
const STEPS = [
  {
    title: "Tell us about your company",
    text: "Add your website, industry, products or services, and language. Fluenca.ai will research your business and build your Company DNA from answers you confirm.",
    animationData: step1Animation,
    box: { left: 131, top: 78, width: 328, height: 370, lift: 0 },
  },
  {
    title: "Review Your Business Insights",
    text: "Our AI agents research your business and prepare key insights for review. Refine the information if needed, then unlock deeper analytics, recommendations, and personalized suggestions for your goals.",
    animationData: step2Animation,
    box: { left: 31, top: 53, width: 527, height: 338, lift: 30 },
  },
  {
    title: "Turn Insights Into Marketing That Works",
    text: "Explore your analytics, set your goals, and let Fluenca's AI agents turn your business intelligence into action. Create blogs, case studies, social content, campaigns, and more all tailored to your business and goals.",
    animationData: step3Animation,
    box: { left: 42, top: 61, width: 506, height: 329, lift: 30 },
  },
  {
    title: "From Your Goals to Great Content",
    text: "Get a personalized content plan based on your goals, then preview, schedule, and publish content that moves your business forward.",
    animationData: step4Animation,
    box: { left: 40, top: 45, width: 524, height: 379, lift: 15 },
  },
];

// The 4 logos exported from Figma (saved in public/assets/how-it-works/)
const STEP_ICONS = [
  "/assets/how-it-works/step-1-icon.svg",
  "/assets/how-it-works/step-2-icon.svg",
  "/assets/how-it-works/step-3-icon.svg",
  "/assets/how-it-works/step-4-icon.svg",
];

const N = STEPS.length;
const SCROLL_PER_STEP_VH = 130; // scrolling needed for each step (bigger = slower)
// The blue card is 590 x 450. Each animation has its own size and position
// inside it (taken from Figma, relative to the card's top-left corner).
const CARD_W = 590;
const CARD_H = 450;
// Each step has a `lift`: extra pixels (of the 590 x 450 card) the animation is moved UP,
// so it does not touch the bottom edge. 0 = exactly the Figma position.
const STEP_DELAY_MS = 600; // minimum time between two steps, so steps never get skipped

// Blue gradient used for text (angle + stops from the design)
const GRADIENT_TEXT =
  "bg-[linear-gradient(95.57deg,#3659FF_-37.81%,#4F60FF_45.96%,#8157F7_115.03%)] bg-clip-text text-transparent";

/* ---------------------------------------------------------------
   The blue background with "x" marks that pop on hover
---------------------------------------------------------------- */
const COLS = 14;
const ROWS = 12;

function XPattern() {
  return (
    <div
      className="absolute inset-0 grid p-3"
      style={{
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
      }}
    >
      {Array.from({ length: COLS * ROWS }).map((_, i) => (
        <span key={i} className="group flex items-center justify-center">
          <svg
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden
            className="h-2.5 w-2.5 text-white/25 transition-all duration-700 ease-out will-change-transform group-hover:scale-[2.2] group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.95)] group-hover:duration-150"
          >
            <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </span>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------
   One animation layer (all 4 are stacked, only the active one is visible)
   Each animation is placed with its own Figma size/position (see `box` in STEPS).
---------------------------------------------------------------- */
function AnimationLayer({
  data,
  box,
  index,
  active,
}: {
  data: unknown;
  box: { left: number; top: number; width: number; height: number; lift: number };
  index: number;
  active: number;
}) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const isActive = index === active;

  // restart the animation every time this step becomes active
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (isActive) lottieRef.current?.goToAndPlay(0, true);
      else lottieRef.current?.pause();
    });
    return () => cancelAnimationFrame(id);
  }, [isActive]);

  // old step leaves upward, next step waits below
  const position = isActive ? "translate-y-0 opacity-100" : index < active ? "-translate-y-4 opacity-0" : "translate-y-4 opacity-0";

  return (
    <div
      className={`pointer-events-none absolute inset-0 transition-[opacity,transform] duration-700 ease-out ${position}`}
    >
      <div
        className="absolute"
        style={{
          left: `${(box.left / CARD_W) * 100}%`,
          top: `${((box.top - box.lift) / CARD_H) * 100}%`,
          width: `${(box.width / CARD_W) * 100}%`,
          height: `${(box.height / CARD_H) * 100}%`,
        }}
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={data}
          loop
          autoplay={false}
          rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   SECTION
---------------------------------------------------------------- */
export default function HowItWorks() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0); // the step currently shown
  const targetRef = useRef(0); // the step the scroll position asks for
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // which step is active, based on how far we scrolled through the track.
  // The shown step moves ONE step at a time (1 -> 2 -> 3), even if you scroll fast.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;

    const stepTowardTarget = () => {
      timerRef.current = null;
      if (activeRef.current === targetRef.current) return;
      activeRef.current += Math.sign(targetRef.current - activeRef.current);
      setActive(activeRef.current);
      timerRef.current = setTimeout(stepTowardTarget, STEP_DELAY_MS);
    };

    const update = () => {
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      targetRef.current = Math.min(N - 1, Math.floor(progress * N));
      if (!timerRef.current) stepTowardTarget();
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    // Rounded top corners + pulled up over the hero so the hero glow shows behind the curve
    <section
      id="how-it-works"
      className="relative z-10 -mt-10 w-full rounded-t-[40px] bg-white md:-mt-14 md:rounded-t-[56px]"
    >
      {/* Headings (normal scrolling) */}
      <div className="mx-auto w-full max-w-360 px-6 pb-8 pt-12 md:pt-20 lg:pt-28">
        <div className="grid items-start gap-4 md:gap-6 md:grid-cols-[1fr_590px] md:justify-between md:gap-16">
          {/* Left heading: 334 x 96, 400, 36px / 48px, #1C1C1E */}
          <h2 className="w-full font-display text-[28px] leading-[36px] md:text-[36px] md:leading-[48px] font-normal tracking-normal text-[#1C1C1E]">
            Let AI Understand Your Business First
          </h2>

          {/* Right heading: 590 x 124, 500, 50px / 62px, "Business Data" black, rest blue gradient */}
          <h2 className="w-full font-display text-[32px] leading-[40px] md:text-[50px] md:leading-[62px] font-medium tracking-normal">
            <span className={GRADIENT_TEXT}>From </span>
            <span className="text-[#1C1C1E]">Business Data</span>
            <br />
            <span className={GRADIENT_TEXT}>to Marketing Intelligence</span>
          </h2>
        </div>
      </div>

      {/* Tall scroll track: the pinned frame stays on screen while you scroll through it */}
      <div ref={trackRef} style={{ height: `${N * SCROLL_PER_STEP_VH}vh` }}>
        <div className="sticky top-0 flex h-screen items-center pt-8 md:pt-16">
          <div className="mx-auto grid w-full max-w-360 items-center gap-6 px-6 md:grid-cols-[1fr_590px] md:justify-between md:gap-16 md:px-12 lg:px-20">
            {/* LEFT: logo icon + text that blends from one step to the next */}
            <div>
              {/* The 4 Figma logos, stacked: only the active one is visible */}
              <div className="relative h-14 w-14 md:h-16 md:w-16" aria-hidden="true">
                {STEP_ICONS.map((src, i) => (
                  <Image
                    key={src}
                    src={src}
                    alt=""
                    fill
                    sizes="64px"
                    className={`object-contain transition-opacity duration-500 ease-out ${
                      i === active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
              </div>

              <div className="relative mt-5 h-[200px] md:h-[240px]">
                {STEPS.map((step, i) => (
                  <div
                    key={step.title}
                    aria-hidden={i !== active}
                    className={`absolute inset-x-0 top-0 w-full max-w-[449px] transition-[opacity,transform] duration-700 ease-out ${
                      i === active
                        ? "translate-y-0 opacity-100"
                        : i < active
                          ? "pointer-events-none -translate-y-3 opacity-0"
                          : "pointer-events-none translate-y-3 opacity-0"
                    }`}
                  >
                    {/* Title: 302 x 42, 500, 24px / 42px, #1C1C1E */}
                    <h3 className="min-h-[36px] w-full max-w-[449px] font-display text-[20px] leading-[32px] md:min-h-[42px] md:text-[24px] md:leading-[42px] font-medium tracking-normal text-[#1C1C1E]">
                      {step.title}
                    </h3>
                    {/* Body: 449 wide, 400, 17px / 28px, #62625F */}
                    <p className="mt-2 w-full max-w-[449px] font-body text-[15px] leading-[24px] md:text-[17px] md:leading-[28px] font-normal tracking-normal text-[#62625F]">
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: blue card (590 x 450) + x marks + the 4 animations (one visible at a time) */}
            <div className="relative aspect-[590/450] w-full max-w-[590px] overflow-hidden rounded-[24px] md:rounded-[32px] bg-[linear-gradient(95.57deg,#3659FF_-37.81%,#4F60FF_45.96%,#8157F7_115.03%)] shadow-[0_20px_60px_rgba(91,92,240,0.25)]">
              {/* soft light in the corner */}
              <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-3xl" />

              <XPattern />

              {STEPS.map((step, i) => (
                <AnimationLayer key={step.title} data={step.animationData} box={step.box} index={i} active={active} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}