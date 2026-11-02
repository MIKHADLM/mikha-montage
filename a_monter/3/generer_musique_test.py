"""Instrumental de test (vidéo 3), type trap, sans voix, entièrement synthétisé ici : aucun échantillon,
aucun service. Provisoire : jamais écouté par son auteur, à remplacer par une vraie piste.

Usage : python3 generer_musique_test.py [sortie.wav]   (python seul, pas de numpy)
Sortie par défaut : assets/musique_test_generee.wav, 48 kHz, stéréo, 16 bits, 32 s, pic à -1 dBFS.
140 BPM en demi-tempo, do mineur, boucle de 4 mesures : kick, 808, clap, charleston, pluck, nappe.
"""
import array, math, random, sys, wave
from pathlib import Path

SR = 48000
BPM = 140
DUREE = 32.0
SEIZIEME = 60 / BPM / 4
N = int(DUREE * SR)
G = [0.0] * N
D = [0.0] * N
random.seed(8323)


def mf(n):
    return 440 * 2 ** ((n - 69) / 12)


def poser(i0, sons, gg, gd):
    for k, v in enumerate(sons):
        i = i0 + k
        if i >= N:
            break
        G[i] += v * gg
        D[i] += v * gd


def kick(d=0.28):
    n = int(d * SR)
    out, ph = [], 0.0
    for i in range(n):
        t = i / SR
        f = 48 + 170 * math.exp(-t * 38)
        ph += 2 * math.pi * f / SR
        out.append(math.tanh(2.2 * math.sin(ph)) * math.exp(-t * 11))
    return out


def s808(note, d, glisse=0):
    n = int(d * SR)
    out, ph = [], 0.0
    for i in range(n):
        t = i / SR
        f = mf(note) * 2 ** (glisse * min(1, max(0, t / d - 0.6) / 0.4) / 12)
        ph += 2 * math.pi * f / SR
        env = min(1, t / 0.004) * math.exp(-t * 1.6) * min(1, (d - t) / 0.02)
        out.append(math.tanh(1.8 * math.sin(ph)) * env)
    return out


def clap():
    n = int(0.22 * SR)
    out, p = [], 0.0
    for i in range(n):
        t = i / SR
        b = random.uniform(-1, 1)
        h = b - p  # passe-haut simple
        p = 0.6 * p + 0.4 * b
        env = sum(math.exp(-(t - x) * 90) for x in (0, 0.011, 0.022) if t >= x) * 0.5 + 0.6 * math.exp(-t * 16)
        out.append(h * env * 0.8)
    return out


def hat(d=0.05):
    n = int(d * SR)
    out, p = [], 0.0
    for i in range(n):
        t = i / SR
        b = random.uniform(-1, 1)
        out.append((b - p) * math.exp(-t * 6 / d))
        p = b
    return out


def pluck(note, d=0.5):
    n = int(d * SR)
    f = mf(note)
    w = 2 * math.pi * f / SR
    return [math.sin(i * w + (1.6 * math.exp(-i / SR * 12)) * math.sin(2 * i * w)) * math.exp(-i / SR * 7) * min(1, i / 96)
            for i in range(n)]


def nappe(notes, d):
    n = int(d * SR)
    w = [(2 * math.pi * mf(x) / SR, 2 * math.pi * mf(x) * 1.003 / SR) for x in notes]
    out = []
    for i in range(n):
        v = sum(math.sin(i * a) + math.sin(i * b) for a, b in w) / (2 * len(w))
        out.append(v * min(1, i / (0.3 * SR)) * min(1, (n - i) / (0.3 * SR)))
    return out


SONS_KICK, CLAP = kick(), clap()
HATS = (hat(0.05), hat(0.03), hat(0.16))
# Boucle de 4 mesures (16 seizièmes par mesure) : do mineur, la bémol, fa mineur, sol
ACCORDS = [(36, (60, 63, 67)), (32, (56, 60, 63)), (29, (53, 56, 60)), (31, (55, 58, 62))]
KICKS = [(0, 1.0), (7, 0.9), (10, 0.85)]
BASSES = [(0, 6), (7, 3), (10, 6)]
# (seizième, note) sur 2 mesures, gamme de do mineur pentatonique
MELODIE = [(0, 75), (3, 72), (6, 70), (8, 67), (11, 70), (14, 72), (16, 75), (19, 77), (22, 75), (24, 72), (27, 70), (30, 67)]

mesures = int(DUREE / (16 * SEIZIEME)) + 1
for m in range(mesures):
    t0 = m * 16 * SEIZIEME
    i0 = int(t0 * SR)
    fond, acc = ACCORDS[m % 4]
    poser(i0, [v * 0.22 for v in nappe(acc, 16 * SEIZIEME)], 0.9, 1.0)
    for s, g in KICKS:
        poser(i0 + int(s * SEIZIEME * SR), [v * 0.6 * g for v in SONS_KICK], 1, 1)
    for s, l in BASSES:
        d = l * SEIZIEME
        glisse = -2 if s == 10 and m % 2 else 0
        poser(i0 + int(s * SEIZIEME * SR), [v * 0.36 for v in s808(fond, d, glisse)], 1, 1)
    poser(i0 + int(8 * SEIZIEME * SR), [v * 0.55 for v in CLAP], 1, 0.94)
    # charleston : croches, roulement en fin de mesure paire ; déplacé légèrement dans la stéréo
    pas = list(range(0, 16, 2))
    for s in pas:
        v = 0.2 if s % 4 == 0 else 0.14
        poser(i0 + int(s * SEIZIEME * SR), [x * v for x in HATS[0]], 0.8, 1.0)
    if m % 2 == 1:
        for k in range(6):
            poser(i0 + int((13 + k / 2) * SEIZIEME * SR), [x * (0.05 + 0.012 * k) for x in HATS[1]], 1.0, 0.8)
    if m % 4 == 3:
        poser(i0 + int(6 * SEIZIEME * SR), [x * 0.1 for x in HATS[2]], 0.9, 1.0)
    # pluck avec un écho croisé (voix absente, donc rien ne gêne les mots : niveau discret)
    if m % 2 == 0:
        for s, n in MELODIE:
            son = pluck(n)
            i = i0 + int(s * SEIZIEME * SR)
            poser(i, [v * 0.34 for v in son], 1.0, 0.75)
            poser(i + int(3 * SEIZIEME * SR), [v * 0.14 for v in son], 0.5, 1.0)
            poser(i + int(6 * SEIZIEME * SR), [v * 0.08 for v in son], 1.0, 0.5)

# Sommation : légère saturation, puis pic à -1 dBFS
G = [math.tanh(1.1 * v) for v in G]
D = [math.tanh(1.1 * v) for v in D]
crete = max(max(map(abs, G)), max(map(abs, D)))
gain = 10 ** (-1 / 20) / crete
sortie = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).parent / "assets" / "musique_test_generee.wav"
pcm = array.array("h", (0 for _ in range(2 * N)))
for i in range(N):
    pcm[2 * i] = int(G[i] * gain * 32767)
    pcm[2 * i + 1] = int(D[i] * gain * 32767)
with wave.open(str(sortie), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print(sortie, f"{DUREE} s")
