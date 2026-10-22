"""Découpage d'un rush à partir de sa transcription et des choix de montage.

Usage : python3 scripts/decouper_transcription.py ../a_monter/1

Lit, dans <dossier vidéo>/transcription/ :
  - choix.json            phrases gardées, morceaux, texte relu (orthographe et casse des sous-titres ;
                          un « | » force une coupure de sous-titres)
  - brut/morceaux.json    morceaux de parole (début et fin mesurés sur le son)
  - brut/morceaux/cNN.json sortie whisper.cpp de chaque morceau (temps des mots)
Écrit, dans le même dossier :
  - decoupage.json   phrases, segments gardés (temps rush et montage), passages coupés
  - mots_montage.json mots gardés : texte relu, temps rush, phrase, groupe de sous-titres
  - sous-titres.json mots gardés au format Caption de Remotion, sur la timeline montée
  - mots_rush.json   tous les mots reconnus (gardés et coupés), en temps rush
La reconnaissance vocale ne fournit que les temps : le texte affiché vient toujours du texte relu.
"""

import json
import re
import sys
from pathlib import Path

from PIL import ImageFont

VIDEO = Path(sys.argv[1]).resolve()
T = VIDEO / "transcription"
MONTAGE_DIR = VIDEO.parent.parent
choix = json.loads((T / "choix.json").read_text())
index = {f"c{c['k']:02d}": c for c in json.loads((T / "brut" / "morceaux.json").read_text())}
# Sous-morceaux (scripts/redecouper_morceau.py) : partie propre d'un morceau, retranscrite seule
if (T / "brut" / "sous-morceaux.json").exists():
    index.update({s["id"]: s for s in json.loads((T / "brut" / "sous-morceaux.json").read_text())})
FPS = choix["fps"]
MARGE = choix["margeS"]
ST = choix["sousTitres"]
police = ImageFont.truetype(str(MONTAGE_DIR / ST["police"]), ST["taillePx"])

PONCT = ".,!?;:…"
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


def mots_whisper(morceau):
    """Mots d'un morceau (jetons fusionnés), temps en secondes rush."""
    c = index[morceau]
    d = json.loads((T / "brut" / "morceaux" / f"{morceau}.json").read_text())
    out = []
    for seg in d["transcription"]:
        for t in seg["tokens"]:
            if t["text"].startswith("[_"):
                continue
            debut = c["offset"] + t["offsets"]["from"] / 1000
            fin = c["offset"] + t["offsets"]["to"] / 1000
            if t["text"].startswith(" ") or not out:
                out.append({"brut": t["text"].strip(), "s": debut, "e": fin, "p": t["p"]})
            else:
                out[-1]["brut"] += t["text"]
                out[-1]["e"] = fin
                out[-1]["p"] = min(out[-1]["p"], t["p"])
    return [m for m in out if m["brut"].strip(PONCT + " ")]


def jetons_relus(texte):
    """Mots du texte relu ; la ponctuation isolée (« ! ») est rattachée au mot précédent.

    Un « | » dans le texte relu force une coupure de sous-titres à cet endroit (il n'est pas affiché) :
    le découpage automatique ne connaît pas le sens, l'agent ou Michaël le corrige ainsi.
    Un « [n] » collé à un mot (« Mehomies[2] ») indique qu'il couvre n mots reconnus : la reconnaissance
    a coupé un nom en plusieurs mots (« Meo Miss »). Renvoie aussi le nombre de mots reconnus par mot relu.
    """
    out, coupes, couverts = [], set(), []
    for j in texte.split():
        fusion = re.fullmatch(r"(.+?)\[(\d+)\]([" + PONCT + r"]*)", j)
        n = 1
        if fusion:
            j, n = fusion.group(1) + fusion.group(3), int(fusion.group(2))
        if j == "|":
            if out:
                coupes.add(len(out) - 1)
        elif j.strip(PONCT) == "" and out:
            out[-1] += j
        else:
            out.append(j)
            couverts.append(n)
    return out, coupes, couverts


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
    for n, morceau in enumerate(ph["morceaux"]):
        c = index[morceau]
        ws = [dict(m, rang=r) for r, m in enumerate(mots_whisper(morceau))]
        debut_parole = c["start"]
        if n == 0 and "garderApresMot" in ph:
            k = next(i for i, m in enumerate(ws) if m["brut"].startswith(ph["garderApresMot"]))
            ws = ws[k + 1:]
        cles_gardees.update((morceau, m["rang"]) for m in ws)
        if n == 0 and "debutForceS" in ph:
            debut_parole = ph["debutForceS"]
            ws[0]["s"] = debut_parole
        fin_parole = c["end"]
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
    for g_i, g in enumerate(grouper(mots_ph, coupes_forcees)):
        for k in g:
            mots_ph[k]["groupe"] = g_i
    for i, m in enumerate(mots_ph):
        mots_gardes.append({
            "id": f"{ph['id']}-{i + 1}", "texte": affichage(m["jeton"]), "brut": m["brut"],
            "debutS": m["debutS"], "finS": m["finS"], "phrase": ph["id"], "debutPhrase": i == 0,
            "groupe": f"{ph['id']}-g{m['groupe'] + 1}", "segment": m["segment"], "confiance": m["confiance"],
        })
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
(T / "decoupage.json").write_text(json.dumps({
    "_comment": "Découpage du rush : segments gardés, dans l'ordre du montage. Généré par remotion/scripts/decouper_transcription.py depuis choix.json. Temps en secondes et en images.",
    "source": f"a_monter/{VIDEO.name}/{choix['rush']}", "fps": FPS, "margeS": MARGE,
    "silence": choix["silence"], "dureeMontageS": duree, "dureeMontageFrames": sum(s["dureeFrames"] for s in segments),
    "phrases": phrases_out, "segments": segments, "coupes": coupes,
}, ensure_ascii=False, indent=1))


def vers_montage(t_rush, seg_id):
    s = segments[seg_id - 1]
    return (t_rush * FPS - s["sourceDebutFrame"]) / FPS + s["montageDebutS"]


(T / "mots_montage.json").write_text(json.dumps({
    "_comment": "Mots gardés, dans l'ordre du montage : texte relu (casse et orthographe des sous-titres), temps rush, phrase et groupe de sous-titres. Le montage Remotion en déduit les temps sur la timeline.",
    "mots": mots_gardes}, ensure_ascii=False, indent=1))

captions = []
for m in mots_gardes:
    captions.append({"text": (" " if captions else "") + m["texte"],
                     "startMs": round(vers_montage(m["debutS"], m["segment"]) * 1000),
                     "endMs": round(vers_montage(m["finS"], m["segment"]) * 1000),
                     "timestampMs": None, "confidence": m["confiance"]})
(T / "sous-titres.json").write_text(json.dumps(captions, ensure_ascii=False, indent=1))

# Tous les mots du rush, gardés ou non
tous = []
for cle in sorted(index):
    for r, m in enumerate(mots_whisper(cle)):
        tous.append({"brut": m["brut"], "debutS": round(m["s"], 3), "finS": round(m["e"], 3),
                     "confiance": round(m["p"], 3), "morceau": cle, "garde": (cle, r) in cles_gardees})
(T / "mots_rush.json").write_text(json.dumps({
    "_comment": "Tous les mots reconnus dans le rush, en temps rush. 'garde' = présent dans le montage. Texte brut du modèle.",
    "mots": tous}, ensure_ascii=False, indent=1))

print(f"montage : {duree:.2f} s ({sum(s['dureeFrames'] for s in segments)} images), {len(segments)} segments, {len(mots_gardes)} mots gardés")
groupes = {}
for m in mots_gardes:
    groupes.setdefault(m["groupe"], []).append(m["texte"])
print(" | ".join(" ".join(v) for v in groupes.values()))
