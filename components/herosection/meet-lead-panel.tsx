"use client";

import { X } from "lucide-react";
import { BrandButton } from "@/components/ui/brand-button";
import type { OfficeTeam } from "./office-data";

interface MeetLeadPanelProps {
  team: OfficeTeam;
  onClose: () => void;
}

export function MeetLeadPanel({ team, onClose }: MeetLeadPanelProps) {
  return (
    <aside
      className="pointer-events-auto absolute bottom-20 right-4 z-50 w-[min(100%-2rem,340px)] overflow-hidden rounded-2xl border border-[#E6E8F5] bg-white/95 shadow-[0_16px_48px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:bottom-24 sm:right-6"
      role="dialog"
      aria-label={`Meet ${team.leadName}`}
    >
      <div className="h-1.5 w-full" style={{ backgroundColor: team.color }} />
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={team.leadImage}
            alt={team.leadName}
            width={64}
            height={64}
            className="size-16 shrink-0 rounded-xl object-cover ring-2 ring-[#E6E8F5]"
            style={{ backgroundColor: team.color }}
          />
          <div className="min-w-0 flex-1">
            <p
              className="text-[11px] font-bold uppercase tracking-wider"
              style={{ color: team.color }}
            >
              ★ {team.leadTitle}
            </p>
            <h2 className="font-display text-xl font-semibold text-neutral-900">
              {team.leadName}
            </h2>
            <p className="text-sm text-neutral-500">{team.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-neutral-400 transition hover:bg-[#F6F7FD] hover:text-neutral-700"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-neutral-600">
          {team.pitch}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {team.stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl bg-[#F6F7FD] px-3 py-2 ring-1 ring-[#E6E8F5]"
            >
              <p className="text-[10px] uppercase tracking-wide text-neutral-400">
                {s.label}
              </p>
              <p className="text-sm font-semibold text-neutral-900">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-[#F6F7FD] px-3 py-2.5 ring-1 ring-[#E6E8F5]">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
            Team on this floor
          </p>
          <p className="mt-1 text-xs text-neutral-700">
            {team.members.map((m) => m.role).join(" · ")}
          </p>
        </div>

        <div className="mt-3 rounded-xl border border-dashed border-[#D8D6F5] bg-[#F8F7FF] px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5B57E6]">
            Hands off
          </p>
          <p className="mt-1 text-xs font-medium text-neutral-800">{team.handoff}</p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <BrandButton href={team.agentHref} className="flex-1">
            Meet {team.leadName}
          </BrandButton>
          <BrandButton href="/signup" variant="outline">
            Get started
          </BrandButton>
        </div>
      </div>
    </aside>
  );
}
