"""Copie légère d'un export, envoyable sur le téléphone de Michaël (application Claude : 30 Mo au plus).

Usage : python3 scripts/apercu_telephone.py <export.mp4>

Écrit <export>_apercu-telephone.mp4 à côté de l'export : H.264 1080×1920, son AAC 128 kb/s.
La qualité baisse par paliers jusqu'à passer sous 29 Mo. Ce n'est qu'un aperçu : la vidéo à publier
reste l'export complet.
"""

import subprocess
import sys
from pathlib import Path

EXPORT = Path(sys.argv[1])
SORTIE = EXPORT.with_name(f"{EXPORT.stem}_apercu-telephone.mp4")
for crf in (22, 24, 26, 28, 30):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(EXPORT), "-c:v", "libx264", "-preset", "medium",
                    "-crf", str(crf), "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart",
                    str(SORTIE)], check=True)
    taille = SORTIE.stat().st_size / 1e6
    if taille < 29:
        break
print(f"{SORTIE.name} : {taille:.1f} Mo (qualité CRF {crf})")
