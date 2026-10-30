"use client";

import { BookOpen, Loader2, RotateCw } from "lucide-react";
import VoiceStoriesSection from "@/components/dashboard/story-bank/VoiceStoriesSection";
import WeeklyReportSection from "@/components/dashboard/story-bank/WeeklyReportSection";
import { RefreshStoryBankMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { FOCUS_RING } from "@/utils/ui-classes";

/** Story bank: what's working each week, and the voice learned from the company's own posts. */
export default function StoryBankPage() {
  const refresh = RefreshStoryBankMutation();

  return (
    <main className="min-w-0 space-y-4 pb-6">
      <section className="flex flex-wrap items-end justify-between gap-4 rounded-[28px] border border-[#E6E8F5] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_55%)] p-5 sm:p-7">
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5B57E6] ring-1 ring-[#E6E8F5]">
            <BookOpen className="size-3.5" aria-hidden="true" />
            Story bank
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">Your story bank</h1>
          <p className="mt-2 max-w-2xl text-[14px] leading-6 text-neutral-600">
            We learn from your own Instagram and LinkedIn posts: what&rsquo;s working each week, your voice, and the
            stories and hooks your audience reacts to. Every post we write for you uses it.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <button
            type="button"
            onClick={() => refresh.mutate()}
            disabled={refresh.isPending}
            className={`inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-medium text-neutral-700 ring-1 ring-[#E6E8F5] hover:bg-neutral-50 disabled:opacity-55 ${FOCUS_RING}`}
          >
            {refresh.isPending ? <Loader2 className="size-4 animate-spin" /> : <RotateCw className="size-4" />}
            Refresh now
          </button>
          <p className="text-[11px] text-neutral-400">Posts update daily and your voice weekly.</p>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <WeeklyReportSection />
        <VoiceStoriesSection />
      </div>
    </main>
  );
}
