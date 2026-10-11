"use client";

import Link from "next/link";
import { X } from "lucide-react";
import type { OfficeTeam } from "./office-data";

interface MeetLeadPanelProps {
  team: OfficeTeam;
  onClose: () => void;
}

export function MeetLeadPanel({ team, onClose }: MeetLeadPanelProps) {
  return (
    <aside
      className="pointer-events-auto absolute bottom-20 right-4 z-30 w-[min(100%-2rem,340px)] overflow-hidden rounded-2xl border border-white/15 bg-[#12152A]/95 shadow-2xl backdrop-blur-xl sm:bottom-24 sm:right-6"
      role="dialog"
      aria-label={`Meet ${team.leadName}`}
    >
      <div
        className="h-1.5 w-full"
        style={{ backgroundColor: team.color }}
      />
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={team.leadImage}
            alt={team.leadName}
            width={64}
            height={64}
            className="size-16 shrink-0 rounded-xl object-cover ring-2 ring-white/20"
            style={{ backgroundColor: team.color }}
          />
          <div className="min-w-0 flex-1">
            <p
              className="text-[11px] font-bold uppercase tracking-wider"
              style={{ color: team.accent }}
            >
              ★ {team.leadTitle}
            </p>
            <h2 className="font-display text-xl font-semibold text-white">
              {team.leadName}
            </h2>
            <p className="text-sm text-white/60">{team.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-white/80">
          {team.pitch}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {team.stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10"
            >
              <p className="text-[10px] uppercase tracking-wide text-white/45">
                {s.label}
              </p>
              <p className="text-sm font-semibold text-white">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-white/5 px-3 py-2.5 ring-1 ring-white/10">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/45">
            Team on this floor
          </p>
          <p className="mt-1 text-xs text-white/80">
            {team.members.map((m) => m.role).join(" · ")}
          </p>
        </div>

        <div className="mt-3 rounded-xl border border-dashed border-white/20 px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/45">
            Hands off
          </p>
          <p className="mt-1 text-xs font-medium text-white/90">{team.handoff}</p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href={team.agentHref}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-full px-4 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: team.color }}
          >
            Meet {team.leadName}
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-10 items-center justify-center rounded-full border border-white/20 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Get started
          </Link>
        </div>
      </div>
    </aside>
  );
}
