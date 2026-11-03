#!/usr/bin/env python3
"""Place un mot géant derrière le sujet (DA piste 02) sans qu'il devienne illisible.

Le mot remplit la largeur [x0, x1]. On le descend le plus possible derrière la tête, tant
qu'aucune lettre n'est cachée à plus de --seuil sur l'ensemble des images détourées (la pire
image compte). Sortie : JSON {taille, ligneDeBase, x0, largeur, pire, couverture} sur la sortie standard ;
couverture[image][lettre] = part cachée de chaque lettre à la position retenue, sur toutes les
images (le contour de secours ne s'allume que sur les lettres et les images qui en ont besoin).

  python3 placer_titre_derriere.py public/da/popup/sujet MEHOMIES --police Anton-Regular.ttf
"""
import argparse
import json
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFont

p = argparse.ArgumentParser()
p.add_argument("sujets", help="dossier des PNG RGBA du sujet détouré, une par image")
p.add_argument("mot")
p.add_argument("--police", required=True)
p.add_argument("--x0", type=int, default=85)  # zone sûre (tokens.ts ZONE_SURE)
p.add_argument("--x1", type=int, default=1018)
p.add_argument("--seuil", type=float, default=0.30)  # proposition, à régler à l'œil
p.add_argument("--haut-min", type=int, default=219)  # le haut des capitales reste sous ZONE_SURE.haut
p.add_argument("--depuis", type=int, default=0, help="première image mesurée (après l'apparition)")
a = p.parse_args()

tous = sorted(Path(a.sujets).glob("*.png"))
if len(tous) <= a.depuis:
    sys.exit("aucune image détourée")
# Chaque masque est gardé : on mesure image par image et la pire image compte
tousMasques = [Image.open(f).getchannel("A").point(lambda v: 255 if v > 128 else 0).convert("1") for f in tous]
masques = tousMasques[a.depuis :]

largeur = a.x1 - a.x0
taille = 200.0
for _ in range(4):  # la largeur n'est pas tout à fait proportionnelle au corps (crénage, arrondis)
    police = ImageFont.truetype(a.police, round(taille))
    taille *= largeur / police.getlength(a.mot)
taille = round(taille)
police = ImageFont.truetype(a.police, taille)
capitales = -police.getbbox("H", anchor="ls")[1]

W, H = masques[0].size
avances = [police.getlength(a.mot[:i]) for i in range(len(a.mot) + 1)]
ecart = (largeur - avances[-1]) / max(1, len(a.mot) - 1)  # comme textLength côté SVG


def parts(base, liste):
    """Part cachée de chaque lettre (None pour les signes), image par image."""
    resultat = [[None] * len(a.mot) for _ in liste]
    for i, ch in enumerate(a.mot):
        if not ch.isalpha():
            continue
        x = a.x0 + avances[i] + ecart * i
        boite = [round(v) for v in police.getbbox(ch, anchor="ls")]
        boite = (round(x) + boite[0], base + boite[1], round(x) + boite[2], base + boite[3])
        glyphe = Image.new("L", (boite[2] - boite[0], boite[3] - boite[1]))
        ImageDraw.Draw(glyphe).text((x - boite[0], base - boite[1]), ch, font=police, fill=255, anchor="ls")
        g = glyphe.point(lambda v: 255 if v > 128 else 0).convert("1")
        total = g.histogram()[-1]
        if not total:
            continue
        for n, m in enumerate(liste):
            resultat[n][i] = ImageChops.logical_and(m.crop(boite), g).histogram()[-1] / total
    return resultat


def pire_lettre(base):
    pire = (0.0, "")
    for image in parts(base, masques):
        for ch, part in zip(a.mot, image):
            if part is not None:
                pire = max(pire, (part, ch))
    return pire


base = a.haut_min + capitales
meilleur = (base, pire_lettre(base))
while base < H - 200:
    base += 10
    pire = pire_lettre(base)
    if pire[0] > a.seuil:
        break
    meilleur = (base, pire)

print(json.dumps({
    "mot": a.mot, "taille": taille, "ligneDeBase": meilleur[0], "hautCapitales": meilleur[0] - capitales,
    "x0": a.x0, "largeur": largeur, "seuil": a.seuil,
    "pire": {"lettre": meilleur[1][1], "part": round(meilleur[1][0], 3)}, "images": len(masques),
    "couverture": [[None if v is None else round(v, 3) for v in image] for image in parts(meilleur[0], tousMasques)],
}, ensure_ascii=False))
