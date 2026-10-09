"use client";

// components/landing/how-it-works.tsx
//
// Scroll section (pinned card on the right, text + logo on the left).
// - The active step is calculated DIRECTLY from scroll position (no timers),
//   so scrolling is predictable: the same scroll distance = the same step.
// - Headings live inside the pinned frame, so there is no empty white gap.
// - Fully responsive: stacked layout below `lg`, two columns from `lg` up.
//
// ⚠️ Do not put "overflow-hidden" on the <section>, it would break "sticky".

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";

import step1Animation from "@/animations/how-it-works-1.json";
import step2Animation from "@/animations/how-it-works-2.json";
import step3Animation from "@/animations/how-it-works-3.json";
import step4Animation from "@/animations/how-it-works-4.json";

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

const STEP_ICONS = [
  "/assets/how-it-works/step-1-icon.svg",
  "/assets/how-it-works/step-2-icon.svg",
  "/assets/how-it-works/step-3-icon.svg",
  "/assets/how-it-works/step-4-icon.svg",
];

const N = STEPS.length;

// Scroll distance for ONE step = 70% of the screen height, but never less than 480px.
// (Written in CSS so the browser does the sizing: no JavaScript measuring, no layout jumps.)
const STEP_CSS = "max(480px, 70svh)";

const CARD_W = 590;
const CARD_H = 450;

const GRADIENT_TEXT =
  "bg-[linear-gradient(95.57deg,#3659FF_-37.81%,#4F60FF_45.96%,#8157F7_115.03%)] bg-clip-text text-transparent";

/* ---------------------------------------------------------------
   Blue background with "x" marks that pop on hover
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
            className="h-2 w-2 text-white/25 transition-all duration-700 ease-out will-change-transform group-hover:scale-[2.2] group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.95)] group-hover:duration-150 sm:h-2.5 sm:w-2.5"
          >
            <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </span>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------
   One animation layer (all 4 stacked, only the active one visible)
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

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (isActive) lottieRef.current?.goToAndPlay(0, true);
      else lottieRef.current?.pause();
    });
    return () => cancelAnimationFrame(id);
  }, [isActive]);

  const position = isActive
    ? "translate-y-0 opacity-100"
    : index < active
      ? "-translate-y-4 opacity-0"
      : "translate-y-4 opacity-0";

  return (
    <div
      className={`pointer-events-none absolute inset-0 transition-[opacity,transform] duration-500 ease-out ${position}`}
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
  const frameRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  // Active step comes straight from how far we scrolled while the frame is pinned.
  useEffect(() => {
    const el = trackRef.current;
    const frame = frameRef.current;
    const spacer = spacerRef.current;
    if (!el || !frame || !spacer) return;
    let raf = 0;

    // "position: sticky" silently stops working if ANY parent has overflow hidden/auto/scroll.
    // That is what leaves a big empty white gap (the pinned frame scrolls away, the spacer stays).
    // Switch such parents to "overflow: clip": same visual clipping, but sticky works again.
    const fixed: { node: HTMLElement; prev: string }[] = [];
    const htmlOverflow = getComputedStyle(document.documentElement).overflow;
    for (let node = frame.parentElement; node && node !== document.documentElement; node = node.parentElement) {
      if (node === document.body && htmlOverflow === "visible") break; // body overflow goes to the viewport, fine
      const cs = getComputedStyle(node);
      const bad = (v: string) => v !== "visible" && v !== "clip";
      if (bad(cs.overflowX) || bad(cs.overflowY)) {
        fixed.push({ node, prev: node.style.overflow });
        node.style.overflow = "clip";
      }
    }

    // The frame's own height -> CSS variable, so CSS can centre it exactly on screen.
    // (No React state, and the screen height is not measured, so the phone address bar can't cause jumps.)
    const setFrameHeight = () => frame.style.setProperty("--frame-h", `${frame.offsetHeight}px`);
    setFrameHeight();
    const ro = new ResizeObserver(() => {
      setFrameHeight();
      onScroll();
    });
    ro.observe(frame);

    const update = () => {
      raf = 0;
      const total = spacer.offsetHeight; // how far the frame can travel while it is pinned
      if (total <= 0) return;

      // How far the frame has been "carried" down inside its track by sticky = how far we scrolled while pinned.
      // (Measured from real positions, so it does not depend on the sticky `top` value or the screen size.)
      const carried = frame.getBoundingClientRect().top - el.getBoundingClientRect().top;
      const scrolled = Math.min(total, Math.max(0, carried));

      // The pinned distance is split into N equal parts, one per step.
      const f = (scrolled / total) * N; // 0 .. N
      const GAP = 0.06; // small dead zone at every boundary, so it never flickers between two steps

      let next = activeRef.current;
      while (next < N - 1 && f >= next + 1 + GAP) next++;
      while (next > 0 && f <= next - GAP) next--;
      if (next !== activeRef.current) {
        activeRef.current = next;
        setActive(next);
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      fixed.forEach(({ node, prev }) => (node.style.overflow = prev));
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      id="how-it-works"
      className="relative z-10 -mt-10 w-full rounded-t-[32px] bg-white md:-mt-14 md:rounded-t-[56px]"
    >
      {/* Track = the pinned frame + an invisible spacer that gives the scroll distance for steps 2, 3 and 4.
          The frame is only as tall as its content, so the section ends right after it (no extra gap below). */}
      <div ref={trackRef}>
        <div
          ref={frameRef}
          /* pinned just BELOW the navbar, centred in the space that is left */
          style={{ top: "calc(var(--nav-h) + max(0px, (100svh - var(--nav-h) - var(--frame-h, 560px)) / 2))" }}
          className="sticky flex flex-col gap-4 px-4 py-5 [--nav-h:64px] sm:gap-6 sm:px-8 sm:py-6 md:[--nav-h:80px] md:gap-8 md:px-12 md:py-8 lg:gap-8 lg:px-20 lg:py-8"
        >
          {/* Headings */}
          <div className="mx-auto grid w-full max-w-360 items-start gap-1 sm:gap-2 lg:grid-cols-[1fr_590px] lg:gap-16">
            <h2 className="font-display text-[16px] font-normal leading-[24px] text-[#1C1C1E] sm:text-[20px] sm:leading-[28px] md:text-[26px] md:leading-[36px] lg:text-[36px] lg:leading-[48px]">
              Let AI Understand Your Business First
            </h2>

            <h2 className="font-display text-[24px] font-medium leading-[31px] sm:text-[28px] sm:leading-[36px] md:text-[38px] md:leading-[48px] lg:text-[50px] lg:leading-[62px]">
              <span className={GRADIENT_TEXT}>From </span>
              <span className="text-[#1C1C1E]">Business Data</span>
              <br />
              <span className={GRADIENT_TEXT}>to Marketing Intelligence</span>
            </h2>
          </div>

          {/* Content: card first + text under it on small/medium, text left + card right on large */}
          <div className="mx-auto grid w-full max-w-360 items-center gap-5 sm:gap-6 lg:grid-cols-[1fr_590px] lg:gap-16">
            {/* LEFT: logo + text (under the card on small screens) */}
            <div className="order-2 flex flex-row items-start gap-3 lg:order-1 lg:flex-col lg:gap-4">
              <div className="relative mt-0.5 h-10 w-10 shrink-0 sm:h-11 sm:w-11 lg:mt-0 lg:h-16 lg:w-16" aria-hidden="true">
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

              {/* All texts share ONE grid cell, so the height fits the tallest text (no fixed gap) */}
              <div className="grid min-w-0 flex-1 lg:max-w-[449px]">
                {STEPS.map((step, i) => (
                  <div
                    key={step.title}
                    aria-hidden={i !== active}
                    className={`col-start-1 row-start-1 transition-[opacity,transform] duration-500 ease-out ${
                      i === active
                        ? "translate-y-0 opacity-100"
                        : i < active
                          ? "pointer-events-none -translate-y-3 opacity-0"
                          : "pointer-events-none translate-y-3 opacity-0"
                    }`}
                  >
                    <h3 className="font-display text-[18px] font-medium leading-[25px] text-[#1C1C1E] sm:text-[19px] sm:leading-[28px] lg:text-[24px] lg:leading-[36px]">
                      {step.title}
                    </h3>
                    <p className="mt-1 font-body text-[14px] font-normal leading-[22px] text-[#62625F] sm:text-[15px] sm:leading-[23px] lg:mt-2 lg:text-[17px] lg:leading-[28px]">
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: blue card. On phones its width also shrinks on short screens so everything fits on ONE screen */}
            <div className="relative order-1 mx-auto aspect-[590/450] w-full max-w-[max(200px,min(340px,calc((100svh_-_400px)*1.311)))] overflow-hidden rounded-[20px] bg-[linear-gradient(95.57deg,#3659FF_-37.81%,#4F60FF_45.96%,#8157F7_115.03%)] shadow-[0_20px_60px_rgba(91,92,240,0.25)] sm:max-w-[max(240px,min(440px,calc((100svh_-_420px)*1.311)))] md:max-w-[max(280px,min(500px,calc((100svh_-_440px)*1.311)))] lg:order-2 lg:mx-0 lg:max-w-[590px] lg:rounded-[32px]">
              <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
              <XPattern />
              {STEPS.map((step, i) => (
                <AnimationLayer key={step.title} data={step.animationData} box={step.box} index={i} active={active} />
              ))}
            </div>
          </div>
        </div>

        {/* Invisible scroll distance (3 steps). While you scroll through it, the frame stays pinned. */}
        <div ref={spacerRef} aria-hidden="true" style={{ height: `calc(${N - 1} * ${STEP_CSS})` }} />
      </div>
    </section>
  );
}