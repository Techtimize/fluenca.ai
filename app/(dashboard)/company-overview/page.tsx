"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, Check, Pencil } from "lucide-react";
import { IntakeQuery } from "@/routes/company-details/CompanyDetails-Query";
import { AnswerQuestionMutation, CompleteIntakeMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { IntakeSection } from "@/types/company-details-type";

/* ---------- Types ---------- */
type CompanyField = {
  id: string;
  label: string;
  value: string;
  reviewed: boolean;
};

type CompanySection = {
  id: string;
  title: string;
  fields: CompanyField[];
};

/* ---------- API → UI mapping ---------- */
const toCompanySections = (sections: IntakeSection[]): CompanySection[] =>
  sections.map((section) => ({
    id: section.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    title: section.name,
    fields: section.questions.map((question) => ({
      id: question.question_id,
      label: question.question,
      value: question.answer ?? "",
      reviewed: question.status === "confirmed",
    })),
  }));

/* ---------- Progress ring ---------- */
function ProgressRing({ value, total }: { value: number; total: number }) {
  const r = 20;
  const c = 2 * Math.PI * r;
  const pct = total === 0 ? 0 : value / total;

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-[#F3F3F5] px-4 py-3">
      <svg width="52" height="52" viewBox="0 0 52 52" role="img" aria-label={`${value} of ${total} fields reviewed`}>
        <circle cx="26" cy="26" r={r} fill="none" stroke="#DCDDF5" strokeWidth="6" />
        <circle
          cx="26" cy="26" r={r} fill="none" stroke="#5B57E6" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
          transform="rotate(-90 26 26)"
          className="transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <div>
        <p className="text-sm font-semibold text-neutral-900">{value}/{total}</p>
        <p className="text-xs text-neutral-600">Fields reviewed</p>
      </div>
    </div>
  );
}

/* ---------- One question/answer card ---------- */
function FieldCard({ field }: { field: CompanyField }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(field.value);
  const { mutate: saveAnswer, isPending } = AnswerQuestionMutation();

  const save = (answer: string) =>
    saveAnswer({ question_id: field.id, answer }, { onSuccess: () => setEditing(false) });

  return (
    <div className="overflow-hidden rounded-xl border border-[#E6E8F5] bg-white">
      <div className="flex items-center justify-between gap-3 bg-[#F1F4FF] px-4 py-3">
        <h3 className="text-[13px] font-semibold text-neutral-900">{field.label}</h3>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => { setDraft(field.value); setEditing(true); }}
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
              field.reviewed ? "bg-[#5B57E6] text-white" : "bg-white text-neutral-400 hover:text-neutral-700"
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
          <p className="text-xs leading-5 text-neutral-400">Nothing found. Add this yourself.</p>
        )}
      </div>
    </div>
  );
}

/* ---------- Top bar ---------- */
function TopBar() {
  // TODO: replace with the logged-in user from your auth provider.
  const user = { name: "User", avatarUrl: "" };

  return (
    <header className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
      <div className="flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/Logo.svg" alt="" className="size-7" />
        <span className="text-lg font-semibold tracking-wide text-neutral-900">INFLU</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="grid size-10 place-items-center rounded-full border border-[#E6E8F5] bg-white text-neutral-700 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B57E6]/40"
        >
          <Bell className="size-4" />
        </button>

        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatarUrl} alt={user.name} className="size-10 rounded-full object-cover" />
        ) : (
          <div
            aria-label={user.name}
            className="grid size-10 place-items-center rounded-full bg-[#5B57E6] text-sm font-semibold text-white"
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </header>
  );
}

/* ---------- Page ---------- */
export default function CompanyOverviewPage() {
  const { data: intake, isLoading } = IntakeQuery();
  const { mutate: completeIntake, isPending: isSaving } = CompleteIntakeMutation();
  const [activeId, setActiveId] = useState("");

  const sections = useMemo(() => toCompanySections(intake?.sections ?? []), [intake]);

  const { total, reviewed } = useMemo(() => {
    const all = sections.flatMap((s) => s.fields);
    return { total: all.length, reviewed: all.filter((f) => f.reviewed).length };
  }, [sections]);

  // Highlight the sidebar item for the section currently in view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActiveId(hit.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);


  const scrollTo = (id: string) => {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,#E9ECFF_0%,#FFFFFF_45%)]">
      <TopBar />

      <div className="grid w-full gap-4 px-4 pb-10 pt-2 sm:px-6 lg:grid-cols-[340px_1fr] lg:px-10">
        {/* Left: progress + section navigation */}
        <aside className="rounded-3xl border border-[#E6E8F5] bg-white/80 p-5 backdrop-blur lg:sticky lg:top-6 lg:self-start">
          <h1 className="text-base font-semibold text-neutral-900">Company Overview</h1>
          <p className="mb-4 mt-1 text-xs leading-5 text-neutral-500">
            Everything was researched and filled automatically. Review and edit before building your workspace.
          </p>

          <ProgressRing value={reviewed} total={total} />

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
                      className={`flex w-full items-center justify-between border-l-2 px-2.5 py-2.5 text-left text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B57E6]/40 ${
                        active
                          ? "border-[#5B57E6] font-medium text-[#5B57E6]"
                          : "border-transparent text-neutral-700 hover:text-neutral-950"
                      }`}
                    >
                      <span>{s.title}</span>
                      <span className="text-xs text-neutral-500">{String(s.fields.length).padStart(2, "0")}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Right: sections and fields */}
        <div className="min-w-0 rounded-3xl border border-[#E6E8F5] bg-white/80 p-5 backdrop-blur sm:p-8">
          {isLoading && <p className="text-sm text-neutral-500">Loading company overview...</p>}
          {sections
            .filter((s) => s.fields.length > 0)
            .map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-8 pb-8 last:pb-0">
                <h2 className="mb-3 text-sm text-neutral-800">{s.title}</h2>
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
                onClick={() => completeIntake()}
                disabled={isSaving}
                className="h-9 rounded-full bg-[#5B57E6] px-6 text-sm font-semibold text-white hover:bg-[#4a46d4] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B57E6]/40"
              >
                {isSaving ? "Completing..." : "complete"}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}