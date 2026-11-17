import copy
import gen_logos as G
base = [t for t in G.TAKES if t["id"] == "pizarra"][0]
opts = [("Now (with band)", "The current version, for comparison.", {}, None),
        ("No band, resting", "The board sits on top of the C. Only two shapes: the board and the letter.", {"trim": "none"}, 0.26),
        ("No band, worn (my pick)", "The board presses slightly into the top of the C, with the cut line between them. Reads most like a cap on a head.", {"trim": "none"}, 0.32)]
L = {"bg": "#F5EFE3", "ink": "#17363A", "acc": "#E59A2F"}; D = {"bg": "#10282B", "ink": "#F5EFE3", "acc": "#E59A2F"}
th = lambda t: f'--bg:{t["bg"]};--ink:{t["ink"]};--acc:{t["acc"]};background:{t["bg"]};color:{t["ink"]}'
sec = ""
for title, note, kw, seat in opts:
    c = copy.deepcopy(base); c["refined"] = dict(c["refined"], **kw)
    if seat is not None: c["seat"] = seat
    v = G.build_take(c)
    sec += f'''<section><h2>{title}</h2><p>{note}</p><div class="row">
<div class="tile mk" style="{th(L)}">{v["mark"]}</div><div class="tile" style="{th(L)}">{v["wordmark"]}</div><div class="tile" style="{th(D)}">{v["wordmark"]}</div></div></section>'''
html = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>miCole band options</title><style>
*{{box-sizing:border-box}}body{{margin:0;background:#EDEBE6;color:#1d1d1b;font:16px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}}
main{{max-width:1180px;margin:0 auto;padding:28px 16px 60px}}h1{{font-size:24px;margin:0 0 4px}}main>p{{color:#5b5a55;margin:0}}
section{{background:#fff;border:1px solid #d6d3cb;border-radius:18px;padding:20px;margin:18px 0}}h2{{margin:0;font-size:20px}}section>p{{color:#5b5a55;margin:2px 0 12px}}
.ink{{fill:var(--ink)}}.gap{{stroke:var(--bg)}}.acc{{fill:var(--acc)}}.acc-s{{stroke:var(--acc)}}
.row{{display:grid;grid-template-columns:200px 1fr 1fr;gap:12px}}.tile{{border-radius:12px;padding:20px;display:grid;place-items:center}}.tile svg{{width:100%;max-width:330px;height:auto}}.mk svg{{max-width:170px}}
@media (max-width:760px){{.row{{grid-template-columns:1fr}}}}</style></head><body><main>
<h1>Dropping the band</h1><p>Same board, position, tilt and tassel. The band under the board is gone; the top of the C is the head.</p>{sec}</main></body></html>'''
open("/home/user/mi-cole/logo-band-options.html", "w").write(html)
