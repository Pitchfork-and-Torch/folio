import * as THREE from "three";

const cache = new Map<string, THREE.CanvasTexture>();

function tex(key: string, w: number, h: number, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) {
  const hit = cache.get(key);
  if (hit) return hit;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  draw(ctx, w, h);
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.needsUpdate = true;
  cache.set(key, t);
  return t;
}

function hash(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function stoneTexture() {
  return tex("stone", 512, 512, (ctx, w, h) => {
    ctx.fillStyle = "#1a1816";
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 1800; i++) {
      const x = hash(i + 1) * w;
      const y = hash(i + 9) * h;
      const s = 4 + hash(i + 21) * 18;
      const v = 18 + hash(i + 3) * 22;
      ctx.fillStyle = `rgba(${v + 8},${v + 4},${v},0.55)`;
      ctx.fillRect(x, y, s, s * (0.4 + hash(i + 7) * 0.8));
    }
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = 2;
    for (let y = 0; y < h; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y + hash(y) * 6);
      ctx.lineTo(w, y + hash(y + 4) * 6);
      ctx.stroke();
    }
    for (let x = 0; x < w; x += 96) {
      ctx.beginPath();
      ctx.moveTo(x + hash(x + 2) * 8, 0);
      ctx.lineTo(x + hash(x + 5) * 8, h);
      ctx.stroke();
    }
  });
}

export function woodTexture() {
  return tex("wood", 256, 256, (ctx, w, h) => {
    ctx.fillStyle = "#3a2616";
    ctx.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y++) {
      const n = 0.85 + hash(y * 0.37) * 0.3;
      ctx.fillStyle = `rgb(${58 * n},${36 * n},${20 * n})`;
      ctx.fillRect(0, y, w, 1);
    }
    ctx.strokeStyle = "rgba(20,10,4,0.35)";
    for (let i = 0; i < 14; i++) {
      ctx.beginPath();
      ctx.moveTo(hash(i) * w, 0);
      ctx.bezierCurveTo(hash(i + 1) * w, h * 0.3, hash(i + 2) * w, h * 0.7, hash(i + 3) * w, h);
      ctx.stroke();
    }
  });
}

export function vellumTexture() {
  return tex("vellum", 256, 256, (ctx, w, h) => {
    ctx.fillStyle = "#e4d4b6";
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 900; i++) {
      const a = 0.04 + hash(i) * 0.07;
      ctx.fillStyle = `rgba(90,60,30,${a})`;
      ctx.fillRect(hash(i + 2) * w, hash(i + 4) * h, 2, 2);
    }
  });
}

type GlyphKind = "rune" | "plant" | "wall" | "title" | "school";

function mark(ctx: CanvasRenderingContext2D, kind: GlyphKind, x: number, y: number, s: number, seed: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((hash(seed) - 0.5) * 0.4);
  ctx.strokeStyle = kind === "plant" ? "#2a3a28" : kind === "school" ? "#3a2a18" : "#1a140e";
  ctx.lineWidth = 1.4 + hash(seed + 3) * 1.6;
  ctx.lineCap = "round";
  const k = Math.floor(hash(seed + 8) * 6);
  ctx.beginPath();
  if (kind === "school") {
    for (let i = 0; i < 7; i++) {
      ctx.moveTo(-s * 0.32 + i * (s * 0.1), s * 0.22);
      ctx.lineTo(-s * 0.32 + i * (s * 0.1), -s * 0.18 - hash(seed + i) * s * 0.12);
    }
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -s * 0.08, s * 0.28, 0, Math.PI * 1.4);
  } else if (k === 0) {
    ctx.arc(0, 0, s * 0.35, 0, Math.PI * 1.7);
  } else if (k === 1) {
    for (let r = 0; r < 3; r++) ctx.arc(0, 0, s * 0.14 * (r + 1), 0, Math.PI * 2);
  } else if (k === 2) {
    for (let i = 0; i < 5; i++) {
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos((i / 5) * Math.PI * 2) * s * 0.4, Math.sin((i / 5) * Math.PI * 2) * s * 0.4);
    }
  } else if (k === 3) {
    ctx.rect(-s * 0.25, -s * 0.25, s * 0.5, s * 0.5);
    ctx.moveTo(-s * 0.1, -s * 0.1);
    ctx.lineTo(s * 0.18, s * 0.18);
  } else if (k === 4) {
    for (let i = 0; i < 6; i++) {
      ctx.moveTo((i - 2.5) * 3, -s * 0.2);
      ctx.lineTo((i - 2.5) * 3 + hash(seed + i) * 4, s * 0.25);
    }
  } else {
    ctx.moveTo(-s * 0.3, s * 0.2);
    ctx.quadraticCurveTo(0, -s * 0.4, s * 0.3, s * 0.15);
    ctx.quadraticCurveTo(0, s * 0.1, -s * 0.15, s * 0.25);
  }
  ctx.stroke();
  if (kind === "plant" && hash(seed + 11) > 0.55) {
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = "#4a2a6a";
    ctx.beginPath();
    ctx.ellipse(s * 0.1, s * 0.15, s * 0.18, s * 0.12, 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function folioTexture(kind: GlyphKind, seed = 1) {
  return tex(`folio-${kind}-${seed}`, 512, 768, (ctx, w, h) => {
    ctx.fillStyle = kind === "title" ? "#d8c9a6" : "#e6d6b4";
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 1400; i++) {
      ctx.fillStyle = `rgba(70,45,20,${0.03 + hash(i + seed) * 0.06})`;
      ctx.fillRect(hash(i + seed * 2) * w, hash(i + seed * 3) * h, 2, 2);
    }
    ctx.fillStyle = "rgba(80,40,90,0.12)";
    ctx.beginPath();
    ctx.ellipse(w * hash(seed + 40), h * hash(seed + 41), 40 + hash(seed) * 50, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    const cols = kind === "wall" ? 5 : 4;
    const rows = kind === "wall" ? 7 : 8;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        mark(
          ctx,
          kind,
          70 + c * ((w - 80) / cols),
          70 + r * ((h - 80) / rows),
          34,
          seed * 17 + r * 13 + c * 29,
        );
      }
    }
    ctx.strokeStyle = "rgba(40,28,16,0.25)";
    ctx.strokeRect(18, 18, w - 36, h - 36);
  });
}

export function inscriptionTexture() {
  return tex("inscribe", 1024, 256, (ctx, w, h) => {
    ctx.fillStyle = "#161412";
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = `rgba(255,230,190,${0.02 + hash(i) * 0.04})`;
      ctx.fillRect(hash(i) * w, hash(i + 2) * h, 3, 3);
    }
    ctx.fillStyle = "#e4d2ae";
    ctx.font = "600 92px 'Clash Display', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("FOLIO", w / 2, h / 2 - 8);
    ctx.font = "500 22px Satoshi, sans-serif";
    ctx.fillStyle = "#b7a27a";
    ctx.fillText("HYPOTHESIS LAB  ·  NOT A SOLVE", w / 2, h / 2 + 58);
  });
}

export function disposeTextures() {
  for (const t of cache.values()) t.dispose();
  cache.clear();
}
