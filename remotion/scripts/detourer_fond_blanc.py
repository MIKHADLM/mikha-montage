"""Détoure un produit photographié sur fond blanc pur (photos du site Mehomies) : PNG transparent,
bords doux sans halo blanc. Local, Pillow seul.
Usage : python3 scripts/detourer_fond_blanc.py <image.jpg> <sortie.png> [--seuil 250] [--tissu 228]
- fond = pixels presque blancs (>= seuil) reliés au bord de l'image (le blanc à l'intérieur du
  produit reste opaque) ;
- sur une bande de 2 px autour du contour : alpha = (255 - lum) / (255 - tissu), puis la couleur est
  « décontaminée » du blanc du fond (pas de liseré clair sur un fond de couleur)."""
import argparse
from PIL import Image, ImageChops, ImageDraw, ImageFilter

p = argparse.ArgumentParser()
p.add_argument("entree"); p.add_argument("sortie")
p.add_argument("--seuil", type=int, default=250)
p.add_argument("--tissu", type=int, default=228, help="luminance du tissu au bord (alpha 1)")
a = p.parse_args()

rgb = Image.open(a.entree).convert("RGB")
W, H = rgb.size
lum = rgb.convert("L")
# Fond : blanc relié au bord (cadre blanc de 1 px ajouté pour que le remplissage fasse le tour)
cand = lum.point(lambda v: 255 if v >= a.seuil else 0)
cadre = Image.new("L", (W + 2, H + 2), 255)
cadre.paste(cand, (1, 1))
ImageDraw.floodfill(cadre, (0, 0), 128)
fond = cadre.crop((1, 1, W + 1, H + 1)).point(lambda v: 255 if v == 128 else 0)
# Produit plein, petits points de bruit JPEG retirés (ouverture puis fermeture)
plein = ImageChops.invert(fond)
plein = plein.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
plein = plein.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
# Bande du contour (2 px de chaque côté)
bande = ImageChops.subtract(plein.filter(ImageFilter.MaxFilter(5)), plein.filter(ImageFilter.MinFilter(5)))

alpha = plein.copy()
pa, pl, pb, pc = alpha.load(), lum.load(), bande.load(), rgb.load()
sortie = rgb.copy().convert("RGBA")
ps = sortie.load()
for y in range(H):
    for x in range(W):
        if not pb[x, y]:
            continue
        al = max(0.0, min(1.0, (255 - pl[x, y]) / (255 - a.tissu)))
        pa[x, y] = round(al * 255)
        if al > 0:
            r, g, b = pc[x, y]
            ps[x, y] = tuple(max(0, min(255, round((c - (1 - al) * 255) / al))) for c in (r, g, b)) + (255,)
sortie.putalpha(alpha)
sortie.save(a.sortie)
print(f"{a.sortie} : {W}x{H}, contour {alpha.getbbox()}")
