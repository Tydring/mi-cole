import json, os, re, subprocess
L = json.load(open("logos.json"))["pizarra"]
OUT = "/home/user/mi-cole/brand/final"
os.makedirs(OUT, exist_ok=True)
THEMES = {"light": {"bg": "#F5EFE3", "ink": "#17363A", "acc": "#E59A2F"},
          "dark": {"bg": "#10282B", "ink": "#F5EFE3", "acc": "#E59A2F"}}
def standalone(svg, t, pad=0.0, bg=True, radius=0):
    vb = [float(x) for x in re.search(r'viewBox="([^"]+)"', svg).group(1).split()]
    x, y, w, h = vb
    x -= w * pad; y -= h * pad; w *= 1 + 2 * pad; h *= 1 + 2 * pad
    inner = re.sub(r'^<svg[^>]*>', '', svg)[:-6]
    style = (f'<style>.ink{{fill:{t["ink"]}}}.gap{{stroke:{t["bg"]}}}.acc{{fill:{t["acc"]}}}.acc-s{{stroke:{t["acc"]}}}</style>')
    rect = f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{radius*w:.1f}" fill="{t["bg"]}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x:.1f} {y:.1f} {w:.1f} {h:.1f}">'
            f'<title>miCole</title>{style}{rect}{inner}</svg>')
files = {}
for name, t in THEMES.items():
    files[f"micole-wordmark-{name}.svg"] = standalone(L["wordmark"], t, pad=0.06)
    files[f"micole-mark-{name}.svg"] = standalone(L["mark"], t, pad=0.04)
# app icon: dark tile, paper mark, padded so the phone's rounding never clips the cap
icon_t = {"bg": "#17363A", "ink": "#F5EFE3", "acc": "#E59A2F"}
files["micole-app-icon.svg"] = standalone(L["mark"], icon_t, pad=0.16)
# favicon: the simple diamond version, works at 16 px
files["favicon.svg"] = standalone(L["small"], THEMES["light"], pad=0.04, radius=0.18)
for f, s in files.items():
    open(os.path.join(OUT, f), "w").write(s)
# PNG renders
jobs = [("micole-app-icon.svg", "apple-touch-icon.png", 180), ("micole-app-icon.svg", "icon-512.png", 512),
        ("favicon.svg", "favicon-32.png", 32), ("favicon.svg", "favicon-16.png", 16),
        ("micole-wordmark-light.svg", "micole-wordmark-light.png", 0), ("micole-wordmark-dark.svg", "micole-wordmark-dark.png", 0)]
json.dump(jobs, open("jobs.json", "w"))
open("png.js", "w").write("""
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const jobs=JSON.parse(fs.readFileSync('jobs.json'));const dir=process.argv[2];
for(const [src,out,size] of jobs){const svg=fs.readFileSync(dir+'/'+src,'utf8');
 const vb=svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
 const w=size||1200, h=size||Math.round(1200*vb[3]/vb[2]);
 const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:1});
 await p.setContent(`<style>html,body{margin:0}svg{width:${w}px;height:${h}px;display:block}</style>${svg}`);
 await p.screenshot({path:dir+'/'+out,omitBackground:true});await p.close();}
await b.close();})();""")
subprocess.run(["node", "png.js", OUT], check=True)
print(sorted(os.listdir(OUT)))
