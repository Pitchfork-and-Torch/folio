import Lenis from "lenis";
import { useEffect } from "react";
import { PAGE_HEIGHT } from "../data/desks";
import { deskByHash, scrollProgress, syncDeskFromProgress } from "../store/folio";

let lenisRef: Lenis | null = null;

export function getLenis() {
  return lenisRef;
}

export function scrollToHash(hash: string) {
  const desk = deskByHash(hash);
  const lenis = lenisRef;
  if (!desk || !lenis) return;
  const limit = lenis.limit || 1;
  lenis.scrollTo(desk.range.start * limit, { immediate: false });
}

export function useScroller() {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--page-height", String(PAGE_HEIGHT));
    root.style.setProperty("--vh", "1svh");
    root.style.setProperty("--vw", "1svw");

    const wrapper = document.getElementById("scroll-container");
    const content = document.getElementById("scroll-height");
    if (!wrapper || !content) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = new Lenis({
      wrapper,
      content,
      lerp: reduced ? 1 : 0.11,
      wheelMultiplier: 0.88,
      touchMultiplier: 1.15,
    });
    lenisRef = lenis;

    const onScroll = () => {
      const limit = lenis.limit || 1;
      const p = limit > 0 ? lenis.scroll / limit : 0;
      scrollProgress.set(p);
      syncDeskFromProgress(p);
    };
    lenis.on("scroll", onScroll);

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const applyHash = () => {
      if (location.hash) scrollToHash(location.hash);
    };
    window.addEventListener("hashchange", applyHash);
    requestAnimationFrame(applyHash);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("hashchange", applyHash);
      lenis.destroy();
      lenisRef = null;
    };
  }, []);
}
