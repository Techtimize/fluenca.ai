"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OfficeScene, type OfficeSceneProps } from "./office-scene";

export function OfficeCanvas(props: OfficeSceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [22, 30, 22], fov: 46, near: 0.1, far: 200 }}
      gl={{ antialias: true, alpha: false, toneMappingExposure: 1.05 }}
      className="h-full w-full touch-none"
      onPointerMissed={() => props.onSelectTeam?.(null)}
    >
      <Suspense fallback={null}>
        <OfficeScene {...props} />
      </Suspense>
    </Canvas>
  );
}
