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
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={`shrink-0 text-slate-900 transition-transform duration-300 ${
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
    <section
      id="faq"
      className="relative w-full overflow-hidden bg-white py-16 md:py-20 bg-[radial-gradient(ellipse_at_0%_60%,rgba(199,206,255,0.7)_0%,rgba(255,255,255,0)_32%),radial-gradient(ellipse_at_100%_0%,rgba(219,224,255,0.7)_0%,rgba(255,255,255,0)_32%),radial-gradient(ellipse_at_0%_100%,rgba(219,224,255,0.6)_0%,rgba(255,255,255,0)_30%)]"
    >
      <div className="mx-auto max-w-3xl px-6">
        {/* Heading */}
        <div className="flex flex-col items-center text-center">
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-normal text-indigo-500">
            Frequently Asked Questions
          </span>
          <h2 className="mt-3 text-3xl font-medium leading-tight tracking-tight text-slate-900 md:text-[34px]">
            Curious About <span className="text-indigo-500">Fluenca.ai</span>
          </h2>
          <p className="mt-3 text-xs text-slate-500">
            Get answers about Fluenca, AI research, and marketing intelligence.
          </p>
        </div>

        {/* Accordion */}
        <div className="mt-8 flex flex-col gap-3">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={item.question}
                className={`rounded-2xl border border-indigo-100 transition-colors duration-300 ${
                  isOpen
                    ? "bg-indigo-50/70 shadow-sm"
                    : "bg-gradient-to-r from-white to-indigo-50/40 hover:bg-indigo-50/50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className={`flex w-full items-center justify-between gap-4 text-left ${
                    isOpen ? "px-5 pt-4" : "px-4 py-3"
                  }`}
                >
                  <span
                    className={`text-[13px] ${
                      isOpen ? "font-medium text-slate-900" : "font-normal text-slate-800"
                    }`}
                  >
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
                    <p className="max-w-[92%] px-5 pb-5 pt-1 text-xs leading-relaxed text-slate-500">
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