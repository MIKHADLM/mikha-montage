#!/usr/bin/env python3
"""Repère les images isolées aux raccords d'un export (« frame parasite », vidéo 4, retour sur la v02).

Deux changements de plan à moins de `--ecart` images d'intervalle = une ou deux images qui n'appartiennent
ni au plan d'avant ni à celui d'après (ex. 1 image de face cam entre le hook et une illustration).

Usage : python3 scripts/detecter_frames_isolees.py <export.mp4> [--seuil 12] [--ecart 3]
Sortie : OK, ou la liste des images à regarder (numéro et temps). Code de sortie 1 si quelque chose est trouvé.
"""
import argparse
import re
import subprocess
import sys

p = argparse.ArgumentParser()
p.add_argument("export")
p.add_argument("--seuil", type=float, default=12.0, help="score de changement de plan (scdet, 0-100)")
p.add_argument("--ecart", type=int, default=3, help="images au plus entre deux coupes pour signaler")
a = p.parse_args()

r = subprocess.run(
    ["ffmpeg", "-hide_banner", "-nostats", "-i", a.export, "-an",
     "-vf", f"scdet=threshold={a.seuil},metadata=print:file=-", "-f", "null", "-"],
    capture_output=True, text=True)
coupes = []
frame = None
for ligne in r.stdout.splitlines():
    m = re.match(r"frame:(\d+)\s+pts:\S+\s+pts_time:([\d.]+)", ligne)
    if m:
        frame = (int(m.group(1)), float(m.group(2)))
    elif "lavfi.scd.time" in ligne and frame:
        coupes.append(frame)

suspects = [(c1, c2) for c1, c2 in zip(coupes, coupes[1:]) if c2[0] - c1[0] <= a.ecart]
print(f"{len(coupes)} changements de plan repérés")
if not suspects:
    print("OK          aucune image isolée aux raccords")
    sys.exit(0)
for (f1, t1), (f2, t2) in suspects:
    print(f"À CORRIGER  image(s) {f1} à {f2 - 1} ({t1:.2f} s) isolée(s) entre deux coupes")
sys.exit(1)
