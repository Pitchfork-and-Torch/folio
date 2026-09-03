import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { useFolio } from "../store/folio";
import { CameraRig } from "./CameraRig";
import { Hall } from "./Hall";
import { CatalogWall, InstarSchool, LiberAlcove, ThresholdProps, VoynichBay } from "./Stations";
import { createRenderer } from "./renderer";

function Lights() {
  return (
    <>
      <color attach="background" args={["#08090c"]} />
      <fog attach="fog" args={["#0c0d11", 12, 32]} />
      <hemisphereLight args={["#8e9aab", "#1c1610", 0.38]} />
      <ambientLight intensity={0.22} color="#d7c8ae" />
      <directionalLight position={[4, 8, 14]} intensity={0.45} color="#c9d6e8" />
    </>
  );
}

function HiddenPause() {
  const invalidate = useThree((s) => s.invalidate);
  const set = useThree((s) => s.set);
  useEffect(() => {
    const onVis = () => {
      const hidden = document.hidden;
      set({ frameloop: hidden ? "never" : "always" });
      if (!hidden) invalidate();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [invalidate, set]);
  return null;
}

export function World() {
  const setWebgpu = useFolio((s) => s.setWebgpu);
  const setBooted = useFolio((s) => s.setBooted);

  return (
    <Canvas
      className="folio-canvas"
      dpr={[1, 1.4]}
      shadows={false}
      camera={{ fov: 34, near: 0.14, far: 48, position: [0, 1.5, 16.9] }}
      gl={(props) => {
        setWebgpu(false);
        return createRenderer(props);
      }}
      onCreated={() => setBooted(true)}
    >
      <Suspense fallback={null}>
        <HiddenPause />
        <Lights />
        <Hall />
        <ThresholdProps />
        <LiberAlcove />
        <VoynichBay />
        <InstarSchool />
        <CatalogWall />
        <CameraRig />
      </Suspense>
    </Canvas>
  );
}

export function GrainOverlay() {
  return <div className="grain" aria-hidden="true" />;
}
