"""Dernière étape après le rendu Remotion : plafonne les pics du son.

Usage : python3 scripts/finaliser_son.py ../a_monter/1/export/fin-precommande_v01.mp4

La voix est déjà limitée, mais les bruitages s'y ajoutent et peuvent dépasser 0 dB.
Si le pic vrai dépasse -1 dBTP, le son passe dans un limiteur (plafond -2 dBFS) ; si l'encodage AAC
fait remonter le pic vrai au-dessus de -1 dBTP (vidéo 2 : -0,8), le plafond baisse par paliers de
0,5 dB, toujours à partir du son d'origine. L'image est copiée telle quelle (aucun réencodage, aucune
retouche de couleur).
"""

import os
import re
import subprocess
import sys

PIC_MAX_DBTP = -1.0
PLAFONDS_DB = (-2.0, -2.5, -3.0, -3.5, -4.0)
video = sys.argv[1]


def mesure(fichier):
    r = subprocess.run(["ffmpeg", "-nostats", "-i", fichier, "-af", "ebur128=peak=true", "-f", "null", "-"],
                       capture_output=True, text=True).stderr
    r = r[r.rfind("Summary:"):]
    return (float(re.search(r"I:\s+(-?[\d.]+) LUFS", r).group(1)),
            float(re.search(r"Peak:\s+(-?[\d.]+) dBFS", r).group(1)))


i, pic = mesure(video)
print(f"avant : {i:.1f} LUFS, pic vrai {pic:+.1f} dBTP")
if pic <= PIC_MAX_DBTP:
    print("rien à faire")
    sys.exit()
tmp = video + ".tmp.mp4"
for plafond_db in PLAFONDS_DB:
    plafond = 10 ** (plafond_db / 20)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", video, "-map", "0:v:0", "-map", "0:a:0", "-c:v", "copy",
                    "-af", f"alimiter=limit={plafond:.4f}:level=false:attack=1:release=50:latency=1",
                    "-c:a", "aac", "-b:a", "320k", "-ar", "48000", "-movflags", "+faststart", tmp], check=True)
    i, pic = mesure(tmp)
    print(f"plafond {plafond_db:.1f} dBFS : {i:.1f} LUFS, pic vrai {pic:+.1f} dBTP")
    if pic <= PIC_MAX_DBTP:
        break
os.replace(tmp, video)
print(f"après : {i:.1f} LUFS, pic vrai {pic:+.1f} dBTP" + ("" if pic <= PIC_MAX_DBTP else " : toujours trop haut"))
