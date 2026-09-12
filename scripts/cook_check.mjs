#!/usr/bin/env node
/**
 * Folio cook check. ASCII. No deploy. No cipher engine.
 * Locks six desks, eight burned families, skip+main, honesty copy.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fails = [];

const FAMILIES = [
  "outguess",
  "book-index",
  "running-key",
  "periodic",
  "columnar",
  "word-unit",
  "acrostic",
  "homophonic",
];
const DESK_IDS = ["threshold", "liber", "voynich", "instar", "gauntlet", "catalog"];
const SKIP_DIRS = new Set(["node_modules", "dist", "fonts", "verify", "assets"]);
const TEXT_EXT = new Set([".ts", ".tsx", ".js", ".mjs", ".css", ".html", ".md", ".txt", ".xml", ".json"]);

function fail(msg) {
  fails.push(msg);
}

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

function parseFamilies(src) {
  const m = src.match(/export const GAUNTLET_FAMILIES = \[([\s\S]*?)\] as const;/);
  if (!m) return [];
  return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
}

function parseDesks(src) {
  const m = src.match(/export const DESKS: Desk\[] = \[([\s\S]*?)\];\r?\n\r?\nexport function deskAt/);
  if (!m) return [];
  const rows = [];
  const re = /id:\s*"(\w+)"[\s\S]*?range:\s*\{\s*start:\s*([\d.]+),\s*end:\s*([\d.]+)/g;
  let hit;
  while ((hit = re.exec(m[1]))) {
    rows.push({ id: hit[1], start: Number(hit[2]), end: Number(hit[3]) });
  }
  return rows;
}

function deskAt(rows, progress) {
  const p = Math.min(1, Math.max(0, progress));
  for (const desk of rows) {
    if (p < desk.end) return desk;
  }
  return rows[rows.length - 1];
}

const desksSrc = read("src/data/desks.ts");
const families = parseFamilies(desksSrc);
if (families.join("|") !== FAMILIES.join("|")) {
  fail("GAUNTLET_FAMILIES drift: " + families.join(", "));
}
if (families.length !== 8) fail("gauntlet must be exactly 8 families");
if (desksSrc.includes("ninth family invented here") === false) {
  fail("desks.ts missing no-ninth-family honesty");
}

const instarMolts = desksSrc.match(/export const INSTAR_MOLTS = (\d+)/);
if (!instarMolts || instarMolts[1] !== "7") fail("INSTAR_MOLTS must be 7");

const rows = parseDesks(desksSrc);
if (rows.map((r) => r.id).join("|") !== DESK_IDS.join("|")) {
  fail("desk ids drift: " + rows.map((r) => r.id).join(", "));
}
if (rows.length !== 6) fail("exactly six desks (do not add a seventh)");
if (rows[0]?.start !== 0) fail("first desk start must be 0");
if (rows[rows.length - 1]?.end !== 1) fail("last desk end must be 1");
for (let i = 1; i < rows.length; i++) {
  if (rows[i].start !== rows[i - 1].end) {
    fail(`range gap at ${rows[i].id}: ${rows[i - 1].end} != ${rows[i].start}`);
  }
}

const expectDesk = [
  [-1, "threshold"],
  [0, "threshold"],
  [0.139, "threshold"],
  [0.14, "liber"],
  [0.32, "voynich"],
  [0.48, "instar"],
  [0.64, "gauntlet"],
  [0.74, "gauntlet"],
  [0.84, "catalog"],
  [1, "catalog"],
  [2, "catalog"],
];
for (const [p, id] of expectDesk) {
  const got = deskAt(rows, p).id;
  if (got !== id) fail(`deskAt(${p}) => ${got}, want ${id}`);
}

const stations = read("src/scene/Stations.tsx");
if (!stations.includes("GAUNTLET_FAMILIES.length")) {
  fail("GauntletBay seals must follow GAUNTLET_FAMILIES.length");
}
if (!stations.includes("INSTAR_MOLTS")) {
  fail("InstarSchool molts must follow INSTAR_MOLTS");
}
const gauntletFn = stations.match(/export function GauntletBay\(\) \{([\s\S]*?)\n\}/);
if (!gauntletFn) fail("GauntletBay missing");
else if (/length:\s*8/.test(gauntletFn[1])) fail("GauntletBay still hardcodes length 8");
const instarFn = stations.match(/export function InstarSchool\(\) \{([\s\S]*?)\n\}/);
if (!instarFn) fail("InstarSchool missing");
else if (/length:\s*7/.test(instarFn[1])) fail("InstarSchool still hardcodes length 7");

const camera = read("src/scene/CameraRig.tsx");
const keys = [...camera.matchAll(/\{\s*t:\s*[\d.]+/g)];
if (keys.length !== 7) fail(`CameraRig KEYS want 7 poses, got ${keys.length}`);

const app = read("src/App.tsx");
if (!app.includes('fallback.setAttribute("inert"')) {
  fail("App must inert the no-JS fallback after boot");
}
const css = read("src/styles.css");
if (!css.includes("html.has-js .plain-fallback") || !css.includes("visibility: hidden")) {
  fail("has-js fallback must be visibility hidden so it leaves the tab order");
}

const overlay = read("src/overlay/A11yOverlay.tsx");
if (!overlay.includes('href="#main"')) fail("A11yOverlay skip must target #main");
if (!overlay.includes('id="main"')) fail("A11yOverlay missing main#main");
if (!overlay.includes("<main")) fail("A11yOverlay missing main landmark");

const hud = read("src/overlay/Hud.tsx");
if (!hud.includes("gauntletFamilyLine")) fail("Hud gauntlet caption must list families");
if (!hud.includes('aria-current={d.id === deskId ? "page" : undefined}')) {
  fail("Hud island nav missing aria-current");
}

const a11y = read("public/a11y.html");
if (!/<a class="skip" href="#main">/.test(a11y)) fail("a11y.html missing skip to #main");
if (!/<main id="main"[\s>]/.test(a11y)) fail("a11y.html missing main#main");
for (const fam of FAMILIES) {
  if (!a11y.includes(fam)) fail("a11y.html missing family " + fam);
}
if (!a11y.includes("No ninth family")) fail("a11y.html missing no-ninth honesty");

const index = read("index.html");
if (!index.includes('href="#liber-plain"')) fail("index.html missing no-JS skip to desks");
if (!index.includes('id="catalog-plain"')) fail("index.html missing catalog fallback");
if (!index.includes("Did the cipher gauntlet produce a new Liber Primus method?")) {
  fail("index.html FAQ missing gauntlet question");
}
if (index.includes("two oak lecterns")) fail("OG alt still says two oak lecterns");
for (const fam of FAMILIES) {
  if (!index.includes(fam)) fail("index.html missing family " + fam);
}

const llms = read("public/llms.txt");
const readme = read("README.md");
const pkg = JSON.parse(read("package.json"));
if (pkg.scripts?.test !== "node scripts/cook_check.mjs") fail("package.json test script missing");
if (/WebGPU first/i.test(readme)) fail("README still claims WebGPU first");
if (!readme.includes("WebGL")) fail("README should say WebGL");

const lockFiles = {
  "src/data/desks.ts": desksSrc,
  "index.html": index,
  "public/a11y.html": a11y,
  "public/llms.txt": llms,
  "README.md": readme,
};
for (const [rel, text] of Object.entries(lockFiles)) {
  for (const fam of FAMILIES) {
    if (!text.includes(fam)) fail(`${rel} missing family ${fam}`);
  }
  if (!/all FAIL/i.test(text) && rel !== "README.md") {
    fail(`${rel} missing All FAIL`);
  }
}

for (const rel of ["index.html", "public/a11y.html", "src/data/desks.ts", "README.md", "public/llms.txt"]) {
  const text = read(rel);
  if (!/not a solve/i.test(text)) fail(`${rel} missing not-a-solve`);
  if (!/not a translation/i.test(text)) fail(`${rel} missing not-a-translation`);
}

const solveRx = [
  /solved liber primus/i,
  /liber primus (is|has been) solved/i,
  /we (have )?(solved|cracked|broken) (page|liber|cicada)/i,
  /this (is|repo) (a |the )?(cicada )?solve\b/i,
  /voynich (is|has been) translated/i,
  /ninth family invented here(?!\.)/i,
];
const dashRx = new RegExp(
  "[" + String.fromCharCode(0x2013, 0x2014) + "]|&mdash;|&ndash;|" +
    String.fromCharCode(0x00e2, 0x20ac, 0x201d) + "|" +
    String.fromCharCode(0x00e2, 0x20ac, 0x201c),
);

const scanRoots = [path.join(ROOT, "src"), path.join(ROOT, "public"), path.join(ROOT, "scripts"), ROOT];
const files = [];
for (const dir of scanRoots) {
  if (dir === ROOT) {
    for (const name of fs.readdirSync(ROOT)) {
      const p = path.join(ROOT, name);
      if (fs.statSync(p).isFile()) files.push(p);
    }
  } else {
    walk(dir, files);
  }
}

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  if (!TEXT_EXT.has(ext)) continue;
  const rel = path.relative(ROOT, file).replaceAll("\\", "/");
  if (rel.startsWith("public/fonts/")) continue;
  const text = fs.readFileSync(file, "utf8");
  if (dashRx.test(text) && !rel.endsWith("cook_check.mjs")) {
    fail(`fancy dash in ${rel}`);
  }
  if (rel !== "scripts/cook_check.mjs") {
    for (const rx of solveRx) {
      if (rx.test(text)) fail(`solve-claim shape in ${rel}: ${rx}`);
    }
  }
}

const headers = read("public/_headers");
if (!headers.includes("https://hits.jonbailey.xyz")) fail("_headers missing hits CSP");
if (!index.includes('data-site="folio"')) fail("index.html missing hits slug folio");
if (!a11y.includes('data-site="folio"')) fail("a11y.html missing hits slug folio");

if (fails.length) {
  console.error("COOK CHECK FAIL");
  for (const item of fails) console.error("  " + item);
  process.exit(1);
}
console.log("COOK OK");
console.log("  desks " + DESK_IDS.join(", "));
console.log("  families " + FAMILIES.length + " FAIL");
console.log("  skip+main locked");
