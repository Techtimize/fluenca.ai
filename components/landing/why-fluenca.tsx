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
  return <Image src={LOGO_ICON} alt="" width={size} height={size} className="shrink-0" />;
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
    // NOTE: no fixed height anywhere on this section, so it always grows to fit its content.
    // The bottom padding is the "safe zone" that the next section is allowed to overlap.
    <section
      id="why-fluenca"
      className="relative z-10 mt-4 w-full overflow-hidden rounded-t-[32px] bg-white pb-[72px] pt-10 md:mt-6 md:rounded-t-[56px] md:pb-[96px] md:pt-14 bg-[radial-gradient(ellipse_70%_100%_at_85%_0%,rgba(214,222,255,0.95)_0%,rgba(255,255,255,0)_100%),radial-gradient(ellipse_at_0%_0%,rgba(226,230,255,0.7)_0%,rgba(255,255,255,0)_30%),radial-gradient(ellipse_30%_30%_at_0%_32%,rgba(214,222,255,0.85)_0%,rgba(255,255,255,0)_100%),radial-gradient(ellipse_45%_40%_at_0%_100%,rgba(214,222,255,0.9)_0%,rgba(255,255,255,0)_100%),radial-gradient(ellipse_40%_40%_at_100%_92%,rgba(222,220,255,0.85)_0%,rgba(255,255,255,0)_100%)]"
    >
      {/* soft background glows */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-[1328px] px-4 sm:px-6">
        {/* Heading */}
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex h-[34px] items-center justify-center gap-[10px] rounded-[40px] border border-indigo-100 bg-white px-5 py-1 font-body text-[11px] font-normal text-indigo-500 shadow-sm">
            Why Fluenca.ai
          </span>

          <h2 className="mt-4 w-full max-w-[590px] font-display text-[28px] font-medium leading-[36px] tracking-normal text-slate-900 sm:text-[36px] sm:leading-[44px] md:text-[50px] md:leading-[60px]">
            Generic AI
            <br />
            guesses. <span className="text-indigo-500">Fluenca knows.</span>
          </h2>

          <p className="mt-4 max-w-[500px] font-body text-[15px] font-normal leading-[24px] tracking-normal text-[#62625F] md:text-[17px] md:leading-[28px]">
            Verify your business once, and everything Fluenca creates starts from the truth.
          </p>
        </div>

        {/* Two cards. Below `lg` they stack; from `lg` up they sit side by side.
            Uses min-height (not a fixed height), so text can never spill out of the cards. */}
        <div className="mt-8 flex flex-col gap-4 md:mt-10 md:gap-5 lg:grid lg:min-h-[548px] lg:grid-cols-[494fr_766fr]">
          {/* Left: benefits */}
          <div className="flex flex-col justify-between rounded-[28px] border border-white/80 bg-[linear-gradient(150deg,#EFEEFF_0%,#F7F7FF_55%,#F3F2FF_100%)] p-5 shadow-[0_8px_30px_rgba(110,110,255,0.05)] md:rounded-[40px] md:p-[30px]">
            {benefits.map((b, i) => (
              <div
                key={b.title}
                className={`py-4 first:pt-0 last:pb-0 md:py-5 ${
                  i !== benefits.length - 1 ? "border-b border-dashed border-indigo-100" : ""
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LogoIcon size={20} />
                  <h3 className="font-display text-[18px] font-medium leading-[26px] tracking-normal text-[#1C1C1E] md:text-[20px] md:leading-[28px]">
                    {b.title}
                  </h3>
                </div>
                <p className="mt-1.5 font-body text-[15px] font-normal leading-[24px] tracking-normal text-[#62625F] md:mt-2 md:text-[17px] md:leading-[28px]">
                  {b.text}
                </p>
              </div>
            ))}
          </div>

          {/* Right: scorecard */}
          <div className="flex flex-col rounded-[28px] border border-white/80 bg-[linear-gradient(69.59deg,rgba(255,255,255,0.05)_26.14%,rgba(79,96,255,0.07)_47.47%,rgba(129,87,247,0.09)_65.05%),linear-gradient(#fff,#fff)] p-4 shadow-[0_8px_30px_rgba(110,110,255,0.05)] sm:p-5 md:rounded-[40px] md:p-[30px]">
            {/* header row */}
            <div className="grid grid-cols-[1.4fr_1fr_0.55fr] items-center border-b border-dashed border-indigo-100 pb-4 font-body text-[13px] leading-[20px] sm:text-[14px] sm:leading-[22px] md:grid-cols-[1.15fr_1fr_0.45fr] md:text-[16px] md:leading-[26px]">
              <span className="text-[#1C1C1E]">The scorecard</span>
              <span className="text-center text-[#62625F]">Prompt-only tools</span>
              <span className="flex items-center justify-center gap-2 font-medium text-indigo-600">
                <LogoIcon size={22} />
                <span className="hidden sm:inline">fluenca.ai</span>
              </span>
            </div>

            {/* rows: spread evenly so the button always sits at the bottom */}
            <div className="flex flex-1 flex-col justify-around gap-4 py-5 md:gap-0">
              {scorecard.map((row) => (
                <div
                  key={row}
                  className="grid grid-cols-[1.4fr_1fr_0.55fr] items-center font-body text-[13px] leading-[20px] text-[#1C1C1E] sm:text-[14px] sm:leading-[22px] md:grid-cols-[1.15fr_1fr_0.45fr] md:text-[16px] md:leading-[26px]"
                >
                  <span className="pr-2">{row}</span>
                  <span className="text-center text-[#62625F]">--</span>
                  <span className="flex justify-center">
                    <DoubleCheck />
                  </span>
                </div>
              ))}
            </div>

            {/* CTA bar */}
            <div className="mt-auto flex min-h-[48px] w-full items-center justify-center rounded-[14px] bg-[linear-gradient(95.57deg,#3659FF_-37.81%,#4F60FF_45.96%,#8157F7_115.03%)] px-4 py-3 text-center font-display text-[15px] font-medium leading-[22px] tracking-normal text-white shadow-md shadow-indigo-200 sm:text-[16px] md:min-h-[60px] md:text-[22px] md:leading-[30px]">
              Fluenca builds context before it creates.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}