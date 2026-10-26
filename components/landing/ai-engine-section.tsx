import type { ReactNode } from "react";
import Image from "next/image";
import { TrendingUp } from "lucide-react";

interface FlowItem {
  title: string;
  subtitle: string;
  logo: ReactNode;
  /** Connector line + dot colour */
  color: string;
  /** Platform-specific analytics shown in the floating card above the icon */
  stat: { value: string; label: string; trend: number[] };
}

const pngLogo = (src: string, alt: string) => (
  <Image src={src} alt={alt} width={48} height={48} className="size-12 rounded-xl object-contain" />
);

const FacebookLogo = (
  <svg viewBox="0 0 48 48" className="size-12" role="img" aria-label="Facebook">
    <rect width="48" height="48" rx="11" fill="#1877F2" />
    <path
      d="M27.5 40V27.3h4.3l.6-5h-4.9v-3.2c0-1.4.4-2.4 2.5-2.4h2.6v-4.4a35 35 0 0 0-3.8-.2c-3.8 0-6.3 2.3-6.3 6.5v3.7h-4.3v5h4.3V40h5z"
      fill="#fff"
    />
  </svg>
);

const GoogleAnalyticsLogo = (
  <svg viewBox="0 0 48 48" className="size-12" role="img" aria-label="Google Analytics">
    <rect x="29" y="6" width="9" height="36" rx="4.5" fill="#F9AB00" />
    <rect x="18" y="18" width="9" height="24" rx="4.5" fill="#E37400" />
    <circle cx="11.5" cy="37.5" r="4.5" fill="#E37400" />
  </svg>
);

const GoogleLogo = (
  <svg viewBox="0 0 48 48" className="size-12 p-1" role="img" aria-label="Google Search Console">
    <path fill="#4285F4" d="M43.6 24.5c0-1.5-.1-2.9-.4-4.3H24v8.1h11c-.5 2.6-1.9 4.7-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15.1z" />
    <path fill="#34A853" d="M24 44c5.5 0 10.2-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.2 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3C9.1 39.5 16 44 24 44z" />
    <path fill="#FBBC05" d="M12.6 27.6c-.4-1.2-.6-2.5-.6-3.6s.2-2.5.6-3.6v-5.3H5.8A20 20 0 0 0 4 24c0 3.2.8 6.3 1.8 8.9l6.8-5.3z" />
    <path fill="#EA4335" d="M24 12c3 0 5.7 1 7.8 3l5.8-5.8C34.2 6 29.5 4 24 4 16 4 9.1 8.5 5.8 15.1l6.8 5.3C14.2 15.6 18.7 12 24 12z" />
  </svg>
);

const leftItems: FlowItem[] = [
  {
    title: "Instagram",
    subtitle: "Capture & Engage",
    logo: pngLogo("/assets/insta.png", "Instagram"),
    color: "#D63AD8",
    stat: { value: "+32%", label: "Engagement", trend: [4, 6, 5, 8, 7, 10, 12] },
  },
  {
    title: "LinkedIn",
    subtitle: "Nurture & Engage",
    logo: pngLogo("/assets/linkedin.png", "LinkedIn"),
    color: "#1E7FE0",
    stat: { value: "1.2k", label: "Leads", trend: [3, 4, 4, 6, 7, 7, 9] },
  },
  {
    title: "Reddit",
    subtitle: "Discover & Analyze",
    logo: pngLogo("/assets/reddit.png", "Reddit"),
    color: "#F07A1A",
    stat: { value: "4.8k", label: "Mentions", trend: [5, 4, 6, 5, 8, 9, 11] },
  },
  {
    title: "TikTok",
    subtitle: "Create & Grow",
    logo: pngLogo("/assets/tik-tok.png", "TikTok"),
    color: "#16B3C6",
    stat: { value: "2.4M", label: "Views", trend: [2, 4, 3, 7, 8, 11, 13] },
  },
];

const rightItems: FlowItem[] = [
  {
    title: "Facebook",
    subtitle: "Build & Engage",
    logo: FacebookLogo,
    color: "#1D4ED8",
    stat: { value: "+27%", label: "Reach", trend: [4, 5, 7, 6, 8, 9, 10] },
  },
  {
    title: "Google Analytics",
    subtitle: "Track & Measure",
    logo: GoogleAnalyticsLogo,
    color: "#F5B400",
    stat: { value: "12.5k", label: "Sessions", trend: [5, 6, 6, 8, 9, 10, 12] },
  },
  {
    title: "Google Search Console",
    subtitle: "Improve & Rank",
    logo: GoogleLogo,
    color: "#16A34A",
    stat: { value: "#3", label: "Avg. rank", trend: [3, 4, 6, 6, 8, 10, 11] },
  },
  {
    title: "X (Twitter)",
    subtitle: "Monitor & Engage",
    logo: pngLogo("/assets/x.png", "X"),
    color: "#7C3AED",
    stat: { value: "8.9k", label: "Impressions", trend: [6, 5, 7, 8, 7, 10, 11] },
  },
];

// Desktop canvas is a fixed 1100x500, so the connector paths line up with the cards exactly.
const CANVAS_W = 1100;
const CANVAS_H = 500;
const CENTER_X = CANVAS_W / 2;
const CENTER_Y = 250;
const ORB_SIZE = 200;
const RING_R = 118; // dots sit on the white ring around the orb
const CARD_W = 250;
const CARD_H = 76;
const ROW_Y = [85, 195, 305, 415]; // card centres (gaps leave room for the stat cards)
const DOT_DY = [-54, -18, 18, 54]; // dot offsets on the ring
const ARROW_GAP = 18; // space between arrow tip and card

const dotX = (dy: number) => Math.sqrt(RING_R ** 2 - dy ** 2);

/** Smooth S-curve from a ring dot out to the card's arrow tip. */
function connector(side: "left" | "right", index: number) {
  const sx = CENTER_X + (side === "left" ? -1 : 1) * dotX(DOT_DY[index]);
  const sy = CENTER_Y + DOT_DY[index];
  const ex = side === "left" ? CARD_W + ARROW_GAP : CANVAS_W - CARD_W - ARROW_GAP;
  const ey = ROW_Y[index];
  const mx = (sx + ex) / 2;
  return { sx, sy, d: `M${sx} ${sy} C${mx} ${sy} ${mx} ${ey} ${ex} ${ey}` };
}

/** Tiny trend line for the stat card. */
function Sparkline({ points, color }: { points: number[]; color: string }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const coords = points
    .map((p, i) => `${(i / (points.length - 1)) * 40},${14 - ((p - min) / (max - min || 1)) * 12}`)
    .join(" ");
  return (
    <svg viewBox="0 0 40 16" className="h-4 w-10 shrink-0" aria-hidden="true">
      <polyline points={coords} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Floating analytics card that sits above the platform icon. */
function StatCard({ stat, color, delay }: { stat: FlowItem["stat"]; color: string; delay: number }) {
  return (
    <div
      className="ai-engine-stat absolute -top-[30px] left-2 z-20 flex items-center gap-2 rounded-xl border border-[#EEF0FA] bg-white py-1.5 pl-2 pr-2.5 shadow-[0_8px_20px_-8px_rgba(30,20,90,0.35)]"
      style={{ animationDelay: `${delay}s` }}
    >
      <span className="grid size-5 shrink-0 place-items-center rounded-md" style={{ backgroundColor: `${color}1A`, color }}>
        <TrendingUp aria-hidden="true" className="size-3" strokeWidth={2.5} />
      </span>
      <span className="whitespace-nowrap text-[12px] leading-none">
        <span className="font-bold text-[#14163A]">{stat.value}</span>{" "}
        <span className="text-gray-500">{stat.label}</span>
      </span>
      <Sparkline points={stat.trend} color={color} />
      {/* little pointer down to the icon */}
      <span className="absolute -bottom-[5px] left-5 size-2.5 rotate-45 border-b border-r border-[#EEF0FA] bg-white" />
    </div>
  );
}

function FlowCard({ title, subtitle, logo, color, stat, delay = 0 }: FlowItem & { delay?: number }) {
  return (
    <div
      className="relative flex w-full items-center gap-4 rounded-2xl border border-[#EEF0FA] bg-white px-4 shadow-[0_10px_30px_-14px_rgba(79,70,229,0.3)]"
      style={{ height: CARD_H }}
    >
      <StatCard stat={stat} color={color} delay={delay} />
      <span className="grid size-12 shrink-0 place-items-center">{logo}</span>
      <div className="min-w-0">
        <p className="truncate text-[15px] font-semibold text-[#14163A]">{title}</p>
        <p className="truncate text-[13px] text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-[#D9DBF5] bg-white/70 px-5 py-1.5 text-[12px] font-semibold tracking-[0.08em] text-brand">
      {children}
    </span>
  );
}

function Orb({ size }: { size: number }) {
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      {/* soft glow, faint outer ring, white ring */}
      <span className="absolute -inset-16 rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.28)_0%,rgba(124,92,255,0)_65%)]" />
      <span className="absolute -inset-11 rounded-full border border-[#E2E0FF]" />
      <span className="absolute -inset-[18px] rounded-full border-[3px] border-white bg-white/25 shadow-[0_0_40px_rgba(124,92,255,0.3)]" />
      {/* pulse waves going out towards the platforms */}
      <span className="absolute inset-0 animate-ping rounded-full bg-[#7C5CFF]/20 animation-duration-[2.6s] motion-reduce:hidden" />
      <div className="relative grid size-full place-items-center rounded-full bg-[radial-gradient(circle_at_40%_25%,#A78BFA_0%,#6D4BF5_45%,#3B2BD9_100%)] shadow-[inset_0_-14px_34px_rgba(30,10,120,0.45),0_24px_60px_-12px_rgba(79,70,229,0.65)]">
        <span className="grid size-[62%] place-items-center rounded-full bg-white shadow-[0_8px_24px_-6px_rgba(30,10,120,0.5)]">
          <Image src="/assets/Logo.svg" alt="Fluenca" width={62} height={63} className="h-auto w-[56%]" />
        </span>
      </div>
    </div>
  );
}

export default function AiEngineSection() {
  const connectors = [
    ...leftItems.map((item, i) => ({ ...connector("left", i), color: item.color, key: `l${i}` })),
    ...rightItems.map((item, i) => ({ ...connector("right", i), color: item.color, key: `r${i}` })),
  ];

  return (
    <section className="bg-white px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto w-full max-w-[1240px] overflow-hidden rounded-3xl bg-linear-to-br from-[#F8F7FF] via-[#F3F3FF] to-[#EEEDFF] px-4 py-10 sm:px-8 lg:py-12">
        {/* Desktop: connected diagram */}
        <div className="relative mx-auto hidden xl:block" style={{ width: CANVAS_W, height: CANVAS_H }}>
          <svg
            aria-hidden="true"
            viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
            className="absolute inset-0 z-[5] size-full overflow-visible"
          >
            <defs>
              {connectors.map(({ key, color }) => (
                <marker
                  key={key}
                  id={`ai-engine-arrow-${key}`}
                  viewBox="0 0 12 12"
                  refX="9"
                  refY="6"
                  markerWidth="9"
                  markerHeight="9"
                  markerUnits="userSpaceOnUse"
                  orient="auto"
                >
                  <path d="M2 1.5 L9.5 6 L2 10.5" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </marker>
              ))}
            </defs>
            {connectors.map(({ key, d, color }) => (
              <g key={key}>
                <path
                  d={d}
                  fill="none"
                  stroke={color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  markerEnd={`url(#ai-engine-arrow-${key})`}
                />
                {/* flowing dashes, moving from Fluenca out to the platform */}
                <path
                  d={d}
                  fill="none"
                  stroke="#fff"
                  strokeOpacity="0.7"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="4 14"
                  className="ai-engine-flow motion-reduce:hidden"
                />
              </g>
            ))}

            {/* glowing data packets travelling from Fluenca to each platform */}
            <g className="motion-reduce:hidden">
              {connectors.map(({ key, d, color }, i) => (
                <g key={key}>
                  {[0, 1].map((n) => (
                    <circle key={n} r="4.5" opacity="0" fill={color} style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
                      <animateMotion
                        dur="2.4s"
                        repeatCount="indefinite"
                        begin={`${(i % 4) * 0.3 + n * 1.2}s`}
                        path={d}
                        keyPoints="0;1"
                        keyTimes="0;1"
                        calcMode="spline"
                        keySplines="0.4 0 0.6 1"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;1;1;0"
                        keyTimes="0;0.15;0.85;1"
                        dur="2.4s"
                        repeatCount="indefinite"
                        begin={`${(i % 4) * 0.3 + n * 1.2}s`}
                      />
                    </circle>
                  ))}
                </g>
              ))}
            </g>
          </svg>

          {/* Left cards */}
          {leftItems.map((item, i) => (
            <div key={item.title} className="absolute left-0 z-10" style={{ width: CARD_W, top: ROW_Y[i] - CARD_H / 2 }}>
              <FlowCard {...item} delay={i * 0.6} />
            </div>
          ))}

          {/* Centre */}
          <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2">
            <Pill>AUTOMATE</Pill>
          </div>
          <div
            className="absolute z-0"
            style={{ left: CENTER_X - ORB_SIZE / 2, top: CENTER_Y - ORB_SIZE / 2 }}
          >
            <Orb size={ORB_SIZE} />
          </div>
          <div className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2">
            <Pill>OPTIMIZE</Pill>
          </div>

          {/* Ring dots, drawn above the orb */}
          <svg
            aria-hidden="true"
            viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
            className="pointer-events-none absolute inset-0 z-10 size-full overflow-visible"
          >
            {connectors.map(({ key, sx, sy, color }) => (
              <circle key={key} cx={sx} cy={sy} r="7" fill="#fff" stroke={color} strokeWidth="3" />
            ))}
          </svg>

          {/* Right cards */}
          {rightItems.map((item, i) => (
            <div key={item.title} className="absolute right-0 z-10" style={{ width: CARD_W, top: ROW_Y[i] - CARD_H / 2 }}>
              <FlowCard {...item} delay={i * 0.6 + 0.3} />
            </div>
          ))}
        </div>

        {/* Mobile / tablet: stacked */}
        <div className="flex flex-col items-center gap-3 xl:hidden">
          <div className="grid w-full max-w-md gap-x-3 gap-y-11 pt-8 sm:max-w-2xl sm:grid-cols-2">
            {leftItems.map((item) => (
              <FlowCard key={item.title} {...item} />
            ))}
          </div>
          <div className="my-8 flex flex-col items-center gap-16">
            <Pill>AUTOMATE</Pill>
            <Orb size={160} />
            <Pill>OPTIMIZE</Pill>
          </div>
          <div className="grid w-full max-w-md gap-x-3 gap-y-11 pt-8 sm:max-w-2xl sm:grid-cols-2">
            {rightItems.map((item) => (
              <FlowCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
