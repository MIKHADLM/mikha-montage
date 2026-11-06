"""Découpage d'un rush à partir de sa transcription et des choix de montage.

Usage : python3 scripts/decouper_transcription.py ../a_monter/1 [--whisper] [--alignes F] [--sortie DOSSIER]

Lit, dans <dossier vidéo>/transcription/ :
  - choix.json            phrases gardées, morceaux, texte relu (orthographe et casse des sous-titres ;
                          un « | » force une coupure de sous-titres)
  - brut/morceaux.json    morceaux de parole (début et fin mesurés sur le son)
  - brut/morceaux/cNN.json sortie whisper.cpp de chaque morceau (temps des mots)
  - mots_alignes.json     s'il existe (scripts/aligner_mots.py) : temps des mots de l'aligneur, qui
                          remplacent ceux de whisper, et bords de prise recalés (--whisper : ignoré).
                          Prise en échec ou périmée : temps de whisper, signalé à la fin.
Écrit, dans le même dossier :
  - decoupage.json   phrases, segments gardés (temps rush et montage), passages coupés
  - mots_montage.json mots gardés : texte relu, temps rush, phrase, groupe de sous-titres
  - sous-titres.json mots gardés au format Caption de Remotion, sur la timeline montée
  - mots_rush.json   tous les mots reconnus (gardés et coupés), en temps rush
La reconnaissance vocale (ou l'aligneur) ne fournit que les temps : le texte affiché vient toujours du texte relu.
"""

import argparse
import json
import re
import sys
from pathlib import Path

from PIL import ImageFont

from mots_relus import PONCT, charger_index, jetons_relus, mots_whisper, mots_whisper_phrase

ap = argparse.ArgumentParser(description="Découpage d'un rush (voir l'en-tête du script).")
ap.add_argument("video")
ap.add_argument("--alignes", help="temps des mots de l'aligneur (défaut : transcription/mots_alignes.json)")
ap.add_argument("--whisper", action="store_true", help="ignorer l'aligneur : temps des mots de whisper seul")
ap.add_argument("--sortie", help="dossier où écrire les 4 fichiers (défaut : transcription/)")
args = ap.parse_args()

VIDEO = Path(args.video).resolve()
T = VIDEO / "transcription"
SORTIE = Path(args.sortie).resolve() if args.sortie else T
SORTIE.mkdir(parents=True, exist_ok=True)
MONTAGE_DIR = VIDEO.parent.parent
choix = json.loads((T / "choix.json").read_text())
index = charger_index(T)
FPS = choix["fps"]
MARGE = choix["margeS"]
ST = choix["sousTitres"]
police = ImageFont.truetype(str(MONTAGE_DIR / ST["police"]), ST["taillePx"])

# Petits mots qui s'attachent au mot suivant : un groupe de sous-titres ne finit pas dessus.
LIAISON = {
    "le", "la", "les", "l'", "un", "une", "des", "de", "du", "d'", "à", "au", "aux", "et", "ou",
    "en", "pour", "sur", "par", "que", "qui", "ce", "ces", "ton", "ta", "tes", "mon", "ma", "mes",
    "son", "sa", "ses", "vos", "votre", "nos", "notre", "leur", "leurs", "avec", "dans", "mais",
    "si", "je", "tu", "il", "elle", "on", "ils", "elles", "ça", "ne", "très", "bien", "quelque",
}
# Un petit mot qui resterait seul peut rejoindre le mot suivant même si le groupe dépasse la
# largeur maximale de 12 % au plus : le montage réduit alors ce groupe pour qu'il tienne.
TOLERANCE_PETIT_MOT = 1.12
# Noms en deux mots, jamais séparés dans les sous-titres.
INSECABLES = {("boxy", "tee"), ("baby", "tee"), ("mehomies", "flag")}

# Aligneur (scripts/aligner_mots.py) : temps des mots plus justes que whisper. Bord de prise
# (attaque du 1er mot, fin du dernier) repris de l'aligneur s'il reste à moins de TOL_BORD_S de la
# borne mesurée par transcrire.py ; au-delà, on garde la borne mesurée et on le signale.
TOL_BORD_S = 0.3
FICHIER_ALIGNES = Path(args.alignes).resolve() if args.alignes else T / "mots_alignes.json"
ALIGNES = {}
if not args.whisper and FICHIER_ALIGNES.exists():
    ALIGNES = {p["id"]: p for p in json.loads(FICHIER_ALIGNES.read_text())["phrases"]}
avertissements, source_temps = [], {}


def alignement(ph):
    """Morceaux de la phrase alignés et encore à jour : {morceau: entrée de mots_alignes.json}."""
    a = ALIGNES.get(ph["id"])
    if not a:
        return {}
    if (a["texte"], a["morceaux"], a.get("debutForceS"), a.get("garderApresMot")) != (
            ph["texte"], ph["morceaux"], ph.get("debutForceS"), ph.get("garderApresMot")):
        avertissements.append(f"{ph['id']} : mots_alignes.json périmé (texte ou prises changés), "
                              "temps whisper ; relancer aligner_mots.py")
        return {}
    out = {}
    for m in a["parMorceau"]:
        c = index.get(m["morceau"])
        if m["statut"] != "ok":
            avertissements.append(f"{ph['id']} {m['morceau']} : aligneur en échec ({m.get('raison')}), temps whisper")
        elif c is None or (round(c["start"], 3), round(c["end"], 3)) != (m["start"], m["end"]):
            avertissements.append(f"{ph['id']} {m['morceau']} : prise redécoupée depuis l'alignement, "
                                  "temps whisper ; relancer aligner_mots.py")
        else:
            out[m["morceau"]] = m
    return out


def bord(t_aligneur, t_mesure, ph, quoi):
    if abs(t_aligneur - t_mesure) <= TOL_BORD_S:
        return t_aligneur
    avertissements.append(f"{ph['id']} : {quoi} de l'aligneur à {t_aligneur:.2f} s, loin de la mesure "
                          f"({t_mesure:.2f} s) : mesure gardée, à vérifier sur le son")
    return t_mesure


def fusionner(mots_ph, couverts):
    """Regroupe les mots reconnus selon le nombre couvert par chaque mot relu (« [n] »)."""
    out, i = [], 0
    for n in couverts:
        groupe = mots_ph[i:i + n]
        if not groupe:
            break
        out.append(dict(groupe[0], brut=" ".join(m["brut"] for m in groupe), finS=groupe[-1]["finS"],
                        confiance=min(m["confiance"] for m in groupe)))
        i += n
    return out + mots_ph[i:]


def affichage(jeton):
    return jeton.rstrip(PONCT)


def largeur(mots):
    return police.getlength(" ".join(mots))


def grouper(mots, coupes_forcees=frozenset()):
    """Groupes de sous-titres d'une phrase (listes d'indices).

    Cible 2 mots, 3 au plus. Un 3e mot n'est ajouté que pour ne pas finir sur un petit mot
    de liaison, ou pour ne pas laisser seul le dernier mot d'une proposition. Un groupe s'arrête
    à la ponctuation, ne sépare jamais un nom en deux mots et reste dans la largeur maximale.
    """
    n = len(mots)
    txt = [affichage(m["jeton"]) for m in mots]
    coupure = [bool(re.search(r"[.,!?;:…]$", m["jeton"])) or i == n - 1 or i in coupes_forcees
               for i, m in enumerate(mots)]
    liaison = [t.lower() in LIAISON for t in txt]
    paire = [i + 1 < n and (txt[i].lower(), txt[i + 1].lower()) in INSECABLES for i in range(n)]
    groupes, i = [], 0
    while i < n:
        g = [i, i + 1] if paire[i] else [i]
        while len(g) < ST["motsMax"] and not coupure[g[-1]]:
            suivant = g[-1] + 1
            ajout = [suivant, suivant + 1] if paire[suivant] else [suivant]
            if len(g) + len(ajout) > ST["motsMax"]:
                break
            l = largeur([txt[k] for k in g + ajout])
            petit_mot_seul = len(g) == 1 and liaison[g[0]]
            if l > ST["largeurMaxPx"] and not (petit_mot_seul and l <= ST["largeurMaxPx"] * TOLERANCE_PETIT_MOT):
                break
            if len(g) >= 2 and not liaison[g[-1]] and not (len(ajout) == 1 and coupure[ajout[0]]):
                break
            g = g + ajout
        while len(g) > 1 and liaison[g[-1]] and not coupure[g[-1]] and not paire[g[-2]]:
            g = g[:-1]
        groupes.append(g)
        i = g[-1] + 1
    return groupes


phrases_out, segments, mots_gardes, t_montage = [], [], [], 0.0
cles_gardees = set()
for ph in choix["phrases"]:
    jetons, coupes_forcees, couverts = jetons_relus(ph["texte"])
    mots_ph, segs_ph = [], []
    alignes = alignement(ph)
    for n, morceau in enumerate(ph["morceaux"]):
        c = index[morceau]
        ws = mots_whisper_phrase(T, index, ph, n, morceau)
        debut_parole = c["start"]
        cles_gardees.update((morceau, m["rang"]) for m in ws)
        a_m = alignes.get(morceau)
        if n == 0 and "debutForceS" in ph:
            debut_parole = ph["debutForceS"]
            ws[0]["s"] = debut_parole
        elif a_m:
            debut_parole = bord(a_m["mots"][0]["debutS"], c["start"], ph, f"attaque de {morceau}")
        fin_parole = c["end"]
        if a_m:
            fin_parole = bord(a_m["mots"][-1]["finS"], c["end"], ph, f"fin de {morceau}")
        src_debut_f = round((debut_parole - MARGE) * FPS)
        src_fin_f = round((fin_parole + MARGE) * FPS)
        seg = {
            "id": len(segments) + len(segs_ph) + 1, "phrase": ph["id"], "morceau": morceau,
            "paroleDebutS": round(debut_parole, 3), "paroleFinS": round(fin_parole, 3),
            "sourceDebutFrame": src_debut_f, "sourceFinFrame": src_fin_f,
            "dureeFrames": src_fin_f - src_debut_f,
            "montageDebutFrame": round(t_montage * FPS),
            "sourceDebutS": round(src_debut_f / FPS, 3), "sourceFinS": round(src_fin_f / FPS, 3),
            "montageDebutS": round(t_montage, 3),
        }
        t_montage += (src_fin_f - src_debut_f) / FPS
        seg["montageFinS"] = round(t_montage, 3)
        segs_ph.append(seg)
        for j, m in enumerate(ws):
            suivant = ws[j + 1]["s"] if j + 1 < len(ws) else fin_parole + 0.05
            debut = max(m["s"], debut_parole - 0.02)
            fin = max(min(m["e"], suivant), debut + 0.08)
            mots_ph.append({"brut": m["brut"], "debutS": round(debut, 3), "finS": round(fin, 3),
                            "confiance": round(m["p"], 3), "segment": seg["id"]})
    if len(mots_ph) != sum(couverts):
        sys.exit(f"{ph['id']} : {len(mots_ph)} mots reconnus pour {sum(couverts)} mots relus\n"
                 f"reconnus : {' '.join(m['brut'] for m in mots_ph)}\nrelus : {' '.join(jetons)}")
    mots_ph = fusionner(mots_ph, couverts)
    for m, j in zip(mots_ph, jetons):
        m["jeton"] = j
    # Temps de l'aligneur à la place de ceux de whisper (mêmes garde-fous : pas avant la prise,
    # pas sur le mot suivant, 0,08 s au moins)
    for n, morceau in enumerate(ph["morceaux"]):
        a_m, seg = alignes.get(morceau), segs_ph[n]
        if not a_m:
            continue
        A, k0 = a_m["mots"], a_m["premierJeton"]
        if any(mots_ph[k0 + q]["segment"] != seg["id"] for q in range(len(A))):
            avertissements.append(f"{ph['id']} {morceau} : mots répartis autrement que l'aligneur, temps whisper")
            continue
        for q, a in enumerate(A):
            suivant = A[q + 1]["debutS"] if q + 1 < len(A) else seg["paroleFinS"] + 0.05
            debut = max(a["debutS"], seg["paroleDebutS"] - 0.02)
            fin = max(min(a["finS"], suivant), debut + 0.08)
            mots_ph[k0 + q].update(debutS=round(debut, 3), finS=round(fin, 3), temps="aligneur")
    source_temps[ph["id"]] = "aligneur" if alignes and len(alignes) == len(ph["morceaux"]) else (
        "aligneur + whisper" if alignes else "whisper")
    for g_i, g in enumerate(grouper(mots_ph, coupes_forcees)):
        for k in g:
            mots_ph[k]["groupe"] = g_i
    for i, m in enumerate(mots_ph):
        mots_gardes.append({
            "id": f"{ph['id']}-{i + 1}", "texte": affichage(m["jeton"]), "brut": m["brut"],
            "debutS": m["debutS"], "finS": m["finS"], "phrase": ph["id"], "debutPhrase": i == 0,
            "groupe": f"{ph['id']}-g{m['groupe'] + 1}", "segment": m["segment"], "confiance": m["confiance"],
        })
        if "temps" in m:
            mots_gardes[-1]["temps"] = m["temps"]
    segments += segs_ph
    phrases_out.append({"id": ph["id"], "montageDebutS": segs_ph[0]["montageDebutS"],
                        "montageFinS": segs_ph[-1]["montageFinS"], "texte": " ".join(jetons)})

# Passages coupés
coupes = []
for cle, raison in choix["coupes"].items():
    m, _, cote = cle.rpartition("-")
    sous = next((s for s in index.values() if s.get("de") == m), None)
    if cote in ("debut", "fin") and sous:
        # passage d'un morceau laissé hors de son sous-morceau (hésitation, reprise, fin hors sujet)
        de, a_ = (index[m]["start"], sous["start"]) if cote == "debut" else (sous["end"], index[m]["end"])
        coupes.append({"morceau": cle, "sourceDebutS": de, "sourceFinS": a_, "texte": index[m]["text"],
                       "raison": raison})
    elif cote == "debut":
        ph = next(p for p in choix["phrases"] if m in p["morceaux"])
        coupes.append({"morceau": cle, "sourceDebutS": index[m]["start"], "sourceFinS": ph["debutForceS"],
                       "texte": index[m]["text"], "raison": raison})
    else:
        coupes.append({"morceau": cle, "sourceDebutS": index[cle]["start"], "sourceFinS": index[cle]["end"],
                       "texte": index[cle]["text"], "raison": raison})
coupes.sort(key=lambda c: c["sourceDebutS"])

duree = round(t_montage, 3)
(SORTIE / "decoupage.json").write_text(json.dumps({
    "_comment": "Découpage du rush : segments gardés, dans l'ordre du montage. Généré par remotion/scripts/decouper_transcription.py depuis choix.json. Temps en secondes et en images.",
    "source": f"a_monter/{VIDEO.name}/{choix['rush']}", "fps": FPS, "margeS": MARGE,
    "silence": choix["silence"], "dureeMontageS": duree, "dureeMontageFrames": sum(s["dureeFrames"] for s in segments),
    "phrases": phrases_out, "segments": segments, "coupes": coupes,
}, ensure_ascii=False, indent=1))


def vers_montage(t_rush, seg_id):
    s = segments[seg_id - 1]
    return (t_rush * FPS - s["sourceDebutFrame"]) / FPS + s["montageDebutS"]


(SORTIE / "mots_montage.json").write_text(json.dumps({
    "_comment": "Mots gardés, dans l'ordre du montage : texte relu (casse et orthographe des sous-titres), temps rush, phrase et groupe de sous-titres. Le montage Remotion en déduit les temps sur la timeline.",
    "mots": mots_gardes}, ensure_ascii=False, indent=1))

captions = []
for m in mots_gardes:
    captions.append({"text": (" " if captions else "") + m["texte"],
                     "startMs": round(vers_montage(m["debutS"], m["segment"]) * 1000),
                     "endMs": round(vers_montage(m["finS"], m["segment"]) * 1000),
                     "timestampMs": None, "confidence": m["confiance"]})
(SORTIE / "sous-titres.json").write_text(json.dumps(captions, ensure_ascii=False, indent=1))

# Tous les mots du rush, gardés ou non
tous = []
for cle in sorted(index):
    for r, m in enumerate(mots_whisper(T, index, cle)):
        tous.append({"brut": m["brut"], "debutS": round(m["s"], 3), "finS": round(m["e"], 3),
                     "confiance": round(m["p"], 3), "morceau": cle, "garde": (cle, r) in cles_gardees})
(SORTIE / "mots_rush.json").write_text(json.dumps({
    "_comment": "Tous les mots reconnus dans le rush, en temps rush. 'garde' = présent dans le montage. Texte brut du modèle.",
    "mots": tous}, ensure_ascii=False, indent=1))

print(f"montage : {duree:.2f} s ({sum(s['dureeFrames'] for s in segments)} images), {len(segments)} segments, {len(mots_gardes)} mots gardés")
groupes = {}
for m in mots_gardes:
    groupes.setdefault(m["groupe"], []).append(m["texte"])
print(" | ".join(" ".join(v) for v in groupes.values()))
if ALIGNES:
    print("temps des mots : " + ", ".join(f"{k} {v}" for k, v in source_temps.items()))
else:
    print("temps des mots : whisper" + (" (--whisper)" if args.whisper else
                                        f" ({FICHIER_ALIGNES.name} absent ; scripts/aligner_mots.py pour l'aligneur)"))
for a in avertissements:
    print("! " + a)
