// Captures du site mehomies.com en version mobile, pour le motion design « site mobile ».
//
// Usage : node scripts/capturer_site.mjs ../motion_design/site_mobile [image de la mascotte, 1 à 4]
//
// Ouvre le site dans le Chrome de Remotion, comme un téléphone de 390 × 844 points à densité 3
// (captures de 1 170 px de large), et écrit dans <dossier>/captures/ (copie dans public/site-mobile/) :
//   accueil.png            page d'accueil entière, mascotte sur l'image choisie, bandeau au début
//   produit.png            page du France Boxy Tee, aucune taille choisie
//   produit_taille-m.png   la même page, taille M choisie : bouton « Ajouter au panier »
//   positions.json         positions des éléments animés, en points de page (1 point = 3 px de capture),
//                          copiées dans src/motion/donnees/site-mobile.json
// Les animations du site (carrousel, bandeau, transitions) sont figées avant chaque capture.

import { spawn } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REMOTION = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DOSSIER = path.resolve(process.argv[2]);
const DIAPO = Number(process.argv[3] ?? 1);
const SITE = "https://www.mehomies.com/";
const PRODUIT = "https://www.mehomies.com/product/france-mehomies-boxy-tee";
const TAILLE = "M";
const ECRAN = { largeur: 390, hauteur: 844, densite: 3 };
const CHROME = path.join(REMOTION, "node_modules/.remotion/chrome-headless-shell/mac-arm64",
  "chrome-headless-shell-mac-arm64/chrome-headless-shell");
const PORT = 9333;
const NAVIGATEUR = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 "
  + "(KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1";

const captures = path.join(DOSSIER, "captures");
const publicSite = path.join(REMOTION, "public", "site-mobile");
mkdirSync(captures, { recursive: true });
mkdirSync(publicSite, { recursive: true });
const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

// Chrome et protocole DevTools
const profil = mkdtempSync(path.join(os.tmpdir(), "capture-site-"));
const chrome = spawn(CHROME, [`--remote-debugging-port=${PORT}`, `--user-data-dir=${profil}`, "--no-first-run",
  "--hide-scrollbars", "--lang=fr-FR", "about:blank"], { stdio: "ignore" });
process.on("exit", () => chrome.kill());
let cible;
for (let i = 0; i < 100 && !cible; i++) {
  await attendre(100);
  cible = await fetch(`http://127.0.0.1:${PORT}/json/list`).then((r) => r.json())
    .then((liste) => liste.find((t) => t.type === "page")).catch(() => undefined);
}
if (!cible) throw new Error("Chrome ne répond pas");
const ws = new WebSocket(cible.webSocketDebuggerUrl);
await new Promise((ok, erreur) => { ws.onopen = ok; ws.onerror = erreur; });
let numero = 0;
const attentes = new Map();
ws.onmessage = (m) => {
  const message = JSON.parse(m.data);
  const attente = attentes.get(message.id);
  if (!attente) return;
  attentes.delete(message.id);
  if (message.error) attente.erreur(new Error(`${attente.methode} : ${message.error.message}`));
  else attente.ok(message.result);
};
const cdp = (methode, params = {}) => new Promise((ok, erreur) => {
  attentes.set(++numero, { ok, erreur, methode });
  ws.send(JSON.stringify({ id: numero, method: methode, params }));
});
const evaluer = async (code) => {
  const r = await Promise.race([
    cdp("Runtime.evaluate", { expression: code, awaitPromise: true, returnByValue: true }),
    attendre(60000).then(() => { throw new Error(`Page bloquée : ${code.slice(0, 80)}`); }),
  ]);
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
  return r.result.value;
};

await cdp("Page.enable");
await cdp("Emulation.setDeviceMetricsOverride",
  { width: ECRAN.largeur, height: ECRAN.hauteur, deviceScaleFactor: ECRAN.densite, mobile: true });
await cdp("Emulation.setUserAgentOverride", { userAgent: NAVIGATEUR, acceptLanguage: "fr-FR" });
await cdp("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });

// Ouvre une page, la fait défiler en entier pour charger les images différées, revient en haut
const ouvrir = async (url) => {
  await cdp("Page.navigate", { url });
  await attendre(1000);
  for (let i = 0; i < 150; i++) {
    if (await evaluer("document.readyState").catch(() => "") === "complete") break;
    await attendre(200);
  }
  await evaluer(`(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 300) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 150));
    }
    scrollTo(0, 0);
    const images = [...document.images].filter((i) => i.getBoundingClientRect().height > 0);
    await Promise.race([
      Promise.all(images.map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))),
      new Promise((r) => setTimeout(r, 10000)),
    ]);
    await document.fonts.ready;
  })()`);
  await attendre(3000);
};

// Arrête minuteries, transitions et animations
const figer = () => evaluer(`(() => {
  const style = document.createElement("style");
  style.textContent = "*, *::before, *::after { transition: none !important; }";
  document.head.append(style);
  document.getAnimations().forEach((a) => a.pause());
  const dernier = setTimeout(() => {}, 0);
  for (let i = 0; i <= dernier; i++) { clearTimeout(i); clearInterval(i); }
  return true;
})()`);

// Bandeau défilant figé avec son premier texte (« Précommandes disponibles ») à 16 points du bord
const figerBandeau = () => evaluer(`(() => {
  const bandeau = document.querySelector(".ticker");
  const animation = document.querySelector(".ticker__wrap")?.getAnimations()[0];
  if (!bandeau || !animation) return false;
  const texte = document.createRange();
  texte.selectNodeContents(document.querySelector(".ticker__item"));
  const x = (t) => { animation.currentTime = t; return texte.getBoundingClientRect().left - bandeau.getBoundingClientRect().left; };
  const x0 = x(0);
  const vitesse = (x(1000) - x0) / 1000;
  animation.currentTime = (16 - x0) / vitesse;
  return Math.round(x(animation.currentTime));
})()`);

// Rectangle d'un élément en points de page ; « trouver » est une expression JavaScript
const position = (trouver) => evaluer(`(() => {
  const e = ${trouver};
  if (!e) return null;
  const r = e.getBoundingClientRect();
  const a = (v) => Math.round(v * 10) / 10;
  return { x: a(r.left + scrollX), y: a(r.top + scrollY), largeur: a(r.width), hauteur: a(r.height) };
})()`);
const visible = (selecteur, test) => `[...document.querySelectorAll(${JSON.stringify(selecteur)})]
  .find((e) => e.getBoundingClientRect().height > 20 && (${test})(e))`;

const capturer = async (fichier) => {
  await evaluer("scrollTo(0, 0)");
  await attendre(500);
  const { cssContentSize } = await cdp("Page.getLayoutMetrics");
  const hauteur = Math.ceil(cssContentSize.height);
  const { data } = await cdp("Page.captureScreenshot", { format: "png", captureBeyondViewport: true,
    clip: { x: 0, y: 0, width: ECRAN.largeur, height: hauteur, scale: 1 } });
  writeFileSync(path.join(captures, fichier), Buffer.from(data, "base64"));
  copyFileSync(path.join(captures, fichier), path.join(publicSite, fichier));
  console.log(`${fichier} : ${ECRAN.largeur} × ${hauteur} points`);
  return hauteur;
};

// 1. Page d'accueil
await ouvrir(SITE);
await figer();
console.log(`bandeau : texte à ${await figerBandeau()} points du bord`);
await evaluer(`(() => {
  document.querySelector(".hero-carousel-track").style.transform = "translateX(-${(DIAPO - 1) * 100}%)";
  document.querySelectorAll(".hero-dot").forEach((d, i) => d.classList.toggle("active", i === ${DIAPO - 1}));
  return true;
})()`);
await attendre(800);
const accueil = {
  fichier: "site-mobile/accueil.png",
  diapo: DIAPO,
  mascotte: await position(`document.querySelector(".hero-section")`),
  bandeau: await position(`document.querySelector(".ticker")`),
  titreProduits: await position(visible(".home-section-header", "(e) => /produits/i.test(e.textContent)")),
  carte: await position(`document.querySelector('img[alt="FRANCE MEHOMIES BOXY TEE"]')?.closest("a")`),
  photo: await position(`document.querySelector('img[alt="FRANCE MEHOMIES BOXY TEE"]')`),
};
accueil.hauteur = await capturer("accueil.png");

// 2. Page produit, avant et après le choix de la taille
await ouvrir(PRODUIT);
await figer();
const bouton = visible("button", "(e) => /taille|panier/i.test(e.textContent)");
const taille = visible("button", `(e) => e.textContent.trim() === ${JSON.stringify(TAILLE)}`);
const produit = {
  fichier: "site-mobile/produit.png",
  fichierTaille: "site-mobile/produit_taille-m.png",
  taille: TAILLE,
  photo: await position(`document.querySelector('img[alt="FRANCE MEHOMIES BOXY TEE"]')`),
  titre: await position(`document.querySelector("h1")`),
  tailles: await position(visible("button", "(e) => e.textContent.trim() === 'XS'") + "?.parentElement"),
  boutonTaille: await position(taille),
  bouton: await position(bouton),
  texteBouton: await evaluer(`${bouton}?.textContent.trim()`),
};
produit.hauteur = await capturer("produit.png");
await evaluer(`${taille}.click()`);
await attendre(1500);
produit.texteBoutonTaille = await evaluer(`${bouton}?.textContent.trim()`);
produit.boutonApresTaille = await position(bouton);
await capturer("produit_taille-m.png");

const positions = {
  _comment: "Captures de mehomies.com en version mobile (scripts/capturer_site.mjs) : rectangles en points de page, 1 point = 3 px de capture.",
  date: new Date().toISOString(),
  ecran: ECRAN,
  accueil,
  produit,
};
writeFileSync(path.join(captures, "positions.json"), JSON.stringify(positions, null, 1));
mkdirSync(path.join(REMOTION, "src", "motion", "donnees"), { recursive: true });
copyFileSync(path.join(captures, "positions.json"), path.join(REMOTION, "src", "motion", "donnees", "site-mobile.json"));
console.log(JSON.stringify(positions, null, 1));

ws.close();
chrome.kill();
await attendre(500);
rmSync(profil, { recursive: true, force: true });
