export type DeskId = "threshold" | "liber" | "voynich" | "instar" | "catalog";

export interface Desk {
  id: DeskId;
  hash: string;
  kicker: string;
  title: string;
  status: string;
  lede: string;
  facts: string[];
  href?: string;
  hrefLabel?: string;
  range: { start: number; end: number };
}

export const PAGE_HEIGHT = 6;

export const DESKS: Desk[] = [
  {
    id: "threshold",
    hash: "#enter",
    kicker: "Night archive",
    title: "Folio",
    status: "Ongoing desks",
    lede: "Each room is a different desk. Hypothesis only.",
    facts: [
      "Three desks are live: Liber Primus, Beinecke MS 408, and the INSTAR school.",
      "Invented glyphs in this hall are set dressing. They are not manuscript pages.",
      "The school teaches. These other desks are the honest receipts.",
    ],
    range: { start: 0, end: 0.18 },
  },
  {
    id: "liber",
    hash: "#liber",
    kicker: "Desk 01",
    title: "Liber Primus",
    status: "Unsolved",
    lede: "Cicada 3301 Liber Primus. Hypothesis lab. Not a solve.",
    facts: [
      "LP1 00-16 and LP2 56 AN END / 57 PARABLE are community-known calibration.",
      "LP2 pages 0-55 remain unsolved (~12956 runes, IOC ~0.03448).",
      "Eight named cipher families burned 2026-08-14. All FAIL. No new public method since.",
    ],
    href: "https://github.com/Pitchfork-and-Torch/liber-research",
    hrefLabel: "Open liber-research",
    range: { start: 0.18, end: 0.4 },
  },
  {
    id: "voynich",
    hash: "#voynich",
    kicker: "Desk 02",
    title: "Voynich",
    status: "Not a translation",
    lede: "Beinecke MS 408. Hypothesis gloss only. Not a translation.",
    facts: [
      "Passes 1-7: folio walks on f1r, f9v, f10v, f99r, f99v, f65r, f41v.",
      "Pass 8: leftover herbal token keerodal is still unique. Not a plant name.",
      "Herbal-A label gauntlet: FAIL. Next folio waits on a named gate.",
    ],
    href: "https://github.com/Pitchfork-and-Torch/voynich-research",
    hrefLabel: "Open voynich-research",
    range: { start: 0.4, end: 0.58 },
  },
  {
    id: "instar",
    hash: "#instar",
    kicker: "Desk 03",
    title: "The School",
    status: "Teaching",
    lede: "INSTAR. Seven molts for the cryptography Cicada actually used. Not this hall's unsolved pages.",
    facts: [
      "Hello is not the first lock. Workbench stays open. Skins rail stays hidden by default.",
      "Futhorc sound values, not Liber Primus gematria. Not a recruiter. Not affiliated with 3301.",
      "The school is live. This lectern is a sign, not a spoiler sheet.",
    ],
    href: "https://instar.jonbailey.xyz/",
    hrefLabel: "Open INSTAR",
    range: { start: 0.58, end: 0.78 },
  },
  {
    id: "catalog",
    hash: "#catalog",
    kicker: "Wall",
    title: "Catalog",
    status: "More desks later",
    lede: "More notes when they are public. The school already has a lectern.",
    facts: [
      "Notes stay on GitHub. This site does not host page images or rune dumps.",
      "INSTAR teaches. Liber and Voynich desks keep the receipts.",
      "Plain-text dossier: use the accessibility page if the canvas fails you.",
    ],
    href: "https://github.com/Pitchfork-and-Torch",
    hrefLabel: "Pitchfork-and-Torch on GitHub",
    range: { start: 0.78, end: 1 },
  },
];

export function deskAt(progress: number): Desk {
  const p = Math.min(1, Math.max(0, progress));
  for (const desk of DESKS) {
    if (p < desk.range.end) return desk;
  }
  return DESKS[DESKS.length - 1];
}

export const RELATED = [
  {
    title: "liber-research",
    note: "LP2 0-55 still sealed.",
    href: "https://github.com/Pitchfork-and-Torch/liber-research",
  },
  {
    title: "voynich-research",
    note: "Hypothesis gloss only.",
    href: "https://github.com/Pitchfork-and-Torch/voynich-research",
  },
  {
    title: "INSTAR",
    note: "Seven-molt school. Desk 03 in this hall.",
    href: "https://instar.jonbailey.xyz/",
  },
];
