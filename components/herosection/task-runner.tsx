"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import {
  getTeam,
  TASK_TRANSFERS,
  type TaskTransfer,
  type TeamId,
} from "./office-data";

const WALK_DURATION = 3.4;
const WORK_DURATION = 2.2;
const COMPLETE_FLASH = 0.7;
const CYCLE = WORK_DURATION + COMPLETE_FLASH + WALK_DURATION;

type Phase = "working" | "walking" | "complete";

export interface TransferState {
  transfer: TaskTransfer;
  phase: Phase;
  from: TeamId;
  to: TeamId;
}

interface TaskRunnerFleetProps {
  onStatesChange?: (states: TransferState[]) => void;
}

function teamAnchor(id: TeamId): THREE.Vector3 {
  const t = getTeam(id);
  return new THREE.Vector3(t.position[0], 0.35, t.position[2]);
}

function buildPath(fromId: TeamId, toId: TeamId, lane: number) {
  const from = teamAnchor(fromId);
  const to = teamAnchor(toId);
  const mid = from.clone().lerp(to, 0.5);
  mid.y = 0.55 + lane * 0.12;
  const side = new THREE.Vector3()
    .subVectors(to, from)
    .cross(new THREE.Vector3(0, 1, 0));
  if (side.lengthSq() > 0.001) {
    side.normalize().multiplyScalar(1.1 + lane * 0.55);
    mid.add(side);
  }
  return new THREE.CatmullRomCurve3([from, mid, to]);
}

interface SingleRunnerProps {
  transfer: TaskTransfer;
  /** Stagger so runners aren't in sync */
  timeOffset: number;
  lane: number;
  onPhaseChange: (state: TransferState) => void;
}

function SingleRunner({
  transfer,
  timeOffset,
  lane,
  onPhaseChange,
}: SingleRunnerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bobRef = useRef<THREE.Group>(null);
  const lastPhase = useRef<Phase | null>(null);
  const onPhaseChangeRef = useRef(onPhaseChange);
  onPhaseChangeRef.current = onPhaseChange;

  const path = useMemo(
    () => buildPath(transfer.from, transfer.to, lane),
    [transfer.from, transfer.to, lane],
  );

  useFrame(({ clock }) => {
    const t = (clock.elapsedTime + timeOffset) % CYCLE;
    let phase: Phase;
    let walkU = 0;

    if (t < WORK_DURATION) {
      phase = "working";
    } else if (t < WORK_DURATION + COMPLETE_FLASH) {
      phase = "complete";
    } else {
      phase = "walking";
      walkU = (t - WORK_DURATION - COMPLETE_FLASH) / WALK_DURATION;
    }

    if (phase !== lastPhase.current) {
      lastPhase.current = phase;
      onPhaseChangeRef.current({
        transfer,
        phase,
        from: transfer.from,
        to: transfer.to,
      });
    }

    if (!groupRef.current) return;

    if (phase === "walking") {
      const u = Math.min(Math.max(walkU, 0), 1);
      const ease = u * u * (3 - 2 * u);
      const pos = path.getPoint(ease);
      const tangent = path.getTangent(ease);
      groupRef.current.visible = true;
      groupRef.current.position.copy(pos);
      groupRef.current.lookAt(pos.clone().add(tangent));
      if (bobRef.current) {
        bobRef.current.position.y = Math.abs(Math.sin(u * Math.PI * 8)) * 0.08;
      }
    } else {
      groupRef.current.visible = false;
      groupRef.current.position.copy(teamAnchor(transfer.from));
    }
  });

  const fromColor = getTeam(transfer.from).color;

  return (
    <group ref={groupRef} visible={false}>
      <group ref={bobRef}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <capsuleGeometry args={[0.11, 0.26, 6, 12]} />
          <meshStandardMaterial color="#1E1B4B" />
        </mesh>
        <mesh position={[0, 0.66, 0]} castShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color={fromColor}
            emissive={fromColor}
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh position={[0.2, 0.42, 0]} castShadow>
          <boxGeometry args={[0.16, 0.12, 0.05]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#E0E7FF"
            emissiveIntensity={0.4}
          />
        </mesh>
      </group>

      <Html
        position={[0, 1.05, 0]}
        center
        distanceFactor={15}
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        <div
          className="whitespace-nowrap rounded-lg px-2 py-0.5 text-[9px] font-semibold text-white shadow-lg"
          style={{ backgroundColor: fromColor }}
        >
          {transfer.task}
        </div>
      </Html>
    </group>
  );
}

/** Extra runners on the busiest hops so several people move at once */
const EXTRA_RUNNERS: { transferId: string; lane: number; offset: number }[] = [
  { transferId: "t1", lane: 1, offset: CYCLE * 0.35 },
  { transferId: "t3", lane: 1, offset: CYCLE * 0.45 },
  { transferId: "t4", lane: 1, offset: CYCLE * 0.55 },
  { transferId: "t5", lane: 1, offset: CYCLE * 0.25 },
];

/** Fleet of couriers — one per pipeline edge, plus extras on busy routes */
export function TaskRunner({ onStatesChange }: TaskRunnerFleetProps) {
  const statesRef = useRef<Map<string, TransferState>>(new Map());

  const publish = useMemo(() => {
    return (key: string, state: TransferState) => {
      statesRef.current.set(key, state);
      onStatesChange?.(Array.from(statesRef.current.values()));
    };
  }, [onStatesChange]);

  const runners = useMemo(() => {
    const primary = TASK_TRANSFERS.map((transfer, i) => ({
      key: `primary-${transfer.id}`,
      transfer,
      timeOffset: (i * CYCLE) / TASK_TRANSFERS.length,
      lane: 0,
    }));

    const extras = EXTRA_RUNNERS.flatMap((extra, i) => {
      const transfer = TASK_TRANSFERS.find((t) => t.id === extra.transferId);
      if (!transfer) return [];
      return [
        {
          key: `extra-${extra.transferId}-${i}`,
          transfer,
          timeOffset: extra.offset + i * 0.4,
          lane: extra.lane,
        },
      ];
    });

    return [...primary, ...extras];
  }, []);

  return (
    <group>
      {runners.map((r) => (
        <SingleRunner
          key={r.key}
          transfer={r.transfer}
          timeOffset={r.timeOffset}
          lane={r.lane}
          onPhaseChange={(state) => publish(r.key, state)}
        />
      ))}
    </group>
  );
}
