# site-tools

Authoring helpers for `site/`. Not deployed. The site itself has no build step: `site/` is plain files.

- `intro_svg.py logos.json` regenerates the inline intro SVG (`intro.svg.html`, `intro.json`) from the locked logo.
- `build_index.py` writes `site/index.html` from `index.template.html` plus the intro SVG. Edit copy in the template, then run it.
- `og.html` is the source of `site/assets/og.png` (1200x630 share image).
- `make_preview.py` writes a single self-contained HTML file for previewing on a phone.

## The demo at /demo (provisional, added 2026-11-17)
`site/demo/` is the built miCole demo app. Do not edit it by hand: change `app/` and run `npm run build:site` inside `app/`, which rebuilds it here.
Nothing on the site links to it (decision: Christian shares the link by hand). It is kept out of search engines with `noindex` (meta tag and an `X-Robots-Tag` header in `vercel.json`).
To take it down: delete `site/demo/` and the three `/demo` header rules in `vercel.json`.
