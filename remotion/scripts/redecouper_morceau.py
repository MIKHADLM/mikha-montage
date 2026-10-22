"""Garde seulement une partie d'un morceau de parole : crée un sous-morceau retranscrit seul.

Usage : python3 scripts/redecouper_morceau.py ../a_monter/<N> <morceau> <debutS> [<finS>] [--id c11b]

Quand un morceau contient une hésitation que la reconnaissance a effacée (reprise d'un bout de
phrase, « euh », fin où l'on regarde ses notes : voir reperer_hesitations.py), on ne garde que le
passage propre. Le passage [debutS, finS] (temps rush : attaque du premier mot et fin du dernier,
mesurées sur le son ; finS = fin du morceau par défaut) est retranscrit seul : ses mots ont alors des
temps justes, ce qui n'est pas le cas des mots de la transcription d'origine quand le modèle a
fusionné deux prises.

Écrit brut/morceaux/<id>.json et ajoute (ou remplace) l'entrée <id> dans brut/sous-morceaux.json
({id, de, start, end, offset, text}), lu par decouper_transcription.py comme un morceau ordinaire.
Dans choix.json : remplacer le morceau par <id> dans la phrase, noter « <morceau>-debut » et/ou
« <morceau>-fin » dans les coupes, puis relancer decouper_transcription.py.
"""

import argparse
import json
import shutil
import subprocess
from pathlib import Path

MODELE = Path.home() / ".cache" / "whisper-cpp" / "ggml-large-v3-turbo.bin"
MARGE_S = 0.15  # comme transcrire.py
PROMPT = "Mehomies, Mehomies Flag, BAG, Boxy, Baby Tee."

p = argparse.ArgumentParser()
p.add_argument("video")
p.add_argument("morceau")
p.add_argument("debut", type=float)
p.add_argument("fin", type=float, nargs="?")
p.add_argument("--id")
p.add_argument("--prompt", default=PROMPT)
a = p.parse_args()

VIDEO = Path(a.video).resolve()
BRUT = VIDEO / "transcription" / "brut"
choix = json.loads((VIDEO / "transcription" / "choix.json").read_text())
parent = next(c for c in json.loads((BRUT / "morceaux.json").read_text()) if f"c{c['k']:02d}" == a.morceau)
fin = a.fin if a.fin is not None else parent["end"]
if not parent["start"] - 0.5 <= a.debut < fin <= parent["end"] + 0.5:
    raise SystemExit(f"Passage {a.debut}–{fin} hors du morceau {a.morceau} ({parent['start']}–{parent['end']})")
ident = a.id or f"{a.morceau}b"

TMP = BRUT / ".tmp_sous"
TMP.mkdir(exist_ok=True)
offset = max(0.0, a.debut - MARGE_S)
wav = TMP / f"{ident}.wav"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(VIDEO / choix["rush"]), "-map", "0:a:0", "-ac", "1",
                "-ar", "16000", "-ss", f"{offset:.3f}", "-to", f"{fin + MARGE_S:.3f}", "-c:a", "pcm_s16le", str(wav)],
               check=True)
base = BRUT / "morceaux" / ident
subprocess.run(["whisper-cli", "-m", str(MODELE), "-l", "fr", "-bs", "5", "--prompt", a.prompt, "-ojf", "-np",
                "-of", str(base), "-f", str(wav)], check=True, capture_output=True)
shutil.rmtree(TMP)
d = json.loads(Path(f"{base}.json").read_text())
texte = "".join(s["text"] for s in d["transcription"]).strip()

fichier = BRUT / "sous-morceaux.json"
sous = json.loads(fichier.read_text()) if fichier.exists() else []
sous = [s for s in sous if s["id"] != ident]
sous.append({"id": ident, "de": a.morceau, "start": round(a.debut, 3), "end": round(fin, 3),
             "offset": round(offset, 3), "text": texte})
fichier.write_text(json.dumps(sorted(sous, key=lambda s: s["start"]), ensure_ascii=False, indent=1))
print(f"{ident} ({a.morceau}, {a.debut:.2f} → {fin:.2f} s) : {texte}")
