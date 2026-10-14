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


/** Four scroll steps mapped onto the eight-floor office pipeline */
const STEPS = [
  {
    title: "hassnain intakes your brand.",
    text: "Share your website and basics. Intake crawls your site and drafts verified Q&A — a clean brief, no blank forms.",
    animationData: step1Animation,
    box: { left: 131, top: 78, width: 328, height: 370, lift: 0 },
    pipelineThrough: 0,
  },
  {
    title: "Ilsa maps rivals. Raheel locks DNA.",
    text: "Competitor intel lands with DNA & Strategy. You confirm every answer once — that immutable Company DNA becomes the source of truth for every later agent.",
    animationData: step2Animation,
    box: { left: 31, top: 53, width: 527, height: 338, lift: 30 },
    pipelineThrough: 3,
  },
  {
    title: "Talha plans. Sayyam creates.",
    text: "Topical SEO turns DNA into pillars and keyword briefs. Media & Creative ships posts, carousels, and scripts that stay on-brand because they never leave the DNA lane.",
    animationData: step3Animation,
    box: { left: 42, top: 61, width: 506, height: 329, lift: 30 },
    pipelineThrough: 5,
  },
  {
    title: "Arslan proves it. Hira hits the goal.",
    text: "Analytics closes the loop with attribution packs. Goal Achiever keeps targets on track — then insights feed the next crawl so every cycle gets sharper.",
    animationData: step4Animation,
    box: { left: 40, top: 45, width: 524, height: 379, lift: 15 },
    pipelineThrough: 7,
  },
];

const STEP_ICONS = [
  "/assets/how-it-works/step-1-icon.svg",
  "/assets/how-it-works/step-2-icon.svg",
  "/assets/how-it-works/step-3-icon.svg",
  "/assets/how-it-works/step-4-icon.svg",
];

const N = STEPS.length;

const STEP_CSS = "max(480px, 70svh)";

const CARD_W = 590;
const CARD_H = 450;

const GRADIENT_TEXT =
  "bg-[linear-gradient(95.57deg,#3659FF_-37.81%,#4F60FF_45.96%,#8157F7_115.03%)] bg-clip-text text-transparent";



function XPattern() {
  const COLS = 14;
  const ROWS = 12;
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

export default function HowItWorks() {
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    const el = trackRef.current;
    const frame = frameRef.current;
    const spacer = spacerRef.current;
    if (!el || !frame || !spacer) return;
    let raf = 0;

    const fixed: { node: HTMLElement; prev: string }[] = [];
    const htmlOverflow = getComputedStyle(document.documentElement).overflow;
    for (let node = frame.parentElement; node && node !== document.documentElement; node = node.parentElement) {
      if (node === document.body && htmlOverflow === "visible") break;
      const cs = getComputedStyle(node);
      const bad = (v: string) => v !== "visible" && v !== "clip";
      if (bad(cs.overflowX) || bad(cs.overflowY)) {
        fixed.push({ node, prev: node.style.overflow });
        node.style.overflow = "clip";
      }
    }

    const setFrameHeight = () => frame.style.setProperty("--frame-h", `${frame.offsetHeight}px`);
    setFrameHeight();
    const ro = new ResizeObserver(() => {
      setFrameHeight();
      onScroll();
    });
    ro.observe(frame);

    const update = () => {
      raf = 0;
      const total = spacer.offsetHeight;
      if (total <= 0) return;

      const carried = frame.getBoundingClientRect().top - el.getBoundingClientRect().top;
      const scrolled = Math.min(total, Math.max(0, carried));
      const f = (scrolled / total) * N;
      const GAP = 0.06;

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
      fixed.forEach(({ node, prev }) => {
        node.style.overflow = prev;
      });
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      id="how-it-works"
      className="relative z-10 w-full rounded-t-[32px] bg-white md:rounded-t-[56px]"
    >
      <div ref={trackRef}>
        <div
          ref={frameRef}
          style={{
            top: "calc(var(--nav-h) + max(0px, (100svh - var(--nav-h) - var(--frame-h, 560px)) / 2))",
          }}
          className="sticky flex flex-col gap-4 px-4 py-5 [--nav-h:64px] sm:gap-6 sm:px-8 sm:py-6 md:[--nav-h:80px] md:gap-8 md:px-12 md:py-8 lg:gap-8 lg:px-20 lg:py-8"
        >
          <div className="mx-auto grid w-full max-w-360 items-center gap-5 sm:gap-6 lg:grid-cols-[1fr_590px] lg:gap-16">
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
                    <p className="font-body text-[14px] font-normal leading-[22px] text-[#62625F] sm:text-[15px] sm:leading-[23px] lg:mt-2 lg:text-[17px] lg:leading-[28px]">
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative order-1 mx-auto aspect-[590/450] w-full max-w-[max(200px,min(340px,calc((100svh_-_400px)*1.311)))] overflow-hidden rounded-[20px] bg-[linear-gradient(95.57deg,#3659FF_-37.81%,#4F60FF_45.96%,#8157F7_115.03%)] shadow-[0_20px_60px_rgba(91,92,240,0.25)] sm:max-w-[max(240px,min(440px,calc((100svh_-_420px)*1.311)))] md:max-w-[max(280px,min(500px,calc((100svh_-_440px)*1.311)))] lg:order-2 lg:mx-0 lg:max-w-[590px] lg:rounded-[32px]">
              <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
              <XPattern />
              {STEPS.map((step, i) => (
                <AnimationLayer
                  key={step.title}
                  data={step.animationData}
                  box={step.box}
                  index={i}
                  active={active}
                />
              ))}
            </div>
          </div>
        </div>

        <div ref={spacerRef} aria-hidden="true" style={{ height: `calc(${N - 1} * ${STEP_CSS})` }} />
      </div>
    </section>
  );
}
