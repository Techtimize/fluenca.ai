"use client";

// app/(auth)/forgot-password/page.tsx
// URL: /forgot-password

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

function ArrowLeftIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden className="rtl:rotate-180">
      <path
        d="M19 12H5M11 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ForgotPasswordPage() {
  const t = useTranslations("auth.forgot");
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const value = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(value)) {
      setError(t("errors.invalidEmail"));
      return;
    }

    try {
      setLoading(true);

      // TODO: call your API here
      // const res = await fetch("/api/auth/forgot-password", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email: value }),
      // });
      // if (!res.ok) throw new Error("Request failed");

      router.push(`/verify-otp?email=${encodeURIComponent(value)}`);
    } catch {
      setError(t("errors.generic"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Back to login -> opens the full /login page */}
      <Link
        href="/login"
        className="inline-flex items-center gap-2 text-[13px] leading-[1.5] text-slate-900 hover:text-[#4361FF]"
      >
        <ArrowLeftIcon />
        {t("back")}
      </Link>

      <Image
  src="/assets/icons/key.svg"
  alt=""
  width={56}
  height={56}
  className="mt-[27px] h-14 w-14"
/>

      {/* Title + text */}
      <h1 className="mt-[18px] text-[18px] font-semibold leading-[1.4] tracking-tight text-slate-900">
        {t("title")}
      </h1>
      <p className="mt-[10px] text-[13px] leading-[1.5] text-slate-500">{t("subtitle")}</p>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="mt-[14px]">
        <label htmlFor="email" className="text-[13px] font-medium leading-[1.4] text-slate-900">
          {t("emailLabel")}
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("emailPlaceholder")}
          aria-invalid={!!error}
          className="mt-2 h-[42px] w-full rounded-full border border-[#E5E7EB] bg-white px-[15px] text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#4361FF] focus:ring-4 focus:ring-[#4361FF]/10"
        />
        {error && (
          <p role="alert" className="mt-2 ps-2 text-[12px] text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 h-[42px] w-full rounded-full bg-[linear-gradient(90deg,#4361FF_0%,#7A5CF5_100%)] text-[14px] font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? t("submitting") : t("submit")}
        </button>
      </form>
    </div>
  );
}