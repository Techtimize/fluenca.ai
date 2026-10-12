"use client";

import { Html } from "@react-three/drei";
import { DepartmentFloor } from "./floor";
import { Desk } from "./desk";
import { Worker } from "./worker";
import type { OfficeTeam } from "./office-data";

interface TeamOfficeProps {
  team: OfficeTeam;
  active?: boolean;
  completing?: boolean;
  selected?: boolean;
  tourFocus?: boolean;
  /** Hide floating Html so it doesn’t cover the meet panel */
  hideLabels?: boolean;
  onSelect?: (teamId: OfficeTeam["id"]) => void;
}

const SHIRT_COLORS = ["#F472B6", "#60A5FA", "#34D399", "#FBBF24", "#A78BFA"];

export function TeamOffice({
  team,
  active = false,
  completing = false,
  selected = false,
  tourFocus = false,
  hideLabels = false,
  onSelect,
}: TeamOfficeProps) {
  const [w, d] = team.size;
  const highlighted = active || completing || selected || tourFocus;

  return (
    <group position={team.position}>
      {/* Invisible click hit area */}
      <mesh
        position={[0, 0.4, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(team.id);
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <boxGeometry args={[w + 0.4, 2.4, d + 0.4]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <DepartmentFloor
        width={w}
        depth={d}
        color={team.floorColor}
        accent={team.accent}
      />

      {highlighted && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry
            args={[Math.min(w, d) * 0.4, Math.min(w, d) * 0.52, 48]}
          />
          <meshBasicMaterial
            color={
              selected || tourFocus
                ? "#FFFFFF"
                : completing
                  ? "#F97316"
                  : team.accent
            }
            transparent
            opacity={selected || tourFocus ? 0.75 : 0.55}
          />
        </mesh>
      )}

      {team.members.map((member, i) => {
        const [dx, dz] = member.desk;
        const deskPos: [number, number, number] = [dx, 0.14, dz];
        return (
          <group key={member.id}>
            <Desk position={deskPos} working phase={i * 1.3} />
            <Worker
              position={[dx, 0.14, dz + 0.28]}
              role={member.role}
              shirtColor={SHIRT_COLORS[i % SHIRT_COLORS.length]}
              phase={i * 1.7}
              hideLabel={hideLabels}
            />
          </group>
        );
      })}

      {!hideLabels && (
        <Html
          position={[0, 2.85, -d * 0.28]}
          center
          distanceFactor={team.id === "intake" ? 11 : 13}
          zIndexRange={[40, 0]}
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          <div className="flex flex-col items-center">
            <div className="relative mb-1 flex flex-col items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={team.leadImage}
                alt={`${team.leadName} lead`}
                width={72}
                height={72}
                className={`size-[72px] rounded-2xl object-cover shadow-lg ring-2 ${
                  selected || tourFocus ? "ring-[#5B57E6]" : "ring-white"
                }`}
                style={{ backgroundColor: team.color }}
              />
              <span
                className="mt-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide text-white shadow"
                style={{ backgroundColor: team.color }}
              >
                ★ {team.leadTitle.toUpperCase()}
              </span>
              <span className="mt-0.5 rounded-md bg-white px-1.5 py-px text-[10px] font-semibold text-neutral-800 shadow-sm ring-1 ring-[#E6E8F5]">
                {team.leadName}
              </span>
            </div>

            <div
              className={`min-w-[160px] rounded-xl border px-3 py-2 shadow-xl backdrop-blur-md ${
                selected || tourFocus
                  ? "border-[#5B57E6] bg-white/95"
                  : active
                    ? "border-[#C8C6F5] bg-white/95"
                    : "border-[#E6E8F5] bg-white/90"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-block size-2 rounded-full"
                  style={{ backgroundColor: team.color }}
                />
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-900">
                  {team.name}
                </p>
              </div>
              <p className="mt-1 text-[10px] text-neutral-500">
                {team.members.length + 1} agents · lead {team.leadName}
              </p>
              <div className="mt-2 space-y-0.5">
                {team.stats.map((s) => (
                  <div
                    key={s.label}
                    className="flex justify-between gap-3 text-[10px] text-neutral-700"
                  >
                    <span className="text-neutral-400">{s.label}</span>
                    <span className="font-semibold text-neutral-900">
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
              {tourFocus && (
                <p className="mt-2 text-[10px] font-semibold text-[#5B57E6]">
                  Now introducing {team.leadName}
                </p>
              )}
              {completing && !selected && !tourFocus && (
                <p className="mt-2 text-[10px] font-semibold text-amber-600">
                  Task complete → handing off
                </p>
              )}
              {active && !completing && !selected && !tourFocus && (
                <p className="mt-2 text-[10px] font-semibold text-emerald-600">
                  Team working…
                </p>
              )}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
