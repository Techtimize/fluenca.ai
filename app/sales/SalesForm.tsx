"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Check, Loader2 } from "lucide-react";

const planNames: Record<string, string> = {
  growth: "Growth",
  accelerator: "Accelerator",
  command: "Command",
};

const companySizes = ["1-10", "11-50", "51-200", "201-500", "500+"];

const fieldClass =
  "w-full rounded-xl border border-[#D9CFF7] bg-white px-3.5 font-body text-[14px] text-[#2B1B63] placeholder:text-[#6B6490] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#7B5CF5]";
const labelClass =
  "mb-1.5 block font-body text-[13px] font-semibold text-[#2B1B63]";

export default function SalesForm() {
  const searchParams = useSearchParams();
  const initialPlan = planNames[searchParams.get("plan") ?? ""] ?? "Growth";

  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    size: companySizes[0],
    plan: initialPlan,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const onChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!values.name.trim() || !values.company.trim()) {
      setError("Please fill in your name and company name.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      setError("Please enter a valid work email.");
      return;
    }

    setLoading(true);
    // TODO: send `values` to your backend here when it's ready.
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-[#E4DCFB] bg-white px-6 py-14 text-center shadow-[0_10px_30px_rgba(109,69,232,0.10)] sm:px-8">
        <span className="flex size-14 items-center justify-center rounded-full bg-[#7B5CF5] text-white">
          <Check aria-hidden="true" className="size-7" strokeWidth={3} />
        </span>
        <h2 className="mt-5 font-display text-[24px] font-semibold text-[#2B1B63]">
          Thanks, we&apos;ll be in touch soon
        </h2>
        <p className="mt-2 max-w-[340px] font-body text-[14px] leading-[22px] text-[#6B6490]">
          Our sales team will reach out to {values.email} within 1 business day.
        </p>
        <Link
          href="/plans"
          className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#6D45E8] to-[#7B5CF5] px-8 font-body text-caption font-medium text-white shadow-[0_3px_0_#cfc3f7] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7B5CF5]"
        >
          Back to plans
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-[18px] rounded-3xl border border-[#E4DCFB] bg-white p-5 shadow-[0_10px_30px_rgba(109,69,232,0.10)] sm:p-8"
    >
      <div>
        <h2 className="font-display text-[24px] font-semibold text-[#2B1B63]">
          Contact sales
        </h2>
        <p className="mt-1.5 font-body text-[14px] text-[#6B6490]">
          Fields marked * are required.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>Full name *</label>
          <input id="name" name="name" value={values.name} onChange={onChange} placeholder="Jane Doe" autoComplete="name" className={`${fieldClass} h-[46px]`} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Work email *</label>
          <input id="email" name="email" type="email" value={values.email} onChange={onChange} placeholder="jane@company.com" autoComplete="email" className={`${fieldClass} h-[46px]`} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className={labelClass}>Phone number</label>
          <input id="phone" name="phone" type="tel" value={values.phone} onChange={onChange} placeholder="+92 300 0000000" autoComplete="tel" className={`${fieldClass} h-[46px]`} />
        </div>
        <div>
          <label htmlFor="company" className={labelClass}>Company name *</label>
          <input id="company" name="company" value={values.company} onChange={onChange} placeholder="Acme Inc." autoComplete="organization" className={`${fieldClass} h-[46px]`} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="size" className={labelClass}>Company size</label>
          <select id="size" name="size" value={values.size} onChange={onChange} className={`${fieldClass} h-[46px]`}>
            {companySizes.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="plan" className={labelClass}>Plan you&apos;re interested in</label>
          <select id="plan" name="plan" value={values.plan} onChange={onChange} className={`${fieldClass} h-[46px]`}>
            {Object.values(planNames).map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>How can we help?</label>
        <textarea id="message" name="message" rows={4} value={values.message} onChange={onChange} placeholder="Tell us about your goals" className={`${fieldClass} min-h-[110px] resize-none py-3`} />
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-[#FDECEC] px-4 py-3 font-body text-[13px] text-[#B42318]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#6D45E8] to-[#7B5CF5] px-6 font-body text-caption font-medium text-white shadow-[0_3px_0_#cfc3f7] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7B5CF5] disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Contact Sales
            <ArrowRight aria-hidden="true" className="size-4" />
          </>
        )}
      </button>

      <p className="text-center font-body text-[12px] text-[#6B6490]">
        We&apos;ll only use your details to contact you about your plan.
      </p>
    </form>
  );
}