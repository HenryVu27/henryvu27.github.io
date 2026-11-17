"""Cut Charis SIL (the OFL release of Bitstream Charter) down to what henryvu.io renders.

Why: Charter only ships with Apple devices, so Windows fell back to Sitka Text, which is very wide.
Serving the font ourselves makes every device show the same letters.

Source: github.com/google/fonts/tree/main/ofl/charissil (CharisSIL-Regular/Bold/Italic.ttf, OFL.txt).
The OFL reserves the names "Charis" and "SIL" for unmodified copies, and a subset is a modified copy,
so the output is renamed "HV Serif". The license ships beside the fonts as assets/fonts/OFL-HVSerif.txt.

Usage: uv run --with fonttools --with brotli python tools/subset_serif.py <folder with the three TTFs>
"""
import sys, pathlib
from fontTools import subset
from fontTools.ttLib import TTFont

SRC = pathlib.Path(sys.argv[1])
OUT = pathlib.Path(__file__).resolve().parent.parent / "assets" / "fonts"
# Two files per style, matched to the unicode-range lines in styles.css.
# Every page loads "latin"; the browser fetches "ext" only on pages that use those letters.
RANGES = {
    "latin": "U+0000-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2010-2027,U+2030-203A,"
             "U+20AC,U+2122,U+2190-2193,U+2212,U+2215,U+FEFF,U+FFFD",
    "ext":   "U+0100-0130,U+0132-0151,U+0154-017F,U+01A0-01A1,U+01AF-01B0,U+0300-0303,U+0309,U+0323,"
             "U+0391-03A9,U+03B1-03C9,U+1EA0-1EF9",
}
NAME = "HV Serif"

def build(src, dst, style, unicodes):
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["kern", "liga", "clig", "calt", "ccmp", "locl", "mark", "mkmk"]
    opts.name_IDs = [0, 1, 2, 3, 4, 5, 6]
    opts.notdef_outline = True
    opts.hinting = False
    opts.drop_tables += ["Silf", "Glat", "Gloc", "Feat", "Sill"]
    font = TTFont(src)
    s = subset.Subsetter(opts)
    s.populate(unicodes=subset.parse_unicodes(unicodes))
    s.subset(font)
    full = f"{NAME} {style}" if style != "Regular" else NAME
    ps = f"HVSerif-{style}"
    for rec in font["name"].names:
        if rec.nameID == 1: rec.string = NAME
        elif rec.nameID == 3: rec.string = f"{ps};henryvu.io subset of Charis SIL"
        elif rec.nameID == 4: rec.string = full
        elif rec.nameID == 6: rec.string = ps
    font.save(dst)
    print(f"{dst.name}: {dst.stat().st_size / 1024:.1f} KB")

for f in OUT.glob("hvserif-*.woff2"): f.unlink()
for src, weight, style in [("Regular", "400", "Regular"), ("Bold", "700", "Bold"), ("Italic", "400-italic", "Italic")]:
    for part, uni in RANGES.items():
        build(SRC / f"CharisSIL-{src}.ttf", OUT / f"hvserif-{weight}-{part}.woff2", style, uni)
(OUT / "OFL-HVSerif.txt").write_text(
    "HV Serif is a subset of Charis SIL, renamed as the Reserved Font Name clause requires.\n\n"
    + (SRC / "OFL.txt").read_text())
