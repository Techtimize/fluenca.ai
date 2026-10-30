"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarClock, Check, ListOrdered, List, Loader2, Send } from "lucide-react";
import { initialDate } from "@/components/dashboard/content/schedulePostDialog";
import {
  FIELD,
  HashtagInput,
  MediaPicker,
  ScheduleFields,
  Step,
  validateFile,
} from "@/components/dashboard/content/scheduled/composerFields";
import {
  InstagramPreview,
  LinkedInPreview,
} from "@/components/dashboard/content/scheduled/postPreviews";
import {
  PlatformIcon,
  platformLabel,
  useConnectedPlatforms,
} from "@/components/dashboard/content/scheduled/scheduleFields";
import { accountDisplayName } from "@/components/dashboard/social/socialUtils";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { isPublishSucceeded } from "@/lib/content/posted-content";
import { CreateScheduledPostMutation, LinkedInPublishMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { SocialAccountsQuery } from "@/routes/bussiness/Bussiness-Query";
import { toOffsetIso, type ScheduledPostPlatform } from "@/types/bussiness/scheduled-post-type";
import { findSocialAccount, normalizeSocialAccounts } from "@/types/bussiness/social-accounts-type";
import useAuthStore from "@/store/AuthsStore";
import { FOCUS_RING } from "@/utils/ui-classes";
import { cn } from "@/lib/utils";

type Network = "instagram" | "linkedin";
type When = "now" | "later";

/** Instagram tab also offers Facebook, since both take the same image/video + caption. */
const NETWORK_PLATFORMS: Record<Network, ScheduledPostPlatform[]> = {
  instagram: ["instagram", "facebook"],
  linkedin: ["linkedin"],
};

const LIMITS: Record<Network, number> = { instagram: 2200, linkedin: 3000 };

const TABS: { id: Network; label: string }[] = [
  { id: "instagram", label: "Instagram post" },
  { id: "linkedin", label: "LinkedIn post" },
];

/** Caption plus the hashtags on their own line, the way both platforms show them. */
const withHashtags = (text: string, tags: string[]) =>
  [text.trim(), tags.map((tag) => `#${tag}`).join(" ")].filter(Boolean).join("\n\n");

export default function UploadSchedulePanel() {
  const [network, setNetwork] = useState<Network>("instagram");

  return (
    <section className="rounded-[28px] border border-[#E6E8F5] bg-white p-3 sm:p-4">
      <div role="tablist" aria-label="Post type" className="grid w-full max-w-md grid-cols-2 gap-1 rounded-2xl bg-[#F1F2FB] p-1">
        {TABS.map((tab) => {
          const active = network === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setNetwork(tab.id)}
              className={cn(
                `inline-flex h-10 items-center justify-center gap-2 rounded-xl text-[13px] font-semibold transition-colors ${FOCUS_RING}`,
                active ? "bg-[#5452F6] text-white shadow-sm" : "text-neutral-600 hover:bg-white/70",
              )}
            >
              <PlatformIcon platform={tab.id} className={cn("size-4", active && "brightness-0 invert")} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Keyed so each tab starts with its own fresh draft. */}
      <Composer key={network} network={network} />
    </section>
  );
}

function Composer({ network }: { network: Network }) {
  const isLinkedIn = network === "linkedin";
  const limit = LIMITS[network];
  const companyName = useAuthStore((s) => s.company_name);
  const { connected, isLoading: platformsLoading } = useConnectedPlatforms();
  const { data: accountsData } = SocialAccountsQuery();
  const accounts = normalizeSocialAccounts(accountsData);

  const available = NETWORK_PLATFORMS[network].filter((p) => connected.includes(p));
  const [picked, setPicked] = useState<ScheduledPostPlatform[] | null>(null);
  const platforms = (picked ?? available).filter((p) => available.includes(p));

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [scheduledAt, setScheduledAt] = useState(() => initialDate());
  const [when, setWhen] = useState<When>("later");
  const [progress, setProgress] = useState(0);

  const schedule = CreateScheduledPostMutation();
  const publish = LinkedInPublishMutation();
  const isPending = schedule.isPending || publish.isPending;

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const fullText = withHashtags(text, hashtags);
  // LinkedIn can post a text post straight away; media goes through scheduling.
  const canPostNow = isLinkedIn && !file;
  const postNow = canPostNow && when === "now";
  const inPast = !postNow && scheduledAt <= new Date();
  const hasContent = isLinkedIn ? text.trim().length > 0 : Boolean(file);
  const tooLong = fullText.length > limit;
  const canSubmit = hasContent && platforms.length > 0 && !inPast && !tooLong && !isPending;

  const primary = available[0] ?? network;
  const account = findSocialAccount(accounts, primary);
  const accountName = accountDisplayName(account) || companyName || "Your account";

  const pickFile = (next: File | undefined) => {
    if (!next) return;
    const error = validateFile(next);
    setFileError(error);
    if (error) return;
    setFile(next);
    setPreviewUrl(URL.createObjectURL(next));
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setFileError(null);
  };

  const reset = () => {
    clearFile();
    setText("");
    setHashtags([]);
    setScheduledAt(initialDate());
  };

  /** Puts "• " or "1. " at the start of the current line (LinkedIn has no rich text). */
  const insertList = (ordered: boolean) => {
    const lines = text.split("\n");
    const lastLine = lines[lines.length - 1];
    const count = lines.filter((line) => /^\d+\.\s/.test(line)).length;
    const prefix = ordered ? `${count + 1}. ` : "• ";
    setText((lastLine ? `${text}\n` : text) + prefix);
  };

  const submit = () => {
    if (!canSubmit) return;
    if (postNow) {
      publish.mutate({ text: fullText }, { onSuccess: (response) => isPublishSucceeded(response) && reset() });
      return;
    }
    setProgress(0);
    schedule.mutate(
      {
        body: {
          file,
          platforms,
          scheduled_at: toOffsetIso(scheduledAt),
          caption: fullText || undefined,
        },
        onProgress: setProgress,
      },
      { onSuccess: reset },
    );
  };

  const media = file && previewUrl ? { url: previewUrl, isVideo: file.type.startsWith("video/") } : null;

  const writeStep = (
    <Step
      n={isLinkedIn ? 1 : 2}
      title={isLinkedIn ? "Write your post" : "Write your caption"}
      aside={
        <span className={`text-[12px] ${tooLong ? "text-rose-600" : "text-neutral-400"}`}>
          {fullText.length}/{limit}
        </span>
      }
    >
      <div className={`${FIELD} overflow-hidden p-0`}>
        {isLinkedIn ? (
          <div className="flex items-center gap-1 border-b border-[#F1F2FB] px-2 py-1.5">
            <button
              type="button"
              onClick={() => insertList(false)}
              aria-label="Add a bullet point"
              className={`grid size-7 place-items-center rounded-md text-neutral-600 hover:bg-[#F1F2FB] ${FOCUS_RING}`}
            >
              <List className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => insertList(true)}
              aria-label="Add a numbered point"
              className={`grid size-7 place-items-center rounded-md text-neutral-600 hover:bg-[#F1F2FB] ${FOCUS_RING}`}
            >
              <ListOrdered className="size-4" />
            </button>
          </div>
        ) : null}
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value.slice(0, limit))}
          rows={isLinkedIn ? 9 : 5}
          disabled={isPending}
          placeholder={isLinkedIn ? "What do you want to share on LinkedIn?" : "Write a caption…"}
          aria-label={isLinkedIn ? "Post text" : "Caption"}
          className="block w-full resize-y bg-transparent px-3.5 py-3 text-[13px] leading-6 text-neutral-900 outline-none placeholder:text-neutral-400"
        />
      </div>
    </Step>
  );

  const mediaStep = (
    <Step n={isLinkedIn ? 2 : 1} title={isLinkedIn ? "Add media" : "Choose media"} hint={isLinkedIn ? "(optional)" : undefined}>
      <MediaPicker
        file={file}
        previewUrl={previewUrl}
        error={fileError}
        disabled={isPending}
        compact={isLinkedIn}
        onPick={pickFile}
        onClear={clearFile}
      />
    </Step>
  );

  return (
    <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,0.85fr)]">
      {/* Composer */}
      <div className="min-w-0 space-y-5 rounded-2xl border border-[#E6E8F5] p-4 sm:p-5">
        {isLinkedIn ? (
          <>
            {writeStep}
            {mediaStep}
          </>
        ) : (
          <>
            {mediaStep}
            {writeStep}
          </>
        )}

        <Step n={3} title="Add hashtags" hint="(optional)">
          <HashtagInput value={hashtags} onChange={setHashtags} disabled={isPending} />
        </Step>

        <Step n={4} title={isLinkedIn ? "LinkedIn account" : "Post to"}>
          {platformsLoading ? (
            <div className="h-14 animate-pulse rounded-xl bg-[#F1F2F8]" aria-busy="true" />
          ) : !available.length ? (
            <p className="rounded-xl border border-dashed border-[#E6E8F5] px-3 py-3 text-[12px] leading-5 text-neutral-600">
              No {isLinkedIn ? "LinkedIn" : "Instagram or Facebook"} account is connected.{" "}
              <Link href={PAGE_ROUTES.CONNECTORS} className={`rounded font-medium text-[#5B57E6] hover:underline ${FOCUS_RING}`}>
                Connect one
              </Link>{" "}
              to post.
            </p>
          ) : (
            <ul className="space-y-2">
              {available.map((platform) => {
                const selected = platforms.includes(platform);
                const name = accountDisplayName(findSocialAccount(accounts, platform)) || companyName || platformLabel(platform);
                const toggle = () =>
                  setPicked(selected ? platforms.filter((p) => p !== platform) : [...platforms, platform]);
                return (
                  <li key={platform}>
                    <button
                      type="button"
                      onClick={toggle}
                      aria-pressed={selected}
                      disabled={isPending || available.length === 1}
                      className={cn(
                        `flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors disabled:cursor-default ${FOCUS_RING}`,
                        selected ? "border-[#5B57E6] bg-[#F7F7FF]" : "border-[#E6E8F5] bg-white hover:bg-[#FAFAFF]",
                      )}
                    >
                      <PlatformIcon platform={platform} className="size-8" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold text-neutral-900">{name}</span>
                        <span className="block text-[11px] text-neutral-500">{platformLabel(platform)} · Connected</span>
                      </span>
                      {available.length > 1 ? (
                        <span
                          className={cn(
                            "grid size-5 place-items-center rounded-md border",
                            selected ? "border-[#5B57E6] bg-[#5B57E6] text-white" : "border-[#D9DCF7] bg-white",
                          )}
                          aria-hidden="true"
                        >
                          {selected ? <Check className="size-3.5" /> : null}
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Step>
      </div>

      {/* Preview */}
      <div className="min-w-0 rounded-2xl border border-[#E6E8F5] bg-[#FAFAFF] p-4 sm:p-5">
        <h3 className="mb-3 text-[13px] font-semibold text-neutral-900">Post preview</h3>
        {isLinkedIn ? (
          <LinkedInPreview name={accountName} text={fullText} media={media} />
        ) : (
          <InstagramPreview name={accountName} caption={fullText} media={media} />
        )}
      </div>

      {/* Account + schedule */}
      <div className="min-w-0 space-y-4 rounded-2xl border border-[#E6E8F5] p-4 sm:p-5">
        <div className="flex items-center gap-3 border-b border-[#F1F2FB] pb-4">
          <PlatformIcon platform={network} className="size-10" />
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold text-neutral-900">{platformLabel(network)}</p>
            <p className="flex items-center gap-1.5 text-[11px] text-neutral-500">
              <span className={cn("size-1.5 rounded-full", available.length ? "bg-[#16A34A]" : "bg-neutral-300")} />
              {available.length
                ? `${available.length} account${available.length === 1 ? "" : "s"} connected`
                : "Not connected"}
            </p>
          </div>
          <Link
            href={PAGE_ROUTES.CONNECTORS}
            className={`shrink-0 rounded-full border border-[#D9DCF7] px-3 py-1.5 text-[12px] font-semibold text-[#5B57E6] hover:bg-[#F0F1FF] ${FOCUS_RING}`}
          >
            Manage accounts
          </Link>
        </div>

        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-[14px] font-semibold text-neutral-900">
            <CalendarClock className="size-4 text-[#5B57E6]" aria-hidden="true" />
            {postNow ? "Publish post" : "Schedule post"}
          </h3>

          {isLinkedIn ? (
            <div role="radiogroup" aria-label="When to post" className="grid grid-cols-2 gap-1 rounded-xl bg-[#F1F2FB] p-1">
              {(
                [
                  { id: "now", label: "Post now", icon: Send },
                  { id: "later", label: "Schedule", icon: CalendarClock },
                ] as const
              ).map((option) => {
                const active = (postNow ? "now" : "later") === option.id;
                const disabled = isPending || (option.id === "now" && !canPostNow);
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setWhen(option.id)}
                    disabled={disabled}
                    title={option.id === "now" && !canPostNow ? "Posts with media are scheduled" : undefined}
                    className={cn(
                      `inline-flex h-8 items-center justify-center gap-1.5 rounded-lg text-[12px] font-semibold transition-colors disabled:opacity-50 ${FOCUS_RING}`,
                      active ? "bg-white text-[#3F3D9E] shadow-sm" : "text-neutral-600 hover:text-neutral-900",
                    )}
                  >
                    <Icon className="size-3.5" aria-hidden="true" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          ) : null}
          {isLinkedIn && file ? (
            <p className="text-[11px] text-neutral-500">Posts with an image or video are scheduled, not posted instantly.</p>
          ) : null}

          {postNow ? null : <ScheduleFields value={scheduledAt} onChange={setScheduledAt} />}
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit}
          className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#5452F6] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#4544C9] disabled:pointer-events-none disabled:opacity-55 ${FOCUS_RING}`}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : postNow ? (
            <Send className="size-4" aria-hidden="true" />
          ) : (
            <CalendarClock className="size-4" aria-hidden="true" />
          )}
          {isPending
            ? postNow
              ? "Posting to LinkedIn…"
              : !file || progress >= 100
                ? "Scheduling…"
                : `Uploading ${progress}%`
            : postNow
              ? "Post to LinkedIn now"
              : "Schedule post"}
        </button>

        {isPending && file && !postNow ? (
          <div
            className="h-1.5 overflow-hidden rounded-full bg-[#ECEBFF]"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Upload progress"
          >
            <div className="h-full rounded-full bg-[#5452F6] transition-[width]" style={{ width: `${progress}%` }} />
          </div>
        ) : (
          <p className={`text-center text-[11px] ${tooLong ? "text-rose-600" : "text-neutral-500"}`}>
            {tooLong
              ? `Too long — keep it under ${limit} characters, hashtags included.`
              : !hasContent
                ? isLinkedIn
                  ? "Write your post to continue."
                  : "Add an image or video to continue."
                : !platforms.length && available.length
                  ? "Pick at least one account."
                  : postNow
                    ? "Your post goes live on LinkedIn right away."
                    : "Your post will be published automatically at the selected time."}
          </p>
        )}
      </div>
    </div>
  );
}
