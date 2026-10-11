"use client";

import { RoundedBox } from "@react-three/drei";

interface DepartmentFloorProps {
  width?: number;
  depth?: number;
  color?: string;
  accent?: string;
  position?: [number, number, number];
}

export function DepartmentFloor({
  width = 6,
  depth = 5,
  color = "#4C1D95",
  accent = "#8B5CF6",
  position = [0, 0, 0],
}: DepartmentFloorProps) {
  return (
    <group position={position}>
      <RoundedBox
        args={[width, 0.28, depth]}
        radius={0.18}
        smoothness={4}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={color}
          roughness={0.45}
          metalness={0.12}
          emissive={color}
          emissiveIntensity={0.12}
        />
      </RoundedBox>
      {/* rim accent strip */}
      <RoundedBox
        args={[width + 0.12, 0.06, depth + 0.12]}
        radius={0.2}
        smoothness={4}
        position={[0, -0.12, 0]}
      >
        <meshStandardMaterial color={accent} roughness={0.4} metalness={0.2} />
      </RoundedBox>
    </group>
  );
}
