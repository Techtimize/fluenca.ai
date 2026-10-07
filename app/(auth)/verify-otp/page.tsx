"use client";

// app/(auth)/verify-otp/page.tsx
// URL: /verify-otp?email=someone@example.com

import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 24;

// All text on this page (same as the design). No messages file needed.
const TEXT = {
  back: "Back to login",
  title: "Check your email",
  subtitle: (email: string) =>
    `A 6-digit code was sent to ${email}. Enter it below along with your new password.`,
  submit: "Verify Now",
  submitting: "Verifying...",
  noCode: "Didn't receive it?",
  resendIn: (s: number) => `Resend in ${s}s`,
  resend: "Resend",
  digit: "Digit",
  errIncomplete: "Please enter the 6-digit code.",
  errGeneric: "That code is incorrect. Check your email and try again.",
};

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

function ResendIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7.5v5.5M12 16.5h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  // countdown for "Resend in 24s"
  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  function handleChange(index: number, e: ChangeEvent<HTMLInputElement>) {
    if (error) setError("");
    const value = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < OTP_LENGTH - 1) inputs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    if (error) setError("");
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((d, i) => (next[i] = d));
    setDigits(next);
    inputs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const code = digits.join("");
    if (code.length !== OTP_LENGTH) {
      setError(TEXT.errIncomplete);
      return;
    }

    try {
      setLoading(true);

      // TODO: call your API here
      // const res = await fetch("/api/auth/verify-otp", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, code }),
      // });
      // if (!res.ok) throw new Error("Invalid code");

      router.push("/login"); // change to the page that should open after verifying
    } catch {
      setError(TEXT.errGeneric);
    } finally {
      setLoading(false);
    }
  }

  function handleResend() {
    if (seconds > 0) return;
    setError("");
    // TODO: call your API to send a new code
    setDigits(Array(OTP_LENGTH).fill(""));
    inputs.current[0]?.focus();
    setSeconds(RESEND_SECONDS);
  }

  return (
    <div>
      {/* Back to login */}
      <Link
        href="/login"
        className="inline-flex items-center gap-2 text-[13px] leading-[1.5] text-slate-900 hover:text-[#4361FF]"
      >
        <ArrowLeftIcon />
        {TEXT.back}
      </Link>

      {/* Mail icon (exported image already includes the tile) */}
      <Image
        src="/assets/icons/mail.svg"
        alt=""
        width={46}
        height={46}
        className="mt-[27px] h-[46px] w-[46px]"
      />

      {/* Title + text */}
      <h1 className="mt-[18px] text-[18px] font-semibold leading-[1.4] tracking-tight text-slate-900">
        {TEXT.title}
      </h1>
      <p className="mt-[10px] text-[13px] leading-[1.6] text-slate-500">
        {TEXT.subtitle(email)}
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="mt-6">
        {/* dir="ltr" keeps digits in order for right-to-left languages */}
        <div dir="ltr" className="flex justify-center gap-3">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              aria-label={`${TEXT.digit} ${i + 1}`}
              aria-invalid={!!error}
              className={`h-[47px] w-[47px] rounded-[14px] border bg-white text-center text-[17px] font-medium outline-none transition focus:ring-4 ${
                error
                  ? "border-red-500 text-red-600 focus:border-red-500 focus:ring-red-500/10"
                  : "border-[#E6E8F5] text-slate-900 focus:border-[#4361FF] focus:ring-[#4361FF]/10"
              }`}
            />
          ))}
        </div>

        {error && (
          <div
            role="alert"
            className="mt-4 flex items-center justify-center gap-2 rounded-[10px] border border-red-200 bg-red-50 px-3 py-[10px] text-[11px] leading-[1.4] text-red-600"
          >
            <AlertIcon />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 h-[43px] w-full rounded-full bg-[linear-gradient(90deg,#4361FF_0%,#7A5CF5_100%)] text-[14px] font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? TEXT.submitting : TEXT.submit}
        </button>

        {/* Resend */}
        <p className="mt-[18px] flex items-center justify-center gap-1 text-[11px] text-slate-500">
          <span>{TEXT.noCode}</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={seconds > 0}
            className="inline-flex items-center gap-1 font-medium text-slate-700 enabled:hover:text-[#4361FF] disabled:cursor-not-allowed"
          >
            <ResendIcon />
            {seconds > 0 ? TEXT.resendIn(seconds) : TEXT.resend}
          </button>
        </p>
      </form>
    </div>
  );
}

// useSearchParams needs a Suspense boundary, otherwise "npm run build" fails
export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  );
}

