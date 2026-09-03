import { motionValue } from "motion/react";
import { create } from "zustand";
import { DESKS, deskAt, type DeskId } from "../data/desks";

export const scrollProgress = motionValue(0);

type FolioState = {
  desk: DeskId;
  booted: boolean;
  reduced: boolean;
  webgpu: boolean;
  setDesk: (id: DeskId) => void;
  setBooted: (v: boolean) => void;
  setReduced: (v: boolean) => void;
  setWebgpu: (v: boolean) => void;
};

export const useFolio = create<FolioState>((set) => ({
  desk: "threshold",
  booted: false,
  reduced: false,
  webgpu: false,
  setDesk: (desk) => set({ desk }),
  setBooted: (booted) => set({ booted }),
  setReduced: (reduced) => set({ reduced }),
  setWebgpu: (webgpu) => set({ webgpu }),
}));

export function syncDeskFromProgress(progress: number) {
  const next = deskAt(progress).id;
  const cur = useFolio.getState().desk;
  if (next !== cur) useFolio.getState().setDesk(next);
}

export function deskByHash(hash: string) {
  return DESKS.find((d) => d.hash === hash);
}
