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

function DoubleCheck({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Yes" className="text-indigo-500">
      <path d="M2 13l4 4L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 15l2 2L21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function WhyFluenca() {
  return (
    // Rounded top corners, with a gap above so it sits clear of the "How it works" section.
    // The purple glow starts right at the top edge and fades out, like the Figma design.
    <section
      id="why-fluenca"
      className="relative z-10 mt-12 w-full overflow-hidden rounded-t-[40px] bg-white pb-[136px] pt-16 md:mt-16 md:rounded-t-[56px] md:pb-[156px] md:pt-20 bg-[radial-gradient(ellipse_70%_100%_at_85%_0%,rgba(214,222,255,0.95)_0%,rgba(255,255,255,0)_100%),radial-gradient(ellipse_at_0%_0%,rgba(226,230,255,0.7)_0%,rgba(255,255,255,0)_30%),radial-gradient(ellipse_30%_30%_at_0%_32%,rgba(214,222,255,0.85)_0%,rgba(255,255,255,0)_100%),radial-gradient(ellipse_45%_40%_at_0%_100%,rgba(214,222,255,0.9)_0%,rgba(255,255,255,0)_100%),radial-gradient(ellipse_40%_40%_at_100%_92%,rgba(222,220,255,0.85)_0%,rgba(255,255,255,0)_100%)]"
    >
      {/* soft background glows */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />

      {/* max-w 1328 - 48px side padding = 1280px content width (the outer frame) */}
      <div className="relative mx-auto max-w-[1328px] px-6">
        {/* Heading */}
        <div className="flex flex-col items-center text-center">
          {/* Pill: 151 x 34, radius 40, padding 4/20, gap 10, white */}
          <span className="inline-flex h-[34px] items-center justify-center gap-[10px] rounded-[40px] border border-indigo-100 bg-white px-5 py-1 font-body text-[11px] font-normal text-indigo-500 shadow-sm">
            Why Fluenca.ai
          </span>

          {/* H1: 590 x 120, 500, 50px / 60px, centered */}
          <h2 className="mt-4 w-[590px] max-w-full font-display text-[36px] leading-[44px] md:text-[50px] md:leading-[60px] font-medium tracking-normal text-slate-900">
            Generic AI
            <br />
            guesses. <span className="text-indigo-500">Fluenca knows.</span>
          </h2>

          {/* Subtitle: 400, 17px / 28px, #62625F */}
          <p className="mt-4 font-body text-[17px] leading-[28px] font-normal tracking-normal text-[#62625F]">
            Verify your business once, and everything Fluenca creates starts from the truth.
          </p>
        </div>

          {/* Outer frame 1280 x 548, gap 20: left 494 + right 766 */}
          <div className="mt-10 flex flex-col gap-5 md:grid md:h-[548px] md:grid-cols-[494fr_766fr]">
          {/* Left: benefits (494 x 548) */}
          <div className="flex flex-col justify-between rounded-[32px] md:rounded-[40px] border border-white/80 bg-[linear-gradient(150deg,#EFEEFF_0%,#F7F7FF_55%,#F3F2FF_100%)] p-5 md:p-[30px] shadow-[0_8px_30px_rgba(110,110,255,0.05)]">
            {benefits.map((b, i) => (
              <div
                key={b.title}
                className={`py-5 first:pt-0 last:pb-0 ${
                  i !== benefits.length - 1 ? "border-b border-dashed border-indigo-100" : ""
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LogoIcon size={20} />
                  {/* Title: 500, 20px / 28px */}
                  <h3 className="font-display text-[20px] leading-[28px] font-medium tracking-normal text-[#1C1C1E]">{b.title}</h3>
                </div>
                {/* Body: 400, 17px / 28px, #62625F (same as the subtitle) */}
                <p className="mt-2 font-body text-[17px] leading-[28px] font-normal tracking-normal text-[#62625F]">{b.text}</p>
              </div>
            ))}
          </div>

          {/* Right: scorecard (766 x 548, radius 40, 30px padding so the 706 x 60 button fits) */}
          <div className="flex flex-col rounded-[40px] border border-white/80 bg-[linear-gradient(69.59deg,rgba(255,255,255,0.05)_26.14%,rgba(79,96,255,0.07)_47.47%,rgba(129,87,247,0.09)_65.05%),linear-gradient(#fff,#fff)] p-5 md:p-[30px] shadow-[0_8px_30px_rgba(110,110,255,0.05)]">
            {/* header row */}
            <div className="grid grid-cols-[1.4fr_1fr_0.55fr] items-center border-b border-dashed border-indigo-100 pb-4 font-body text-[14px] leading-[22px] md:grid-cols-[1.15fr_1fr_0.45fr] md:text-[16px] md:leading-[26px]">
              <span className="text-[#1C1C1E]">The scorecard</span>
              <span className="text-center text-[#62625F]">Prompt-only tools</span>
              <span className="flex items-center justify-center gap-2 font-medium text-indigo-600">
                <LogoIcon size={22} />
                <span className="hidden sm:inline">fluenca.ai</span>
              </span>
            </div>

            {/* rows: spread evenly so the button always sits at the bottom */}
            <div className="flex flex-1 flex-col justify-around py-5">
              {scorecard.map((row) => (
                <div
                  key={row}
                  className="grid grid-cols-[1.4fr_1fr_0.55fr] items-center font-body text-[14px] leading-[22px] md:grid-cols-[1.15fr_1fr_0.45fr] md:text-[16px] md:leading-[26px] text-[#1C1C1E]"
                >
                  <span>{row}</span>
                  <span className="text-center text-[#62625F]">--</span>
                  <span className="flex justify-center">
                    <DoubleCheck />
                  </span>
                </div>
              ))}
            </div>

            {/* CTA bar: 706 x 60, radius 14, blue gradient; text 500, 22px / 30px, centered */}
            <div className="mt-auto flex h-[48px] w-full items-center justify-center rounded-[14px] bg-[linear-gradient(95.57deg,#3659FF_-37.81%,#4F60FF_45.96%,#8157F7_115.03%)] px-4 text-center font-display text-[16px] leading-[22px] md:h-[60px] md:text-[22px] md:leading-[30px] font-medium tracking-normal text-white shadow-md shadow-indigo-200">
              Fluenca builds context before it creates.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}