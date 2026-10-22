"""Contrôle technique d'un export avant livraison (checklist de la charte, partie mesurable).

Usage : python3 scripts/controler_export.py <export.mp4> [--rush <rush> --image-montage N --image-rush M]

Vérifie et affiche OK / À CORRIGER pour :
  - format : 1080×1920, 30 i/s, H.264, yuv420p, BT.709 ; son AAC 48 kHz ;
  - loudness intégrée : -14 LUFS à ± 1 près ; pic vrai : -1 dBTP au plus (04_son/SON.md) ;
  - silences restants : aucun passage d'au moins 0,3 s sous -40 dB (tous les silences sont coupés) ;
  - images noires : aucune.
Avec --rush et deux numéros d'image (même instant, plan non zoomé, hors texte) : écart de couleur
entre le montage et le rush, qui doit rester quasi nul (le rush n'est jamais retouché en couleur).
Si le pic vrai dépasse -1 dBTP : lancer scripts/finaliser_son.py sur l'export.
"""

import argparse
import json
import re
import subprocess
import tempfile
from pathlib import Path

p = argparse.ArgumentParser()
p.add_argument("export")
p.add_argument("--rush")
p.add_argument("--image-montage", type=int)
p.add_argument("--image-rush", type=int)
a = p.parse_args()
EXPORT = Path(a.export)


def lancer(*args):
    return subprocess.run(args, capture_output=True, text=True)


def ligne(ok, texte):
    print(f"{'OK         ' if ok else 'À CORRIGER '} {texte}")
    return ok


tout_ok = True
info = json.loads(lancer("ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(EXPORT)).stdout)
v = next(s for s in info["streams"] if s["codec_type"] == "video")
son = next((s for s in info["streams"] if s["codec_type"] == "audio"), None)
duree = float(info["format"]["duration"])
tout_ok &= ligne(v["width"] == 1080 and v["height"] == 1920, f"dimensions {v['width']}×{v['height']}")
tout_ok &= ligne(v["r_frame_rate"] == "30/1", f"cadence {v['r_frame_rate']} ({v.get('nb_frames', '?')} images, {duree:.2f} s)")
tout_ok &= ligne(v["codec_name"] == "h264" and v.get("pix_fmt") == "yuv420p",
                 f"codec {v['codec_name']} {v.get('pix_fmt')}")
tout_ok &= ligne(v.get("color_primaries") in ("bt709", None) and v.get("color_transfer") in ("bt709", None),
                 f"couleur {v.get('color_space')} / {v.get('color_primaries')} / {v.get('color_transfer')}")
tout_ok &= ligne(son is not None and son["codec_name"] == "aac" and son["sample_rate"] == "48000",
                 f"son {son['codec_name'] if son else 'absent'} {son['sample_rate'] if son else ''} Hz")

ebu = lancer("ffmpeg", "-nostats", "-i", str(EXPORT), "-af", "ebur128=peak=true", "-f", "null", "-").stderr
ebu = ebu[ebu.rfind("Summary:"):]
lufs = float(re.search(r"I:\s+(-?[\d.]+) LUFS", ebu).group(1))
pic = float(re.search(r"Peak:\s+(-?[\d.]+) dBFS", ebu).group(1))
tout_ok &= ligne(abs(lufs + 14) <= 1, f"loudness intégrée {lufs:.1f} LUFS (cible -14)")
tout_ok &= ligne(pic <= -1.0, f"pic vrai {pic:+.1f} dBTP (maximum -1)" + ("" if pic <= -1 else " : lancer finaliser_son.py"))

sil = lancer("ffmpeg", "-nostats", "-i", str(EXPORT), "-af", "silencedetect=noise=-40dB:d=0.3", "-f", "null", "-").stderr
debuts = re.findall(r"silence_start: ([\d.]+)", sil)
tout_ok &= ligne(not debuts, "silences d'au moins 0,3 s : " + (", ".join(f"{float(x):.2f} s" for x in debuts) or "aucun"))

noir = lancer("ffmpeg", "-nostats", "-i", str(EXPORT), "-vf", "blackdetect=d=0.05:pix_th=0.10", "-an", "-f", "null", "-").stderr
noirs = re.findall(r"black_start:([\d.]+)", noir)
tout_ok &= ligne(not noirs, "images noires : " + (", ".join(f"{float(x):.2f} s" for x in noirs) or "aucune"))

if a.rush and a.image_montage is not None and a.image_rush is not None:
    from PIL import Image, ImageChops, ImageStat
    with tempfile.TemporaryDirectory(dir=EXPORT.parent) as tmp:
        def image(src, n, nom):
            f = Path(tmp) / nom
            lancer("ffmpeg", "-v", "error", "-y", "-i", src, "-vf", f"select=eq(n\\,{n})", "-vsync", "0", "-frames:v", "1", str(f))
            return Image.open(f).convert("RGB").crop((0, 150, 1080, 900))
        m = image(str(EXPORT), a.image_montage, "m.png")
        r = image(a.rush, a.image_rush, "r.png")
        ecart = max(ImageStat.Stat(ImageChops.difference(m, r)).mean)
        tout_ok &= ligne(ecart < 2, f"couleur identique au rush : écart moyen {ecart:.2f} / 255 (images {a.image_montage} / {a.image_rush})")

print("\nRésultat :", "tout est conforme" if tout_ok else "des points sont à corriger")
