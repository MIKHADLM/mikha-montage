#!/usr/bin/env python3
"""Hook de livraison du montage (MONTAGE/.claude/settings.json) : pas de livraison sans contrôle OK.

- PreToolUse, envoi Telegram (reply avec fichiers) ou commande Bash qui copie vers syncro_drive
  (cp, mv, rsync, ditto ; une simple lecture passe) :
  refuse si une vidéo envoyée/copiée (<nom>_vNN.mp4 ou son aperçu téléphone) n'a pas de
  <nom>_vNN_controle.json au statut OK (ou ACCEPTE, après l'« ok » de Michaël) fait sur ce fichier
  exact (même taille, même date).
- Stop / SubagentStop : si la dernière version d'une vidéo, rendue il y a moins de 24 h, n'a pas de
  contrôle OK et que la conversation en parle, demande une fois de lancer le contrôle avant de
  conclure (pas de blocage en boucle : stop_hook_active laisse passer).
Une session qui ne fait pas de montage n'est jamais bloquée. Toute erreur du hook laisse passer.
Contrôle : python3 scripts/verifier_livraison.py <export> (depuis MONTAGE/remotion).
"""

import json
import re
import sys
import time
from pathlib import Path

MONTAGE = Path(__file__).resolve().parents[2]
NOM = re.compile(r"([\w.-]+_v\d+)(?:_apercu-telephone)?\.mp4")
STATUTS_OK = ("OK", "ACCEPTE")


def etat(mp4: Path) -> str | None:
    """None si le contrôle est OK pour ce fichier exact, sinon la raison."""
    ctrl = mp4.with_name(f"{mp4.stem}_controle.json")
    if not ctrl.exists():
        return "aucun contrôle"
    c = json.loads(ctrl.read_text())
    if c.get("statut") not in STATUTS_OK:
        return f"contrôle {c.get('statut')} ({len(c.get('problemes', []))} problèmes)"
    st = mp4.stat()
    if c.get("export_taille") != st.st_size or abs(c.get("export_mtime", 0) - st.st_mtime) > 2:
        return "contrôle périmé (l'export a changé depuis)"
    return None


def exports_nommes(texte: str) -> list[Path]:
    trouves = []
    for stem in {m.group(1) for m in NOM.finditer(texte)}:
        trouves += [p for p in MONTAGE.glob(f"a_monter/*/export/{stem}.mp4")]
    return trouves


def refus(raisons):
    return ("Livraison bloquée (hook MONTAGE) : " + " ; ".join(raisons) +
            ". Lancer d'abord, depuis MONTAGE/remotion : python3 scripts/verifier_livraison.py <export>, "
            "corriger jusqu'à OK (skill montage-facecam, étape 5). Si Michaël accepte un point PAS OK, "
            "mettre \"statut\": \"ACCEPTE\" et ses mots dans \"accepte\" du _controle.json.")


def main():
    d = json.load(sys.stdin)
    ev = d.get("hook_event_name")
    if ev == "PreToolUse":
        outil, entree = d.get("tool_name", ""), d.get("tool_input", {}) or {}
        if outil.endswith("telegram__reply"):
            texte = " ".join(entree.get("files") or [])
        elif (outil == "Bash" and "syncro_drive" in entree.get("command", "")
              and re.search(r"\b(cp|mv|rsync|ditto)\b", entree["command"])):
            texte = entree["command"]
        else:
            return
        raisons = [f"{p.name} : {r}" for p in exports_nommes(texte) if (r := etat(p))]
        if raisons:
            print(json.dumps({"hookSpecificOutput": {"hookEventName": "PreToolUse",
                                                     "permissionDecision": "deny",
                                                     "permissionDecisionReason": refus(raisons)}}))
        return
    if ev in ("Stop", "SubagentStop"):
        if d.get("stop_hook_active"):
            return
        recents = []
        for dossier in MONTAGE.glob("a_monter/*/export"):
            versions = sorted(dossier.glob("*_v[0-9][0-9].mp4"), key=lambda p: p.stat().st_mtime)
            if versions and time.time() - versions[-1].stat().st_mtime < 24 * 3600:
                recents.append(versions[-1])
        a_controler = [(p, r) for p in recents if (r := etat(p))]
        if not a_controler:
            return
        chemin = d.get("agent_transcript_path") or d.get("transcript_path")
        if not chemin or not Path(chemin).exists():
            return
        with open(chemin, "rb") as f:
            f.seek(0, 2)
            f.seek(max(0, f.tell() - 5_000_000))
            texte = f.read().decode("utf-8", "ignore")
        raisons = [f"{p.name} : {r}" for p, r in a_controler if p.stem in texte]
        if raisons:
            print(json.dumps({"decision": "block", "reason": refus(raisons) +
                              " Si le montage est encore en cours (rendu, sous-agent), le dire et terminer."}))


try:
    main()
except Exception:
    pass
sys.exit(0)
