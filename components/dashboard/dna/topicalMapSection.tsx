"use client";

import { useState, type FormEvent } from "react";
import {
  CircleCheck,
  Layers3,
  Loader2,
  Lock,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { TopicalMapQuery } from "@/routes/topical-map/Topical-Map-Query";
import {
  AddTopicMutation,
  ApproveTopicalMapMutation,
  DeleteTopicMutation,
  RetryTopicalMapMutation,
  UpdateTopicMutation,
} from "@/routes/topical-map/Topical-Map-Mutation";
import type { Pillar, SpecificTopic, Subcategory } from "@/types/bussiness/topical-map-type";
import { FOCUS_RING } from "@/utils/ui-classes";

function SectionShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-[#E6E8F5] bg-white p-5 shadow-[0_4px_20px_rgba(17,24,39,0.04)] sm:p-6">
      {children}
    </section>
  );
}

function AddTopicForm({
  placeholder,
  onAdd,
  onCancel,
  isPending,
  withSeedKeyword,
}: {
  placeholder: string;
  onAdd: (name: string, seedKeyword?: string) => void;
  onCancel: () => void;
  isPending: boolean;
  withSeedKeyword?: boolean;
}) {
  const [name, setName] = useState("");
  const [seedKeyword, setSeedKeyword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed, withSeedKeyword ? seedKeyword.trim() || undefined : undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2 py-2">
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={placeholder}
        className={`min-w-[160px] flex-1 rounded-full border border-[#E6E8F5] px-3 py-1.5 text-[13px] outline-none ${FOCUS_RING}`}
      />
      {withSeedKeyword ? (
        <input
          value={seedKeyword}
          onChange={(e) => setSeedKeyword(e.target.value)}
          placeholder="Seed keyword (optional)"
          className={`min-w-[160px] flex-1 rounded-full border border-[#E6E8F5] px-3 py-1.5 text-[13px] outline-none ${FOCUS_RING}`}
        />
      ) : null}
      <button
        type="submit"
        disabled={isPending || !name.trim()}
        className="rounded-full bg-[#5B57E6] px-3 py-1.5 text-[12px] font-medium text-white hover:bg-[#4A46D0] disabled:opacity-50"
      >
        {isPending ? "Adding…" : "Add"}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-full border border-[#E6E8F5] px-3 py-1.5 text-[12px] text-neutral-600 hover:bg-neutral-50"
      >
        Cancel
      </button>
    </form>
  );
}

function EditTopicForm({
  initialName,
  onSave,
  onCancel,
  isPending,
}: {
  initialName: string;
  onSave: (name: string) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [name, setName] = useState(initialName);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 items-center gap-2">
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={`min-w-0 flex-1 rounded-full border border-[#E6E8F5] px-3 py-1 text-[13px] outline-none ${FOCUS_RING}`}
      />
      <button
        type="submit"
        disabled={isPending || !name.trim()}
        aria-label="Save"
        className="grid size-7 place-items-center rounded-full bg-[#5B57E6] text-white hover:bg-[#4A46D0] disabled:opacity-50"
      >
        <CircleCheck className="size-3.5" />
      </button>
      <button
        type="button"
        onClick={onCancel}
        aria-label="Cancel"
        className="grid size-7 place-items-center rounded-full border border-[#E6E8F5] text-neutral-500 hover:bg-neutral-50"
      >
        <X className="size-3.5" />
      </button>
    </form>
  );
}

function TopicRow({
  topicId,
  name,
  editable,
  onRename,
  onDelete,
  renamePending,
  deletePending,
  children,
}: {
  topicId: string;
  name: string;
  editable: boolean;
  onRename: (name: string) => void;
  onDelete: () => void;
  renamePending: boolean;
  deletePending: boolean;
  children?: React.ReactNode;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="group flex items-center gap-2 py-1.5">
      {editing ? (
        <EditTopicForm
          initialName={name}
          isPending={renamePending}
          onCancel={() => setEditing(false)}
          onSave={(value) => {
            onRename(value);
            setEditing(false);
          }}
        />
      ) : (
        <>
          <span className="min-w-0 flex-1 truncate text-[13px] text-neutral-800">{name}</span>
          {children}
          {editable ? (
            <span className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                aria-label={`Rename ${name}`}
                onClick={() => setEditing(true)}
                className="grid size-6 place-items-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              >
                <Pencil className="size-3.5" />
              </button>
              <button
                type="button"
                aria-label={`Delete ${name}`}
                disabled={deletePending}
                onClick={onDelete}
                className="grid size-6 place-items-center rounded-md text-neutral-400 hover:bg-rose-50 hover:text-rose-600"
              >
                <Trash2 className="size-3.5" />
              </button>
            </span>
          ) : null}
        </>
      )}
      <span className="hidden text-[10px] text-neutral-300" aria-hidden="true">
        {topicId}
      </span>
    </div>
  );
}

function SpecificRow({
  specific,
  editable,
  onRename,
  onDelete,
  isRenaming,
  isDeleting,
}: {
  specific: SpecificTopic;
  editable: boolean;
  onRename: (topicId: string, name: string) => void;
  onDelete: (topicId: string) => void;
  isRenaming: boolean;
  isDeleting: boolean;
}) {
  return (
    <TopicRow
      topicId={specific.topic_id}
      name={specific.name}
      editable={editable}
      renamePending={isRenaming}
      deletePending={isDeleting}
      onRename={(name) => onRename(specific.topic_id, name)}
      onDelete={() => onDelete(specific.topic_id)}
    />
  );
}

function SubcategoryBlock({
  subcategory,
  editable,
  limits,
  onRename,
  onDelete,
  onAddSpecific,
  pendingTopicId,
}: {
  subcategory: Subcategory;
  editable: boolean;
  limits: { maxSpecificsPerSubcategory: number };
  onRename: (topicId: string, name: string) => void;
  onDelete: (topicId: string) => void;
  onAddSpecific: (parentId: string, name: string) => void;
  pendingTopicId: string | null;
}) {
  const [adding, setAdding] = useState(false);
  const atLimit = subcategory.specifics.length >= limits.maxSpecificsPerSubcategory;

  return (
    <div className="rounded-2xl border border-[#E6E8F5] bg-neutral-50/60 px-4 py-3">
      <TopicRow
        topicId={subcategory.topic_id}
        name={subcategory.name}
        editable={editable}
        renamePending={pendingTopicId === subcategory.topic_id}
        deletePending={pendingTopicId === subcategory.topic_id}
        onRename={(name) => onRename(subcategory.topic_id, name)}
        onDelete={() => onDelete(subcategory.topic_id)}
      >
        {subcategory.seed_keyword ? (
          <span className="shrink-0 rounded-full border border-[#E6E8F5] px-2 py-0.5 text-[10px] text-neutral-500">
            {subcategory.seed_keyword}
          </span>
        ) : null}
      </TopicRow>

      <div className="ml-3 border-l border-[#E6E8F5] pl-3">
        {subcategory.specifics.map((specific) => (
          <SpecificRow
            key={specific.topic_id}
            specific={specific}
            editable={editable}
            isRenaming={pendingTopicId === specific.topic_id}
            isDeleting={pendingTopicId === specific.topic_id}
            onRename={onRename}
            onDelete={onDelete}
          />
        ))}

        {editable && !adding ? (
          <button
            type="button"
            onClick={() => setAdding(true)}
            disabled={atLimit}
            className="mt-1 flex items-center gap-1.5 py-1 text-[12px] font-medium text-[#5B57E6] hover:text-[#4A46D0] disabled:cursor-not-allowed disabled:text-neutral-300"
          >
            <Plus className="size-3.5" />
            {atLimit ? "Limit reached" : "Add specific topic"}
          </button>
        ) : null}

        {adding ? (
          <AddTopicForm
            placeholder="Specific topic name"
            isPending={pendingTopicId === "new"}
            onCancel={() => setAdding(false)}
            onAdd={(name) => {
              onAddSpecific(subcategory.topic_id, name);
              setAdding(false);
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

function PillarBlock({
  pillar,
  editable,
  limits,
  onRename,
  onDelete,
  onAddSubcategory,
  onAddSpecific,
  pendingTopicId,
}: {
  pillar: Pillar;
  editable: boolean;
  limits: { maxSubcategoriesPerPillar: number; maxSpecificsPerSubcategory: number };
  onRename: (topicId: string, name: string) => void;
  onDelete: (topicId: string) => void;
  onAddSubcategory: (parentId: string, name: string, seedKeyword?: string) => void;
  onAddSpecific: (parentId: string, name: string) => void;
  pendingTopicId: string | null;
}) {
  const [adding, setAdding] = useState(false);
  const atLimit = pillar.subcategories.length >= limits.maxSubcategoriesPerPillar;

  return (
    <div className="rounded-2xl border border-[#E6E8F5] bg-white p-4">
      <div className="mb-2 flex items-center gap-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-[#ECEBFF] text-[#5B57E6]">
          <Layers3 className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <TopicRow
            topicId={pillar.topic_id}
            name={pillar.name}
            editable={editable}
            renamePending={pendingTopicId === pillar.topic_id}
            deletePending={pendingTopicId === pillar.topic_id}
            onRename={(name) => onRename(pillar.topic_id, name)}
            onDelete={() => onDelete(pillar.topic_id)}
          />
        </div>
      </div>

      {pillar.services.length ? (
        <div className="mb-3 ml-[42px] flex flex-wrap gap-1.5">
          {pillar.services.map((service) => (
            <span key={service} className="rounded-full border border-[#E6E8F5] px-2.5 py-1 text-[11px] text-neutral-600">
              {service}
            </span>
          ))}
        </div>
      ) : null}

      <div className="ml-[42px] space-y-2">
        {pillar.subcategories.map((subcategory) => (
          <SubcategoryBlock
            key={subcategory.topic_id}
            subcategory={subcategory}
            editable={editable}
            limits={{ maxSpecificsPerSubcategory: limits.maxSpecificsPerSubcategory }}
            pendingTopicId={pendingTopicId}
            onRename={onRename}
            onDelete={onDelete}
            onAddSpecific={onAddSpecific}
          />
        ))}

        {editable && !adding ? (
          <button
            type="button"
            onClick={() => setAdding(true)}
            disabled={atLimit}
            className="flex items-center gap-1.5 py-1 text-[12px] font-medium text-[#5B57E6] hover:text-[#4A46D0] disabled:cursor-not-allowed disabled:text-neutral-300"
          >
            <Plus className="size-3.5" />
            {atLimit ? "Limit reached" : "Add subcategory"}
          </button>
        ) : null}

        {adding ? (
          <AddTopicForm
            placeholder="Subcategory name"
            withSeedKeyword
            isPending={pendingTopicId === "new"}
            onCancel={() => setAdding(false)}
            onAdd={(name, seedKeyword) => {
              onAddSubcategory(pillar.topic_id, name, seedKeyword);
              setAdding(false);
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

export default function TopicalMapSection({ dnaReady }: { dnaReady: boolean }) {
  const { data, isLoading } = TopicalMapQuery(dnaReady);
  const addTopic = AddTopicMutation();
  const updateTopic = UpdateTopicMutation();
  const deleteTopic = DeleteTopicMutation();
  const approve = ApproveTopicalMapMutation();
  const retry = RetryTopicalMapMutation();
  const [addingPillar, setAddingPillar] = useState(false);
  const [pendingTopicId, setPendingTopicId] = useState<string | null>(null);

  if (!dnaReady || isLoading || !data || data.status === "not_started") return null;

  const editable = data.status === "review";

  const handleAdd = (parentId: string | null, name: string, seedKeyword?: string) => {
    setPendingTopicId("new");
    addTopic.mutate(
      { parent_id: parentId, name, seed_keyword: seedKeyword },
      { onSettled: () => setPendingTopicId(null) },
    );
  };

  const handleRename = (topicId: string, name: string) => {
    setPendingTopicId(topicId);
    updateTopic.mutate({ topicId, data: { name } }, { onSettled: () => setPendingTopicId(null) });
  };

  const handleDelete = (topicId: string) => {
    setPendingTopicId(topicId);
    deleteTopic.mutate(topicId, { onSettled: () => setPendingTopicId(null) });
  };

  const handleApprove = () => {
    if (data.counts.subcategories === 0) {
      toast.error("Add at least one subcategory before approving.");
      return;
    }
    approve.mutate();
  };

  if (data.status === "generating") {
    return (
      <SectionShell>
        <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
          <Loader2 className="size-7 animate-spin text-[#5B57E6]" />
          <p className="text-sm font-medium text-neutral-700">Building your topical map…</p>
          <p className="max-w-sm text-xs text-neutral-500">
            We&apos;re turning your brand DNA into a full content map of pillars, subcategories and
            topics. This usually takes a minute.
          </p>
        </div>
      </SectionShell>
    );
  }

  if (data.status === "failed") {
    return (
      <SectionShell>
        <div className="flex flex-col items-start gap-3 py-4">
          <h3 className="flex items-center gap-2 text-[15px] font-semibold text-neutral-900">
            <TriangleAlert className="size-4 text-rose-500" />
            The topical map couldn&apos;t be built
          </h3>
          <p className="text-[13px] text-rose-600">{data.error || "Something went wrong."}</p>
          <button
            type="button"
            onClick={() => retry.mutate()}
            disabled={retry.isPending}
            className="h-9 rounded-full bg-[#5B57E6] px-5 text-[13px] font-semibold text-white hover:bg-[#4A46D0] disabled:opacity-60"
          >
            {retry.isPending ? "Retrying…" : "Try again"}
          </button>
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full bg-neutral-100 text-neutral-700">
            <Sparkles className="size-4" />
          </span>
          <div>
            <h3 className="text-[15px] font-semibold text-neutral-900">Topical Map</h3>
            <p className="text-[12px] text-neutral-500">
              {data.counts.pillars} pillars · {data.counts.subcategories} subcategories ·{" "}
              {data.counts.specifics} specific topics
            </p>
          </div>
        </div>

        {data.status === "approved" ? (
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[12px] font-medium text-emerald-700 ring-1 ring-emerald-200">
            <Lock className="size-3.5" />
            Approved
          </span>
        ) : (
          <button
            type="button"
            onClick={handleApprove}
            disabled={approve.isPending}
            className="h-9 rounded-full bg-[#5B57E6] px-5 text-[13px] font-semibold text-white hover:bg-[#4A46D0] disabled:opacity-60"
          >
            {approve.isPending ? "Approving…" : "Approve topical map"}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {data.pillars.map((pillar) => (
          <PillarBlock
            key={pillar.topic_id}
            pillar={pillar}
            editable={editable}
            limits={{
              maxSubcategoriesPerPillar: data.limits.max_subcategories_per_pillar,
              maxSpecificsPerSubcategory: data.limits.max_specifics_per_subcategory,
            }}
            pendingTopicId={pendingTopicId}
            onRename={handleRename}
            onDelete={handleDelete}
            onAddSubcategory={(parentId, name, seedKeyword) => handleAdd(parentId, name, seedKeyword)}
            onAddSpecific={(parentId, name) => handleAdd(parentId, name)}
          />
        ))}
      </div>

      {editable ? (
        <div className="mt-3">
          {addingPillar ? (
            <AddTopicForm
              placeholder="Pillar name"
              isPending={pendingTopicId === "new"}
              onCancel={() => setAddingPillar(false)}
              onAdd={(name) => {
                handleAdd(null, name);
                setAddingPillar(false);
              }}
            />
          ) : (
            <button
              type="button"
              onClick={() => setAddingPillar(true)}
              disabled={data.counts.pillars >= data.limits.max_pillars}
              className="flex items-center gap-1.5 rounded-full border border-dashed border-[#E6E8F5] px-4 py-2 text-[13px] font-medium text-[#5B57E6] hover:bg-[#F6F7FD] disabled:cursor-not-allowed disabled:text-neutral-300"
            >
              <Plus className="size-4" />
              {data.counts.pillars >= data.limits.max_pillars ? "Pillar limit reached" : "Add pillar"}
            </button>
          )}
        </div>
      ) : null}
    </SectionShell>
  );
}
