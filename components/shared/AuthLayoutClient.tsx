"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";

const LOGO_SRC = "/assets/logo.svg";

// Pages that use the small card. Every other auth page (login, signup) is shown full size.
const CARD_PAGES = [
  "forgot-password",
  "verify-otp",
  "verify-email",
  "change-password",
  "password-updated",
];

export default function AuthLayoutClient({ children }: { children: ReactNode }) {
  const t = useTranslations("auth.footer");
  const pathname = usePathname();

  // works with or without a language prefix like /en/forgot-password
  const isCardPage = pathname.split("/").some((segment) => CARD_PAGES.includes(segment));

  // login / signup: no card, just show the page
  if (!isCardPage) {
    return <>{children}</>;
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-white bg-[radial-gradient(ellipse_75%_50%_at_0%_8%,rgba(208,216,255,0.9),transparent_70%),radial-gradient(ellipse_45%_30%_at_0%_42%,rgba(226,230,255,0.7),transparent_70%),radial-gradient(ellipse_55%_40%_at_100%_100%,rgba(212,219,255,0.85),transparent_70%)]">
      {/* Language switcher (top corner, works for left-to-right and right-to-left) */}
      <div className="absolute end-4 top-4 z-20 sm:end-6 sm:top-6">
        <LanguageSwitcher variant="muted" />
      </div>

      {/* Logo + name */}
      <header className="pt-7">
        <Link href="/" aria-label="Fluenca.ai" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_SRC} alt="" className="h-8 w-auto" />
          <span className="bg-[linear-gradient(90deg,#4361FF_0%,#7A5CF5_100%)] bg-clip-text text-[22px] font-semibold tracking-tight text-transparent">
            fluenca.ai
          </span>
        </Link>
      </header>

      {/* Card (440px wide, sits 130px below the logo like the design) */}
      <main className="flex w-full flex-1 items-start justify-center px-4 pb-16 pt-16 md:pt-[130px]">
        <div className="w-full max-w-[440px] rounded-[36px] border border-[#E4E6FA] bg-[linear-gradient(160deg,#F3F2FF_0%,#FBFBFF_100%)] px-[26px] pb-[18px] pt-[35px]">
          {children}

          {/* Footer links */}
          <footer className="mt-[53px] flex items-center justify-center gap-2 text-[11px] leading-[1.5] text-slate-500">
            <Link href="/privacy-policy" className="hover:text-indigo-600">
              {t("privacy")}
            </Link>
            <span aria-hidden>|</span>
            <Link href="/terms" className="hover:text-indigo-600">
              {t("terms")}
            </Link>
            <span aria-hidden>|</span>
            <Link href="/support" className="hover:text-indigo-600">
              {t("support")}
            </Link>
          </footer>
        </div>
      </main>
    </div>
  );
}