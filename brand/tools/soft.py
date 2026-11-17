import copy
import gen_logos as G
base = [t for t in G.TAKES if t["id"] == "pizarra"][0]
rows = ""
for label, kw in [("Now", {}), ("Soft", {"soften": 0.03}), ("Softer", {"soften": 0.04, "bwl": 0.32}), ("Softest", {"soften": 0.05, "bwl": 0.29})]:
    c = copy.deepcopy(base); c["refined"] = dict(c["refined"], **kw); v = G.build_take(c)
    for bg, ink in (("#F5EFE3", "#17363A"), ("#10282B", "#F5EFE3")):
        rows += f'<div class="r" style="background:{bg};color:{ink};--bg:{bg};--ink:{ink};--acc:#E59A2F"><b>{label}</b>{v["mark"]}{v["wordmark"]}</div>'
css = ".ink{fill:var(--ink)}.gap{stroke:var(--bg)}.acc{fill:var(--acc)}.acc-s{stroke:var(--acc)}body{margin:0;font:15px system-ui}.r{display:flex;gap:30px;align-items:center;padding:10px 20px}.r b{width:80px}.r>svg.mk{height:260px;width:260px}.r>svg.wm{height:140px}"
open("soft.html", "w").write("<style>" + css + "</style>" + rows)
