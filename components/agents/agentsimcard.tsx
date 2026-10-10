import { accentStyles, AgentStory } from "./agents-data";
import { motion } from "motion/react";

export default  function AgentSimCard({ agent }: { agent: AgentStory }) {
    const styles = accentStyles[agent.accent];
    return (
      <div
        className={`relative overflow-hidden rounded-2xl border border-[#E6E8F5] bg-linear-to-br ${styles.soft} shadow-[0_20px_50px_-28px_rgba(79,70,229,0.35)]`}
      >
        <div className="aspect-video p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-2 text-[11px]">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-medium ${styles.chip}`}
            >
              <span className="relative flex size-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-40" />
                <span className="relative size-1.5 rounded-full bg-current" />
              </span>
              Live agent loop
            </span>
            <span className="font-mono text-[10px] text-neutral-400">
              {agent.clipLabel}
            </span>
          </div>
  
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={agent.image}
                alt={agent.name}
                className={`size-20 rounded-2xl border-2 object-cover sm:size-24 ${styles.ring}`}
              />
              <span
                className={`absolute -bottom-2 -right-2 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase text-white ${
                  agent.accent === "indigo"
                    ? "bg-[#5452F6]"
                    : agent.accent === "amber"
                      ? "bg-amber-500"
                      : agent.accent === "emerald"
                        ? "bg-emerald-500"
                        : "bg-violet-600"
                }`}
              >
                {agent.role.split(" ")[0]}
              </span>
            </div>
  
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center justify-between gap-2 text-[12px] text-neutral-600">
                <span className="truncate font-medium">{agent.sim.headline}</span>
                <span className={`shrink-0 font-semibold ${styles.text}`}>
                  {agent.sim.metric}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/80 ring-1 ring-[#E6E8F5]">
                <motion.div
                  className={`h-full rounded-full bg-linear-to-r ${styles.bar}`}
                  initial={{ width: "18%" }}
                  whileInView={{ width: "82%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                />
              </div>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                {agent.sim.rows.map((row) => (
                  <div
                    key={row}
                    className="truncate rounded-lg border border-[#E6E8F5] bg-white/90 px-1.5 py-1 text-center font-mono text-[9px] text-neutral-500"
                  >
                    {row}
                  </div>
                ))}
              </div>
            </div>
          </div>
  
          <div className="mt-5 flex items-center justify-between border-t border-[#E6E8F5] pt-3 text-[11px] text-neutral-500">
            <span className={`font-medium ${styles.text}`}>{agent.statusLabel}</span>
            <span className="font-mono text-neutral-400">How the agent works</span>
          </div>
        </div>
      </div>
    );
  }