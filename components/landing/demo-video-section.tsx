"use client";

import { useRef, useState } from "react";

const PLAYER_CLASS =
  "relative mx-auto mt-8 w-full overflow-hidden rounded-2xl border border-gray-200 bg-black shadow-xl";

const PLAY_BUTTON_CLASS =
  "flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 text-xl text-white shadow-xl transition group-hover:scale-110 sm:h-[72px] sm:w-[72px] sm:text-2xl";

export default function DemoVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    setPlaying(true);
    videoRef.current?.play().catch(() => setPlaying(false));
  };

  const handleEnded = () => {
    setPlaying(false);
    videoRef.current?.load();
  };

  return (
    <section className="bg-white px-4 py-12 sm:px-6 lg:py-16">
      {/* Heading */}
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Take a Look Inside Fluenca
        </h2>
        <p className="mt-3 text-base text-gray-600">
          See how Fluenca brings research, strategy, content creation, and
          social media automation together in one seamless workflow.
        </p>
      </div>

      {/* Player: aspectRatio sets the height (make the second number bigger for a taller video) */}
      <div
        className={PLAYER_CLASS}
        style={{ maxWidth: "46rem", aspectRatio: "16 / 11" }}
      >
        {/* Poster stays in the layout (hidden while playing) to hold the size */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/videos/demo-poster.jpg"
          alt="Fluenca demo preview"
          className={playing ? "invisible block h-auto w-full" : "block h-auto w-full"}
        />

        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/demo.mp4"
          controls={playing}
          preload="metadata"
          playsInline
          onEnded={handleEnded}
        />

        {!playing && (
          <button
            type="button"
            onClick={handlePlay}
            aria-label="Play demo video"
            className="group absolute inset-0 z-10"
          >
            {/* Poster shown above the video until play is clicked */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/videos/demo-poster.jpg"
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute inset-0 bg-black/10 transition group-hover:bg-black/20" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className={PLAY_BUTTON_CLASS}>
                <span className="ml-1">▶</span>
              </span>
            </span>
          </button>
        )}
      </div>
    </section>
  );
}