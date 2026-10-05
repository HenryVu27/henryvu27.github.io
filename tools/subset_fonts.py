"""Cut EB Garamond down to what the site renders: static 400, 500 and 400 italic, Latin only,
and only the OpenType features the CSS asks for (small caps, old-style figures, ligatures, kerning).

Sources are the variable TTFs from github.com/google/fonts/tree/main/ofl/ebgaramond (the Google
Fonts CSS API strips smcp and onum, so it cannot be used). Run:
  uv run --with fonttools --with brotli python tools/subset_fonts.py EBGaramond[wght].ttf EBGaramond-Italic[wght].ttf
"""
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

UNICODES = ("U+0020-007E,U+00A0-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2013-2014,U+2018-201E,"
            "U+2022,U+2026,U+2032-2033,U+2039-203A,U+2190-2193,U+2767,U+1EDF")
FEATURES = ["kern", "liga", "clig", "calt", "ccmp", "locl", "mark", "mkmk", "smcp", "c2sc", "onum", "pnum", "lnum"]

def build(src, out, weight):
    font = instancer.instantiateVariableFont(TTFont(src), {"wght": weight})
    opts = subset.Options(); opts.flavor = "woff2"; opts.layout_features = FEATURES; opts.name_IDs = ["*"]
    sub = subset.Subsetter(opts); sub.populate(unicodes=subset.parse_unicodes(UNICODES)); sub.subset(font)
    subset.save_font(font, out, opts)

roman, italic = sys.argv[1], sys.argv[2]
build(roman, "assets/fonts/ebgaramond-400.woff2", 400)
build(roman, "assets/fonts/ebgaramond-500.woff2", 500)
build(italic, "assets/fonts/ebgaramond-400-italic.woff2", 400)
