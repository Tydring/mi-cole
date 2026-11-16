import copy, sys
import gen_logos as G
base = [t for t in G.TAKES if t["id"] == "pizarra"][0]
rows = ""
opts = [("A seat .04 depth .44", 0.04, 0.44, 0.33), ("B seat .08 depth .44", 0.08, 0.44, 0.36), ("C seat .02 depth .52", 0.02, 0.52, 0.36)]
for label, seat, depth, bw in opts:
    c = copy.deepcopy(base); c["fit"] = True; c["seat"] = seat
    c["refined"] = dict(c["refined"], depth=depth, bw=bw)
    v = G.build_take(c)
    for bg, ink in (("#F5EFE3", "#17363A"), ("#10282B", "#F5EFE3")):
        rows += f'<div class="r" style="background:{bg};color:{ink};--bg:{bg};--ink:{ink};--acc:#E59A2F"><b>{label}</b>{v["wordmark"]}{v["mark"]}<span class="s">{v["wordmark"]}</span></div>'
css = ".ink{fill:var(--ink)}.gap{stroke:var(--bg)}.acc{fill:var(--acc)}.acc-s{stroke:var(--acc)}body{margin:0;font:15px system-ui}.r{display:flex;gap:26px;align-items:center;padding:12px 20px}.r b{width:120px}.r>svg.wm{height:190px}.r>svg.mk{height:190px;width:190px}.s svg{height:34px}"
open("fit2.html", "w").write("<style>" + css + "</style>" + rows)
