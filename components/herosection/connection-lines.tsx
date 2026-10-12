"use client";

import { useMemo } from "react";
import * as THREE from "three";
import {
  OFFICE_TEAMS,
  TASK_TRANSFERS,
  getTeam,
} from "./office-data";
import {
    Line,
  } from "@react-three/drei";

export default function ConnectionLines() {
    const { hubSpokes, transfers } = useMemo(() => {
      const hub = new THREE.Vector3(0, 1.55, 0);
  
      const hubSpokes = OFFICE_TEAMS.map((team) => {
        const end = new THREE.Vector3(
          team.position[0],
          0.55,
          team.position[2],
        );
        const mid = hub.clone().lerp(end, 0.5);
        mid.y = 1.85;
        const curve = new THREE.CatmullRomCurve3([hub, mid, end]);
        return {
          id: `hub-${team.id}`,
          points: curve.getPoints(36),
          color: team.accent,
        };
      });
  
      const transfers = TASK_TRANSFERS.map((tr) => {
        const a = getTeam(tr.from).position;
        const b = getTeam(tr.to).position;
        const from = new THREE.Vector3(a[0], 0.4, a[2]);
        const to = new THREE.Vector3(b[0], 0.4, b[2]);
        const mid = from.clone().lerp(to, 0.5);
        mid.y = 1.4;
        const curve = new THREE.CatmullRomCurve3([from, mid, to]);
        return {
          id: tr.id,
          points: curve.getPoints(32),
          color: getTeam(tr.from).accent,
        };
      });
  
      return { hubSpokes, transfers };
    }, []);
  
    return (
      <group>
        {/* Logo → every team */}
        {hubSpokes.map((seg) => (
          <Line
            key={seg.id}
            points={seg.points}
            color={seg.color}
            lineWidth={1.25}
            dashed
            dashSize={0.32}
            gapSize={0.2}
            transparent
            opacity={0.38}
          />
        ))}
        {/* Team → team task handoffs */}
        {transfers.map((seg) => (
          <Line
            key={seg.id}
            points={seg.points}
            color={seg.color}
            lineWidth={1}
            dashed
            dashSize={0.3}
            gapSize={0.22}
            transparent
            opacity={0.28}
          />
        ))}
      </group>
    );
  }
  