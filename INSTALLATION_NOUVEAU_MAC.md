# Prompt d'installation de MONTAGE sur un nouveau Mac

> À donner à Claude Code sur le nouveau Mac, avec le zip `MONTAGE_skill-montage-facecam_<date>.zip`. Écrit le 2026-10-22 par Claude sur le Mac principal de Michaël.

---

Bonjour Claude. Je suis Michaël Philibert, vidéaste, fondateur de la marque Mehomies, compte `mikha_dlm`. Je te confie l'installation de mon espace de montage vidéo assisté par IA, que j'utilise déjà sur mon Mac principal. Je ne suis pas développeur : explique-moi en français simple ce que tu fais, et demande-moi seulement ce que tu ne peux pas faire seul (mot de passe, connexion à un compte).

## Ce que c'est

Le dossier `MONTAGE` (dans le zip) contient :
- un **skill Claude Code**, `montage-facecam` (`MONTAGE/.claude/skills/montage-facecam/`), qui monte mes vidéos face cam de bout en bout avec Remotion : choix des prises, chasse aux hésitations, titre d'accroche, cadrages, sous-titres, illustrations sur fond blanc, son, contrôles ;
- la **charte** de mon style (`CHARTE/`), qui fait foi ;
- les **outils** (`remotion/` : scripts Python et composition Remotion « Montage ») ;
- la **mémoire** : `apprentissage/JOURNAL.md` (leçons et règles), `motion_design/` (banque d'animations), et les documents des vidéos déjà montées (`a_monter/1`, `a_monter/2`), qui servent d'exemples ;
- `SYNCHRO.md` et `synchro.sh` : la synchronisation entre mes Mac par un dépôt Git privé.

Le zip contient déjà l'historique Git (`MONTAGE/.git`). Les médias lourds (rushes, exports) n'y sont pas : je les copie à la main quand je monte une vidéo sur ce Mac.

## Ce que je te demande

1. **Placer le dossier** : dézipper pour obtenir `~/Documents/MIKHA/IA STUDIO/MONTAGE` (crée `MIKHA/IA STUDIO` s'il n'existe pas). Ce chemin compte : le skill et les scripts s'y réfèrent. Si un dossier MONTAGE existe déjà, ne l'écrase pas : montre-moi la différence et demande.

2. **Installer les outils** (vérifie d'abord ce qui est déjà là, installe le reste) :
   - Homebrew (s'il manque, donne-moi la commande officielle : elle demande mon mot de passe) ;
   - `brew install ffmpeg whisper-cpp node jq` ;
   - Python 3 et Pillow : `pip3 install Pillow` ;
   - numpy pour le contrôle avant livraison (`remotion/scripts/verifier_livraison.py`) : soit earshot installé dans `~/agent/outils/earshot` (le script prend son python), soit `pip3 install numpy` ; sans earshot, lancer le contrôle avec `--sans-earshot` ;
   - facultatif, l'aligneur mot à mot (`remotion/scripts/aligner_mots.py`) : copier `~/agent/outils/aligneur/` du serveur (venv Python 3.12 avec mlx-audio 0.6.4, modèle `mlx-community/Qwen3-ForcedAligner-0.6B-8bit` dans `hf/`, 1,6 Go, Apple Silicon) ; sans lui, le découpage prend les temps de whisper ;
   - les modules Remotion : `npm install` dans `MONTAGE/remotion` (Remotion 4.0.530, la version est dans `package.json`) ;
   - le modèle de transcription : `ggml-large-v3-turbo.bin` dans `~/.cache/whisper-cpp/` (téléchargement depuis la page officielle des modèles whisper.cpp sur Hugging Face, `ggerganov/whisper.cpp`, environ 1,6 Go).

3. **Vérifier que tout marche** (sans rien monter) :
   - `whisper-cli --help`, `ffmpeg -version`, `ffprobe -version` répondent ;
   - dans `MONTAGE/remotion` : `npx tsc --noEmit` et `npx eslint src` passent sans erreur ;
   - `python3 -c "import PIL"` passe ;
   - le skill `montage-facecam` apparaît bien quand Claude Code est ouvert sur `MONTAGE`.
   Les images et le son d'une vidéo (`remotion/public/v<N>/`) se recréent par `scripts/preparer_medias.py` quand on monte : c'est normal qu'ils manquent.

4. **Brancher la synchronisation** (lis `MONTAGE/SYNCHRO.md`) :
   - Le dépôt est `git@github.com:MIKHADLM/mikha-montage.git` (privé, compte GitHub `MIKHADLM`).
   - Ce Mac doit pouvoir y accéder. S'il n'a pas de clé SSH reconnue par GitHub (`ssh -T git@github.com` doit répondre « Hi MIKHADLM! ») : crée une clé (`ssh-keygen -t ed25519 -C "MIKHADLM Mac 2"`), affiche-moi la clé publique et guide-moi pour l'ajouter dans GitHub (Settings → SSH and GPG keys → New SSH key). Ne touche à aucun autre réglage de mon compte.
   - Configure Git si besoin : `git config --global user.name "MIKHADLM"` et `git config --global user.email "158492386+MIKHADLM@users.noreply.github.com"`.
   - Puis, dans `MONTAGE` : `git status` (le zip contient le dépôt), `git remote -v` (doit montrer l'adresse ci-dessus), et `./synchro.sh` pour récupérer les changements faits depuis le zip.

5. **Ce qui ne marchera pas ici, et c'est voulu** :
   - Le garde-fou de livraison (`.claude/hooks/controle_livraison.py`, dans `settings.json`) marche partout : il refuse d'envoyer ou de copier vers Drive une version sans contrôle OK.
   - `MONTAGE/.claude/settings.json` lance après chaque réponse un script de mon dossier `AUTOMATISATIONS`, qui n'existe que sur mon Mac principal. Il échoue sans bruit : n'y touche pas (le fichier est partagé par la synchro ; le modifier casserait le Mac principal).
   - Pas de dossier `AUTOMATISATIONS` ici : la publication (copie dans `syncro_drive`, Metricool, bot Telegram) se fait depuis le Mac principal ou par les routines cloud.

6. **Me faire un compte rendu court** : ce qui est installé, ce qui a été vérifié, ce qui reste à faire de mon côté.

## Pour la suite (à retenir, pour toi et les prochaines sessions)

- Pour monter une vidéo : je dépose le rush et ses assets dans `MONTAGE/a_monter/<N>/`, et tu suis le skill `montage-facecam` (il commence par `./synchro.sh`).
- Après chaque étape qui change un fichier suivi, `./synchro.sh "vidéo N : …"`, pour que mon autre Mac reste à jour. Une vidéo se monte sur un seul Mac à la fois.
- La charte et le skill évoluent avec mes retours : n'y ajoute une règle qu'avec mon accord, et note-la dans le journal.
- Si tu as un système de mémoire, garde : « Espace de montage dans `~/Documents/MIKHA/IA STUDIO/MONTAGE`, synchronisé par Git (`SYNCHRO.md`), skill `montage-facecam` ; parler à Michaël en français simple ; ne rien inventer (valeurs inconnues = À COMPLÉTER) ».
