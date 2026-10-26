"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UpdateProspectIcpMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { ICP_NICHE_TYPES, type Icp, type IcpNicheType } from "@/types/bussiness/prospect-type";
import { FOCUS_RING } from "@/utils/ui-classes";
import { fromList, PRIMARY_BUTTON, SECONDARY_BUTTON, toList } from "./prospect-ui";

const INPUT =
  "h-10 w-full rounded-xl border border-[#E6E8F5] bg-white px-3 text-[13px] text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-[#5B57E6] focus:ring-2 focus:ring-[#5B57E6]/20";

/** The list fields, edited as comma-separated text. */
const LIST_FIELDS = [
  { key: "industries", label: "Industries", placeholder: "banking, fintech" },
  { key: "countries", label: "Countries", placeholder: "GB, AE" },
  { key: "cities", label: "Cities", placeholder: "London, Dubai" },
  { key: "employee_range", label: "Company size", placeholder: "51-200, 201-500" },
  { key: "keywords", label: "Keywords", placeholder: "compliance, governance" },
  { key: "titles", label: "Job titles", placeholder: "head of compliance" },
  { key: "seniority", label: "Seniority", placeholder: "director, vp" },
  { key: "signals", label: "Buying signals", placeholder: "hiring compliance roles" },
  { key: "exclude_domains", label: "Exclude domains", placeholder: "client.com" },
] as const;

type ListKey = (typeof LIST_FIELDS)[number]["key"];

function listsFromIcp(icp: Icp): Record<ListKey, string> {
  return {
    industries: fromList(icp.company.industries),
    countries: fromList(icp.company.countries),
    cities: fromList(icp.company.cities),
    employee_range: fromList(icp.company.employee_range),
    keywords: fromList(icp.company.keywords),
    titles: fromList(icp.people.titles),
    seniority: fromList(icp.people.seniority),
    signals: fromList(icp.signals),
    exclude_domains: fromList(icp.exclude_domains),
  };
}

function applyLists(icp: Icp, lists: Record<ListKey, string>): Icp {
  return {
    ...icp,
    company: {
      ...icp.company,
      industries: toList(lists.industries),
      countries: toList(lists.countries),
      cities: toList(lists.cities),
      employee_range: toList(lists.employee_range),
      keywords: toList(lists.keywords),
    },
    people: { titles: toList(lists.titles), seniority: toList(lists.seniority) },
    signals: toList(lists.signals),
    exclude_domains: toList(lists.exclude_domains),
  };
}

type Props = {
  icps: Icp[];
  /** Index of the profile being edited, or null when the dialog is closed. */
  index: number | null;
  onClose: () => void;
};

export default function IcpEditDialog({ icps, index, onClose }: Props) {
  const icp = index === null ? null : icps[index];
  return (
    <Dialog open={Boolean(icp)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit customer profile</DialogTitle>
          <DialogDescription>Saving creates a new version. Separate list items with commas.</DialogDescription>
        </DialogHeader>
        {/* Keyed so the form resets when another profile is opened */}
        {icp && index !== null ? <IcpForm key={index} icps={icps} index={index} onDone={onClose} /> : null}
      </DialogContent>
    </Dialog>
  );
}

function IcpForm({ icps, index, onDone }: { icps: Icp[]; index: number; onDone: () => void }) {
  const icp = icps[index];
  const [summary, setSummary] = useState(icp.summary);
  const [why, setWhy] = useState(icp.why);
  const [nicheType, setNicheType] = useState<IcpNicheType>(icp.niche_type);
  const [lists, setLists] = useState(() => listsFromIcp(icp));
  const updateIcp = UpdateProspectIcpMutation();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const edited = applyLists({ ...icp, summary: summary.trim(), why: why.trim(), niche_type: nicheType }, lists);
    const next = icps.map((item, i) => (i === index ? edited : item));
    updateIcp.mutate({ icps: next }, { onSuccess: onDone });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-[12px] font-medium text-neutral-700">Summary</span>
        <input required value={summary} onChange={(e) => setSummary(e.target.value)} className={INPUT} />
      </label>
      <label className="block space-y-1.5">
        <span className="text-[12px] font-medium text-neutral-700">Why they need you</span>
        <textarea
          value={why}
          onChange={(e) => setWhy(e.target.value)}
          rows={2}
          className={`${INPUT} h-auto py-2`}
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-[12px] font-medium text-neutral-700">Type</span>
        <select value={nicheType} onChange={(e) => setNicheType(e.target.value as IcpNicheType)} className={INPUT}>
          {ICP_NICHE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type.toUpperCase()}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        {LIST_FIELDS.map(({ key, label, placeholder }) => (
          <label key={key} className="block space-y-1.5">
            <span className="text-[12px] font-medium text-neutral-700">{label}</span>
            <input
              value={lists[key]}
              onChange={(e) => setLists((prev) => ({ ...prev, [key]: e.target.value }))}
              placeholder={placeholder}
              className={INPUT}
            />
          </label>
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onDone} className={`${SECONDARY_BUTTON} ${FOCUS_RING}`}>
          Cancel
        </button>
        <button type="submit" disabled={updateIcp.isPending || !summary.trim()} className={`${PRIMARY_BUTTON} ${FOCUS_RING}`}>
          {updateIcp.isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
          Save profile
        </button>
      </div>
    </form>
  );
}
