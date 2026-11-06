#!/usr/bin/env python3
"""Planche de relecture d'un export : 5 images (2 avant, l'image, 2 après) à chaque coupe du face cam,
à l'entrée et à la sortie de chaque séquence (dont chaque texte en escalier), à chaque photo et à la fin
du hook. Claude la regarde avant de montrer la vidéo à Michaël (règle A16, étape 5 du skill).

Usage (depuis MONTAGE/remotion) :
  python3 scripts/planche_relecture.py ../a_monter/<N>/export/<nom>_vNN.mp4 [--lignes 6]
Sortie : export/<nom>_vNN_planche_01.png, _02.png… (6 repères par page), chemins affichés.
Chaque ligne : temps, numéro d'image, ce qui se passe, et les mots dits autour (texte relu).
"""

import argparse
import json
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

SCRIPTS = Path(__file__).resolve().parent
REMOTION = SCRIPTS.parent
p = argparse.ArgumentParser()
p.add_argument("export")
p.add_argument("--lignes", type=int, default=6, help="repères par page")
a = p.parse_args()
EXPORT = Path(a.export).resolve()
DOSSIER = EXPORT.parent.parent
STEM = EXPORT.stem


def premier(*c):
    return next(x for x in c if x.exists())


decoupage = premier(EXPORT.with_name(f"{STEM}_decoupage.json"), DOSSIER / "transcription/decoupage.json")
plan = premier(EXPORT.with_name(f"{STEM}_plan.json"), DOSSIER / "plan.json")
r = subprocess.run(["node", str(SCRIPTS / "reperes_montage.mjs"), str(decoupage),
                    str(DOSSIER / "transcription/mots_montage.json"), str(plan)],
                   cwd=REMOTION, capture_output=True, text=True)
if r.returncode:
    sys.exit(r.stderr[-1500:])
R = json.loads(r.stdout)
FPS, DUREE = R["fps"], R["duree"]

# repères : image -> description
reperes = {}


def ajouter(f, texte):
    f = max(0, min(DUREE - 1, f))
    proche = next((k for k in reperes if abs(k - f) <= 1), None)
    reperes.setdefault(proche if proche is not None else f, []).append(texte)


segs = R["segments"]
for s1, s2 in zip(segs, segs[1:]):
    ajouter(s2["debut"], f"coupe {s1['phrase']} → {s2['phrase']}")
if R.get("accroche"):
    ajouter(R["accroche"]["fin"], "fin du hook")
for s in R["sequences"]:
    nom = s["type"] + (f" « {' / '.join(s['lignes'])} »" if s.get("lignes") else "")
    ajouter(s["debut"], f"entrée {nom}")
    for i, d in enumerate(s["debutsPhotos"][1:], 2):
        ajouter(d, f"photo {i}")
    ajouter(s["fin"], f"sortie {s['type']}")
ajouter(DUREE - 3, "fin de la vidéo")
liste = sorted(reperes)
images = sorted({f + d for f in liste for d in (-2, -1, 0, 1, 2) if 0 <= f + d < DUREE})

LV, HV = 180, 320
police = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 17)
gras = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 19)


def mots_autour(f):
    return " ".join(m["texte"] for m in R["mots"] if f - 12 <= m["debut"] <= f + 12)


with tempfile.TemporaryDirectory() as tmp:
    sel = "+".join(f"eq(n\\,{f})" for f in images)
    subprocess.run(["ffmpeg", "-v", "error", "-i", str(EXPORT), "-vf", f"select={sel},scale={LV}:{HV}",
                    "-fps_mode", "passthrough", f"{tmp}/i%04d.png"], check=True)
    vignette = {f: Path(tmp) / f"i{k + 1:04d}.png" for k, f in enumerate(images)}
    sorties = []
    for page in range(0, len(liste), a.lignes):
        lot = liste[page: page + a.lignes]
        haut_ligne = HV + 58
        planche = Image.new("RGB", (5 * (LV + 6) + 6, len(lot) * haut_ligne + 6), "white")
        d = ImageDraw.Draw(planche)
        for i, f in enumerate(lot):
            y = 6 + i * haut_ligne
            d.text((6, y), f"{f / FPS:5.2f} s · image {f} · {' + '.join(reperes[f])}", fill="black", font=gras)
            d.text((6, y + 24), f"dit : « {mots_autour(f)} »"[:110], fill=(90, 90, 90), font=police)
            for j, dd in enumerate((-2, -1, 0, 1, 2)):
                g = f + dd
                x = 6 + j * (LV + 6)
                if g in vignette and vignette[g].exists():
                    planche.paste(Image.open(vignette[g]), (x, y + 52))
                    if dd == 0:
                        d.rectangle([x - 3, y + 49, x + LV + 2, y + 52 + HV + 2], outline=(241, 47, 25), width=3)
                    d.text((x + 4, y + 56), str(g), fill="yellow", font=police, stroke_width=2, stroke_fill="black")
        out = EXPORT.with_name(f"{STEM}_planche_{page // a.lignes + 1:02d}.png")
        planche.save(out)
        sorties.append(out)
print(f"{len(liste)} repères, {len(sorties)} pages :")
for s in sorties:
    print(s)
