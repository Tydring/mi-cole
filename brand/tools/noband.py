import copy
import gen_logos as G
base = [t for t in G.TAKES if t["id"] == "pizarra"][0]
rows = ""
for label, seat in [("rests 1", 0.20), ("rests 2", 0.26), ("worn", 0.32), ("worn deep", 0.38)]:
    c = copy.deepcopy(base); c["refined"] = dict(c["refined"], trim="none"); c["seat"] = seat
    v = G.build_take(c)
    for bg, ink in (("#F5EFE3", "#17363A"), ("#10282B", "#F5EFE3")):
        rows += f'<div class="r" style="background:{bg};color:{ink};--bg:{bg};--ink:{ink};--acc:#E59A2F"><b>{label} {seat}</b>{v["mark"]}{v["wordmark"]}<span class="s">{v["wordmark"]}</span></div>'
css = ".ink{fill:var(--ink)}.gap{stroke:var(--bg)}.acc{fill:var(--acc)}.acc-s{stroke:var(--acc)}body{margin:0;font:15px system-ui}.r{display:flex;gap:30px;align-items:center;padding:10px 20px}.r b{width:120px}.r>svg.mk{height:220px;width:220px}.r>svg.wm{height:140px}.s svg{height:34px}"
open("noband.html", "w").write("<style>" + css + "</style>" + rows)
