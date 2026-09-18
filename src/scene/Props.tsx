import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFolio } from "../store/folio";
import { folioTexture, woodTexture } from "./textures";

function Candle({ position }: { position: THREE.Vector3Tuple }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.028, 0.032, 0.24, 8]} />
        <meshStandardMaterial color="#f3e6c4" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.26, 0]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshBasicMaterial color="#ffd27a" />
      </mesh>
    </group>
  );
}

function CandleRing({ position }: { position: THREE.Vector3Tuple }) {
  const wood = woodTexture();
  const candles = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2;
      return [Math.cos(a) * 0.72, 0.02, Math.sin(a) * 0.72] as THREE.Vector3Tuple;
    });
  }, []);
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.72, 0.035, 8, 28]} />
        <meshStandardMaterial map={wood} color="#2a1c12" roughness={0.6} metalness={0.15} />
      </mesh>
      {candles.map((p, i) => (
        <Candle key={i} position={p} />
      ))}
    </group>
  );
}

function Lectern({
  position,
  yaw,
  kind,
  seed,
}: {
  position: THREE.Vector3Tuple;
  yaw: number;
  kind: "rune" | "plant";
  seed: number;
}) {
  const wood = woodTexture();
  const pages = useMemo(
    () => [folioTexture(kind, seed), folioTexture(kind, seed + 1), folioTexture(kind, seed + 2)],
    [kind, seed],
  );
  const group = useRef<THREE.Group>(null);
  const reduced = useFolio((s) => s.reduced);

  useFrame(({ clock }) => {
    if (!group.current || reduced) return;
    const t = clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      child.rotation.z = Math.sin(t * 0.6 + i) * 0.03;
    });
  });

  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[1.15, 0.9, 0.7]} />
        <meshStandardMaterial map={wood} roughness={0.82} color="#5a3a22" />
      </mesh>
      <mesh position={[0, 1.05, 0.05]} rotation={[-0.55, 0, 0]} castShadow>
        <boxGeometry args={[1.35, 0.07, 0.95]} />
        <meshStandardMaterial map={wood} roughness={0.78} color="#6a4428" />
      </mesh>
      <mesh position={[0, 1.12, 0.02]} rotation={[-0.55, 0, 0]}>
        <planeGeometry args={[1.15, 0.78]} />
        <meshStandardMaterial map={pages[0]} roughness={0.9} />
      </mesh>
      <group ref={group} position={[0, 1.55, -0.15]}>
        {[-0.38, 0, 0.38].map((x, i) => (
          <mesh key={i} position={[x, 0.35, 0]} rotation={[0, 0, x * 0.08]}>
            <planeGeometry args={[0.42, 0.72]} />
            <meshStandardMaterial map={pages[i]} roughness={0.88} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, 1.95, -0.18]}>
        <boxGeometry args={[1.05, 0.04, 0.05]} />
        <meshStandardMaterial map={wood} color="#2c1c12" />
      </mesh>
    </group>
  );
}

function CatalogFrames() {
  const plates = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        x: -2.4 + (i % 3) * 2.4,
        y: i < 3 ? 2.55 : 1.15,
        tex: folioTexture(i % 2 === 0 ? "rune" : "plant", 80 + i),
      })),
    [],
  );
  const wood = woodTexture();
  return (
    <group position={[0, 0, -18.9]}>
      {plates.map((p, i) => (
        <group key={i} position={[p.x, p.y, 0]}>
          <mesh>
            <boxGeometry args={[1.45, 1.15, 0.06]} />
            <meshStandardMaterial map={wood} color="#2a1c12" />
          </mesh>
          <mesh position={[0, 0, 0.04]}>
            <planeGeometry args={[1.22, 0.94]} />
            <meshStandardMaterial map={p.tex} roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function Props() {
  return (
    <group>
      <Lectern position={[-2.05, 0, 4.1]} yaw={0.35} kind="rune" seed={3} />
      <Lectern position={[2.05, 0, -6.05]} yaw={-0.38} kind="plant" seed={11} />
      <CandleRing position={[0, 3.55, 4.2]} />
      <CandleRing position={[0, 3.55, -6]} />
      <CandleRing position={[0, 3.45, -13.5]} />
      <CatalogFrames />
      <mesh position={[-1.35, 0.08, 8.4]} rotation={[0, 0.4, 0]}>
        <boxGeometry args={[0.7, 0.16, 0.5]} />
        <meshStandardMaterial color="#d7c7a4" roughness={0.85} />
      </mesh>
      <mesh position={[1.5, 0.06, -1.8]} rotation={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.16, 0.18, 0.12, 12]} />
        <meshStandardMaterial color="#3a2414" roughness={0.55} metalness={0.2} />
      </mesh>
    </group>
  );
}
