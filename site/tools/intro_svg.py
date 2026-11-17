"""Generate the inline SVG for the site intro from the locked logo (brand/tools/gen_logos.py -> logos.json).
Writes site/tools/intro.svg.html (a fragment) and site/tools/intro.json (geometry for script.js)."""
import json, re, sys, os
src = sys.argv[1]  # path to logos.json
w = json.load(open(src))["pizarra"]["wordmark"]
vb = [float(x) for x in re.search(r'viewBox="([^"]+)"', w).group(1).split()]
els = re.findall(r'<(?:path|rect|circle)[^>]*/>', w)
names = ["m", "i", "C", "o", "l", "e", "band", "board", "cord", "knot", "fringe", "btn"]
assert len(els) == len(names), len(els)
E = dict(zip(names, els))
pts = [tuple(map(float, p)) for p in re.findall(r'([-\d.]+) ([-\d.]+)', re.search(r' d="([^"]+)"', E["cord"]).group(1))]
btn, edge, drop = pts
sw = re.search(r'stroke-width="([^"]+)"', E["cord"]).group(1)
def tag(el, i): return el.replace("<path", f'<path id="ik-{i}"', 1).replace("<rect", f'<rect id="ik-{i}"', 1).replace("<circle", f'<circle id="ik-{i}"', 1)
frag = f'''<svg id="ik-sv" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
<defs><mask id="ik-cmask" maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="5000" height="5000"><path id="ik-csweep" fill="none" stroke="#fff" pathLength="1" stroke-dasharray="1 1"/></mask></defs>
<g id="ik-cam"><g id="ik-place">
<g>{"".join(tag(E[k], k) for k in ["m","i","o","l","e"])}</g>
<g id="ik-Cg" mask="url(#ik-cmask)">{tag(E["C"], "C")}</g>
<g id="ik-cap"><g id="ik-bandg">{E["band"]}</g><g id="ik-boardg">{E["board"]}</g>
<path id="ik-cord1" class="acc-s" fill="none" stroke-width="{sw}" stroke-linecap="round" d="M{btn[0]} {btn[1]}L{edge[0]} {edge[1]}" pathLength="1"/>
<g id="ik-tassel"><path class="acc-s" fill="none" stroke-width="{sw}" stroke-linecap="round" d="M{edge[0]} {edge[1]}L{drop[0]} {drop[1]}"/>{E["knot"]}{E["fringe"]}</g>
{tag(E["btn"], "btn")}</g>
<circle id="ik-ring" cx="{btn[0]}" cy="{btn[1]}" r="9" fill="none" stroke="#E59A2F" stroke-width="3"/>
</g></g></svg>'''
here = os.path.dirname(os.path.abspath(__file__))
open(os.path.join(here, "intro.svg.html"), "w").write(frag)
json.dump({"vb": vb, "btn": btn, "edge": edge}, open(os.path.join(here, "intro.json"), "w"))
print("intro fragment", len(frag), "bytes")
