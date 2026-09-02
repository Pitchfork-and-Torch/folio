# -*- coding: utf-8 -*-
from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
PUB = ROOT / "public"
OUT = PUB / "mats"
OUT.mkdir(parents=True, exist_ok=True)

sources = [
    PUB / "plates" / "liber-slate-tall.jpg",
    PUB / "plates" / "liber-slate-broken.jpg",
    PUB / "plates" / "liber-wax.jpg",
    PUB / "mats" / "flagstone.jpg",
    PUB / "mats" / "oak.jpg",
    PUB / "mats" / "wall.jpg",
]


def bump(src: Path) -> None:
    if not src.exists():
        print("skip", src.name)
        return
    g = Image.open(src).convert("L")
    g = ImageOps.autocontrast(g, cutoff=2)
    g = ImageEnhance.Contrast(g).enhance(1.35)
    g = g.filter(ImageFilter.UnsharpMask(radius=1.4, percent=140, threshold=2))
    dest = OUT / (src.stem + "-bump.jpg")
    g.save(dest, "JPEG", quality=88, optimize=True)
    print("bump", dest.name, dest.stat().st_size)


for p in sources:
    bump(p)
