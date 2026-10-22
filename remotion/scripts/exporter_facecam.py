"""Export du face cam seul, pour un montage manuel : coupes du découpage, voix, rien d'autre.

Usage : python3 scripts/exporter_facecam.py ../a_monter/1 v1

Lit <dossier vidéo>/transcription/decoupage.json et public/<id>/rush.mp4 (voix à -14 LUFS),
et écrit dans <dossier vidéo>/export/ :
  <nom>_facecam-voix.mp4  face cam coupé (silences, reprises et faux départs retirés), voix seule :
                          ni sous-titres, ni images, ni fond_1, ni zoom, ni musique, ni bruitage
  <nom>_derushage.edl     les mêmes coupes en EDL (CMX 3600) sur le rush d'origine, avec son code
                          temporel : à importer dans DaVinci Resolve pour ajuster chaque coupe
Un seul encodage, directement depuis le rush (sans passer par Remotion) ; couleur inchangée.
"""

import json
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

VIDEO = Path(sys.argv[1]).resolve()
VID = sys.argv[2]
REMOTION = Path(__file__).resolve().parent.parent
dec = json.loads((VIDEO / "transcription" / "decoupage.json").read_text())
fps = dec["fps"]
segments = dec["segments"]
rush_origine = VIDEO / dec["source"].split("/")[-1]
rush = REMOTION / "public" / VID / "rush.mp4"
FONDU = 2 / fps  # fondu du son à chaque coupe (évite les clics), comme dans le montage Remotion


def slug(nom):
    nom = unicodedata.normalize("NFKD", unicodedata.normalize("NFC", nom)).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", nom.lower()).strip("-")


nom = slug(rush_origine.stem)
export = VIDEO / "export"
export.mkdir(exist_ok=True)
sortie = export / f"{nom}_facecam-voix.mp4"

# 1. Vidéo : trim + concat, un seul encodage
filtres = []
for k, s in enumerate(segments):
    a, b = s["sourceDebutFrame"], s["sourceFinFrame"]
    d = (b - a) / fps
    filtres.append(f"[0:v]trim=start_frame={a}:end_frame={b},setpts=PTS-STARTPTS[v{k}]")
    filtres.append(f"[0:a]asetpts=PTS-STARTPTS,atrim=start={a / fps}:end={b / fps},asetpts=PTS-STARTPTS,"
                   f"afade=t=in:st=0:d={FONDU},afade=t=out:st={d - FONDU}:d={FONDU}[a{k}]")
filtres.append("".join(f"[v{k}][a{k}]" for k in range(len(segments))) + f"concat=n={len(segments)}:v=1:a=1[v][a]")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(rush), "-filter_complex", ";".join(filtres),
                "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-g", "30",
                "-pix_fmt", "yuv420p", "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
                "-color_range", "tv", "-c:a", "aac", "-b:a", "320k", "-ar", "48000", "-movflags", "+faststart",
                str(sortie)], check=True)

# 2. EDL CMX 3600 sur le rush d'origine
tc = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format_tags=timecode:stream_tags=timecode",
                     "-of", "default=nw=1:nk=1", str(rush_origine)], capture_output=True, text=True).stdout.split()
h, m, s_, f = (int(x) for x in (tc[0] if tc else "00:00:00:00").replace(";", ":").split(":"))
depart = ((h * 60 + m) * 60 + s_) * fps + f


def code(frames):
    return f"{frames // (3600 * fps):02d}:{frames // (60 * fps) % 60:02d}:{frames // fps % 60:02d}:{frames % fps:02d}"


lignes = [f"TITLE: {nom} derushage", "FCM: NON-DROP FRAME", ""]
enregistrement = 3600 * fps  # timeline à 01:00:00:00
for k, s in enumerate(segments, 1):
    a, b = s["sourceDebutFrame"], s["sourceFinFrame"]
    lignes.append(f"{k:03d}  AX       AA/V  C        {code(depart + a)} {code(depart + b)} "
                  f"{code(enregistrement)} {code(enregistrement + b - a)}")
    lignes.append(f"* FROM CLIP NAME: {rush_origine.name}")
    lignes.append(f"* SEGMENT {s['id']} : phrase {s['phrase']}")
    lignes.append("")
    enregistrement += b - a
(export / f"{nom}_derushage.edl").write_text("\n".join(lignes))
print(f"{sortie.name} et {nom}_derushage.edl écrits ({len(segments)} coupes, {sum(s['dureeFrames'] for s in segments)} images, "
      f"code temporel du rush {tc[0] if tc else 'absent'})")
