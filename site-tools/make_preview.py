"""Write one self-contained HTML file (CSS, JS, fonts, images inlined) for previewing site/ anywhere."""
import re, base64, os, sys
SITE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "site")
MIME = {'.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png'}
def data(path):
    f = os.path.join(SITE, path)
    return f"data:{MIME[os.path.splitext(f)[1]]};base64," + base64.b64encode(open(f, 'rb').read()).decode()
h = open(os.path.join(SITE, "index.html")).read()
css = open(os.path.join(SITE, "style.css")).read()
css = re.sub(r'url\("(assets/[^"]+)"\)', lambda m: f'url("{data(m.group(1))}")', css)
js = open(os.path.join(SITE, "script.js")).read()
h = h.replace('<link rel="stylesheet" href="style.css">', f"<style>{css}</style>")
h = h.replace('<script src="script.js" defer></script>', '')
h = h.replace('</body>', f"<script>{js}</script>\n</body>")
h = re.sub(r'<link rel="preload"[^>]+>\n?', '', h)
h = re.sub(r'(src|srcset|href)="(assets/[^"]+)"', lambda m: f'{m.group(1)}="{data(m.group(2))}"', h)
# preview copies should always show the intro, so the first-visit memory is skipped here
h = h.replace("&&!localStorage.getItem('micole-intro')", "")
out = sys.argv[1]
open(out, "w").write(h); print(out, round(len(h)/1024), "KB")
