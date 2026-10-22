"""Planche d'aperçu d'un asset de motion design, pour la banque (motion_design/CATALOGUE.md).

Usage : python3 scripts/apercu_asset.py <asset.mov> [--images 8] [--sortie apercu.png]

Tire N images régulièrement espacées de l'asset, les pose sur un damier (la transparence reste
visible), les numérote et écrit une planche PNG. Par défaut : apercu.png dans le dossier parent
de export/ (le dossier de l'asset).
"""

import argparse
import json
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw

p = argparse.ArgumentParser()
p.add_argument("asset")
p.add_argument("--images", type=int, default=8)
p.add_argument("--sortie")
a = p.parse_args()
ASSET = Path(a.asset).resolve()
dossier = ASSET.parent.parent if ASSET.parent.name == "export" else ASSET.parent
SORTIE = Path(a.sortie) if a.sortie else dossier / "apercu.png"

info = json.loads(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-count_packets", "-show_entries",
                                  "stream=nb_read_packets,width,height,r_frame_rate", "-of", "json", str(ASSET)],
                                 capture_output=True, text=True).stdout)["streams"][0]
total = int(info["nb_read_packets"])
num, den = (int(x) for x in info["r_frame_rate"].split("/"))
choisies = [round(i * (total - 1) / (a.images - 1)) for i in range(a.images)]
L, H = 270, 480
planche = Image.new("RGB", (a.images * (L + 8) - 8, H + 30), "white")
dessin = ImageDraw.Draw(planche)
damier = Image.new("RGB", (L, H), (205, 205, 205))
d = ImageDraw.Draw(damier)
for y in range(0, H, 20):
    for x in range(0, L, 20):
        if (x // 20 + y // 20) % 2:
            d.rectangle([x, y, x + 19, y + 19], fill=(235, 235, 235))
with tempfile.TemporaryDirectory(dir=dossier) as tmp:
    filtre = "+".join(f"eq(n\\,{n})" for n in choisies)
    subprocess.run(["ffmpeg", "-v", "error", "-i", str(ASSET), "-vf", f"select='{filtre}'", "-vsync", "0",
                    "-pix_fmt", "rgba", f"{tmp}/i_%02d.png"], check=True)
    for k, n in enumerate(choisies):
        im = Image.open(f"{tmp}/i_{k + 1:02d}.png").convert("RGBA").resize((L, H))
        case = damier.copy()
        case.paste(im, (0, 0), im)
        planche.paste(case, (k * (L + 8), 30))
        dessin.text((k * (L + 8) + 4, 8), f"image {n} ({n * den / num:.1f} s)", fill="black")
planche.save(SORTIE)
print(f"{SORTIE} : {a.images} images sur {total} ({total * den / num:.2f} s)")
