import Lenis from "lenis";
import { useEffect } from "react";
import { PAGE_HEIGHT } from "../data/desks";
import { deskByHash, readLastDeskHash, scrollProgress, syncDeskFromProgress } from "../store/folio";

let lenisRef: Lenis | null = null;

export function getLenis() {
  return lenisRef;
}

export function scrollToHash(hash: string) {
  const desk = deskByHash(hash);
  const lenis = lenisRef;
  if (!desk || !lenis) return;
  const limit = lenis.limit || 1;
  const t = desk.id === "threshold" ? 0 : (desk.range.start + desk.range.end) / 2;
  // prefers-reduced-motion: jump immediately. Lerp=1 alone still eases when
  // immediate is false (nav / hash restore / last-desk). Distinct from lerp MQ sync.
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  lenis.scrollTo(t * limit, { immediate: reduce });
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

    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lenis = new Lenis({
      wrapper,
      content,
      lerp: motionMq.matches ? 1 : 0.11,
      wheelMultiplier: 0.88,
      touchMultiplier: 1.15,
    });
    lenisRef = lenis;

    // App swaps World/poster when reduced-motion flips, but Lenis was constructed
    // once with a frozen lerp. Keep scroll smoothing in lockstep with the MQ.
    const syncLerp = () => {
      lenis.options.lerp = motionMq.matches ? 1 : 0.11;
    };
    motionMq.addEventListener("change", syncLerp);

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

    // Last-desk restore is boot-only. An empty hash on hashchange means the
    // user cleared the fragment; do not resurrect the persisted desk.
    const applyHash = (allowLastDesk: boolean) => {
      if (location.hash) {
        scrollToHash(location.hash);
        return;
      }
      if (!allowLastDesk) return;
      const last = readLastDeskHash();
      if (last) scrollToHash(last);
    };
    const onHashChange = () => applyHash(false);
    window.addEventListener("hashchange", onHashChange);
    requestAnimationFrame(() => applyHash(true));

    // Lenis caches limit from content height. Without resize, hash scrolls and
    // desk sync drift after orientation / viewport changes (mobile URL bar,
    // window chrome). Distinct from waiting for the first non-zero limit.
    // Mobile URL-bar show/hide often fires visualViewport.resize without a
    // matching window.resize, so listen to both (≠ window-only cook #5).
    const onResize = () => {
      lenis.resize();
    };
    window.addEventListener("resize", onResize);
    const vv = window.visualViewport;
    vv?.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("resize", onResize);
      vv?.removeEventListener("resize", onResize);
      motionMq.removeEventListener("change", syncLerp);
      lenis.destroy();
      lenisRef = null;
    };
  }, []);
}
