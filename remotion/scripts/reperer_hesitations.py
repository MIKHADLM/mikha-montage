"""Repère les hésitations restées dans les prises gardées (euh, mots répétés, reprises en cours de phrase).

Usage : python3 scripts/reperer_hesitations.py ../a_monter/<N> [--pause 0.1] [--phrases P3,P5]

Pourquoi : la reconnaissance vocale « nettoie » ce qu'elle entend. Sur une phrase entière, elle saute
souvent les « euh » et les mots dits deux fois (« grâce aux commandes… grâce aux commandes qu'il y a
eu » devient une seule fois), si bien que ces hésitations restent dans le montage (retours de Michaël
sur la v01 de la vidéo 2). Même remède que transcrire.py pour les reprises : découper plus fin.

Pour chaque phrase gardée (transcription/choix.json), chaque morceau est redécoupé aux micro-pauses
(niveau sous le seuil de choix.json pendant au moins --pause s), et chaque bout est retranscrit seul,
avec un modèle invité à écrire les hésitations. Affiche, en temps rush :
  - les bouts et leur texte ;
  - [répétition] : un bout qui recommence les mots du bout suivant (garder le second) ;
  - [hésitation] : « euh », « hum », « ben »… ;
  - [mot long] : un mot de la transcription d'origine qui dure plus de --mot-long s (souvent un
    « euuuh » ou une syllabe tenue avalée par le mot) ;
  - [vide] : un bout sans parole reconnue (souffle, bruit, regard ailleurs) ;
  - [début lent] / [fin qui traîne] : la voix franche (au-dessus de -27 dB) commence plus de 0,2 s
    après le début de la prise, ou s'arrête plus de 0,4 s avant sa fin : souffle avant le premier
    mot, blanc après le dernier (retours de Michaël sur la v02 de la vidéo 2). Une fin en « s » ou en
    « f » est plus faible : vérifier sur le son avant de couper.
Rien n'est coupé automatiquement : l'agent vérifie, puis note les passages à retirer dans
choix.json (champ « retirer » de la phrase) et relance decouper_transcription.py.
"""

import argparse
import array
import json
import math
import re
import shutil
import subprocess
import wave
from pathlib import Path

MODELE = Path.home() / ".cache" / "whisper-cpp" / "ggml-large-v3-turbo.bin"
PAS_S = 0.02
VOIX_FORTE_DB = -27  # voix franche : au-dessus de ce niveau pendant 2 tranches de 20 ms
DEBUT_LENT_S = 0.2
FIN_TRAINE_S = 0.4
MARGE_S = 0.1
# Amorce qui pousse le modèle à écrire les hésitations au lieu de les effacer
PROMPT = "Euh… alors, euh, du coup, hum, ben… voilà, euh. Mehomies, les reufs."
HESITATION = re.compile(r"\b(euh+|heu+|hum+|hmm+|mmh+|ben|bah|eh)\b", re.I)
# Phrases que le modèle invente sur un bruit très court (voir transcrire.py)
INVENTE = re.compile(r"sous-titr|merci d'avoir regard|amara", re.I)

p = argparse.ArgumentParser()
p.add_argument("video")
p.add_argument("--pause", type=float, default=0.1, help="durée minimale d'une micro-pause, en s")
p.add_argument("--mot-long", type=float, default=0.6, help="durée au-delà de laquelle un mot est signalé, en s")
p.add_argument("--phrases", help="phrases à analyser, ex. P3,P5 (toutes par défaut)")
a = p.parse_args()

VIDEO = Path(a.video).resolve()
T = VIDEO / "transcription"
choix = json.loads((T / "choix.json").read_text())
index = {f"c{c['k']:02d}": c for c in json.loads((T / "brut" / "morceaux.json").read_text())}
if (T / "brut" / "sous-morceaux.json").exists():
    index.update({s["id"]: s for s in json.loads((T / "brut" / "sous-morceaux.json").read_text())})
SEUIL = choix["silence"]["seuilDb"]
rush = VIDEO / choix["rush"]
TMP = T / ".hesitations"
TMP.mkdir(exist_ok=True)

audio = TMP / "audio_16k.wav"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(rush), "-map", "0:a:0", "-ac", "1", "-ar", "16000",
                "-c:a", "pcm_s16le", str(audio)], check=True)
with wave.open(str(audio)) as w:
    SR = w.getframerate()
    ech = array.array("h")
    ech.frombytes(w.readframes(w.getnframes()))
fen = int(SR * PAS_S)


def niveau(t):
    s = ech[int(t * SR):int(t * SR) + fen]
    r = math.sqrt(sum(v * v for v in s) / len(s)) if s else 0
    return 20 * math.log10(r / 32768) if r > 0 else -120.0


def bouts(debut, fin):
    """Passages de parole entre micro-pauses, dans [debut, fin]."""
    out, courant, t = [], None, debut
    while t < fin:
        if niveau(t) > SEUIL:
            courant = [t, t + PAS_S] if courant is None else [courant[0], t + PAS_S]
        elif courant is not None and t - courant[1] >= a.pause:
            out.append(courant)
            courant = None
        t += PAS_S
    if courant:
        out.append(courant)
    return [b for b in out if b[1] - b[0] >= 0.06]


def transcrire(debut, fin, nom):
    wav = TMP / f"{nom}.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(audio), "-ss", f"{max(0, debut - MARGE_S):.3f}",
                    "-to", f"{fin + MARGE_S:.3f}", "-c:a", "pcm_s16le", str(wav)], check=True)
    subprocess.run(["whisper-cli", "-m", str(MODELE), "-l", "fr", "-bs", "5", "--prompt", PROMPT, "-ojf", "-np",
                    "-of", str(TMP / nom), "-f", str(wav)], check=True, capture_output=True)
    d = json.loads((TMP / f"{nom}.json").read_text())
    return "".join(s["text"] for s in d["transcription"]).strip()


def mots(texte):
    return [m for m in re.sub(r"[^\w'’-]+", " ", texte.lower()).split() if m]


def mots_longs(morceau, debut):
    """Mots de la transcription d'origine (jetons fusionnés) plus longs que --mot-long."""
    c = index[morceau]
    d = json.loads((T / "brut" / "morceaux" / f"{morceau}.json").read_text())
    out = []
    for seg in d["transcription"]:
        for t in seg["tokens"]:
            if t["text"].startswith("[_"):
                continue
            s, e = c["offset"] + t["offsets"]["from"] / 1000, c["offset"] + t["offsets"]["to"] / 1000
            if t["text"].startswith(" ") or not out:
                out.append([t["text"].strip(), s, e])
            else:
                out[-1][0] += t["text"]
                out[-1][2] = e
    return [(m, s, e) for m, s, e in out if e - s > a.mot_long and s >= debut - 0.05 and m.strip(".,!?…")]


phrases = choix["phrases"]
if a.phrases:
    phrases = [ph for ph in phrases if ph["id"] in a.phrases.split(",")]
for ph in phrases:
    print(f"\n== {ph['id']} : {ph['texte'].replace(' | ', ' ')}")
    for n, morceau in enumerate(ph["morceaux"]):
        c = index[morceau]
        debut = ph["debutForceS"] if n == 0 and "debutForceS" in ph else c["start"]
        liste = bouts(debut, c["end"])
        textes = []
        for i, (d, f) in enumerate(liste):
            texte = transcrire(d, f, f"{morceau}_{i:02d}")
            textes.append(texte)
        for i, ((d, f), texte) in enumerate(zip(liste, textes)):
            drapeaux = []
            if not mots(texte) or INVENTE.search(texte):
                drapeaux.append("[vide : bruit ou souffle]")
            if HESITATION.search(texte):
                drapeaux.append("[hésitation]")
            if i + 1 < len(textes):
                ici, suivant = mots(texte), mots(textes[i + 1])
                if ici and suivant and ici[0] == suivant[0] and len(set(ici[:3]) & set(suivant[:3])) >= min(2, len(ici)):
                    drapeaux.append("[répétition : garder le bout suivant]")
            print(f"  {morceau} {d:7.2f} → {f:7.2f} ({f - d:4.2f} s)  {texte}  {' '.join(drapeaux)}")
        t = debut
        while t < c["end"] - 0.04 and not (niveau(t) > VOIX_FORTE_DB and niveau(t + PAS_S) > VOIX_FORTE_DB):
            t += PAS_S
        if t - debut > DEBUT_LENT_S:
            print(f"  {morceau} [début lent] voix franche à {t:7.2f}, {t - debut:.2f} s après le début ({debut:.2f})")
        t = c["end"] - PAS_S
        while t > debut and not (niveau(t) > VOIX_FORTE_DB and niveau(t - PAS_S) > VOIX_FORTE_DB):
            t -= PAS_S
        if c["end"] - (t + PAS_S) > FIN_TRAINE_S:
            print(f"  {morceau} [fin qui traîne] voix franche jusqu'à {t + PAS_S:7.2f}, {c['end'] - t - PAS_S:.2f} s avant la fin ({c['end']:.2f})")
        for m, s, e in mots_longs(morceau, debut):
            print(f"  {morceau} [mot long] « {m} » {s:7.2f} → {e:7.2f} ({e - s:.2f} s)")
shutil.rmtree(TMP)
