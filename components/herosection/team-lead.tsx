"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, RoundedBox } from "@react-three/drei";
import type { Group } from "three";

interface TeamLeadProps {
  position: [number, number, number];
  name: string;
  title: string;
  image: string;
  accent: string;
}

/** Mascot team lead — pedestal + avatar card */
export function TeamLead({ position, name, title, image, accent }: TeamLeadProps) {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 1.8) * 0.04;
  });

  return (
    <group position={position}>
      <group ref={groupRef}>
        <RoundedBox args={[0.9, 0.12, 0.9]} radius={0.08} position={[0, 0.06, 0]}>
          <meshStandardMaterial color="#18181B" roughness={0.5} />
        </RoundedBox>
        <mesh position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.38, 0.42, 0.08, 24]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={0.25}
          />
        </mesh>

        <group position={[0, 0.85, 0]}>
          <RoundedBox args={[0.95, 1.1, 0.08]} radius={0.08} castShadow>
            <meshStandardMaterial color="#FFFFFF" />
          </RoundedBox>
          <Html
            position={[0, 0.05, 0.08]}
            center
            transform
            distanceFactor={6.5}
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={`${name} mascot`}
              width={120}
              height={132}
              style={{
                width: 120,
                height: 132,
                objectFit: "cover",
                borderRadius: 10,
                display: "block",
              }}
            />
          </Html>
          <mesh position={[0, 0.72, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color={accent}
              emissive={accent}
              emissiveIntensity={0.6}
            />
          </mesh>
        </group>

        <Html
          position={[0, 1.85, 0]}
          center
          distanceFactor={12}
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          <div className="flex flex-col items-center gap-0.5">
            <div
              className="whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide text-white shadow-lg"
              style={{ backgroundColor: accent }}
            >
              ★ {title.toUpperCase()}
            </div>
            <div className="rounded-md bg-zinc-900/90 px-2 py-0.5 text-[11px] font-semibold text-white">
              {name}
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
}
