"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { OfficeScene, type OfficeSceneProps } from "./office-scene";

export function OfficeCanvas(props: OfficeSceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [0, 20, 30], fov: 48, near: 0.1, far: 240 }}
      gl={{ antialias: true, alpha: false, toneMappingExposure: 1.15 }}
      onCreated={({ gl }) => {
        gl.setClearColor("#FFFFFF", 1);
        gl.toneMapping = THREE.NoToneMapping;
      }}
      className="h-full w-full touch-none bg-white"
      onPointerMissed={() => props.onSelectTeam?.(null)}
    >
      <Suspense fallback={null}>
        <OfficeScene {...props} />
      </Suspense>
    </Canvas>
  );
}
