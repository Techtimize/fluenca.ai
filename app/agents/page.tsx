"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Pause, Play, Sparkles, Zap } from "lucide-react";
import { AGENTS, accentStyles, type AgentStory } from "@/components/agents/agents-data";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { FOCUS_RING } from "@/utils/ui-classes";
import AgentChapter from "@/components/agents/agentchapter";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

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
  const [paused, setPaused] = useState(false);
  const [fast, setFast] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const orbit = orbitRef.current;
    const nodes = nodesRef.current.filter(Boolean);
    if (!orbit || nodes.length === 0) return;

    const radius = window.innerWidth < 640 ? 118 : 168;
    const duration = fast ? 14 : 36;

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
    if (paused) tweenRef.current.forEach((t) => t.pause());
    return () => {
      tweenRef.current.forEach((t) => t.kill());
      tweenRef.current = [];
    };
  }, [fast, reduceMotion]);

  useEffect(() => {
    tweenRef.current.forEach((t) => {
      if (paused) t.pause();
      else t.resume();
    });
  }, [paused]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F7F8FF] text-[#1C1C1E]">
      {/* Brand ambient gradient */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-32 -top-24 size-[28rem] rounded-full bg-[#C7CBFF]/55 blur-3xl" />
        <div className="absolute -right-24 top-[18%] size-[24rem] rounded-full bg-[#E4D4FF]/60 blur-3xl" />
        <div className="absolute bottom-[-10%] left-1/3 size-[28rem] rounded-full bg-[#DDE0FF]/50 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_55%)]" />
      </div>

      <header className="sticky top-0 z-30 border-b border-[#E6E8F5]/80 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className={`flex items-center gap-2.5 ${FOCUS_RING}`}>
            <Image
              src="/assets/Logo.svg"
              alt="Fluenca"
              width={28}
              height={28}
              className="size-7"
            />
            <span className="text-[17px] font-semibold tracking-tight">
              Fluenca
              <span className="text-[#5452F6]">.ai</span>
            </span>
            <span className="hidden rounded-full border border-[#D9DCF7] bg-[#EEF0FF] px-2 py-0.5 text-[10px] font-semibold text-[#5452F6] sm:inline">
              Agent Engine
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-neutral-600 md:flex">
            <a href="#mascot-orbit" className="hover:text-[#5452F6]">
              Orbit
            </a>
            <a href="#agents-showcase" className="hover:text-[#5452F6]">
              Agent stories
            </a>
            <a href="#pipeline-specs" className="hover:text-[#5452F6]">
              Architecture
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              className={`inline-flex h-9 items-center gap-1.5 rounded-full border border-[#D9DCF7] bg-white px-3 text-xs font-semibold text-neutral-700 hover:bg-[#EEF0FF] ${FOCUS_RING}`}
            >
              {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
              {paused ? "Resume" : "Pause"}
            </button>
            <button
              type="button"
              onClick={() => setFast((value) => !value)}
              className={`inline-flex h-9 items-center gap-1.5 rounded-full border border-[#D9DCF7] bg-white px-3 text-xs font-semibold text-neutral-700 hover:bg-[#EEF0FF] ${FOCUS_RING}`}
            >
              <Zap className="size-3.5 text-[#5452F6]" />
              {fast ? "Fast" : "Normal"}
            </button>
            <Link
              href={PAGE_ROUTES.SIGNUP}
              className={`hidden h-9 items-center rounded-full bg-linear-to-r from-[#4F46E5] to-[#8B5CF6] px-4 text-xs font-semibold text-white shadow-[0_10px_24px_-12px_rgba(79,70,229,0.8)] sm:inline-flex ${FOCUS_RING}`}
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <section id="mascot-orbit" className="relative z-10 px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#D9DCF7] bg-white/80 px-3.5 py-1.5 text-xs font-medium text-[#5452F6] shadow-sm"
          >
            <Sparkles className="size-3.5" />
            How Fluenca agents work together
          </motion.div>
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mx-auto mt-5 max-w-4xl text-[34px] font-semibold leading-[1.12] tracking-tight text-[#1C1C1E] sm:text-[48px] sm:leading-[1.1] lg:text-[56px]"
          >
            Meet the minds behind your{" "}
            <span className="bg-linear-to-r from-[#4F46E5] via-[#5452F6] to-[#8B5CF6] bg-clip-text text-transparent">
              autonomous growth pipeline
            </span>
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-[#62625F] sm:text-[17px]"
          >
            Four specialized Fluenca agents stay in sync — intake, DNA, SEO, and
            media. Watch the orbit, then open each story to see how the system
            turns research into publish-ready content.
          </motion.p>

          <div className="relative mx-auto mt-12 flex items-center justify-center sm:mt-14">
            <div className="relative size-[320px] sm:size-[460px]">
              <div className="absolute inset-0 rounded-full border border-dashed border-[#C7CBFF]/80" />
              <div className="absolute inset-8 rounded-full border border-[#D9DCF7]" />
              <div className="absolute inset-16 rounded-full border border-dotted border-[#C7CBFF]/70 sm:inset-20" />

              <div className="absolute inset-0 m-auto flex size-32 flex-col items-center justify-center rounded-full border border-[#D9DCF7] bg-white text-center shadow-[0_20px_50px_-24px_rgba(79,70,229,0.55)] sm:size-36">
                  <Image
                   src="/assets/logo.svg" 
                   alt="Fluenca" width={80} height={80} className="size-20" />
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
                        className={`relative size-full rounded-full border-2 object-cover shadow-xl ${accentStyles[agent.accent].ring}`}
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
        <motion.div
          className="flex flex-col justify-between gap-4 border-b border-[#E6E8F5] pb-6 md:flex-row md:items-end"
          initial={reduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5452F6]">
              Chronicles & engineering
            </p>
            <h2 className="mt-1 text-[28px] font-semibold tracking-tight text-[#1C1C1E] sm:text-[34px]">
              Agent stories & visual lab
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#62625F]">
            Each agent pairs a live working loop with its operational blueprint —
            the same flow Fluenca runs for every company.
          </p>
        </motion.div>

        {AGENTS.map((agent, index) => (
          <AgentChapter key={agent.id} agent={agent} index={index} />
        ))}
      </main>
    </div>
  );
}
