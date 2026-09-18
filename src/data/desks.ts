export type DeskId = "threshold" | "liber" | "voynich" | "instar" | "gauntlet" | "catalog";

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

export const PAGE_HEIGHT = 7.5;

export const DESKS: Desk[] = [
  {
    id: "threshold",
    hash: "#enter",
    kicker: "Night archive",
    title: "Folio",
    status: "Ongoing desks",
    lede: "Each room is a different desk. Hypothesis only.",
    facts: [
      "Four desks are live: Liber Primus, Beinecke MS 408, the INSTAR school, and the cipher gauntlet.",
      "Invented glyphs in this hall are set dressing. They are not manuscript pages.",
      "The school teaches. The other desks keep the honest receipts.",
    ],
    range: { start: 0, end: 0.14 },
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
      "Burned cipher families live on the next lectern. These pages stay unsolved.",
    ],
    href: "https://github.com/Pitchfork-and-Torch/liber-research",
    hrefLabel: "Open liber-research",
    range: { start: 0.14, end: 0.32 },
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
    range: { start: 0.32, end: 0.48 },
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
    range: { start: 0.48, end: 0.64 },
  },
  {
    id: "gauntlet",
    hash: "#gauntlet",
    kicker: "Desk 04",
    title: "Gauntlet",
    status: "All FAIL",
    lede: "Eight named cipher families burned 2026-08-14. Receipts only. Not a new method.",
    facts: [
      "outguess, book-index, running-key, periodic, columnar, word-unit, acrostic, homophonic.",
      "All FAIL. No new 3301 English. No ninth family invented here.",
      "Do not recook these families. Notes stay on GitHub.",
    ],
    href: "https://github.com/Pitchfork-and-Torch/liber-research",
    hrefLabel: "Open liber-research",
    range: { start: 0.64, end: 0.84 },
  },
  {
    id: "catalog",
    hash: "#catalog",
    kicker: "Wall",
    title: "Catalog",
    status: "More desks later",
    lede: "More notes when they are public.",
    facts: [
      "Notes stay on GitHub. This site does not host page images or rune dumps.",
      "INSTAR teaches. Liber, Voynich, and Gauntlet keep the receipts.",
      "Plain-text dossier: use the accessibility page if the canvas fails you.",
    ],
    href: "https://github.com/Pitchfork-and-Torch",
    hrefLabel: "Pitchfork-and-Torch on GitHub",
    range: { start: 0.84, end: 1 },
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
  {
    title: "Gauntlet",
    note: "Eight families. All FAIL.",
    href: "https://github.com/Pitchfork-and-Torch/liber-research",
  },
];
