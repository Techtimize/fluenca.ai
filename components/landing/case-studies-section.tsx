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
      <span className="font-mono text-[15px] font-medium tracking-[0.08em] text-slate-800">
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
      sizes="(max-width: 640px) 45vw, 295px"
      draggable={false}
      onError={() => setFailed(true)}
      className="object-cover"
    />
  );
}

function CaseCard({ item, index }: { item: CaseStudy; index: number }) {
  return (
    <article
      data-card
      className="flex h-[326px] w-[90vw] max-w-[640px] shrink-0 snap-start gap-3 rounded-[28px] border border-white bg-[linear-gradient(100deg,#efeeff_0%,#ffffff_58%)] p-2 shadow-[0_4px_30px_rgba(99,102,241,0.08)]"
    >
      {/* Text side */}
      <div className="flex min-w-0 flex-1 flex-col justify-between py-4 pl-5 pr-2">
        <div>
          <Logo company={item.company} src={item.logo} />
          {/* max width makes the title wrap into 3 short lines, like the design */}
          <h3 className="mt-7 max-w-[250px] text-[17px] font-medium leading-[1.45] text-slate-900">
            {item.title}
          </h3>
        </div>

        <div>
          <div className="flex gap-10">
            {item.stats.slice(0, 2).map((s) => (
              <div key={s.label}>
                <p className="text-[16px] font-medium text-slate-900">{s.value}</p>
                <p className="mt-1 text-[12.5px] text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
          <a
            href={item.href ?? "#"}
            draggable={false}
            className="mt-6 inline-flex h-10 items-center rounded-full bg-[#5B5BF0] px-6 text-[13px] font-medium text-white transition hover:bg-[#4a4ae0]"
          >
            Read Case Study
          </a>
        </div>
      </div>

      {/* Image side: tall, rounded, almost full height ("relative" is needed for the image) */}
      <div className="relative w-[46%] shrink-0 overflow-hidden rounded-[22px]">
        <CardImage src={item.image} alt={item.company} index={index} />
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

  // left padding that lines up with the page container (max-w-6xl = 1152px)
  const sidePad = "max(24px, calc((100vw - 1152px) / 2 + 24px))";

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
    <section
      id="case-studies"
      className="relative w-full overflow-hidden bg-white py-16 md:py-20 bg-[radial-gradient(ellipse_at_12%_0%,rgba(199,206,255,0.85)_0%,rgba(255,255,255,0)_38%),radial-gradient(ellipse_at_100%_30%,rgba(226,222,255,0.7)_0%,rgba(255,255,255,0)_35%),radial-gradient(ellipse_at_50%_100%,rgba(208,214,255,0.7)_0%,rgba(255,255,255,0)_40%)]"
    >
      {/* Heading */}
      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 text-center">
        <span className="rounded-full border border-indigo-100 bg-white/70 px-3 py-1 text-[11px] text-indigo-500">
          Our Case study
        </span>
        <h2 className="mt-3 text-3xl font-medium tracking-tight text-slate-900 md:text-[40px]">
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