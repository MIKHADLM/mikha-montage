#!/usr/bin/env python3
"""Rendu standard d'une version : image et son rendus à part, assemblés par ffmpeg, son finalisé.

Usage (depuis MONTAGE/remotion) :
  python3 scripts/rendre.py <N> <nom>_vNN [--sortie <fichier.mp4>] [-- <options remotion>]
  ex. python3 scripts/rendre.py 5 SpaceJam_v05

Pourquoi : l'AAC encodé par Remotion arrive 42,7 ms (2048 échantillons) après l'image. Remotion
encode le son en flux ADTS (`-f adts`), qui ne garde pas le délai d'amorçage de l'encodeur : le MP4
annonce 1024 échantillons d'amorçage alors qu'il y en a 3072 (mesuré le 2026-11-06 sur les vidéos 4
et 5, journal). Ici le son est rendu en WAV (exact, 0 ms) puis encodé par ffmpeg, qui écrit le bon
délai dans le MP4.

Étapes :
  1. image seule : npx remotion render Montage … --muted
  2. son seul : npx remotion render Montage ….wav --config=remotion.son.config.ts
  3. assemblage ffmpeg : image copiée telle quelle, son AAC 320 kb/s 48 kHz
  4. scripts/finaliser_son.py (pic vrai -1 dBTP au plus)
  5. copie du découpage et du plan rendus : export/<nom>_vNN_decoupage.json et _plan.json
Ensuite : scripts/verifier_livraison.py sur l'export (obligatoire avant de livrer).
"""

import argparse
import filecmp
import shutil
import subprocess
import sys
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent
REMOTION = SCRIPTS.parent
MONTAGE = REMOTION.parent

argv = sys.argv[1:]
extra = []
if "--" in argv:
    extra = argv[argv.index("--") + 1:]
    argv = argv[: argv.index("--")]
p = argparse.ArgumentParser()
p.add_argument("numero", help="numéro de la vidéo (dossier a_monter/<N>, données public/v<N>)")
p.add_argument("nom", help="nom de la version, ex. SpaceJam_v05")
p.add_argument("--sortie", help="autre fichier de sortie (test)")
a = p.parse_args(argv)

video = f"v{a.numero}"
dossier = MONTAGE / "a_monter" / a.numero
sortie = Path(a.sortie).resolve() if a.sortie else dossier / "export" / f"{a.nom}.mp4"
sortie.parent.mkdir(parents=True, exist_ok=True)
image = sortie.with_name(f".rendu_{sortie.stem}_image.mp4")
son = sortie.with_name(f".rendu_{sortie.stem}_son.wav")
props = f'{{"video":"{video}"}}'


def lancer(*args):
    print("→", " ".join(str(x) for x in args), flush=True)
    subprocess.run([str(x) for x in args], cwd=REMOTION, check=True)


try:
    lancer("npx", "remotion", "render", "Montage", image, f"--props={props}", "--muted", *extra)
    lancer("npx", "remotion", "render", "Montage", son, f"--props={props}", "--config=remotion.son.config.ts", *extra)
    lancer("ffmpeg", "-v", "error", "-y", "-i", image, "-i", son, "-map", "0:v:0", "-map", "1:a:0",
           "-c:v", "copy", "-c:a", "aac", "-b:a", "320k", "-ar", "48000", "-movflags", "+faststart",
           "-shortest", sortie)
finally:
    image.unlink(missing_ok=True)
    son.unlink(missing_ok=True)
lancer(sys.executable, SCRIPTS / "finaliser_son.py", sortie)

public = REMOTION / "public" / video
for f in ("decoupage", "plan"):
    copie = sortie.with_name(f"{sortie.stem}_{f}.json")
    shutil.copy2(public / f"{f}.json", copie)
    source = dossier / ("plan.json" if f == "plan" else "transcription/decoupage.json")
    if source.exists() and not filecmp.cmp(source, public / f"{f}.json", shallow=False):
        print(f"ATTENTION : public/{video}/{f}.json diffère de {source.relative_to(MONTAGE)} : "
              "relancer preparer_medias.py --donnees puis rendre à nouveau ?")
print(f"\n{sortie}\nÀ faire maintenant : python3 scripts/verifier_livraison.py {sortie}")
