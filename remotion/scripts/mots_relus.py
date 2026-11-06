"""Lecture commune des mots : texte relu (choix.json) et mots reconnus par whisper.cpp.

Partagé par decouper_transcription.py et aligner_mots.py, pour que les deux comptent les mots
exactement de la même façon.
"""

import json
import re
from pathlib import Path

PONCT = ".,!?;:…"


def charger_index(T: Path):
    """Morceaux (brut/morceaux.json) et sous-morceaux (brut/sous-morceaux.json), par identifiant."""
    index = {f"c{c['k']:02d}": c for c in json.loads((T / "brut" / "morceaux.json").read_text())}
    # Sous-morceaux (scripts/redecouper_morceau.py) : partie propre d'un morceau, retranscrite seule
    if (T / "brut" / "sous-morceaux.json").exists():
        index.update({s["id"]: s for s in json.loads((T / "brut" / "sous-morceaux.json").read_text())})
    return index


def mots_whisper(T: Path, index, morceau):
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


def mots_whisper_phrase(T: Path, index, ph, n, morceau):
    """Mots whisper gardés d'un morceau de la phrase (avec leur rang dans le morceau)."""
    ws = [dict(m, rang=r) for r, m in enumerate(mots_whisper(T, index, morceau))]
    if n == 0 and "garderApresMot" in ph:
        k = next(i for i, m in enumerate(ws) if m["brut"].startswith(ph["garderApresMot"]))
        ws = ws[k + 1:]
    return ws


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
