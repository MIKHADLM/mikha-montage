#!/usr/bin/env python3
"""Contrôle unique avant livraison : un verdict OK / PAS OK et la liste des problèmes.

Usage (depuis MONTAGE/remotion) :
  python3 scripts/verifier_livraison.py ../a_monter/<N>/export/<nom>_vNN.mp4 [--sans-earshot]
  python3 scripts/verifier_livraison.py ../a_monter/<N> vNN

Mesure, d'après les seuils de scripts/seuils_livraison.json :
  - format (1080×1920, 30 i/s, H.264 yuv420p, AAC 48 kHz) et accord avec le découpage de la version ;
  - loudness intégrée (-14 LUFS ± 1), pic vrai (-1 dBTP au plus), échantillons écrêtés ;
  - silences restants, images noires ;
  - décalage du son de l'export par rapport au rush, plan par plan (corrélation croisée, en ms) ;
  - clics parasites aux coupes du face cam ;
  - bruitages : écart entre le temps prévu (plan.json, même code que le montage) et le temps
    retrouvé dans l'export (corrélation avec le fichier du bruitage), puis earshot timeline --cues ;
  - zone sûre des textes et éléments sur fond (dernière image de chaque séquence) ;
  - images isolées aux raccords (detecter_frames_isolees.py, règle A13).
Écrit export/<nom>_vNN_controle.json (preuve lue par le hook de livraison de .claude/settings.json).
Code de sortie : 0 si OK, 1 si PAS OK.

Besoin de numpy : si le python3 du système ne l'a pas, le script se relance avec le python d'earshot
(~/agent/outils/earshot/.venv/bin/python, qui a numpy, scipy et Pillow).
"""

import os
import sys
from pathlib import Path

try:
    import numpy as np
except ImportError:
    py = Path.home() / "agent/outils/earshot/.venv/bin/python"
    if py.exists() and Path(sys.executable).resolve() != py.resolve():
        os.execv(str(py), [str(py), *sys.argv])
    sys.exit("numpy manque : installer numpy (ou earshot dans ~/agent/outils/earshot), voir INSTALLATION_NOUVEAU_MAC.md")

import argparse
import datetime as dt
import json
import re
import subprocess
import tempfile

from PIL import Image

SCRIPTS = Path(__file__).resolve().parent
REMOTION = SCRIPTS.parent
MONTAGE = REMOTION.parent
SR = 48000

p = argparse.ArgumentParser()
p.add_argument("cible", help="export .mp4, ou dossier a_monter/<N>")
p.add_argument("version", nargs="?", help="vNN si la cible est un dossier")
p.add_argument("--sans-earshot", action="store_true", help="sauter le deuxième avis earshot (plus rapide)")
p.add_argument("--seuils", default=str(SCRIPTS / "seuils_livraison.json"))
a = p.parse_args()

cible = Path(a.cible)
if cible.is_dir():
    trouves = sorted((cible / "export").glob(f"*_{a.version}.mp4"))
    if not a.version or len(trouves) != 1:
        sys.exit(f"export introuvable pour {a.version} dans {cible / 'export'}")
    EXPORT = trouves[0].resolve()
else:
    EXPORT = cible.resolve()
DOSSIER = EXPORT.parent.parent
STEM = EXPORT.stem
VERSION = re.search(r"_(v\d+)$", STEM)
VERSION = VERSION.group(1) if VERSION else STEM
SEUILS = json.loads(Path(a.seuils).read_text())

problemes, avertissements, mesures, faits = [], [], {}, []


def bloquant(controle, texte):
    problemes.append({"controle": controle, "detail": texte})


def avertir(controle, texte):
    avertissements.append({"controle": controle, "detail": texte})


def lancer(*args, **kw):
    return subprocess.run([str(x) for x in args], capture_output=True, text=True, **kw)


def lire_son(fichier, canaux=1):
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", str(fichier), "-vn", "-ac", str(canaux), "-ar", str(SR),
                        "-f", "f32le", "-"], capture_output=True, check=True)
    x = np.frombuffer(r.stdout, dtype=np.float32)
    return x.reshape(-1, canaux) if canaux > 1 else x


def correler(cherche, ref):
    """Position du meilleur accord de ref dans cherche (corrélation normalisée)."""
    n = len(cherche) + len(ref)
    N = 1 << int(np.ceil(np.log2(n)))
    c = np.fft.irfft(np.fft.rfft(cherche, N) * np.conj(np.fft.rfft(ref, N)), N)[: len(cherche) - len(ref) + 1]
    e = np.sqrt(np.maximum(np.convolve(cherche ** 2, np.ones(len(ref)), "valid"), 1e-12))
    nc = c / (e * (np.linalg.norm(ref) + 1e-12))
    k = int(np.argmax(nc))
    return k, float(nc[k])


# ---------- repères du montage (même code que la composition) ----------
def premier(*chemins):
    return next((c for c in chemins if c.exists()), None)


decoupage = premier(EXPORT.with_name(f"{STEM}_decoupage.json"), DOSSIER / "transcription/decoupage.json")
plan = premier(EXPORT.with_name(f"{STEM}_plan.json"), DOSSIER / "plan.json")
mots = DOSSIER / "transcription/mots_montage.json"
if not EXPORT.with_name(f"{STEM}_plan.json").exists():
    avertir("repères", f"pas de copie du plan pour {VERSION} : plan.json actuel utilisé")
r = lancer("node", SCRIPTS / "reperes_montage.mjs", decoupage, mots, plan, cwd=REMOTION)
if r.returncode:
    sys.exit("repères du montage illisibles :\n" + r.stderr[-1500:])
R = json.loads(r.stdout)
FPS = R["fps"]
dec = json.loads(Path(decoupage).read_text())
RUSH = MONTAGE / dec["source"]

# ---------- format ----------
info = json.loads(lancer("ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", EXPORT).stdout)
v = next(s for s in info["streams"] if s["codec_type"] == "video")
son = next((s for s in info["streams"] if s["codec_type"] == "audio"), None)
F = SEUILS["format"]
nb = int(v.get("nb_frames", 0))
mesures["format"] = {"dimensions": f"{v['width']}×{v['height']}", "cadence": v["r_frame_rate"], "images": nb,
                     "codec": f"{v['codec_name']} {v.get('pix_fmt')}",
                     "son": f"{son['codec_name']} {son['sample_rate']}" if son else None}
if (v["width"], v["height"]) != (F["largeur"], F["hauteur"]):
    bloquant("format", f"dimensions {v['width']}×{v['height']} au lieu de {F['largeur']}×{F['hauteur']}")
if v["r_frame_rate"] != F["cadence"]:
    bloquant("format", f"cadence {v['r_frame_rate']}")
if v["codec_name"] != F["codec_video"] or v.get("pix_fmt") != F["pixels"]:
    bloquant("format", f"codec {v['codec_name']} {v.get('pix_fmt')}")
if not son or son["codec_name"] != F["codec_son"] or int(son["sample_rate"]) != F["frequence_son"]:
    bloquant("format", "son absent ou pas en AAC 48 kHz")
if nb and nb != R["duree"]:
    bloquant("format", f"{nb} images dans l'export, {R['duree']} dans le découpage de {VERSION} : ce n'est pas le même montage")
faits.append("format")

# ---------- loudness, pic vrai, saturation, silences, noir ----------
L = SEUILS["loudness"]
ebu = lancer("ffmpeg", "-nostats", "-i", EXPORT, "-af", "ebur128=peak=true", "-f", "null", "-").stderr
ebu = ebu[ebu.rfind("Summary:"):]
lufs = float(re.search(r"I:\s+(-?[\d.]+) LUFS", ebu).group(1))
pic = float(re.search(r"Peak:\s+(-?[\d.]+) dBFS", ebu).group(1))
mesures["loudness_lufs"], mesures["pic_vrai_dbtp"] = lufs, pic
if abs(lufs - L["cible_lufs"]) > L["tolerance_lu"]:
    bloquant("loudness", f"{lufs:.1f} LUFS (cible {L['cible_lufs']:.0f} ± {L['tolerance_lu']:.0f})")
if pic > L["pic_vrai_max_dbtp"]:
    bloquant("pic vrai", f"{pic:+.1f} dBTP (maximum {L['pic_vrai_max_dbtp']:.0f}) : lancer finaliser_son.py")
faits.append("loudness et pic vrai")

stereo = lire_son(EXPORT, 2)
S = SEUILS["saturation"]
ecrete = (np.abs(stereo) >= S["niveau"]).any(axis=1).astype(np.int8)
bords = np.diff(np.concatenate([[0], ecrete, [0]]))
debuts, fins = np.where(bords == 1)[0], np.where(bords == -1)[0]
suites = [(d, f) for d, f in zip(debuts, fins) if f - d >= S["suite_min"]]
mesures["saturation"] = {"echantillons_ecretes": int(ecrete.sum()), "suites": len(suites)}
if len(suites) > S["max_suites"]:
    bloquant("saturation", f"{len(suites)} passages écrêtés, dès {suites[0][0] / SR:.2f} s")
faits.append("saturation")

Si = SEUILS["silences"]
sil = lancer("ffmpeg", "-nostats", "-i", EXPORT, "-af", f"silencedetect=noise={Si['seuil_db']}dB:d={Si['duree_min_s']}",
             "-f", "null", "-").stderr
blancs = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", sil)]
mesures["silences_s"] = blancs
if blancs:
    bloquant("silences", "blanc d'au moins 0,3 s à " + ", ".join(f"{x:.2f} s" for x in blancs))
noir = lancer("ffmpeg", "-nostats", "-i", EXPORT, "-vf", "blackdetect=d=0.05:pix_th=0.10", "-an", "-f", "null", "-").stderr
noirs = [float(x) for x in re.findall(r"black_start:([\d.]+)", noir)]
if noirs:
    bloquant("images noires", ", ".join(f"{x:.2f} s" for x in noirs))
faits.append("silences et images noires")

# ---------- synchro son export ↔ rush ----------
x = stereo.mean(axis=1)
Sy = SEUILS["synchro_rush"]
if RUSH.exists():
    rush = lire_son(RUSH)
    plans = []
    W = 0.1
    for g in R["segments"]:
        duree = (g["fin"] - g["debut"]) / FPS
        if duree - 0.2 < Sy["plan_min_s"]:
            continue
        s0, m0 = g["sourceDebut"] / FPS + 0.1, g["debut"] / FPS + 0.1
        ref = rush[int(s0 * SR): int((s0 + duree - 0.2) * SR)]
        i0 = int((m0 - W) * SR)
        cherche = x[max(0, i0): int((m0 + duree - 0.2 + W) * SR)]
        if len(ref) < SR * 0.3 or len(cherche) <= len(ref):
            continue
        k, c = correler(cherche, ref)
        decal = ((k + max(0, i0)) / SR - m0) * 1000
        plans.append({"plan": g["id"], "phrase": g["phrase"], "a_s": round(g["debut"] / FPS, 2),
                      "decalage_ms": round(decal, 1), "correlation": round(c, 2)})
    fiables = [q for q in plans if q["correlation"] >= Sy["correlation_min"]]
    med = float(np.median([q["decalage_ms"] for q in fiables])) if fiables else None
    mesures["synchro_rush"] = {"mediane_ms": med, "plans": plans}
    if med is None:
        avertir("synchro rush", "aucun plan mesurable (corrélation trop faible)")
    else:
        if abs(med) > Sy["mediane_max_ms"]:
            bloquant("synchro rush", f"son de l'export décalé de {med:+.1f} ms par rapport au rush (médiane sur "
                                     f"{len(fiables)} plans ; positif = son en retard). Cause connue : AAC de "
                                     "Remotion, rendre avec scripts/rendre.py")
        for q in fiables:
            if abs(q["decalage_ms"]) > Sy["plan_max_ms"] and abs(med) <= Sy["mediane_max_ms"]:
                bloquant("synchro rush", f"plan {q['plan']} ({q['phrase']}, {q['a_s']:.2f} s) décalé de {q['decalage_ms']:+.1f} ms")
    faits.append("synchro son / rush")
else:
    avertir("synchro rush", f"rush absent sur ce Mac ({dec['source']}) : synchro non mesurée")

# ---------- bruitages : temps prévus contre temps retrouvés ----------
B = SEUILS["bruitages"]
gabarits = {}
mesures_b = []
for b in R["sons"]:
    if b["fichier"] not in gabarits:
        g = lire_son(REMOTION / "public" / b["fichier"])
        a0 = max(0, int((b["attaqueS"] - 0.02) * SR))
        gabarits[b["fichier"]] = (g[a0: a0 + int(0.15 * SR)], a0 / SR)
    tpl, decal_tpl = gabarits[b["fichier"]]
    prevu = b["image"] / FPS + decal_tpl
    fen = B["fenetre_ms"] / 1000
    i0 = max(0, int((prevu - fen) * SR))
    cherche = x[i0: int((prevu + fen) * SR) + len(tpl)]
    if len(cherche) <= len(tpl):
        continue
    k, c = correler(cherche, tpl)
    ecart = ((i0 + k) / SR - prevu) * 1000
    mesures_b.append({"son": b["nom"], "prevu_s": round(b["attaqueSecondes"], 3), "ecart_ms": round(ecart, 1),
                      "correlation": round(c, 2)})
mesures["bruitages"] = mesures_b
trouves = [q for q in mesures_b if q["correlation"] >= B["correlation_min"]]
for q in mesures_b:
    if q["correlation"] < B["correlation_min"]:
        avertir("bruitages", f"{q['son']} à {q['prevu_s']:.2f} s : non retrouvé (corrélation {q['correlation']:.2f})")
hors = [q for q in trouves if abs(q["ecart_ms"]) > B["ecart_max_ms"]]
med_b = float(np.median([q["ecart_ms"] for q in trouves])) if trouves else 0.0
if hors and len(hors) == len(trouves) and max(abs(q["ecart_ms"] - med_b) for q in hors) < 3:
    bloquant("bruitages", f"les {len(hors)} bruitages sont tous décalés de {med_b:+.1f} ms (même décalage que tout le son)")
else:
    for q in hors:
        bloquant("bruitages", f"{q['son']} à {q['prevu_s']:.2f} s : {q['ecart_ms']:+.1f} ms par rapport au temps prévu")
faits.append("bruitages (temps prévus)")

E = SEUILS["earshot"]
earshot = Path(os.path.expanduser(E["commande"]))
if not a.sans_earshot and R["sons"] and earshot.exists():
    with tempfile.TemporaryDirectory() as tmp:
        sortie = Path(tmp) / "t.json"
        cues = ",".join(f"{b['attaqueSecondes']:.3f}" for b in R["sons"])
        r = lancer(earshot, "timeline", EXPORT, "--cues", cues, "--detail", "low", "--out", sortie)
        if sortie.exists():
            sync = json.loads(sortie.read_text()).get("sync", {}).get("cues", {})
            items = sync.get("items", [])
            med = sync.get("stats", {}).get("median_abs_offset_ms")
            mesures["earshot_cues"] = {"mediane_abs_ms": med,
                                       "items": [{k: i.get(k) for k in ("t", "offset_ms", "status")} for i in items]}
            if med is not None and med > E["mediane_max_ms"]:
                bloquant("earshot", f"bruitages à {med:.0f} ms (médiane des écarts) de leur temps prévu (earshot timeline --cues)")
            faits.append("earshot timeline --cues")
        else:
            avertir("earshot", "earshot n'a rien rendu : " + r.stderr.strip()[-300:])
elif not a.sans_earshot and R["sons"]:
    avertir("earshot", "earshot absent sur ce Mac : deuxième avis sauté")

# ---------- clics aux coupes ----------
C = SEUILS["clics"]
d2 = np.abs(np.diff(x, 2))
reperes_sons = [b["attaqueSecondes"] for b in R["sons"]] + [b["image"] / FPS for b in R["sons"]]
if R.get("accroche"):
    reperes_sons.append(R["accroche"]["fin"] / FPS)  # fin du riser, début de la musique
clics = []
for cf in R["coupes"]:
    t = cf / FPS
    if any(abs(t - s) < 0.12 for s in reperes_sons):
        continue
    w, ctx = int(C["fenetre_ms"] / 1000 * SR), int(C["contexte_ms"] / 1000 * SR)
    i = int(t * SR)
    fenetre = d2[max(0, i - w): i + w]
    contexte = np.concatenate([d2[max(0, i - ctx): max(0, i - w)], d2[i + w: i + ctx]])
    if not len(fenetre) or not len(contexte):
        continue
    rapport = float(fenetre.max() / (np.percentile(contexte, 99.5) + 1e-9))
    clics.append({"coupe_s": round(t, 2), "rapport": round(rapport, 2)})
    if rapport > C["rapport_max"]:
        bloquant("clics", f"clic probable à la coupe de {t:.2f} s (image {cf}), rapport {rapport:.1f}")
    elif rapport > C["rapport_avertissement"]:
        avertir("clics", f"coupe de {t:.2f} s (image {cf}) à écouter, rapport {rapport:.1f}")
mesures["clics"] = clics
faits.append("clics aux coupes")

# ---------- zone sûre ----------
Z = SEUILS["zone_sure"]
images = []
for s in R["sequences"]:
    if s["type"] in Z["types_exclus"] or (s["type"] == "motion" and s["fond"] == "facecam"):
        continue
    if s["type"] == "texte" and s["image"]:
        continue  # image ou vidéo plein cadre : pas de fond uni à comparer
    instants = [q - 2 for q in s["debutsPhotos"][1:]] + [s["fin"] - 2]
    images += [(f, s["type"]) for f in instants if 0 <= f < R["duree"]]
zone = []
if images:
    with tempfile.TemporaryDirectory() as tmp:
        sel = "+".join(f"eq(n\\,{f})" for f, _ in images)
        lancer("ffmpeg", "-v", "error", "-i", EXPORT, "-vf", f"select={sel}", "-fps_mode", "passthrough",
               f"{tmp}/z%03d.png")
        for k, (f, typ) in enumerate(images):
            fic = Path(tmp) / f"z{k + 1:03d}.png"
            if not fic.exists():
                continue
            im = np.asarray(Image.open(fic).convert("RGB")).astype(np.int16)
            fond = np.median(im[300:1600, 10:60].reshape(-1, 3), axis=0)
            encre = np.abs(im - fond).max(axis=2) > Z["ecart_couleur"]
            yy, xx = np.nonzero(encre)
            hors = ((yy < Z["haut"]) | (yy > Z["bas"]) | (xx < Z["gauche"]) |
                    ((yy < Z["limite_basse_y"]) & (xx > Z["droite_haute"])) |
                    ((yy >= Z["limite_basse_y"]) & (xx > Z["droite_basse"])))
            n = int(hors.sum())
            boite = [int(xx.min()), int(yy.min()), int(xx.max()), int(yy.max())] if len(xx) else None
            zone.append({"image": f, "type": typ, "pixels_hors_zone": n, "boite_encre": boite})
            if n > Z["pixels_max"]:
                hy, hx = yy[hors], xx[hors]
                bloquant("zone sûre", f"{typ}, image {f} ({f / FPS:.2f} s) : {n} pixels hors zone, de x {hx.min()}-{hx.max()} "
                                      f"et y {hy.min()}-{hy.max()}")
mesures["zone_sure"] = zone
faits.append("zone sûre (séquences sur fond)")

# ---------- images isolées aux raccords ----------
Fi = SEUILS["frames_isolees"]
r = lancer(sys.executable, SCRIPTS / "detecter_frames_isolees.py", EXPORT, "--seuil", Fi["seuil"], "--ecart", Fi["ecart"])
for l in r.stdout.splitlines():
    if l.startswith("À CORRIGER"):
        bloquant("images isolées", l.replace("À CORRIGER", "").strip())
mesures["frames_isolees"] = r.stdout.strip().splitlines()[:1]
faits.append("images isolées")

# ---------- verdict ----------
statut = "OK" if not problemes else "PAS OK"
st = EXPORT.stat()
rapport = {
    "statut": statut,
    "version": VERSION,
    "export": str(EXPORT),
    "export_taille": st.st_size,
    "export_mtime": st.st_mtime,
    "date": dt.datetime.now().isoformat(timespec="seconds"),
    "problemes": problemes,
    "avertissements": avertissements,
    "controles": faits,
    "mesures": mesures,
    "sources": {"decoupage": str(decoupage), "plan": str(plan), "rush": str(RUSH)},
}
sortie = EXPORT.with_name(f"{STEM}_controle.json")
sortie.write_text(json.dumps(rapport, ensure_ascii=False, indent=1))

print(f"{EXPORT.name} : {statut}")
for q in problemes:
    print(f"  PROBLÈME      [{q['controle']}] {q['detail']}")
for q in avertissements:
    print(f"  à regarder    [{q['controle']}] {q['detail']}")
sy = mesures.get("synchro_rush", {}).get("mediane_ms")
print(f"  mesures : {lufs:.1f} LUFS, pic vrai {pic:+.1f} dBTP"
      + (f", son / rush {sy:+.1f} ms" if sy is not None else "")
      + (f", bruitages écart médian {np.median([b['ecart_ms'] for b in mesures_b]):+.1f} ms" if mesures_b else "")
      + (f", earshot écart médian {mesures['earshot_cues']['mediane_abs_ms']:.0f} ms" if mesures.get("earshot_cues", {}).get("mediane_abs_ms") is not None else ""))
print(f"  contrôlé : {', '.join(faits)}")
print(f"  preuve : {sortie.name}")
sys.exit(0 if statut == "OK" else 1)
