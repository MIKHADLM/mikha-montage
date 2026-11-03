// Détoure le sujet de chaque image d'un dossier (masque de premier plan de macOS Vision, macOS 14 ou
// plus) et écrit des PNG transparents de même nom. Sert au titre qui passe derrière la tête.
//   swift scripts/detourer.swift <dossier des images> <dossier de sortie>
import AppKit
import CoreImage
import Vision

let args = CommandLine.arguments
guard args.count == 3 else {
  print("usage : swift detourer.swift <entrée> <sortie>")
  exit(1)
}
let entree = URL(fileURLWithPath: args[1])
let sortie = URL(fileURLWithPath: args[2])
try FileManager.default.createDirectory(at: sortie, withIntermediateDirectories: true)

let contexte = CIContext()
let images = try FileManager.default.contentsOfDirectory(at: entree, includingPropertiesForKeys: nil)
  .filter { $0.pathExtension.lowercased() == "png" }
  .sorted { $0.lastPathComponent < $1.lastPathComponent }

for url in images {
  let requete = VNGenerateForegroundInstanceMaskRequest()
  let gestionnaire = VNImageRequestHandler(url: url)
  try gestionnaire.perform([requete])
  let cible = sortie.appendingPathComponent(url.lastPathComponent)
  guard let resultat = requete.results?.first else {
    // Aucun sujet trouvé : image transparente de même taille, le titre reste entier
    print("aucun sujet : \(url.lastPathComponent)")
    if let source = NSImage(contentsOf: url)?.representations.first,
      let vide = NSBitmapImageRep(
        bitmapDataPlanes: nil, pixelsWide: source.pixelsWide, pixelsHigh: source.pixelsHigh,
        bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
        colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0),
      let png = vide.representation(using: .png, properties: [:])
    {
      try png.write(to: cible)
    }
    continue
  }
  let tampon = try resultat.generateMaskedImage(
    ofInstances: resultat.allInstances, from: gestionnaire, croppedToInstancesExtent: false)
  let ci = CIImage(cvPixelBuffer: tampon)
  guard let cg = contexte.createCGImage(ci, from: ci.extent),
    let png = NSBitmapImageRep(cgImage: cg).representation(using: .png, properties: [:])
  else { continue }
  try png.write(to: cible)
}
print("\(images.count) images détourées dans \(sortie.path)")
