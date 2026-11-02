# -*- coding: utf-8 -*-
"""
werkzeuge/haare.py – Frisuren und Augenbrauen als Abstandsfelder
--------------------------------------------------------------------
Koordinaten wie kopf.py (Ursprung zwischen den Ohren). Die Frisur liegt als
Hülle über der Kopfform; der Haaransatz ist eine Linie rund um den Kopf.
Frisuren: kurz, kurz_w, dutt, lang, locken, zopf, glatze
"""
import numpy as np
from sdf import kugel, ellipsoid, rundkegel, kapsel, box, smin, smax, glatt, loft, kette, rot_x, rot_y, rot_z
import kopf


def ansatz(X, art):
    """Höhe des Haaransatzes je Richtung um den Kopf (φ = 0 vorn, ±π hinten)."""
    phi = np.abs(np.arctan2(X[:, 0], X[:, 2] + 0.01))
    if art in ("lang", "locken", "kurz_w"):
        tab = [(0.0, 0.074), (0.45, 0.07), (0.85, 0.048), (1.15, 0.03), (1.45, 0.012), (1.7, 0.0), (2.1, -0.02), (2.6, -0.05), (np.pi, -0.06)]
    elif art in ("dutt", "zopf"):
        tab = [(0.0, 0.078), (0.45, 0.073), (0.85, 0.05), (1.15, 0.032), (1.4, 0.018), (1.55, 0.04), (1.95, 0.04), (2.2, 0.0), (2.6, -0.045), (np.pi, -0.058)]
    else:
        # kurz (Mann), glatze: Koteletten vor dem Ohr, Bogen über dem Ohr
        tab = [(0.0, 0.08), (0.45, 0.072), (0.8, 0.05), (1.1, 0.034), (1.3, 0.024), (1.42, -0.008), (1.52, -0.008), (1.6, 0.04),
               (1.95, 0.042), (2.2, 0.005), (2.6, -0.04), (np.pi, -0.052)]
    t = np.array(tab)
    return np.interp(phi, t[:, 0], t[:, 1])


def straehnen(X, staerke, n=46, krone=(0.0, 0.1, -0.055)):
    """Feine Rillen entlang der Haarrichtung (vom Wirbel aus), leicht unregelmäßig."""
    rel = X - np.asarray(krone)
    phi = np.arctan2(rel[:, 0], rel[:, 2])
    r = np.sqrt(rel[:, 0] ** 2 + rel[:, 2] ** 2)
    unruhe = 0.7 * np.sin(X[:, 1] * 80 + phi * 3) + 0.4 * np.sin(phi * 7 + X[:, 2] * 60)
    return staerke * np.sin(phi * n + unruhe) * glatt(0.01, 0.04, r)


def haar_sdf(P, p, art):
    q = kopf.werte(p)
    s = q["s"]
    X = P / s
    k = kopf.kopf_sdf(P, p) / s          # Abstand zur Haut (in Kopfmaß)
    y0 = ansatz(X, art)
    ueber = X[:, 1] - y0                 # > 0: oberhalb des Ansatzes
    rand = glatt(-0.002, 0.016, ueber)
    oben = glatt(0.04, 0.12, X[:, 1])
    hinten = glatt(0.0, -0.08, X[:, 2])
    vorn = glatt(0.02, 0.08, X[:, 2])
    sym = X.copy()
    sym[:, 0] = np.abs(sym[:, 0])

    if art == "kurz":
        dicke = (0.0028 + 0.0045 * oben + 0.0035 * vorn * oben) * rand + 0.0005
        d = k - dicke + straehnen(X, 0.0006) * rand
        d = smax(d, -ueber, 0.006)
    elif art == "glatze":
        dicke = 0.0028 * rand + 0.0005
        d = k - dicke
        d = smax(d, -ueber, 0.006)
        d = smax(d, X[:, 1] - (0.062 - 0.02 * glatt(-0.02, -0.1, X[:, 2])), 0.006)   # oben kahl
    elif art == "kurz_w":
        dicke = (0.006 + 0.008 * oben + 0.004 * vorn * oben) * rand + 0.001
        d = k - dicke + straehnen(X, 0.0008, 40) * rand
        # Pony schräg in die Stirn
        pony = ellipsoid(X, (0.012, 0.072, 0.078), (0.05, 0.022, 0.016), rot_z(14))
        d = smin(d, smax(pony, -(k - 0.0005), 0.002), 0.008)
        d = smax(d, -ueber, 0.006)
        d = smax(d, -(X[:, 1] + 0.055), 0.004)
    elif art == "dutt":
        dicke = (0.0045 + 0.002 * oben) * rand + 0.0008
        d = k - dicke + straehnen(X, 0.0006, 52, (0.0, 0.07, -0.1)) * rand
        d = smax(d, -ueber, 0.006)
        dutt = ellipsoid(X, (0, 0.07, -0.108), (0.038, 0.033, 0.031), rot_x(-35))
        w = np.arctan2(X[:, 0], X[:, 1] - 0.07)
        dutt = dutt + 0.0012 * np.sin(w * 7 + (X[:, 2] + 0.1) * 160)
        d = smin(d, dutt, 0.012)
    elif art == "zopf":
        dicke = (0.0045 + 0.002 * oben) * rand + 0.0008
        d = k - dicke
        d = smax(d, -ueber, 0.006)
        pkt = [(0, 0.03, -0.112), (0, -0.02, -0.128), (0, -0.08, -0.136), (0, -0.14, -0.136), (0, -0.2, -0.132), (0, -0.25, -0.128)]
        zopf = kette(X, pkt, [0.024, 0.021, 0.019, 0.017, 0.015, 0.011])
        zopf = zopf + 0.0018 * np.sin(X[:, 1] * 200 + np.sign(X[:, 0]) * 1.6)
        d = smin(d, zopf, 0.012)
        d = smin(d, ellipsoid(X, (0, 0.035, -0.11), (0.016, 0.012, 0.01)), 0.006)   # Haargummi-Bereich
    elif art == "lang":
        dicke = (0.008 + 0.005 * oben) * rand + 0.001
        d = k - dicke
        d = smax(d, -ueber, 0.006)
        # Haare fallen über den Rücken (auf der Jacke)
        schnitte = [(0.06, 0.07, -0.02, -0.112, 2.0, 2.0), (0.0, 0.078, -0.06, -0.122, 2.2, 2.0), (-0.07, 0.083, -0.09, -0.13, 2.4, 2.0),
                    (-0.14, 0.092, -0.108, -0.14, 2.6, 2.2), (-0.2, 0.098, -0.118, -0.146, 2.6, 2.2), (-0.245, 0.085, -0.124, -0.144, 2.2, 2.0)]
        ruecken = loft(X, schnitte, 0.004)
        d = smin(d, ruecken, 0.02)
        # Strähnen neben dem Gesicht bis zum Kinn
        seite = kette(sym, [(0.068, 0.045, 0.03), (0.076, 0.0, 0.03), (0.078, -0.06, 0.012), (0.076, -0.11, -0.005)], [0.012, 0.014, 0.013, 0.008])
        d = smin(d, seite, 0.02)
        d = smax(d, -(k + 0.0005), 0.003)      # nie ins Gesicht hinein
        welle = 0.0013 * np.sin(np.arctan2(X[:, 0], X[:, 2]) * 46 + X[:, 1] * 30)
        d = d + welle * glatt(0.06, 0.0, X[:, 1])
    elif art == "locken":
        dicke = (0.02 + 0.012 * oben) * rand + 0.003
        d = k - dicke
        d = smax(d, -ueber, 0.006)
        d = smax(d, -(X[:, 1] + 0.075 - 0.02 * vorn), 0.01)
        a = 2 * np.pi / 0.017
        lock = np.sin(a * X[:, 0] + 1.3) * np.sin(a * X[:, 1]) * np.sin(a * X[:, 2] + 0.7)
        d = d + 0.0035 * lock
        d = smax(d, -(k + 0.001), 0.003)
    else:
        raise ValueError(art)
    return d * s


def brauen_sdf(P, p):
    """Augenbrauen: dünne Schicht über der Haut entlang eines Bogens."""
    q = kopf.werte(p)
    s = q["s"]
    w = q["w"]
    X = P / s
    sym = X.copy()
    sym[:, 0] = np.abs(sym[:, 0])
    # Bogen in x/y, nach außen dünner
    xs = np.array([0.011, 0.02, 0.032, 0.045, 0.056])
    ys = np.array([0.031, 0.036, 0.0405, 0.0405, 0.035]) + (np.array([0, 0.0005, 0.002, 0.002, 0.001]) * w)
    dk = np.array([0.0036, 0.0038, 0.003, 0.0022, 0.001]) * (1 - 0.3 * w)
    u = np.clip((sym[:, 0] - xs[0]) / (xs[-1] - xs[0]), 0, 1)
    yb = np.interp(sym[:, 0], xs, ys)
    db = np.interp(sym[:, 0], xs, dk)
    band = np.maximum(np.abs(sym[:, 1] - yb) - db, np.maximum(xs[0] - sym[:, 0], sym[:, 0] - xs[-1]))
    band = np.maximum(band, 0.05 - sym[:, 2])
    k = kopf.kopf_sdf(P, p) / s
    innen = np.clip(-band / 0.0018, 0, 1)
    d = k - (0.00012 + 0.00028 * innen)
    d = np.maximum(d, band)
    return d * s


def haar_maske(X, p, art):
    """1 = volles Haar, zum Haaransatz hin 0 (dort wird zur Hautfarbe gemischt)."""
    q = kopf.werte(p)
    Y = X / q["s"]
    if art in ("kurz", "glatze", "kurz_w", "dutt", "zopf", "lang", "locken"):
        ueber = Y[:, 1] - ansatz(Y, art)
        m = glatt(-0.001, 0.012 if art in ("kurz", "glatze") else 0.009, ueber)
        if art == "glatze":
            m = m * glatt(0.064, 0.05, Y[:, 1] + 0.02 * glatt(-0.02, -0.1, Y[:, 2]))
        return 0.25 + 0.75 * m
    return np.ones(len(X))


def brauen_maske(X, p):
    q = kopf.werte(p)
    Y = X / q["s"]
    sym = Y.copy()
    sym[:, 0] = np.abs(sym[:, 0])
    xs = np.array([0.011, 0.02, 0.032, 0.045, 0.056])
    ys = np.array([0.031, 0.036, 0.0405, 0.0405, 0.035]) + (np.array([0, 0.0005, 0.002, 0.002, 0.001]) * q["w"])
    dk = np.array([0.0042, 0.0045, 0.0036, 0.0027, 0.0012]) * (1 - 0.3 * q["w"])
    yb = np.interp(sym[:, 0], xs, ys)
    db = np.interp(sym[:, 0], xs, dk)
    rand = np.minimum(db - np.abs(sym[:, 1] - yb), np.minimum(sym[:, 0] - xs[0], xs[-1] - sym[:, 0]))
    return np.clip(rand / 0.0016, 0, 1) ** 0.8
