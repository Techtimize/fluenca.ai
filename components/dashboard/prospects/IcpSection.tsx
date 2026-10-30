"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Pencil, RotateCw, Search, Sparkles, Users } from "lucide-react";
import { getApiErrorMessage, isApiNotFoundError } from "@/errors/error-utils";
import { BuildProspectIcpMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { ProspectIcpQuery } from "@/routes/bussiness/Bussiness-Query";
import type { BuildIcpRequest, Icp } from "@/types/bussiness/prospect-type";
import { FOCUS_RING } from "@/utils/ui-classes";
import IcpEditDialog from "./IcpEditDialog";
import SectionHeader from "./SectionHeader";
import { BADGE, CARD, PRIMARY_BUTTON, SECONDARY_BUTTON } from "./prospect-ui";

type Props = {
  /** Starts a search for a profile. */
  onFind: (icpId?: string) => void;
  /** True while a search is starting or still running, so only one goes at a time. */
  searchBusy: boolean;
};

/** Step 1: the ideal customer profiles the search uses. */
export default function IcpSection({ onFind, searchBusy }: Props) {
  const icpQuery = ProspectIcpQuery();
  const buildIcp = BuildProspectIcpMutation();
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // A 404 just means no profiles have been built yet.
  const notBuilt = icpQuery.isError && isApiNotFoundError(icpQuery.error);
  const icps = icpQuery.data?.icps ?? [];

  return (
    <section className={`${CARD} p-5 sm:p-6`}>
      <SectionHeader
        step={1}
        title="Ideal customer profiles"
        description="Who you want to reach. Built from your company DNA; edit them any time."
        action={
          icps.length ? (
            <button
              type="button"
              onClick={() => buildIcp.mutate(undefined)}
              disabled={buildIcp.isPending}
              className={`${SECONDARY_BUTTON} ${FOCUS_RING}`}
            >
              {buildIcp.isPending ? <Loader2 className="size-4 animate-spin" /> : <RotateCw className="size-4" />}
              Rebuild
            </button>
          ) : null
        }
      />

      <div className="mt-5">
        {buildIcp.isPending ? (
          <BuildingState />
        ) : icpQuery.isLoading ? (
          <div className="grid gap-3 md:grid-cols-3" aria-busy="true">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-52 animate-pulse rounded-2xl bg-[#F8F9FF]" />
            ))}
          </div>
        ) : icpQuery.isError && !notBuilt ? (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-[13px] text-rose-700">
            {getApiErrorMessage(icpQuery.error, "Could not load your customer profiles")}
          </p>
        ) : icps.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {icps.map((icp, index) => (
              <IcpCard
                key={icp.id ?? index}
                icp={icp}
                onEdit={() => setEditIndex(index)}
                onFind={() => onFind(icp.id)}
                findDisabled={searchBusy}
              />
            ))}
          </div>
        ) : (
          <BuildIcpForm onBuild={(body) => buildIcp.mutate(body)} />
        )}
      </div>

      <IcpEditDialog icps={icps} index={editIndex} onClose={() => setEditIndex(null)} />
    </section>
  );
}

function BuildingState() {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-[radial-gradient(ellipse_at_top,#ECEBFF_0%,#FFFFFF_70%)] px-6 py-10 text-center">
      <Loader2 className="size-6 animate-spin text-[#5B57E6]" aria-hidden="true" />
      <p className="mt-3 text-[14px] font-semibold text-neutral-900">Reading your DNA and building profiles…</p>
      <p className="mt-1 text-[13px] text-neutral-500">This usually takes 10–40 seconds.</p>
    </div>
  );
}

const FORM_INPUT =
  "h-10 w-full rounded-xl border border-[#E6E8F5] bg-white px-3 text-[13px] outline-none placeholder:text-neutral-400 focus:border-[#5B57E6] focus:ring-2 focus:ring-[#5B57E6]/20";

/** Shown before any profile exists. Every field is optional; the DNA fills the gaps. */
function BuildIcpForm({ onBuild }: { onBuild: (body: BuildIcpRequest) => void }) {
  const [niche, setNiche] = useState("");
  const [country, setCountry] = useState("");
  const [goal, setGoal] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onBuild({
      ...(niche.trim() ? { niche: niche.trim() } : {}),
      ...(country.trim() ? { country: country.trim() } : {}),
      ...(goal.trim() ? { goal: goal.trim() } : {}),
    });
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border border-dashed border-[#D9DBF5] bg-[#FAFAFF] p-5">
      <p className="flex items-center gap-2 text-[14px] font-semibold text-neutral-900">
        <Sparkles className="size-4 text-[#5B57E6]" aria-hidden="true" />
        Build your first profiles
      </p>
      <p className="mt-1 text-[13px] text-neutral-500">
        Leave these empty to let Fluenca decide from your DNA, or steer it.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="Niche, e.g. dental clinics" className={FORM_INPUT} />
        <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country, e.g. UAE" className={FORM_INPUT} />
        <input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Goal, e.g. book demos" className={FORM_INPUT} />
      </div>
      <button type="submit" className={`mt-4 ${PRIMARY_BUTTON} ${FOCUS_RING}`}>
        <Sparkles className="size-4" aria-hidden="true" />
        Build profiles
      </button>
    </form>
  );
}

function Chips({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">{label}</p>
      <ul className="mt-1 flex flex-wrap gap-1">
        {items.slice(0, 4).map((item) => (
          <li key={item} className="rounded-full bg-[#F1F2FB] px-2 py-0.5 text-[11px] text-[#3F3D9E]">
            {item}
          </li>
        ))}
        {items.length > 4 ? <li className="px-1 text-[11px] text-neutral-400">+{items.length - 4}</li> : null}
      </ul>
    </div>
  );
}

function IcpCard({
  icp,
  onEdit,
  onFind,
  findDisabled,
}: {
  icp: Icp;
  onEdit: () => void;
  onFind: () => void;
  findDisabled: boolean;
}) {
  return (
    <article className="flex flex-col rounded-2xl border border-[#E6E8F5] bg-[#FCFCFF] p-4">
      <div className="flex items-start justify-between gap-2">
        <span className={`${BADGE} bg-[#EEF0FF] uppercase text-[#4544C9]`}>{icp.niche_type}</span>
        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit profile"
          className={`grid size-7 place-items-center rounded-full text-neutral-500 hover:bg-white hover:text-[#5B57E6] ${FOCUS_RING}`}
        >
          <Pencil className="size-3.5" />
        </button>
      </div>
      <h3 className="mt-2 text-[14px] font-semibold leading-5 text-neutral-900">{icp.summary}</h3>
      {icp.why ? <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-neutral-500">{icp.why}</p> : null}

      <div className="mt-3 space-y-2">
        <Chips label="Industries" items={icp.company.industries} />
        <Chips label="Where" items={[...icp.company.countries, ...icp.company.cities]} />
        <Chips label="People" items={icp.people.titles} />
      </div>

      <div className="mt-auto pt-4">
        <button type="button" onClick={onFind} disabled={findDisabled} className={`${PRIMARY_BUTTON} w-full ${FOCUS_RING}`}>
          {findDisabled ? <Users className="size-4" /> : <Search className="size-4" />}
          {findDisabled ? "Search in progress" : "Find prospects"}
        </button>
      </div>
    </article>
  );
}
