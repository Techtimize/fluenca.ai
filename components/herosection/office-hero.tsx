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
      <div className="flex h-full min-h-[50vh] w-full items-center justify-center bg-[#0B0D1A]">
        <div className="size-10 animate-spin rounded-full border-2 border-[#5452F6] border-t-transparent" />
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

  const startTour = useCallback(() => {
    setSelectedId(null);
    setTourIndex(0);
    setTouring(true);
  }, []);

  const stopTour = useCallback(() => {
    setTouring(false);
    setTourIndex(0);
  }, []);

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
  const liveLine = touring
    ? TOUR_LINES[TOUR_ORDER[Math.min(tourIndex, TOUR_ORDER.length - 1)]]
    : handoff
      ? `${getTeam(handoff.from).leadName} → ${getTeam(handoff.to).leadName}: ${handoff.transfer.task}`
      : "Click a floor to meet the lead";

  return (
    <section className="relative h-full min-h-full w-full overflow-hidden bg-[#0B0D1A]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(84,82,246,0.12)_0%,rgba(11,13,26,0.4)_50%,#05060F_100%)]"
      />

      <div className="absolute inset-0 h-full w-full">
        <Suspense fallback={null}>
          <OfficeCanvas
            selectedTeamId={selectedId}
            tourFocusId={tourFocusId}
            autoRotate={!touring && !selectedId}
            onSelectTeam={handleSelect}
            onTransferChange={setHandoff}
          />
        </Suspense>
      </div>

      {/* Bottom controls only — no top overlay on floors */}
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
                          ? "bg-white/10 text-white/70"
                          : "bg-white/5 text-white/35"
                    }`}
                    style={on ? { backgroundColor: t.color } : undefined}
                  >
                    {t.leadName}
                  </span>
                );
              })}
            </div>
          )}
     </div>
      </div>

      {selectedTeam && !touring && (
        <MeetLeadPanel
          team={selectedTeam}
          onClose={() => setSelectedId(null)}
        />
      )}

      {touring && tourTeam && (
        <div className="pointer-events-none absolute bottom-20 left-4 z-30 max-w-sm rounded-2xl border border-white/15 bg-[#12152A]/92 p-4 shadow-2xl backdrop-blur-xl sm:left-6 sm:bottom-24">
          <p
            className="text-[11px] font-bold uppercase tracking-wider"
            style={{ color: tourTeam.accent }}
          >
            Step {tourIndex + 1} / {TOUR_ORDER.length} · {tourTeam.leadTitle}
          </p>
          <p className="mt-1 font-display text-lg font-semibold text-white">
            {tourTeam.leadName}
          </p>
          <p className="mt-1 text-sm text-white/75">{TOUR_LINES[tourTeam.id]}</p>
        </div>
      )}
    </section>
  );
}
