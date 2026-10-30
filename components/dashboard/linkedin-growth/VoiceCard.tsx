"use client";

import type { ReactNode } from "react";
import { BookOpen, MessageSquareQuote, TrendingUp } from "lucide-react";
import { getApiErrorMessage } from "@/errors/error-utils";
import { LinkedInVoiceQuery } from "@/routes/bussiness/Bussiness-Query";
import { EmptyAction, ErrorText, GrowthSection, LABEL, LoadingBlock } from "./ui";

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className={LABEL}>{label}</p>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

/** "2.4" → "2.4× your typical post". */
const timesTypical = (value?: number | null) =>
  typeof value === "number" && value > 0 ? `${value.toFixed(1)}× your typical post` : null;

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

/** Your voice, best stories, hooks that worked, formats and top posts, from the story bank. */
export default function VoiceCard() {
  const voiceQuery = LinkedInVoiceQuery();
  const voice = voiceQuery.data;

  return (
    <GrowthSection
      icon={MessageSquareQuote}
      title="Your LinkedIn voice"
      description="Learned from your past posts: how you write, your best stories and the hooks that worked."
    >
      {voiceQuery.isLoading ? (
        <LoadingBlock />
      ) : voiceQuery.isError ? (
        <ErrorText>{getApiErrorMessage(voiceQuery.error, "Could not load your LinkedIn voice")}</ErrorText>
      ) : !voice?.ready ? (
        <EmptyAction
          text={
            voice?.message ||
            "Your voice shows up here once your story bank has LinkedIn posts. Keep posting and check back."
          }
        />
      ) : (
        <div className="space-y-4">
          {voice.voice ? (
            <Block label="How you write">
              <p className="rounded-xl bg-[#F6F9FD] p-3 text-[13px] leading-6 text-neutral-700">{voice.voice}</p>
            </Block>
          ) : null}

          {voice.stories.length ? (
            <Block label="Best stories">
              <ul className="space-y-2">
                {voice.stories.map((story, index) => (
                  <li key={`${story.title}-${index}`} className="flex gap-2.5 rounded-xl bg-[#F6F9FD] p-3">
                    <BookOpen className="mt-0.5 size-4 shrink-0 text-[#0A66C2]" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-neutral-900">{story.title}</p>
                      <p className="mt-0.5 text-[12px] leading-5 text-neutral-600">{story.summary}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Block>
          ) : null}

          {voice.hooks_that_worked.length ? (
            <Block label="Hooks that worked">
              <ul className="space-y-2.5">
                {voice.hooks_that_worked.map((hook, index) => (
                  <li key={`${hook.pattern}-${index}`} className="border-s-2 border-[#0A66C2] ps-3">
                    <p className="text-[13px] font-medium text-neutral-900">{hook.pattern}</p>
                    {hook.example ? <p className="mt-0.5 text-[12px] italic text-neutral-600">“{hook.example}”</p> : null}
                    {hook.evidence ? <p className="mt-0.5 text-[11px] text-neutral-400">{hook.evidence}</p> : null}
                  </li>
                ))}
              </ul>
            </Block>
          ) : null}

          {voice.formats.length ? (
            <Block label="Formats that work">
              <ul className="flex flex-wrap gap-1.5">
                {voice.formats.map((format) => (
                  <li
                    key={format.format}
                    className="rounded-full bg-neutral-100 px-2.5 py-1 text-[12px] text-neutral-700"
                    title={`${format.posts} posts`}
                  >
                    <span className="font-medium">{capitalize(format.format)}</span>
                    {timesTypical(format.times_typical) ? (
                      <span className="text-neutral-500"> · {format.times_typical.toFixed(1)}×</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </Block>
          ) : null}

          {voice.top_posts.length ? (
            <Block label="Your best posts">
              <ul className="space-y-2">
                {voice.top_posts.map((post, index) => (
                  <li key={`${post.hook}-${index}`} className="rounded-xl border border-[#EEF0FA] p-3">
                    <p className="line-clamp-2 text-[13px] leading-5 text-neutral-800">{post.hook}</p>
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-neutral-500">
                      <span className="capitalize">{post.format}</span>
                      {post.result || timesTypical(post.times_typical) ? (
                        <span className="inline-flex items-center gap-1 font-medium text-[#16803C]">
                          <TrendingUp className="size-3" aria-hidden="true" />
                          {post.result || timesTypical(post.times_typical)}
                        </span>
                      ) : null}
                    </p>
                  </li>
                ))}
              </ul>
            </Block>
          ) : null}
        </div>
      )}
    </GrowthSection>
  );
}
