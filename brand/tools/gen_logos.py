"""Generate miCole logo explorations as outlined SVG.

Coordinates: baseline y=0, y grows down, cap height normalised to 140 units.
"""
import math, json, os, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen

FONTS = os.path.join(os.path.dirname(__file__), "fonts")
OUT = "/home/user/mi-cole/brand"
os.makedirs(OUT, exist_ok=True)
CAP_H = 140.0

# ---------------------------------------------------------------- glyph helpers
class FontLetters:
    def __init__(self, fname, tracking=0.0):
        self.t = TTFont(os.path.join(FONTS, fname))
        self.gs = self.t.getGlyphSet()
        self.cmap = self.t.getBestCmap()
        self.s = CAP_H / self.t["OS/2"].sCapHeight
        self.tracking = tracking
        self.hmtx = self.t["hmtx"]

    def glyph(self, name, x):
        """Return (path_d, bounds, advance) for glyph placed at pen x."""
        s = self.s
        pen = SVGPathPen(self.gs)
        tp = TransformPen(pen, (s, 0, 0, -s, x, 0))
        self.gs[name].draw(tp)
        bp = BoundsPen(self.gs)
        self.gs[name].draw(TransformPen(bp, (s, 0, 0, -s, x, 0)))
        adv = self.hmtx[name][0] * s
        return pen.getCommands(), bp.bounds, adv

    def layout(self, word, kern=None, swap=None):
        kern = kern or {}
        swap = swap or {}
        x = 0.0
        parts = []
        for i, ch in enumerate(word):
            name = swap.get(i, self.cmap[ord(ch)])
            d, b, adv = self.glyph(name, x)
            parts.append({"ch": ch, "d": d, "b": b, "x": x})
            x += adv + self.tracking + kern.get(i, 0)
        return parts


def circle_d(cx, cy, r):
    return f"M{cx-r:.2f} {cy:.2f}a{r:.2f} {r:.2f} 0 1 0 {2*r:.2f} 0a{r:.2f} {r:.2f} 0 1 0 {-2*r:.2f} 0Z"


class MonoLetters:
    """Hand-built monoline lettering. Stroke-based, round caps."""
    SW = 25.0   # stroke width
    XH = 100.0  # x-height
    ASC = 150.0

    def layout(self, word, kern=None, swap=None, gap=17.0):
        sw, h = self.SW, self.SW / 2
        xh = self.XH
        x = 0.0
        parts = []
        kern = kern or {}
        swap = swap or {}
        for i, ch in enumerate(word):
            dot = swap.get(i) != "dotlessi"
            strokes, fills, w = [], [], 0
            if ch == "m":
                r = 30.0
                x0 = x + h
                top = -xh + h
                cy = top + r
                strokes.append(f"M{x0} {-h+0.0}V{cy}A{r} {r} 0 0 1 {x0+2*r} {cy}V{-h}"
                               f"M{x0+2*r} {cy}A{r} {r} 0 0 1 {x0+4*r} {cy}V{-h}")
                w = 4 * r + sw
            elif ch == "i":
                x0 = x + h
                strokes.append(f"M{x0} {-h}V{-xh+h}")
                if dot:
                    fills.append(circle_d(x0, -xh - 30, 14.5))
                w = sw
            elif ch == "C":
                r = CAP_H / 2 - h + 2
                cx = x + r + h
                cy = -CAP_H / 2
                a0, a1 = math.radians(-96), math.radians(50)  # opening to the right
                sx, sy = cx + r * math.cos(a0), cy + r * math.sin(a0)
                ex, ey = cx + r * math.cos(a1), cy + r * math.sin(a1)
                strokes.append(f"M{sx:.2f} {sy:.2f}A{r:.2f} {r:.2f} 0 1 0 {ex:.2f} {ey:.2f}")
                w = 2 * r + sw - 10
            elif ch == "o":
                r = (xh - sw) / 2
                cx = x + r + h
                strokes.append(circle_d(cx, -xh / 2, r))
                w = 2 * r + sw
            elif ch == "l":
                x0 = x + h
                strokes.append(f"M{x0} {-h}V{-self.ASC+h}")
                w = sw
            elif ch == "e":
                r = (xh - sw) / 2
                cx = x + r + h
                cy = -xh / 2
                a = math.radians(40)
                ex, ey = cx + r * math.cos(a), cy + r * math.sin(a)
                strokes.append(f"M{cx-r:.2f} {cy}H{cx+r:.2f}A{r:.2f} {r:.2f} 0 1 0 {ex:.2f} {ey:.2f}")
                w = 2 * r + sw
            top = {"m": -xh, "i": -xh - 45, "C": -CAP_H, "o": -xh, "l": -self.ASC, "e": -xh}[ch]
            parts.append({"ch": ch, "strokes": strokes, "fills": fills,
                          "b": (x, top, x + w, 0), "x": x})
            x += w + gap + kern.get(i, 0)
        return parts


# ---------------------------------------------------------------- cap
def rot(px, py, ang):
    a = math.radians(ang)
    return px * math.cos(a) - py * math.sin(a), px * math.sin(a) + py * math.cos(a)


def cap_svg(cx, cy, W, ang, tassel="right", simple=False, gap=None, flat=0.16, tassel_len=0.40, attach=0.43, bw=0.28, knock=0.0):
    """Mortarboard centred at board centre (cx, cy), board width W, rotated ang deg.

    Fill classes: .ink for the cap, .acc for the tassel, gap stroke uses .gap (bg colour).
    Returns (svg, points) where points are for bbox estimation.
    """
    g = gap if gap is not None else W * 0.035
    pts = []
    def T(px, py):
        rx, ry = rot(px * W, py * W, ang)
        return cx + rx, cy + ry
    board = [(-0.5, 0), (0, -flat), (0.5, 0), (0, flat)]
    bpts = [T(*p) for p in board]
    pts += bpts
    out = []
    if not simple:
        # skull band, sits under the board and over the letter
        band = [(-0.29, 0.05), (-0.29, 0.29), None, (0.29, 0.29), (0.29, 0.05)]
        a = T(-bw, 0.04); b = T(-bw + 0.005, 0.22); c = T(0, 0.31); d = T(bw - 0.005, 0.22); e = T(bw, 0.04)
        pts += [a, b, c, d, e]
        kn = f'class="ink gap" stroke-width="{W*knock:.2f}" paint-order="stroke" stroke-linejoin="round" ' if knock else 'class="ink" '
        out.append(f'<path {kn}'
                   f'd="M{a[0]:.2f} {a[1]:.2f}L{b[0]:.2f} {b[1]:.2f}Q{c[0]:.2f} {c[1]:.2f} {d[0]:.2f} {d[1]:.2f}L{e[0]:.2f} {e[1]:.2f}Z"/>')
    d = "M" + "L".join(f"{x:.2f} {y:.2f}" for x, y in bpts) + "Z"
    out.append(f'<path class="ink gap" stroke-width="{g:.2f}" paint-order="stroke" stroke-linejoin="round" d="{d}"/>')
    if not simple and tassel:
        side = 1 if tassel == "right" else -1
        btn = T(0, 0)
        corner = T(attach * side, 0.03)
        cw = W * 0.028
        hang_top = corner
        hang_bot = (corner[0], corner[1] + W * tassel_len)
        tpath = f'M{btn[0]:.2f} {btn[1]:.2f}L{corner[0]:.2f} {corner[1]:.2f}L{hang_bot[0]:.2f} {hang_bot[1]:.2f}'
        if False:
            # background-coloured halo under the hanging cord so it cuts the letter cleanly
            hb = f'M{corner[0]:.2f} {corner[1]+W*0.06:.2f}L{hang_bot[0]:.2f} {hang_bot[1]+W*0.12:.2f}'
            out.append(f'<path class="gap" fill="none" stroke-width="{cw + 2*W*knock:.2f}" stroke-linecap="round" d="{hb}"/>')
            out.append(f'<path class="gap" fill="none" stroke-width="{W*0.075 + 2*W*knock:.2f}" stroke-linecap="round" '
                       f'd="M{hang_bot[0]:.2f} {hang_bot[1]+W*0.02:.2f}L{hang_bot[0]:.2f} {hang_bot[1]+W*0.15:.2f}"/>')
        out.append(f'<path class="acc-s" fill="none" stroke-width="{cw:.2f}" stroke-linecap="round" stroke-linejoin="round" '
                   f'd="M{btn[0]:.2f} {btn[1]:.2f}L{corner[0]:.2f} {corner[1]:.2f}L{hang_bot[0]:.2f} {hang_bot[1]:.2f}"/>')
        tw, tl = W * 0.075, W * 0.17
        x0, y0 = hang_bot
        out.append(f'<path class="acc" d="M{x0-tw*0.35:.2f} {y0-W*0.01:.2f}L{x0+tw*0.35:.2f} {y0-W*0.01:.2f}'
                   f'L{x0+tw*0.55:.2f} {y0+tl:.2f}Q{x0:.2f} {y0+tl+W*0.03:.2f} {x0-tw*0.55:.2f} {y0+tl:.2f}Z"/>')
        out.append(f'<circle class="acc" cx="{btn[0]:.2f}" cy="{btn[1]:.2f}" r="{W*0.042:.2f}"/>')
        pts += [hang_bot, (x0 - tw, y0 + tl + W * 0.03), (x0 + tw, y0 + tl + W * 0.03)]
    return "\n".join(out), pts


def rounded_poly(pts, r):
    """Closed polygon path with corners rounded by distance r (quadratic corners)."""
    n = len(pts)
    d = ""
    for i in range(n):
        p0, p1, p2 = pts[i - 1], pts[i], pts[(i + 1) % n]
        def toward(a, b, dist):
            dx, dy = b[0] - a[0], b[1] - a[1]
            L = math.hypot(dx, dy) or 1
            k = min(dist, L / 2.2) / L
            return a[0] + dx * k, a[1] + dy * k
        a = toward(p1, p0, r if not isinstance(r, list) else r[i])
        b = toward(p1, p2, r if not isinstance(r, list) else r[i])
        d += ("M" if i == 0 else "L") + f"{a[0]:.2f} {a[1]:.2f}Q{p1[0]:.2f} {p1[1]:.2f} {b[0]:.2f} {b[1]:.2f}"
    return d + "Z"


def cap_refined(cx, cy, W, ang, flat=0.17, bw=0.34, depth=0.31, k=0.042, attach=0.42, tassel_len=0.27):
    """Drawn-with-care mortarboard. One cut-line width k (x W) everywhere."""
    def T(u, v):
        rx, ry = rot(u * W, v * W, ang)
        return cx + rx, cy + ry
    g = W * k
    out, pts = [], []
    # band: tapered sides, bottom edge a smooth cubic that echoes the bowl of the C
    lt, rt = T(-bw, 0.0), T(bw, 0.0)
    lb, rb = T(-bw * 0.93, depth * 0.62), T(bw * 0.93, depth * 0.62)
    c1, c2 = T(-bw * 0.62, depth * 1.12), T(bw * 0.62, depth * 1.12)
    band = (f"M{lt[0]:.2f} {lt[1]:.2f}L{lb[0]:.2f} {lb[1]:.2f}"
            f"C{c1[0]:.2f} {c1[1]:.2f} {c2[0]:.2f} {c2[1]:.2f} {rb[0]:.2f} {rb[1]:.2f}"
            f"L{rt[0]:.2f} {rt[1]:.2f}Z")
    out.append(f'<path class="ink gap" stroke-width="{g:.2f}" paint-order="stroke" stroke-linejoin="round" d="{band}"/>')
    pts += [lt, rt, lb, rb, T(0, depth)]
    # board: slight perspective (back corner a touch shallower), softly rounded corners
    board = [T(-0.5, 0.0), T(0.03, -flat * 0.92), T(0.5, 0.0), T(-0.03, flat)]
    out.append(f'<path class="ink gap" stroke-width="{g:.2f}" paint-order="stroke" stroke-linejoin="round" '
               f'd="{rounded_poly(board, [W*0.035, W*0.05, W*0.035, W*0.05])}"/>')
    pts += board
    # tassel: button, cord along the board to the edge, gravity drop, knot, fringe
    cwid = W * 0.042
    btn = T(-0.02, 0.0)
    edge = T(attach, -0.015)
    drop = (edge[0], edge[1] + W * tassel_len)
    out.append(f'<path class="acc-s" fill="none" stroke-width="{cwid:.2f}" stroke-linecap="round" stroke-linejoin="round" '
               f'd="M{btn[0]:.2f} {btn[1]:.2f}L{edge[0]:.2f} {edge[1]:.2f}L{drop[0]:.2f} {drop[1]:.2f}"/>')
    kw, kh = W * 0.085, W * 0.05
    x0, y0 = drop
    out.append(f'<rect class="acc" x="{x0-kw/2:.2f}" y="{y0-kh*0.4:.2f}" width="{kw:.2f}" height="{kh:.2f}" rx="{kh*0.45:.2f}"/>')
    fw, fh = W * 0.10, W * 0.17
    fy = y0 + kh * 0.55
    fr = fw * 0.42
    out.append(f'<path class="acc" d="M{x0-fw*0.36:.2f} {fy:.2f}L{x0+fw*0.36:.2f} {fy:.2f}L{x0+fw/2:.2f} {fy+fh-fr:.2f}'
               f'Q{x0+fw/2:.2f} {fy+fh:.2f} {x0:.2f} {fy+fh:.2f}Q{x0-fw/2:.2f} {fy+fh:.2f} {x0-fw/2:.2f} {fy+fh-fr:.2f}Z"/>')
    out.append(f'<circle class="acc" cx="{btn[0]:.2f}" cy="{btn[1]:.2f}" r="{W*0.052:.2f}"/>')
    pts += [(x0 - fw, fy + fh), (x0 + fw, fy + fh)]
    return "\n".join(out), pts


# ---------------------------------------------------------------- wordmark builders
def letters_svg(parts, mono=False, sw=None, only=None):
    out = []
    for p in parts:
        if only is not None and p["ch"] not in only:
            continue
        if mono:
            for s in p["strokes"]:
                out.append(f'<path class="ink-s" fill="none" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round" d="{s}"/>')
            for f in p["fills"]:
                out.append(f'<path class="ink" d="{f}"/>')
        else:
            out.append(f'<path class="ink" d="{p["d"]}"/>')
    return "\n".join(out)


def bbox(points, pad):
    xs = [p[0] for p in points]; ys = [p[1] for p in points]
    return min(xs) - pad, min(ys) - pad, max(xs) + pad, max(ys) + pad


def svg_wrap(inner, vb, extra=""):
    x0, y0, x1, y1 = vb
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0:.1f} {y0:.1f} {x1-x0:.1f} {y1-y0:.1f}" {extra}>'
            f'{inner}</svg>')


def fused_cap(X, f):
    """Pizarra round 4: cap whose band grows out of the C's top terminal.

    X = pen x of the C. All C-local numbers are Bricolage C outline coords (cap height 140).
    f: dict with bx, by (board centre, C-local), W, ang, flat, swing (deg from vertical), hang, gap.
    """
    W, ang, flat = f["W"], f["ang"], f["flat"]
    cx, cy = X + f["bx"], f["by"]
    def T(u, v):
        rx, ry = rot(u * W, v * W, ang)
        return cx + rx, cy + ry
    board = [T(-0.5, 0), T(0.04, -flat), T(0.5, 0), T(-0.04, flat)]
    # band: from under the board down into the C, right edge lands on the top terminal,
    # bottom follows the inner curve of the C so the counter stays open
    tl = T(-0.17, 0.06)
    tr = T(0.40, 0.02)
    band = [tl, tr, (X + 125.6, -90.0), (X + 96.9, -86.5), (X + 95.6, -99.0), (X + 89.5, -110.0),
            (X + 79.0, -117.3), (X + 70.0, -118.3), (X + 50.0, -120.0), (X + 32.0, -130.0)]
    out = []
    out.append('<path class="ink" d="M' + "L".join(f"{x:.2f} {y:.2f}" for x, y in band) + 'Z"/>')
    g = f["gap"]
    out.append(f'<path class="ink gap" stroke-width="{g:.2f}" paint-order="stroke" stroke-linejoin="round" d="M'
               + "L".join(f"{x:.2f} {y:.2f}" for x, y in board) + 'Z"/>')
    # tassel: button left of centre, cord to the high right corner, then swings out to the right
    btn = T(-0.02, 0.0)
    knot = T(0.36, -0.035)
    a = math.radians(f["swing"])
    L = W * f["hang"]
    end = (knot[0] + L * math.sin(a), knot[1] + L * math.cos(a))
    cw = W * 0.03
    out.append(f'<path class="acc-s" fill="none" stroke-width="{cw:.2f}" stroke-linecap="round" stroke-linejoin="round" '
               f'd="M{btn[0]:.2f} {btn[1]:.2f}L{knot[0]:.2f} {knot[1]:.2f}L{end[0]:.2f} {end[1]:.2f}"/>')
    tl_len, tw = W * 0.19, W * 0.085
    dx, dy = math.sin(a), math.cos(a)
    px_, py_ = dy, -dx  # perpendicular
    p0 = (end[0] - dx * W * 0.02, end[1] - dy * W * 0.02)
    p1 = (end[0] + dx * tl_len, end[1] + dy * tl_len)
    q = lambda p, k: (p[0] + px_ * k, p[1] + py_ * k)
    a0, a1, b1, b0 = q(p0, tw * 0.32), q(p0, -tw * 0.32), q(p1, -tw * 0.55), q(p1, tw * 0.55)
    tip = (p1[0] + dx * W * 0.035, p1[1] + dy * W * 0.035)
    out.append(f'<path class="acc" d="M{a0[0]:.2f} {a0[1]:.2f}L{a1[0]:.2f} {a1[1]:.2f}L{b1[0]:.2f} {b1[1]:.2f}'
               f'Q{tip[0]:.2f} {tip[1]:.2f} {b0[0]:.2f} {b0[1]:.2f}Z"/>')
    out.append(f'<circle class="acc" cx="{btn[0]:.2f}" cy="{btn[1]:.2f}" r="{W*0.04:.2f}"/>')
    pts = board + band + [end, tip, b0, b1]
    return "\n".join(out), pts


def build_take(cfg):
    if cfg["kind"] == "mono":
        L = MonoLetters()
        parts = L.layout("miCole", kern=cfg.get("kern"))
        mono, sw = True, L.SW
    else:
        L = FontLetters(cfg["font"], cfg.get("tracking", 0))
        parts = L.layout("miCole", kern=cfg.get("kern"), swap={1: "dotlessi"} if cfg.get("dotless") else None)
        mono, sw = False, None
    C = parts[2]
    cx0, cy0, cx1, cy1 = C["b"]
    cw = cx1 - cx0
    capW = cw * cfg["cap_scale"]
    ccx = (cx0 + cx1) / 2 + cw * cfg["cap_dx"]
    ccy = cy0 + cfg["seat"] * CAP_H - 0.27 * capW
    if cfg.get("refined"):
        r = cfg["refined"]
        cap, cpts = cap_refined(ccx, ccy, capW, cfg["cap_angle"], **r)
    elif cfg.get("fused"):
        f = dict(cfg["fused"]); f["W"] = cw * f["Wk"]; f["gap"] = f["W"] * 0.03
        cap, cpts = fused_cap(C["x"], f)
    else:
        cap, cpts = cap_svg(ccx, ccy, capW, cfg["cap_angle"], tassel=cfg["tassel"],
                            tassel_len=cfg.get("tassel_len", 0.40), attach=cfg.get("attach", 0.43), bw=cfg.get("bw", 0.28), knock=cfg.get("knock", 0.0))
    letter_pts = []
    for p in parts:
        b = p["b"]; letter_pts += [(b[0], b[1]), (b[2], b[3])]
    wm_vb = bbox(letter_pts + cpts, 12)
    wordmark = svg_wrap(letters_svg(parts, mono, sw) + cap, wm_vb, 'class="wm"')

    # compact mark: C alone with cap, in a square
    c_only = letters_svg(parts, mono, sw, only="C")
    cb = bbox([(cx0, cy0), (cx1, cy1)] + cpts, 0)
    side = max(cb[2] - cb[0], cb[3] - cb[1]) * 1.12
    mx, my = (cb[0] + cb[2]) / 2, (cb[1] + cb[3]) / 2
    sq = (mx - side / 2, my - side / 2, mx + side / 2, my + side / 2)
    mark = svg_wrap(c_only + cap, sq, 'class="mk"')

    # small mark: diamond only, larger and flatter-proof, for 16 px
    scap, spts = cap_svg((cx0 + cx1) / 2 + cw * cfg["cap_dx"] * 0.5, cy0 - cw * 0.06, cw * 1.12,
                         cfg["cap_angle"] * 0.8, simple=True, gap=0, flat=0.22)
    sb = bbox([(cx0, cy0), (cx1, cy1)] + spts, 0)
    side2 = max(sb[2] - sb[0], sb[3] - sb[1]) * 1.06
    mx2, my2 = (sb[0] + sb[2]) / 2, (sb[1] + sb[3]) / 2
    sq2 = (mx2 - side2 / 2, my2 - side2 / 2, mx2 + side2 / 2, my2 + side2 / 2)
    if mono:
        c_small = c_only.replace(f'stroke-width="{sw}"', f'stroke-width="{sw*1.25}"')
    else:
        c_small = c_only
    small = svg_wrap(c_small + scap, sq2, 'class="mk"')

    res = {"wordmark": wordmark, "mark": mark, "small": small}

    if cfg.get("i_variant"):
        if mono:
            parts_i = L.layout("miCole", kern=cfg.get("kern"), swap={1: "dotlessi"})
        else:
            parts_i = L.layout("miCole", kern=cfg.get("kern"), swap={1: "dotlessi"})
        I = parts_i[1]
        ix0, iy0, ix1, iy1 = I["b"]
        iw = CAP_H * 0.62
        icx = (ix0 + ix1) / 2 + iw * 0.06
        iy = (-MonoLetters.XH if mono else iy0) - iw * 0.30
        icap, ipts = cap_svg(icx, iy, iw, cfg["cap_angle"] * 1.2, tassel="right", tassel_len=0.34)
        lp = []
        for p in parts_i:
            b = p["b"]; lp += [(b[0], b[1]), (b[2], b[3])]
        vb = bbox(lp + ipts, 12)
        res["wordmark_i"] = svg_wrap(letters_svg(parts_i, mono, sw) + icap, vb, 'class="wm"')
    return res


TAKES = [
    {
        "id": "pizarra", "name": "Pizarra", "kind": "font", "font": "bricolage700.ttf",
        "tracking": -4, "kern": {1: 12, 2: 8}, "dotless": True,
        "cap_scale": 1.32, "cap_dx": -0.30, "seat": 0.10, "cap_angle": -18, "tassel": "right", "knock": 0.032,
        "attach": 0.42, "bw": 0.34, "tassel_len": 0.30, "i_variant": False,
        "refined": {"bw": 0.33, "depth": 0.30, "k": 0.042, "attach": 0.475, "tassel_len": 0.13},
    },
    {
        "id": "tinta", "name": "Tinta", "kind": "font", "font": "fraunces600.ttf",
        "tracking": -2, "kern": {1: 26, 2: 4},
        "cap_scale": 1.30, "cap_dx": 0.09, "seat": 0.24, "cap_angle": -8, "tassel": "left",
        "attach": 0.46, "bw": 0.32, "tassel_len": 0.16,
    },
    {
        "id": "trazo", "name": "Trazo", "kind": "mono",
        "kern": {1: 26, 2: 2},
        "cap_scale": 1.36, "cap_dx": -0.07, "seat": 0.20, "cap_angle": -17, "tassel": "right",
        "attach": 0.40, "bw": 0.33, "tassel_len": 0.36,
    },
]

if __name__ == "__main__":
    out = {}
    for t in TAKES:
        out[t["id"]] = build_take(t)
    with open(os.path.join(os.path.dirname(__file__), "logos.json"), "w") as f:
        json.dump(out, f)
    print("ok", {k: list(v.keys()) for k, v in out.items()})
