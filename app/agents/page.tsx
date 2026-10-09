"use client";

import { useRef, useState, useEffect } from "react";

export default function AgentsPage() {
  const orbitRingRef = useRef<HTMLDivElement>(null);
  const orbitContainerRef = useRef<HTMLDivElement>(null);
  const [currentSpeed, setCurrentSpeed] = useState<"normal" | "fast" | "paused">("normal");
  const [speedLabel, setSpeedLabel] = useState("Normal");
  const [dotColor, setDotColor] = useState("bg-emerald-400");

  const toggleOrbitSpeed = () => {
    if (!orbitRingRef.current) return;
    const nodes = document.querySelectorAll(".avatar-node") as NodeListOf<HTMLElement>;

    if (currentSpeed === "normal") {
      orbitRingRef.current.style.animationDuration = "14s";
      nodes.forEach((n) => (n.style.animationDuration = "14s"));
      orbitRingRef.current.classList.remove("paused");
      setCurrentSpeed("fast");
      setSpeedLabel("High Speed");
      setDotColor("bg-cyan-400 animate-ping");
    } else if (currentSpeed === "fast") {
      orbitRingRef.current.classList.add("paused");
      setCurrentSpeed("paused");
      setSpeedLabel("Paused");
      setDotColor("bg-amber-400");
    } else {
      orbitRingRef.current.style.animationDuration = "38s";
      nodes.forEach((n) => (n.style.animationDuration = "38s"));
      orbitRingRef.current.classList.remove("paused");
      setCurrentSpeed("normal");
      setSpeedLabel("Normal");
      setDotColor("bg-emerald-400");
    }
  };

  const scrollToAgent = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      el.classList.add("ring-2", "ring-blue-500/80");
      setTimeout(() => {
        el.classList.remove("ring-2", "ring-blue-500/80");
      }, 1800);
    }
  };

  useEffect(() => {
    const container = orbitContainerRef.current;
    const orbitRing = orbitRingRef.current;
    if (!container || !orbitRing) return;

    const handleMouseEnter = () => {
      if (currentSpeed !== "paused") {
        orbitRing.classList.add("paused");
      }
    };

    const handleMouseLeave = () => {
      if (currentSpeed !== "paused") {
        orbitRing.classList.remove("paused");
      }
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [currentSpeed]);

  return (
    <div className="bg-[#090D16] text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white min-h-screen relative overflow-x-hidden">
      {/* Ambient Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl rounded-full"></div>
        <div className="absolute top-[40%] -left-[10%] w-[600px] h-[600px] bg-violet-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute top-[70%] -right-[10%] w-[600px] h-[600px] bg-cyan-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-20"></div>
      </div>

      {/* Navigation Bar */}
      <header className="relative z-20 border-b border-slate-800/80 bg-[#090d16]/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Fluenca<span className="text-blue-500">.ai</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-mono tracking-wider font-semibold rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                AGENT ENGINE v2.5
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#mascot-orbit" className="hover:text-white transition-colors flex items-center gap-1.5 text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span> Orbit Hall
            </a>
            <a href="#agents-showcase" className="hover:text-white transition-colors">
              Agent Stories
            </a>
            <a href="#pipeline-specs" className="hover:text-white transition-colors">
              Architecture & Specs
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleOrbitSpeed}
              className="px-3.5 py-1.5 text-xs font-mono rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-700 text-slate-300 transition-all flex items-center gap-2"
            >
              <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
              <span>
                Orbit: <strong>{speedLabel}</strong>
              </span>
            </button>
            <a
              href="#agents-showcase"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all"
            >
              Explore Squad
            </a>
          </div>
        </div>
      </header>

      {/* Top Hero & Mascot Circular Orbit Section */}
      <section id="mascot-orbit" className="relative z-10 pt-12 pb-20 sm:pt-16 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-medium mb-6">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Autonomous Multi-Agent Intelligence Collective
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Meet the Minds Behind the <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              Autonomous Growth Pipeline
            </span>
          </h1>

          <p className="mt-4 text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Four specialized AI agent mascots in continuous synchronization. Watch their orbital motion below, select any avatar, and dive into their animated video breakdown and backstory.
          </p>

          {/* Circular Orbit Stage */}
          <div className="mt-12 sm:mt-16 relative flex items-center justify-center">
            <div className="orbit-container" ref={orbitContainerRef}>
              {/* Outer guide circles */}
              <div className="absolute inset-0 rounded-full border border-blue-500/20 border-dashed animate-[spin_120s_linear_infinite]"></div>
              <div className="absolute inset-8 rounded-full border border-indigo-500/15"></div>
              <div className="absolute inset-20 rounded-full border border-cyan-500/20 border-dotted"></div>

              {/* Central Core Hub */}
              <div className="absolute inset-0 m-auto w-36 h-36 rounded-full bg-gradient-to-b from-slate-900 to-[#0a0f1d] border border-blue-500/40 shadow-[0_0_60px_-15px_rgba(59,130,246,0.6)] flex flex-col items-center justify-center z-10 p-3 text-center backdrop-blur-md">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white mb-1 shadow-md shadow-blue-500/50">
                  <svg className="w-5 h-5 animate-spin" style={{ animationDuration: "10s" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                </div>
                <span className="text-xs font-bold text-white tracking-wide">CORE ORCHESTRATOR</span>
                <span className="text-[10px] font-mono text-cyan-400 mt-0.5">LlmTier.STRONG</span>
                <span className="text-[9px] text-slate-400">Claude Sonnet &bull; GPT-4o</span>
              </div>

              {/* Rotating Orbit Ring with Mascots */}
              <div ref={orbitRingRef} className="orbit-ring">
                {/* Avatar 1: Masrur */}
                <div className="avatar-node pos-north">
                  <button
                    onClick={() => scrollToAgent("agent-1")}
                    title="Click to view Masrur's story"
                    className="group relative block w-full h-full focus:outline-none"
                  >
                    <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 opacity-75 blur-sm group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-amber-400/80 bg-slate-900 shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDioTMTfciGARTKrMbUEQPMD1j1eY1Z5G6ziEGFTgdf-Xhy0VbkebDIVJmoic_dWQHB29P-ApCU_y7BxNEJIlOXibN_jegKlxkYpHWp55b-T12gFRfXFY8XbtgWg5jXYXQRpiO3ZePikuIum70osCFNwdy0Fdj6XQuZmuU8YwEyguReRStxaS8nBgLNMEYhOwEqIB3FJBDONIOKXmR5by15OB0E8jn23E4TGOnxeVy-v6-L7YQ1av9ndTbucN12qHwbrw"
                        alt="DNA & Architecture Mascot"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 bg-slate-900/90 border border-amber-500/50 rounded-full text-[10px] font-semibold text-amber-300 shadow">
                      DNA & Strategy
                    </div>
                  </button>
                </div>

                {/* Avatar 2: Rayyan */}
                <div className="avatar-node pos-east">
                  <button
                    onClick={() => scrollToAgent("agent-2")}
                    title="Click to view Rayyan's story"
                    className="group relative block w-full h-full focus:outline-none"
                  >
                    <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 opacity-75 blur-sm group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-blue-400/80 bg-slate-900 shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFEjCBVpYcAMxK-leVpdlHox3-gkT015kxmLuktGzMXCHO4phmSXlCC_v_WyGQD0EgrqzQh8E3MODzTHRqgo6chUpkHzsmoKweLeRVtsLwy_aE7Uv6SLyswxcNAimkPxSglx16LBXXs4Cp25b5JG9ScK0FPyjIxTNjePE-e9DM2KRRWl09iWsnTb4CquBGvUAZ-xyAOAvfbZlpyoBj-KQXBsMZItyuBdgRpgoZBU0ORH6Ew2ZPmiUedMnXdVKfqOJFAw"
                        alt="Intake & Research Mascot"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 bg-slate-900/90 border border-blue-500/50 rounded-full text-[10px] font-semibold text-blue-300 shadow">
                      Intake & Crawl
                    </div>
                  </button>
                </div>

                {/* Avatar 3: Talha */}
                <div className="avatar-node pos-south">
                  <button
                    onClick={() => scrollToAgent("agent-3")}
                    title="Click to view Talha's story"
                    className="group relative block w-full h-full focus:outline-none"
                  >
                    <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 opacity-75 blur-sm group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-emerald-400/80 bg-slate-900 shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtOMXvSMwB-6saowK-rehe2CvlGGK8SFCJJvR9NeItup5sRvZsbimq_22NUCcwMZJ6Cog5ZSlIoIad6e1xzJ7jExIB3cMldvPQpEoHfZkxQAm78Gsi8fTnd_0aQqE5GK2hiVkm4bb5bpl_FqjK9ny-WM7PQFqR5-kQ82L-6R6Lf0ji2nK88MFK2fItrpe8Y6OOJc4fe8nHhbr1xFlYZCRpZlupIdCzRElFJWBGcFly-hZqRcZVF7-1enA3nS8RNJiv-g"
                        alt="Keywords & Planner Mascot"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 bg-slate-900/90 border border-emerald-500/50 rounded-full text-[10px] font-semibold text-emerald-300 shadow">
                      SEO & Topics
                    </div>
                  </button>
                </div>

                {/* Avatar 4: Sayyam */}
                <div className="avatar-node pos-west">
                  <button
                    onClick={() => scrollToAgent("agent-4")}
                    title="Click to view Sayyam's story"
                    className="group relative block w-full h-full focus:outline-none"
                  >
                    <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-75 blur-sm group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-purple-400/80 bg-slate-900 shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe-AlaEPUE_WwfHeEO5bu5qnY3fDL3XV8IR2YsuFQC0xVQTcYE1vIyZG20BqNNO1q7NnZw3ZLyuRfI8PfZGgf0-F7JyxYVq1ARqlberO3nCQ_46aLViVvH-XeOjbBIGEmRVIeJj6lM7vVeJTuS39sMqwjLC__94tHwKUkb7pmcO2mrPuuEKM2cd_MmYqDbbomyFdriKAYuaM4B7WyFLEwIt9PpBaOgaX5kVD_47Q9UFd7ZzDnRN8yGKXEyWHoYcKmRIQ"
                        alt="Content & Media Production Mascot"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 bg-slate-900/90 border border-purple-500/50 rounded-full text-[10px] font-semibold text-purple-300 shadow">
                      Media & Viral
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Interactive Switcher Bar */}
          <div className="mt-14 max-w-xl mx-auto flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
            <button
              onClick={() => scrollToAgent("agent-1")}
              className="flex-1 py-2 px-3 rounded-xl hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center justify-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> Masrur (DNA)
            </button>
            <button
              onClick={() => scrollToAgent("agent-2")}
              className="flex-1 py-2 px-3 rounded-xl hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center justify-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-blue-400"></span> Rayyan (Intake)
            </button>
            <button
              onClick={() => scrollToAgent("agent-3")}
              className="flex-1 py-2 px-3 rounded-xl hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center justify-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Talha (SEO)
            </button>
            <button
              onClick={() => scrollToAgent("agent-4")}
              className="flex-1 py-2 px-3 rounded-xl hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center justify-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-purple-400"></span> Sayyam (Media)
            </button>
          </div>

          <div className="mt-4 text-xs text-slate-500 font-mono">
            💡 Pro-tip: Hover or click any avatar above or below to pause the orbit and inspect live logs
          </div>
        </div>
      </section>

      {/* Split Screen: Left Animated Video Showcase / Right Story Content */}
      <main id="agents-showcase" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 space-y-24">
        {/* Header for the Agent Chapters */}
        <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-blue-400">Chronicles & Engineering Details</p>
            <h2 className="text-3xl font-extrabold text-white mt-1">Autonomous Agent Stories & Visual Lab</h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            Each agent pairs dynamic media execution with their complete operational blueprint from the core architecture documentation.
          </p>
        </div>

        {/* AGENT 1: Masrur */}
        <section
          id="agent-1"
          className="scroll-mt-24 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all duration-300"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* LEFT: Video Simulation */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-amber-500/30 video-glow group">
                <div className="aspect-video relative overflow-hidden bg-[#070b14] flex flex-col justify-between p-4">
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-950/40 via-slate-950 to-blue-950/40"></div>
                  <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-amber-500/20 blur-2xl animate-pulse"></div>

                  <div className="relative z-10 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span> ANIMATED FEED &bull; 60 FPS
                    </span>
                    <span className="font-mono text-slate-400 text-[10px]">CLIP: #DNA_SYNTHESIS_01.MP4</span>
                  </div>

                  <div className="relative z-10 my-auto flex items-center justify-center gap-5">
                    <div className="relative">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-lg shadow-amber-500/20">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDioTMTfciGARTKrMbUEQPMD1j1eY1Z5G6ziEGFTgdf-Xhy0VbkebDIVJmoic_dWQHB29P-ApCU_y7BxNEJIlOXibN_jegKlxkYpHWp55b-T12gFRfXFY8XbtgWg5jXYXQRpiO3ZePikuIum70osCFNwdy0Fdj6XQuZmuU8YwEyguReRStxaS8nBgLNMEYhOwEqIB3FJBDONIOKXmR5by15OB0E8jn23E4TGOnxeVy-v6-L7YQ1av9ndTbucN12qHwbrw"
                          alt="Masrur Mascot"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 px-1.5 py-0.5 rounded bg-amber-500 text-[9px] font-bold text-slate-950 uppercase">
                        Architect
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="text-[11px] font-mono text-slate-300 flex justify-between">
                        <span>Synthesizing DNA Profile</span>
                        <span className="text-amber-400 font-bold">1,800 Words</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full w-4/5 animate-[pulse_2s_infinite]"></div>
                      </div>
                      <div className="grid grid-cols-4 gap-1 pt-1 font-mono text-[9px] text-slate-400">
                        <div className="bg-slate-900 p-1 rounded border border-slate-800 text-center">8 Secs</div>
                        <div className="bg-slate-900 p-1 rounded border border-slate-800 text-center">Sonnet 5</div>
                        <div className="bg-slate-900 p-1 rounded border border-slate-800 text-center">0 Halluc</div>
                        <div className="bg-slate-900 p-1 rounded border border-slate-800 text-center text-amber-400">100% Fit</div>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <button className="w-7 h-7 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center transition">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                      <span className="font-mono text-[11px] text-slate-300">01:42 / 03:00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-amber-400/80 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">4K Ultra</span>
                      <svg className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-2 text-xs text-slate-400 font-mono">
                <span>&bull; Rendered with Higgsfield & Gemini Video</span>
                <span className="text-amber-400">Status: Active Run #490</span>
              </div>
            </div>

            {/* RIGHT: Story */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Agent #02 &bull; DNA Agent
                </span>
                <span className="text-xs text-slate-400 font-mono">Entry: agents/dna/dna_generator.py</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Masrur: Guardian of Identity & Strategic Company DNA
              </h3>

              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                Dressed in the distinguished traditional waistcoat and framed glasses, <strong>Masrur</strong> is the elder statesman of the platform. He does not guess, exaggerate, or invent. His sole purpose in the cosmos is to listen to confirmed intake findings and distill them into the immutable <span className="text-amber-300 font-medium">&quot;Company DNA&quot;</span>—the single source of truth referenced by topical maps, keyword engines, content writers, and chatbots alike.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-xs font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Strict Grounding Rules
                  </div>
                  <p className="text-xs text-slate-400">
                    Preserves every concrete metric verbatim. Never pads answers; caps each profile at 1,000–1,800 pristine words across 8 fixed company pillars.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-xs font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Execution Tier & Pipeline
                  </div>
                  <p className="text-xs text-slate-400">
                    Driven by <code className="text-amber-300 font-mono text-[11px]">LlmTier.STRONG</code> (Claude Sonnet 5). Handed off directly to the Topical Map Agent in the exact same worker commit.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-300">
                <div>
                  <span className="text-slate-500">Service:</span> dna_run_service.py
                </div>
                <div>
                  <span className="text-slate-500">Max Tokens:</span> 8,000
                </div>
                <div>
                  <span className="text-slate-500">Prompt:</span> dna-generate-v1
                </div>
                <div>
                  <span className="text-slate-500">Tone:</span> Exacting & Empirical
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AGENT 2: Rayyan */}
        <section
          id="agent-2"
          className="scroll-mt-24 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-all duration-300"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* LEFT: Video Simulation */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-blue-500/30 video-glow group">
                <div className="aspect-video relative overflow-hidden bg-[#070d18] flex flex-col justify-between p-4">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/40 via-slate-950 to-indigo-950/40"></div>
                  <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-blue-500/20 blur-2xl animate-pulse"></div>

                  <div className="relative z-10 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span> CRAWLER SURVEILLANCE
                    </span>
                    <span className="font-mono text-slate-400 text-[10px]">CLIP: #INTAKE_CRAWL_99.MP4</span>
                  </div>

                  <div className="relative z-10 my-auto flex items-center justify-center gap-5">
                    <div className="relative">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-blue-400 shadow-lg shadow-blue-500/20">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFEjCBVpYcAMxK-leVpdlHox3-gkT015kxmLuktGzMXCHO4phmSXlCC_v_WyGQD0EgrqzQh8E3MODzTHRqgo6chUpkHzsmoKweLeRVtsLwy_aE7Uv6SLyswxcNAimkPxSglx16LBXXs4Cp25b5JG9ScK0FPyjIxTNjePE-e9DM2KRRWl09iWsnTb4CquBGvUAZ-xyAOAvfbZlpyoBj-KQXBsMZItyuBdgRpgoZBU0ORH6Ew2ZPmiUedMnXdVKfqOJFAw"
                          alt="Rayyan Mascot"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 px-1.5 py-0.5 rounded bg-blue-500 text-[9px] font-bold text-white uppercase">
                        Scout
                      </div>
                    </div>

                    <div className="flex-1 space-y-1.5 font-mono text-[10px]">
                      <div className="text-blue-300 flex items-center justify-between">
                        <span>Tavily & Firecrawl Sync</span>
                        <span className="text-emerald-400 font-semibold">8/8 Pages Read</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900 border border-blue-500/30 text-slate-300 space-y-1">
                        <div className="truncate text-[9px] text-slate-400">&gt; GET https://company.com/pricing</div>
                        <div className="truncate text-[9px] text-emerald-400">&gt; Match 89% fuzzy quote verified</div>
                        <div className="truncate text-[9px] text-blue-400">&gt; Drafted 20 questions with citations</div>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <button className="w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                      <span className="font-mono text-[11px] text-slate-300">02:15 / 04:30</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-blue-400/80 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">1080p 60fps</span>
                      <svg className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-2 text-xs text-slate-400 font-mono">
                <span>&bull; Web crawler + Tavily Search Loop</span>
                <span className="text-blue-400">Budget Enforced: $0.40/run</span>
              </div>
            </div>

            {/* RIGHT: Story */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  Agent #01 &bull; Intake Agent
                </span>
                <span className="text-xs text-slate-400 font-mono">Entry: agents/intake/intake_agent.py</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Rayyan: The Curious Web Scout & Evidence Inquisitor
              </h3>

              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                In his relaxed plaid button-down and eager gaze, <strong>Rayyan</strong> is the first agent to make contact with any new enterprise. He never asks a business owner to fill out an empty form from scratch. Instead, Rayyan scours the web, reads up to 8 corporate pages, and formulates up to 20 perceptive questions with pre-drafted answers, verified quotes, and source links.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-xs font-semibold text-blue-400 mb-1 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Fuzzy Citation Verification
                  </div>
                  <p className="text-xs text-slate-400">
                    Employs an internal judge call (<code className="text-blue-300 font-mono text-[10px]">intake-judge-answers-v1</code>) requiring 85% word overlap. Any unbacked assertion is demoted and flagged for humans.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-xs font-semibold text-blue-400 mb-1 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Autonomous Search Planning
                  </div>
                  <p className="text-xs text-slate-400">
                    When answers remain unknown, he automatically plans targeted Tavily search rounds, looping 5 queries at a time until evidence surfaces.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-300">
                <div>
                  <span className="text-slate-500">Service:</span> intake_run_service.py
                </div>
                <div>
                  <span className="text-slate-500">Limits:</span> 8 Pages &bull; 3 Rounds
                </div>
                <div>
                  <span className="text-slate-500">Tiers:</span> Claude Haiku 4.5 &amp; Sonnet 5
                </div>
                <div>
                  <span className="text-slate-500">Output:</span> IntakeResult
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AGENT 3: Talha */}
        <section
          id="agent-3"
          className="scroll-mt-24 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* LEFT: Video Simulation */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-emerald-500/30 video-glow group">
                <div className="aspect-video relative overflow-hidden bg-[#061011] flex flex-col justify-between p-4">
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/40 via-slate-950 to-teal-950/40"></div>
                  <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-emerald-500/20 blur-2xl animate-pulse"></div>

                  <div className="relative z-10 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> TOPICAL HIERARCHY SIM
                    </span>
                    <span className="font-mono text-slate-400 text-[10px]">CLIP: #DATAFORSEO_MAP.MP4</span>
                  </div>

                  <div className="relative z-10 my-auto flex items-center justify-center gap-5">
                    <div className="relative">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-lg shadow-emerald-500/20">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtOMXvSMwB-6saowK-rehe2CvlGGK8SFCJJvR9NeItup5sRvZsbimq_22NUCcwMZJ6Cog5ZSlIoIad6e1xzJ7jExIB3cMldvPQpEoHfZkxQAm78Gsi8fTnd_0aQqE5GK2hiVkm4bb5bpl_FqjK9ny-WM7PQFqR5-kQ82L-6R6Lf0ji2nK88MFK2fItrpe8Y6OOJc4fe8nHhbr1xFlYZCRpZlupIdCzRElFJWBGcFly-hZqRcZVF7-1enA3nS8RNJiv-g"
                          alt="Talha Mascot"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 px-1.5 py-0.5 rounded bg-emerald-500 text-[9px] font-bold text-slate-950 uppercase">
                        Strategist
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="text-[11px] font-mono text-slate-300 flex justify-between">
                        <span>Keyword Clustering</span>
                        <span className="text-emerald-400 font-bold">Cohere 0.86 Sim</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 font-mono text-[9px]">
                        <div className="bg-slate-900/90 p-1.5 rounded border border-emerald-500/30 text-emerald-300">
                          ⚡ Quick Wins: <strong>14</strong>
                        </div>
                        <div className="bg-slate-900/90 p-1.5 rounded border border-slate-800 text-slate-300">
                          🎯 Pillar Guides: <strong>8</strong>
                        </div>
                        <div className="bg-slate-900/90 p-1.5 rounded border border-slate-800 text-slate-300">
                          📈 Build Toward: <strong>22</strong>
                        </div>
                        <div className="bg-slate-900/90 p-1.5 rounded border border-slate-800 text-teal-300">
                          🛡️ Overlap Drops: <strong>0</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <button className="w-7 h-7 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center transition">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                      <span className="font-mono text-[11px] text-slate-300">03:40 / 05:00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-emerald-400/80 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">Rank Engine</span>
                      <svg className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-2 text-xs text-slate-400 font-mono">
                <span>&bull; Powered by DataForSEO & Cohere embed-v4.0</span>
                <span className="text-emerald-400">Pillars: 12 &bull; Subcats: 24</span>
              </div>
            </div>

            {/* RIGHT: Story */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Agents #03 &amp; #04 &bull; Topical Map &amp; Keywords
                </span>
                <span className="text-xs text-slate-400 font-mono">Entry: agents/topical_map &amp; agents/keywords</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Talha: The Mathematical Topical Cartographer
              </h3>

              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                Sporting sharp, clean-cut features and an eye for algorithmic precision, <strong>Talha</strong> transforms Masrur&apos;s Company DNA into a hierarchical 3-level SEO pyramid: overarching service pillars, searched subcategories, and specific long-tail themes. He pairs every cluster with live Google SERP stats from DataForSEO, ensuring marketing dollars are never wasted on cannibalized search queries.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-xs font-semibold text-emerald-400 mb-1 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    Hallucination-Proof Keyword Math
                  </div>
                  <p className="text-xs text-slate-400">
                    During grouping, keywords are transmitted to the model strictly as numerical indices. The model only answers in integers, making keyword invention computationally impossible.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-xs font-semibold text-emerald-400 mb-1 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Scientific Overlap Detection
                  </div>
                  <p className="text-xs text-slate-400">
                    Calculates Cohere cosine embeddings (0.86 threshold) and SERP top-10 URL overlap to consolidate duplicate pages while weaving automated internal sibling links at 0.61 similarity.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-300">
                <div>
                  <span className="text-slate-500">Service:</span> keyword_run_service.py
                </div>
                <div>
                  <span className="text-slate-500">Scoring:</span> fit × chance × √volume
                </div>
                <div>
                  <span className="text-slate-500">Embeddings:</span> Cohere embed-v4.0
                </div>
                <div>
                  <span className="text-slate-500">Tiers:</span> QUICK_WIN &bull; BUILD_TOWARD
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AGENT 4: Sayyam */}
        <section
          id="agent-4"
          className="scroll-mt-24 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition-all duration-300"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* LEFT: Video Simulation */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-purple-500/30 video-glow group">
                <div className="aspect-video relative overflow-hidden bg-[#110719] flex flex-col justify-between p-4">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/40 via-slate-950 to-pink-950/40"></div>
                  <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-purple-500/20 blur-2xl animate-pulse"></div>

                  <div className="relative z-10 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span> HIGGSFIELD MULTI-SCENE GEN
                    </span>
                    <span className="font-mono text-slate-400 text-[10px]">CLIP: #REEL_SCENE_BEAT.MP4</span>
                  </div>

                  <div className="relative z-10 my-auto flex items-center justify-center gap-5">
                    <div className="relative">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-purple-400 shadow-lg shadow-purple-500/20">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe-AlaEPUE_WwfHeEO5bu5qnY3fDL3XV8IR2YsuFQC0xVQTcYE1vIyZG20BqNNO1q7NnZw3ZLyuRfI8PfZGgf0-F7JyxYVq1ARqlberO3nCQ_46aLViVvH-XeOjbBIGEmRVIeJj6lM7vVeJTuS39sMqwjLC__94tHwKUkb7pmcO2mrPuuEKM2cd_MmYqDbbomyFdriKAYuaM4B7WyFLEwIt9PpBaOgaX5kVD_47Q9UFd7ZzDnRN8yGKXEyWHoYcKmRIQ"
                          alt="Sayyam Mascot"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 px-1.5 py-0.5 rounded bg-purple-600 text-[9px] font-bold text-white uppercase">
                        Director
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="text-[11px] font-mono text-slate-300 flex justify-between">
                        <span>Scene Planner & Beats</span>
                        <span className="text-purple-400 font-bold">8 Scenes / 9:16</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-6 flex-1 rounded bg-purple-900/60 border border-purple-500/40 flex items-center justify-center text-[9px] font-mono text-purple-200">
                          Hook
                        </div>
                        <div className="h-6 flex-[2] rounded bg-indigo-900/60 border border-indigo-500/40 flex items-center justify-center text-[9px] font-mono text-indigo-200">
                          Problem Beat
                        </div>
                        <div className="h-6 flex-[2] rounded bg-pink-900/60 border border-pink-500/40 flex items-center justify-center text-[9px] font-mono text-pink-200">
                          Solution
                        </div>
                        <div className="h-6 flex-1 rounded bg-purple-600 text-slate-950 flex items-center justify-center text-[9px] font-mono font-bold">
                          CTA
                        </div>
                      </div>
                      <div className="text-[9px] font-mono text-slate-400 flex justify-between">
                        <span>Camera: Dynamic Pan</span>
                        <span className="text-pink-400">Gemini 2.5 Flash</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <button className="w-7 h-7 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                      <span className="font-mono text-[11px] text-slate-300">00:45 / 01:15</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-purple-400/80 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">Vertical Reel</span>
                      <svg className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-2 text-xs text-slate-400 font-mono">
                <span>&bull; Script Generator + Higgsfield + Image Gen Agent</span>
                <span className="text-purple-400">Formats: Reels, Carousels, Stories</span>
              </div>
            </div>

            {/* RIGHT: Story */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  Agents #15, #18 &amp; #19 &bull; Media &amp; Content Engine
                </span>
                <span className="text-xs text-slate-400 font-mono">Entry: agents/ContentGenerataion &amp; Script Generator</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Sayyam: The Visionary Media Maestro & Script Virtuoso
              </h3>

              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                Elegantly adorned in a crisp white blazer and lapel feather, <strong>Sayyam</strong> is the creative powerhouse who takes cold keyword briefs and turns them into high-conversion sensory experiences. From punchy LinkedIn thought leadership and Instagram carousel copy to multi-scene video scripts with camera blocking and character continuity, Sayyam orchestrates the final viral touchpoint.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-xs font-semibold text-purple-400 mb-1 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Multi-Scene Script Generation
                  </div>
                  <p className="text-xs text-slate-400">
                    Architects video into 3–8 granular scenes complete with character staging, duration cues, and lighting prompts under 80 words tailored for Higgsfield image-to-video rendering.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-xs font-semibold text-purple-400 mb-1 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Image Generation Fleet
                  </div>
                  <p className="text-xs text-slate-400">
                    Employs <code className="text-purple-300 font-mono text-[10px]">gemini-2.5-flash-image</code> with automated S3 cloud dispatch, 3 exponential backoff retries, and strict anti-watermark prompting.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-300">
                <div>
                  <span className="text-slate-500">Service:</span> image_invoke.py &bull; script_invoke.py
                </div>
                <div>
                  <span className="text-slate-500">Models:</span> GPT-4o &bull; Gemini 2.5 Flash
                </div>
                <div>
                  <span className="text-slate-500">Aspect Ratios:</span> 9:16 (Reel) &bull; 1:1 (Post)
                </div>
                <div>
                  <span className="text-slate-500">Character:</span> Presenter &amp; Visual Lead
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Architecture & Pipeline Summary */}
        <section id="pipeline-specs" className="rounded-3xl bg-gradient-to-r from-blue-950/30 via-slate-900 to-indigo-950/30 border border-slate-800 p-8">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h3 className="text-2xl font-bold text-white">Full System Topology from agent-details.md</h3>
            <p className="text-sm text-slate-400 mt-2">Two synchronized families coordinating across background workers and API routes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-blue-400 font-mono font-semibold mb-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span> 1. Core Platform Agents
              </div>
              <p className="text-slate-400 text-xs mb-3">
                Intake &rarr; DNA &rarr; Topical Map &rarr; Keywords &rarr; Blog Content &rarr; Social &rarr; Planner, plus in-app Fluenca Chatbot.
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
                <li>
                  &bull; Never name models directly: request <span className="text-blue-300">LlmTier.STRONG</span> or <span className="text-blue-300">LlmTier.FAST</span>
                </li>
                <li>
                  &bull; Managed by Celery/worker jobs in <span className="text-slate-400">services/*</span>
                </li>
                <li>&bull; Enforces monthly AI budget caps &amp; fuzzy quote judges</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-purple-400 font-mono font-semibold mb-2">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span> 2. Intelligence &amp; Media Agents
              </div>
              <p className="text-slate-400 text-xs mb-3">
                Analyze Company, Competitor, Content Recommendation, Niche Trends, Script Generation, Image &amp; Video Generators.
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
                <li>&bull; LangGraph async pipelines executed via FastAPI routes</li>
                <li>
                  &bull; Default to <span className="text-purple-300">OPENAI_MODEL_NAME (gpt-4o)</span> with automated fallbacks
                </li>
                <li>&bull; Real Instagram &amp; LinkedIn graph analytics with Playwright</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10 relative z-20 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>Fluenca AI &bull; Agent Mascots &amp; Design Engine</div>
          <div className="flex items-center gap-4">
            <a href="#mascot-orbit" className="hover:text-slate-300 transition">
              Back to Orbit Top
            </a>
            <span className="text-slate-700">&bull;</span>
            <a href="#pipeline-specs" className="hover:text-slate-300 transition">
              Technical Spec
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
