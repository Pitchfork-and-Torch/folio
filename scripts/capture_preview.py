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
            for name, size in (("desktop", (1440, 900)), ("mobile", (390, 844))):
                page = browser.new_page(viewport={"width": size[0], "height": size[1]})
                page.goto(url, wait_until="networkidle", timeout=60000)
                page.wait_for_timeout(3500)
                page.screenshot(path=str(OUT / f"{name}.png"), full_page=False)
                page.close()
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
