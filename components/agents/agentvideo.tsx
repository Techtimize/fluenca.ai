"use client";

import { useCallback } from "react";
import { useReducedMotion } from "motion/react";
import { accentStyles, AgentStory } from "./agents-data";
import AgentSimCard from "./agentsimcard";

export default function AgentVideo({ agent }: { agent: AgentStory }) {
  const styles = accentStyles[agent.accent];
  const reduceMotion = useReducedMotion();

  // Play only while visible, pause when scrolled away (ref callback cleanup, no effect needed)
  const videoRef = useCallback(
    (el: HTMLVideoElement | null) => {
      if (!el || reduceMotion) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) el.play().catch(() => {});
          else el.pause();
        },
        { threshold: 0.35 },
      );
      io.observe(el);
      return () => io.disconnect();
    },
    [reduceMotion],
  );

  // Fallback for agents without a video yet
  if (!agent.video) return <AgentSimCard agent={agent} />;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-2 bg-black shadow-[0_20px_50px_-28px_rgba(79,70,229,0.45)] ${styles.ring}`}
    >
      <video
        key={agent.video.src}
        ref={videoRef}
        src={agent.video.src}
        poster={agent.video.poster}
        className="aspect-video w-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={`${agent.name}, ${agent.role} agent`}
      />
    </div>
  );
}
