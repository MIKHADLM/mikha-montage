/**
 * Réglages de rendu du projet de montage mikha_dlm.
 * Ils s'appliquent à `npx remotion render` et `npx remotion studio`.
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setOverwriteOutput(true);
// Format de la charte : H.264, BT.709 comme le rush (déjà étalonné, sa couleur ne doit pas bouger)
Config.setCodec("h264");
Config.setColorSpace("bt709");
Config.setPixelFormat("yuv420p");
Config.setCrf(16);
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
