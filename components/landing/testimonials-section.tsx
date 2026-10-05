// components/landing/testimonials-section.tsx

/* ------------------------------ TYPES ------------------------------ */

export type Testimonial = {
  quote: string;
  name: string;
  role: string; // e.g. "Founder, NovaTech"
  avatar?: string; // image url (optional). Falls back to initials
};

/* ----------------------- TEMPORARY DATA (replace with API) -----------------------
   Later: fetch from your API in app/page.tsx and pass it like
   <TestimonialsSection items={data} />                                        */
const FALLBACK_ITEMS: Testimonial[] = [
  {
    quote:
      "Instead of spending hours researching competitors and content ideas, Fluenca brings everything together and gives us a clear direction.",
    name: "Daniel Carter",
    role: "Founder, NovaTech",
  },
  {
    quote:
      "Fluenca helped us understand our business better, uncover new opportunities, and turn our insights into a clear marketing strategy that actually fits our goals.",
    name: "Sarah Mitchell",
    role: "Founder",
  },
  {
    quote:
      "Fluenca makes it easy to turn business insights into content, campaigns, and actionable marketing ideas, helping us save time, stay focused, and create with a clear direction.",
    name: "Emma Wilson",
    role: "Growth Manager, BrightWorks",
  },
  {
    quote:
      "Fluenca gave our small team the research depth of a full agency, and we now publish with confidence every single week.",
    name: "Michael Chen",
    role: "Marketing Lead, Orbit Labs",
  },
  {
    quote:
      "Fluenca's intuitive platform empowers us to craft targeted campaigns effortlessly, unlocking new opportunities and maximizing ROI across channels.",
    name: "Sophia Martinez",
    role: "Digital Strategist, Veridian Solutions",
  },
  {
    quote:
      "The seamless integration of Fluenca into our workflow has revolutionized how we generate content ideas, ensuring every piece aligns with real business objectives.",
    name: "Raj Patel",
    role: "Content Lead, Horizon Media",
  },
  {
    quote:
      "Fluenca bridges the gap between data and creativity, enabling our team to produce insightful marketing initiatives that truly move the needle.",
    name: "Olivia Nguyen",
    role: "Brand Manager, LuminaTech",
  },
  {
    quote:
      "We finally have one source of truth for our brand, and every channel now draws from it. It has saved us hours every week.",
    name: "James Foster",
    role: "COO, Brightline",
  },
];

/* ------------------------------ PARTS ------------------------------ */

function QuoteIcon() {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden>
      <path
        d="M0 14V8.4C0 3.7 2.2 1 6.6 0l.9 1.9C5.3 2.6 4.3 4 4.3 6H7.5V14H0Zm10.5 0V8.4C10.5 3.7 12.7 1 17.1 0L18 1.9C15.8 2.6 14.8 4 14.8 6H18V14h-7.5Z"
        fill="#4F5BF5"
      />
    </svg>
  );
}

function Avatar({ name, src }: { name: string; src?: string }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name} className="h-9 w-9 shrink-0 rounded-full object-cover" />;
  }
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-semibold text-white">
      {name.charAt(0)}
    </span>
  );
}

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <figure className="mr-4 flex w-[300px] shrink-0 flex-col justify-between rounded-3xl bg-indigo-50/80 p-5 md:w-[340px]">
      <div>
        <QuoteIcon />
        <blockquote className="mt-3 text-xs leading-relaxed text-slate-600">
          {item.quote}
        </blockquote>
      </div>
      <figcaption className="mt-5 flex items-center gap-3">
        <Avatar name={item.name} src={item.avatar} />
        <div>
          <p className="text-xs font-semibold text-slate-900">{item.name}</p>
          <p className="text-[11px] text-slate-500">{item.role}</p>
        </div>
      </figcaption>
    </figure>
  );
}

/** One row of cards. The list is rendered twice so the loop never shows a gap. */
function MarqueeRow({
  items,
  direction,
  duration,
}: {
  items: Testimonial[];
  direction: "left-to-right" | "right-to-left";
  duration: number; // seconds for one full loop
}) {
  const animation =
    direction === "left-to-right" ? "fl-marquee-right" : "fl-marquee-left";

  return (
    <div className="fl-marquee group flex w-full overflow-hidden">
      <div
        className="fl-track flex w-max"
        style={{ animation: `${animation} ${duration}s linear infinite` }}
      >
        {[...items, ...items].map((item, i) => (
          <TestimonialCard key={`${item.name}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ SECTION ------------------------------ */

export default function TestimonialsSection({
  items = FALLBACK_ITEMS,
}: {
  items?: Testimonial[];
}) {
  const half = Math.ceil(items.length / 2);
  const topRow = items.slice(0, half);
  const bottomRow = items.slice(half).length ? items.slice(half) : items;

  return (
    <section id="testimonials" className="w-full overflow-hidden bg-white py-16 md:py-20">
      {/* keyframes + hover pause + reduced motion */}
      <style>{`
        @keyframes fl-marquee-left  { from { transform: translateX(0); }    to { transform: translateX(-50%); } }
        @keyframes fl-marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        .fl-marquee:hover .fl-track { animation-play-state: paused !important; }
        @media (prefers-reduced-motion: reduce) { .fl-track { animation: none !important; } }
      `}</style>

      {/* Header */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-start gap-6 md:grid-cols-[3fr_2fr] md:gap-10">
          <div>
            <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-normal text-indigo-500">
              What Businesses Say About Fluenca
            </span>
            <h2 className="mt-3 text-3xl font-medium leading-[1.15] tracking-tight text-slate-900 md:text-[40px]">
              Real experiences from
              <br />
              businesses{" "}
              <span className="text-indigo-500">using Fluenca.</span>
            </h2>
          </div>

          <p className="max-w-sm text-[13px] leading-relaxed text-slate-600 md:ml-auto md:mt-6">
            Fluenca gave us a much clearer picture of our business and where our
            marketing opportunities are. It saved us hours of research and helped
            us turn insights into content much faster.
          </p>
        </div>
      </div>

      {/* Rows */}
      <div className="mt-12 flex flex-col gap-4">
        <MarqueeRow items={topRow} direction="left-to-right" duration={45} />
        <MarqueeRow items={bottomRow} direction="right-to-left" duration={50} />
      </div>
    </section>
  );
}