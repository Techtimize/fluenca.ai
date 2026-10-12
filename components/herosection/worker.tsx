"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Group } from "three";

interface WorkerProps {
  position: [number, number, number];
  role: string;
  shirtColor?: string;
  phase?: number;
  isLead?: boolean;
  /** Hide role Html when a meet panel is open */
  hideLabel?: boolean;
}

/** Low-poly seated worker typing at a desk */
export function Worker({
  position,
  role,
  shirtColor = "#64748B",
  phase = 0,
  isLead = false,
  hideLabel = false,
}: WorkerProps) {
  const bodyRef = useRef<Group>(null);
  const headRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (bodyRef.current) {
      bodyRef.current.position.y = Math.sin(t * 4 + phase) * 0.015;
    }
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 1.6 + phase) * 0.12;
      headRef.current.position.y = 0.55 + Math.sin(t * 5 + phase) * 0.01;
    }
  });

  return (
    <group position={position}>
      {/* chair */}
      <mesh position={[0, 0.22, 0.18]} castShadow>
        <boxGeometry args={[0.42, 0.08, 0.38]} />
        <meshStandardMaterial color="#1F1F23" />
      </mesh>
      <mesh position={[0, 0.42, 0.32]} castShadow>
        <boxGeometry args={[0.4, 0.45, 0.06]} />
        <meshStandardMaterial color="#1F1F23" />
      </mesh>

      <group ref={bodyRef}>
        {/* torso */}
        <mesh position={[0, 0.38, 0.12]} castShadow>
          <boxGeometry args={[0.32, 0.36, 0.22]} />
          <meshStandardMaterial color={shirtColor} roughness={0.65} />
        </mesh>
        {/* arms typing */}
        <mesh position={[-0.22, 0.36, -0.02]} rotation={[0.4, 0, 0.2]} castShadow>
          <boxGeometry args={[0.1, 0.1, 0.32]} />
          <meshStandardMaterial color={shirtColor} />
        </mesh>
        <mesh position={[0.22, 0.36, -0.02]} rotation={[0.4, 0, -0.2]} castShadow>
          <boxGeometry args={[0.1, 0.1, 0.32]} />
          <meshStandardMaterial color={shirtColor} />
        </mesh>
      </group>

      <group ref={headRef} position={[0, 0.55, 0.12]}>
        <mesh castShadow>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#F5D0B0" />
        </mesh>
        {/* hair */}
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.145, 12, 12]} />
          <meshStandardMaterial color="#1C1917" />
        </mesh>
      </group>

      {!hideLabel && (
        <Html
          position={[0, 1.15, 0]}
          center
          distanceFactor={14}
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          <div
            className={`whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide shadow-md ${
              isLead
                ? "bg-ink text-white"
                : "bg-white/95 text-ink ring-1 ring-black/5"
            }`}
          >
            {isLead ? `★ ${role}` : role}
          </div>
        </Html>
      )}
    </group>
  );
}
