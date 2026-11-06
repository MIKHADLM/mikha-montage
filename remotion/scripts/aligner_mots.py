"""Temps des mots par alignement forcé (Qwen3-ForcedAligner, local), à la place de ceux de whisper.

Usage : python3 scripts/aligner_mots.py ../a_monter/<N> [-o <fichier>] [--phrases P1,P3]

Pourquoi : whisper.cpp transcrit bien mais place mal les mots (vidéo 5 : 70 ms donnés à « Bref, »,
fin de phrase décalée de 230 ms). L'aligneur reçoit le texte relu de choix.json et l'audio de chaque
prise gardée, et rend le début et la fin de chaque mot ; l'attaque du 1er mot et la fin du dernier
sont recalées sur l'énergie du son (le modèle travaille par pas de 80 ms et rallonge le dernier mot).
Whisper reste l'outil de transcription et de chasse aux hésitations : l'aligneur n'entend que le
texte qu'on lui donne et ne prévient pas si ce texte n'est pas celui de la prise.

À lancer après choix.json relu (et les sous-morceaux faits), avant decouper_transcription.py, qui
lit transcription/mots_alignes.json : coupes (attaque du 1er mot, fin du dernier) et sous-titres
calés sur l'aligneur. Une prise que l'aligneur rate (aligneur absent, nombre de mots différent,
bords à plus de 0,4 s de la mesure du son) est notée « echec » et garde les temps de whisper.

Écrit transcription/mots_alignes.json (ou -o) :
  {"phrases": [{"id", "texte", "morceaux", "parMorceau": [{"morceau", "start", "end", "statut",
    "raison"?, "fenetreS", "premierJeton", "mots": [{"mot", "debutS", "finS", "whisperDebutS",
    "whisperFinS", "debutBrutS"?, "finBrutS"?}]}]}]}
L'aligneur : ~/agent/outils/aligneur/aligner (variable ALIGNEUR pour un autre chemin).
"""

import argparse
import datetime
import json
import os
import statistics
import subprocess
import sys
import tempfile
import unicodedata
from pathlib import Path

from mots_relus import charger_index, jetons_relus, mots_whisper_phrase

ALIGNEUR = Path(os.environ.get("ALIGNEUR", Path.home() / "agent/outils/aligneur/aligner"))
MARGE_AVANT_S, MARGE_APRES_S = 0.25, 0.35   # audio donné autour d'une prise
MARGE_SERREE_S = 0.10                       # quand la parole voisine est collée (sous-morceau, 2 prises)
ECART_MAX_BORD_S = 0.4                      # au-delà, l'aligneur s'est trompé de passage : échec

p = argparse.ArgumentParser()
p.add_argument("video")
p.add_argument("-o", "--sortie")
p.add_argument("--phrases", help="phrases à aligner, ex. P3,P5 (toutes par défaut)")
a = p.parse_args()

VIDEO = Path(a.video).resolve()
T = VIDEO / "transcription"
SORTIE = Path(a.sortie).resolve() if a.sortie else T / "mots_alignes.json"
choix = json.loads((T / "choix.json").read_text())
index = charger_index(T)
rush = VIDEO / choix["rush"]
# Toutes les paroles du rush (morceaux d'origine) : la fenêtre d'une prise ne mord pas sur ses voisines
paroles = sorted((c["start"], c["end"], f"c{c['k']:02d}") for c in json.loads((T / "brut" / "morceaux.json").read_text()))


def a_des_lettres(mot):
    return any(ch == "'" or unicodedata.category(ch)[0] in "LN" for ch in mot)


def fenetre(ph, n, morceau):
    c = index[morceau]
    parent = c.get("de", morceau)
    debut = ph["debutForceS"] if n == 0 and "debutForceS" in ph else c["start"]
    fin = c["end"]
    p_parent = next((x for x in paroles if x[2] == parent), None)
    # parole juste avant (reprise dans le même morceau) ou juste après (fin coupée) : marge serrée
    colle_avant = p_parent is not None and debut - p_parent[0] > 0.05
    colle_apres = p_parent is not None and p_parent[1] - fin > 0.05
    deb = debut - (MARGE_SERREE_S if colle_avant else MARGE_AVANT_S)
    fi = fin + (MARGE_SERREE_S if colle_apres else MARGE_APRES_S)
    for s, e, k in paroles:
        if k == parent:
            continue
        if e <= debut + 0.01:
            deb = max(deb, (e + debut) / 2)
        if s >= fin - 0.01:
            fi = min(fi, (fin + s) / 2)
    return debut, fin, max(0.0, deb), fi


# 1. Découpe du texte relu en prises (même compte que decouper_transcription.py)
plan, lot = [], []
for ph in choix["phrases"]:
    if a.phrases and ph["id"] not in a.phrases.split(","):
        continue
    jetons, _, couverts = jetons_relus(ph["texte"])
    entree = {"id": ph["id"], "texte": ph["texte"], "morceaux": ph["morceaux"], "parMorceau": []}
    for cle in ("debutForceS", "garderApresMot"):
        if cle in ph:
            entree[cle] = ph[cle]
    ws_par = [mots_whisper_phrase(T, index, ph, n, m) for n, m in enumerate(ph["morceaux"])]
    debuts = [sum(couverts[:j]) for j in range(len(couverts))]   # rang whisper du 1er mot de chaque jeton
    base = 0
    for n, (morceau, ws) in enumerate(zip(ph["morceaux"], ws_par)):
        c = index[morceau]
        debut, fin, deb, fi = fenetre(ph, n, morceau)
        pm = {"morceau": morceau, "start": round(c["start"], 3), "end": round(c["end"], 3),
              "fenetreS": [round(deb, 3), round(fi, 3)], "statut": "echec", "mots": []}
        entree["parMorceau"].append(pm)
        ids = [j for j, d in enumerate(debuts) if base <= d < base + len(ws)]
        if sum(len(w) for w in ws_par) != sum(couverts):
            pm["raison"] = f"{sum(len(w) for w in ws_par)} mots reconnus pour {sum(couverts)} mots relus"
        elif not ids or debuts[ids[-1]] + couverts[ids[-1]] > base + len(ws):
            pm["raison"] = "un mot relu est à cheval sur deux prises"
        elif not all(a_des_lettres(jetons[j]) for j in ids):
            pm["raison"] = "mot relu sans lettre (symbole seul)"
        else:
            pm["premierJeton"] = ids[0]
            pm["_whisper"] = [(ws[debuts[j] - base]["s"], ws[debuts[j] + couverts[j] - 1 - base]["e"]) for j in ids]
            pm["_bornes"] = (debut, fin)
            lot.append({"id": f"{ph['id']}/{n}", "mots": [jetons[j] for j in ids], "debut": round(deb, 3),
                        "fin": round(fi, 3)})
        base += len(ws)
    plan.append(entree)

# 2. Alignement (modèle chargé une fois pour toutes les prises)
resultats, erreur_generale = {}, None
if not lot:
    erreur_generale = "aucune prise à aligner"
elif not ALIGNEUR.exists():
    erreur_generale = f"aligneur absent ({ALIGNEUR})"
else:
    with tempfile.TemporaryDirectory() as tmp:
        f_lot, f_out = Path(tmp) / "lot.json", Path(tmp) / "sortie.json"
        f_lot.write_text(json.dumps(lot, ensure_ascii=False))
        r = subprocess.run([str(ALIGNEUR), str(rush), "--lot", str(f_lot), "-o", str(f_out)],
                           capture_output=True, text=True)
        if r.returncode != 0 or not f_out.exists():
            erreur_generale = "aligneur en erreur : " + (r.stderr.strip().splitlines() or ["?"])[-1]
        else:
            resultats = {x["id"]: x for x in json.loads(f_out.read_text())["passages"]}

# 3. Contrôles et écriture
ecarts, gros = [], []
for entree in plan:
    for n, pm in enumerate(entree["parMorceau"]):
        whisper, bornes = pm.pop("_whisper", None), pm.pop("_bornes", None)
        if whisper is None:
            continue
        res = resultats.get(f"{entree['id']}/{n}")
        if res is None or "erreur" in res:
            pm["raison"] = erreur_generale or (res or {}).get("erreur", "pas de résultat")
            continue
        mots = res["mots"]
        if abs(mots[0]["debutS"] - bornes[0]) > ECART_MAX_BORD_S or abs(mots[-1]["finS"] - bornes[1]) > ECART_MAX_BORD_S:
            pm["raison"] = (f"bords {mots[0]['debutS']:.2f}–{mots[-1]['finS']:.2f} s loin de la prise "
                            f"{bornes[0]:.2f}–{bornes[1]:.2f} s (texte qui ne correspond pas ?)")
            continue
        if any(m["finS"] < m["debutS"] for m in mots) or any(x["debutS"] < y["debutS"] for y, x in zip(mots, mots[1:])):
            pm["raison"] = "temps dans le désordre"
            continue
        for m, (ws, we) in zip(mots, whisper):
            m["whisperDebutS"], m["whisperFinS"] = round(ws, 3), round(we, 3)
            ecarts.append((abs(m["debutS"] - ws), abs(m["finS"] - we)))
            if abs(m["debutS"] - ws) > 0.1 or abs(m["finS"] - we) > 0.1:
                gros.append(f"{entree['id']} « {m['mot']} » début {1000 * (m['debutS'] - ws):+.0f} ms, "
                            f"fin {1000 * (m['finS'] - we):+.0f} ms")
        pm["statut"], pm["mots"] = "ok", mots
        pm.pop("raison", None)

SORTIE.write_text(json.dumps({
    "_comment": "Temps des mots par l'aligneur (Qwen3-ForcedAligner), en temps rush, prise par prise. Généré par remotion/scripts/aligner_mots.py depuis choix.json ; lu par decouper_transcription.py (repli sur whisper pour une prise en échec ou périmée). whisper*S = temps de whisper pour comparaison.",
    "rush": choix["rush"], "genereLe": datetime.datetime.now().isoformat(timespec="seconds"),
    "aligneur": str(ALIGNEUR), "phrases": plan}, ensure_ascii=False, indent=1))

ok = sum(pm["statut"] == "ok" for e in plan for pm in e["parMorceau"])
total = sum(len(e["parMorceau"]) for e in plan)
print(f"{SORTIE.name} : {ok}/{total} prises alignées, {len(ecarts)} mots")
for e in plan:
    for pm in e["parMorceau"]:
        if pm["statut"] == "ok":
            print(f"  {e['id']} {pm['morceau']} : {pm['mots'][0]['debutS']:.2f} → {pm['mots'][-1]['finS']:.2f} s "
                  f"(prise mesurée {pm['start']:.2f} → {pm['end']:.2f})")
        else:
            print(f"  {e['id']} {pm['morceau']} : ÉCHEC, temps whisper gardés ({pm.get('raison')})")
if ecarts:
    d, f = zip(*ecarts)
    print(f"écart avec whisper : début moyen {1000 * statistics.mean(d):.0f} ms (max {1000 * max(d):.0f}), "
          f"fin moyenne {1000 * statistics.mean(f):.0f} ms (max {1000 * max(f):.0f}) ; {len(gros)} mots à plus de 100 ms")
    for g in gros:
        print("  " + g)
if ok < total:
    sys.exit(1 if ok == 0 else 0)
