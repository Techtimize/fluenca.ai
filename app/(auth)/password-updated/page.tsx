// app/(auth)/password-updated/page.tsx
// URL: /password-updated

import Link from "next/link";

// All text on this page (same as the design). No messages file needed.
const TEXT = {
  title: "Password updated",
  subtitle: "Your password has been changed. You can now log in with your new password.",
  cta: "Go to login",
};

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PasswordUpdatedPage() {
  return (
    <div>
      {/* Check icon tile */}
      <div className="mt-[18px] flex h-[46px] w-[46px] items-center justify-center rounded-[12px] border border-emerald-300 bg-emerald-50 text-emerald-600">
        <CheckIcon />
      </div>

      {/* Title + text */}
      <h1 className="mt-[18px] text-[18px] font-semibold leading-[1.4] tracking-tight text-slate-900">
        {TEXT.title}
      </h1>
      <p className="mt-[10px] text-[13px] leading-[1.6] text-slate-500">{TEXT.subtitle}</p>

      {/* Go to login */}
      <Link
        href="/login"
        className="mt-6 flex h-[43px] w-full items-center justify-center rounded-full bg-[linear-gradient(90deg,#4361FF_0%,#7A5CF5_100%)] text-[14px] font-medium text-white transition hover:brightness-110"
      >
        {TEXT.cta}
      </Link>
    </div>
  );
}