"use client";

// components/landing/faq-section.tsx
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const faqs = [
  {
    question: "What is Fluenca.ai?",
    answer:
      "Fluenca.ai is an AI marketing office — specialist agent teams research your business, lock Company DNA, then plan, create, and prove content against your goals.",
  },
  {
    question: "How does Fluenca understand my business?",
    answer:
      "Rayyan’s Intake team crawls your site; Ilsa maps rivals; Masrur locks DNA from answers you confirm. SEO, media, and analytics then work from that shared truth.",
  },
  {
    question: "Can I review the information Fluenca collects?",
    answer:
      "Yes. Fluenca gives you AI-generated insights to review, edit, and confirm before any later team uses them for marketing.",
  },
  {
    question: "What can I create with Fluenca?",
    answer:
      "Talha’s SEO and Sayyam’s Media teams turn DNA into topical plans, blog posts, social posts, case studies, campaigns, and more — all on-brand.",
  },
  {
    question: "Can Fluenca analyze my competitors?",
    answer:
      "Yes. Ilsa’s Competitor team discovers relevant rivals automatically and also lets you add competitors you want analyzed.",
  },
  {
    question: "Can I set marketing goals?",
    answer:
      "Yes. You define the goal (like the hub in the office), and every floor — research through analytics — executes and measures against it.",
  },
];

function PlusIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={`shrink-0 text-[#1C1C1E] transition-transform duration-300 ${
        open ? "rotate-45" : ""
      }`}
    >
      <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function FaqSection() {
  // 0 = first question open by default. Use null to start with all closed.
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  return (
    // Rounded top corners: the lavender glows start right at the top edge, so the curve shows against the white page above.
    // Background: white centre, lavender glows at the top-right, left-middle and bottom corners (as in the design).
    // Bottom padding includes the overlap (40px / 56px) taken by the next overlapping section.
    <section
      id="faq"
      className="relative z-10 w-full overflow-hidden rounded-t-[40px] bg-white pt-16 pb-26 md:rounded-t-[56px] md:pt-20 md:pb-34 bg-[radial-gradient(ellipse_30%_24%_at_100%_0%,rgba(214,222,255,0.95)_0%,rgba(255,255,255,0)_100%),radial-gradient(ellipse_22%_16%_at_0%_0%,rgba(226,230,255,0.55)_0%,rgba(255,255,255,0)_100%),radial-gradient(ellipse_16%_36%_at_0%_42%,rgba(214,222,255,0.9)_0%,rgba(255,255,255,0)_100%),radial-gradient(ellipse_480px_260px_at_0%_100%,rgba(214,222,255,0.95)_0%,rgba(255,255,255,0)_100%),radial-gradient(ellipse_420px_240px_at_100%_100%,rgba(214,222,255,0.8)_0%,rgba(255,255,255,0)_100%),radial-gradient(ellipse_14%_30%_at_100%_55%,rgba(226,230,255,0.4)_0%,rgba(255,255,255,0)_100%)]"
    >
      {/* max-w 1008 - 48px side padding = 960px content width (the outer frame) */}
      <motion.div
        className="mx-auto max-w-[1008px] px-6"
        initial={reduceMotion ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        {/* Heading */}
        <motion.div variants={fadeUp} className="flex flex-col items-center text-center">
          {/* Pill: 249 x 34, radius 40, padding 4/20, gap 10, bg #F0F3FF */}
          <span className="inline-flex h-[34px] w-[249px] max-w-full items-center justify-center gap-[10px] whitespace-nowrap rounded-[40px] bg-[#F0F3FF] px-5 py-1 font-body text-[15px] font-normal text-indigo-500">
            Frequently Asked Questions
          </span>

          {/* H2: 590 x 60, 500, 50px / 60px, centered (a bit smaller on phones so it fits) */}
          <h2 className="mt-3 w-[590px] max-w-full font-display text-[36px] leading-[44px] font-medium tracking-normal text-[#1C1C1E] md:text-[50px] md:leading-[60px]">
            Curious About <span className="text-indigo-500">Fluenca.ai</span>
          </h2>

          {/* Subtitle: 615 x 28, 400, 17px / 28px, #62625F, centered */}
          <p className="mt-3 w-[615px] max-w-full font-body text-[17px] leading-[28px] font-normal tracking-normal text-[#62625F]">
            Answers about the agent office, DNA, and how goals get done.
          </p>
        </motion.div>

        {/* Accordion: 960 wide, 18px gap between items */}
        <div className="mt-8 flex flex-col gap-[18px]">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={item.question}
                variants={fadeUp}
                className={`rounded-[30px] border border-indigo-100 transition-colors duration-300 ${
                  isOpen
                    ? "bg-indigo-50/70 shadow-sm"
                    : "bg-gradient-to-r from-white to-indigo-50/40 hover:bg-indigo-50/50"
                }`}
              >
                {/* Question row: padding 20/30, title 500, 18px / 42px */}
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className={`flex w-full items-center justify-between gap-4 px-5 text-left md:px-[30px] ${
                    isOpen ? "pb-0 pt-4 md:pt-5" : "py-4 md:py-5"
                  }`}
                >
                  <span className="font-display text-[16px] leading-[32px] font-medium tracking-normal text-[#1C1C1E] md:text-[18px] md:leading-[42px]">
                    {item.question}
                  </span>
                  <PlusIcon open={isOpen} />
                </button>

                {/* Smooth open/close */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    {/* Answer: 900 wide, 400, 16px / 27px, #62625F */}
                    <p className="w-full max-w-[900px] px-5 pb-4 font-body text-[15px] leading-[25px] font-normal tracking-normal text-[#62625F] md:px-[30px] md:pb-5 md:text-[16px] md:leading-[27px]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}