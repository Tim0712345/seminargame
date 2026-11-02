# -*- coding: utf-8 -*-
"""werkzeuge/lod_neu.py – nur die groben Fassungen (*_lo) für Menschenmengen weiter vereinfachen,
ohne alles neu zu erzeugen. Aufruf: python3 lod_neu.py"""
import json, base64
import numpy as np
from scipy.spatial import cKDTree
import menschen, netz

ZIEL = {"kopf_lo": 300, "kopf_w_lo": 300, "haende_lo": 90, "sakko_lo": 450, "blazer_lo": 420, "pullover_lo": 400,
        "hemd_lo": 110, "bluse_lo": 110, "hose_lo": 320, "rock_lo": 200, "schuhe_m_lo": 60, "schuhe_w_lo": 60,
        "haar_kurz_lo": 150, "haar_kurz_w_lo": 160, "haar_dutt_lo": 170, "haar_lang_lo": 200}
daten = json.load(open(menschen.ZWISCHEN))
alle = menschen.teile()
for name, ziel in ZIEL.items():
    if name not in daten:
        continue
    d = daten[name]
    roh = lambda k, dt: np.frombuffer(base64.b64decode(d[k]), dt)
    n = d["n"]
    v = roh("pos", np.uint16).reshape(n, 3) * np.array(d["sk"]) + np.array(d["lo"])
    f = roh("idx", np.uint16).reshape(-1, 3).astype(np.int64)
    if len(f) <= ziel:
        continue
    oc = roh("nor", np.int8).reshape(n, 2) / 127.0
    e = {"v": v, "f": f, "kn": roh("kn", np.uint8).reshape(n, 4), "gw": roh("gw", np.uint8).reshape(n, 4) / 255.0,
         "schicht": roh("schicht", np.uint8), "maske": roh("maske", np.uint8) / 255.0, "ao": roh("ao", np.uint8) / 255.0}
    v2, f2 = netz.vereinfachen(v, f, ziel)
    _, i = cKDTree(v).query(v2)
    # Normalen grob aus dem neuen Netz
    nor = netz.normalen(v2, f2)
    erg = {"v": v2, "f": f2, "morph": {}, "mnor": {}, "nor": nor, "schicht": e["schicht"][i], "maske": e["maske"][i],
           "kn": e["kn"][i], "gw": e["gw"][i], "ao": e["ao"][i]}
    daten[name] = menschen.packen(name, alle[name[:-3]], erg)
    print("%-14s %5d → %5d Dreiecke" % (name, len(f), len(f2)))
json.dump(daten, open(menschen.ZWISCHEN, "w"))
reihe = []
for k in alle:
    reihe += [k, k + "_lo"]
menschen.schreiben({k: daten[k] for k in reihe if k in daten})
