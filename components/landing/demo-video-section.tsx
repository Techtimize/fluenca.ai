"use client";

import { useRef, useState } from "react";

export default function DemoVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    videoRef.current?.play();
    setPlaying(true);
  };

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          See Fluenca in action
        </h2>
        <p className="mt-3 text-base text-gray-600">
          Watch how your AI agents go from goal to ready-to-publish plan.
        </p>
      </div>

      <div className="relative mx-auto mt-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-black shadow-xl">
        <video
          ref={videoRef}
          className="mx-auto h-auto max-h-[75vh] w-full object-contain"
          src="/videos/demo.mp4#t=0.1"
          controls={playing}
          preload="metadata"
          playsInline
          onEnded={() => setPlaying(false)}
        />

        {!playing && (
          <button
            type="button"
            onClick={handlePlay}
            aria-label="Play demo video"
            className="absolute inset-0 flex items-center justify-center bg-black/30 transition hover:bg-black/40"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 text-3xl shadow-lg">
              ▶
            </span>
          </button>
        )}
      </div>
    </section>
  );
}