"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Lightbulb, Megaphone, PenLine, Play, PlayCircle, Search } from "lucide-react";

// What the demo walks through
const highlights = [
  { icon: Search, label: "Research your market" },
  { icon: Lightbulb, label: "Build your strategy" },
  { icon: PenLine, label: "Create content" },
  { icon: Megaphone, label: "Automate social posting" },
] as const;

const formatDuration = (seconds: number) => {
  const total = Math.round(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
};

export default function DemoVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);

  // Metadata can load before hydration, in which case onLoadedMetadata never fires for us
  useEffect(() => {
    const video = videoRef.current;
    if (video && video.readyState >= 1) setDuration(video.duration);
  }, []);

  const handlePlay = () => {
    setPlaying(true);
    videoRef.current?.play().catch(() => setPlaying(false));
  };

  const handleEnded = () => {
    setPlaying(false);
    videoRef.current?.load();
  };

  return (
    <section
      id="demo"
      className="relative scroll-mt-20 overflow-hidden bg-linear-to-b from-white via-[#F7F6FF] to-white px-4 py-16 sm:px-6 lg:py-24"
    >
      {/* Soft background glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute left-1/2 top-40 h-[420px] w-[80%] max-w-[900px] -translate-x-1/2 rounded-full bg-[#8B7CF8]/25 blur-[120px]" />
        <div className="absolute -left-24 top-24 size-72 rounded-full bg-[#C7D2FE]/50 blur-3xl" />
        <div className="absolute -right-24 bottom-10 size-72 rounded-full bg-[#DDD6FE]/60 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E3E5F5] bg-white/80 px-4 py-1.5 text-[13px] font-medium text-brand shadow-sm">
            <PlayCircle aria-hidden="true" className="size-4" />
            Product demo
          </span>
          <h2 className="mt-5 font-display text-[32px] font-bold leading-[1.15] tracking-tight text-[#14163A] sm:text-[44px]">
            Take a look inside{" "}
            <span className="bg-linear-to-r from-[#4F46E5] to-[#8B5CF6] bg-clip-text text-transparent">Fluenca</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-[#5B5F7A] sm:text-[17px]">
            See how Fluenca brings research, strategy, content creation, and social media automation together in one
            seamless workflow.
          </p>
        </div>

        {/* Player in a browser-style frame with a gradient border */}
        <div className="relative mt-10 sm:mt-12">
          <div className="rounded-[22px] bg-linear-to-br from-[#A5B4FC] via-[#C4B5FD] to-[#F0ABFC] p-px shadow-[0_40px_90px_-30px_rgba(79,70,229,0.55)]">
            <div className="overflow-hidden rounded-[21px] bg-white">
              {/* Browser bar */}
              <div className="flex items-center gap-3 border-b border-[#EEF0FA] bg-[#FAFAFF] px-4 py-2.5">
                <div className="flex gap-1.5" aria-hidden="true">
                  <span className="size-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="size-2.5 rounded-full bg-[#28C840]" />
                </div>
                <div className="mx-auto hidden h-6 w-full max-w-xs items-center justify-center rounded-md bg-white px-3 text-[11px] text-gray-400 ring-1 ring-[#EEF0FA] sm:flex">
                  fluenca.ai
                </div>
                <div className="w-[42px]" aria-hidden="true" />
              </div>

              <div className="relative aspect-video bg-[#0F0F1A]">
                <video
                  ref={videoRef}
                  className="absolute inset-0 size-full object-cover"
                  src="/videos/demo.mp4"
                  poster="/videos/demo-poster.jpg"
                  controls={playing}
                  preload="metadata"
                  playsInline
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                  onEnded={handleEnded}
                />

                {!playing && (
                  <button
                    type="button"
                    onClick={handlePlay}
                    aria-label="Play demo video"
                    className="group absolute inset-0 z-10 cursor-pointer focus-visible:outline-none"
                  >
                    {/* Poster shown above the video until play is clicked */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/videos/demo-poster.jpg"
                      alt=""
                      className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    />
                    <span className="absolute inset-0 bg-linear-to-t from-[#14163A]/45 via-[#14163A]/10 to-transparent transition group-hover:from-[#14163A]/55" />

                    <span className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                      <span className="relative grid place-items-center">
                        {/* pulsing rings */}
                        <span className="absolute size-full animate-ping rounded-full bg-white/40 animation-duration-[2s] motion-reduce:hidden" />
                        <span className="absolute -inset-3 rounded-full bg-white/25 backdrop-blur-sm sm:-inset-4" />
                        <span className="relative grid size-16 place-items-center rounded-full bg-white text-brand shadow-[0_12px_40px_-8px_rgba(30,20,90,0.6)] transition duration-300 group-hover:scale-110 group-focus-visible:ring-4 group-focus-visible:ring-white/70 sm:size-20">
                          <Play aria-hidden="true" className="ml-1 size-6 fill-current sm:size-8" />
                        </span>
                      </span>
                      <span className="rounded-full bg-white/90 px-4 py-1.5 text-[13px] font-semibold text-[#14163A] shadow-lg backdrop-blur">
                        Watch the demo{duration ? ` · ${formatDuration(duration)}` : ""}
                      </span>
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* What you'll see */}
        <ul className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:mt-10 lg:grid-cols-4">
          {highlights.map(({ icon: Icon, label }, index) => (
            <li
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-[#EEF0FA] bg-white/80 px-3 py-3 shadow-[0_8px_24px_-16px_rgba(79,70,229,0.4)] backdrop-blur sm:px-4"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#EEF0FF] text-brand">
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <span className="text-[13px] font-medium leading-tight text-[#14163A]">
                <span className="block text-[11px] font-semibold text-brand/70">Step {index + 1}</span>
                {label}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <Link
            href="/signup"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-linear-to-r from-[#4F46E5] to-[#6D5DF6] px-7 text-[15px] font-medium text-white shadow-[0_12px_28px_-10px_rgba(79,70,229,0.7)] transition hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Try it yourself, free
            <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
