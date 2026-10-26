"use client";

import type { ReactNode } from "react";
import { BookOpen, ExternalLink, MessageSquareQuote } from "lucide-react";
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

/** Tone, best stories, hooks that worked, formats and top posts from the story bank. */
export default function VoiceCard() {
  const voiceQuery = LinkedInVoiceQuery();
  const voice = voiceQuery.data;

  return (
    <GrowthSection
      icon={MessageSquareQuote}
      title="Your LinkedIn voice"
      description="Learned from your past posts: your tone, your best stories and the hooks that worked."
    >
      {voiceQuery.isLoading ? (
        <LoadingBlock />
      ) : voiceQuery.isError ? (
        <ErrorText>{getApiErrorMessage(voiceQuery.error, "Could not load your LinkedIn voice")}</ErrorText>
      ) : !voice?.ready ? (
        <EmptyAction text="Your voice shows up here once your story bank has posts. Keep posting on LinkedIn and check back." />
      ) : (
        <div className="space-y-4">
          {voice.tone?.length ? (
            <Block label="Tone">
              <ul className="flex flex-wrap gap-1.5">
                {voice.tone.map((word) => (
                  <li key={word} className="rounded-full bg-[#E8F1FB] px-2.5 py-0.5 text-[12px] font-medium capitalize text-[#0A66C2]">
                    {word}
                  </li>
                ))}
              </ul>
            </Block>
          ) : null}

          {voice.stories?.length ? (
            <Block label="Best stories">
              <ul className="space-y-2">
                {voice.stories.map((story) => (
                  <li key={story.title} className="flex gap-2.5 rounded-xl bg-[#F6F9FD] p-3">
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

          {voice.hooks?.length ? (
            <Block label="Hooks that worked">
              <ul className="space-y-1.5">
                {voice.hooks.map((hook) => (
                  <li key={hook} className="border-s-2 border-[#0A66C2] ps-3 text-[13px] italic text-neutral-700">
                    “{hook}”
                  </li>
                ))}
              </ul>
            </Block>
          ) : null}

          {voice.formats?.length ? (
            <Block label="Formats">
              <ul className="flex flex-wrap gap-1.5">
                {voice.formats.map((format) => (
                  <li key={format} className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[12px] text-neutral-700">
                    {format}
                  </li>
                ))}
              </ul>
            </Block>
          ) : null}

          {voice.top_posts?.length ? (
            <Block label="Top posts">
              <ul className="space-y-2">
                {voice.top_posts.map((post) => (
                  <li key={post.text} className="rounded-xl border border-[#EEF0FA] p-3">
                    <p className="line-clamp-3 text-[12px] leading-5 text-neutral-700">{post.text}</p>
                    <div className="mt-1.5 flex items-center gap-3 text-[11px] text-neutral-500">
                      {post.engagement != null ? <span>{post.engagement} engagement</span> : null}
                      {post.url ? (
                        <a href={post.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#0A66C2] hover:underline">
                          View post
                          <ExternalLink className="size-3" aria-hidden="true" />
                        </a>
                      ) : null}
                    </div>
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
