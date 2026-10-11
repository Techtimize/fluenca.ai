"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  CENTER_GOAL,
  getTeam,
  TOUR_LINES,
  TOUR_ORDER,
  type TeamId,
} from "@/components/herosection/office-data";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

function PipelineChip({
  teamId,
  index,
}: {
  teamId: TeamId;
  index: number;
}) {
  const team = getTeam(teamId);
  return (
    <motion.div variants={fadeUp} className="relative flex min-w-[148px] flex-1 flex-col items-center">
      {index > 0 && (
        <span
          aria-hidden
          className="absolute -left-3 top-[22px] hidden h-px w-6 bg-indigo-200 sm:block md:-left-4 md:w-8"
        />
      )}
      <Link
        href={team.agentHref}
        className="group flex w-full flex-col items-center rounded-2xl border border-indigo-100/80 bg-white/90 px-3 py-4 shadow-[0_8px_24px_rgba(84,82,246,0.06)] transition hover:border-indigo-200 hover:shadow-[0_12px_32px_rgba(84,82,246,0.12)]"
      >
        <span
          className="relative mb-3 h-11 w-11 overflow-hidden rounded-full ring-offset-2"
          style={{ boxShadow: `0 0 0 2px ${team.color}`, outlineOffset: 2 }}
        >
          <Image
            src={team.leadImage}
            alt=""
            fill
            sizes="44px"
            className="object-cover"
          />
        </span>
        <span
          className="font-body text-[11px] font-medium uppercase tracking-[0.08em]"
          style={{ color: team.color }}
        >
          {CENTER_GOAL.steps[index]?.label.replace(/^\d+\s/, "") ?? team.name}
        </span>
        <span className="mt-1 font-display text-[15px] font-medium text-[#1C1C1E]">
          {team.leadName}
        </span>
        <p className="mt-2 line-clamp-2 text-center font-body text-[12px] leading-[18px] text-[#62625F]">
          {TOUR_LINES[teamId]}
        </p>
      </Link>
    </motion.div>
  );
}

export default function MeetThePipeline() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="meet-the-pipeline"
      className="relative z-10 w-full rounded-t-[32px] bg-[#F7F8FF] pt-10 pb-8 md:rounded-t-[56px] md:pt-14 md:pb-10"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_80%_100%_at_50%_0%,rgba(199,203,255,0.55)_0%,transparent_70%)]" />

      <motion.div
        className="relative mx-auto max-w-[1328px] px-4 sm:px-6 lg:px-10"
        initial={reduceMotion ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={stagger}
      >
        <motion.div variants={fadeUp} className="mx-auto max-w-[720px] text-center">
          <span className="inline-flex h-[34px] items-center justify-center rounded-[40px] border border-indigo-100 bg-white px-5 font-body text-[12px] text-indigo-500 shadow-sm sm:text-[13px]">
            Same teams you just met
          </span>
          <h2 className="mt-4 font-display text-[28px] font-medium leading-[36px] text-[#1C1C1E] sm:text-[36px] sm:leading-[44px] md:text-[44px] md:leading-[54px]">
            How your goal moves
            <br />
            <span className="text-indigo-500">through the office</span>
          </h2>
          <p className="mx-auto mt-3 max-w-[540px] font-body text-[15px] leading-[24px] text-[#62625F] md:text-[17px] md:leading-[28px]">
            Six specialist leads hand work forward until the goal is proven —
            then the loop starts again with smarter research.
          </p>
        </motion.div>

        {/* Goal strip — mirrors hero CENTER_GOAL */}
        <motion.div
          variants={fadeUp}
          className="mx-auto mt-8 flex max-w-[640px] flex-col items-center gap-2 rounded-[20px] border border-indigo-100 bg-white px-5 py-4 shadow-sm sm:flex-row sm:justify-between sm:gap-4"
        >
          <div className="text-center sm:text-left">
            <p className="font-body text-[11px] font-medium uppercase tracking-[0.12em] text-indigo-400">
              {CENTER_GOAL.label}
            </p>
            <p className="font-display text-[18px] font-medium text-[#1C1C1E] md:text-[20px]">
              {CENTER_GOAL.title}
            </p>
            <p className="font-body text-[13px] text-[#62625F]">{CENTER_GOAL.detail}</p>
          </div>
          <div className="w-full max-w-[200px]">
            <div className="mb-1 flex justify-between font-body text-[11px] text-[#62625F]">
              <span>{CENTER_GOAL.subtitle}</span>
              <span>{CENTER_GOAL.progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-indigo-100">
              <div
                className="h-full rounded-full bg-[linear-gradient(95.57deg,#3659FF_-37.81%,#4F60FF_45.96%,#8157F7_115.03%)]"
                style={{ width: `${CENTER_GOAL.progress}%` }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={stagger}
          className="mt-8 flex gap-3 overflow-x-auto pb-2 sm:gap-4 md:grid md:grid-cols-6 md:overflow-visible md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {TOUR_ORDER.map((id, i) => (
            <PipelineChip key={id} teamId={id} index={i} />
          ))}
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="mt-6 text-center font-body text-[13px] text-[#62625F] md:text-[14px]"
        >
          Scroll to see how a founder brief becomes research, DNA, content, and proof.
        </motion.p>
      </motion.div>
    </section>
  );
}
