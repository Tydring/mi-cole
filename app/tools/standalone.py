"""Build one self-contained HTML file of the demo (fonts, icon, CSS and JS inlined) to open on a phone without hosting.
Usage, from app/:  python3 tools/standalone.py <out.html>"""
import re, base64, glob, os, subprocess, sys, tempfile
out = sys.argv[1]
d = tempfile.mkdtemp()
subprocess.run(["npx", "vite", "build", "--base", "./", "--outDir", d], check=True, capture_output=True)
h = open(d + "/index.html").read()
js = open(glob.glob(d + "/assets/*.js")[0]).read(); css = open(glob.glob(d + "/assets/*.css")[0]).read()
b64 = lambda p, m: f"data:{m};base64," + base64.b64encode(open(p, "rb").read()).decode()
for w in ("400", "700"): css = css.replace(f"/demo/fonts/bricolage{w}.woff2", b64(f"public/fonts/bricolage{w}.woff2", "font/woff2"))
mark = b64("public/icons/micole-mark-light.svg", "image/svg+xml")
js = js.replace("/demo/icons/micole-mark-light.svg", mark)
h = re.sub(r'<link rel="(manifest|preload|apple-touch-icon)"[^>]*>\n?', "", h)
h = re.sub(r'<link rel="icon"[^>]*>', f'<link rel="icon" href="{mark}">', h)
h = re.sub(r'<script type="module"[^>]*></script>', "", h)
h = re.sub(r'<link rel="stylesheet"[^>]*>', "", h)
h = h.replace("</head>", f"<style>{css}</style></head>").replace("</body>", '<script type="module">' + js.replace("</script", "<\\/script") + "</script></body>")
open(out, "w").write(h)
print(out, len(h) // 1024, "KB")
