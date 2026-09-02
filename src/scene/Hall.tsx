import { useTexture } from "@react-three/drei";
import { useLayoutEffect } from "react";
import * as THREE from "three";
import { MATS } from "./plates";

function useWallMaps() {
  const [map, bump] = useTexture([MATS.wall, MATS.wallBump]);
  useLayoutEffect(() => {
    for (const t of [map, bump]) {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(1.6, 1.1);
      t.anisotropy = 8;
      t.needsUpdate = true;
    }
    map.colorSpace = THREE.SRGBColorSpace;
    bump.colorSpace = THREE.NoColorSpace;
  }, [map, bump]);
  return { map, bump };
}

function Wall({
  args,
  position,
  color = "#6a635a",
}: {
  args: THREE.Vector3Tuple;
  position: THREE.Vector3Tuple;
  color?: string;
}) {
  const { map, bump } = useWallMaps();
  return (
    <mesh position={position}>
      <boxGeometry args={args} />
      <meshStandardMaterial
        map={map}
        bumpMap={bump}
        bumpScale={0.55}
        color={color}
        roughness={0.9}
        metalness={0.03}
      />
    </mesh>
  );
}

function Rib({ z, radius }: { z: number; radius: number }) {
  return (
    <mesh position={[0, radius - 0.05, z]} rotation={[0, 0, 0]}>
      <torusGeometry args={[radius, 0.07, 8, 28, Math.PI]} />
      <meshStandardMaterial color="#3a342e" roughness={0.88} metalness={0.04} />
    </mesh>
  );
}

export function Hall() {
  const [flag, flagBump] = useTexture([MATS.flagstone, MATS.flagBump]);
  useLayoutEffect(() => {
    for (const t of [flag, flagBump]) {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(2.2, 7);
      t.anisotropy = 8;
      t.needsUpdate = true;
    }
    flag.colorSpace = THREE.SRGBColorSpace;
    flagBump.colorSpace = THREE.NoColorSpace;
  }, [flag, flagBump]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 1]}>
        <planeGeometry args={[10, 40]} />
        <meshStandardMaterial
          map={flag}
          bumpMap={flagBump}
          bumpScale={0.28}
          roughness={0.92}
          metalness={0.02}
          color="#7a746c"
        />
      </mesh>

      <Wall args={[0.4, 4.0, 8.0]} position={[-1.88, 2.0, 14.5]} color="#5a544c" />
      <Wall args={[0.4, 4.0, 8.0]} position={[1.88, 2.0, 14.5]} color="#5a544c" />
      <Wall args={[4.2, 4.4, 0.34]} position={[0, 2.15, 18.7]} color="#4a453e" />

      <Wall args={[0.52, 3.5, 0.52]} position={[-1.72, 1.75, 10.3]} />
      <Wall args={[0.52, 3.5, 0.52]} position={[1.72, 1.75, 10.3]} />
      <Wall args={[4.0, 0.5, 0.52]} position={[0, 3.5, 10.3]} />

      <Wall args={[0.38, 4.2, 1.6]} position={[-3.15, 2.1, 9.3]} />
      <Wall args={[0.38, 4.2, 6.2]} position={[-3.15, 2.1, 0.6]} />
      <Wall args={[0.38, 4.2, 9.0]} position={[3.15, 2.1, 5.55]} />
      <Wall args={[0.38, 4.2, 3.2]} position={[3.15, 2.1, -10.3]} />

      <Rib z={10.3} radius={1.85} />
      <Rib z={6.4} radius={3.05} />
      <Rib z={2.2} radius={3.05} />
      <Rib z={-2.2} radius={3.05} />
      <Rib z={-6.4} radius={3.05} />

      <Wall args={[2.7, 3.5, 0.24]} position={[-4.35, 1.75, 8.5]} color="#4a433c" />
      <Wall args={[2.7, 3.5, 0.24]} position={[-4.35, 1.75, 4.1]} color="#4a433c" />
      <Wall args={[0.24, 3.5, 4.6]} position={[-5.7, 1.75, 6.3]} color="#3f3933" />

      <Wall args={[2.8, 3.6, 0.24]} position={[4.5, 1.8, 0.1]} />
      <Wall args={[2.8, 3.6, 0.24]} position={[4.5, 1.8, -8.0]} />
      <Wall args={[0.24, 3.6, 8.3]} position={[5.95, 1.8, -3.95]} />

      <Wall args={[8.0, 4.1, 0.34]} position={[0, 2.05, -17.55]} color="#4a453e" />
      <Wall args={[0.34, 4.1, 6.2]} position={[-3.95, 2.05, -14.2]} />
      <Wall args={[0.34, 4.1, 6.2]} position={[3.95, 2.05, -14.2]} />
    </group>
  );
}
