"use client";

import { useState, type ReactNode } from "react";
import { BookOpen, CircleAlert, Loader2, MessageSquareQuote, ThumbsDown, ThumbsUp } from "lucide-react";
import { InstagramIcon, LinkedInIcon } from "@/components/shared/brandIcons";
import {
  EmptyAction,
  ErrorText,
  GrowthSection,
  LABEL,
  LoadingBlock,
  formatDate,
} from "@/components/dashboard/linkedin-growth/ui";
import { getApiErrorMessage, isApiNotFoundError } from "@/errors/error-utils";
import { StoryBankQuery } from "@/routes/bussiness/Bussiness-Query";
import {
  isStoryBankBusy,
  type StoryBankProfile,
  type StoryBankResponse,
} from "@/types/bussiness/story-bank-type";
import { FOCUS_RING } from "@/utils/ui-classes";

const PLATFORM = {
  instagram: { label: "Instagram", Icon: InstagramIcon, color: "text-[#E1306C]" },
  linkedin: { label: "LinkedIn", Icon: LinkedInIcon, color: "text-[#0A66C2]" },
} as const;

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className={LABEL}>{label}</p>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function Chips({ items, tone = "neutral" }: { items: string[]; tone?: "neutral" | "brand" }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li
          key={item}
          className={`rounded-full px-2.5 py-0.5 text-[12px] ${
            tone === "brand" ? "bg-[#EEF0FF] font-medium text-[#4544C9]" : "bg-neutral-100 text-neutral-700"
          }`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Where the story bank is, in plain words, while it isn't ready. */
function StatusBanner({ bank }: { bank: StoryBankResponse }) {
  if (isStoryBankBusy(bank.status)) {
    return (
      <p className="flex items-center gap-2 rounded-xl bg-[#F4F3FF] px-3 py-2.5 text-[13px] text-[#4544C9]">
        <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden="true" />
        {bank.status === "importing"
          ? "Reading your past posts… this page updates by itself."
          : "Learning your voice and what works… this page updates by itself."}
      </p>
    );
  }
  if (bank.status === "failed") {
    return (
      <p className="flex items-start gap-2 rounded-xl bg-rose-50 px-3 py-2.5 text-[13px] text-rose-700">
        <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        {bank.error_message || "We couldn't read your posts. Try Refresh now."}
      </p>
    );
  }
  return null;
}

/** The company's voice and true stories, learned per platform from its own posts. */
export default function VoiceStoriesSection() {
  const bankQuery = StoryBankQuery();
  const bank = bankQuery.data;
  const profiles = bank?.profiles ?? [];
  const [platform, setPlatform] = useState<string | null>(null);
  const active = profiles.find((p) => p.platform === platform) ?? profiles[0];

  const postCounts = Object.entries(bank?.post_counts ?? {}).filter(([, count]) => count > 0);
  const subtitle = bank?.last_learned_at
    ? `Learned from your own posts · updated ${formatDate(bank.last_learned_at)}`
    : "Learned from your own Instagram and LinkedIn posts.";

  return (
    <GrowthSection icon={MessageSquareQuote} title="Your voice & stories" description={subtitle}>
      {bankQuery.isLoading ? (
        <LoadingBlock />
      ) : bankQuery.isError ? (
        isApiNotFoundError(bankQuery.error) ? (
          <EmptyAction text="Your story bank isn't set up yet. Add your Instagram or LinkedIn at onboarding and we'll learn from your posts." />
        ) : (
          <ErrorText>{getApiErrorMessage(bankQuery.error, "Could not load your story bank")}</ErrorText>
        )
      ) : !bank ? null : (
        <div className="space-y-4">
          <StatusBanner bank={bank} />

          {postCounts.length ? (
            <p className="flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-neutral-500">
              {postCounts.map(([key, count]) => {
                const meta = PLATFORM[key as keyof typeof PLATFORM];
                return (
                  <span key={key} className="inline-flex items-center gap-1">
                    {meta ? <meta.Icon className={`size-3 ${meta.color}`} /> : null}
                    {count} {meta?.label ?? key} posts read
                  </span>
                );
              })}
            </p>
          ) : null}

          {!profiles.length ? (
            bank.status === "empty" ? (
              <EmptyAction text="No posts found yet. Add your Instagram or LinkedIn at onboarding, post a few times, then refresh." />
            ) : isStoryBankBusy(bank.status) ? null : (
              <EmptyAction text="Your voice shows up here once we've learned from your posts." />
            )
          ) : (
            <>
              {profiles.length > 1 ? (
                <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Platform">
                  {profiles.map((profile) => {
                    const meta = PLATFORM[profile.platform];
                    const selected = profile.platform === active?.platform;
                    return (
                      <button
                        key={profile.platform}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => setPlatform(profile.platform)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${FOCUS_RING} ${
                          selected ? "bg-[#5B57E6] text-white" : "bg-[#F1F2FB] text-neutral-600 hover:bg-[#E6E8F5]"
                        }`}
                      >
                        <meta.Icon className={`size-3.5 ${selected ? "" : meta.color}`} />
                        {meta.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}
              {active ? <ProfileView profile={active} /> : null}
            </>
          )}
        </div>
      )}
    </GrowthSection>
  );
}

function ProfileView({ profile }: { profile: StoryBankProfile }) {
  const { voice } = profile;
  const styleNotes = [
    { label: "Sentences", value: voice.sentence_style },
    { label: "Point of view", value: voice.point_of_view },
    { label: "Formatting", value: voice.formatting },
  ].filter((note) => note.value);

  return (
    <div className="space-y-4" role="tabpanel">
      {voice.summary ? (
        <p className="rounded-xl bg-[#F8F9FF] p-3 text-[13px] leading-6 text-neutral-700">{voice.summary}</p>
      ) : null}

      {voice.traits.length ? (
        <Block label="Your tone">
          <Chips items={voice.traits} tone="brand" />
        </Block>
      ) : null}

      {profile.stories.length ? (
        <Block label="Your true stories">
          <ul className="space-y-2">
            {profile.stories.map((story, index) => (
              <li key={`${story.title}-${index}`} className="flex gap-2.5 rounded-xl border border-[#EEF0FA] p-3">
                <BookOpen className="mt-0.5 size-4 shrink-0 text-[#5B57E6]" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-neutral-900">{story.title}</p>
                  <p className="mt-0.5 text-[12px] leading-5 text-neutral-600">{story.summary}</p>
                </div>
              </li>
            ))}
          </ul>
        </Block>
      ) : null}

      {profile.content_pillars.length ? (
        <Block label="What you post about">
          <Chips items={profile.content_pillars} />
        </Block>
      ) : null}

      {profile.do_more.length || profile.avoid.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {profile.do_more.length ? (
            <div className="rounded-xl bg-[#F0FAF4] p-3">
              <p className="flex items-center gap-1.5 text-[12px] font-semibold text-[#16803C]">
                <ThumbsUp className="size-3.5" aria-hidden="true" />
                Do more
              </p>
              <ul className="mt-1.5 space-y-1 text-[12px] leading-5 text-neutral-700">
                {profile.do_more.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {profile.avoid.length ? (
            <div className="rounded-xl bg-[#FFF5F5] p-3">
              <p className="flex items-center gap-1.5 text-[12px] font-semibold text-rose-700">
                <ThumbsDown className="size-3.5" aria-hidden="true" />
                Avoid
              </p>
              <ul className="mt-1.5 space-y-1 text-[12px] leading-5 text-neutral-700">
                {profile.avoid.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* The finer writing details stay folded so the section reads quickly. */}
      {styleNotes.length || voice.signature_phrases.length || voice.vocabulary.length || profile.hook_patterns.length ? (
        <details className="group rounded-xl border border-[#EEF0FA]">
          <summary className={`cursor-pointer list-none rounded-xl px-3 py-2.5 text-[12px] font-medium text-[#5B57E6] hover:bg-[#FAFAFF] ${FOCUS_RING} [&::-webkit-details-marker]:hidden`}>
            How you write, in detail
          </summary>
          <div className="space-y-3 border-t border-[#F1F2FB] px-3 py-3">
            {styleNotes.map((note) => (
              <p key={note.label} className="text-[12px] leading-5 text-neutral-700">
                <span className="font-medium text-neutral-900">{note.label}:</span> {note.value}
              </p>
            ))}
            {voice.signature_phrases.length ? (
              <Block label="Phrases you use">
                <ul className="space-y-1">
                  {voice.signature_phrases.map((phrase) => (
                    <li key={phrase} className="text-[12px] italic text-neutral-600">
                      “{phrase}”
                    </li>
                  ))}
                </ul>
              </Block>
            ) : null}
            {voice.vocabulary.length ? (
              <Block label="Words you use">
                <Chips items={voice.vocabulary} />
              </Block>
            ) : null}
            {profile.hook_patterns.length ? (
              <Block label="Hooks that work">
                <ul className="space-y-2">
                  {profile.hook_patterns.map((hook, index) => (
                    <li key={`${hook.pattern}-${index}`} className="border-s-2 border-[#5B57E6] ps-3">
                      <p className="text-[12px] font-medium text-neutral-900">{hook.pattern}</p>
                      {hook.example ? <p className="text-[12px] italic text-neutral-600">“{hook.example}”</p> : null}
                    </li>
                  ))}
                </ul>
              </Block>
            ) : null}
          </div>
        </details>
      ) : null}

      <p className="text-[11px] text-neutral-400">
        From {profile.posts_analysed} posts · learned {formatDate(profile.learned_at)}
      </p>
    </div>
  );
}
