import copy
import gen_logos as G
base = [t for t in G.TAKES if t["id"] == "pizarra"][0]
def mk(**kw):
    c = copy.deepcopy(base); c.update(kw); c["i_variant"] = False
    return G.build_take(c)
V = {
 "A": ("A. The cap overlaps the i's dot", "The dot stays. The cap's low corner covers part of it, with the same cut line it uses on the C, so a sliver of dot shows.", mk(cap_dx=-0.17, kern={1: 12, 2: 8})),
 "B": ("B. The cap replaces the i's dot", "No dot. The board's low corner hangs over the i and does the dot's job. The i stays tight to the C.", mk(cap_dx=-0.17, kern={1: 12, 2: 8}, dotless=True)),
 "C": ("C. More space before the C", "The dot stays whole and the i moves away so the cap hangs free. The word starts to read as two.", mk(cap_dx=-0.17, kern={1: 40, 2: 8})),
}
L = {"bg": "#F5EFE3", "ink": "#17363A", "acc": "#E59A2F"}
D = {"bg": "#10282B", "ink": "#F5EFE3", "acc": "#E59A2F"}
def th(t): return f'--bg:{t["bg"]};--ink:{t["ink"]};--acc:{t["acc"]};background:{t["bg"]};color:{t["ink"]}'
sec = ""
for k, (title, note, v) in V.items():
    w = v["wordmark"]
    sec += f'''<section><h2>{title}</h2><p>{note}</p>
<div class="pair"><div class="tile" style="{th(L)}">{w}</div><div class="tile" style="{th(D)}">{w}</div></div>
<h3>In use</h3>
<div class="nav" style="{th(L)}"><span class="n32">{w}</span><span class="links">Cómo funciona · Para colegios · <b>Únete</b></span></div>
<div class="nav" style="{th(D)}"><span class="n32">{w}</span><span class="links">Cómo funciona · Para colegios · <b>Únete</b></span></div>
<div class="phones"><div class="phone" style="{th(L)}"><span class="n22">{w}</span></div><div class="phone" style="{th(D)}"><span class="n22">{w}</span></div><span class="cap">Phone header, 22 px tall</span></div>
</section>'''
html = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>miCole i dot options</title><style>
*{{box-sizing:border-box}}body{{margin:0;background:#EDEBE6;color:#1d1d1b;font:16px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}}
main{{max-width:1100px;margin:0 auto;padding:28px 16px 70px}}h1{{font-size:26px;margin:0 0 6px}}main>p{{color:#5b5a55;max-width:70ch;margin:0}}
section{{background:#fff;border:1px solid #d6d3cb;border-radius:18px;padding:22px;margin:24px 0}}h2{{margin:0;font-size:22px}}section>p{{color:#5b5a55;margin:4px 0 14px}}
h3{{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#5b5a55;margin:20px 0 8px}}
.ink{{fill:var(--ink)}}.gap{{stroke:var(--bg)}}.acc{{fill:var(--acc)}}.acc-s{{stroke:var(--acc)}}
.pair{{display:grid;grid-template-columns:1fr 1fr;gap:12px}}.tile{{border-radius:12px;padding:26px;display:grid;place-items:center}}.tile svg{{width:100%;max-width:380px;height:auto}}
.nav{{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:14px 18px;border-radius:10px;margin-bottom:8px;font-size:14px}}
.n32 svg{{height:32px;width:auto;display:block}}.n22 svg{{height:22px;width:auto;display:block}}
.phones{{display:flex;gap:12px;align-items:center;flex-wrap:wrap}}.phone{{width:200px;padding:12px 14px;border-radius:12px}}.cap{{font-size:13px;color:#5b5a55}}
@media (max-width:700px){{.pair{{grid-template-columns:1fr}}.links{{display:none}}}}
</style></head><body><main>
<h1>Cap hanging further left: three ways to handle the i</h1>
<p>Same cap in all three: round 10 drawing and 18 degree tilt, moved further left onto the shoulder of the C. Only the i changes. The app icon and favicon are identical for all three, since they show only the C.</p>
{sec}</main></body></html>'''
open("/home/user/mi-cole/logo-i-options.html", "w").write(html)
