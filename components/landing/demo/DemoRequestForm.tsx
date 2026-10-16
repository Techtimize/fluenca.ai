"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import {
  Building2,
  CalendarDays,
  Check,
  Loader2,
  Link2,
  Mail,
  MessageSquare,
} from "lucide-react";
import { MonthCalendar } from "@/components/dashboard/content/schedulePostDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContactUsMutation } from "@/routes/bussiness/Bussiness-Mutation";

const inputClass =
  "h-11 w-full rounded-xl border border-[#E6E8F5] bg-white pl-10 pr-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#C9CCF5] focus:ring-2 focus:ring-[#5B57E6]/15";

function Field({
  id,
  label,
  icon,
  children,
  className = "",
}: {
  id: string;
  label: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-[13px] font-medium text-neutral-800">
        {label} <span className="text-neutral-400">*</span>
      </label>
      <div className="relative">
        <span
          className="pointer-events-none absolute left-3.5 top-3.5 text-neutral-400 [&>svg]:size-4"
          aria-hidden="true"
        >
          {icon}
        </span>
        {children}
      </div>
    </div>
  );
}

const pad2 = (n: number) => String(n).padStart(2, "0");

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatDateTime(date: Date) {
  return `${formatDay(date)}, ${formatTime(date)}`;
}

function formatDay(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DemoRequestForm() {
  const { mutate, isPending } = ContactUsMutation();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [demoDate, setDemoDate] = useState<Date | null>(null);
  const [dateOpen, setDateOpen] = useState(false);
  // Day + time chosen in the dialog; only copied to demoDate on Save
  const [draftDate, setDraftDate] = useState<Date | null>(null);
  const draftTime = draftDate
    ? `${pad2(draftDate.getHours())}:${pad2(draftDate.getMinutes())}`
    : "10:00";
  const draftInPast = Boolean(draftDate && draftDate <= new Date());

  // Keep the chosen time when a new day is picked (10:00 by default)
  const pickDraftDay = (day: Date) => {
    const next = new Date(day);
    if (draftDate) next.setHours(draftDate.getHours(), draftDate.getMinutes(), 0, 0);
    else next.setHours(10, 0, 0, 0);
    setDraftDate(next);
  };

  const pickDraftTime = (value: string) => {
    const [hours, minutes] = value.split(":").map(Number);
    if (!draftDate || Number.isNaN(hours) || Number.isNaN(minutes)) return;
    const next = new Date(draftDate);
    next.setHours(hours, minutes, 0, 0);
    setDraftDate(next);
  };
  const [dateError, setDateError] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const value = (name: string) =>
      String(new FormData(form).get(name) ?? "").trim();

    // The date lives in state (not a native input), so check it here
    if (!demoDate) {
      setDateError(true);
      return;
    }

    const email = value("email");
    // contact_requests has no job title / website columns, so they go into the message
    const message = [
      value("goals"),
      `Website: ${value("website")}`,
    ]
      .filter(Boolean)
      .join("\n\n");

    mutate(
      {
        work_email: email,
        company_name: value("company_name"),
        message,
        // Local pick sent as UTC with "Z", e.g. 2026-10-20T13:00:00.000Z
        date: demoDate.toISOString(),
      },
      {
        onSuccess: () => {
          form.reset();
          setDemoDate(null);
          setSentTo(email);
        },
      },
    );
  };

  if (sentTo) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-[#E6E8F5] bg-white px-6 py-14 text-center shadow-[0_24px_60px_-32px_rgba(79,70,229,0.35)]">
        <span className="grid size-14 place-items-center rounded-full bg-[#5B57E6] text-white">
          <Check className="size-7" strokeWidth={3} aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-neutral-900">
          Thanks, your demo request is in
        </h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-500">
          Our team will reach out to {sentTo} within 24 hours to schedule your demo.
        </p>
        <button
          type="button"
          onClick={() => setSentTo(null)}
          className="mt-6 text-sm font-semibold text-[#5B57E6] hover:underline"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[#E6E8F5] bg-white p-6 shadow-[0_24px_60px_-32px_rgba(79,70,229,0.35)] sm:p-7"
    >
      <h2 className="text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">
        Request a Demo
      </h2>
      <p className="mt-1.5 text-sm text-neutral-500">
        Fill out the form and our team will get back to you within 24 hours.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field id="demo-email" label="Work Email" icon={<Mail />}>
          <input
            id="demo-email"
            name="email"
            type="email"
            required
            placeholder="you@company.com"
            className={inputClass}
          />
        </Field>
        <Field id="demo-company" label="Company Name" icon={<Building2 />}>
          <input
            id="demo-company"
            name="company_name"
            required
            placeholder="Your company name"
            className={inputClass}
          />
        </Field>
        <Field id="demo-website" label="Company Website" icon={<Link2 />}>
          <input
            id="demo-website"
            name="website"
            type="url"
            required
            placeholder="https://yourcompany.com"
            className={inputClass}
          />
        </Field>
        <Field
          id="demo-date"
          label="Preferred Demo Date"
          icon={<CalendarDays />}
        >
          <button
            type="button"
            id="demo-date"
            aria-describedby={dateError ? "demo-date-error" : undefined}
            onClick={() => {
              setDraftDate(demoDate);
              setDateOpen(true);
            }}
            className={`${inputClass} flex cursor-pointer items-center text-left ${
              demoDate ? "text-neutral-900" : "text-neutral-400"
            } ${dateError ? "border-rose-300 ring-2 ring-rose-100" : ""}`}
          >
            {demoDate ? formatDateTime(demoDate) : "Select a preferred date & time"}
          </button>

          <Dialog open={dateOpen} onOpenChange={setDateOpen}>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Pick a demo date</DialogTitle>
                <DialogDescription>
                  Pick the date and time that work best for your demo.
                </DialogDescription>
              </DialogHeader>

              {/* Same calendar as the content "Schedule post" dialog; past days are disabled */}
              <MonthCalendar selected={draftDate} onSelect={pickDraftDay} />

              <label className="flex items-center justify-between gap-3 rounded-2xl border border-[#E6E8F5] px-3 py-2">
                <span className="text-sm font-medium text-neutral-700">Time</span>
                <input
                  type="time"
                  value={draftTime}
                  disabled={!draftDate}
                  onChange={(event) => pickDraftTime(event.target.value)}
                  className="rounded-lg bg-[#F6F7FD] px-2 py-1 text-sm text-neutral-900 outline-none focus:ring-2 focus:ring-[#5B57E6]/40 disabled:opacity-50"
                />
              </label>

              <p
                className={`text-[13px] ${draftInPast ? "text-rose-600" : "text-neutral-500"}`}
              >
                {!draftDate
                  ? "Pick a day on the calendar."
                  : draftInPast
                    ? "Pick a time in the future."
                    : `Demo on ${formatDateTime(draftDate)}`}
              </p>

              <DialogFooter>
                <button
                  type="button"
                  onClick={() => setDateOpen(false)}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-[#E6E8F5] bg-white px-4 text-[13px] font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!draftDate || draftInPast}
                  onClick={() => {
                    setDemoDate(draftDate);
                    setDateError(false);
                    setDateOpen(false);
                  }}
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-[#5B57E6] px-4 text-[13px] font-semibold text-white hover:bg-[#4A46D0] disabled:pointer-events-none disabled:opacity-55"
                >
                  Save
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {dateError ? (
            <p id="demo-date-error" className="mt-1 text-xs text-rose-600">
              Please pick a date and time for your demo.
            </p>
          ) : null}
        </Field>
        <Field
          id="demo-goals"
          label="What are your goals or requirements?"
          icon={<MessageSquare />}
          className="sm:col-span-2"
        >
          <textarea
            id="demo-goals"
            name="goals"
            required
            rows={4}
            placeholder="Tell us about your marketing goals, challenges, or what you'd like to achieve with Fluenca..."
            className={`${inputClass} h-auto resize-y py-3 leading-5`}
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#5B57E6] text-[15px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(91,87,230,0.7)] transition-colors hover:bg-[#4A46D0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B57E6]/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? (
          <Loader2 className="size-4.5 animate-spin" aria-hidden="true" />
        ) : (
          <CalendarDays className="size-4.5" aria-hidden="true" />
        )}
        {isPending ? "Sending…" : "Book a Demo"}
      </button>
      <p className="mt-3 text-center text-xs text-neutral-500">
        Our team will reach out within 24 hours to schedule your demo.
      </p>
    </form>
  );
}
