"use client";

// Compressed "inside the brain" strip — hero + pipeline already tell the full story.
import Lottie from "lottie-react";
import { motion, useReducedMotion } from "motion/react";
import animationData from "@/animations/how-fluenca-thinks.json";

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

export default function HowFluencaThinks() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="how-fluenca-thinks"
      className="relative z-10 -mt-10 w-full rounded-t-[32px] bg-white pb-6 pt-8 md:-mt-14 md:rounded-t-[56px] md:pb-10 md:pt-12"
    >
      <motion.div
        className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-12 lg:pl-20 lg:pr-[30px]"
        initial={reduceMotion ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
      >
        <div className="grid items-start gap-3 md:gap-4 lg:grid-cols-[1fr_510px] lg:gap-10">
          <div>
            <span className="inline-flex h-[30px] max-w-full items-center justify-center whitespace-nowrap rounded-[40px] bg-[#F5F7FF] px-4 py-1 font-body text-[13px] font-normal text-indigo-500 sm:h-[34px] sm:px-5 sm:text-[15px]">
              Inside the brain
            </span>

            <h2 className="mt-3 max-w-[595px] font-display text-[24px] font-medium leading-[32px] tracking-normal text-[#1C1C1E] sm:text-[32px] sm:leading-[40px] md:text-[40px] md:leading-[48px]">
              One picture of your business
              <br />
              <span className="text-indigo-500">shared by every floor</span>
            </h2>
          </div>

          <p className="max-w-[510px] font-body text-[15px] font-normal leading-[24px] tracking-normal text-[#62625F] sm:text-[16px] sm:leading-[26px] md:text-[17px] md:leading-[28px] lg:mt-10">
            Intake, rivals, DNA, SEO, media, and analytics feed one living model
            so the office never invents a second brand story.
          </p>
        </div>
      </motion.div>

      <motion.div
        className="mx-auto mt-3 w-full max-w-[1100px] overflow-x-auto px-2 md:mt-4 md:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease }}
      >
        <div
          className="min-w-[640px] md:min-w-0"
          style={{ aspectRatio: `${animationData.w} / ${animationData.h}` }}
        >
          <Lottie
            animationData={animationData}
            loop
            autoplay={!reduceMotion}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
