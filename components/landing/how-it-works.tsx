"use client";

// components/landing/how-it-works.tsx
//
// Scroll section:
//  - the blue card stays pinned (sticky) on the right
//  - every time you scroll down to the next step:
//      * the left text blends into the next text (soft fade, NO blur)
//      * the right side blends into the next animation (soft fade)
//      * the blue layer of the icon moves to the next layer (1, 2, 3, 4)
//  - each step is always fully sharp and clear when you stop scrolling
//  - the "x" marks on the blue background pop + glow when the mouse touches them
//
// ⚠️ Do not put "overflow-hidden" on the <section> below, it would break "sticky".

import { useEffect, useRef, useState } from "react";
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
    text: "Add your website, industry, products or services, and language. Fluenca.ai will research your business and build your Company DNA from streams you confirm.",
    animationData: step1Animation,
  },
  {
    title: "Review Your Business Insights",
    text: "Our AI agents research your business and prepare key insights for review. Refine the information if needed, then unlock deeper analytics, recommendations, and personalized suggestions for your goals.",
    animationData: step2Animation,
  },
  {
    title: "Turn Insights Into Marketing That Works",
    text: "Explore your analytics, set your goals, and let Fluenca's AI agents turn your business intelligence into action. Create blogs, case studies, social content, campaigns, and more all tailored to your business and goals.",
    animationData: step3Animation,
  },
  {
    title: "From Your Goals to Great Content",
    text: "Get a personalized content plan based on your goals, then preview, schedule, and publish content that moves your business forward.",
    animationData: step4Animation,
  },
];

const N = STEPS.length;
const SCROLL_PER_STEP_VH = 90; // scrolling needed for each step (bigger = slower)
const LAYER_GAP = 11; // distance between the layers of the icon

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
---------------------------------------------------------------- */
function AnimationLayer({ data, index, active }: { data: unknown; index: number; active: number }) {
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
      className={`pointer-events-none absolute inset-0 flex items-center justify-center p-6 transition-[opacity,transform] duration-700 ease-out ${position}`}
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
  );
}

/* ---------------------------------------------------------------
   SECTION
---------------------------------------------------------------- */
export default function HowItWorks() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // which step is active, based on how far we scrolled through the track
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      const idx = Math.min(N - 1, Math.floor(progress * N));
      setActive((prev) => (prev === idx ? prev : idx));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section id="how-it-works" className="w-full bg-white">
      {/* Headings (normal scrolling) */}
      <div className="mx-auto max-w-6xl px-6 pb-8 pt-20 md:pt-28">
        <div className="grid items-start gap-6 md:grid-cols-2 md:gap-16">
          <h2 className="max-w-xs text-xl font-medium leading-snug text-slate-800 md:text-2xl">
            Let AI Understand Your Business First
          </h2>
          <h2 className="text-3xl font-semibold leading-tight text-indigo-500 md:text-4xl">
            From <span className="text-slate-900">Business Data</span>
            <br />
            to <span className="text-slate-900">Marketing Intelligence</span>
          </h2>
        </div>
      </div>

      {/* Tall scroll track: the pinned frame stays on screen while you scroll through it */}
      <div ref={trackRef} style={{ height: `${N * SCROLL_PER_STEP_VH}vh` }}>
        <div className="sticky top-0 flex h-screen items-center pt-16">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-6 px-6 md:grid-cols-2 md:gap-16">
            {/* LEFT: layers icon + text that blends from one step to the next */}
            <div>
              {/* Layers icon: the blue layer is on layer 1, 2, 3 or 4 depending on the step */}
              <svg viewBox="0 0 64 64" aria-hidden className="h-14 w-14 md:h-16 md:w-16">
                <defs>
                  <linearGradient id="hiw-blue" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#4F46E5" />
                    <stop offset="1" stopColor="#6D6BFF" />
                  </linearGradient>
                </defs>

                {/* the 4 light layers (bottom one is drawn first) */}
                {[3, 2, 1, 0].map((k) => (
                  <rect
                    key={k}
                    x="-17"
                    y="-17"
                    width="34"
                    height="34"
                    rx="6"
                    fill="#E4E7FF"
                    stroke="#fff"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                    transform={`translate(32 ${15 + k * LAYER_GAP}) scale(1 0.55) rotate(45)`}
                  />
                ))}

                {/* the blue layer: glides to the layer of the current step */}
                <g
                  style={{
                    transform: `translateY(${active * LAYER_GAP}px)`,
                    transition: "transform 600ms cubic-bezier(0.4, 0, 0.2, 1)",
                    filter: "drop-shadow(0 4px 6px rgba(79,70,229,0.35))",
                  }}
                >
                  <rect
                    x="-17"
                    y="-17"
                    width="34"
                    height="34"
                    rx="6"
                    fill="url(#hiw-blue)"
                    stroke="#fff"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                    transform="translate(32 15) scale(1 0.55) rotate(45)"
                  />
                </g>
              </svg>

              <div className="relative mt-5 h-[220px] md:h-[230px]">
                {STEPS.map((step, i) => (
                  <div
                    key={step.title}
                    aria-hidden={i !== active}
                    className={`absolute inset-x-0 top-0 max-w-sm transition-[opacity,transform] duration-700 ease-out ${
                      i === active
                        ? "translate-y-0 opacity-100"
                        : i < active
                          ? "pointer-events-none -translate-y-3 opacity-0"
                          : "pointer-events-none translate-y-3 opacity-0"
                    }`}
                  >
                    <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: blue card + x marks + the 4 animations (one visible at a time) */}
            <div className="relative h-[300px] w-full overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#4F62FF_0%,#6B5CF6_100%)] shadow-[0_20px_60px_rgba(91,92,240,0.25)] md:h-[min(540px,68vh)]">
              {/* soft light in the corner */}
              <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-3xl" />

              <XPattern />

              {STEPS.map((step, i) => (
                <AnimationLayer key={step.title} data={step.animationData} index={i} active={active} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}