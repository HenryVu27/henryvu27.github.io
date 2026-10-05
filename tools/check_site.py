"""Render the site with Playwright and check the things a reviewer would check by hand."""
import asyncio, sys, os, threading, functools
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "tools", "shots"); os.makedirs(OUT, exist_ok=True)
# Served over http, not file://, because a crossorigin font preload is blocked from a null origin.
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
server = ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Quiet, directory=ROOT))
threading.Thread(target=server.serve_forever, daemon=True).start()
URL = f"http://127.0.0.1:{server.server_port}/index.html"

async def main():
    failures = []
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for theme in ("day",):
            for w in (390, 820, 1440):
                ctx = await b.new_context(viewport={"width": w, "height": 900})
                pg = await ctx.new_page(); errors = []
                pg.on("pageerror", lambda e: errors.append(str(e)))
                pg.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
                await pg.goto(URL, wait_until="networkidle"); await pg.evaluate("document.fonts.ready"); await pg.wait_for_timeout(600)
                await pg.screenshot(path=f"{OUT}/{theme}-{w}.png", full_page=True)
                sw = await pg.evaluate("document.documentElement.scrollWidth"); cw = await pg.evaluate("document.documentElement.clientWidth")
                if sw > cw: failures.append(f"{theme}-{w}: horizontal scroll {sw}>{cw}")
                if errors: failures.append(f"{theme}-{w}: console errors {errors[:3]}")
                fonts = await pg.evaluate("Array.from(document.fonts).filter(f=>f.status==='loaded').map(f=>f.family)")
                for f in ("EB Garamond",):
                    if f not in fonts: failures.append(f"{theme}-{w}: font not loaded {f}")
                if w == 1440:
                    if await pg.evaluate("document.querySelectorAll('.work details[open]').length"): failures.append("work entries not collapsed")
                    await pg.click(".work details summary .role")
                    if not await pg.evaluate("document.querySelector('.work details').open"): failures.append("work entry did not open")
                    await pg.click("#earlier-toggle")
                    if await pg.evaluate("document.getElementById('earlier').hidden"): failures.append("earlier did not open")
                    await pg.click("#contactForm .send")
                    msgs = await pg.evaluate("Array.from(document.querySelectorAll('#contactForm .error-message')).map(e=>e.textContent).filter(Boolean)")
                    if len(msgs) < 2: failures.append(f"form validation messages {msgs}")
                await ctx.close()
        await b.close()
    print("\n".join(failures) if failures else "all checks passed")
    sys.exit(1 if failures else 0)
asyncio.run(main())
