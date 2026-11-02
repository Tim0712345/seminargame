# -*- coding: utf-8 -*-
"""
werkzeuge/netz.py – Abstandsfeld → Dreiecksnetz
--------------------------------------------------------------------
Rasterabtastung, Marching Cubes (scikit-image) und Vereinfachung
(fast-simplification, Quadrik-Fehler). Nur zum Erzeugen der Netze.
"""
import numpy as np
from skimage.measure import marching_cubes
import fast_simplification


def abtasten(fn, lo, hi, h, block=1_500_000):
    lo = np.asarray(lo, float)
    hi = np.asarray(hi, float)
    n = np.ceil((hi - lo) / h).astype(int) + 1
    xs = lo[0] + np.arange(n[0]) * h
    ys = lo[1] + np.arange(n[1]) * h
    zs = lo[2] + np.arange(n[2]) * h
    D = np.empty((n[0], n[1], n[2]), np.float32)
    # Scheibenweise entlang x, damit der Speicher klein bleibt
    schritt = max(1, block // (n[1] * n[2]))
    Y, Z = np.meshgrid(ys, zs, indexing="ij")
    for i0 in range(0, n[0], schritt):
        i1 = min(n[0], i0 + schritt)
        X = xs[i0:i1][:, None, None] * np.ones((1, n[1], n[2]))
        P = np.stack([X.ravel(), np.broadcast_to(Y, X.shape).ravel(), np.broadcast_to(Z, X.shape).ravel()], axis=1)
        D[i0:i1] = fn(P).reshape(i1 - i0, n[1], n[2])
    return D, lo


def polygonisieren(fn, lo, hi, h):
    D, lo = abtasten(fn, lo, hi, h)
    v, f, _, _ = marching_cubes(D, 0.0, spacing=(h, h, h))
    v = v + lo
    f = f.astype(np.int64)
    # Ausrichtung prüfen: Flächennormale soll nach außen (Richtung wachsender Abstand) zeigen
    a, b, c = v[f[:, 0]], v[f[:, 1]], v[f[:, 2]]
    fn_n = np.cross(b - a, c - a)
    m = (a + b + c) / 3
    e = 1e-4
    g = np.stack([(fn(m + [e, 0, 0]) - fn(m - [e, 0, 0])), (fn(m + [0, e, 0]) - fn(m - [0, e, 0])),
                  (fn(m + [0, 0, e]) - fn(m - [0, 0, e]))], axis=1)
    if np.mean(np.sum(fn_n * g, axis=1)) < 0:
        f = f[:, [0, 2, 1]]
    return v, f


def vereinfachen(v, f, ziel_dreiecke):
    if len(f) <= ziel_dreiecke:
        return v, f
    red = 1.0 - ziel_dreiecke / len(f)
    v2, f2 = fast_simplification.simplify(v.astype(np.float32), f.astype(np.int32), target_reduction=red, agg=7)
    return v2.astype(float), f2.astype(np.int64)


def normalen(v, f):
    n = np.zeros_like(v)
    a, b, c = v[f[:, 0]], v[f[:, 1]], v[f[:, 2]]
    fn_ = np.cross(b - a, c - a)
    for k in range(3):
        np.add.at(n, f[:, k], fn_)
    l = np.linalg.norm(n, axis=1)
    return n / np.maximum(l, 1e-12)[:, None]


def aufraeumen(v, f):
    """Unbenutzte Punkte entfernen, kleine abgetrennte Inseln verwerfen."""
    benutzt = np.unique(f)
    neu = -np.ones(len(v), np.int64)
    neu[benutzt] = np.arange(len(benutzt))
    v = v[benutzt]
    f = neu[f]
    # Zusammenhangskomponenten (Union-Find über Kanten)
    eltern = np.arange(len(v))

    def wurzel(i):
        while eltern[i] != i:
            eltern[i] = eltern[eltern[i]]
            i = eltern[i]
        return i
    for a, b, c in f:
        ra, rb, rc = wurzel(a), wurzel(b), wurzel(c)
        eltern[rb] = ra
        eltern[wurzel(rc)] = ra
    w = np.array([wurzel(i) for i in range(len(v))])
    werte, anz = np.unique(w, return_counts=True)
    behalten = set(werte[anz >= max(30, 0.002 * len(v))])
    ok = np.array([w[a] in behalten for a in f[:, 0]])
    f = f[ok]
    benutzt = np.unique(f)
    neu = -np.ones(len(v), np.int64)
    neu[benutzt] = np.arange(len(benutzt))
    return v[benutzt], neu[f]


def taubin(v, f, schritte=8, lam=0.5, mu=-0.53, gewicht=None):
    """Glättet ein Netz ohne es schrumpfen zu lassen (Taubin λ/μ). Entfernt kleine Kanten aus dem Abstandsfeld.
    gewicht: je Punkt 0..1 (0 = nicht glätten, z. B. an Lidern und Lippen)."""
    if schritte <= 0:
        return v
    gw = np.ones(len(v)) if gewicht is None else gewicht
    n = len(v)
    kanten = np.concatenate([f[:, [0, 1]], f[:, [1, 2]], f[:, [2, 0]]])
    kanten = np.concatenate([kanten, kanten[:, ::-1]])
    anz = np.bincount(kanten[:, 0], minlength=n).astype(float)
    anz = np.maximum(anz, 1)
    v = v.copy()
    for _ in range(schritte):
        for faktor in (lam, mu):
            summe = np.zeros_like(v)
            np.add.at(summe, kanten[:, 0], v[kanten[:, 1]])
            v = v + (faktor * gw)[:, None] * (summe / anz[:, None] - v)
    return v
