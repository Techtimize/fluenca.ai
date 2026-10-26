"use client";

import { useState, type FormEvent } from "react";
import { Check, ExternalLink, Loader2, Plus, Reply } from "lucide-react";
import { CopyButton, ErrorText, GHOST_BUTTON, GrowthSection, PRIMARY_BUTTON } from "@/components/dashboard/linkedin-growth/ui";
import { getApiErrorMessage } from "@/errors/error-utils";
import { AddFollowUpMutation, CompleteFollowUpMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { FollowUpsQuery } from "@/routes/bussiness/Bussiness-Query";
import type { AddFollowUpRequest, FollowUp, FollowUpReason } from "@/types/bussiness/linkedin-coach-type";
import { FOCUS_RING } from "@/utils/ui-classes";

const REASON_LABEL: Record<FollowUpReason, string> = {
  accepted: "Accepted your request",
  commented: "Commented",
  no_reply: "No reply after 3 days",
};

const INPUT =
  "h-9 w-full rounded-xl border border-[#E6E8F5] bg-white px-3 text-[13px] outline-none placeholder:text-neutral-400 focus:border-[#0A66C2] focus:ring-2 focus:ring-[#0A66C2]/20";

/** People to reply to: ones you add, plus contacted prospects with no answer after 3 days. */
export default function FollowUpsPanel() {
  const followUpsQuery = FollowUpsQuery();
  const [adding, setAdding] = useState(false);
  const open = (followUpsQuery.data ?? []).filter((item) => !item.done);

  return (
    <GrowthSection
      icon={Reply}
      title="Follow-ups"
      description="Add people who accepted your request or commented, and Fluenca drafts a reply. Prospects with no answer after 3 days show up here too."
      action={
        <button type="button" onClick={() => setAdding((value) => !value)} className={GHOST_BUTTON}>
          <Plus className="size-3.5" />
          Add person
        </button>
      }
    >
      {adding ? <AddFollowUpForm onDone={() => setAdding(false)} /> : null}

      {followUpsQuery.isLoading ? (
        <div className="h-20 animate-pulse rounded-xl bg-[#F6F8FC]" aria-busy="true" />
      ) : followUpsQuery.isError ? (
        <ErrorText>{getApiErrorMessage(followUpsQuery.error, "Could not load follow-ups")}</ErrorText>
      ) : open.length ? (
        <ul className={`space-y-2.5 ${adding ? "mt-4" : ""}`}>
          {open.map((item) => (
            <li key={item.id}>
              <FollowUpCard item={item} />
            </li>
          ))}
        </ul>
      ) : (
        <p className={`text-[13px] text-neutral-500 ${adding ? "mt-4" : ""}`}>You&apos;re all caught up.</p>
      )}
    </GrowthSection>
  );
}

function AddFollowUpForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [reason, setReason] = useState<AddFollowUpRequest["reason"]>("accepted");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [context, setContext] = useState("");
  const addFollowUp = AddFollowUpMutation();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    addFollowUp.mutate(
      {
        name: name.trim(),
        reason,
        ...(linkedinUrl.trim() ? { linkedin_url: linkedinUrl.trim() } : {}),
        ...(context.trim() ? { context: context.trim() } : {}),
      },
      { onSuccess: onDone },
    );
  };

  return (
    <form onSubmit={submit} className="grid gap-2 rounded-xl bg-[#F6F9FD] p-3 sm:grid-cols-2">
      <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className={INPUT} />
      <select value={reason} onChange={(e) => setReason(e.target.value as AddFollowUpRequest["reason"])} className={INPUT}>
        <option value="accepted">{REASON_LABEL.accepted}</option>
        <option value="commented">{REASON_LABEL.commented}</option>
      </select>
      <input value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="LinkedIn URL (optional)" className={INPUT} />
      <input value={context} onChange={(e) => setContext(e.target.value)} placeholder="What they said (optional)" className={INPUT} />
      <div className="flex justify-end gap-2 sm:col-span-2">
        <button type="button" onClick={onDone} className={GHOST_BUTTON}>
          Cancel
        </button>
        <button type="submit" disabled={addFollowUp.isPending || !name.trim()} className={PRIMARY_BUTTON}>
          {addFollowUp.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          Add and draft reply
        </button>
      </div>
    </form>
  );
}

function FollowUpCard({ item }: { item: FollowUp }) {
  const complete = CompleteFollowUpMutation();
  return (
    <article className="rounded-xl border border-[#EEF0FA] p-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-[13px] font-semibold text-neutral-900">{item.name}</p>
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-600">{REASON_LABEL[item.reason]}</span>
      </div>
      {item.draft_reply ? (
        <p className="mt-2 whitespace-pre-wrap rounded-lg bg-[#F6F9FD] p-2.5 text-[12px] leading-5 text-neutral-700">{item.draft_reply}</p>
      ) : null}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {item.draft_reply ? <CopyButton text={item.draft_reply} /> : null}
        {item.linkedin_url ? (
          <a
            href={item.linkedin_url}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-medium text-[#0A66C2] ring-1 ring-[#D6E4F5] hover:bg-[#F6F9FD] ${FOCUS_RING}`}
          >
            Open profile
            <ExternalLink className="size-3" aria-hidden="true" />
          </a>
        ) : null}
        <button type="button" onClick={() => complete.mutate(item.id)} disabled={complete.isPending} className={`${GHOST_BUTTON} ms-auto`}>
          {complete.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
          Done
        </button>
      </div>
    </article>
  );
}
