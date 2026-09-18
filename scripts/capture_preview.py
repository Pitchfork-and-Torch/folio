# -*- coding: utf-8 -*-
"""One-shot local preview screenshots. Starts a thread server, exits."""
from __future__ import annotations

import http.server
import socketserver
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
OUT = ROOT / "verify"
OUT.mkdir(exist_ok=True)
PORT = 8768


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIST), **kwargs)

    def log_message(self, fmt, *args):
        return


def main():
    httpd = socketserver.TCPServer(("127.0.0.1", PORT), Handler)
    t = threading.Thread(target=httpd.serve_forever, daemon=True)
    t.start()
    url = f"http://127.0.0.1:{PORT}/"
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            titles = {
                "enter": "Folio",
                "liber": "Liber Primus",
                "voynich": "Voynich",
                "instar": "The School",
                "gauntlet": "Gauntlet",
                "catalog": "Catalog",
            }
            for name, size in (("desktop", (1440, 900)), ("mobile", (390, 844))):
                page = browser.new_page(viewport={"width": size[0], "height": size[1]})
                page.goto(url, wait_until="networkidle", timeout=60000)
                page.wait_for_timeout(3500)
                page.screenshot(path=str(OUT / f"{name}.png"), full_page=False)
                for h, title in titles.items():
                    page.evaluate("(id) => { location.hash = '#' + id }", h)
                    page.wait_for_function(
                        "(t) => document.querySelector('.caption h2')?.textContent?.trim() === t",
                        arg=title,
                        timeout=12000,
                    )
                    page.wait_for_timeout(3200)
                    page.screenshot(path=str(OUT / f"{name}-{h}.png"), full_page=False)
                page.close()
            reduced = browser.new_page(viewport={"width": 1440, "height": 900})
            reduced.emulate_media(reduced_motion="reduce")
            reduced.goto(url + "#gauntlet", wait_until="networkidle", timeout=60000)
            reduced.wait_for_timeout(1500)
            reduced.screenshot(path=str(OUT / "reduced-gauntlet.png"))
            reduced.close()
            # a11y page
            page = browser.new_page(viewport={"width": 1280, "height": 800})
            page.goto(url + "a11y.html", wait_until="networkidle", timeout=30000)
            page.screenshot(path=str(OUT / "a11y.png"))
            page.close()
            browser.close()
    finally:
        httpd.shutdown()
    print("wrote", list(OUT.glob("*.png")))


if __name__ == "__main__":
    main()
