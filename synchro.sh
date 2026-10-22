#!/bin/bash
# Synchronise l'espace MONTAGE entre les Mac de Michaël (dépôt Git privé MIKHADLM/mikha-montage).
# Usage : ./synchro.sh            → récupère, puis envoie (avec un message automatique)
#         ./synchro.sh "message"  → idem avec ce message
# Les médias lourds (rushes, assets, exports) ne passent pas par là : voir SYNCHRO.md.
set -euo pipefail
cd "$(dirname "$0")"
MESSAGE="${1:-Synchro $(scutil --get ComputerName 2>/dev/null || hostname) $(date '+%Y-%m-%d %H:%M')}"
git add -A
git diff --cached --quiet || git commit -q -m "$MESSAGE"
git pull --rebase -q origin main
git push -q origin main
echo "✅ MONTAGE synchronisé ($(git log -1 --format='%h · %s'))"
