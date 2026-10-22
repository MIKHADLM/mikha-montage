/**
 * Réglages de rendu des assets à fond transparent (motion design), à la place de remotion.config.ts :
 *   npx remotion render Motion-SiteMobile <sortie>.mov --config=remotion.asset.config.ts
 * ProRes 4444 avec couche alpha ; images intermédiaires en PNG pour garder la transparence.
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setOverwriteOutput(true);
Config.setCodec("prores");
Config.setProResProfile("4444");
Config.setPixelFormat("yuva444p10le");
Config.setVideoImageFormat("png");
Config.setColorSpace("bt709");
