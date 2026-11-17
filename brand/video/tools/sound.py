"""Generate the miCole sting soundtrack from scratch (no samples, no licences needed).

Every cue is placed on the frame the animation uses (see sting_template.html).
Output: 48 kHz stereo WAV, 10.5 s. Retimed for the v2 picture (judge fixes).
Phone speakers roll off below ~300 Hz, so every key hit also carries energy at 300 Hz to 1 kHz.
"""
import numpy as np, wave, sys

SR, DUR = 48000, 10.5
N = int(SR * DUR)
rng = np.random.default_rng(7)
mix = np.zeros((N, 2))

def t_(d): return np.arange(int(SR * d)) / SR

def place(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    sig = sig[: max(0, N - i)]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    mix[i:i + len(sig), 0] += sig * gain * l * 1.41
    mix[i:i + len(sig), 1] += sig * gain * r * 1.41

def bandnoise(d, lo, hi):
    """White noise band-passed in the frequency domain."""
    n = int(SR * d); x = rng.standard_normal(n)
    X = np.fft.rfft(x); f = np.fft.rfftfreq(n, 1 / SR)
    X[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(X, n) / 3

def env(n, a, d, shape=4.0):
    """attack seconds, then exponential-ish decay over the rest."""
    na = max(1, int(SR * a)); e = np.ones(n)
    e[:na] = np.linspace(0, 1, na)
    rest = n - na
    e[na:] = np.exp(-shape * np.linspace(0, 1, rest)) if rest > 0 else 1
    return e

def pluck(freq, d=0.9, bright=1.0):
    """Soft mallet / marimba-like note: fundamental + quick-dying overtones."""
    t = t_(d)
    s = (np.sin(2 * np.pi * freq * t) + 0.35 * bright * np.sin(2 * np.pi * freq * 4 * t) * np.exp(-t * 22)
         + 0.15 * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-t * 9))
    return s * env(len(t), 0.004, d, 6.0)

def pop(d=0.16):
    t = t_(d); f = 260 + 700 * np.exp(-t * 40)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.002, d, 9)

def whoosh(d, lo, hi, peak=0.6):
    n = int(SR * d); x = bandnoise(d, lo, hi)
    k = np.linspace(0, 1, n); e = np.where(k < peak, (k / peak) ** 2, ((1 - k) / (1 - peak)) ** 1.5)
    return x * e

def thud(d=0.5):
    t = t_(d); f = 70 + 60 * np.exp(-t * 25)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.003, d, 7)
    click = bandnoise(0.03, 1500, 5000) * env(int(SR * 0.03), 0.001, 0.03, 10)
    knock_t = t_(0.16)
    knock = (np.sin(2 * np.pi * 330 * knock_t) + 0.6 * np.sin(2 * np.pi * 495 * knock_t)
             + 0.35 * np.sin(2 * np.pi * 760 * knock_t)) * env(len(knock_t), 0.002, 0.16, 11)
    knock += 0.5 * bandnoise(0.16, 250, 1400) * env(len(knock_t), 0.001, 0.16, 14)
    out = body * 0.8; out[: len(click)] += 0.5 * click; out[: len(knock)] += 0.9 * knock
    return out

def tick(freq=2400, d=0.05):
    t = t_(d)
    return (np.sin(2 * np.pi * freq * t) * 0.6 + bandnoise(d, 2000, 7000)) * env(len(t), 0.001, d, 12)

# ---- notes: D major pentatonic, warm and hopeful, not childish
NOTE = {"D4": 293.66, "E4": 329.63, "F#4": 369.99, "A4": 440.0, "B4": 493.88,
        "D5": 587.33, "E5": 659.25, "F#5": 739.99, "A5": 880.0, "D3": 146.83, "A3": 220.0, "F#3": 185.0}

# ---- music bed: soft pad on D, opens up when the cap lands
def pad(freqs, d, a=1.2, rel=1.5):
    t = t_(d); s = np.zeros(len(t))
    for f in freqs:
        for det in (-0.6, 0.6):                      # slight detune = warmth
            s += np.sin(2 * np.pi * (f + det) * t + rng.uniform(0, 6.28))
            s += 0.35 * np.sin(2 * np.pi * 2 * (f + det) * t + rng.uniform(0, 6.28))   # 2nd harmonic
            s += 0.12 * np.sin(2 * np.pi * 3 * (f + det) * t + rng.uniform(0, 6.28))   # 3rd harmonic
    s /= len(freqs) * 2
    e = np.minimum(1, t / a) * np.minimum(1, (d - t) / rel)
    return s * np.clip(e, 0, 1)

place(pad([NOTE["D3"], NOTE["A3"], NOTE["D4"]], 3.3, a=1.6, rel=0.8), 0.0, 0.09)
place(pad([NOTE["D3"], NOTE["F#3"], NOTE["A3"], NOTE["D4"], NOTE["F#4"]], 7.5, a=0.3, rel=1.8), 3.0, 0.11)

# ---- sound effects, on the v2 animation's frames
place(pop(), 0.05, 0.55)                                   # dot appears
place(pluck(NOTE["A5"], 0.9, 0.2), 0.15, 0.06)             # the ripple: a faint glassy ring
place(whoosh(0.45, 2500, 9000, 0.7), 0.98, 0.22, 0.3)      # line shoots right
place(whoosh(0.7, 300, 2500, 0.55), 1.30, 0.28, 0.1)       # board unfolds
place(whoosh(0.85, 400, 4000, 0.9), 2.2, 0.32, -0.1)       # cap falls into the still frame, C sweeps round
place(thud(), 3.0, 0.8)                                     # cap lands on the C
place(pluck(NOTE["D5"], 1.6, 0.6), 3.0, 0.30)               # ...and rings the brand note
for at, gain in [(3.17, 0.10), (3.55, 0.06)]:               # tassel swings: one tick per swing, after landing
    place(tick(3200, 0.03), at, gain, 0.4)
place(whoosh(0.7, 600, 3500, 0.5), 3.3, 0.10)               # camera pulls back to the full word
for at, n, pan in [(4.0, "D4", -0.5), (4.08, "E4", -0.3), (4.2, "F#4", 0.2), (4.28, "A4", 0.4), (4.36, "D5", 0.6)]:
    place(pluck(NOTE[n], 0.8), at, 0.26, pan)               # m i o l e rise in
hi = ["D5", "F#5", "A5", "E5", "D5", "A5", "F#5", "E5", "A5", "D5"]
for i in range(10):                                         # tagline words: soft, varied mallet taps, not a metronome
    place(pluck(NOTE[hi[i]], 0.25, 0.3), 4.9 + 0.12 * i, 0.045 + 0.015 * rng.random(), (i / 9 - 0.5) * 0.6)
place(whoosh(0.4, 800, 5000, 0.5), 6.95, 0.16)              # tagline leaves
place(pluck(NOTE["D5"], 0.3, 0.3), 7.40, 0.06); place(pluck(NOTE["E5"], 0.3, 0.3), 7.54, 0.06)
place(pluck(NOTE["A4"], 1.4, 0.5), 7.68, 0.22); place(pluck(NOTE["D5"], 1.2, 0.5), 7.68, 0.16)  # CTA pill
place(pluck(NOTE["F#5"], 0.4, 0.3), 7.82, 0.05)             # WhatsApp line

# ---- master: gentle fade at the end, normalise to -1 dBFS peak
fade = int(SR * 0.35); mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
mix /= np.max(np.abs(mix)) / 10 ** (-1 / 20)
out = (mix * 32767).astype(np.int16)
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(out.tobytes())
print("ok", sys.argv[1])
