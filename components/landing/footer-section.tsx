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
    <footer className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        {/* Top: logo + link columns */}
        <div className="grid grid-cols-2 border-b border-slate-200/70 md:grid-cols-4">
          {/* Logo */}
          <div className="col-span-2 pb-6 pt-10 md:col-span-1 md:pb-16 md:pt-12">
            <Link href="/" aria-label="Fluenca home" className="inline-block md:ml-10">
              <Image
                src={logoSrc}
                alt="Fluenca"
                width={96}
                height={96}
                priority
                className="w-16 md:w-20 lg:w-24"
                style={{ height: 'auto' }}
              />
            </Link>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <nav
              key={col.title}
              aria-label={col.title}
              className="relative pb-10 pt-6 md:pb-16 md:pl-12 md:pt-12 lg:pl-16"
            >
              {/* Faint vertical divider that fades at both ends */}
              <span
                aria-hidden
                className="absolute left-0 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-slate-200/80 to-transparent md:block"
              />
              <h3 className="text-sm font-medium text-[#3D5AF1]">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-900 transition-colors hover:text-[#3D5AF1]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Big wordmark: gradient text that fades to white at the top */}
        <div className="relative pt-4 md:pt-10">
          <svg
            role="img"
            aria-label={wordmark}
            viewBox="0 0 1000 215"
            className="block h-auto w-full select-none md:max-w-[1000px]"
            style={{ maxHeight: '280px' }}
          >
            <defs>
              {/* Left-to-right color: periwinkle blue to soft purple */}
              <linearGradient id="fl-color" x1="0" y1="0" x2="1000" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#7C8CFF" />
                <stop offset="0.55" stopColor="#8E94FF" />
                <stop offset="1" stopColor="#A78BFA" />
              </linearGradient>
              {/* Top-to-bottom white layer: text is hidden at the top, fully visible at the bottom */}
              <linearGradient id="fl-fade" x1="0" y1="0" x2="0" y2="215" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#000" />
                <stop offset="0.15" stopColor="#1a1a1a" />
                <stop offset="0.6" stopColor="#fff" />
                <stop offset="1" stopColor="#fff" />
              </linearGradient>
              <mask id="fl-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="215">
                <rect width="1000" height="215" fill="url(#fl-fade)" />
              </mask>
            </defs>
            <text
              x="0"
              y="185"
              fontSize="215"
              fontWeight="500"
              textLength="1000"
              lengthAdjust="spacingAndGlyphs"
              fill="url(#fl-color)"
              mask="url(#fl-mask)"
              style={{ fontFamily: "inherit" }}
            >
              {wordmark}
            </text>
          </svg>

          {/* Soft glow under the wordmark */}
          <div className="pointer-events-none absolute inset-x-[20%] bottom-0 h-8 rounded-full bg-indigo-200/30 blur-2xl" />
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-start justify-between gap-3 border-t border-slate-200/70 py-6 text-xs text-slate-900 sm:flex-row sm:items-center">
          <p>{copyright}</p>
          <div className="flex items-center gap-8">
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