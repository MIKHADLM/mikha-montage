"""Repère les hésitations restées dans les prises gardées (euh, mots répétés, reprises en cours de phrase).

Usage : python3 scripts/reperer_hesitations.py ../a_monter/<N> [--pause 0.1] [--phrases P3,P5] [--choix autre.json]

Pourquoi : la reconnaissance vocale « nettoie » ce qu'elle entend. Sur une phrase entière, elle saute
souvent les « euh » et les mots dits deux fois (« grâce aux commandes… grâce aux commandes qu'il y a
eu » devient une seule fois), si bien que ces hésitations restent dans le montage (retours de Michaël
sur la v01 de la vidéo 2). Même remède que transcrire.py pour les reprises : découper plus fin.

Pour chaque phrase gardée (transcription/choix.json), chaque morceau est redécoupé aux micro-pauses
(niveau sous le seuil de choix.json pendant au moins --pause s), et chaque bout est retranscrit seul,
avec un modèle invité à écrire les hésitations. Affiche, en temps rush :
  - les bouts et leur texte ;
  - [répétition] : un bout qui recommence les mots du bout suivant (garder le second) ;
  - [doublon] : un mot ou un début de phrase redit d'un bout à l'autre, y compris d'un morceau (ou
    d'une phrase) au suivant dans l'ordre du montage (règle A20, vidéo 6 : « Bref. » / « On esp… » /
    « Bref, on espère… », faux départ resté dans la v01). Deux cas : le début d'un bout revient au
    début d'un des 2 bouts suivants (moins de 3 s plus loin) = faux départ, couper avant la reprise ;
    la fin d'un bout revient au début du suivant = mot dit deux fois. Les mots sont comparés sans
    accents ni ponctuation, un mot coupé (« esp… ») vaut le mot entier (« espère ») ; un seul mot
    commun ne compte pas si c'est un petit mot (« on », « c'est », « de »…). Résumé en fin de sortie ;
  - [hésitation] : « euh », « hum », « ben »… ;
  - [mot long] : un mot de la transcription d'origine qui dure plus de --mot-long s (souvent un
    « euuuh » ou une syllabe tenue avalée par le mot) ;
  - [vide] : un bout sans parole reconnue (souffle, bruit, regard ailleurs) ;
  - [début lent] / [fin qui traîne] : la voix franche (au-dessus de -27 dB) commence plus de 0,2 s
    après le début de la prise, ou s'arrête plus de 0,4 s avant sa fin : souffle avant le premier
    mot, blanc après le dernier (retours de Michaël sur la v02 de la vidéo 2). Une fin en « s » ou en
    « f » est plus faible : vérifier sur le son avant de couper.
Rien n'est coupé automatiquement : l'agent vérifie, puis note les passages à retirer dans
choix.json (champ « retirer » de la phrase) et relance decouper_transcription.py.
"""

import argparse
import array
import json
import math
import re
import shutil
import subprocess
import unicodedata
import wave
from pathlib import Path

MODELE = Path.home() / ".cache" / "whisper-cpp" / "ggml-large-v3-turbo.bin"
PAS_S = 0.02
VOIX_FORTE_DB = -27  # voix franche : au-dessus de ce niveau pendant 2 tranches de 20 ms
DEBUT_LENT_S = 0.2
FIN_TRAINE_S = 0.4
MARGE_S = 0.1
# Amorce qui pousse le modèle à écrire les hésitations au lieu de les effacer
PROMPT = "Euh… alors, euh, du coup, hum, ben… voilà, euh. Mehomies, les reufs."
HESITATION = re.compile(r"\b(euh+|heu+|hum+|hmm+|mmh+|ben|bah|eh)\b", re.I)
# Phrases que le modèle invente sur un bruit très court (voir transcrire.py)
INVENTE = re.compile(r"sous-titr|merci d'avoir regard|amara", re.I)

p = argparse.ArgumentParser()
p.add_argument("video")
p.add_argument("--pause", type=float, default=0.1, help="durée minimale d'une micro-pause, en s")
p.add_argument("--mot-long", type=float, default=0.6, help="durée au-delà de laquelle un mot est signalé, en s")
p.add_argument("--phrases", help="phrases à analyser, ex. P3,P5 (toutes par défaut)")
p.add_argument("--choix", help="autre fichier de choix (ex. celui d'une ancienne version), transcription/choix.json par défaut")
a = p.parse_args()

VIDEO = Path(a.video).resolve()
T = VIDEO / "transcription"
choix = json.loads(Path(a.choix).read_text() if a.choix else (T / "choix.json").read_text())
index = {f"c{c['k']:02d}": c for c in json.loads((T / "brut" / "morceaux.json").read_text())}
if (T / "brut" / "sous-morceaux.json").exists():
    index.update({s["id"]: s for s in json.loads((T / "brut" / "sous-morceaux.json").read_text())})
SEUIL = choix["silence"]["seuilDb"]
rush = VIDEO / choix["rush"]
TMP = T / ".hesitations"
TMP.mkdir(exist_ok=True)

audio = TMP / "audio_16k.wav"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(rush), "-map", "0:a:0", "-ac", "1", "-ar", "16000",
                "-c:a", "pcm_s16le", str(audio)], check=True)
with wave.open(str(audio)) as w:
    SR = w.getframerate()
    ech = array.array("h")
    ech.frombytes(w.readframes(w.getnframes()))
fen = int(SR * PAS_S)


def niveau(t):
    s = ech[int(t * SR):int(t * SR) + fen]
    r = math.sqrt(sum(v * v for v in s) / len(s)) if s else 0
    return 20 * math.log10(r / 32768) if r > 0 else -120.0


def bouts(debut, fin):
    """Passages de parole entre micro-pauses, dans [debut, fin]."""
    out, courant, t = [], None, debut
    while t < fin:
        if niveau(t) > SEUIL:
            courant = [t, t + PAS_S] if courant is None else [courant[0], t + PAS_S]
        elif courant is not None and t - courant[1] >= a.pause:
            out.append(courant)
            courant = None
        t += PAS_S
    if courant:
        out.append(courant)
    return [b for b in out if b[1] - b[0] >= 0.06]


def transcrire(debut, fin, nom):
    wav = TMP / f"{nom}.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(audio), "-ss", f"{max(0, debut - MARGE_S):.3f}",
                    "-to", f"{fin + MARGE_S:.3f}", "-c:a", "pcm_s16le", str(wav)], check=True)
    subprocess.run(["whisper-cli", "-m", str(MODELE), "-l", "fr", "-bs", "5", "--prompt", PROMPT, "-ojf", "-np",
                    "-of", str(TMP / nom), "-f", str(wav)], check=True, capture_output=True)
    d = json.loads((TMP / f"{nom}.json").read_text())
    return "".join(s["text"] for s in d["transcription"]).strip()


def mots(texte):
    return [m for m in re.sub(r"[^\w'’-]+", " ", texte.lower()).split() if m]


# --- Doublons d'un bout à l'autre (règle A20) ---
PETITS_MOTS = set("""a à au aux ce c ça cet cette c'est d de des du donc elle en et est il j je l la le les
    m ma mais me mes n ne nous on ou où par pas pour qu que qui s sa se ses si sur t ta te tu un une va
    vous y oui non ah oh voilà alors""".split())
DOUBLON_FENETRE = 2      # bouts suivants regardés pour un faux départ
DOUBLON_ECART_S = 3.0    # au-delà, deux bouts ne se suivent plus vraiment


def mots_normalises(texte):
    t = unicodedata.normalize("NFKD", texte.lower().replace("’", "'"))
    t = "".join(ch for ch in t if not unicodedata.combining(ch))
    return [m for m in re.sub(r"[^a-z0-9']+", " ", t).split() if m.strip("'")]


def meme_mot(x, y):
    """Mots égaux, ou l'un est le début coupé de l'autre (« esp » / « espere », 3 lettres au moins)."""
    if x == y:
        return True
    court, long_ = sorted((x, y), key=len)
    return len(court) >= 3 and long_.startswith(court)


def debut_commun(m1, m2, n_max=4):
    k = 0
    while k < min(len(m1), len(m2), n_max) and meme_mot(m1[k], m2[k]):
        k += 1
    return m1[:k]


def compte(commun):
    """Un doublon compte s'il fait 2 mots ou plus, ou 1 mot qui n'est pas un petit mot."""
    return len(commun) >= 2 or (len(commun) == 1 and commun[0] not in PETITS_MOTS and len(commun[0]) >= 3)


def doublons(liste):
    """liste : bouts dans l'ordre du montage (dicts avec morceau, d, f, texte). Renvoie (i, j, type, mots)."""
    out = []
    for i, b in enumerate(liste):
        mi = mots_normalises(b["texte"])
        if not mi or b["vide"]:
            continue
        vus = 0
        for j in range(i + 1, len(liste)):
            if liste[j]["vide"]:
                continue
            vus += 1
            if vus > DOUBLON_FENETRE or liste[j]["d"] - b["f"] > DOUBLON_ECART_S:
                break
            mj = mots_normalises(liste[j]["texte"])
            commun = debut_commun(mi, mj)
            if compte(commun):
                out.append((i, j, "faux départ", commun))
                break
            if vus == 1:  # fin du bout = début du suivant (« grâce aux commandes | grâce aux commandes »)
                for n in range(min(4, len(mi), len(mj)), 0, -1):
                    if all(meme_mot(x, y) for x, y in zip(mi[-n:], mj[:n])) and compte(mj[:n]):
                        out.append((i, j, "mot redit", mj[:n]))
                        break
    return out


def mots_longs(morceau, debut):
    """Mots de la transcription d'origine (jetons fusionnés) plus longs que --mot-long."""
    c = index[morceau]
    d = json.loads((T / "brut" / "morceaux" / f"{morceau}.json").read_text())
    out = []
    for seg in d["transcription"]:
        for t in seg["tokens"]:
            if t["text"].startswith("[_"):
                continue
            s, e = c["offset"] + t["offsets"]["from"] / 1000, c["offset"] + t["offsets"]["to"] / 1000
            if t["text"].startswith(" ") or not out:
                out.append([t["text"].strip(), s, e])
            else:
                out[-1][0] += t["text"]
                out[-1][2] = e
    return [(m, s, e) for m, s, e in out if e - s > a.mot_long and s >= debut - 0.05 and m.strip(".,!?…")]


phrases = choix["phrases"]
if a.phrases:
    phrases = [ph for ph in phrases if ph["id"] in a.phrases.split(",")]

# 1. Tous les bouts, dans l'ordre du montage (phrase par phrase, morceau par morceau)
tous, morceaux_vus = [], []
for ph in phrases:
    for n, morceau in enumerate(ph["morceaux"]):
        c = index[morceau]
        debut = ph["debutForceS"] if n == 0 and "debutForceS" in ph else c["start"]
        morceaux_vus.append((ph, morceau, c, debut))
        for i, (d, f) in enumerate(bouts(debut, c["end"])):
            texte = transcrire(d, f, f"{morceau}_{i:02d}")
            tous.append({"phrase": ph["id"], "morceau": morceau, "d": d, "f": f, "texte": texte,
                         "vide": not mots(texte) or bool(INVENTE.search(texte))})

# 2. Doublons d'un bout à l'autre, morceaux et phrases confondus (A20)
trouves = doublons(tous)
drapeau_doublon = {}
for i, j, genre, commun in trouves:
    autre = tous[j]
    ou = "" if autre["morceau"] == tous[i]["morceau"] else f" ({autre['phrase']} {autre['morceau']})"
    if genre == "faux départ":
        drapeau_doublon.setdefault(i, []).append(
            f"[doublon : « {' '.join(commun)} » repris à {autre['d']:.2f}{ou}, faux départ : couper avant la reprise]")
    else:
        drapeau_doublon.setdefault(i, []).append(
            f"[doublon : « {' '.join(commun)} » redit au début du bout suivant{ou} : en garder un]")

# 3. Affichage
k = 0
for ph in phrases:
    print(f"\n== {ph['id']} : {ph['texte'].replace(' | ', ' ')}")
    for p2, morceau, c, debut in morceaux_vus:
        if p2 is not ph:
            continue
        liste = []
        while k < len(tous) and tous[k]["morceau"] == morceau and tous[k]["phrase"] == ph["id"]:
            liste.append(k)
            k += 1
        for pos, idx in enumerate(liste):
            b = tous[idx]
            drapeaux = []
            if b["vide"]:
                drapeaux.append("[vide : bruit ou souffle]")
            if HESITATION.search(b["texte"]):
                drapeaux.append("[hésitation]")
            if pos + 1 < len(liste):
                ici, suivant = mots(b["texte"]), mots(tous[liste[pos + 1]]["texte"])
                if ici and suivant and ici[0] == suivant[0] and len(set(ici[:3]) & set(suivant[:3])) >= min(2, len(ici)):
                    drapeaux.append("[répétition : garder le bout suivant]")
            if not any(dr.startswith("[répétition") for dr in drapeaux):
                drapeaux += drapeau_doublon.get(idx, [])
            print(f"  {morceau} {b['d']:7.2f} → {b['f']:7.2f} ({b['f'] - b['d']:4.2f} s)  {b['texte']}  {' '.join(drapeaux)}")
        t = debut
        while t < c["end"] - 0.04 and not (niveau(t) > VOIX_FORTE_DB and niveau(t + PAS_S) > VOIX_FORTE_DB):
            t += PAS_S
        if t - debut > DEBUT_LENT_S:
            print(f"  {morceau} [début lent] voix franche à {t:7.2f}, {t - debut:.2f} s après le début ({debut:.2f})")
        t = c["end"] - PAS_S
        while t > debut and not (niveau(t) > VOIX_FORTE_DB and niveau(t - PAS_S) > VOIX_FORTE_DB):
            t -= PAS_S
        if c["end"] - (t + PAS_S) > FIN_TRAINE_S:
            print(f"  {morceau} [fin qui traîne] voix franche jusqu'à {t + PAS_S:7.2f}, {c['end'] - t - PAS_S:.2f} s avant la fin ({c['end']:.2f})")
        for m, s, e in mots_longs(morceau, debut):
            print(f"  {morceau} [mot long] « {m} » {s:7.2f} → {e:7.2f} ({e - s:.2f} s)")

print("\n== Doublons d'un bout à l'autre (A20)")
if not trouves:
    print("  aucun")
for i, j, genre, commun in trouves:
    b, c2 = tous[i], tous[j]
    print(f"  {genre} : « {' '.join(commun)} »  {b['phrase']} {b['morceau']} {b['d']:.2f} « {b['texte']} »"
          f"  →  {c2['phrase']} {c2['morceau']} {c2['d']:.2f} « {c2['texte']} »")
shutil.rmtree(TMP)
