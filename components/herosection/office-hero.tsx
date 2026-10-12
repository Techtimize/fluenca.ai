"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MeetLeadPanel } from "./meet-lead-panel";
import {
  getTeam,
  TOUR_LINES,
  TOUR_ORDER,
  type TeamId,
} from "./office-data";
import type { TransferState } from "./task-runner";

const OfficeCanvas = dynamic(
  () => import("./office-canvas").then((m) => m.OfficeCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[50vh] w-full items-center justify-center bg-white">
        <div className="size-10 animate-spin rounded-full border-2 border-[#5B57E6] border-t-transparent" />
      </div>
    ),
  },
);

const TOUR_STEP_MS = 3200;

export function OfficeHero() {
  const [selectedId, setSelectedId] = useState<TeamId | null>(null);
  const [touring, setTouring] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const [handoff, setHandoff] = useState<TransferState | null>(null);

  const tourFocusId = touring ? TOUR_ORDER[tourIndex] : null;
  const selectedTeam = selectedId ? getTeam(selectedId) : null;

  const handleSelect = useCallback(
    (id: TeamId | null) => {
      if (touring) setTouring(false);
      setSelectedId(id);
    },
    [touring],
  );

  useEffect(() => {
    if (!touring) return;
    if (tourIndex >= TOUR_ORDER.length) {
      setTouring(false);
      setTourIndex(0);
      setSelectedId(null);
      return;
    }
    setSelectedId(TOUR_ORDER[tourIndex]);
    const t = window.setTimeout(() => {
      setTourIndex((i) => i + 1);
    }, TOUR_STEP_MS);
    return () => window.clearTimeout(t);
  }, [touring, tourIndex]);

  const tourTeam = tourFocusId ? getTeam(tourFocusId) : null;

  return (
    <section className="relative h-full min-h-full w-full overflow-hidden bg-white">
      <div className="absolute inset-0 h-full w-full">
        <Suspense fallback={null}>
          <OfficeCanvas
            selectedTeamId={selectedId}
            tourFocusId={tourFocusId}
            suppressLabels={!!selectedTeam && !touring}
            autoRotate={false}
            onSelectTeam={handleSelect}
            onTransferChange={setHandoff}
          />
        </Suspense>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center px-4">
        <div className="flex max-w-2xl flex-col items-center gap-2">
          {touring && tourTeam && (
            <div className="flex flex-wrap justify-center gap-1.5">
              {TOUR_ORDER.map((id, i) => {
                const t = getTeam(id);
                const on = i === tourIndex;
                const done = i < tourIndex;
                return (
                  <span
                    key={id}
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      on
                        ? "text-white"
                        : done
                          ? "bg-[#ECEBFF] text-[#5B57E6]"
                          : "bg-white text-neutral-400 ring-1 ring-[#E6E8F5]"
                    }`}
                    style={on ? { backgroundColor: t.color } : undefined}
                  >
                    {t.leadName}
                  </span>
                );
              })}
            </div>
          )}
          {handoff && !touring ? (
            <p className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-neutral-600 shadow-sm ring-1 ring-[#E6E8F5]">
              {getTeam(handoff.from).leadName} → {getTeam(handoff.to).leadName}:{" "}
              {handoff.transfer.task}
            </p>
          ) : null}
        </div>
      </div>

      {selectedTeam && !touring && (
        <MeetLeadPanel
          team={selectedTeam}
          onClose={() => setSelectedId(null)}
        />
      )}

      {touring && tourTeam && (
        <div className="pointer-events-none absolute bottom-20 left-4 z-30 max-w-sm rounded-2xl border border-[#E6E8F5] bg-white/95 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:bottom-24 sm:left-6">
          <p
            className="text-[11px] font-bold uppercase tracking-wider"
            style={{ color: tourTeam.color }}
          >
            Step {tourIndex + 1} / {TOUR_ORDER.length} · {tourTeam.leadTitle}
          </p>
          <p className="mt-1 font-display text-lg font-semibold text-neutral-900">
            {tourTeam.leadName}
          </p>
          <p className="mt-1 text-sm text-neutral-600">
            {TOUR_LINES[tourTeam.id]}
          </p>
        </div>
      )}
    </section>
  );
}
