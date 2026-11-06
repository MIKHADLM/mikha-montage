/**
 * Réglages du rendu du son seul (WAV), à la place de remotion.config.ts :
 *   npx remotion render Montage <sortie>.wav --props='{"video":"v<N>"}' --config=remotion.son.config.ts
 * Utilisé par scripts/rendre.py : le son est rendu à part puis assemblé avec l'image par ffmpeg,
 * car l'AAC encodé par Remotion arrive 42,7 ms après l'image (journal, 2026-11-06).
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setOverwriteOutput(true);
Config.setCodec("wav");
