"""Transcription d'un rush face cam, morceau de parole par morceau (whisper.cpp).

Usage : python3 scripts/transcrire.py ../a_monter/<N> [--rush fichier.mp4] [--sortie dossier]

Pourquoi par morceau : sur un rush entier, whisper saute souvent les reprises (il ne garde qu'une
version d'une phrase dite deux fois). Transcrit morceau par morceau, chaque prise reste visible et
l'agent peut choisir la bonne.

1. Détecte les morceaux de parole : niveau mesuré par tranches de 20 ms, silence = sous -40 dBFS
   pendant au moins 0,3 s (réglables).
2. Transcrit chaque morceau avec whisper-cli (large-v3-turbo, français, noms propres de la marque
   donnés au modèle), temps des jetons compris.
3. Écrit dans <dossier vidéo>/transcription/brut/ (ou --sortie) :
     morceaux.json       [{k, start, end, offset, text, suspect}], temps rush en secondes
     morceaux/cNN.json   sortie complète de whisper pour chaque morceau (lue par decouper_transcription.py)
4. Affiche le tableau des morceaux, à reprendre dans TRANSCRIPTION.md, et le volume de la voix.

Les phrases que le modèle invente sur du bruit (« Merci d'avoir regardé… », « Sous-titrage… »,
« *musique* ») sont marquées suspect : à vérifier à l'écoute, en général à couper.
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
MARGE_S = 0.15  # son gardé avant et après chaque morceau envoyé au modèle
PAS_S = 0.02  # tranches de 20 ms pour mesurer le niveau du son
# Noms propres donnés au modèle pour qu'il les écrive juste (01_marque/TON.md)
PROMPT = "Mehomies, Mehomies Flag, BAG, Boxy, Baby Tee."
SUSPECT = re.compile(r"merci d'avoir regard|sous-titr|amara|abonnez|^\s*[*\[(].*[*\])]\s*$|^\s*$", re.I)
EXTENSIONS = (".mp4", ".mov", ".m4v", ".mxf")

p = argparse.ArgumentParser()
p.add_argument("video")
p.add_argument("--rush")
p.add_argument("--sortie")
p.add_argument("--seuil", type=float, default=-40.0, help="niveau (dBFS, par 20 ms) sous lequel c'est du silence")
p.add_argument("--duree", type=float, default=0.3, help="durée minimale d'un silence entre deux morceaux, en s")
p.add_argument("--prompt", default=PROMPT, help="noms propres à donner au modèle")
a = p.parse_args()

VIDEO = Path(a.video).resolve()
if a.rush:
    rush = VIDEO / a.rush
else:
    candidats = [f for f in VIDEO.iterdir() if f.suffix.lower() in EXTENSIONS]
    if len(candidats) != 1:
        raise SystemExit(f"Rush introuvable ou ambigu dans {VIDEO} : {[f.name for f in candidats]} ; préciser --rush")
    rush = candidats[0]
BRUT = Path(a.sortie).resolve() if a.sortie else VIDEO / "transcription" / "brut"
(BRUT / "morceaux").mkdir(parents=True, exist_ok=True)
TMP = BRUT / ".tmp"
TMP.mkdir(exist_ok=True)


def lancer(*args):
    return subprocess.run(args, capture_output=True, text=True)


duree = float(lancer("ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(rush)).stdout)

# 1. Morceaux de parole : enveloppe du son par tranches de 20 ms, parole = au-dessus du seuil ;
#    un silence d'au moins --duree sépare deux morceaux ; les morceaux de moins de 0,12 s sont ignorés.
#    (Méthode de la vidéo 1 : même découpage, donc mêmes numéros de morceaux.)
audio = TMP / "audio_16k.wav"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(rush), "-map", "0:a:0", "-ac", "1", "-ar", "16000",
                "-c:a", "pcm_s16le", str(audio)], check=True)
with wave.open(str(audio)) as w:
    echantillons = array.array("h")
    echantillons.frombytes(w.readframes(w.getnframes()))
    fenetre = int(w.getframerate() * PAS_S)
rms = []
for i in range(0, len(echantillons) - fenetre, fenetre):
    s = sum(v * v for v in echantillons[i:i + fenetre])
    r = math.sqrt(s / fenetre)
    rms.append(20 * math.log10(r / 32768) if r > 0 else -120.0)
morceaux, courant = [], None
for i, niveau in enumerate(rms):
    t = i * PAS_S
    if niveau > a.seuil:
        courant = [t, t + PAS_S] if courant is None else [courant[0], t + PAS_S]
    elif courant is not None and t - courant[1] > a.duree:
        morceaux.append(courant)
        courant = None
if courant:
    morceaux.append(courant)
morceaux = [m for m in morceaux if m[1] - m[0] >= 0.12]

# 2. Transcription de chaque morceau
sortie = []
for k, (debut, fin) in enumerate(morceaux):
    offset = max(0.0, debut - MARGE_S)
    wav = TMP / f"c{k:02d}.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(audio), "-ss", f"{offset:.3f}", "-to", f"{fin + MARGE_S:.3f}",
                    "-c:a", "pcm_s16le", str(wav)], check=True)
    base = BRUT / "morceaux" / f"c{k:02d}"
    subprocess.run(["whisper-cli", "-m", str(MODELE), "-l", "fr", "-bs", "5", "--prompt", a.prompt, "-ojf", "-np",
                    "-of", str(base), "-f", str(wav)], check=True, capture_output=True)
    d = json.loads(Path(f"{base}.json").read_text())
    texte = "".join(s["text"] for s in d["transcription"]).strip()
    sortie.append({"k": k, "start": round(debut, 2), "end": round(fin, 2), "offset": round(offset, 3),
                   "text": texte, "suspect": bool(SUSPECT.search(texte))})
    print(f"c{k:02d}  {debut:7.2f} → {fin:7.2f}  {'[suspect] ' if sortie[-1]['suspect'] else ''}{texte}")
shutil.rmtree(TMP)
(BRUT / "morceaux.json").write_text(json.dumps(sortie, ensure_ascii=False, indent=1))

# 3. Volume de la voix sur le rush entier (information pour le mixage)
ebu = lancer("ffmpeg", "-nostats", "-i", str(rush), "-map", "0:a:0", "-af", "ebur128", "-f", "null", "-").stderr
i = re.search(r"I:\s+(-?[\d.]+) LUFS", ebu[ebu.rfind("Summary:"):])
print(f"\n{len(sortie)} morceaux, rush de {duree:.1f} s ; voix : {i.group(1) if i else '?'} LUFS sur le rush entier")
print(f"Écrit : {BRUT / 'morceaux.json'} et {BRUT / 'morceaux'}/cNN.json")
