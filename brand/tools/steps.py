import copy
import gen_logos as G
base = [t for t in G.TAKES if t["id"] == "pizarra"][0]
rows = ""
for dx in (-0.17, -0.24, -0.30):
    c = copy.deepcopy(base); c.update(cap_dx=dx, kern={1: 12, 2: 8}, dotless=True, i_variant=False)
    v = G.build_take(c)
    for bg, ink in (("#F5EFE3", "#17363A"), ("#10282B", "#F5EFE3")):
        rows += f'<div class="r" style="background:{bg};color:{ink};--bg:{bg};--ink:{ink};--acc:#E59A2F"><b>{dx}</b>{v["wordmark"]}<span class="s">{v["wordmark"]}</span></div>'
css = ".ink{fill:var(--ink)}.gap{stroke:var(--bg)}.acc{fill:var(--acc)}.acc-s{stroke:var(--acc)}body{margin:0;font:16px system-ui}.r{display:flex;gap:28px;align-items:center;padding:14px 22px}.r b{width:60px}.r>svg{height:150px}.s svg{height:34px}"
open("steps.html", "w").write("<style>" + css + "</style>" + rows)
