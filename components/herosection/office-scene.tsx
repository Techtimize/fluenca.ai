"use client";
import { useCallback, useMemo, useState } from "react";
import {
  ContactShadows,
  Float,
  GradientTexture,
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

const MIST = "#0B0D1A";
const STAGE = "#15182B";

function FluencaHub() {
  return (
    <group position={[0, 0, 0]}>
      <pointLight
        position={[0, 2.4, 0]}
        intensity={2.4}
        distance={14}
        color="#818CF8"
      />

      <Float speed={1.05} rotationIntensity={0.04} floatIntensity={0.18}>
        <group position={[0, 2.1, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
            <circleGeometry args={[2.8, 64]} />
            <meshBasicMaterial
              color="#5452F6"
              transparent
              opacity={0.2}
              depthWrite={false}
            />
          </mesh>
          <mesh>
            <ringGeometry args={[2.5, 2.85, 64]} />
            <meshBasicMaterial
              color="#818CF8"
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          <Html
            center
            transform
            distanceFactor={7.2}
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            <div
              style={{
                width: 320,
                borderRadius: 22,
                padding: "18px 20px 20px",
                background: "#FFFFFF",
                border: "3px solid #5452F6",
                boxShadow:
                  "0 0 0 4px rgba(84,82,246,0.25), 0 16px 48px rgba(0,0,0,0.55), 0 0 60px rgba(84,82,246,0.4)",
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
                      color: "#5452F6",
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
                    color: "#5452F6",
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
                  color: "#5452F6",
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
                            ? "#5452F6"
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

/** Soft mist dome + circular stage — fills empty white space without clutter */
function SceneAtmosphere() {
  return (
    <group>
      {/* Sky / mist dome */}
      <mesh scale={90}>
        <sphereGeometry args={[1, 48, 32]} />
        <meshBasicMaterial side={THREE.BackSide} depthWrite={false}>
          <GradientTexture
            stops={[0, 0.35, 0.7, 1]}
            colors={["#05060F", "#0B0D1A", "#141833", "#1A1F3D"]}
            size={256}
          />
        </meshBasicMaterial>
      </mesh>

      {/* Circular stage under the offices */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.04, 0]}
        receiveShadow
      >
        <circleGeometry args={[28, 80]} />
        <meshStandardMaterial
          color={STAGE}
          roughness={0.88}
          metalness={0.08}
        />
      </mesh>

      {/* Soft vignette ring so the stage edge fades into mist */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]}>
        <ringGeometry args={[22, 32, 80]} />
        <meshBasicMaterial
          color="#05060F"
          transparent
          opacity={0.65}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.025, 0]}>
        <ringGeometry args={[28, 40, 80]} />
        <meshBasicMaterial
          color="#05060F"
          transparent
          opacity={0.5}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Soft indigo light pools */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-9, -0.02, -6]}>
        <circleGeometry args={[7, 48]} />
        <meshBasicMaterial
          color="#5452F6"
          transparent
          opacity={0.1}
          depthWrite={false}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10, -0.02, 7]}>
        <circleGeometry args={[6.5, 48]} />
        <meshBasicMaterial
          color="#8B5CF6"
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export interface OfficeSceneProps {
  onTransferChange?: (state: TransferState) => void;
  selectedTeamId?: TeamId | null;
  tourFocusId?: TeamId | null;
  autoRotate?: boolean;
  onSelectTeam?: (id: TeamId | null) => void;
}

export function OfficeScene({
  onTransferChange,
  selectedTeamId = null,
  tourFocusId = null,
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
      <fog attach="fog" args={[MIST, 48, 90]} />

      <ambientLight intensity={0.35} />
      <hemisphereLight args={["#2A2F55", "#070812", 0.45]} />
      <directionalLight
        position={[10, 16, 8]}
        intensity={1.05}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={40}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
      />
      <pointLight position={[-6, 5, -3]} intensity={0.45} color="#818CF8" />
      <pointLight position={[6, 5, 5]} intensity={0.4} color="#A78BFA" />

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
          onSelect={onSelectTeam}
        />
      ))}

      <TaskRunner onStatesChange={handleStates} />

      <ContactShadows
        position={[0, -0.02, 0]}
        opacity={0.22}
        scale={48}
        blur={3.2}
        far={14}
        color="#3B3F6B"
      />

      <OrbitControls
        makeDefault
        enablePan={false}
        autoRotate={autoRotate && !selectedTeamId && !tourFocusId}
        autoRotateSpeed={1.8}
        minPolarAngle={0.72}
        maxPolarAngle={0.98}
        minDistance={36}
        maxDistance={55}
        target={[0, 0.2, 0]}
      />
    </>
  );
}
