# -*- coding: utf-8 -*-
"""
werkzeuge/menschen.py – erzeugt js/welt/menschen_netze.js
--------------------------------------------------------------------
Aufruf (im Ordner werkzeuge, mit numpy, scipy, scikit-image, fast-simplification):
    python3 menschen.py            alle Teile
    python3 menschen.py kopf hemd_m   nur einzelne Teile neu (Rest bleibt)
Ablauf je Teil: Abstandsfeld abtasten → Marching Cubes → vereinfachen →
auf die Fläche zurückschieben → Formvarianten (gleiche Vernetzung, auf das
Feld der Variante geschoben) → Knochen-Gewichte → kompakt (base64) speichern.
Die Werte im Spiel (Farben, Frisur, Kleidung je Person) stehen in data/figuren.js.
"""
import sys, os, json, time, base64
import numpy as np
from sdf import gradient, projizieren, smin, smax, kugel, ellipsoid, rundkegel, kette, glatt, loft, box
import kopf, koerper, haare, netz

AUS = os.path.join(os.path.dirname(__file__), "..", "js", "welt", "menschen_netze.js")
ZWISCHEN = os.path.join(os.path.dirname(__file__), "zwischen.json")   # Zwischenstand (nicht ausgeliefert)
T = koerper.TRAGION
K = koerper.KNOCHEN
KI = {n: i for i, n in enumerate(K)}

# Formvarianten: Name → Änderung der Werte
MORPHS = {
    "w": None,                          # Geschlecht (Sonderfall: Grundform kann Mann oder Frau sein)
    "voll": {"fuelle": 1.0}, "schmal": {"fuelle": -1.0},
    "nase": {"nase": 1.0}, "kinn": {"kinn": 1.0}, "wangen": {"wangen": 1.0}, "lippen": {"lippen": 1.0}, "alter": {"alter": 1.0},
}


def beide(fn_l):
    """Linke Form und gespiegelte rechte Form vereinigen."""
    def f(P, p):
        a = fn_l(P, p)
        b = fn_l(koerper.spiegeln(P), p)
        return np.minimum(a, b)
    return f


def in_arm(P, p):
    M, g = koerper.bind_matrizen(p)
    return koerper.in_ruhe(P, M, g, "oberarmL"), g


def in_bein(P, p):
    M, g = koerper.bind_matrizen(p)
    return koerper.in_ruhe(P, M, g, "oberschenkelL"), g


def hand_l(P, p):
    Q, g = in_arm(P, p)
    return koerper.hand_sdf_ruhe(Q, p, g)


def bein_l(P, p):
    Q, g = in_bein(P, p)
    return np.maximum(koerper.bein_sdf_ruhe(Q, p, g, ab_knie=True), Q[:, 1] - 0.56)


def schuh_m_l(P, p):
    Q, g = in_bein(P, p)
    return koerper.schuh_sdf_ruhe(Q, p, g, damen=False)[0]


def schuh_w_l(P, p):
    Q, g = in_bein(P, p)
    return koerper.schuh_sdf_ruhe(Q, p, g, damen=True)[0]


def augen(P, p):
    q = kopf.werte(p)
    r = q["augR"] * q["s"]
    a = kugel(P - T, kopf.augen_mitte(p, 1), r)
    b = kugel(P - T, kopf.augen_mitte(p, -1), r)
    return np.minimum(a, b)


def hemd_teil(P, p, spitzen=True):
    """Hemd nur dort, wo es zu sehen ist: Ausschnitt und Kragen."""
    d = koerper.hemd_sdf(P, p, spitzen)
    sym = np.abs(P[:, 0])
    vorn = np.maximum(sym - 0.13, np.maximum(-P[:, 2] - 0.0, 0.98 - P[:, 1]))
    oben = 1.36 - P[:, 1]
    return np.maximum(d, np.minimum(vorn, oben))


def kopf_glatt_gewicht(V, p):
    """Gesicht kräftig glätten, aber Lider, Lippen, Nasenlöcher und Ohren schärfer lassen."""
    X = V - T
    q = kopf.werte(p)
    g = np.ones(len(V))
    for s_ in (1, -1):
        a = kopf.augen_mitte(p, s_)
        g = np.minimum(g, np.clip((np.linalg.norm(X - a, axis=1) - 0.012) / 0.01, 0.15, 1))
    s = q["s"]
    lippe = np.sqrt((X[:, 0] / (0.03 * s)) ** 2 + ((X[:, 1] + 0.055 * s) / (0.013 * s)) ** 2) - 1
    g = np.minimum(g, np.clip(lippe / 0.6 + 0.25, 0.25, 1) + (X[:, 2] < 0.06))
    nase = np.sqrt((X[:, 0] / (0.022 * s)) ** 2 + ((X[:, 1] + 0.03 * s) / (0.008 * s)) ** 2) - 1
    g = np.minimum(g, np.clip(nase / 0.8 + 0.3, 0.3, 1) + (X[:, 2] < 0.07))
    ohr = np.abs(np.abs(X[:, 0]) - 0.078 * s) < 0.014
    g = np.where(ohr & (np.abs(X[:, 1]) < 0.04) & (np.abs(X[:, 2] + 0.01) < 0.03), 0.35, g)
    return np.clip(g, 0, 1)


def schal(P, p):
    """Schal in Fraktionsfarbe: weich um den Hals gelegt, zwei schmale Enden fallen vorn herab."""
    w, fu = p.get("w", 0.0), p.get("fuelle", 0.0)
    hr = 0.059 - 0.009 * w + 0.006 * fu
    ring = []
    for i in range(17):
        a = i / 16 * 2 * np.pi
        ring.append((np.sin(a) * (hr + 0.026), 1.418 - 0.014 * np.cos(a) + 0.004 * np.sin(3 * a), -0.026 + np.cos(a) * (hr + 0.03)))
    d = kette(P, ring, [0.0145] * 17)
    jacke = koerper.rumpf_sdf(P, p, kleid=True) - 0.021
    for x0, laenge, kipp in ((0.045, 0.24, 0.05), (-0.035, 0.2, -0.04)):
        y = P[:, 1]
        t = np.clip((1.4 - y) / laenge, 0, 1)
        mitte = x0 + kipp * t
        breite = 0.024 + 0.004 * t
        falten = 0.0018 * np.sin((P[:, 0] - mitte) * 260)
        quer = np.abs(P[:, 0] - mitte) - breite
        laengs = np.maximum(y - 1.405, (1.4 - laenge) - y)
        flaeche = smax(jacke - 0.011 - falten, -(jacke + 0.001), 0.002)
        e = smax(np.maximum(quer, laengs), flaeche, 0.004)
        d = smin(d, e, 0.01)
    return d


def kopftuch(P, p):
    """Kopftuch: Hülle über Kopf und Hals, Gesicht frei, fällt über die Schultern."""
    X = P - T
    q = kopf.werte(p)
    k = kopf.kopf_sdf(X, p)
    d = k - 0.016
    d = smin(d, koerper.rumpf_sdf(P, p, kleid=True) - 0.028, 0.05)
    d = smax(d, 1.22 - P[:, 1], 0.01)
    # Gesicht frei (Oval von der Stirn bis unter das Kinn)
    s = q["s"]
    oval = ((X[:, 0] / (0.062 * s)) ** 2 + ((X[:, 1] - 0.0) / (0.088 * s)) ** 2) - 1.0
    gesicht = np.maximum(oval * 0.05, 0.02 - X[:, 2])
    d = smax(d, -gesicht, 0.006)
    # weiche Falten unten
    d = d + 0.0025 * np.sin(np.arctan2(X[:, 0], X[:, 2]) * 9) * glatt(1.4, 1.25, P[:, 1])
    return d


# ---------------------------------------------------------------------------
# Teile: Funktion, Bereich, Raster, Ziel-Dreiecke, Grundform (w), Formvarianten
# ---------------------------------------------------------------------------
def teile():
    """Teile mit Stücken. Ein Stück: fn, lo, hi (Bereich), anteil (an den Ziel-Dreiecken), zug (Knochenkette),
    paar (nur links rechnen, rechts gespiegelt)."""
    hk = lambda fn: (lambda P, p: fn(P - T, p))
    jacke = lambda art: (lambda P, p: koerper.jacke_sdf(P, p, art)[0])
    jschicht = lambda art: (lambda P, p: koerper.jacke_sdf(P, p, art)[1])
    aermel = lambda art: (lambda P, p: koerper.jacke_aermel_l(P, p, art))
    ARM = dict(lo=(0.09, 0.82, -0.12), hi=(0.29, 1.48, 0.11))
    HAND = dict(lo=(0.11, 0.6, -0.085), hi=(0.27, 0.93, 0.11))
    return {
        "kopf":      dict(glatt=22, glatt_gewicht=kopf_glatt_gewicht, fn=hk(kopf.kopf_sdf), lo=T + [-0.105, -0.215, -0.135], hi=T + [0.105, 0.155, 0.145], h=0.0017, ziel=13000, w0=0.0,
                          morphs=["voll", "schmal", "nase", "kinn", "wangen", "lippen", "alter"], lod=700, art="haut", zug="achse"),
        "kopf_w":    dict(glatt=22, glatt_gewicht=kopf_glatt_gewicht, fn=hk(kopf.kopf_sdf), lo=T + [-0.105, -0.215, -0.135], hi=T + [0.105, 0.155, 0.145], h=0.0017, ziel=13000, w0=1.0,
                          morphs=["voll", "schmal", "nase", "kinn", "wangen", "lippen", "alter"], lod=700, art="haut", zug="achse"),
        "augen":     dict(glatt=0, fn=augen, lo=T + [-0.05, -0.01, 0.045], hi=T + [0.05, 0.04, 0.1], h=0.0007, ziel=1200, w0=0.0, morphs=["w"], art="auge", zug="auge"),
        "brauen":    dict(glatt=3, fn=hk(haare.brauen_sdf), lo=T + [-0.065, 0.02, 0.05], hi=T + [0.065, 0.055, 0.105], h=0.0006, ziel=900, w0=0.0, morphs=[], art="haar", zug="achse"),
        "brauen_w":  dict(glatt=3, fn=hk(haare.brauen_sdf), lo=T + [-0.065, 0.02, 0.05], hi=T + [0.065, 0.055, 0.105], h=0.0006, ziel=900, w0=1.0, morphs=[], art="haar", zug="achse"),
        "haende":    dict(glatt=6, fn=hand_l, paar=True, h=0.0014, ziel=2600, w0=0.0, morphs=["w", "voll", "schmal"], lod=220, art="haut", zug="arm", **HAND),
        "beine":     dict(glatt=6, fn=bein_l, paar=True, lo=(0.0, 0.03, -0.12), hi=(0.2, 0.57, 0.12), h=0.004, ziel=900, w0=1.0, morphs=["voll", "schmal"], art="haut", zug="bein"),
        "sakko":     dict(glatt=5, stuecke=[dict(fn=jacke("sakko"), schicht=jschicht("sakko"), lo=(-0.27, 0.76, -0.19), hi=(0.27, 1.49, 0.19), anteil=0.68, zug="achse"),
                                   dict(fn=aermel("sakko"), paar=True, anteil=0.16, zug="arm", **ARM)],
                          h=0.003, ziel=8000, w0=0.0, morphs=["voll", "schmal"], lod=900, art="stoff"),
        "blazer":    dict(glatt=5, stuecke=[dict(fn=jacke("blazer"), schicht=jschicht("blazer"), lo=(-0.27, 0.84, -0.19), hi=(0.27, 1.49, 0.19), anteil=0.68, zug="achse"),
                                   dict(fn=aermel("blazer"), paar=True, anteil=0.16, zug="arm", **ARM)],
                          h=0.003, ziel=7500, w0=1.0, morphs=["w", "voll", "schmal"], lod=850, art="stoff"),
        "hemd":      dict(glatt=4, stuecke=[dict(fn=hemd_teil, lo=(-0.16, 0.96, -0.12), hi=(0.16, 1.48, 0.19), anteil=0.8, zug="achse"),
                                   dict(fn=koerper.manschette_l, paar=True, lo=(0.12, 0.82, -0.06), hi=(0.25, 0.94, 0.07), anteil=0.1, zug="arm")],
                          h=0.0026, ziel=3000, w0=0.0, morphs=["w", "voll", "schmal"], lod=300, art="stoff"),
        "bluse":     dict(glatt=4, stuecke=[dict(fn=lambda P, p: hemd_teil(P, p, False), lo=(-0.16, 0.96, -0.12), hi=(0.16, 1.48, 0.19), anteil=0.8, zug="achse"),
                                   dict(fn=koerper.manschette_l, paar=True, lo=(0.12, 0.82, -0.06), hi=(0.25, 0.94, 0.07), anteil=0.1, zug="arm")],
                          h=0.0026, ziel=3000, w0=1.0, morphs=["w", "voll", "schmal"], lod=300, art="stoff"),
        "krawatte":  dict(glatt=3, fn=koerper.krawatte_sdf, lo=(-0.06, 0.95, 0.0), hi=(0.06, 1.43, 0.19), h=0.0022, ziel=700, w0=0.0, morphs=["voll", "schmal"], art="stoff", zug="achse"),
        "pullover":  dict(glatt=5, stuecke=[dict(fn=koerper.pullover_sdf, lo=(-0.26, 0.84, -0.18), hi=(0.26, 1.49, 0.18), anteil=0.66, zug="achse"),
                                   dict(fn=koerper.pullover_aermel_l, paar=True, anteil=0.17, zug="arm", **ARM)],
                          h=0.0034, ziel=7000, w0=0.0, morphs=["w", "voll", "schmal"], lod=800, art="stoff"),
        "hose":      dict(glatt=6, fn=koerper.hose_sdf, lo=(-0.3, 0.0, -0.2), hi=(0.3, 1.06, 0.2), h=0.004, ziel=5000, w0=0.0, morphs=["w", "voll", "schmal"], lod=600, art="stoff", zug="auto"),
        "rock":      dict(glatt=6, fn=koerper.rock_sdf, lo=(-0.3, 0.45, -0.2), hi=(0.3, 1.07, 0.2), h=0.004, ziel=3200, w0=1.0, morphs=["voll", "schmal"], lod=350, art="stoff", zug="auto"),
        "schuhe_m":  dict(glatt=4, fn=schuh_m_l, paar=True, lo=(-0.01, -0.01, -0.12), hi=(0.2, 0.1, 0.27), h=0.0025, ziel=800, w0=0.0, morphs=[], lod=120, art="leder", zug="bein",
                          schicht=lambda P, p: (P[:, 1] < 0.011).astype(np.int32)),
        "schuhe_w":  dict(glatt=4, fn=schuh_w_l, paar=True, lo=(-0.01, -0.01, -0.12), hi=(0.2, 0.1, 0.25), h=0.0025, ziel=750, w0=1.0, morphs=[], lod=110, art="leder", zug="bein",
                          schicht=lambda P, p: (P[:, 1] < 0.012).astype(np.int32)),
        "schal":     dict(glatt=5, fn=schal, lo=(-0.14, 1.1, -0.14), hi=(0.14, 1.47, 0.21), h=0.0026, ziel=2400, w0=1.0, morphs=["w", "voll", "schmal"], art="stoff", zug="achse"),
        "kopftuch":  dict(glatt=8, fn=kopftuch, lo=(-0.24, 1.2, -0.2), hi=(0.24, 1.75, 0.2), h=0.004, ziel=5000, w0=1.0, morphs=["voll", "schmal"], art="stoff", zug="achse"),
        "haar_kurz":   dict(glatt=4, fn=hk(lambda X, p: haare.haar_sdf(X, p, "kurz")), lo=T + [-0.1, -0.08, -0.13], hi=T + [0.1, 0.16, 0.12], h=0.002, ziel=4000, w0=0.0, morphs=["w"], lod=300, art="haar", zug="achse"),
        "haar_kurz_w": dict(glatt=5, fn=hk(lambda X, p: haare.haar_sdf(X, p, "kurz_w")), lo=T + [-0.11, -0.08, -0.14], hi=T + [0.11, 0.17, 0.13], h=0.0022, ziel=4000, w0=1.0, morphs=["w"], lod=320, art="haar", zug="achse"),
        "haar_glatze": dict(glatt=4, fn=hk(lambda X, p: haare.haar_sdf(X, p, "glatze")), lo=T + [-0.1, -0.08, -0.13], hi=T + [0.1, 0.1, 0.1], h=0.002, ziel=2000, w0=0.0, morphs=[], art="haar", zug="achse"),
        "haar_dutt":   dict(glatt=5, fn=hk(lambda X, p: haare.haar_sdf(X, p, "dutt")), lo=T + [-0.1, -0.08, -0.16], hi=T + [0.1, 0.16, 0.12], h=0.0022, ziel=3800, w0=1.0, morphs=["w"], lod=350, art="haar", zug="achse"),
        "haar_zopf":   dict(glatt=5, fn=hk(lambda X, p: haare.haar_sdf(X, p, "zopf")), lo=T + [-0.1, -0.28, -0.17], hi=T + [0.1, 0.16, 0.12], h=0.0025, ziel=3800, w0=1.0, morphs=["w"], art="haar", zug="achse"),
        "haar_lang":   dict(glatt=6, fn=hk(lambda X, p: haare.haar_sdf(X, p, "lang")), lo=T + [-0.12, -0.27, -0.17], hi=T + [0.12, 0.17, 0.12], h=0.0026, ziel=4500, w0=1.0, morphs=["w"], lod=400, art="haar", zug="achse"),
        "haar_locken": dict(glatt=3, fn=hk(lambda X, p: haare.haar_sdf(X, p, "locken")), lo=T + [-0.13, -0.11, -0.16], hi=T + [0.13, 0.19, 0.14], h=0.0024, ziel=5000, w0=1.0, morphs=["w"], art="haar", zug="achse"),
    }


# ---------------------------------------------------------------------------
# Knochen-Gewichte
# ---------------------------------------------------------------------------
def gewichte(V, p, art, zwang=None):
    """Bis zu vier Knochen je Punkt. V in Bindehaltung. zwang: je Punkt "achse", "arm", "bein" oder "auto"."""
    M, g = koerper.bind_matrizen(p)
    n = len(V)
    W = np.zeros((n, len(K)))
    if art == "auge":
        links = V[:, 0] > 0
        W[links, KI["augeL"]] = 1
        W[~links, KI["augeR"]] = 1
        idx = np.argsort(-W, axis=1)[:, :4]
        return idx, np.take_along_axis(W, idx, axis=1)
    # Zugehörigkeit: Achse (Rumpf/Hals/Kopf), Arm L/R, Bein L/R
    d_achse = koerper.rumpf_sdf(V, p, kleid=True)
    d_achse = np.minimum(d_achse, kopf.kopf_sdf(V - T, p))
    teile_d = {"achse": d_achse}
    ruhe = {}
    for s, n_ in ((1, "L"), (-1, "R")):
        Pl = V if s == 1 else koerper.spiegeln(V)
        Qa = koerper.in_ruhe(Pl, M, g, "oberarmL")
        Qb = koerper.in_ruhe(Pl, M, g, "oberschenkelL")
        ruhe["arm" + n_] = Qa
        ruhe["bein" + n_] = Qb
        teile_d["arm" + n_] = np.minimum(koerper.arm_glatt_ruhe(Qa, p, g), koerper.hand_sdf_ruhe(Qa, p, g))
        teile_d["bein" + n_] = np.minimum(koerper.bein_glatt_ruhe(Qb, p, g), koerper.schuh_sdf_ruhe(Qb, p, g)[0])
    # Kleidung liegt außen: Abstände relativ vergleichen
    namen = list(teile_d.keys())
    D = np.stack([teile_d[k] for k in namen], axis=1)
    tau = 0.01
    E = np.exp(-(D - D.min(axis=1, keepdims=True)) / tau)
    Z = E / E.sum(axis=1, keepdims=True)
    if zwang is not None:
        zw = np.asarray(zwang)
        ia, iaL, iaR, ibL, ibR = [namen.index(k) for k in ("achse", "armL", "armR", "beinL", "beinR")]
        links = V[:, 0] > 0
        for code, nur in (("achse", [ia]), ("arm", [iaL, iaR]), ("bein", [ibL, ibR])):
            m = zw == code
            if not m.any():
                continue
            Z[m] = 0
            if code == "achse":
                Z[m, ia] = 1
            else:
                Z[m & links, nur[0]] = 1
                Z[m & ~links, nur[1]] = 1
    zug = {k: Z[:, i] for i, k in enumerate(namen)}
    # Achse: nach Höhe
    y = V[:, 1]
    yk = y.copy()
    kb = glatt(1.505, 1.56, yk)                      # Kopf
    hb = glatt(1.39, 1.45, yk) * (1 - kb)            # Hals
    bb = glatt(0.99, 1.13, yk) * (1 - kb - hb)       # Brust
    eb = 1 - kb - hb - bb                            # Becken
    for kn, ww in (("kopf", kb), ("hals", hb), ("brust", bb), ("becken", eb)):
        W[:, KI[kn]] += zug["achse"] * ww
    # Arme (in Ruhehaltung des Arms gerechnet)
    for n_ in ("L", "R"):
        Q = ruhe["arm" + n_]
        S, E_, H = g["oberarmL"], g["unterarmL"], g["handL"]
        z = zug["arm" + n_]
        an_schulter = glatt(S[1] + 0.03, S[1] - 0.05, Q[:, 1]) * glatt(S[0] - 0.06, S[0] - 0.01, Q[:, 0])
        ua = glatt(E_[1] + 0.03, E_[1] - 0.03, Q[:, 1])
        ha = glatt(H[1] + 0.012, H[1] - 0.018, Q[:, 1])
        # Finger: nächstgelegene Fingerkette
        Hs = (Q - H) / koerper.L(1.0, 0.9, p.get("w", 0.0))
        z1 = KI["zeige1" + n_]; z2 = KI["zeige2" + n_]; f1 = KI["finger1" + n_]; f2 = KI["finger2" + n_]; da = KI["daumen" + n_]
        d_zeige = kette(Hs, [(0, -0.092, 0.026), (-0.006, -0.133, 0.028), (-0.014, -0.17, 0.03)], [0.012, 0.011, 0.01])
        d_rest = np.minimum(kette(Hs, [(0, -0.096, 0.008), (-0.008, -0.139, 0.008), (-0.018, -0.18, 0.008)], [0.012, 0.011, 0.01]),
                            np.minimum(kette(Hs, [(0, -0.093, -0.011), (-0.008, -0.135, -0.011), (-0.017, -0.172, -0.011)], [0.012, 0.011, 0.01]),
                                       kette(Hs, [(0, -0.086, -0.028), (-0.007, -0.119, -0.029), (-0.014, -0.15, -0.03)], [0.011, 0.01, 0.009])))
        d_daumen = kette(Hs, [(-0.012, -0.035, 0.034), (-0.019, -0.052, 0.043), (-0.026, -0.078, 0.05), (-0.029, -0.099, 0.052)], [0.013, 0.012, 0.011, 0.01])
        d_teller = np.maximum(np.abs(Hs[:, 1] + 0.045) - 0.05, np.maximum(np.abs(Hs[:, 2]) - 0.045, np.abs(Hs[:, 0]) - 0.02))
        DF = np.stack([d_teller, d_zeige, d_rest, d_daumen], axis=1)
        EF = np.exp(-(DF - DF.min(axis=1, keepdims=True)) / 0.004)
        ZF = EF / EF.sum(axis=1, keepdims=True)
        tz = glatt(-0.128, -0.138, Hs[:, 1])   # zweites Glied
        tr = glatt(-0.132, -0.142, Hs[:, 1])
        ganz_hand = ha
        rest = 1 - an_schulter * 0
        w_ob = (1 - ua)
        w_ua = ua * (1 - ha)
        # Schulter: Übergang zur Brust
        W[:, KI["brust"]] += z * w_ob * (1 - glatt(0.0, 1.0, 1 - an_schulter)) * 0.0
        sch = 1 - glatt(S[1] - 0.005, S[1] - 0.07, Q[:, 1])      # oberhalb des Schultergelenks → Brust
        W[:, KI["brust"]] += z * w_ob * sch * 0.55
        W[:, KI["oberarm" + n_]] += z * w_ob * (1 - sch * 0.55)
        W[:, KI["unterarm" + n_]] += z * w_ua
        W[:, KI["hand" + n_]] += z * ganz_hand * ZF[:, 0]
        W[:, z1] += z * ganz_hand * ZF[:, 1] * (1 - tz)
        W[:, z2] += z * ganz_hand * ZF[:, 1] * tz
        W[:, f1] += z * ganz_hand * ZF[:, 2] * (1 - tr)
        W[:, f2] += z * ganz_hand * ZF[:, 2] * tr
        W[:, da] += z * ganz_hand * ZF[:, 3]
    # Beine
    for n_ in ("L", "R"):
        Q = ruhe["bein" + n_]
        Hj, Kn, A = g["oberschenkelL"], g["unterschenkelL"], g["fussL"]
        z = zug["bein" + n_]
        hu = 1 - glatt(Hj[1] + 0.04, Hj[1] - 0.1, Q[:, 1])       # nahe der Hüfte → Becken
        us = glatt(Kn[1] + 0.035, Kn[1] - 0.035, Q[:, 1])
        fu_ = glatt(A[1] + 0.01, A[1] - 0.03, Q[:, 1])
        W[:, KI["becken"]] += z * hu * 0.6 * (1 - us)
        W[:, KI["oberschenkel" + n_]] += z * (1 - us) * (1 - hu * 0.6)
        W[:, KI["unterschenkel" + n_]] += z * us * (1 - fu_)
        W[:, KI["fuss" + n_]] += z * us * fu_
    # höchstens vier Knochen
    idx = np.argsort(-W, axis=1)[:, :4]
    wv = np.take_along_axis(W, idx, axis=1)
    wv = wv / np.maximum(wv.sum(axis=1, keepdims=True), 1e-9)
    return idx, wv


# ---------------------------------------------------------------------------
# Netz eines Teils mit Formvarianten
# ---------------------------------------------------------------------------
def w_werte(teil, p):
    q = dict(p)
    q["w"] = teil["w0"]
    return q


def stueck_erzeugen(St, T_, p0, ziel):
    fn0 = lambda P: St["fn"](P, p0)
    from scipy.spatial import cKDTree
    v, f = netz.polygonisieren(fn0, St["lo"], St["hi"], T_["h"])
    v, f = netz.aufraeumen(v, f)
    roh = len(f)
    gew = St["glatt_gewicht"](v, p0) if St.get("glatt_gewicht") else (T_["glatt_gewicht"](v, p0) if T_.get("glatt_gewicht") else None)
    v = netz.taubin(v, f, St.get("glatt", T_.get("glatt", 6)), gewicht=gew)   # wie Ton glatt streichen
    n_fein, v_fein = netz.normalen(v, f), v
    v, f = netz.vereinfachen(v, f, ziel)
    _, nn = cKDTree(v_fein).query(v)
    nor = n_fein[nn]
    for _ in range(2):   # Normalen leicht mit den Nachbarn mitteln (weichere Übergänge zwischen großen Dreiecken)
        nor = glaetten_vek(nor, f)
    e = {"v": v, "f": f, "morph": {}, "mnor": {}, "roh": roh, "nor": nor}
    basis_proj = projizieren(fn0, v, 6) if T_["morphs"] else None
    for m in T_["morphs"]:
        p1 = dict(p0)
        richt = 1.0
        if m == "w":
            p1["w"] = 1.0 - T_["w0"]
            richt = 1.0 if T_["w0"] == 0 else -1.0                 # immer Richtung „mehr w“
        else:
            p1.update(MORPHS[m])
        fn1 = lambda P: St["fn"](P, p1)
        ziel_p = projizieren(fn1, v, 7)
        delta = (ziel_p - basis_proj) * richt
        dn = (feldnormale(fn1, ziel_p) - feldnormale(fn0, basis_proj)) * richt
        l = np.linalg.norm(delta, axis=1)
        bewegt = l[l > 2e-5]
        grenze = max(np.percentile(bewegt, 99) * 1.6, 1e-4) if len(bewegt) > 10 else 1e-4
        delta[l > grenze] *= (grenze / l[l > grenze])[:, None]
        dn[l > grenze] = 0
        e["morph"][m] = delta
        e["mnor"][m] = np.clip(dn, -1, 1)
    e["schicht"] = St["schicht"](v, p0).astype(np.int32) if St.get("schicht") else np.zeros(len(v), np.int32)
    e["ao"] = glaetten(verdeckung(fn0, v, max(3 * T_["h"], 0.004)), f)
    if St.get("paar"):
        n0 = len(v)
        sp = lambda a: a * np.array([-1.0, 1.0, 1.0])
        e["v"] = np.concatenate([v, sp(v)])
        e["f"] = np.concatenate([f, f[:, [0, 2, 1]] + n0])
        e["nor"] = np.concatenate([e["nor"], sp(e["nor"])])
        for m in e["morph"]:
            e["morph"][m] = np.concatenate([e["morph"][m], sp(e["morph"][m])])
            e["mnor"][m] = np.concatenate([e["mnor"][m], sp(e["mnor"][m])])
        e["schicht"] = np.concatenate([e["schicht"], e["schicht"]])
        e["ao"] = np.concatenate([e["ao"], e["ao"]])
    e["zug"] = np.array([St.get("zug", "auto")] * len(e["v"]))
    return e


def erzeuge(name, T_):
    t0 = time.time()
    p0 = w_werte(T_, {})
    stuecke = T_.get("stuecke") or [dict(fn=T_["fn"], lo=T_["lo"], hi=T_["hi"], anteil=1.0, zug=T_.get("zug", "auto"),
                                          paar=T_.get("paar", False), schicht=T_.get("schicht"))]
    teile_e = [stueck_erzeugen(St, T_, p0, max(60, int(T_["ziel"] * St.get("anteil", 1.0)))) for St in stuecke]
    # zusammenfügen
    v = np.concatenate([e["v"] for e in teile_e])
    f = np.concatenate([e["f"] + sum(len(x["v"]) for x in teile_e[:i]) for i, e in enumerate(teile_e)])
    erg = {"v": v, "f": f, "nor": np.concatenate([e["nor"] for e in teile_e]), "morph": {}, "mnor": {},
           "schicht": np.concatenate([e["schicht"] for e in teile_e]), "ao": np.concatenate([e["ao"] for e in teile_e]),
           "zug": np.concatenate([e["zug"] for e in teile_e])}
    roh = sum(e["roh"] for e in teile_e)
    for m in T_["morphs"]:
        d = np.concatenate([e["morph"][m] for e in teile_e])
        if np.max(np.linalg.norm(d, axis=1)) < 1.5e-4:
            continue
        erg["morph"][m] = d
        erg["mnor"][m] = np.concatenate([e["mnor"][m] for e in teile_e])
    erg["maske"] = np.zeros(len(v))
    if name in ("kopf", "kopf_w"):
        _, lip, _ = kopf.kopf_sdf(v - T, p0, masken=True)
        erg["maske"] = lip
        # Wimpernlinie am Oberlid (dunkler)
        q = kopf.werte(p0)
        for s_ in (1, -1):
            a = kopf.augen_mitte(p0, s_) + T
            rel = v - a
            u = rel[:, 0] * s_ / 0.0145
            nah = (np.abs(np.linalg.norm(rel, axis=1) - q["augR"] - 0.0022) < 0.0014) & (rel[:, 1] > 0.0016 - 0.0012 * u) & (np.abs(u) < 1.0) & (rel[:, 2] > 0.004)
            erg["schicht"][nah] = 1
    if name in ("brauen", "brauen_w"):
        erg["maske"] = haare.brauen_maske(v - T, p0)
    if name.startswith("haar_"):
        erg["maske"] = haare.haar_maske(v - T, p0, name[5:])
    if name == "augen":
        q = kopf.werte(p0)
        sch = np.zeros(len(v), np.int32)
        msk = np.zeros(len(v))
        for s_ in (1, -1):
            a = kopf.augen_mitte(p0, s_) + T
            rel = v - a
            seite = (rel[:, 0] * s_) > -0.02
            nz = rel[:, 2] / (q["augR"] * q["s"])
            sch = np.where(seite & (nz > 0.85), 1, sch)
            sch = np.where(seite & (nz > 0.972), 2, sch)
            msk = np.where(seite & (nz > 0.845), np.clip((nz - 0.85) / 0.122, 0, 1), msk)
            msk = np.where(seite & (nz <= 0.845), np.clip(nz, 0, 1) * 0.84, msk)      # Lederhaut: zur Seite dunkler
        erg["schicht"] = sch
        erg["maske"] = msk
    erg["kn"], erg["gw"] = gewichte(v, p0, T_["art"], erg["zug"])
    print("%-12s %7d → %6d Dreiecke, %5d Punkte, Varianten: %s  (%.0f s)" % (name, roh, len(f), len(v), ",".join(erg["morph"].keys()) or "-", time.time() - t0), flush=True)
    return erg


def feldnormale(fn, v):
    g = gradient(fn, v)
    return g / np.maximum(np.linalg.norm(g, axis=1, keepdims=True), 1e-9)


def oktaeder(n):
    """Normale → zwei Bytes (Oktaeder-Abbildung)."""
    n = n / np.maximum(np.sum(np.abs(n), axis=1, keepdims=True), 1e-9)
    x, y, z = n[:, 0], n[:, 1], n[:, 2]
    ox = np.where(z >= 0, x, (1 - np.abs(y)) * np.sign(x + 1e-12))
    oy = np.where(z >= 0, y, (1 - np.abs(x)) * np.sign(y + 1e-12))
    return np.clip(np.round(np.stack([ox, oy], axis=1) * 127), -127, 127).astype(np.int8)


def verdeckung(fn, v, schritt):
    """Umgebungsverdeckung je Punkt aus dem eigenen Abstandsfeld (Mulden, Fingerzwischenräume, Nasenlöcher).
    Das Feld ist keine exakte Abstandsfunktion; deshalb nur sanft und später über das Netz geglättet."""
    g = gradient(fn, v)
    n = g / np.maximum(np.linalg.norm(g, axis=1, keepdims=True), 1e-9)
    occ = np.zeros(len(v))
    for i in range(1, 6):
        h = schritt * i
        d = fn(v + n * h)
        occ += np.clip((h - d) / h, 0, 1) * (0.6 ** (i - 1))
    return np.clip(1 - occ * 0.45, 0.55, 1)


def glaetten_vek(n, f):
    kanten = np.concatenate([f[:, [0, 1]], f[:, [1, 2]], f[:, [2, 0]]])
    summe = np.zeros_like(n)
    np.add.at(summe, kanten[:, 0], n[kanten[:, 1]])
    np.add.at(summe, kanten[:, 1], n[kanten[:, 0]])
    m = 0.5 * n + 0.5 * summe / np.maximum(np.linalg.norm(summe, axis=1, keepdims=True), 1e-9)
    return m / np.maximum(np.linalg.norm(m, axis=1, keepdims=True), 1e-9)


def glaetten(werte, f, schritte=8):
    """Werte je Punkt über die Nachbarn im Netz glätten."""
    n = len(werte)
    nb_summe = np.zeros(n)
    anz = np.zeros(n)
    kanten = np.concatenate([f[:, [0, 1]], f[:, [1, 2]], f[:, [2, 0]]])
    w = werte.copy()
    for _ in range(schritte):
        nb_summe[:] = 0
        anz[:] = 0
        np.add.at(nb_summe, kanten[:, 0], w[kanten[:, 1]])
        np.add.at(nb_summe, kanten[:, 1], w[kanten[:, 0]])
        np.add.at(anz, kanten[:, 0], 1)
        np.add.at(anz, kanten[:, 1], 1)
        w = 0.4 * w + 0.6 * nb_summe / np.maximum(anz, 1)
    return w


def lod(name, T_, e, ziel):
    """Grobe Fassung für Menschenmengen: vereinfachen, Werte vom nächsten Punkt des feinen Netzes."""
    from scipy.spatial import cKDTree
    v, f = netz.vereinfachen(e["v"], e["f"], ziel)
    _, i = cKDTree(e["v"]).query(v)
    erg = {"v": v, "f": f, "morph": {}, "mnor": {}, "nor": e["nor"][i], "schicht": e["schicht"][i], "maske": e["maske"][i] * 0,
           "kn": e["kn"][i], "gw": e["gw"][i], "ao": e["ao"][i]}
    print("%-12s grob: %6d Dreiecke" % (name, len(f)), flush=True)
    return erg


# ---------------------------------------------------------------------------
# Ausgabe: alle Felder als ein komprimierter Block (raw deflate), base64
# ---------------------------------------------------------------------------
def b64(a):
    return base64.b64encode(np.ascontiguousarray(a).tobytes()).decode("ascii")


def packen(name, T_, e):
    v, f = e["v"], e["f"]
    lo = v.min(axis=0)
    hi = v.max(axis=0)
    sk = np.maximum(hi - lo, 1e-6) / 65535.0
    q = np.round((v - lo) / sk).astype(np.uint16)
    d = {"n": int(len(v)), "d": int(len(f)), "w0": T_["w0"], "art": T_["art"],
         "lo": [round(float(x), 6) for x in lo], "sk": [float("%.9g" % x) for x in sk],
         "pos": b64(q), "idx": b64(f.astype(np.uint16)),
         "kn": b64(e["kn"].astype(np.uint8)), "gw": b64(np.round(e["gw"] * 255).astype(np.uint8)),
         "schicht": b64(e["schicht"].astype(np.uint8)), "maske": b64(np.round(np.clip(e["maske"], 0, 1) * 255).astype(np.uint8)),
         "ao": b64(np.round(np.clip(e["ao"], 0, 1) * 255).astype(np.uint8)),
         "nor": b64(oktaeder(e["nor"])),
         "morph": {}}
    for m, delta in e["morph"].items():
        mx = float(np.max(np.abs(delta)))
        s = mx / 127.0
        d["morph"][m] = {"s": float("%.7g" % s), "p": b64(np.round(delta / s).astype(np.int8)),
                         "n": b64(np.clip(np.round(e["mnor"][m] * 127), -127, 127).astype(np.int8))}
    return d


def schreiben(daten):
    p_m = {"w": 0.0}
    p_w = {"w": 1.0}
    gm = koerper.gelenke(p_m)
    gw = koerper.gelenke(p_w)
    kopf_info = {"tragion": T.tolist(), "augeR": kopf.werte(p_m)["augR"], "s_w": kopf.werte(p_w)["s"]}
    import zlib
    teile_aus = {}
    blob = bytearray()

    def ablegen(text):
        roh = base64.b64decode(text)
        while len(blob) % 4:
            blob.append(0)
        o = len(blob)
        blob.extend(roh)
        return [o, len(roh)]
    for name, d in daten.items():
        t = {k: d[k] for k in ("n", "d", "w0", "art", "lo", "sk")}
        for feld in ("pos", "idx", "kn", "gw", "schicht", "maske", "ao", "nor"):
            t[feld] = ablegen(d[feld])
        t["morph"] = {m: {"s": md["s"], "p": ablegen(md["p"]), "n": ablegen(md["n"])} for m, md in d["morph"].items()}
        teile_aus[name] = t
    z = zlib.compressobj(9, zlib.DEFLATED, -15)
    gepackt = z.compress(bytes(blob)) + z.flush()
    js = {
        "groesse": len(blob), "block": base64.b64encode(gepackt).decode("ascii"),
        "knochen": K, "eltern": [K.index(koerper.ELTERN[n]) if koerper.ELTERN[n] else -1 for n in K],
        "gelenke_m": [[round(float(x), 5) for x in gm[n]] for n in K],
        "gelenke_w": [[round(float(x), 5) for x in gw[n]] for n in K],
        "bind": {"oberarmL": koerper.ARM_WINKEL, "oberarmR": -koerper.ARM_WINKEL, "oberschenkelL": koerper.BEIN_WINKEL, "oberschenkelR": -koerper.BEIN_WINKEL},
        "kopf": kopf_info,
        "teile": teile_aus,
    }
    print("Rohdaten", len(blob) // 1024, "KB, gepackt", len(gepackt) // 1024, "KB")
    kopfzeile = ("/* =====================================================================\n"
                 "   js/welt/menschen_netze.js – AUTOMATISCH ERZEUGT, nicht von Hand ändern\n"
                 "   ---------------------------------------------------------------------\n"
                 "   Erzeugt mit werkzeuge/menschen.py (eigene Modelle aus Abstandsfeldern).\n"
                 "   Enthält die Netze für Köpfe, Hände, Kleidung und Frisuren in Bindehaltung,\n"
                 "   Formvarianten (Geschlecht, Körperbau, Gesichtszüge) und Knochen-Gewichte.\n"
                 "   Farben und die Zuordnung zu den Personen stehen in data/figuren.js.\n"
                 "   ===================================================================== */\n")
    with open(AUS, "w") as fh:
        fh.write(kopfzeile)
        fh.write("var WELT = window.WELT || {};\nWELT.menschenDaten = ")
        fh.write(json.dumps(js, separators=(",", ":")))
        fh.write(";\n")
    print("geschrieben:", AUS, round(os.path.getsize(AUS) / 1024), "KB")


if __name__ == "__main__":
    alle = teile()
    namen = sys.argv[1:] or list(alle.keys())
    daten = {}
    if os.path.exists(ZWISCHEN):
        daten = json.load(open(ZWISCHEN))
    for n in namen:
        e = erzeuge(n, alle[n])
        daten[n] = packen(n, alle[n], e)
        if alle[n].get("lod"):
            daten[n + "_lo"] = packen(n + "_lo", alle[n], lod(n, alle[n], e, alle[n]["lod"]))
        json.dump(daten, open(ZWISCHEN, "w"))
    reihe = []
    for k in alle:
        reihe += [k, k + "_lo"]
    daten = {k: daten[k] for k in reihe if k in daten}
    schreiben(daten)
