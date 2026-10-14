import { motion, useReducedMotion } from "motion/react";
import { AgentStory } from "./agents-data";
import AgentVideo from "./agentvideo";

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

export default function AgentChapter({
    agent,
    index,
  }: {
    agent: AgentStory;
    index: number;
  }) {
    const reduceMotion = useReducedMotion();
  
    return (
      <motion.section
        id={agent.id}
        className="scroll-mt-28 overflow-hidden rounded-[28px] border border-[#E6E8F5] bg-white/90 p-5 shadow-[0_18px_50px_-36px_rgba(79,70,229,0.45)] backdrop-blur-sm sm:p-8"
        initial={reduceMotion ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <div
          className={`grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12 ${
            index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          <div className="lg:col-span-5">
            <AgentVideo agent={agent} />
          </div>
  
          <div className="space-y-4 lg:col-span-7">
            <h3 className="text-[26px] font-semibold tracking-tight text-[#1C1C1E] sm:text-[32px]">
              {/* {agent.name}:{" "} */}
              <span className="bg-linear-to-r from-[#4F46E5] to-[#8B5CF6] bg-clip-text text-transparent">
                {agent.title}
              </span>
            </h3>
  
            <p className="max-w-2xl text-[15px] leading-7 text-[#62625F] sm:text-[16px]">
              {agent.summary}
            </p>
  
            <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
              {[
                { title: "Headline", body: agent.headline },
                { title: "Mission", body: agent.mission },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-[#E6E8F5] bg-[#F7F8FF]/80 p-3.5"
                >
                  <p className="text-xs font-semibold">
                    {feature.title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-neutral-500">
                    {feature.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
    );
  }