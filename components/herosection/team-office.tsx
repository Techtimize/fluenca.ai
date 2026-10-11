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
  onSelect?: (teamId: OfficeTeam["id"]) => void;
}

const SHIRT_COLORS = ["#F472B6", "#60A5FA", "#34D399", "#FBBF24", "#A78BFA"];

export function TeamOffice({
  team,
  active = false,
  completing = false,
  selected = false,
  tourFocus = false,
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
            />
          </group>
        );
      })}

      <Html
        position={[0, 2.6, -d * 0.35]}
        center
        distanceFactor={16}
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
                selected || tourFocus ? "ring-white" : "ring-white/80"
              }`}
              style={{ backgroundColor: team.color }}
            />
            <span
              className="mt-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide text-white shadow"
              style={{ backgroundColor: team.color }}
            >
              ★ {team.leadTitle.toUpperCase()}
            </span>
            <span className="mt-0.5 rounded-md bg-zinc-900/90 px-1.5 py-px text-[10px] font-semibold text-white">
              {team.leadName}
            </span>
          </div>

          <div
            className={`min-w-[160px] rounded-xl border px-3 py-2 shadow-xl backdrop-blur-md ${
              selected || tourFocus
                ? "border-white/60 bg-zinc-900/95"
                : active
                  ? "border-white/40 bg-zinc-900/90"
                  : "border-white/10 bg-zinc-900/75"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className="inline-block size-2 rounded-full"
                style={{ backgroundColor: team.color }}
              />
              <p className="text-[11px] font-bold uppercase tracking-wider text-white">
                {team.name}
              </p>
            </div>
            <p className="mt-1 text-[10px] text-white/70">
              {team.members.length + 1} agents · lead {team.leadName}
            </p>
            <div className="mt-2 space-y-0.5">
              {team.stats.map((s) => (
                <div
                  key={s.label}
                  className="flex justify-between gap-3 text-[10px] text-white/85"
                >
                  <span className="text-white/50">{s.label}</span>
                  <span className="font-semibold">{s.value}</span>
                </div>
              ))}
            </div>
            {tourFocus && (
              <p className="mt-2 text-[10px] font-semibold text-white">
                Now introducing {team.leadName}
              </p>
            )}
            {completing && !selected && !tourFocus && (
              <p className="mt-2 text-[10px] font-semibold text-orange-300">
                Task complete → handing off
              </p>
            )}
            {active && !completing && !selected && !tourFocus && (
              <p className="mt-2 text-[10px] font-semibold text-emerald-300">
                Team working…
              </p>
            )}
          </div>
        </div>
      </Html>
    </group>
  );
}
