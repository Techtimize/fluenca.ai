"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Radar, Sparkles } from "lucide-react";
import { AnswersMatrix } from "@/components/dashboard/ai-visibility/AiVisibilityAnswers";
import { ModeSwitch, QuestionsEditor } from "@/components/dashboard/ai-visibility/AiVisibilityControls";
import {
  EngineTable,
  Gaps,
  ScoreCards,
  ShareOfVoice,
  TrendLine,
  TrustedSources,
} from "@/components/dashboard/ai-visibility/AiVisibilityPanels";
import { Button } from "@/components/ui/button";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { getApiErrorMessage } from "@/errors/error-utils";
import {
  AiVisibilityCheckMutation,
  AiVisibilityGapPostMutation,
  AiVisibilityQuery,
} from "@/routes/ai-visibility/AiVisibility-Query";
import useAuthStore from "@/store/AuthsStore";

function Panel({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="rounded-[24px] border border-[#E6E8F5] bg-[#F8F9FD] p-4 sm:p-5">
      <h2 className="text-[16px] font-semibold text-neutral-900">{title}</h2>
      {hint ? <p className="mt-1 text-[13px] text-neutral-600">{hint}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function AiVisibilityPage() {
  const router = useRouter();
  const companyName = useAuthStore((s) => s.company_name) || "";
  const { data: overview, isLoading, isError, error, refetch } = AiVisibilityQuery();
  const check = AiVisibilityCheckMutation();
  const gapPost = AiVisibilityGapPostMutation();
  const writeGap = (question: string) =>
    gapPost.mutate(question, { onSuccess: (post) => router.push(PAGE_ROUTES.BLOG_DETAIL(post.id)) });

  const running = overview?.active;
  const latest = overview?.latest;
  const summary = latest?.status === "done" ? latest.summary : null;

  return (
    <main className="min-w-0 space-y-4 pb-32">
      <section className="rounded-[28px] border border-[#E6E8F5] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_55%)] p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5452F6] ring-1 ring-[#E6E8F5]">
              <Radar className="size-3.5" aria-hidden="true" />
              AI visibility
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">Are you in AI answers?</h1>
            <p className="mt-2 max-w-2xl text-[14px] leading-6 text-neutral-600">
              We ask ChatGPT, Perplexity and Google the questions your customers ask, and show where you are named,
              who is named instead, and which sites AI trusts for your topics.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => check.mutate()}
            disabled={!overview?.can_check_now || check.isPending || Boolean(running)}
            className="h-11 gap-2 rounded-xl bg-linear-to-r from-[#4F46E5] to-[#6D6AF5] px-5 text-[15px] font-semibold text-white shadow-[0_6px_16px_-6px_rgba(79,70,229,0.6)] hover:opacity-95"
          >
            {running || check.isPending ? (
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles className="size-5" aria-hidden="true" />
            )}
            {running ? "Checking…" : "Check now"}
          </Button>
        </div>
        {running ? (
          <p className="mt-4 flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2 text-[13px] text-neutral-700 ring-1 ring-[#E6E8F5]">
            <Loader2 className="size-4 animate-spin text-[#4F46E5]" aria-hidden="true" />
            Asking the AI engines your questions. This takes a few minutes; the page updates by itself.
          </p>
        ) : overview && !overview.can_check_now ? (
          <p className="mt-4 text-[12px] text-neutral-500">Manual checks are limited to one a day.</p>
        ) : null}
      </section>

      {isLoading ? (
        <p className="flex items-center gap-2 text-[13px] text-neutral-500">
          <Loader2 className="size-4 animate-spin text-[#5B57E6]" aria-hidden="true" />
          Loading…
        </p>
      ) : isError || !overview ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
          <p className="text-[13px] text-rose-700">{getApiErrorMessage(error, "Could not load AI visibility")}</p>
          <Button type="button" variant="outline" onClick={() => void refetch()} className="h-9 rounded-full">
            Try again
          </Button>
        </div>
      ) : (
        <>
          <Panel title="How checks run" hint="Pick automatic weekly checks, or run them yourself.">
            <ModeSwitch overview={overview} />
          </Panel>

          {latest?.status === "failed" && !running ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-700">
              The last check did not finish: {latest.error}
            </p>
          ) : null}

          {summary && latest ? (
            <>
              <ScoreCards overview={overview} brand={companyName} />
              <div className="grid gap-4 xl:grid-cols-2">
                <Panel title="Score over time">
                  <TrendLine points={overview.trend} />
                </Panel>
                <Panel title="By engine">
                  <EngineTable summary={summary} />
                </Panel>
              </div>
              <Panel
                title="What AI answered"
                hint={`Checked ${new Date(latest.finished_at ?? latest.created_at).toLocaleString()}. Open a question to read the answers.`}
              >
                <AnswersMatrix runId={latest.id} engines={overview.engines} peopleAlsoAsk={summary.people_also_ask} />
              </Panel>
              <div className="grid gap-4 lg:grid-cols-2">
                <Panel title="Share of voice" hint="Who AI names most for your questions.">
                  <ShareOfVoice summary={summary} brand={companyName} />
                </Panel>
                <Panel title="Sites AI trusts" hint="Getting featured here is the fastest way into AI answers.">
                  <TrustedSources summary={summary} />
                </Panel>
              </div>
              <Panel
                title={`Gaps to fix${summary.gaps.length ? ` (${summary.gaps.length})` : ""}`}
                hint="Questions where AI names others, not you. Write a blog post for one and AI drafts it in a few minutes from these answers; you review it on the Blogs page."
              >
                <Gaps
                  summary={summary}
                  onWrite={writeGap}
                  writing={gapPost.isPending ? (gapPost.variables ?? null) : null}
                />
              </Panel>
            </>
          ) : !running ? (
            <section className="rounded-[24px] border border-dashed border-[#C8C6F5] bg-white p-6 text-center">
              <p className="text-[15px] font-semibold text-neutral-900">No check yet</p>
              <p className="mt-1 text-[13px] text-neutral-600">
                Press Check now, or switch to Automatic, to see how AI talks about {companyName || "you"}.
              </p>
            </section>
          ) : null}

          <Panel title="Tracked questions" hint="The questions we ask AI each check.">
            <QuestionsEditor overview={overview} />
          </Panel>
        </>
      )}
    </main>
  );
}
