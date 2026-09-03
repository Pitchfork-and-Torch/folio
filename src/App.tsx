import { useEffect } from "react";
import { PAGE_HEIGHT } from "./data/desks";
import { A11yOverlay } from "./overlay/A11yOverlay";
import { Hud } from "./overlay/Hud";
import { bindMouse } from "./scene/CameraRig";
import { GrainOverlay, World } from "./scene/World";
import { useScroller } from "./scroll/useScroller";
import { useFolio } from "./store/folio";

export function App() {
  useScroller();
  const reduced = useFolio((s) => s.reduced);
  const setReduced = useFolio((s) => s.setReduced);
  const setBooted = useFolio((s) => s.setBooted);

  useEffect(() => {
    document.documentElement.classList.add("has-js");
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReduced(mq.matches);
      document.documentElement.dataset.reduced = mq.matches ? "true" : "false";
      if (mq.matches) setBooted(true);
    };
    apply();
    mq.addEventListener("change", apply);
    const unbind = bindMouse();
    return () => {
      mq.removeEventListener("change", apply);
      unbind();
    };
  }, [setReduced, setBooted]);

  return (
    <>
      <A11yOverlay />
      <div id="scroll-container">
        <div id="scroll-height" style={{ height: `calc(${PAGE_HEIGHT} * 100svh)` }} />
      </div>
      {reduced ? (
        <div className="poster" role="img" aria-label="Still of the night scriptorium">
          <img src="/poster.jpg" alt="" />
        </div>
      ) : (
        <World />
      )}
      <GrainOverlay />
      <Hud />
    </>
  );
}
