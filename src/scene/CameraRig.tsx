import { useFrame, useThree } from "@react-three/fiber";
import { useSpring } from "motion/react";
import { useMemo } from "react";
import * as THREE from "three";
import { useFolio, scrollProgress } from "../store/folio";

type Key = { t: number; pos: THREE.Vector3Tuple; look: THREE.Vector3Tuple };

const KEYS: Key[] = [
  { t: 0, pos: [0.0, 1.5, 16.85], look: [0.0, 1.88, 10.15] },
  { t: 0.12, pos: [0.08, 1.5, 12.2], look: [-0.2, 1.48, 7.2] },
  { t: 0.32, pos: [1.55, 1.4, 6.35], look: [-2.05, 1.28, 6.35] },
  { t: 0.5, pos: [3.15, 2.15, -2.7], look: [3.15, 0.82, -4.85] },
  { t: 0.68, pos: [1.35, 1.48, -9.35], look: [-1.85, 1.22, -12.15] },
  { t: 1, pos: [0.0, 1.52, -11.6], look: [0.04, 1.58, -17.05] },
];

const mouse = { x: 0.5, y: 0.5 };

function mix(a: THREE.Vector3Tuple, b: THREE.Vector3Tuple, t: number): THREE.Vector3Tuple {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function at(t: number) {
  const p = Math.min(1, Math.max(0, t));
  let i = 1;
  while (i < KEYS.length && KEYS[i].t < p) i += 1;
  const a = KEYS[i - 1];
  const b = KEYS[i];
  const u = (p - a.t) / Math.max(1e-5, b.t - a.t);
  const s = u * u * (3 - 2 * u);
  return { pos: mix(a.pos, b.pos, s), look: mix(a.look, b.look, s) };
}

export function bindMouse() {
  const onMove = (e: PointerEvent) => {
    mouse.x = e.clientX / window.innerWidth;
    mouse.y = e.clientY / window.innerHeight;
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  return () => window.removeEventListener("pointermove", onMove);
}

export function CameraRig() {
  const camera = useThree((s) => s.camera);
  const reduced = useFolio((s) => s.reduced);
  const spring = useSpring(scrollProgress, reduced ? { stiffness: 400, damping: 40 } : { stiffness: 92, damping: 25 });
  const look = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const pose = at(spring.get());
    const px = (mouse.x - 0.5) * (reduced ? 0 : 0.1);
    const py = (mouse.y - 0.5) * (reduced ? 0 : 0.06);
    camera.position.set(pose.pos[0] + px, pose.pos[1] - py, pose.pos[2]);
    look.set(pose.look[0] + px * 0.25, pose.look[1] - py * 0.18, pose.look[2]);
    camera.lookAt(look);
  });
  return null;
}
