# -*- coding: utf-8 -*-
"""
werkzeuge/sdf.py – Abstandsfelder (SDF) für die Menschen-Modelle
--------------------------------------------------------------------
Grundkörper als vorzeichenbehaftete Abstandsfunktionen (negativ = innen),
weiche Vereinigung (smin) und weiches Abziehen (smax).
Alle Funktionen arbeiten mit vielen Punkten auf einmal (numpy, Form (N, 3)).
Nur ein Werkzeug zum Erzeugen der Netze – wird nicht mit dem Spiel ausgeliefert
(die fertigen Netze stehen in js/welt/menschen_netze.js).
"""
import numpy as np


def laenge(v):
    return np.sqrt(np.sum(v * v, axis=-1))


def kugel(P, c, r):
    return laenge(P - np.asarray(c, float)) - r


def ellipsoid(P, c, r, achsen=None):
    """Ellipsoid (Näherung nach I. Quilez). achsen: 3x3, Spalten = lokale Achsen in Weltkoordinaten."""
    q = P - np.asarray(c, float)
    if achsen is not None:
        q = q @ np.asarray(achsen, float)
    r = np.asarray(r, float)
    q = q / r
    k0 = laenge(q)
    k1 = laenge(q / r)
    return k0 * (k0 - 1.0) / np.maximum(k1, 1e-12)


def rundkegel(P, a, b, r1, r2):
    """Abgerundeter Kegel von a (Radius r1) nach b (Radius r2), exakt (I. Quilez)."""
    a = np.asarray(a, float)
    b = np.asarray(b, float)
    ba = b - a
    l2 = ba @ ba
    rr = r1 - r2
    a2 = l2 - rr * rr
    il2 = 1.0 / l2
    pa = P - a
    y = pa @ ba
    z = y - l2
    x = pa * l2 - y[:, None] * ba
    x2 = np.sum(x * x, axis=1)
    y2 = y * y * l2
    z2 = z * z * l2
    k = np.sign(rr) * rr * rr * x2
    d1 = np.sqrt(x2 + z2) * il2 - r2
    d2 = np.sqrt(x2 + y2) * il2 - r1
    d3 = (np.sqrt(np.maximum(x2 * a2 * il2, 0)) + y * rr) * il2 - r1
    return np.where(np.sign(z) * a2 * z2 > k, d1, np.where(np.sign(y) * a2 * y2 < k, d2, d3))


def kapsel(P, a, b, r):
    a = np.asarray(a, float)
    b = np.asarray(b, float)
    pa = P - a
    ba = b - a
    h = np.clip((pa @ ba) / (ba @ ba), 0, 1)
    return laenge(pa - h[:, None] * ba) - r


def flach_kegel(P, a, b, r1, r2, flach, achse):
    """Rundkegel mit elliptischem Querschnitt: 'flach' < 1 drückt quer zur Achse 'achse' zusammen."""
    a = np.asarray(a, float)
    achse = np.asarray(achse, float)
    achse = achse / np.linalg.norm(achse)
    q = P - a
    t = q @ achse
    q2 = q + (1.0 / flach - 1.0) * t[:, None] * achse
    return rundkegel(q2 + a, a, b, r1, r2) * flach


def box(P, c, h, r=0.0, achsen=None):
    q = P - np.asarray(c, float)
    if achsen is not None:
        q = q @ np.asarray(achsen, float)
    q = np.abs(q) - (np.asarray(h, float) - r)
    return laenge(np.maximum(q, 0)) + np.minimum(np.max(q, axis=1), 0) - r


def smin(a, b, k):
    if k <= 0:
        return np.minimum(a, b)
    h = np.maximum(k - np.abs(a - b), 0) / k
    return np.minimum(a, b) - h * h * k * 0.25


def smax(a, b, k):
    return -smin(-a, -b, k)


def mischung(a, b, k):
    """Anteil von b an einer weichen Vereinigung smin(a, b, k): 0 = nur a, 1 = nur b."""
    if k <= 0:
        return (b < a).astype(float)
    return np.clip(0.5 + 0.5 * (a - b) / k, 0, 1)


def glatt(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def rot_x(g):
    a = np.radians(g)
    c, s = np.cos(a), np.sin(a)
    return np.array([[1, 0, 0], [0, c, -s], [0, s, c]], float)


def rot_y(g):
    a = np.radians(g)
    c, s = np.cos(a), np.sin(a)
    return np.array([[c, 0, s], [0, 1, 0], [-s, 0, c]], float)


def rot_z(g):
    a = np.radians(g)
    c, s = np.cos(a), np.sin(a)
    return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]], float)


def gradient(fn, P, h=2e-4):
    g = np.zeros_like(P)
    for i in range(3):
        d = np.zeros(3)
        d[i] = h
        g[:, i] = (fn(P + d) - fn(P - d)) / (2 * h)
    return g


def projizieren(fn, P, schritte=6):
    """Punkte auf die Nullfläche von fn schieben (für Formvarianten mit gleicher Vernetzung)."""
    Q = P.copy()
    for _ in range(schritte):
        d = fn(Q)
        g = gradient(fn, Q)
        gl = np.maximum(np.sum(g * g, axis=1), 1e-8)
        Q = Q - (d / gl)[:, None] * g
    return Q


def loft(P, schnitte, rundung=0.004):
    """Körper aus waagerechten Querschnitten (für Gesicht und Rumpf).
    schnitte: Liste von (y, halbe Breite, vorn z, hinten z, Exponent vorn, Exponent hinten).
    Zwischen den Schnitten wird weich (monoton kubisch) interpoliert. Querschnitt:
    vorn und hinten je eine Superellipse (Exponent 2 = Ellipse, größer = kantiger)."""
    from scipy.interpolate import PchipInterpolator
    S = np.array(sorted(schnitte, key=lambda s: s[0]), float)
    ys = S[:, 0]
    y = np.clip(P[:, 1], ys[0], ys[-1])
    a = PchipInterpolator(ys, S[:, 1])(y)
    f = PchipInterpolator(ys, S[:, 2])(y)
    b = PchipInterpolator(ys, S[:, 3])(y)
    nf = PchipInterpolator(ys, S[:, 4])(y)
    nb = PchipInterpolator(ys, S[:, 5])(y)
    z0 = 0.5 * (f + b)
    r = np.maximum(0.5 * (f - b), 1e-4)
    a = np.maximum(a, 1e-4)
    u = np.abs(P[:, 0]) / a
    v = (P[:, 2] - z0) / r
    e = np.where(v > 0, nf, nb)
    s = (u ** e + np.abs(v) ** e) ** (1.0 / e)
    d2 = (s - 1.0) * np.minimum(a, r)
    dy = np.maximum(P[:, 1] - ys[-1], ys[0] - P[:, 1])
    return np.sqrt(np.maximum(d2, 0) ** 2 + np.maximum(dy, 0) ** 2) + np.minimum(np.maximum(d2, dy), 0) - rundung


def kette(P, punkte, radien):
    """Weiche Kette aus Rundkegeln durch die Punkte (Radien je Punkt)."""
    d = None
    for i in range(len(punkte) - 1):
        e = rundkegel(P, punkte[i], punkte[i + 1], radien[i], radien[i + 1])
        d = e if d is None else np.minimum(d, e)
    return d
