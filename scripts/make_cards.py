# -*- coding: utf-8 -*-
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
MASTERS = ROOT / "assets" / "masters"
MASTERS.mkdir(parents=True, exist_ok=True)
PUBLIC.mkdir(parents=True, exist_ok=True)

HALL = MASTERS / "hall-wide.jpg"
if not HALL.exists():
    raise SystemExit("missing assets/masters/hall-wide.jpg")

def cover(src: Path, size: tuple[int, int]) -> Image.Image:
    im = Image.open(src).convert("RGB")
    return ImageOps.fit(im, size, method=Image.Resampling.LANCZOS, centering=(0.5, 0.45))

def font(path_list, size):
    for p in path_list:
        fp = Path(p)
        if fp.exists():
            try:
                return ImageFont.truetype(str(fp), size)
            except OSError:
                pass
    return ImageFont.load_default()

clash = [
    Path.home() / "design-assets/fontshare/clash-display/otf/ClashDisplay-Bold.otf",
    Path.home() / "design-assets/fontshare/clash-display/otf/ClashDisplay-Semibold.otf",
]
satoshi = [
    Path.home() / "design-assets/fontshare/satoshi/otf/Satoshi-Medium.otf",
    Path.home() / "design-assets/fontshare/satoshi/otf/Satoshi-Regular.otf",
]

og = cover(hall, (1200, 630))
shade = Image.new("RGB", og.size, (7, 8, 12))
mask = Image.new("L", og.size, 0)
md = ImageDraw.Draw(mask)
md.rectangle((0, 0, 620, 630), fill=210)
mask = mask.filter(ImageFilter.GaussianBlur(48))
og = Image.composite(Image.blend(og, shade, 0.55), og, mask)
draw = ImageDraw.Draw(og)
f_title = font(clash, 92)
f_sub = font(satoshi, 28)
f_small = font(satoshi, 20)
draw.text((72, 188), "FOLIO", font=f_title, fill=(232, 220, 200))
draw.text((74, 300), "Ongoing research desks", font=f_sub, fill=(201, 162, 39))
draw.text((74, 352), "Liber Primus  ·  Voynich  ·  hypothesis only", font=f_small, fill=(183, 162, 122))
og.save(PUBLIC / "og.jpg", "JPEG", quality=90, optimize=True)
og.save(PUBLIC / "share-card.jpg", "JPEG", quality=90, optimize=True)
og.save(PUBLIC / "og.png", "PNG")

poster = cover(hall, (1920, 1080))
poster.save(PUBLIC / "poster.jpg", "JPEG", quality=88, optimize=True)

hive = cover(hall, (1280, 720))
hive_dir = MASTERS
hive.save(MASTERS / "hive-1280x720.jpg", "JPEG", quality=88, optimize=True)

# icons
for size, name in ((192, "icon-192.png"), (512, "icon-512.png")):
    im = Image.new("RGB", (size, size), (7, 8, 12))
    d = ImageDraw.Draw(im)
    pad = int(size * 0.22)
    d.rectangle((pad, int(size * 0.14), size - pad, int(size * 0.86)), fill=(232, 220, 200))
    ink = (26, 20, 14)
    y = int(size * 0.32)
    for _ in range(4):
        d.rectangle((int(size * 0.32), y, int(size * 0.68), y + max(2, size // 64)), fill=ink)
        y += int(size * 0.1)
    im.save(PUBLIC / name, "PNG")

print("cards ok", PUBLIC / "og.jpg", (PUBLIC / "og.jpg").stat().st_size)
