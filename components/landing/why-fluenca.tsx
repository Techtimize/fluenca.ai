// components/landing/why-fluenca.tsx
import Image from "next/image";

const LOGO_ICON = "/assets/Logo.svg";

const benefits = [
  {
    title: "Accurate",
    text: "Verify the facts once, so later content is far less likely to include made-up or off-brand claims.",
  },
  {
    title: "Consistent",
    text: "Every channel and every piece of content draws from the same foundation.",
  },
  {
    title: "Efficient",
    text: "Do the setup once instead of explaining your business again in every prompt.",
  },
  {
    title: "Personal",
    text: "Output reflects your actual business, not generic marketing copy.",
  },
];

const scorecard = [
  "Researches your business first",
  "Asks questions built for you",
  "You confirm every answer",
  "One source of truth for every channel",
  "Keeps surfacing new opportunities",
];

function LogoIcon({ size = 14 }: { size?: number }) {
  return (
    <Image
      src={LOGO_ICON}
      alt=""
      width={size}
      height={size}
      className="shrink-0"
    />
  );
}

function DoubleCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-label="Yes" className="text-indigo-500">
      <path d="M2 13l4 4L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 15l2 2L21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function WhyFluenca() {
  return (
    <section
      id="why-fluenca"
      className="relative w-full overflow-hidden bg-white py-16 md:py-20 bg-[radial-gradient(ellipse_at_100%_0%,rgba(199,206,255,0.7)_0%,rgba(255,255,255,0)_40%),radial-gradient(ellipse_at_0%_15%,rgba(219,224,255,0.6)_0%,rgba(255,255,255,0)_35%),radial-gradient(ellipse_at_0%_100%,rgba(219,224,255,0.7)_0%,rgba(255,255,255,0)_40%),radial-gradient(ellipse_at_100%_90%,rgba(226,222,255,0.6)_0%,rgba(255,255,255,0)_35%)]"
    >
      {/* soft background glows */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-6">
        {/* Heading */}
        <div className="flex flex-col items-center text-center">
          <span className="rounded-full border border-indigo-100 bg-white px-3 py-1 text-[11px] font-normal text-indigo-500 shadow-sm">
            Why Fluenca.ai
          </span>
          <h2 className="mt-4 text-3xl font-medium leading-[1.15] tracking-tight text-slate-900 md:text-[38px]">
            Generic AI
            <br />
            guesses. <span className="text-indigo-500">Fluenca knows.</span>
          </h2>
          <p className="mt-4 max-w-xl text-[13px] text-slate-500">
            Verify your business once, and everything Fluenca creates starts from the truth.
          </p>
        </div>

        {/* Cards (both cards have the same height) */}
        <div className="mt-10 grid items-stretch gap-4 md:grid-cols-[4fr_5.2fr]">
          {/* Left: benefits */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/70 bg-gradient-to-br from-indigo-50/80 via-white to-indigo-50/60 p-6 shadow-sm">
            {benefits.map((b, i) => (
              <div
                key={b.title}
                className={`py-4 first:pt-0 last:pb-0 ${
                  i !== benefits.length - 1 ? "border-b border-dashed border-indigo-100" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <LogoIcon />
                  <h3 className="text-[13px] font-medium text-slate-900">{b.title}</h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">{b.text}</p>
              </div>
            ))}
          </div>

          {/* Right: scorecard */}
          <div className="flex flex-col rounded-2xl border border-white/70 bg-gradient-to-br from-white via-indigo-50/40 to-white p-6 shadow-sm">
            {/* header row */}
            <div className="grid grid-cols-[1.7fr_1fr_1fr] items-center text-xs">
              <span className="text-slate-700">The scorecard</span>
              <span className="text-center text-slate-500">Prompt-only tools</span>
              <span className="flex items-center justify-center gap-1.5 font-medium text-indigo-600">
                <LogoIcon size={16} />
                fluenca.ai
              </span>
            </div>

            {/* rows: spread evenly so the button always sits at the bottom */}
            <div className="flex flex-1 flex-col justify-around py-4">
              {scorecard.map((row) => (
                <div
                  key={row}
                  className="grid grid-cols-[1.7fr_1fr_1fr] items-center py-2.5 text-xs text-slate-700"
                >
                  <span>{row}</span>
                  <span className="text-center text-slate-400">--</span>
                  <span className="flex justify-center">
                    <DoubleCheck />
                  </span>
                </div>
              ))}
            </div>

            {/* CTA bar, aligned to the bottom of the card */}
            <div className="mt-auto rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-center text-[13px] font-medium text-white shadow-md shadow-indigo-200">
              Fluenca builds context before it creates.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}