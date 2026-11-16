import copy
import gen_logos as G
base = [t for t in G.TAKES if t["id"] == "pizarra"][0]
opts = [("Now (round 12)", "Cap raised, band wraps the top of the C.", 0.08),
        ("Grip +1", "Cap lowered a step, band wraps further over the shoulder.", 0.15),
        ("Grip +2", "Cap lowered two steps, band pulled well down over the C.", 0.22)]
L = {"bg": "#F5EFE3", "ink": "#17363A", "acc": "#E59A2F"}
D = {"bg": "#10282B", "ink": "#F5EFE3", "acc": "#E59A2F"}
th = lambda t: f'--bg:{t["bg"]};--ink:{t["ink"]};--acc:{t["acc"]};background:{t["bg"]};color:{t["ink"]}'
sec = ""
for title, note, seat in opts:
    c = copy.deepcopy(base); c["seat"] = seat
    v = G.build_take(c)
    sec += f'''<section><h2>{title}</h2><p>{note}</p><div class="row">
<div class="tile" style="{th(L)}">{v["wordmark"]}</div><div class="tile" style="{th(D)}">{v["wordmark"]}</div>
<div class="icon" style="{th({'bg': L['ink'], 'ink': L['bg'], 'acc': L['acc']})}">{v["mark"]}</div></div>
<div class="nav" style="{th(L)}"><span class="n">{v["wordmark"]}</span></div></section>'''
html = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>miCole cap grip</title><style>
*{{box-sizing:border-box}}body{{margin:0;background:#EDEBE6;color:#1d1d1b;font:16px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}}
main{{max-width:1180px;margin:0 auto;padding:28px 16px 60px}}h1{{font-size:24px;margin:0 0 4px}}main>p{{color:#5b5a55;margin:0}}
section{{background:#fff;border:1px solid #d6d3cb;border-radius:18px;padding:20px;margin:20px 0}}h2{{margin:0;font-size:20px}}section>p{{color:#5b5a55;margin:2px 0 12px}}
.ink{{fill:var(--ink)}}.gap{{stroke:var(--bg)}}.acc{{fill:var(--acc)}}.acc-s{{stroke:var(--acc)}}
.row{{display:grid;grid-template-columns:1fr 1fr 150px;gap:12px}}.tile{{border-radius:12px;padding:22px;display:grid;place-items:center}}.tile svg{{width:100%;max-width:340px;height:auto}}
.icon{{border-radius:34px;padding:18px;display:grid;place-items:center;aspect-ratio:1}}.icon svg{{width:100%;height:100%}}
.nav{{margin-top:10px;padding:12px 16px;border-radius:10px}}.n svg{{height:30px;width:auto;display:block}}
@media (max-width:760px){{.row{{grid-template-columns:1fr 1fr}}.icon{{width:150px}}}}
</style></head><body><main><h1>How hard the cap grips the C</h1>
<p>Same cap, tilt and fitted cut line in all three. Only the depth changes.</p>{sec}</main></body></html>'''
open("/home/user/mi-cole/logo-grip-options.html", "w").write(html)
