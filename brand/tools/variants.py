import copy, json
import gen_logos as G
base = [t for t in G.TAKES if t["id"] == "pizarra"][0]
V = {}
def mk(name, **kw):
    c = copy.deepcopy(base); c.update(kw); c["i_variant"] = False
    V[name] = G.build_take(c)
mk("now", )
mk("A", cap_dx=-0.17, kern={1: 12, 2: 8})
mk("B", cap_dx=-0.17, kern={1: 12, 2: 8}, dotless=True)
mk("C", cap_dx=-0.17, kern={1: 40, 2: 8})
css=".ink{fill:var(--ink)}.ink-s{stroke:var(--ink)}.gap{stroke:var(--bg)}.acc{fill:var(--acc)}.acc-s{stroke:var(--acc)}body{margin:0;font:16px system-ui}.row{display:flex;gap:24px;padding:16px 24px;align-items:center}.wm{height:150px}.s .wm{height:52px}.mk{width:110px}h4{margin:0;width:230px}"
labels={"now":"Now (round 10)","A":"A. Cap overlaps the i dot (cut line)","B":"B. Cap corner replaces the i dot","C":"C. More space before the C"}
h="<style>"+css+"</style>"
for bg,ink,acc in [("#F5EFE3","#17363A","#E59A2F"),("#10282B","#F5EFE3","#E59A2F")]:
    for k in V:
        h+=f'<div class="row" style="background:{bg};color:{ink};--bg:{bg};--ink:{ink};--acc:{acc}"><h4>{labels[k]}</h4>{V[k]["wordmark"]}<div class="s">{V[k]["wordmark"]}</div></div>'
open("variants.html","w").write(h)
