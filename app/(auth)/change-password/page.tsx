"use client";

// app/(auth)/change-password/page.tsx
// URL: /change-password

import { useId, useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const MIN_LENGTH = 8;

// All text on this page (same as the design). No messages file needed.
const TEXT = {
  back: "Back",
  title: "Set a new password",
  subtitle: "Your identity has been verified. Create a new password for your HMS Portal account.",
  newLabel: "New password",
  newPlaceholder: "Create a strong password",
  confirmLabel: "Confirm password",
  confirmPlaceholder: "Repeat your new password",
  submit: "Set new password",
  submitting: "Saving...",
  show: "Show password",
  hide: "Hide password",
  strength: "Password strength",
  errTooShort: "Password must be at least 8 characters.",
  errMismatch: "Passwords do not match.",
  errGeneric: "Something went wrong. Try again.",
};

// 0 = empty, 1 = weak, 2 = fair, 3 = good, 4 = strong
function getStrength(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= MIN_LENGTH) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.max(score, 1);
}

const STRENGTH_COLORS = ["", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-emerald-500"];

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

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.1 3.9M6.6 6.6A16.6 16.6 0 0 0 2 12s3.6 7 10 7a9.7 9.7 0 0 0 4.4-1M9.9 9.9a3 3 0 0 0 4.2 4.2"
        stroke="currentColor"
        strokeWidth="1.8"
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

type PasswordFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  invalid?: boolean;
};

function PasswordField({ label, placeholder, value, onChange, autoComplete, invalid }: PasswordFieldProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-[12px] font-medium leading-[1.5] text-slate-900">
        {label}
      </label>
      <div className="relative mt-[6px]">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={invalid}
          className={`h-[43px] w-full rounded-full border bg-white ps-4 pe-11 text-[12px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
            invalid
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
              : "border-[#E6E8F5] focus:border-[#4361FF] focus:ring-[#4361FF]/10"
          }`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? TEXT.hide : TEXT.show}
          className="absolute end-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#4361FF]"
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
}

export default function ChangePasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const strength = getStrength(password);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password.length < MIN_LENGTH) {
      setError(TEXT.errTooShort);
      return;
    }
    if (password !== confirm) {
      setError(TEXT.errMismatch);
      return;
    }

    try {
      setLoading(true);

      // TODO: call your API here
      // const res = await fetch("/api/auth/change-password", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ password }),
      // });
      // if (!res.ok) throw new Error("Failed");

      router.push("/password-updated"); // change to the page that should open after saving
    } catch {
      setError(TEXT.errGeneric);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Back */}
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-[13px] leading-[1.5] text-slate-900 hover:text-[#4361FF]"
      >
        <ArrowLeftIcon />
        {TEXT.back}
      </button>

      {/* Key icon (exported image already includes the tile) */}
      <Image
        src="/assets/icons/key.svg"
        alt=""
        width={46}
        height={46}
        className="mt-[27px] h-[46px] w-[46px]"
      />

      {/* Title + text */}
      <h1 className="mt-[18px] text-[18px] font-semibold leading-[1.4] tracking-tight text-slate-900">
        {TEXT.title}
      </h1>
      <p className="mt-[10px] text-[13px] leading-[1.6] text-slate-500">{TEXT.subtitle}</p>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="mt-5">
        <PasswordField
          label={TEXT.newLabel}
          placeholder={TEXT.newPlaceholder}
          value={password}
          onChange={(v) => {
            if (error) setError("");
            setPassword(v);
          }}
          autoComplete="new-password"
          invalid={!!error && error !== TEXT.errMismatch}
        />

        {/* Strength bar (4 segments) */}
        <div
          dir="ltr"
          role="progressbar"
          aria-label={TEXT.strength}
          aria-valuemin={0}
          aria-valuemax={4}
          aria-valuenow={strength}
          className="mt-2 flex gap-[6px]"
        >
          {[1, 2, 3, 4].map((segment) => (
            <span
              key={segment}
              className={`h-[3px] flex-1 rounded-full transition-colors ${
                segment <= strength ? STRENGTH_COLORS[strength] : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        <div className="mt-4">
          <PasswordField
            label={TEXT.confirmLabel}
            placeholder={TEXT.confirmPlaceholder}
            value={confirm}
            onChange={(v) => {
              if (error) setError("");
              setConfirm(v);
            }}
            autoComplete="new-password"
            invalid={error === TEXT.errMismatch}
          />
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
      </form>
    </div>
  );
}