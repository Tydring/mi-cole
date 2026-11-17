import copy
import gen_logos as G
base = [t for t in G.TAKES if t["id"] == "pizarra"][0]
rows = ""
for label, front, seat in [("cover 14%", 0.14*140, 0.08), ("cover 20%", 0.20*140, 0.12), ("cover 26%", 0.26*140, 0.16)]:
    c = copy.deepcopy(base); c["front"] = front; c["seat"] = seat
    v = G.build_take(c)
    for bg, ink in (("#F5EFE3", "#17363A"), ("#10282B", "#F5EFE3")):
        rows += f'<div class="r" style="background:{bg};color:{ink};--bg:{bg};--ink:{ink};--acc:#E59A2F"><b>{label}</b>{v["wordmark"]}{v["mark"]}<span class="s">{v["wordmark"]}</span></div>'
css = ".ink{fill:var(--ink)}.gap{stroke:var(--bg)}.acc{fill:var(--acc)}.acc-s{stroke:var(--acc)}body{margin:0;font:15px system-ui}.r{display:flex;gap:26px;align-items:center;padding:12px 20px}.r b{width:100px}.r>svg.wm{height:190px}.r>svg.mk{height:190px;width:190px}.s svg{height:34px}"
open("front.html", "w").write("<style>" + css + "</style>" + rows)
