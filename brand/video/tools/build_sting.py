import json, re
w = json.load(open("logos.json"))["pizarra"]["wordmark"]
vb = [float(x) for x in re.search(r'viewBox="([^"]+)"', w).group(1).split()]
els = re.findall(r'<(?:path|rect|circle)[^>]*/>', w)
names = ["m", "i", "C", "o", "l", "e", "band", "board", "cord", "knot", "fringe", "btn"]
assert len(els) == len(names), len(els)
E = dict(zip(names, els))
# split cord into the part lying on the board and the hanging part
pts = [tuple(map(float, p)) for p in re.findall(r'([-\d.]+) ([-\d.]+)', re.search(r' d="([^"]+)"', E["cord"]).group(1))]
btn, edge, drop = pts
sw = re.search(r'stroke-width="([^"]+)"', E["cord"]).group(1)
cord1 = f'<path id="cord1" class="acc-s" fill="none" stroke-width="{sw}" stroke-linecap="round" d="M{btn[0]} {btn[1]}L{edge[0]} {edge[1]}" pathLength="1"/>'
cord2 = f'<path class="acc-s" fill="none" stroke-width="{sw}" stroke-linecap="round" d="M{edge[0]} {edge[1]}L{drop[0]} {drop[1]}"/>'
def tag(el, i): return el.replace("<path", f'<path id="{i}"', 1).replace("<rect", f'<rect id="{i}"', 1).replace("<circle", f'<circle id="{i}"', 1)
logo = f'''
<g id="letters">{"".join(tag(E[k], k) for k in ["m","i","o","l","e"])}</g>
<g id="Cg" mask="url(#cmask)">{tag(E["C"], "C")}</g>
<g id="cap">
  <g id="bandg">{E["band"]}</g>
  <g id="boardg">{E["board"]}</g>
  {cord1}
  <g id="tassel">{cord2}{E["knot"]}{E["fringe"]}</g>
  {tag(E["btn"], "btn")}
</g>
<circle id="ring" cx="{btn[0]}" cy="{btn[1]}" r="9" fill="none" stroke="#E59A2F" stroke-width="3"/>'''
data = {"vb": vb, "btn": btn, "edge": edge}
html = open("sting_template.html").read().replace("/*LOGO*/", logo).replace("/*DATA*/", json.dumps(data))
open("/home/user/mi-cole/brand/video/sting.html", "w").write(html)
print("ok")
