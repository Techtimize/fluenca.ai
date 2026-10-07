"use client";

// components/landing/faq-section.tsx
import { useState } from "react";

const faqs = [
  {
    question: "What is Fluenca.ai?",
    answer:
      "Fluenca.ai is an AI-powered business and marketing intelligence platform that researches your business and turns the information into actionable marketing insights.",
  },
  {
    question: "How does Fluenca understand my business?",
    answer:
      "Fluenca researches your website, SEO, competitors, market, performance, and social presence to build a clear understanding of your business.",
  },
  {
    question: "Can I review the information Fluenca collects?",
    answer:
      "Yes. Fluenca gives you AI-generated insights to review, edit, and confirm before using them for your marketing activities.",
  },
  {
    question: "What can I create with Fluenca?",
    answer:
      "You can create SEO strategies, content plans, blog posts, social posts, case studies, marketing campaigns, and more based on your business insights.",
  },
  {
    question: "Can Fluenca analyze my competitors?",
    answer:
      "Yes. Fluenca can discover relevant competitors automatically and also lets you provide competitors you want it to analyze.",
  },
  {
    question: "Can I set marketing goals?",
    answer:
      "Yes. You can define your goals, and Fluenca uses your business intelligence to create relevant recommendations and content plans around them.",
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

  return (
    // Rounded top corners: the lavender glows start right at the top edge, so the curve shows against the white page above.
    // Background: white centre, lavender glows at the top-right, left-middle and bottom corners (as in the design).
    // Bottom padding includes the overlap (40px / 56px) taken by the testimonials section (-mt-10 / -mt-14),
    // so the visible gap stays 64px on mobile and 80px on desktop.
    <section
      id="faq"
      className="relative z-10 w-full overflow-hidden rounded-t-[40px] bg-white pt-16 pb-26 md:rounded-t-[56px] md:pt-20 md:pb-34 bg-[radial-gradient(ellipse_30%_24%_at_100%_0%,rgba(214,222,255,0.95)_0%,rgba(255,255,255,0)_100%),radial-gradient(ellipse_22%_16%_at_0%_0%,rgba(226,230,255,0.55)_0%,rgba(255,255,255,0)_100%),radial-gradient(ellipse_16%_36%_at_0%_42%,rgba(214,222,255,0.9)_0%,rgba(255,255,255,0)_100%),radial-gradient(ellipse_480px_260px_at_0%_100%,rgba(214,222,255,0.95)_0%,rgba(255,255,255,0)_100%),radial-gradient(ellipse_420px_240px_at_100%_100%,rgba(214,222,255,0.8)_0%,rgba(255,255,255,0)_100%),radial-gradient(ellipse_14%_30%_at_100%_55%,rgba(226,230,255,0.4)_0%,rgba(255,255,255,0)_100%)]"
    >
      {/* max-w 1008 - 48px side padding = 960px content width (the outer frame) */}
      <div className="mx-auto max-w-[1008px] px-6">
        {/* Heading */}
        <div className="flex flex-col items-center text-center">
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
            Get answers about Fluenca, AI research, and marketing intelligence.
          </p>
        </div>

        {/* Accordion: 960 wide, 18px gap between items */}
        <div className="mt-8 flex flex-col gap-[18px]">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={item.question}
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
                  className={`flex w-full items-center justify-between gap-4 px-[30px] text-left ${
                    isOpen ? "pb-0 pt-5" : "py-5"
                  }`}
                >
                  <span className="font-display text-[18px] leading-[42px] font-medium tracking-normal text-[#1C1C1E]">
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
                    <p className="w-full max-w-[900px] px-[30px] pb-5 font-body text-[16px] leading-[27px] font-normal tracking-normal text-[#62625F]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}