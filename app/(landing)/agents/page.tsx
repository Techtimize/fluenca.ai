"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { motion, useReducedMotion } from "framer-motion";
import {
  AGENTS,
  accentStyles,
  type AgentStory,
} from "@/components/agents/agents-data";
import { FOCUS_RING } from "@/utils/ui-classes";
import AgentChapter from "@/components/agents/agentchapter";
import FooterSection from "@/components/landing/footer-section";

/** One full orbit rotation, in seconds (the former "Normal" speed). */
const ORBIT_DURATION_SECONDS = 36;

function scrollToAgent(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  el.classList.add("ring-2", "ring-[#5452F6]/50");
  window.setTimeout(() => {
    el.classList.remove("ring-2", "ring-[#5452F6]/50");
  }, 1600);
}

export default function AgentsPage() {
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<HTMLDivElement[]>([]);
  const tweenRef = useRef<gsap.core.Tween[]>([]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const orbit = orbitRef.current;
    const nodes = nodesRef.current.filter(Boolean);
    if (!orbit || nodes.length === 0) return;

    const radius = window.innerWidth < 640 ? 118 : 168;
    const duration = ORBIT_DURATION_SECONDS;

    nodes.forEach((node, i) => {
      const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
      gsap.set(node, {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        xPercent: -50,
        yPercent: -50,
      });
    });

    const orbitTween = gsap.to(orbit, {
      rotation: 360,
      duration,
      ease: "none",
      repeat: -1,
    });
    const nodeTweens = nodes.map((node) =>
      gsap.to(node, {
        rotation: -360,
        duration,
        ease: "none",
        repeat: -1,
      }),
    );
    tweenRef.current = [orbitTween, ...nodeTweens];
    return () => {
      tweenRef.current.forEach((t) => t.kill());
      tweenRef.current = [];
    };
  }, [reduceMotion]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F7F8FF] text-[#1C1C1E]">
      {/* Brand ambient gradient */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-32 -top-24 size-[28rem] rounded-full bg-[#C7CBFF]/55 blur-3xl" />
        <div className="absolute -right-24 top-[18%] size-[24rem] rounded-full bg-[#E4D4FF]/60 blur-3xl" />
        <div className="absolute bottom-[-10%] left-1/3 size-[28rem] rounded-full bg-[#DDE0FF]/50 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_55%)]" />
      </div>

      <section
        id="mascot-orbit"
        className="relative z-10 px-4 pb-16 pt-8 sm:px-6 sm:pt-10 lg:px-8"
      >
        <div className="mx-auto max-w-7xl text-center">
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mx-auto mt-0 max-w-4xl text-[34px] font-semibold leading-[1.12] tracking-tight text-[#1C1C1E] sm:text-[48px] sm:leading-[1.1] lg:text-[56px]"
          >
            Meet the minds behind your{" "}
            <span className="bg-linear-to-r from-[#4F46E5] via-[#5452F6] to-[#8B5CF6] bg-clip-text text-transparent">
              autonomous growth pipeline
            </span>
          </motion.h1>

          <div className="relative mx-auto mt-12 flex items-center justify-center sm:mt-14">
            <div className="relative size-[320px] sm:size-[460px]">
              <div className="absolute inset-0 rounded-full border border-dashed border-[#C7CBFF]/80" />
              <div className="absolute inset-8 rounded-full border border-[#D9DCF7]" />
              <div className="absolute inset-16 rounded-full border border-dotted border-[#C7CBFF]/70 sm:inset-20" />

              <div className="absolute inset-0 m-auto flex size-32 flex-col items-center justify-center rounded-full border border-[#D9DCF7] bg-white text-center shadow-[0_20px_50px_-24px_rgba(79,70,229,0.55)] sm:size-36">
                <Image
                  src="/assets/logo.svg"
                  alt="Fluenca"
                  width={80}
                  height={80}
                  className="size-20"
                />
              </div>
              <div ref={orbitRef} className="absolute inset-0">
                {AGENTS.map((agent, index) => (
                  <div
                    key={agent.id}
                    ref={(el) => {
                      if (el) nodesRef.current[index] = el;
                    }}
                    className="absolute left-1/2 top-1/2"
                  >
                    <button
                      type="button"
                      onClick={() => scrollToAgent(agent.id)}
                      className={`group relative block size-[76px] focus:outline-none sm:size-[100px] ${FOCUS_RING}`}
                      title={`View ${agent.name}`}
                    >
                      <span
                        className={`absolute -inset-1 rounded-full bg-linear-to-r ${accentStyles[agent.accent].bar} opacity-40 blur-sm transition group-hover:opacity-80`}
                      />
                      <Image
                        src={agent.image}
                        alt={agent.name}
                        className={`relative size-full rounded-full border-2 object-cover bg-transparent shadow-xl ${accentStyles[agent.accent].ring}`}
                        width={100}
                        height={100}
                      />
                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#E6E8F5] bg-white px-2 py-0.5 text-[10px] font-semibold text-neutral-700 shadow-sm">
                        {agent.role}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mx-auto mt-14 flex max-w-2xl flex-wrap items-center justify-center gap-2 rounded-2xl border border-[#E6E8F5] bg-white/90 p-1.5 shadow-sm">
            {AGENTS.map((agent) => (
              <button
                key={agent.id}
                type="button"
                onClick={() => scrollToAgent(agent.id)}
                className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-600 transition hover:bg-[#EEF0FF] hover:text-[#5452F6] ${FOCUS_RING}`}
              >
                <span
                  className={`size-2 rounded-full ${
                    agent.accent === "amber"
                      ? "bg-amber-400"
                      : agent.accent === "indigo"
                        ? "bg-[#5452F6]"
                        : agent.accent === "emerald"
                          ? "bg-emerald-400"
                          : "bg-violet-400"
                  }`}
                />
                {agent.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main
        id="agents-showcase"
        className="relative z-10 mx-auto max-w-7xl space-y-10 px-4 pb-24 sm:px-6 lg:px-8"
      >
        {AGENTS.map((agent, index) => (
          <AgentChapter key={agent.id} agent={agent} index={index} />
        ))}
      </main>
      <FooterSection />
    </div>
  );
}
