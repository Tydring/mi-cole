"""Assemble site/index.html from the template and the generated intro SVG. Run after intro_svg.py."""
import os
here = os.path.dirname(os.path.abspath(__file__))
t = open(os.path.join(here, "index.template.html")).read()
svg = open(os.path.join(here, "intro.svg.html")).read()
data = open(os.path.join(here, "intro.json")).read()
assert "<!--INTRO_SVG-->" in t and "<!--INTRO_DATA-->" in t
out = t.replace("<!--INTRO_SVG-->", svg).replace("<!--INTRO_DATA-->", data)
open(os.path.join(here, "..", "site", "index.html"), "w").write(out)
print("site/index.html", len(out), "bytes")
