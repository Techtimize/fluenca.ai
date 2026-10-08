import Image from "next/image";
import Link from "next/link";

type FooterLink = { label: string; href: string };
type FooterColumn = { title: string; links: FooterLink[] };

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "#faq" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "How It Works", href: "#how-it-works" },
      { label: "Features", href: "#features" },
      { label: "Analytics", href: "#analytics" },
      { label: "Content Creation", href: "#content-creation" },
    ],
  },
  {
    title: "Agents",
    links: [
      { label: "SEO Agent", href: "#" },
      { label: "Blog Agent", href: "#" },
      { label: "Instagram Agent", href: "#" },
      { label: "LinkedIn Agent", href: "#" },
      { label: "Content Planner", href: "#" },
      { label: "UGC Agent", href: "#" },
    ],
  },
];

type FooterSectionProps = {
  logoSrc?: string;
  columns?: FooterColumn[];
  wordmark?: string;
  copyright?: string;
  privacyHref?: string;
  termsHref?: string;
};

export default function FooterSection({
  logoSrc = "/assets/logo.svg",
  columns = DEFAULT_COLUMNS,
  wordmark = "fluenca.ai",
  copyright = "Copyright © 2026 Techtimize Ltd. All rights reserved.",
  privacyHref = "/privacy-policy",
  termsHref = "/terms-of-service",
}: FooterSectionProps) {
  return (
    // Plain white background (continues the FAQ section's white block).
    <footer
      className="relative overflow-hidden bg-white font-[family-name:var(--font-google-sans-flex)]"
    >
      {/* Figma frame is 1440 wide with 80px side gaps */}
      <div className="mx-auto max-w-[1440px] px-6 md:px-20">
          {/* Top: logo + link columns */}
        <div className="grid grid-cols-1 border-b border-slate-200/70 sm:grid-cols-2 md:grid-cols-[255px_1fr_1fr_1fr]">
          {/* Logo: 116.67 x 125 */}
          <div className="col-span-1 pb-6 pt-10 sm:col-span-2 md:col-span-1 md:pb-16 md:pt-12">
            <Link href="/" aria-label="Fluenca home" className="inline-block md:ml-16">
              <Image
                src={logoSrc}
                alt="Fluenca"
                width={117}
                height={125}
                priority
                className="h-auto w-20 md:w-[117px]"
              />
            </Link>
          </div>

          {/* Link columns: title 16/26 semibold, 14px gap, links 16/26 with 10px gap */}
          {columns.map((col) => (
            <nav
              key={col.title}
              aria-label={col.title}
              className="relative pb-10 pt-6 md:pb-16 md:pl-10 md:pt-12 lg:pl-[105px]"
            >
              {/* Faint vertical divider that fades at both ends */}
              <span
                aria-hidden
                className="absolute left-0 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-slate-200/80 to-transparent md:block"
              />
              <h3 className="text-[15px] font-semibold leading-[26px] text-[#3D5AF1] md:text-[16px]">
                {col.title}
              </h3>
              <ul className="mt-[14px] flex flex-col gap-[10px]">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[15px] font-normal leading-[26px] text-[#1C1C1E] transition-colors hover:text-[#3D5AF1] md:text-[16px]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Big wordmark */}
        <div className="relative pt-4 md:pt-10">
          <svg
            role="img"
            aria-label={wordmark}
            viewBox="0 0 1000 215"
            className="block h-auto w-full select-none"
          >
            <defs>
              {/* Left-to-right color: periwinkle blue to soft purple */}
              <linearGradient id="fl-color" x1="0" y1="0" x2="1000" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#7C8CFF" />
                <stop offset="0.55" stopColor="#8E94FF" />
                <stop offset="1" stopColor="#A78BFA" />
              </linearGradient>
            </defs>
            <text
              x="0"
              y="185"
              fontSize="215"
              fontWeight="500"
              textLength="1000"
              lengthAdjust="spacingAndGlyphs"
              fill="url(#fl-color)"
              style={{ fontFamily: "inherit" }}
            >
              {wordmark}
            </text>
          </svg>

          {/* Rectangle 141: 1306 x 240 overlay, linear-gradient(180deg, #fff 11.67%, rgba(255,255,255,0.3) 100%).
              Fades the wordmark in from the top. 1306 wide on a 1280 container = 13px past each side. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 top-0 md:-inset-x-[13px]"
            style={{
              background:
                "linear-gradient(180deg, #FFFFFF 11.67%, rgba(255, 255, 255, 0.3) 100%)",
            }}
          />

          {/* Soft glow under the wordmark */}
          <div className="pointer-events-none absolute inset-x-[20%] bottom-0 h-8 rounded-full bg-indigo-200/30 blur-2xl" />
        </div>

        {/* Bottom bar: copyright 16/26 #1C1C1E, links 40px apart */}
        <div className="flex flex-col items-start justify-between gap-3 border-t border-slate-200/70 py-6 text-[14px] font-normal leading-[26px] text-[#1C1C1E] sm:flex-row sm:items-center md:text-[16px]">
          <p>{copyright}</p>
          <div className="flex items-center gap-10">
            <Link href={privacyHref} className="transition-colors hover:text-[#3D5AF1]">
              Privacy Policy
            </Link>
            <Link href={termsHref} className="transition-colors hover:text-[#3D5AF1]">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}