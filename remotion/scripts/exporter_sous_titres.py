"""Sous-titres au format SRT, à importer dans DaVinci Resolve : mêmes mots et mêmes groupes que le
rendu Remotion (texte relu, groupes de 1 à 3 mots).

Usage : python3 scripts/exporter_sous_titres.py ../a_monter/1

DA rouge ("da": "rouge" dans plan.json) : les groupes sont les groupes longs du rendu
(src/da/rouge/SousTitresRouge.tsx, grouperLong) : groupes du découpage fusionnés en lignes de 690 px
au plus en Thunder 70 px, coupés à chaque phrase et à chaque pause de plus de 0,3 s, lignes
équilibrées, jamais finies sur un petit mot de liaison ; maintien 15 images, sans durée minimale.
Les largeurs sont mesurées avec Pillow (le rendu les mesure dans le navigateur) : un groupe au ras de
la limite peut, rarement, se couper autrement.

Lit <dossier vidéo>/transcription/decoupage.json et mots_montage.json, place les mots sur la timeline
montée comme src/lib/montage.ts, et écrit dans <dossier vidéo>/export/ :
  <nom>_sous-titres_mot-a-mot.srt   chaque mot apparaît quand il est prononcé, à la suite des mots
                                    déjà dits de son groupe (une entrée à chaque nouveau mot)
  <nom>_sous-titres_par-groupe.srt  une entrée par groupe, affiché en entier dès son premier mot
Temps comptés depuis le début du montage : calés sur <nom>_facecam-voix.mp4 et sur la timeline de
<nom>_derushage.edl. Tous les mots sont écrits, y compris ceux que le rendu Remotion masque pendant
une composition de texte.

Temps d'affichage, sans chevauchement (une piste de sous-titres n'en accepte pas) : un groupe commence
à son premier mot, ou à la fin du groupe précédent s'il le déborde ; il s'arrête au groupe suivant ou
MAINTIEN images après son dernier mot. Aucune entrée ne dure moins de DUREE_MIN images : un groupe
trop court est prolongé (le suivant est décalé d'autant), un mot dit juste après le précédent
apparaît avec lui.
"""

import json
import math
import re
import sys
import unicodedata
from pathlib import Path

VIDEO = Path(sys.argv[1]).resolve()
PLAN = json.loads((VIDEO / "plan.json").read_text()) if (VIDEO / "plan.json").exists() else {}
ROUGE = PLAN.get("da") == "rouge"
dec = json.loads((VIDEO / "transcription" / "decoupage.json").read_text())
mots = json.loads((VIDEO / "transcription" / "mots_montage.json").read_text())["mots"]
fps = dec["fps"]
segments = dec["segments"]
duree = dec["dureeMontageFrames"]
MAINTIEN = 15  # images après le dernier mot d'un groupe (SOUS_TITRES.maintienApresDernierMot)
DUREE_MIN = 4  # images (0,13 s à 30 i/s) : proposition, la charte ne fixe pas encore de durée minimale


def slug(nom):
    nom = unicodedata.normalize("NFKD", unicodedata.normalize("NFC", nom)).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", nom.lower()).strip("-")


def vers_montage(t, id_segment):
    s = segments[id_segment - 1]
    return math.floor(t * fps - s["sourceDebutFrame"] + s["montageDebutFrame"] + 0.5)  # Math.round


def temps(frame):
    ms = -(-frame * 1000 // fps)  # arrondi au-dessus : un logiciel qui tronque retombe sur la même image
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


# Groupes dans l'ordre du montage, comme creerMontage (src/lib/montage.ts)
par_groupe = {}
for m in mots:
    par_groupe.setdefault(m["groupe"], []).append(
        {"texte": m["texte"], "debut": vers_montage(m["debutS"], m["segment"]),
         "fin": vers_montage(m["finS"], m["segment"])})
groupes = list(par_groupe.values())

if ROUGE:
    from PIL import ImageFont

    # Mêmes valeurs que src/da/rouge/tokens.ts (SOUS_TITRES_ROUGE, MOTS_DE_LIAISON)
    POLICE = ImageFont.truetype(str(Path(__file__).resolve().parents[2] / "DA MIKHA" / "polices" / "Thunder-LC.ttf"), 70)
    LARGEUR, PAUSE, MAINTIEN, DUREE_MIN = 690, 0.3 * fps, 15, 1
    LIAISON = {"le", "la", "les", "de", "du", "des", "à", "au", "aux", "un", "une", "ma", "mon", "ta", "ton",
               "sa", "son", "ses", "mes", "tes", "et", "ou", "que", "qui", "en", "pour", "par", "sur", "avec",
               "dans", "se", "je", "tu", "on"}
    phrase_de = {}
    for m in mots:
        phrase_de.setdefault(m["groupe"], m["phrase"])
    cles = list(par_groupe.keys())
    morceaux = []
    for cle, g in zip(cles, groupes):
        if morceaux:
            cle_prec, prec = morceaux[-1][-1]
            if phrase_de[cle_prec] == phrase_de[cle] and g[0]["debut"] - prec[-1]["fin"] <= PAUSE:
                morceaux[-1].append((cle, g))
                continue
        morceaux.append([(cle, g)])
    longs = []
    for gs in morceaux:
        gs = [g for _, g in gs]
        cout, depuis = [0.0], [0]
        for i in range(1, len(gs) + 1):
            cout.append(math.inf)
            depuis.append(0)
            for k in range(i - 1, -1, -1):
                ms = [m for g in gs[k:i] for m in g]
                w = POLICE.getlength(" ".join(m["texte"] for m in ms))
                if w > LARGEUR and i - k > 1:
                    break
                fin_liaison = i < len(gs) and ms[-1]["texte"].lower() in LIAISON
                c = cout[k] + (LARGEUR - w) ** 2 + (1e7 if fin_liaison else 0)
                if c < cout[i]:
                    cout[i], depuis[i] = c, k
        lignes, i = [], len(gs)
        while i > 0:
            lignes.insert(0, [m for g in gs[depuis[i]:i] for m in g])
            i = depuis[i]
        longs += lignes
    groupes = longs

entrees = {"mot-a-mot": [], "par-groupe": []}
fin_precedent = 0
for i, ms in enumerate(groupes):
    suivant = groupes[i + 1][0]["debut"] if i + 1 < len(groupes) else duree
    debut = max(ms[0]["debut"], fin_precedent)
    fin = min(duree, max(debut + DUREE_MIN, min(suivant, ms[-1]["fin"] + MAINTIEN)))
    fin_precedent = fin
    textes = [m["texte"] for m in ms]
    entrees["par-groupe"].append((debut, fin, " ".join(textes)))

    etats = []  # [image d'apparition, nombre de mots affichés]
    for k, m in enumerate(ms):
        t = min(max(m["debut"], debut), fin)
        if etats and t - etats[-1][0] < DUREE_MIN:
            etats[-1][1] = k + 1
        else:
            etats.append([t, k + 1])
    if len(etats) > 1 and fin - etats[-1][0] < DUREE_MIN:
        etats[-2][1] = etats.pop()[1]
    for j, (t, n) in enumerate(etats):
        entrees["mot-a-mot"].append((t, etats[j + 1][0] if j + 1 < len(etats) else fin, " ".join(textes[:n])))

nom = slug(dec["source"].split("/")[-1].rsplit(".", 1)[0])
export = VIDEO / "export"
export.mkdir(exist_ok=True)
for suffixe, liste in entrees.items():
    (export / f"{nom}_sous-titres_{suffixe}.srt").write_text("\n".join(
        f"{k}\n{temps(a)} --> {temps(z)}\n{texte}\n" for k, (a, z, texte) in enumerate(liste, 1)), encoding="utf-8")
    print(f"{nom}_sous-titres_{suffixe}.srt : {len(liste)} entrées")
print(f"{len(groupes)} groupes, {len(mots)} mots, montage de {duree} images à {fps} i/s")
