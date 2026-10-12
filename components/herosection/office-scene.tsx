"use client";
import { useCallback, useMemo, useState } from "react";
import {
  Float,
  Html,
  OrbitControls,
} from "@react-three/drei";
import * as THREE from "three";
import {
  CENTER_GOAL,
  OFFICE_TEAMS,
  getTeam,
  type TeamId,
} from "./office-data";
import { TeamOffice } from "./team-office";
import { TaskRunner, type TransferState } from "./task-runner";
import ConnectionLines from "./connection-lines";

/** Matches site navbar white */
const MIST = "#FFFFFF";

function FluencaHub() {
  return (
    <group position={[0, 0, 0]}>
      <pointLight
        position={[0, 2.4, 0]}
        intensity={2.4}
        distance={20}
        color="#5B57E6"
      />

      <Float speed={1.05} rotationIntensity={0.04} floatIntensity={0.18}>
        <group position={[0, 2.1, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
            <circleGeometry args={[3.4, 64]} />
            <meshBasicMaterial
              color="#5B57E6"
              transparent
              opacity={0.14}
              depthWrite={false}
            />
          </mesh>
          <mesh>
            <ringGeometry args={[3.0, 3.45, 64]} />
            <meshBasicMaterial
              color="#5B57E6"
              transparent
              opacity={0.32}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          <Html
            center
            transform
            distanceFactor={8.5}
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            <div
              style={{
                width: 320,
                borderRadius: 22,
                padding: "18px 20px 20px",
                background: "#FFFFFF",
                border: "3px solid #5B57E6",
                boxShadow:
                  "0 0 0 4px rgba(91,87,230,0.16), 0 16px 40px rgba(15,23,42,0.1), 0 0 40px rgba(91,87,230,0.15)",
                color: "#0F172A",
                fontFamily:
                  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/Logo.svg"
                  alt="Fluenca"
                  width={44}
                  height={44}
                  style={{
                    width: 44,
                    height: 44,
                    flexShrink: 0,
                    filter: "drop-shadow(0 2px 6px rgba(84,82,246,0.45))",
                  }}
                />
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: "0.16em",
                      color: "#5B57E6",
                    }}
                  >
                    {CENTER_GOAL.label}
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      lineHeight: 1.15,
                      marginTop: 2,
                      color: "#0F172A",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {CENTER_GOAL.title}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      marginTop: 3,
                      color: "#475569",
                    }}
                  >
                    {CENTER_GOAL.detail}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#334155",
                  }}
                >
                  Progress
                </span>
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#5B57E6",
                  }}
                >
                  {CENTER_GOAL.progress}%
                </span>
              </div>
              <div
                style={{
                  height: 10,
                  borderRadius: 999,
                  background: "#E2E8F0",
                  overflow: "hidden",
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: `${CENTER_GOAL.progress}%`,
                    height: "100%",
                    borderRadius: 999,
                    background:
                      "linear-gradient(90deg, #4F46E5 0%, #8B5CF6 100%)",
                  }}
                />
              </div>

              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#5B57E6",
                  marginBottom: 8,
                }}
              >
                {CENTER_GOAL.subtitle}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 6,
                }}
              >
                {CENTER_GOAL.steps.map((step) => {
                  const team = getTeam(step.teamId);
                  const done = step.status === "done";
                  const active = step.status === "active";
                  return (
                    <span
                      key={step.teamId}
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        padding: "7px 8px",
                        borderRadius: 10,
                        textAlign: "center",
                        color: done || active ? "#FFFFFF" : "#64748B",
                        background: active
                          ? team.color
                          : done
                            ? "#5B57E6"
                            : "#F1F5F9",
                        border: active
                          ? `2px solid ${team.accent}`
                          : done
                            ? "2px solid #4338CA"
                            : "2px solid #E2E8F0",
                      }}
                    >
                      {done ? "✓ " : active ? "● " : ""}
                      {step.label.replace(/^\d+\s/, "")}
                    </span>
                  );
                })}
              </div>
            </div>
          </Html>
        </group>
      </Float>
    </group>
  );
}

/** Solid white dome — matches navbar white */
function SceneAtmosphere() {
  return (
    <mesh scale={90}>
      <sphereGeometry args={[1, 32, 24]} />
      <meshBasicMaterial
        color="#FFFFFF"
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

export interface OfficeSceneProps {
  onTransferChange?: (state: TransferState) => void;
  selectedTeamId?: TeamId | null;
  tourFocusId?: TeamId | null;
  /** Meet panel open — hide floor/moving-agent Html overlays */
  suppressLabels?: boolean;
  autoRotate?: boolean;
  onSelectTeam?: (id: TeamId | null) => void;
}

export function OfficeScene({
  onTransferChange,
  selectedTeamId = null,
  tourFocusId = null,
  suppressLabels = false,
  autoRotate = true,
  onSelectTeam,
}: OfficeSceneProps) {
  const [states, setStates] = useState<TransferState[]>([]);

  const handleStates = useCallback(
    (next: TransferState[]) => {
      setStates(next);
      const walking = next.find((s) => s.phase === "walking");
      if (walking) onTransferChange?.(walking);
    },
    [onTransferChange],
  );

  const activeTeams = useMemo(() => {
    const ids = new Set<TeamId>();
    for (const s of states) {
      if (s.phase === "working" || s.phase === "complete") ids.add(s.from);
      if (s.phase === "walking") {
        ids.add(s.from);
        ids.add(s.to);
      }
    }
    return ids;
  }, [states]);

  const completingTeams = useMemo(() => {
    const ids = new Set<TeamId>();
    for (const s of states) {
      if (s.phase === "complete") ids.add(s.from);
    }
    return ids;
  }, [states]);

  return (
    <>
      <color attach="background" args={[MIST]} />

      <ambientLight intensity={1} />
      <hemisphereLight args={["#FFFFFF", "#FFFFFF", 0.35]} />
      <directionalLight
        position={[10, 16, 8]}
        intensity={1.15}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={40}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
      />
      <pointLight position={[-6, 5, -3]} intensity={0.35} color="#5B57E6" />
      <pointLight position={[6, 5, 5]} intensity={0.3} color="#818CF8" />

      <SceneAtmosphere />
      <FluencaHub />
      <ConnectionLines />

      {OFFICE_TEAMS.map((team) => (
        <TeamOffice
          key={team.id}
          team={team}
          active={activeTeams.has(team.id)}
          completing={completingTeams.has(team.id)}
          selected={selectedTeamId === team.id}
          tourFocus={tourFocusId === team.id}
          hideLabels={suppressLabels}
          onSelect={onSelectTeam}
        />
      ))}

      <TaskRunner
        onStatesChange={handleStates}
        hideLabels={suppressLabels}
      />

      <OrbitControls
        makeDefault
        enablePan={false}
        enableRotate={false}
        enableZoom={false}
        autoRotate={false}
        minPolarAngle={0.55}
        maxPolarAngle={0.85}
        target={[0, 0.4, 2]}
      />
    </>
  );
}
