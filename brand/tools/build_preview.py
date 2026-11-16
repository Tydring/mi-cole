import json, os, subprocess, base64

HERE = os.path.dirname(__file__)
logos = json.load(open(os.path.join(HERE, "logos.json")))


def lum(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    c = [x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def contrast(a, b):
    la, lb = sorted([lum(a), lum(b)], reverse=True)
    return (la + 0.05) / (lb + 0.05)


TAKES = [
    {
        "id": "pizarra", "num": "1", "name": "Pizarra",
        "pitch": "Chunky grotesque. The cap tilts left and its band grows straight out of the top end of the C, so cap and letter are one shape. The tassel swings out to the right, toward the rest of the name. The most confident and the most legible small. Reads like a product, not a school crest.",
        "cap": "Round 4, built from your reference, mirrored: board 1.42 x the C width, tilted 17 degrees to the left, band fused with the C, tassel swinging right.",
        "light": {"bg": "#F5EFE3", "ink": "#17363A", "acc": "#E59A2F"},
        "dark": {"bg": "#10282B", "ink": "#F5EFE3", "acc": "#E59A2F"},
        "palette": [
            ("Pizarra", "#17363A", "Wordmark, headings, body text, dark sections"),
            ("Papel", "#F5EFE3", "Page background, text on dark"),
            ("Mango", "#E59A2F", "Main action buttons (with Pizarra text) and the tassel"),
            ("Guayaba", "#D4614A", "Tiny highlights only: a dot, an underline, a badge"),
            ("Salvia", "#A9C2B4", "Soft surfaces and dividers, quiet illustration fills"),
            ("Tiza", "#56625E", "Secondary text, captions"),
        ],
        "checks": [("Pizarra", "#17363A", "Papel", "#F5EFE3"), ("Pizarra", "#17363A", "Mango", "#E59A2F"), ("Tiza", "#56625E", "Papel", "#F5EFE3")],
        "head_font": "Bricolage Grotesque", "head_css": "'Bricolage Grotesque', sans-serif", "head_w": 700,
        "fonts": "Bricolage Grotesque 700 for headings (one file, about 30 KB as WOFF2 Latin subset). Body in the phone's own system font, zero download.",
    },
    {
        "id": "tinta", "num": "2", "name": "Tinta",
        "pitch": "Soft high-contrast serif. The cap tilts left and melts into the C, and the tassel falls over the C on its left like it is swinging past the face. The small spike under the board is the serif C's own top beak. The most trustworthy to a director, the least app-like. Weakest at 16 px: the thin serif hairlines break up, so the favicon leans fully on the simple version.",
        "cap": "Medium (1.30 x), tilted 8 degrees to the left, seamless with the C, tassel on the left.",
        "light": {"bg": "#FBF8F2", "ink": "#1C2541", "acc": "#C79A3B"},
        "dark": {"bg": "#141B30", "ink": "#FBF8F2", "acc": "#D8AE55"},
        "palette": [
            ("Tinta", "#1C2541", "Wordmark, headings, body text"),
            ("Marfil", "#FBF8F2", "Page background, text on dark"),
            ("Terracota", "#B9472A", "Main action buttons (white text)"),
            ("Oro viejo", "#C79A3B", "Tassel and thin decorative rules only, never text"),
            ("Niebla", "#E7E1D4", "Cards, dividers, form fields"),
            ("Azul pizarra", "#4A5878", "Secondary text, captions"),
        ],
        "checks": [("Tinta", "#1C2541", "Marfil", "#FBF8F2"), ("Blanco", "#FFFFFF", "Terracota", "#B9472A"), ("Azul pizarra", "#4A5878", "Marfil", "#FBF8F2")],
        "head_font": "Fraunces", "head_css": "'Fraunces', serif", "head_w": 600,
        "fonts": "Fraunces 600 (optical size 144) for headings, one file. Body in the system font.",
    },
    {
        "id": "trazo", "num": "3", "name": "Trazo",
        "pitch": "Custom monoline lettering, like it was drawn with one marker. The cap is cocked hard to the left (17 degrees) and becomes the top of the C, so the letter becomes a face under a hat. The friendliest to a parent, the most ownable shape.",
        "cap": "Large (1.36 x), tilted 17 degrees to the left, seamless with the C, tassel drops into the opening.",
        "light": {"bg": "#F3ECDD", "ink": "#1F3D2E", "acc": "#E3A600"},
        "dark": {"bg": "#13271D", "ink": "#F3ECDD", "acc": "#F2B705"},
        "palette": [
            ("Bosque", "#1F3D2E", "Wordmark, headings, body text, dark sections"),
            ("Arcilla", "#F3ECDD", "Page background, text on dark"),
            ("Araguaney", "#F2B705", "Tassel and main action buttons (with Bosque text). On light backgrounds the tassel uses a deeper #E3A600 so it does not wash out"),
            ("Coral", "#D9573F", "Alerts and badges only"),
            ("Hoja", "#CFE0C9", "Soft surfaces, illustration fills"),
            ("Musgo", "#4F6656", "Secondary text, captions"),
        ],
        "checks": [("Bosque", "#1F3D2E", "Arcilla", "#F3ECDD"), ("Bosque", "#1F3D2E", "Araguaney", "#F2B705"), ("Musgo", "#4F6656", "Arcilla", "#F3ECDD")],
        "head_font": "Figtree", "head_css": "'Figtree', sans-serif", "head_w": 800,
        "fonts": "Figtree 800 for headings (rounded geometric, matches the marker lettering without copying it), one file. Body in the system font.",
    },
]


def tile(svg, theme, cls=""):
    return (f'<div class="tile {cls}" style="--bg:{theme["bg"]};--ink:{theme["ink"]};--acc:{theme["acc"]}">{svg}</div>')


# ---- rasterize 16 px versions so the page shows real pixels, not a vector scaled down
raster_html = ["<style>body{margin:0}.r{width:16px;height:16px;display:inline-block}.r svg{width:16px;height:16px;display:block}"
               ".ink{fill:var(--ink)}.ink-s{stroke:var(--ink)}.gap{stroke:var(--bg)}.acc{fill:var(--acc)}.acc-s{stroke:var(--acc)}</style>"]
jobs = []
for t in TAKES:
    for kind in ("mark", "small"):
        for mode in ("light", "dark"):
            th = t[mode]
            rid = f"r-{t['id']}-{kind}-{mode}"
            raster_html.append(f'<div id="{rid}" class="r" style="background:{th["bg"]};--bg:{th["bg"]};--ink:{th["ink"]};--acc:{th["acc"]}">{logos[t["id"]][kind]}</div>')
            jobs.append(rid)
rpath = os.path.join(HERE, "raster.html")
open(rpath, "w").write("".join(raster_html))
js = os.path.join(HERE, "raster.js")
open(js, "w").write("""
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({deviceScaleFactor:1});
await p.goto('file://'+process.argv[2]);const ids=JSON.parse(process.argv[3]);const out={};
for(const id of ids){const buf=await p.locator('#'+id).screenshot();out[id]=buf.toString('base64');}
require('fs').writeFileSync(process.argv[4],JSON.stringify(out));await b.close();})();
""")
rjson = os.path.join(HERE, "raster.json")
subprocess.run(["node", js, rpath, json.dumps(jobs), rjson], check=True)
rasters = json.load(open(rjson))


def px(tid, kind, mode):
    return f'<img class="px" alt="" src="data:image/png;base64,{rasters[f"r-{tid}-{kind}-{mode}"]}">'


sections = []
for t in TAKES:
    L = logos[t["id"]]
    lt, dk = t["light"], t["dark"]
    wm = f'''
      <div class="pair">
        {tile(L["wordmark"], lt, "wm-tile")}
        {tile(L["wordmark"], dk, "wm-tile")}
      </div>'''
    ivar = ""
    if "wordmark_i" in L:
        ivar = f'''
      <h3>Placement test: cap on the C vs cap on the dot of the i</h3>
      <div class="pair">
        <figure>{tile(L["wordmark"], lt, "wm-tile sm")}<figcaption>A. Cap on the C (as briefed)</figcaption></figure>
        <figure>{tile(L["wordmark_i"], lt, "wm-tile sm")}<figcaption>B. Cap on the i, C left plain</figcaption></figure>
      </div>
      <p class="note">My read: B is cuter but the cap gets small (it has to fit an i dot) and the C, the letter that carries the name, goes plain. B also gives no compact mark: a capped i alone does not say "miCole". A wins for a product that needs an app icon.</p>'''
    sizes = ""
    for mode, th in (("light", lt), ("dark", dk)):
        sizes += f'''
        <div class="sizes" style="--bg:{th["bg"]};--ink:{th["ink"]};--acc:{th["acc"]};background:{th["bg"]};color:{th["ink"]}">
          <div class="sz"><div class="s180">{L["mark"]}</div><span>180</span></div>
          <div class="sz"><div class="s32">{L["mark"]}</div><span>32 full</span></div>
          <div class="sz"><div class="s32">{L["small"]}</div><span>32 simple</span></div>
          <div class="sz"><div class="s16">{L["mark"]}</div><span>16 full</span></div>
          <div class="sz"><div class="s16">{L["small"]}</div><span>16 simple</span></div>
          <div class="sz zoom"><div class="zz">{px(t["id"], "mark", mode)}{px(t["id"], "small", mode)}</div><span>16 px real pixels, zoomed 6x: full / simple</span></div>
        </div>'''
    appicon = f'''
        <div class="apps">
          <div class="app" style="--bg:{lt["ink"]};--ink:{lt["bg"]};--acc:{dk["acc"]};background:{lt["ink"]}">{L["mark"]}</div>
          <div class="app" style="--bg:{lt["bg"]};--ink:{lt["ink"]};--acc:{lt["acc"]};background:{lt["bg"]}">{L["mark"]}</div>
          <p class="note">As a phone app icon (180, rounded by the phone). Dark tile is my pick for the home screen.</p>
        </div>'''
    pal = "".join(
        f'<li><span class="chip" style="background:{h}"></span><b>{n}</b><code>{h}</code><span class="job">{j}</span></li>'
        for n, h, j in t["palette"])
    checks = "".join(
        f'<li>{a} on {b}: <b>{contrast(ah, bh):.1f}:1</b> {"pass" if contrast(ah, bh) >= 4.5 else "large text only"}</li>'
        for a, ah, b, bh in t["checks"])
    lt_bg, lt_ink = lt["bg"], lt["ink"]
    act = t["palette"][2][1]
    act_txt = "#FFFFFF" if t["id"] == "tinta" else lt_ink
    specimen = f'''
      <div class="spec" style="background:{lt_bg};color:{lt_ink}">
        <p class="spec-h" style="font-family:{t["head_css"]};font-weight:{t["head_w"]}">Lo que pasa en el aula, llega a la casa.</p>
        <p class="spec-b">La maestra pasa la asistencia desde su teléfono y el representante se entera, sin que nadie tenga que dar su número de WhatsApp. Pensado para lapsos, boletines y notas del 1 al 20.</p>
        <span class="btn" style="background:{act};color:{act_txt}">Quiero miCole en mi colegio</span>
        <p class="spec-cap">Sample copy only, to judge the fonts. Not final.</p>
      </div>'''
    sections.append(f'''
    <section class="take" id="{t["id"]}">
      <header class="take-h"><span class="num">{t["num"]}</span><h2>{t["name"]}</h2></header>
      <p class="pitch">{t["pitch"]}</p>
      <p class="meta">{t["cap"]}</p>
      <h3>Wordmark, light and dark</h3>{wm}{ivar}
      <h3>Compact mark: favicon and app icon</h3>{sizes}{appicon}
      <div class="cols">
        <div><h3>Palette</h3><ul class="pal">{pal}</ul><ul class="checks">{checks}</ul></div>
        <div><h3>Font pairing</h3><p class="note">{t["fonts"]}</p>{specimen}</div>
      </div>
    </section>''')

html = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>miCole logo takes</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@96,700&family=Figtree:wght@800&family=Fraunces:opsz,wght@144,600&display=swap" rel="stylesheet">
<style>
:root{{--page:#EDEBE6;--text:#1d1d1b;--muted:#5b5a55;--line:#d6d3cb}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--page);color:var(--text);font:16px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}}
main{{max-width:1180px;margin:0 auto;padding:32px 16px 80px}}
.intro h1{{font-size:28px;margin:0 0 6px}}
.intro p{{max-width:70ch;color:var(--muted);margin:0 0 6px}}
nav.jump{{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0 8px}}
nav.jump a{{padding:6px 12px;border:1px solid var(--line);border-radius:999px;color:inherit;text-decoration:none;background:#fff}}
.take{{background:#fff;border-radius:18px;padding:24px;margin:28px 0;border:1px solid var(--line)}}
.take-h{{display:flex;align-items:center;gap:12px}}
.take-h h2{{margin:0;font-size:26px}}
.num{{width:34px;height:34px;border-radius:50%;background:var(--text);color:#fff;display:grid;place-items:center;font-weight:700}}
.pitch{{max-width:75ch;margin:10px 0 2px}}
.meta{{color:var(--muted);margin:0 0 10px;font-size:14px}}
h3{{font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin:26px 0 10px}}
.pair{{display:grid;grid-template-columns:1fr 1fr;gap:12px}}
figure{{margin:0}} figcaption{{font-size:14px;color:var(--muted);margin-top:6px}}
.tile{{background:var(--bg);border-radius:12px;padding:28px;display:grid;place-items:center}}
.wm-tile svg{{width:100%;max-width:420px;height:auto}}
.wm-tile.sm svg{{max-width:300px}}
.ink{{fill:var(--ink)}} .ink-s{{stroke:var(--ink)}} .gap{{stroke:var(--bg)}} .acc{{fill:var(--acc)}} .acc-s{{stroke:var(--acc)}}
.sizes{{display:flex;align-items:flex-end;gap:22px;flex-wrap:wrap;padding:20px;border-radius:12px;margin-bottom:10px}}
.sz{{display:flex;flex-direction:column;align-items:center;gap:6px}}
.sz span{{font-size:12px;opacity:.75}}
.s180 svg{{width:180px;height:180px;display:block}} .s32 svg{{width:32px;height:32px;display:block}} .s16 svg{{width:16px;height:16px;display:block}}
.zz{{display:flex;gap:10px}}
.px{{width:96px;height:96px;image-rendering:pixelated;display:block;border-radius:4px}}
.zoom span{{max-width:210px;text-align:center}}
.apps{{display:flex;gap:16px;align-items:center;flex-wrap:wrap;margin-top:6px}}
.app{{width:180px;height:180px;border-radius:40px;display:grid;place-items:center;padding:22px;box-shadow:0 1px 0 rgba(0,0,0,.08) inset,0 6px 18px rgba(0,0,0,.12)}}
.app svg{{width:100%;height:100%}}
.cols{{display:grid;grid-template-columns:1fr 1fr;gap:28px}}
.pal{{list-style:none;padding:0;margin:0}}
.pal li{{display:grid;grid-template-columns:36px 1fr;column-gap:12px;padding:8px 0;border-bottom:1px solid var(--line)}}
.chip{{grid-row:span 2;width:36px;height:36px;border-radius:8px;border:1px solid rgba(0,0,0,.12)}}
.pal b{{margin-right:8px}} .pal code{{font-size:13px;color:var(--muted)}}
.job{{grid-column:2;font-size:14px;color:var(--muted)}}
.checks{{font-size:13px;color:var(--muted);padding-left:18px}}
.note{{font-size:14px;color:var(--muted);max-width:70ch}}
.spec{{border-radius:12px;padding:22px}}
.spec-h{{font-size:30px;line-height:1.1;margin:0 0 10px;}}
.spec-b{{margin:0 0 14px}}
.btn{{display:inline-block;padding:12px 18px;border-radius:999px;font-weight:600}}
.spec-cap{{font-size:12px;opacity:.6;margin:12px 0 0}}
.compare{{background:#fff;border-radius:18px;padding:24px;border:1px solid var(--line)}}
.compare .row{{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}}
@media (max-width:760px){{.pair,.cols,.compare .row{{grid-template-columns:1fr}} .take{{padding:16px}} .sizes{{gap:14px}}}}
</style></head>
<body><main>
<div class="intro">
<h1>miCole: three logo takes</h1>
<p>Each take has its own lettering, cap size and tassel. Round 2: every cap now tilts to the left and joins the C as one shape (no gap between cap and letter). All marks are outlined vector paths (no font needed to display the logo). The 16 px "simple" version drops the band and tassel and keeps only the flat diamond, as briefed.</p>
<p>Pick one take (or name parts to combine: "lettering from 3, cap angle from 1"). Nothing here is final until you pick.</p>
<nav class="jump"><a href="#pizarra">1 Pizarra</a><a href="#tinta">2 Tinta</a><a href="#trazo">3 Trazo</a><a href="#side">Side by side</a></nav>
</div>
{"".join(sections)}
<section class="compare" id="side"><h3>Side by side, same height</h3>
<div class="row">
{"".join(tile(logos[t["id"]]["wordmark"], t["light"], "wm-tile sm") for t in TAKES)}
</div></section>
</main></body></html>'''
open("/home/user/mi-cole/logo-preview.html", "w").write(html)
print("written", len(html))
