"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

interface DeskProps {
  position: [number, number, number];
  working?: boolean;
  phase?: number;
}

export function Desk({ position, working = true, phase = 0 }: DeskProps) {
  const screenRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!screenRef.current || !working) return;
    const pulse = 0.35 + Math.sin(clock.elapsedTime * 3 + phase) * 0.25;
    const mat = screenRef.current.material as unknown as { emissiveIntensity: number };
    if (mat) mat.emissiveIntensity = pulse;
  });

  return (
    <group position={position}>
      {/* desk top */}
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.95, 0.06, 0.55]} />
        <meshStandardMaterial color="#E8D5B7" roughness={0.7} />
      </mesh>
      {/* legs */}
      {(
        [
          [-0.4, 0.2, -0.2],
          [0.4, 0.2, -0.2],
          [-0.4, 0.2, 0.2],
          [0.4, 0.2, 0.2],
        ] as const
      ).map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <boxGeometry args={[0.06, 0.4, 0.06]} />
          <meshStandardMaterial color="#3F3F46" />
        </mesh>
      ))}
      {/* monitor stand */}
      <mesh position={[0, 0.52, -0.12]}>
        <boxGeometry args={[0.12, 0.08, 0.08]} />
        <meshStandardMaterial color="#27272A" />
      </mesh>
      {/* monitor */}
      <mesh position={[0, 0.72, -0.14]} castShadow>
        <boxGeometry args={[0.62, 0.38, 0.05]} />
        <meshStandardMaterial color="#18181B" />
      </mesh>
      {/* glowing screen */}
      <mesh ref={screenRef} position={[0, 0.72, -0.11]}>
        <boxGeometry args={[0.52, 0.28, 0.02]} />
        <meshStandardMaterial
          color="#60A5FA"
          emissive="#3B82F6"
          emissiveIntensity={0.5}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}
