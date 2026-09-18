import { motionValue } from "motion/react";
import { create } from "zustand";
import { DESKS, deskAt, type DeskId } from "../data/desks";

export const scrollProgress = motionValue(0);

type FolioState = {
  desk: DeskId;
  booted: boolean;
  reduced: boolean;
  setDesk: (id: DeskId) => void;
  setBooted: (v: boolean) => void;
  setReduced: (v: boolean) => void;
};

export const LAST_DESK_KEY = "folio.last-desk";

export function readLastDeskHash(): string {
  try {
    return localStorage.getItem(LAST_DESK_KEY) || "";
  } catch {
    return "";
  }
}

export function writeLastDeskHash(hash: string) {
  try {
    localStorage.setItem(LAST_DESK_KEY, hash);
  } catch {
    /* private mode */
  }
}

export const useFolio = create<FolioState>((set) => ({
  desk: "threshold",
  booted: false,
  reduced: false,
  setDesk: (desk) => {
    const row = DESKS.find((d) => d.id === desk);
    if (row) writeLastDeskHash(row.hash);
    set({ desk });
  },
  setBooted: (booted) => set({ booted }),
  setReduced: (reduced) => set({ reduced }),
}));

export function syncDeskFromProgress(progress: number) {
  const next = deskAt(progress).id;
  const cur = useFolio.getState().desk;
  if (next !== cur) useFolio.getState().setDesk(next);
}

export function deskByHash(hash: string) {
  return DESKS.find((d) => d.hash === hash);
}
