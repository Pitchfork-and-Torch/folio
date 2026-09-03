# Folio (folder rules)

Night scriptorium for ongoing public research desks.

## World

A black-letter night archive. One stone hall. Scroll walks the aisle.
Each desk is a lectern. Hanging sheets are invented glyphs, never real
Liber Primus JPEGs and never Beinecke MS 408 folios.

## Do

- Public ship is allowed. Live: https://folio.jonbailey.xyz/
- Only ship path: `.\deploy.ps1` (Pages `folio-jonbailey`).
- Build first: `npm run build`. Deploy `dist/`.
- Type: Fontshare Clash Display + Satoshi under `public/fonts/fontshare/`.
  Period-world override is the hall itself, not a second type family.
- Palette: night, bone, oak, oxblood, verdigris, candle gold.
- ASCII punctuation in new copy (` - `, not em dashes).
- Honesty rails: not a solve, not a translation, not a recruiter.
- Do not link unpublished research archives.
- Hits slug: `folio`. OG: `/og.jpg?v=` bump on card change.

## Do not

- Host manuscript page images or the rtkd rune dump.
- Claim a Liber Primus plaintext or a Voynich reading.
- Clone shader.se beige office / CRT / shredder.
- Run `npm run dev` as a never-exit child of an agent job.

## Layout of truth

| Path | Role |
|------|------|
| `src/data/desks.ts` | Camera chapters + public copy |
| `src/scene/` | Hall, lecterns, camera |
| `src/overlay/` | HUD + clipped semantic overlay |
| `public/` | SEO, fonts, OG, a11y page |
| `assets/masters/` | Unscaled stills. Do not overwrite with crops. |

## Desks

Add a row in `src/data/desks.ts`, a camera key in `CameraRig.tsx`, and a station in `Stations.tsx`.
v1.3 has five desks (threshold, liber, voynich, instar, catalog). Do not add a sixth without a new aisle pose.
