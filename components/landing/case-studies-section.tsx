"use client";

// components/landing/case-studies-section.tsx
import { useRef, useState } from "react";
import Image from "next/image";

/* =====================================================================
   STEP A: THE DATA  (the only part you edit)
   Later, when your API is ready, this list is replaced by API data.
   ===================================================================== */
export type CaseStudy = {
  id: string | number;
  company: string; // shown as logo text if there is no logo image
  logo?: string; // logo image (optional)
  title: string;
  stats: { value: string; label: string }[];
  href?: string;
  image?: string; // "/assets/case-study-1.jpeg" OR a url from the API
};

/* Your images live in:  public/assets/
   In code the path starts AFTER "public", so it is "/assets/file-name"
   You have 2 images for now. The 3rd card repeats image 1.
   When you get a 3rd image, save it as case-study-3.jpeg and use it as IMAGE_3. */
const IMAGE_1 = "/assets/case-study-1.jpg";
const IMAGE_2 = "/assets/case-study-2.jpg";
const IMAGE_3 = IMAGE_1; // <- later change to "/assets/case-study-3.jpg"

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 1,
    company: "VERIDIAN",
    title: "From Business Data to a Smarter Marketing Strategy for Growth",
    stats: [
      { value: "35%", label: "Content Planning" },
      { value: "47%", label: "Website Engagement" },
    ],
    href: "#",
    image: IMAGE_1,
  },
  {
    id: 2,
    company: "NovaTech",
    title: "How NovaTech Turned Business Insights Into a Smarter Content Strategy",
    stats: [
      { value: "42%", label: "Organic Traffic" },
      { value: "3.2×", label: "Content Engagement" },
    ],
    href: "#",
    image: IMAGE_2,
  },
  {
    id: 3,
    company: "Horizon Media",
    title: "How Horizon Media Cut Research Time and Doubled Its Publishing Speed",
    stats: [
      { value: "60%", label: "Faster Research" },
      { value: "2×", label: "Publishing Speed" },
    ],
    href: "#",
    image: IMAGE_3,
  },
];

/* =====================================================================
   STEP B: THE DESIGN  (you do not need to touch anything below)
   ===================================================================== */

/* Gradient shown only when a card has no image (or the image fails to load) */
const FALLBACK_IMAGES = [
  "bg-[linear-gradient(115deg,#0f172a_0%,#94a3b8_22%,#f8fafc_38%,#475569_52%,#cbd5e1_72%,#1e293b_100%)]",
  "bg-[radial-gradient(circle_at_30%_30%,#7c3aed_0%,transparent_45%),radial-gradient(circle_at_75%_70%,#ec4899_0%,transparent_45%),linear-gradient(135deg,#1d4ed8,#312e81)]",
  "bg-[radial-gradient(circle_at_70%_25%,#22d3ee_0%,transparent_45%),radial-gradient(circle_at_25%_75%,#6366f1_0%,transparent_50%),linear-gradient(135deg,#0f172a,#1e3a8a)]",
];

/* ------------------------------ PARTS ------------------------------ */

function Logo({ company, src }: { company: string; src?: string }) {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <Image
        src={src}
        alt={company}
        width={170}
        height={28}
        draggable={false}
        onError={() => setFailed(true)}
        className="h-7 w-auto max-w-[170px] object-contain"
      />
    );
  }
  return (
    <div className="flex items-center gap-2.5">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 2.5 20.5 7.4v9.2L12 21.5l-8.5-4.9V7.4L12 2.5Z"
          stroke="#F59E0B"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path d="M12 8.2 16 10.5v3L12 15.8 8 13.5v-3l4-2.3Z" fill="#F59E0B" />
      </svg>
      {/* Logo text: IBM Plex Mono 500, 18px / 32px */}
      <span className="font-mono text-[18px] font-medium leading-[32px] tracking-normal text-slate-800">
        {company}
      </span>
    </div>
  );
}

function CardImage({ src, alt, index }: { src?: string; alt: string; index: number }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <div className={`h-full w-full ${FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}`} />;
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 45vw, 350px"
      draggable={false}
      onError={() => setFailed(true)}
      className="object-cover"
    />
  );
}

function CaseCard({ item, index }: { item: CaseStudy; index: number }) {
  return (
    // Card: 800 x 400, 1px border, radius 30, padding 10.
    // Background: soft lavender on the left fading to white (as in the design screenshot).
    <article
      data-card
      className="flex h-auto w-[90vw] max-w-[800px] shrink-0 snap-start flex-col rounded-[30px] border border-[#E9ECFF] bg-[linear-gradient(100deg,#efeeff_0%,#ffffff_58%)] p-[10px] shadow-[0_4px_30px_rgba(99,102,241,0.08)] md:h-[400px] md:flex-row md:gap-3"
    >
      {/* Image side: full width on mobile (top), right side on desktop */}
      <div className="relative h-[180px] w-full shrink-0 overflow-hidden rounded-[20px] md:h-auto md:w-[350px] md:rounded-[30px]">
        <CardImage src={item.image} alt={item.company} index={index} />
      </div>

      {/* Text side */}
      <div className="flex min-w-0 flex-1 flex-col justify-between py-4 pl-3 pr-2 md:py-5">
        <div>
          <Logo company={item.company} src={item.logo} />
          {/* max width makes the title wrap into 3 short lines, like the design */}
          {/* Title: 500, 22px / 32px (a bit smaller on phones so it fits) */}
          <h3 className="mt-4 max-w-[340px] font-display text-[18px] font-medium leading-[26px] tracking-normal text-slate-900 md:mt-7 md:text-[22px] md:leading-[32px]">
            {item.title}
          </h3>
        </div>

        <div>
          <div className="flex gap-6 md:gap-[72px]">
            {item.stats.slice(0, 2).map((s) => (
              <div key={s.label}>
                {/* Value: 500, 22px / 32px */}
                <p className="font-display text-[18px] font-medium leading-[28px] tracking-normal text-slate-900 md:text-[22px] md:leading-[32px]">
                  {s.value}
                </p>
                {/* Label: 400, 14px / 24px, #62625F */}
                <p className="mt-1 text-[14px] font-normal leading-[24px] tracking-normal text-[#62625F]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
          {/* Button: 182 x 42, radius 50, padding 10/28, gap 10, gradient */}
          <a
            href={item.href ?? "#"}
            draggable={false}
            className="mt-4 inline-flex h-[42px] w-[182px] items-center justify-center gap-[10px] whitespace-nowrap rounded-[50px] bg-[linear-gradient(95.57deg,#3659FF_-37.81%,#4F60FF_45.96%,#8157F7_115.03%)] px-7 py-[10px] text-[16px] font-medium leading-[22px] text-white transition hover:opacity-90 md:mt-6"
          >
            Read Case Study
          </a>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------ SECTION ------------------------------ */

export default function CaseStudiesSection({
  items = CASE_STUDIES,
}: {
  items?: CaseStudy[]; // pass API data here later
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const [dragging, setDragging] = useState(false);

  // left padding: 80px at 1440px wide (first card starts at left 80 in Figma), scales down on smaller screens
  const sidePad = "max(24px, min(5.5556vw, 80px), calc((100vw - 1440px) / 2 + 80px))";

  const cardStep = () => {
    const card = trackRef.current?.querySelector<HTMLElement>("[data-card]");
    return card ? card.offsetWidth + 16 : 400;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return; // touch scrolls natively
    const el = trackRef.current!;
    drag.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft, moved: false };
    el.style.scrollSnapType = "none";
    el.setPointerCapture(e.pointerId);
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 5) drag.current.moved = true;
    trackRef.current!.scrollLeft = drag.current.startScroll - dx;
  };

  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setDragging(false);
    const el = trackRef.current!;
    const step = cardStep();
    const target = Math.round(el.scrollLeft / step) * step;
    el.style.scrollSnapType = "";
    el.scrollTo({ left: target, behavior: "smooth" });
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  return (
    // Rounded top corners, same method as the FAQ. No overlap needed.
    // Background layers (top to bottom):
    //  1. white fade in the top-left corner (blends the left curve into the section above)
    //  2. top-left lavender glow
    //  3. right-side lavender glow
    //  4. BOTTOM-LEFT glow copied from the FAQ section's top gradient (#E3E8FF -> #F6F7FF -> transparent),
    //     so the end of this section and the start of the FAQ section read as one continuous background.
    <section
      id="case-studies"
      className="relative z-10 w-full overflow-hidden rounded-t-[40px] bg-white py-16 font-body md:rounded-t-[56px] md:py-20 bg-[radial-gradient(circle_140px_at_0%_0%,#ffffff_0%,#ffffff_40%,rgba(255,255,255,0)_100%),radial-gradient(ellipse_at_12%_0%,rgba(199,206,255,0.85)_0%,rgba(255,255,255,0)_38%),radial-gradient(ellipse_at_100%_30%,rgba(226,222,255,0.7)_0%,rgba(255,255,255,0)_35%),radial-gradient(60%_50%_at_0%_100%,#E3E8FF_0%,#F6F7FF_55%,rgba(255,255,255,0)_100%)]"
    >
      {/* Heading */}
      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 text-center">
        {/* Pill: 156 x 34, radius 40, padding 4/20, gap 10, bg #F0F3FF */}
        <span className="inline-flex h-[34px] w-[156px] max-w-full items-center justify-center gap-[10px] whitespace-nowrap rounded-[40px] bg-[#F0F3FF] px-5 py-1 text-[16px] font-normal leading-[26px] text-indigo-500">
          Our Case study
        </span>
        {/* H2: 565 x 60, 500, 50px / 60px, centered (a bit smaller on phones so it fits) */}
        <h2 className="mt-3 w-[565px] max-w-full font-display text-[36px] font-medium leading-[44px] tracking-normal text-[#1C1C1E] md:whitespace-nowrap md:text-[50px] md:leading-[60px]">
          Insights Into Real Results
        </h2>
      </div>

      {/* Draggable track */}
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        style={{ paddingInline: sidePad, scrollPaddingInline: sidePad }}
        className={`mt-10 flex select-none gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {items.map((item, i) => (
          <CaseCard key={item.id} item={item} index={i} />
        ))}
        {/* extra space at the end so the last card can reach the left edge */}
        <div className="w-[8vw] shrink-0" aria-hidden />
      </div>
    </section>
  );
}