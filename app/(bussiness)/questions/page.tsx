"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { AnswerQuestionMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { IntakeSection } from "@/types/company-details-type";
import { IntakeQuery } from "@/routes/bussiness/Bussiness-Query";

type CompanyField = {
  id: string;
  label: string;
  value: string;
  reviewed: boolean;
  required: boolean;
  filled: boolean;
};

type CompanySection = {
  id: string;
  title: string;
  fields: CompanyField[];
  answered: number;
  total: number;
};

const toCompanySections = (sections: IntakeSection[]): CompanySection[] =>
  sections.map((section) => {
    const fields = section.questions.map((question) => {
      const value = question.answer?.trim() ?? "";
      return {
        id: question.question_id,
        label: question.question,
        value,
        reviewed: question.status === "confirmed",
        required: question.required,
        filled: Boolean(value),
      };
    });

    return {
      id: section.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: section.name,
      fields,
      answered: fields.filter((field) => field.filled).length,
      total: fields.length,
    };
  });

/* ---------- Progress ring ---------- */
function ProgressRing({ value, total }: { value: number; total: number }) {
  const r = 20;
  const c = 2 * Math.PI * r;
  const pct = total === 0 ? 0 : Math.min(value / total, 1);

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-[#F3F3F5] px-4 py-3">
      <svg
        width="52"
        height="52"
        viewBox="0 0 52 52"
        role="img"
        aria-label={`${value} of ${total} questions answered`}
      >
        <circle
          cx="26"
          cy="26"
          r={r}
          fill="none"
          stroke="#DCDDF5"
          strokeWidth="6"
        />
        <circle
          cx="26"
          cy="26"
          r={r}
          fill="none"
          stroke="#5B57E6"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          transform="rotate(-90 26 26)"
          className="transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <div>
        <p className="text-sm font-semibold text-neutral-900">
          {value}/{total}
        </p>
        <p className="text-xs text-neutral-600">Questions answered</p>
      </div>
    </div>
  );
}

/* ---------- Tiny section progress circle ---------- */
function SectionProgressCircle({
  value,
  total,
  active,
}: {
  value: number;
  total: number;
  active?: boolean;
}) {
  const size = 28;
  const r = 10;
  const c = 2 * Math.PI * r;
  const pct = total === 0 ? 0 : Math.min(value / total, 1);

  return (
    <span
      className="relative grid size-7 place-items-center"
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={active ? "#D7D5FF" : "#E6E8F5"}
          strokeWidth="3"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#5B57E6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <span
        className={`relative text-[10px] font-semibold ${
          active ? "text-[#5B57E6]" : "text-neutral-600"
        }`}
      >
        {value}
      </span>
    </span>
  );
}

/* ---------- One question/answer card ---------- */
function FieldCard({ field }: { field: CompanyField }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(field.value);
  const { mutate: saveAnswer, isPending } = AnswerQuestionMutation();

  const save = (answer: string) =>
    saveAnswer(
      { question_id: field.id, answer },
      { onSuccess: () => setEditing(false) },
    );

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-white ${
        field.filled ? "border-[#E6E8F5]" : "border-[#F5C2C2]"
      }`}
    >
      <div
        className={`flex items-center justify-between gap-3 px-4 py-3 ${
          field.filled ? "bg-[#F1F4FF]" : "bg-[#FFF5F5]"
        }`}
      >
        <h3 className="text-[13px] font-semibold text-neutral-900">
          {field.label}
          {!field.filled ? (
            <span
              className="ml-1 text-[#E11D48]"
              aria-label={field.required ? "Required" : "Unanswered"}
            >
              *
              {field.required ? (
                <span className="ml-1 text-[11px] font-medium">Required</span>
              ) : null}
            </span>
          ) : null}
        </h3>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setDraft(field.value);
              setEditing(true);
            }}
            aria-label={`Edit ${field.label}`}
            className="rounded-md p-1 text-neutral-500 hover:bg-white hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B57E6]/40"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => save(field.value)}
            disabled={field.reviewed || !field.value || isPending}
            aria-pressed={field.reviewed}
            aria-label={field.reviewed ? "Reviewed" : "Confirm answer"}
            className={`rounded-full p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B57E6]/40 disabled:cursor-default ${
              field.reviewed
                ? "bg-[#5B57E6] text-white"
                : "bg-white text-neutral-400 hover:text-neutral-700"
            }`}
          >
            <Check className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="px-4 py-3.5">
        {editing ? (
          <div className="space-y-2">
            <textarea
              autoFocus
              value={draft}
              rows={3}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setEditing(false)}
              className="w-full resize-none rounded-md border border-[#CFD3F2] p-2 text-xs leading-5 text-neutral-800 outline-none focus:ring-2 focus:ring-[#5B57E6]/30"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="h-7 rounded-full px-3 text-xs text-neutral-600 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => save(draft.trim())}
                disabled={isPending}
                className="h-7 rounded-full bg-[#5B57E6] px-4 text-xs font-semibold text-white hover:bg-[#4a46d4] disabled:opacity-60"
              >
                {isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : field.value ? (
          <p className="text-xs leading-5 text-neutral-600">{field.value}</p>
        ) : (
          <p className="text-xs leading-5 text-[#E11D48]">
            {field.required
              ? "Nothing found. Add this yourself (required)."
              : "Nothing found. Add this yourself."}
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------- Top bar ---------- */
function TopBar() {
  const router = useRouter();

  // Opened directly (no history), there is nothing to go back to, so fall back to the dashboard.
  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push(PAGE_ROUTES.DASHBOARD);
  };

  return (
    <header className="py-5">
      <div className="flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/Logo.svg" alt="" className="size-7" />
        <span className="text-lg font-semibold tracking-wide text-neutral-900">
          FLUENCA
        </span>
      </div>

      <button
        type="button"
        onClick={goBack}
        className="group mt-5 inline-flex items-center gap-2 rounded-full py-1 pe-3 text-sm font-medium text-neutral-600 transition-colors hover:text-[#5B57E6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B57E6]/40"
      >
        <span className="grid size-8 place-items-center rounded-full border border-[#E6E8F5] bg-white shadow-sm transition-colors group-hover:border-[#D7D5FF] group-hover:bg-[#F3F2FF]">
          <ArrowLeft
            className="size-4 transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
        </span>
        Back
      </button>
    </header>
  );
}

export default function QuestionsPage() {
  const t = useTranslations("overview");
  const { data: intake, isLoading } = IntakeQuery();
  const router = useRouter();

  // Answers are saved one by one as they're edited, so completing only leaves the page.
  const handleComplete = () => router.push(PAGE_ROUTES.DASHBOARD);
  const [activeId, setActiveId] = useState("");

  const sections = useMemo(
    () => toCompanySections(intake?.sections ?? []),
    [intake],
  );

  const { total, answered } = useMemo(() => {
    const all = sections.flatMap((s) => s.fields);
    return {
      total: all.length,
      answered: all.filter((f) => f.filled).length,
    };
  }, [sections]);

  // Highlights the section in view. A ref callback (with cleanup) instead of an effect;
  // it re-attaches only when the sections change.
  const observeSections = useCallback(
    (container: HTMLDivElement | null) => {
      if (!container) return;
      const observer = new IntersectionObserver(
        (entries) => {
          const hit = entries.find((e) => e.isIntersecting);
          if (hit) setActiveId(hit.target.id);
        },
        { rootMargin: "-15% 0px -70% 0px" },
      );
      sections.forEach((s) => {
        const el = container.querySelector(`#${CSS.escape(s.id)}`);
        if (el) observer.observe(el);
      });
      return () => observer.disconnect();
    },
    [sections],
  );

  const scrollTo = (id: string) => {
    setActiveId(id);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="mx-auto w-full max-w-7xl min-w-0 px-4 pb-10 sm:px-6 lg:px-10">
      <TopBar />

      <div className="grid w-full gap-4 lg:grid-cols-[340px_1fr]">
        <aside className="rounded-3xl border border-[#E6E8F5] bg-white/80 p-5 backdrop-blur lg:sticky lg:top-6 lg:self-start">
          <h1 className="text-base font-semibold text-neutral-900">
            {t("title")}
          </h1>
          <p className="mb-4 mt-1 text-xs leading-5 text-neutral-500">
            {t("subtitle")}
          </p>

          <ProgressRing value={answered} total={total} />

          <nav aria-label="Overview sections" className="mt-4">
            <ul className="space-y-1">
              {sections.map((s) => {
                const active = s.id === (activeId || sections[0]?.id);
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => scrollTo(s.id)}
                      aria-current={active ? "true" : undefined}
                      className={`flex w-full items-center justify-between gap-2 border-l-2 px-2.5 py-2.5 text-left text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B57E6]/40 ${
                        active
                          ? "border-[#5B57E6] font-medium text-[#5B57E6]"
                          : "border-transparent text-neutral-700 hover:text-neutral-950"
                      }`}
                    >
                      <span className="min-w-0 truncate">{s.title}</span>
                      <span className="flex shrink-0 items-center gap-2">
                        <SectionProgressCircle
                          value={s.answered}
                          total={s.total}
                          active={active}
                        />
                        <span className="text-xs text-neutral-500">
                          {s.answered}/{s.total}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <div
          ref={observeSections}
          className="min-w-0 rounded-3xl border border-[#E6E8F5] bg-white/80 p-5 backdrop-blur sm:p-8"
        >
          {isLoading && (
            <p className="text-sm text-neutral-500">{t("loading")}</p>
          )}
          {sections
            .filter((s) => s.fields.length > 0)
            .map((s) => (
              <section
                key={s.id}
                id={s.id}
                className="scroll-mt-8 pb-8 last:pb-0"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-sm text-neutral-800">{s.title}</h2>
                  <p className="text-xs text-neutral-500">
                    {s.answered}/{s.total} answered
                  </p>
                </div>
                <div className="space-y-3">
                  {s.fields.map((f) => (
                    <FieldCard key={f.id} field={f} />
                  ))}
                </div>
              </section>
            ))}

          {!isLoading && (
            <div className="flex justify-end pt-6">
              <button
                type="button"
                onClick={handleComplete}
                className="h-9 rounded-full bg-[#5B57E6] px-6 text-sm font-semibold text-white hover:bg-[#4a46d4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B57E6]/40"
              >
                {t("complete")}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
