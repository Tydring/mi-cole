# miCole logo: final (Pizarra, round 12)

Locked on 2026-11-17.

## Files
- `micole-wordmark-light.svg` / `.png`: dark slate on paper. Default.
- `micole-wordmark-dark.svg` / `.png`: paper on dark slate.
- `micole-mark-light.svg`, `micole-mark-dark.svg`: the capped C alone.
- `micole-app-icon.svg`, `apple-touch-icon.png` (180), `icon-512.png`: dark tile, paper mark.
- `favicon.svg`, `favicon-32.png`, `favicon-16.png`: simple version (diamond only), built to stay readable at 16 px.

Each file has its own background baked in. The thin cut lines are drawn in the background color, so place a file only on its matching background (paper #F5EFE3 or slate #10282B). A transparent version needs the cut lines turned into real geometry first; ask before using one on photos or other colors.

## Palette
| Name | Hex | Job |
|---|---|---|
| Pizarra | #17363A | Wordmark, headings, body text, dark sections |
| Papel | #F5EFE3 | Page background, text on dark |
| Mango | #E59A2F | Main action buttons (Pizarra text), the tassel |
| Guayaba | #D4614A | Tiny highlights only |
| Salvia | #A9C2B4 | Soft surfaces, dividers, illustration fills |
| Tiza | #56625E | Secondary text, captions |

## Type
Bricolage Grotesque 700 for headings (one font file). Body text in the phone's system font.

## Rebuild
`brand/tools/gen_logos.py` regenerates everything (needs `fonttools` and `shapely`, plus the Bricolage TTF from Google Fonts in a `fonts/` folder next to it).
