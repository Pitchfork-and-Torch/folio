# -*- coding: utf-8 -*-
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

HOME = Path.home()
SRC = HOME / ".grok" / "sessions" / "C%3A%5CUsers%5CKnock" / "01a0173c-d397-7fe2-87f1-32b2f76b31ea" / "images"
ROOT = Path(__file__).resolve().parents[1]
MASTERS = ROOT / "assets" / "masters" / "plates"
PUB = ROOT / "public" / "plates"
MATS = ROOT / "public" / "mats"
MASTERS.mkdir(parents=True, exist_ok=True)
PUB.mkdir(parents=True, exist_ok=True)
MATS.mkdir(parents=True, exist_ok=True)


def save_master(im: Image.Image, name: str) -> Path:
    p = MASTERS / name
    rgb = im.convert("RGB")
    rgb.save(p, "JPEG", quality=92, optimize=True)
    return p


def pub_jpg(im: Image.Image, dest: Path, size: tuple[int, int] | None = None) -> None:
    rgb = im.convert("RGB")
    if size:
        rgb = ImageOps.fit(rgb, size, method=Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    rgb.save(dest, "JPEG", quality=86, optimize=True)


def crop(im: Image.Image, box):
    w, h = im.size
    l, t, r, b = box
    return im.crop((int(l * w), int(t * h), int(r * w), int(b * h)))


jobs = {
    "liber-slate-tall.jpg": (SRC / "7.jpg", (0.12, 0.04, 0.88, 0.90)),
    "liber-slate-broken.jpg": (SRC / "8.jpg", (0.18, 0.04, 0.82, 0.86)),
    "liber-wax.jpg": (SRC / "4.jpg", (0.12, 0.10, 0.88, 0.90)),
    "voynich-herbal-open.jpg": (SRC / "6.jpg", (0.08, 0.10, 0.78, 0.88)),
    "voynich-study-bulb.jpg": (SRC / "10.jpg", (0.04, 0.02, 0.96, 0.98)),
    "voynich-study-lily.jpg": (SRC / "5.jpg", (0.04, 0.02, 0.96, 0.86)),
    "catalog-star.jpg": (SRC / "3.jpg", (0.04, 0.04, 0.96, 0.96)),
    "catalog-iron.jpg": (SRC / "9.jpg", (0.0, 0.0, 1.0, 1.0)),
}

for name, (src, box) in jobs.items():
    im = Image.open(src)
    cut = crop(im, box)
    save_master(cut, name)
    pub_jpg(cut, PUB / name)

floor = Image.open(SRC / "13.jpg").convert("RGB")
# Clone out the candle blob so the floor can tile.
px, py = int(floor.width * 0.50), int(floor.height * 0.48)
patch = floor.crop((px - 90, py + 70, px + 90, py + 180))
floor.paste(patch, (px - 90, py - 55))
save_master(floor, "flagstone.jpg")
pub_jpg(floor, MATS / "flagstone.jpg", (1024, 1024))

oak = Image.open(SRC / "12.jpg")
save_master(oak, "oak.jpg")
pub_jpg(oak, MATS / "oak.jpg", (1024, 1024))

# OG / poster / hive from two real plates, type in Clash.
left = Image.open(PUB / "liber-slate-tall.jpg").convert("RGB")
right = Image.open(PUB / "voynich-herbal-open.jpg").convert("RGB")
W, H = 1200, 630
og = Image.new("RGB", (W, H), (8, 8, 10))
L = ImageOps.fit(left, (640, H), centering=(0.5, 0.4))
R = ImageOps.fit(right, (700, H), centering=(0.45, 0.45))
og.paste(L, (0, 0))
og.paste(R, (540, 0))
shade = Image.new("L", (W, H), 0)
sd = ImageDraw.Draw(shade)
sd.rectangle((0, 0, 520, H), fill=200)
shade = shade.filter(ImageFilter.GaussianBlur(42))
dark = Image.new("RGB", (W, H), (6, 6, 8))
og = Image.composite(Image.blend(og, dark, 0.42), og, shade)
draw = ImageDraw.Draw(og)
clash = HOME / "design-assets/fontshare/clash-display/otf/ClashDisplay-Bold.otf"
sat = HOME / "design-assets/fontshare/satoshi/otf/Satoshi-Medium.otf"
ft = ImageFont.truetype(str(clash), 88) if clash.exists() else ImageFont.load_default()
fs = ImageFont.truetype(str(sat), 26) if sat.exists() else ImageFont.load_default()
draw.text((64, 196), "FOLIO", font=ft, fill=(232, 220, 200))
draw.text((68, 304), "Two desks. Two materials.", font=fs, fill=(201, 162, 39))
draw.text((68, 348), "Slate  ·  vellum  ·  hypothesis only", font=fs, fill=(183, 162, 122))
og.save(ROOT / "public" / "og.jpg", "JPEG", quality=90, optimize=True)
og.save(ROOT / "public" / "share-card.jpg", "JPEG", quality=90, optimize=True)
og.save(ROOT / "public" / "og.png", "PNG")
poster = ImageOps.fit(og, (1920, 1080))
poster.save(ROOT / "public" / "poster.jpg", "JPEG", quality=88, optimize=True)
hive = ImageOps.fit(og, (1280, 720))
hive.save(ROOT / "assets" / "masters" / "hive-1280x720.jpg", "JPEG", quality=88, optimize=True)
print("plates", len(list(PUB.glob("*.jpg"))), "ok")
