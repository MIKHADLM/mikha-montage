"""Prépare les médias d'une vidéo pour Remotion.

Usage : python3 scripts/preparer_medias.py ../a_monter/<N> v<N> [--donnees]

Écrit dans remotion/public/ :
  charte/polices/        polices de CHARTE/07_typographies
  charte/fond-1.png      fond_1 (abandonné, gardé pour refaire la vidéo 1)
  charte/sfx/*.wav       bruitages de la charte en WAV, au niveau de leur fichier (comme dans la VF)
  charte/partenaires/    étiquettes et logos de CHARTE/06_assets/partenaires
  <id>/rush.mp4          rush : image copiée telle quelle (pas de réencodage, donc pas de retouche
                         de couleur), voix remontée vers -14 LUFS sur les passages gardés
  <id>/musique.wav       musique fournie (si choix.json en donne une) : extrait et niveau demandés
  <id>/images/*.png      images de assets/, marges transparentes retirées, 1600 px au plus
  <id>/videos/*.mp4      vidéos de assets/ (autres que le rush), en H.264
  <id>/*.json            decoupage.json et mots_montage.json (transcription/), plan.json (dossier vidéo)
Avec --donnees : ne recopie que les fichiers JSON (après une modification de plan.json).
"""

import argparse
import json
import re
import shutil
import subprocess
import unicodedata
from pathlib import Path

from PIL import Image

p = argparse.ArgumentParser()
p.add_argument("video")
p.add_argument("id")
p.add_argument("--donnees", action="store_true", help="ne recopier que les fichiers JSON")
a = p.parse_args()

VIDEO = Path(a.video).resolve()
VID = a.id
REMOTION = Path(__file__).resolve().parent.parent
MONTAGE = REMOTION.parent
CHARTE = MONTAGE / "CHARTE"
PUBLIC = REMOTION / "public"
DEST = PUBLIC / VID

VOIX_LUFS = -14.0  # 04_son/SON.md : voix à -14 LUFS
PIC_MAX_DBFS = -1.5
# Bruitages de la charte (04_son/SON.md) : posés au niveau de leur fichier, sans gain
SFX = {
    "riser": "sfx_riser_riser_v01.mp3",
    "clic": "sfx_clic_click_v01.wav",
    "declencheur": "sfx_declencheur_shutter-click_v01.mp3",
}


def ffmpeg(*args):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *args], check=True)


def loudness(args):
    """Loudness intégrée (LUFS) et pic vrai (dBTP) d'une entrée ffmpeg."""
    r = subprocess.run(["ffmpeg", "-nostats", *args, "-af", "ebur128=peak=true", "-f", "null", "-"],
                       capture_output=True, text=True)
    txt = r.stderr[r.stderr.rfind("Summary:"):]
    i = float(re.search(r"I:\s+(-?[\d.]+) LUFS", txt).group(1))
    pic = float(re.search(r"Peak:\s+(-?[\d.]+) dBFS", txt).group(1))
    return i, pic


def slug(nom):
    nom = unicodedata.normalize("NFC", nom).replace(" avec arrière-plan supprimé", "")
    nom = unicodedata.normalize("NFKD", nom).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", nom.lower()).strip("-")


def copier_donnees():
    DEST.mkdir(parents=True, exist_ok=True)
    fichiers = [VIDEO / "transcription" / "decoupage.json", VIDEO / "transcription" / "mots_montage.json",
                VIDEO / "plan.json"]
    for f in fichiers:
        if f.exists():
            shutil.copy2(f, DEST / f.name)
    # Ancien montage écrit à la main (vidéo 1) : il lit ses données dans src/videos/<id>/donnees
    ancien = REMOTION / "src" / "videos" / VID / "donnees"
    if ancien.exists():
        for f in fichiers[:2]:
            shutil.copy2(f, ancien / f.name)
    print("données copiées dans", DEST.relative_to(REMOTION), ":", ", ".join(f.name for f in fichiers if f.exists()))


if a.donnees:
    copier_donnees()
    raise SystemExit

# 1. Charte : polices, fond_1 (archive), bruitages, partenaires
for sous in ("polices", "sfx", "partenaires"):
    (PUBLIC / "charte" / sous).mkdir(parents=True, exist_ok=True)
for ttf in (CHARTE / "07_typographies").glob("*/*.ttf"):
    shutil.copy2(ttf, PUBLIC / "charte" / "polices" / ttf.name)
shutil.copy2(CHARTE / "06_assets" / "textures" / "texture_fond-1_v01.png", PUBLIC / "charte" / "fond-1.png")
for nom, fichier in SFX.items():
    src = CHARTE / "06_assets" / "sfx" / fichier
    ffmpeg("-i", str(src), "-map", "0:a", "-ar", "48000", "-ac", "2", "-c:a", "pcm_s16le",
           str(PUBLIC / "charte" / "sfx" / f"{nom}.wav"))
    i, pic = loudness(["-i", str(PUBLIC / "charte" / "sfx" / f"{nom}.wav")])
    print(f"sfx {nom} : {i:.1f} LUFS, pic {pic:.1f} dBFS (niveau du fichier)")
for f in (CHARTE / "06_assets" / "partenaires").glob("*.png"):
    shutil.copy2(f, PUBLIC / "charte" / "partenaires" / f.name)

# 2. Rush : gain calculé sur les seuls passages gardés
dec = json.loads((VIDEO / "transcription" / "decoupage.json").read_text())
rush = VIDEO / dec["source"].split("/")[-1]
fps = dec["fps"]
parts = "".join(f"[0:a]atrim={s['sourceDebutFrame'] / fps}:{s['sourceFinFrame'] / fps},asetpts=N/SR/TB[a{k}];"
                for k, s in enumerate(dec["segments"]))
concat = "".join(f"[a{k}]" for k in range(len(dec["segments"]))) + f"concat=n={len(dec['segments'])}:v=0:a=1,ebur128=peak=true[m]"
r = subprocess.run(["ffmpeg", "-nostats", "-i", str(rush), "-filter_complex", parts + concat, "-map", "[m]",
                    "-f", "null", "-"], capture_output=True, text=True)
txt = r.stderr[r.stderr.rfind("Summary:"):]
voix_i = float(re.search(r"I:\s+(-?[\d.]+) LUFS", txt).group(1))
voix_p = float(re.search(r"Peak:\s+(-?[\d.]+) dBFS", txt).group(1))
gain = VOIX_LUFS - voix_i
limite = 10 ** (PIC_MAX_DBFS / 20)
print(f"voix (passages gardés) : {voix_i:.1f} LUFS, pic {voix_p:.1f} dBFS -> gain {gain:+.1f} dB, limiteur à {PIC_MAX_DBFS} dBFS")
(DEST / "images").mkdir(parents=True, exist_ok=True)
ffmpeg("-i", str(rush), "-map", "0:v:0", "-map", "0:a:0", "-c:v", "copy",
       "-af", f"volume={gain:.2f}dB,alimiter=limit={limite:.4f}:level=false:attack=5:release=50:latency=1",
       "-c:a", "aac", "-b:a", "320k", "-ar", "48000", "-movflags", "+faststart", str(DEST / "rush.mp4"))

# 3. Musique fournie avec la vidéo (choix.json) : extrait à partir du temps demandé, mis au niveau voulu
choix = json.loads((VIDEO / "transcription" / "choix.json").read_text())
musique = choix.get("musique")
if musique:
    src = VIDEO / musique["fichier"]
    duree = dec["dureeMontageS"] + 2
    extrait = ["-ss", str(musique["debutDansLaPisteS"]), "-t", f"{duree:.2f}", "-i", str(src)]
    i, _ = loudness(extrait)
    ffmpeg(*extrait, "-map", "0:a", "-af", f"volume={musique['niveauLufs'] - i:.2f}dB", "-ar", "48000", "-ac", "2",
           "-c:a", "pcm_s16le", str(DEST / "musique.wav"))
    i2, p2 = loudness(["-i", str(DEST / "musique.wav")])
    print(f"musique : extrait de {musique['debutDansLaPisteS']} s, {i:.1f} -> {i2:.1f} LUFS, pic {p2:.1f} dBFS")

# 4. Images et vidéos de la vidéo (assets/)
(DEST / "videos").mkdir(parents=True, exist_ok=True)
for f in sorted((VIDEO / "assets").iterdir()):
    ext = f.suffix.lower()
    if ext in (".mp4", ".mov", ".m4v") and f.resolve() != rush.resolve():
        out = DEST / "videos" / f"{slug(f.stem)}.mp4"
        ffmpeg("-i", str(f), "-map", "0:v:0", "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p",
               "-an", "-movflags", "+faststart", str(out))
        print(f"vidéo {out.name}")
        continue
    if ext not in (".png", ".jpg", ".jpeg", ".webp"):
        continue
    im = Image.open(f)
    im = im.convert("RGBA") if im.mode in ("RGBA", "LA", "P") else im.convert("RGB")
    if im.mode == "RGBA":
        bbox = im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
        if bbox and bbox != (0, 0, im.width, im.height):
            m = 12
            im = im.crop((max(0, bbox[0] - m), max(0, bbox[1] - m), min(im.width, bbox[2] + m), min(im.height, bbox[3] + m)))
        if im.getchannel("A").getextrema() == (255, 255):
            im = im.convert("RGB")
    im.thumbnail((1600, 1600), Image.LANCZOS)
    out = DEST / "images" / f"{slug(f.stem)}.png"
    im.save(out, optimize=True)
    print(f"image {out.name} : {im.width}x{im.height} {im.mode}")

# 5. Données du montage
copier_donnees()
