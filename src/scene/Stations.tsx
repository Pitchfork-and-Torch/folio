import { useTexture } from "@react-three/drei";
import { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { MATS, PLATES } from "./plates";
import { folioTexture } from "./textures";

function useColorMap(src: string, bumpSrc?: string) {
  const maps = useTexture(bumpSrc ? [src, bumpSrc] : [src]);
  const map = Array.isArray(maps) ? maps[0] : maps;
  const bump = Array.isArray(maps) ? maps[1] : undefined;
  useLayoutEffect(() => {
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;
    map.needsUpdate = true;
    if (bump) {
      bump.colorSpace = THREE.NoColorSpace;
      bump.anisotropy = 8;
      bump.needsUpdate = true;
    }
  }, [map, bump]);
  return { map, bump };
}

function folioWord() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.fillStyle = "#161310";
  ctx.fillRect(0, 0, 1024, 256);
  ctx.fillStyle = "#eadcc0";
  ctx.font = "600 108px 'Clash Display', Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("FOLIO", 512, 116);
  ctx.font = "500 26px Satoshi, sans-serif";
  ctx.fillStyle = "#b7a27a";
  ctx.fillText("HYPOTHESIS LAB", 512, 186);
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
  return t;
}

function Slate({
  map,
  bump,
  position,
  size,
  yaw,
}: {
  map: THREE.Texture;
  bump?: THREE.Texture;
  position: THREE.Vector3Tuple;
  size: [number, number];
  yaw: number;
}) {
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <mesh position={[0, -size[1] * 0.52, 0]}>
        <boxGeometry args={[size[0] * 0.7, 0.18, 0.38]} />
        <meshStandardMaterial color="#2a2420" roughness={0.92} />
      </mesh>
      <mesh>
        <boxGeometry args={[size[0], size[1], 0.11]} />
        <meshStandardMaterial attach="material-0" color="#1a1714" roughness={0.94} />
        <meshStandardMaterial attach="material-1" color="#1a1714" roughness={0.94} />
        <meshStandardMaterial attach="material-2" color="#1a1714" roughness={0.94} />
        <meshStandardMaterial attach="material-3" color="#1a1714" roughness={0.94} />
        <meshStandardMaterial
          attach="material-4"
          map={map}
          bumpMap={bump}
          bumpScale={0.18}
          roughness={0.62}
          metalness={0.04}
        />
        <meshStandardMaterial
          attach="material-5"
          map={map}
          bumpMap={bump}
          bumpScale={0.18}
          roughness={0.62}
          metalness={0.04}
        />
      </mesh>
    </group>
  );
}

function ReadingDesk({ position }: { position: THREE.Vector3Tuple }) {
  const { map: herbal } = useColorMap(PLATES.herbal);
  const { map: oak, bump: oakBump } = useColorMap(MATS.oak, MATS.oakBump);
  useLayoutEffect(() => {
    oak.wrapS = oak.wrapT = THREE.RepeatWrapping;
    oak.repeat.set(1.1, 0.7);
    if (oakBump) {
      oakBump.wrapS = oakBump.wrapT = THREE.RepeatWrapping;
      oakBump.repeat.set(1.1, 0.7);
    }
  }, [oak, oakBump]);

  const topY = 0.74;
  const legs: THREE.Vector3Tuple[] = [
    [-1.05, 0.35, -0.58],
    [1.05, 0.35, -0.58],
    [-1.05, 0.35, 0.58],
    [1.05, 0.35, 0.58],
  ];

  return (
    <group position={position}>
      <mesh position={[0, topY, 0]}>
        <boxGeometry args={[2.4, 0.08, 1.42]} />
        <meshStandardMaterial map={oak} bumpMap={oakBump} bumpScale={0.12} color="#5a3a22" roughness={0.78} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <boxGeometry args={[2.2, 0.12, 1.22]} />
        <meshStandardMaterial color="#3a2414" roughness={0.82} />
      </mesh>
      {legs.map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.09, 0.7, 0.09]} />
          <meshStandardMaterial color="#2e1c10" roughness={0.84} />
        </mesh>
      ))}
      <mesh position={[0, topY + 0.055, 0]}>
        <boxGeometry args={[1.18, 0.035, 0.8]} />
        <meshStandardMaterial attach="material-0" color="#2a1810" roughness={0.86} />
        <meshStandardMaterial attach="material-1" color="#2a1810" roughness={0.86} />
        <meshStandardMaterial attach="material-2" map={herbal} roughness={0.88} metalness={0} />
        <meshStandardMaterial attach="material-3" color="#2a1810" roughness={0.86} />
        <meshStandardMaterial attach="material-4" color="#2a1810" roughness={0.86} />
        <meshStandardMaterial attach="material-5" color="#2a1810" roughness={0.86} />
      </mesh>
    </group>
  );
}

function Easel({
  map,
  position,
  yaw,
  size,
}: {
  map: THREE.Texture;
  position: THREE.Vector3Tuple;
  yaw: number;
  size: [number, number];
}) {
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <mesh position={[-0.2, 0.58, -0.07]} rotation={[0.2, 0, 0.09]}>
        <cylinderGeometry args={[0.024, 0.03, 1.2, 8]} />
        <meshStandardMaterial color="#3a2616" roughness={0.82} />
      </mesh>
      <mesh position={[0.2, 0.58, -0.07]} rotation={[0.2, 0, -0.09]}>
        <cylinderGeometry args={[0.024, 0.03, 1.2, 8]} />
        <meshStandardMaterial color="#3a2616" roughness={0.82} />
      </mesh>
      <mesh position={[0, 0.14, 0.14]} rotation={[0.95, 0, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.58, 8]} />
        <meshStandardMaterial color="#2c1c12" />
      </mesh>
      <mesh position={[0, 0.82, 0.06]} rotation={[-0.22, 0, 0]}>
        <boxGeometry args={[size[0] + 0.07, size[1] + 0.07, 0.045]} />
        <meshStandardMaterial color="#24180e" roughness={0.78} />
      </mesh>
      <mesh position={[0, 0.82, 0.086]} rotation={[-0.22, 0, 0]}>
        <planeGeometry args={size} />
        <meshStandardMaterial map={map} roughness={0.88} />
      </mesh>
    </group>
  );
}

function Chandelier({ position }: { position: THREE.Vector3Tuple }) {
  const candles = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2;
      return [Math.cos(a) * 0.42, 0.02, Math.sin(a) * 0.42] as THREE.Vector3Tuple;
    });
  }, []);
  return (
    <group position={position}>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 1.35, 6]} />
        <meshStandardMaterial color="#1a140e" metalness={0.65} roughness={0.32} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.03, 8, 28]} />
        <meshStandardMaterial color="#2a1c10" metalness={0.62} roughness={0.3} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}>
        <torusGeometry args={[0.18, 0.018, 8, 20]} />
        <meshStandardMaterial color="#2a1c10" metalness={0.62} roughness={0.3} />
      </mesh>
      {candles.map((p, i) => (
        <group key={i} position={p}>
          <mesh position={[0, 0.13, 0]}>
            <cylinderGeometry args={[0.02, 0.024, 0.22, 8]} />
            <meshStandardMaterial color="#f4e4c4" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.26, 0]}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshBasicMaterial color="#ffd89a" />
          </mesh>
        </group>
      ))}
      <pointLight color="#ffc56a" intensity={8} distance={12} decay={2} />
    </group>
  );
}

export function ThresholdProps() {
  const word = useMemo(() => folioWord(), []);
  return (
    <group>
      <Chandelier position={[0, 2.68, 14.05]} />
      <mesh position={[-1.66, 2.4, 13.5]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.16, 1.6]} />
        <meshBasicMaterial color="#d5e2f4" transparent opacity={0.62} />
      </mesh>
      <mesh position={[1.66, 2.4, 15.05]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.16, 1.6]} />
        <meshBasicMaterial color="#d5e2f4" transparent opacity={0.55} />
      </mesh>
      <mesh position={[0, 3.48, 10.02]}>
        <planeGeometry args={[2.55, 0.58]} />
        <meshStandardMaterial map={word} roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[0, 1.65, 12.0]} rotation={[0.42, 0, 0]}>
        <planeGeometry args={[0.45, 3.2]} />
        <meshBasicMaterial color="#b7c8de" transparent opacity={0.06} depthWrite={false} />
      </mesh>
    </group>
  );
}

export function LiberAlcove() {
  const tall = useColorMap(PLATES.liberTall, MATS.slateBump);
  const broken = useColorMap(PLATES.liberBroken, MATS.brokenBump);
  const wax = useColorMap(PLATES.liberWax, MATS.waxBump);
  return (
    <group>
      <Slate
        map={tall.map}
        bump={tall.bump}
        position={[-2.05, 1.28, 6.35]}
        size={[1.58, 2.48]}
        yaw={-Math.PI / 2}
      />
      <Slate
        map={broken.map}
        bump={broken.bump}
        position={[-2.85, 1.12, 4.75]}
        size={[1.18, 1.95]}
        yaw={-1.05}
      />
      <mesh position={[-1.55, 0.22, 5.15]}>
        <boxGeometry args={[0.72, 0.4, 0.52]} />
        <meshStandardMaterial color="#2a221c" roughness={0.88} />
      </mesh>
      <mesh position={[-1.55, 0.46, 5.15]} rotation={[-1.05, 0.35, 0]}>
        <planeGeometry args={[0.62, 0.44]} />
        <meshStandardMaterial
          map={wax.map}
          bumpMap={wax.bump}
          bumpScale={0.08}
          roughness={0.42}
          metalness={0.14}
        />
      </mesh>
      <pointLight position={[0.4, 2.05, 6.55]} color="#ffd7a8" intensity={14} distance={7} decay={2} />
      <pointLight position={[-2.15, 2.35, 7.15]} color="#ff6a3a" intensity={6} distance={5} decay={2} />
      <pointLight position={[-1.6, 1.4, 6.35]} color="#ffb080" intensity={3.2} distance={14} decay={2} />
    </group>
  );
}

export function VoynichBay() {
  const bulb = useColorMap(PLATES.bulb);
  const lily = useColorMap(PLATES.lily);
  return (
    <group>
      <ReadingDesk position={[3.15, 0, -4.85]} />
      <Easel map={bulb.map} position={[4.42, 0, -3.15]} yaw={-0.92} size={[0.7, 1.02]} />
      <Easel map={lily.map} position={[4.52, 0, -6.42]} yaw={-1.18} size={[0.66, 0.96]} />
      <group position={[5.8, 2.48, -4.05]}>
        <mesh rotation={[0, -Math.PI / 2, 0]}>
          <circleGeometry args={[0.64, 24]} />
          <meshBasicMaterial color="#c5e090" transparent opacity={0.5} />
        </mesh>
        <mesh rotation={[0, -Math.PI / 2, 0]}>
          <ringGeometry args={[0.64, 0.8, 24]} />
          <meshStandardMaterial color="#2c2418" roughness={0.7} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.035, 1.25, 0.035]} />
          <meshStandardMaterial color="#2a2218" />
        </mesh>
        <mesh>
          <boxGeometry args={[0.035, 0.035, 1.25]} />
          <meshStandardMaterial color="#2a2218" />
        </mesh>
      </group>
      <pointLight position={[5.65, 2.48, -4.05]} color="#b7d87c" intensity={6} distance={16} decay={2} />
      <pointLight position={[3.15, 1.5, -4.65]} color="#ffe9bc" intensity={3.8} distance={5.2} decay={2} />
    </group>
  );
}

export function InstarSchool() {
  const oak = useColorMap(MATS.oak);
  const sheet = useMemo(() => folioTexture("school", 41), []);
  const molts = useMemo(
    () => Array.from({ length: 7 }, (_, i) => [-1.2 + i * 0.4, 1.08, -12.02] as THREE.Vector3Tuple),
    [],
  );
  return (
    <group>
      <mesh position={[-1.85, 0.45, -12.2]} rotation={[0, 0.42, 0]} castShadow>
        <boxGeometry args={[1.15, 0.9, 0.7]} />
        <meshStandardMaterial map={oak.map} roughness={0.82} color="#5a3a22" />
      </mesh>
      <mesh position={[-1.85, 1.05, -12.12]} rotation={[-0.5, 0.42, 0]}>
        <boxGeometry args={[1.32, 0.07, 0.92]} />
        <meshStandardMaterial map={oak.map} roughness={0.78} color="#6a4428" />
      </mesh>
      <mesh position={[-1.85, 1.12, -12.1]} rotation={[-0.5, 0.42, 0]}>
        <planeGeometry args={[1.12, 0.74]} />
        <meshStandardMaterial map={sheet} roughness={0.9} />
      </mesh>
      <mesh position={[0.15, 0.92, -12.05]}>
        <boxGeometry args={[2.9, 0.08, 0.22]} />
        <meshStandardMaterial map={oak.map} color="#2c1c12" roughness={0.7} />
      </mesh>
      {molts.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.046, 10, 8]} />
          <meshStandardMaterial color="#c4a46a" roughness={0.42} metalness={0.28} />
        </mesh>
      ))}
      <pointLight position={[-0.35, 2.05, -11.5]} color="#e8c48a" intensity={7} distance={8} decay={2} />
    </group>
  );
}

export function CatalogWall() {
  const star = useColorMap(PLATES.star);
  const iron = useColorMap(PLATES.iron);
  const lily = useColorMap(PLATES.lily);
  const tall = useColorMap(PLATES.liberTall);
  const wax = useColorMap(PLATES.liberWax);
  const bulb = useColorMap(PLATES.bulb);
  const oak = useColorMap(MATS.oak);
  const items: Array<{
    map: THREE.Texture;
    pos: THREE.Vector3Tuple;
    size: [number, number];
    rot?: number;
  }> = [
    { map: iron.map, pos: [0.08, 2.05, -17.18], size: [1.18, 1.18] },
    { map: star.map, pos: [1.85, 2.42, -17.14], size: [0.7, 0.7], rot: 0.03 },
    { map: lily.map, pos: [-1.92, 2.28, -17.16], size: [0.86, 1.16], rot: -0.03 },
    { map: tall.map, pos: [-1.78, 0.92, -17.12], size: [0.74, 1.02] },
    { map: wax.map, pos: [0.06, 0.78, -17.1], size: [0.96, 0.64] },
    { map: bulb.map, pos: [1.78, 0.98, -17.14], size: [0.64, 0.94], rot: 0.04 },
  ];
  return (
    <group>
      <mesh position={[0, 1.65, -17.42]}>
        <boxGeometry args={[6.6, 3.15, 0.18]} />
        <meshStandardMaterial map={oak.map} color="#2a1e14" roughness={0.82} />
      </mesh>
      <mesh position={[0, 1.65, -17.3]}>
        <boxGeometry args={[6.35, 0.06, 0.16]} />
        <meshStandardMaterial color="#1a140e" />
      </mesh>
      {items.map((it, i) => (
        <group key={i} position={it.pos} rotation={[0, 0, it.rot ?? 0]}>
          <mesh position={[0, 0, -0.03]}>
            <boxGeometry args={[it.size[0] + 0.08, it.size[1] + 0.08, 0.06]} />
            <meshStandardMaterial color={i % 2 ? "#2c1e12" : "#161412"} roughness={0.8} />
          </mesh>
          <mesh>
            <planeGeometry args={it.size} />
            <meshStandardMaterial map={it.map} roughness={0.84} polygonOffset polygonOffsetFactor={-1} />
          </mesh>
        </group>
      ))}
      <pointLight position={[0, 2.35, -14.6]} color="#ead4ae" intensity={3.6} distance={8} decay={2} />
    </group>
  );
}
