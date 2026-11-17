"""Hand-built favicon on a 32-unit grid: dark tile like the app icon, paper C,
a cap clearly separated from the C, and a mango tassel. Built to read at 16 px."""
import math, os, subprocess, json
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
OUT = "/home/user/mi-cole/brand/final"
t = TTFont(os.path.join(os.path.dirname(os.path.abspath(__file__)), "fonts", "bricolage700.ttf")); gs = t.getGlyphSet()
s = 16.0 / 688.0                       # C is 16 units tall
X0, Y0 = 9.6 - 29 * s, 13.8 + 674 * s
pen = SVGPathPen(gs); gs["C"].draw(TransformPen(pen, (s, 0, 0, -s, X0, Y0))); cpath = pen.getCommands()
def rot(x, y, cx, cy, a):
    a = math.radians(a); x -= cx; y -= cy
    return cx + x * math.cos(a) - y * math.sin(a), cy + x * math.sin(a) + y * math.cos(a)
cx, cy, ang = 15.6, 7.6, -16           # board centre and tilt (same lean as the logo)
board = [rot(x, y, cx, cy, ang) for x, y in [(cx - 10, cy), (cx, cy - 4.4), (cx + 10, cy), (cx, cy + 4.4)]]
bd = "M" + "L".join(f"{x:.2f} {y:.2f}" for x, y in board) + "Z"
btn = (cx - 0.3, cy)
corner = rot(cx + 8.2, cy - 0.2, cx, cy, ang)
drop = (corner[0], corner[1] + 4.6)
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><title>miCole</title>
<rect width="32" height="32" rx="7" fill="#17363A"/>
<path d="{cpath}" fill="#F5EFE3"/>
<path d="{bd}" fill="#F5EFE3" stroke="#F5EFE3" stroke-width="0.6" stroke-linejoin="round"/>
<path d="M{btn[0]:.2f} {btn[1]:.2f}L{corner[0]:.2f} {corner[1]:.2f}L{drop[0]:.2f} {drop[1]:.2f}" fill="none" stroke="#E59A2F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="{drop[0]-1.6:.2f}" y="{drop[1]-0.4:.2f}" width="3.2" height="4.2" rx="1" fill="#E59A2F"/>
</svg>'''
open(os.path.join(OUT, "favicon.svg"), "w").write(svg)
js = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fav.js")
open(js, "w").write("""const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const svg=fs.readFileSync(process.argv[2]+'/favicon.svg','utf8');
for(const n of [16,32,48]){const p=await b.newPage({viewport:{width:n,height:n}});
await p.setContent(`<style>html,body{margin:0}svg{width:${n}px;height:${n}px;display:block}</style>${svg}`);
await p.screenshot({path:process.argv[2]+`/favicon-${n}.png`,omitBackground:true});await p.close();}await b.close();})();""")
subprocess.run(["node", js, OUT], check=True)
print("favicon ok")
