# -*- coding: utf-8 -*-
"""
werkzeuge/koerper.py – Körper, Hände, Beine und Kleidung als Abstandsfelder
--------------------------------------------------------------------
Weltkoordinaten der Grundfigur: Füße bei y = 0, Größe 1,70 m, Blick nach +z,
+x = linke Seite der Figur. Im Spiel wird jede Figur gleichmäßig auf ihre
Größe skaliert.
Bindehaltung = Ruhehaltung: Arme hängen, Beine gerade. Ärmel und Rumpf der
Kleidung sind getrennte, geschlossene Körper, die sich an der Schulter
überlappen (wie eine eingesetzte Ärmelnaht) – so entstehen beim Bewegen der
Arme keine gestreckten Flächen. Die Knochen verformen die Netze weich
(bis zu vier Knochen pro Punkt).
p: w (0 Mann … 1 Frau), fuelle (-1 schmal … 1 kräftig) und die Gesichtswerte (kopf.py).
"""
import numpy as np
from sdf import (kugel, ellipsoid, rundkegel, kapsel, box, smin, smax, glatt, loft, kette,
                 rot_x, rot_y, rot_z, laenge, flach_kegel)
import kopf

ARM_WINKEL = 0.0      # Bindehaltung = Ruhehaltung (Arme hängen). Ärmel sind eigene Teile, deshalb keine A-Haltung nötig
BEIN_WINKEL = 0.0
TRAGION = np.array([0.0, 1.574, 0.0])   # Ursprung des Kopfes (zwischen den Ohren)


def L(a, b, t):
    return a + (b - a) * t


# ---------------------------------------------------------------------------
# Skelett (Ruhehaltung: Arme hängen, Beine gerade). Gelenke in Weltkoordinaten.
# ---------------------------------------------------------------------------
KNOCHEN = ["becken", "brust", "hals", "kopf",
           "oberarmL", "unterarmL", "handL", "daumenL", "zeige1L", "zeige2L", "finger1L", "finger2L",
           "oberarmR", "unterarmR", "handR", "daumenR", "zeige1R", "zeige2R", "finger1R", "finger2R",
           "oberschenkelL", "unterschenkelL", "fussL", "oberschenkelR", "unterschenkelR", "fussR",
           "augeL", "augeR"]
ELTERN = {"becken": None, "brust": "becken", "hals": "brust", "kopf": "hals",
          "oberarmL": "brust", "unterarmL": "oberarmL", "handL": "unterarmL", "daumenL": "handL",
          "zeige1L": "handL", "zeige2L": "zeige1L", "finger1L": "handL", "finger2L": "finger1L",
          "oberarmR": "brust", "unterarmR": "oberarmR", "handR": "unterarmR", "daumenR": "handR",
          "zeige1R": "handR", "zeige2R": "zeige1R", "finger1R": "handR", "finger2R": "finger1R",
          "oberschenkelL": "becken", "unterschenkelL": "oberschenkelL", "fussL": "unterschenkelL",
          "oberschenkelR": "becken", "unterschenkelR": "oberschenkelR", "fussR": "unterschenkelR",
          "augeL": "kopf", "augeR": "kopf"}


def gelenke(p):
    """Gelenkpositionen in Ruhehaltung (Welt). Nur die linke Seite wird gerechnet, rechts gespiegelt."""
    w = p.get("w", 0.0)
    g = {}
    g["becken"] = np.array([0, 0.95, 0.0])
    g["brust"] = np.array([0, 1.06, -0.012])
    g["hals"] = np.array([0, 1.405, -0.03])
    g["kopf"] = np.array([0, 1.535, -0.014])
    sx = L(0.175, 0.162, w)
    g["oberarmL"] = np.array([sx, L(1.383, 1.37, w), -0.028])
    g["unterarmL"] = g["oberarmL"] + [0.006, -0.29, -0.004]
    g["handL"] = g["unterarmL"] + [0.004, -0.252, 0.012]
    h = g["handL"]
    hs = L(1.0, 0.9, w)
    g["daumenL"] = h + np.array([-0.008, -0.022, 0.028]) * hs
    g["zeige1L"] = h + np.array([-0.003, -0.092, 0.026]) * hs
    g["zeige2L"] = g["zeige1L"] + np.array([-0.006, -0.041, 0.002]) * hs
    g["finger1L"] = h + np.array([-0.002, -0.094, -0.008]) * hs
    g["finger2L"] = g["finger1L"] + np.array([-0.008, -0.043, -0.001]) * hs
    hx = L(0.089, 0.095, w)
    g["oberschenkelL"] = np.array([hx, 0.88, 0.0])
    g["unterschenkelL"] = g["oberschenkelL"] + [0.0, -0.41, 0.006]
    g["fussL"] = g["unterschenkelL"] + [0.0, -0.395, -0.016]
    a = kopf.augen_mitte(p, 1) + TRAGION
    g["augeL"] = a
    for n in list(g.keys()):
        if n.endswith("L"):
            r = g[n].copy()
            r[0] = -r[0]
            g[n[:-1] + "R"] = r
    return g


def bind_rotation(name):
    """Drehung des Knochens in der Bindehaltung relativ zur Ruhehaltung (lokal, Grad um z)."""
    if name == "oberarmL":
        return ARM_WINKEL
    if name == "oberarmR":
        return -ARM_WINKEL
    if name == "oberschenkelL":
        return BEIN_WINKEL
    if name == "oberschenkelR":
        return -BEIN_WINKEL
    return 0.0


def bind_matrizen(p):
    """4x4-Matrizen (Ruhe-lokal → Bindehaltung-Welt) je Knochen: Ruhe-Gelenk als Ursprung."""
    g = gelenke(p)
    M = {}
    for n in KNOCHEN:
        e = ELTERN[n]
        R = rot_z(bind_rotation(n))
        if e is None:
            W = np.eye(4)
            W[:3, 3] = g[n]
            M[n] = W
            continue
        # Lokale Verschiebung = Abstand zum Elterngelenk in Ruhehaltung
        lok = np.eye(4)
        lok[:3, :3] = R
        lok[:3, 3] = g[n] - g[e]
        M[n] = M[e] @ lok
    return M, g


def in_ruhe(P, M, g, name):
    """Punkte der Bindehaltung in die Ruhehaltung des Knochens zurückrechnen (für Arm- und Beinformen)."""
    W = M[name]
    q = (P - W[:3, 3]) @ W[:3, :3]
    return q + g[name]


# ---------------------------------------------------------------------------
# Rumpf
# ---------------------------------------------------------------------------
def rumpf_schnitte(p, kleid=False):
    w, fu = p.get("w", 0.0), p.get("fuelle", 0.0)
    bauch = 0.022 * max(fu, 0) + 0.006 * fu
    m = [(0.79, 0.095, 0.045, -0.06, 2.0, 2.0), (0.84, 0.15, 0.07, -0.095, 2.2, 2.2), (0.9, 0.163, 0.082, -0.105, 2.4, 2.3),
         (0.97, 0.155, 0.09 + 0.5 * bauch, -0.092, 2.4, 2.3), (1.04, 0.142, 0.098 + bauch, -0.078, 2.4, 2.4),
         (1.12, 0.145, 0.104 + 0.8 * bauch, -0.077, 2.5, 2.5), (1.2, 0.153, 0.11 + 0.3 * bauch, -0.086, 2.5, 2.5),
         (1.27, 0.163, 0.115, -0.095, 2.6, 2.6), (1.33, 0.168, 0.108, -0.1, 2.6, 2.6), (1.375, 0.158, 0.088, -0.098, 2.5, 2.5),
         (1.41, 0.115, 0.055, -0.083, 2.3, 2.3), (1.44, 0.064, 0.03, -0.072, 2.0, 2.0)]
    f = [(0.79, 0.1, 0.045, -0.062, 2.0, 2.0), (0.84, 0.162, 0.07, -0.105, 2.2, 2.2), (0.9, 0.176, 0.08, -0.112, 2.4, 2.3),
         (0.97, 0.16, 0.084 + 0.5 * bauch, -0.095, 2.4, 2.3), (1.04, 0.13, 0.088 + bauch, -0.074, 2.4, 2.4),
         (1.12, 0.128, 0.092 + 0.8 * bauch, -0.072, 2.5, 2.5), (1.2, 0.137, 0.098 + 0.3 * bauch, -0.08, 2.5, 2.5),
         (1.27, 0.146, 0.102, -0.087, 2.6, 2.6), (1.33, 0.152, 0.096, -0.09, 2.6, 2.6), (1.365, 0.145, 0.08, -0.09, 2.5, 2.5),
         (1.4, 0.108, 0.052, -0.078, 2.3, 2.3), (1.43, 0.058, 0.028, -0.066, 2.0, 2.0)]
    s = []
    for a, b in zip(m, f):
        x = L(np.array(a), np.array(b), w)
        k = 1 + 0.07 * fu if x[0] < 1.4 else 1 + 0.03 * fu
        s.append((x[0], x[1] * k, x[2] * (1 + 0.04 * fu), x[3] * (1 + 0.05 * fu), x[4], x[5]))
    return s


def rumpf_sdf(P, p, kleid=False):
    """Rumpf mit Schultern, Brust, Gesäß. kleid=True: glattere Form als Grundlage für Kleidung."""
    w, fu = p.get("w", 0.0), p.get("fuelle", 0.0)
    sym = P.copy()
    sym[:, 0] = np.abs(sym[:, 0])
    d = loft(P, rumpf_schnitte(p, kleid), 0.0)
    g = gelenke(p)
    sch = g["oberarmL"]
    # Trapez (Nacken zur Schulter) und Schulterkugel
    d = smin(d, kapsel(sym, (0.03, 1.425, -0.045), (sch[0] - 0.02, sch[1] + 0.025, sch[2] - 0.005), 0.034 + 0.004 * fu), 0.04)
    if kleid:
        d = smin(d, ellipsoid(sym, (sch[0] - 0.004, sch[1] - 0.012, sch[2] + 0.002), (0.042 + 0.004 * fu, 0.042, 0.047 + 0.004 * fu)), 0.035)
    else:
        d = smin(d, ellipsoid(sym, (sch[0] + 0.004, sch[1] - 0.004, sch[2] + 0.002), (0.05 + 0.005 * fu, 0.055, 0.055 + 0.004 * fu)), 0.035)
    # Schulterblätter
    d = smin(d, ellipsoid(sym, (0.075, 1.29, -0.085), (0.055, 0.075, 0.025)), 0.04)
    if w < 1:
        # Brustmuskel (Mann)
        k = (1 - w) * 0.03
        if k > 0.001:
            d = smin(d, ellipsoid(sym, (0.06, 1.275, 0.085), (0.07, 0.05, 0.035)), k)
    if w > 0:
        # Brust (Frau): bei Kleidung weicher, ohne Furche
        r = 0.052 * w + 0.006 * fu
        c = (0.072, 1.235, 0.088)
        if kleid:
            d = smin(d, ellipsoid(sym, c * np.array([0.6, 1, 1]), (0.105, r * 1.1, r * 0.95)), 0.04)
        else:
            d = smin(d, ellipsoid(sym, c, (r * 1.05, r, r * 0.95)), 0.03)
    # Gesäß
    d = smin(d, ellipsoid(sym, (0.07, 0.87, -0.068), (0.075 + 0.008 * w, 0.085, (0.058 if not kleid else 0.05) + 0.006 * w)), 0.04)
    if not kleid:
        # Bauchnabel und leichte Mittellinie
        d = smax(d, -kugel(P, (0, 1.03, 0.098 + 0.02 * max(fu, 0)), 0.006), 0.006)
    return d


# ---------------------------------------------------------------------------
# Arme und Hände (in Ruhehaltung des jeweiligen Knochens modelliert)
# ---------------------------------------------------------------------------
def arm_sdf_ruhe(Q, p, g, seite, nur_unterarm=False):
    """Q: Punkte in Ruhehaltung (Welt) der linken Seite (seite=1) bzw. gespiegelt."""
    w, fu = p.get("w", 0.0), p.get("fuelle", 0.0)
    k = 1 + 0.12 * fu
    S, E, H = g["oberarmL"], g["unterarmL"], g["handL"]
    d = 1e9 * np.ones(len(Q))
    if not nur_unterarm:
        d = rundkegel(Q, S + [0, -0.01, 0], E, L(0.047, 0.041, w) * k, L(0.035, 0.03, w) * k)
        d = smin(d, ellipsoid(Q, S + [0.008, -0.03, 0.004], (0.046 * k, 0.07, 0.048 * k)), 0.03)         # Deltamuskel
        d = smin(d, ellipsoid(Q, (S + E) / 2 + [0, 0.0, 0.014], (0.03 * k, 0.07, 0.028 * k)), 0.025)      # Bizeps
        d = smin(d, ellipsoid(Q, (S + E) / 2 + [0, 0.02, -0.016], (0.032 * k, 0.08, 0.026 * k)), 0.025)   # Trizeps
    # Unterarm: Ellbogen bis Handgelenk, Querschnitt flach (breit in z)
    ua = flach_kegel(Q, E, H + [0, 0.008, 0], L(0.038, 0.033, w) * k, L(0.024, 0.021, w) * (1 + 0.06 * fu), 0.72, (1, 0, 0))
    ua = smin(ua, ellipsoid(Q, E + [0.004, -0.06, 0.012], (0.03 * k, 0.065, 0.032 * k)), 0.03)          # Unterarmmuskeln
    ua = smin(ua, kugel(Q, E + [0.002, 0.008, -0.022], 0.018), 0.02)                                      # Ellbogen
    d = smin(d, ua, 0.03)
    return d


def hand_sdf_ruhe(Q, p, g):
    """Linke Hand in Ruhehaltung: Finger zeigen nach unten (-y), Handfläche nach innen (-x), Daumen vorn (+z)."""
    w = p.get("w", 0.0)
    hs = L(1.0, 0.9, w)
    H = g["handL"]
    X = (Q - H) / hs
    # Handteller als Querschnittskörper (y nach unten)
    teller = [(0.012, 0.0155, 0.026, -0.024, 2.4, 2.4), (-0.015, 0.0145, 0.034, -0.032, 3.0, 3.0),
              (-0.05, 0.0138, 0.041, -0.038, 3.2, 3.2), (-0.08, 0.0125, 0.043, -0.039, 3.0, 3.0),
              (-0.096, 0.0108, 0.041, -0.036, 2.4, 2.4)]
    Xt = X.copy()
    Xt[:, 0] = Xt[:, 0] + 0.002
    d = loft(Xt, teller, 0.003)
    d = smin(d, ellipsoid(X, (-0.01, -0.038, 0.022), (0.011, 0.026, 0.016)), 0.01)        # Daumenballen
    d = smin(d, ellipsoid(X, (-0.008, -0.05, -0.028), (0.009, 0.032, 0.012)), 0.01)       # Kleinfingerballen
    # Finger: (Grundgelenk z, y, Längen, Radius Basis, Radius Spitze, Spreizung)
    finger = [(0.026, -0.092, (0.041, 0.025, 0.021), 0.0093, 0.0074, 4),
              (0.008, -0.096, (0.045, 0.029, 0.022), 0.0096, 0.0077, 0),
              (-0.011, -0.093, (0.042, 0.027, 0.021), 0.009, 0.0072, -3),
              (-0.028, -0.086, (0.033, 0.021, 0.019), 0.0081, 0.0065, -8)]
    beuge = (10, 16, 9)
    alle = None
    for fz, fy, lg, r0, r1, spreiz in finger:
        pkt = [np.array([0.0, fy, fz])]
        rad = [r0]
        winkel = 0.0
        sp = np.radians(spreiz)
        for i, l in enumerate(lg):
            winkel += np.radians(beuge[i])
            richtung = np.array([-np.sin(winkel), -np.cos(winkel) * np.cos(sp), np.cos(winkel) * np.sin(sp)])
            pkt.append(pkt[-1] + richtung * l)
            rad.append(L(r0, r1, (i + 1) / 3.0))
        rad[-1] = r1 * 0.95
        Xf = X.copy()
        Xf[:, 0] = Xf[:, 0] * 1.12                       # Finger etwas flacher
        f = kette(Xf, pkt, rad) / 1.12
        f = smin(f, kugel(X, pkt[0] + [0.007, 0.002, 0], r0 * 0.95), 0.006)    # Knöchel
        alle = f if alle is None else smin(alle, f, 0.0015)
    d = smin(d, alle, 0.007)
    # Daumen
    dpkt = [np.array([-0.006, -0.02, 0.026]), np.array([-0.019, -0.052, 0.043]), np.array([-0.026, -0.078, 0.05]), np.array([-0.029, -0.099, 0.052])]
    daumen = kette(X, dpkt, [0.0125, 0.0108, 0.0098, 0.0082])
    d = smin(d, daumen, 0.01)
    # Handgelenk und Unterarm-Ende
    d = smin(d, flach_kegel(X, np.array([0.0, 0.07, 0.0]), np.array([0.0, 0.005, 0.0]), 0.027, 0.0235, 0.7, (1, 0, 0)), 0.012)
    return d * hs


# ---------------------------------------------------------------------------
# Beine
# ---------------------------------------------------------------------------
def bein_sdf_ruhe(Q, p, g, ab_knie=False):
    w, fu = p.get("w", 0.0), p.get("fuelle", 0.0)
    k = 1 + 0.1 * fu
    Hj, K, A = g["oberschenkelL"], g["unterschenkelL"], g["fussL"]
    d = 1e9 * np.ones(len(Q))
    if not ab_knie:
        d = rundkegel(Q, Hj + [0.004, 0.02, 0.0], K, L(0.083, 0.088, w) * k, L(0.052, 0.05, w) * k)
        d = smin(d, ellipsoid(Q, (Hj + K) / 2 + [0.004, 0.03, 0.026], (0.05 * k, 0.15, 0.04 * k)), 0.04)     # Oberschenkel vorn
        d = smin(d, ellipsoid(Q, Hj + [-0.035, -0.09, 0.0], (0.04 * k, 0.1, 0.05 * k)), 0.04)                 # Innenseite
    knie = smin(kugel(Q, K + [0, 0.01, 0.022], 0.035), kugel(Q, K + [0, 0.0, -0.005], 0.047 * k), 0.02)
    d = smin(d, knie, 0.03)
    # Unterschenkel mit Wade
    us = rundkegel(Q, K, A + [0, 0.02, 0], L(0.05, 0.046, w) * k, L(0.031, 0.028, w) * k)
    us = smin(us, ellipsoid(Q, K + [0.004, -0.11, -0.022], (0.043 * k, 0.09, 0.04 * k)), 0.04)
    d = smin(d, us, 0.03)
    d = smin(d, kugel(Q, A + [0.0, 0.0, -0.004], 0.033), 0.02)                                                # Knöchel
    # Fuß (wird von Schuhen verdeckt, nur für die Vollständigkeit)
    fuss = rundkegel(Q, A + [0, -0.035, -0.035], A + [0.005, -0.06, 0.15], 0.035, 0.03)
    d = smin(d, fuss, 0.03)
    return d


# ---------------------------------------------------------------------------
# Ganzer Körper (Bindehaltung)
# ---------------------------------------------------------------------------
def spiegeln(P):
    Q = P.copy()
    Q[:, 0] = -Q[:, 0]
    return Q


def koerper_sdf(P, p, teile=("rumpf", "kopf", "arme", "haende", "beine"), kleid=False):
    M, g = bind_matrizen(p)
    d = 1e9 * np.ones(len(P))
    if "rumpf" in teile:
        d = rumpf_sdf(P, p, kleid)
    if "kopf" in teile:
        d = smin(d, kopf.kopf_sdf(P - TRAGION, p), 0.03)
    for seite, n in ((1, "L"), (-1, "R")):
        Pl = P if seite == 1 else spiegeln(P)
        if "arme" in teile or "haende" in teile:
            Q = in_ruhe(Pl, M, g, "oberarmL")
            if "arme" in teile:
                a = arm_sdf_ruhe(Q, p, g, seite)
                d = smin(d, a, 0.035 if not kleid else 0.05)
            if "haende" in teile:
                d = smin(d, hand_sdf_ruhe(Q, p, g), 0.012)
        if "beine" in teile:
            Q = in_ruhe(Pl, M, g, "oberschenkelL")
            b = bein_sdf_ruhe(Q, p, g)
            d = smin(d, b, 0.04)
    return d


# ---------------------------------------------------------------------------
# Kleidung (Hüllen um eine geglättete Körperform)
# ---------------------------------------------------------------------------
def arm_glatt_ruhe(Q, p, g, dick=0.0):
    w, fu = p.get("w", 0.0), p.get("fuelle", 0.0)
    k = 1 + 0.12 * fu
    S, E, H = g["oberarmL"], g["unterarmL"], g["handL"]
    d = rundkegel(Q, S + [0.004, -0.02, 0], E, L(0.046, 0.041, w) * k + dick, L(0.036, 0.032, w) * k + dick)
    d = smin(d, rundkegel(Q, E, H + [0, 0.02, 0.0], L(0.036, 0.032, w) * k + dick, L(0.028, 0.025, w) * k + dick), 0.03)
    return d


def bein_glatt_ruhe(Q, p, g, dick=0.0, gerade=True):
    w, fu = p.get("w", 0.0), p.get("fuelle", 0.0)
    k = 1 + 0.1 * fu
    Hj, K, A = g["oberschenkelL"], g["unterschenkelL"], g["fussL"]
    d = rundkegel(Q, Hj + [0.006, 0.02, -0.004], K, L(0.088, 0.093, w) * k + dick, L(0.057, 0.055, w) * k + dick)
    unten = (0.056 if gerade else 0.04) * (1 + 0.06 * fu) + dick
    d = smin(d, rundkegel(Q, K, A + [0, -0.03, 0.006], L(0.057, 0.055, w) * k + dick, unten), 0.04)
    return d


def oberkoerper_glatt(P, p, M, g, dick, arme=False):
    d = rumpf_sdf(P, p, kleid=True) - dick
    if arme:
        for seite in (1, -1):
            Pl = P if seite == 1 else spiegeln(P)
            Q = in_ruhe(Pl, M, g, "oberarmL")
            d = smin(d, arm_glatt_ruhe(Q, p, g, dick), 0.03)
    return d


def aermel_l(P, p, dick, ende, rippe=0.0):
    """Linker Ärmel als geschlossene Röhre (Ruhehaltung) von der Schulter bis 'ende' über dem Handgelenk."""
    M, g = bind_matrizen(p)
    Q = in_ruhe(P, M, g, "oberarmL")
    S, H = g["oberarmL"], g["handL"]
    w, fu = p.get("w", 0.0), p.get("fuelle", 0.0)
    k = 1 + 0.12 * fu
    d = arm_glatt_ruhe(Q, p, g, dick)
    d = smin(d, ellipsoid(Q, S + [0.004, -0.03, 0.0], (L(0.046, 0.041, w) * k + dick, 0.065, L(0.048, 0.043, w) * k + dick)), 0.03)   # Ärmelkugel
    d = smax(d, (H[1] + ende) - Q[:, 1], 0.005)            # Ärmelende
    d = smax(d, (S[0] - 0.045) - Q[:, 0], 0.012)           # nicht in den Rumpf hinein
    d = smax(d, Q[:, 1] - (S[1] + 0.035), 0.014)           # oben abgerundet
    if rippe:
        d = d + rippe * np.sin(np.arctan2(Q[:, 0] - H[0], Q[:, 2] - H[2]) * 40) * (Q[:, 1] < H[1] + ende + 0.05)
    return d


def jacke_sdf(P, p, art="sakko"):
    """Rumpf von Sakko (Mann) oder Blazer (Frau), ohne Ärmel: V-Ausschnitt, Revers, Knöpfe, Taschen. Liefert (Abstand, Schicht)."""
    w, fu = p.get("w", 0.0), p.get("fuelle", 0.0)
    M, g = bind_matrizen(p)
    dick = 0.016 if art == "sakko" else 0.013
    d = oberkoerper_glatt(P, p, M, g, dick)
    sym = P.copy()
    sym[:, 0] = np.abs(sym[:, 0])
    S = g["oberarmL"]
    # gerade Schulterlinie vom Halsansatz zur Schulterspitze
    d = smin(d, kapsel(sym, (0.05, 1.432, -0.04), (S[0] + 0.01, S[1] + 0.03, S[2] - 0.004), 0.016 + dick * 0.6), 0.03)
    # Rücken fällt gerade vom Schulterblatt zum Saum
    rueck = loft(P, [(0.77, 0.158 * (1 + 0.07 * fu) + dick, 0.0, -0.118 - dick - 0.006 * fu, 2.4, 2.6),
                     (1.05, 0.15 * (1 + 0.07 * fu) + dick, 0.0, -0.096 - dick - 0.005 * fu, 2.4, 2.6),
                     (1.28, 0.16 * (1 + 0.07 * fu) + dick, 0.0, -0.1 - dick, 2.4, 2.6)], 0.0)
    d = smin(d, rueck, 0.03)
    saum = 0.775 if art == "sakko" else 0.86
    d = smax(d, saum - P[:, 1], 0.008)
    # Kragen hinten: nicht über den Hals hinaus
    d = smax(d, P[:, 1] - (1.462 - 0.03 * glatt(-0.02, 0.06, P[:, 2])), 0.006)
    # V-Ausschnitt vorn (nur bis kurz unter die Körperform, damit darunter das Hemd liegt)
    knopf = 1.03 if art == "sakko" else 1.06
    oben_y = 1.41
    breite = 0.012 + np.clip((P[:, 1] - knopf) / (oben_y - knopf), 0, 1.2) * 0.068
    vorn = P[:, 2] > 0.02
    v_aus = np.where(vorn & (P[:, 1] > knopf), np.abs(P[:, 0]) - breite, 1.0)
    innen_d = rumpf_sdf(P, p, kleid=True) + 0.004
    d = smax(d, -np.maximum(v_aus, -innen_d), 0.006)
    schicht = np.zeros(len(P), np.int32)
    # Revers: flache Klappe, die 2 mm über die V-Kante reicht (bildet die Kante selbst)
    rev_b = 0.042 + np.clip((P[:, 1] - knopf) / (oben_y - knopf), 0, 1) * 0.028
    innen = np.abs(P[:, 0]) - breite
    band = np.where(vorn & (P[:, 1] > knopf - 0.012), np.maximum(-(innen + 0.002), innen - rev_b), 1.0)
    band = np.maximum(band, P[:, 1] - (oben_y + 0.012))
    huelle = oberkoerper_glatt(P, p, M, g, dick + 0.0045)
    schale = np.maximum(huelle, -(rumpf_sdf(P, p, kleid=True) + 0.002))
    rv = smax(schale, band, 0.003)
    rv = smax(rv, -kugel(sym, (0.079, oben_y - 0.03, 0.085), 0.008), 0.002)     # Kerbe am Kragen
    d = smin(d, rv, 0.002)
    # Knöpfe
    for y in ([knopf - 0.005, knopf - 0.105] if art == "sakko" else [knopf - 0.005]):
        zf = vorderflaeche(p, y, dick)
        kn = ellipsoid(P, (0.0, y, zf + 0.002), (0.0085, 0.0085, 0.0035))
        schicht = np.where(kn < d, 3, schicht)
        d = np.minimum(d, kn)
    return d, schicht


def jacke_aermel_l(P, p, art="sakko"):
    dick = 0.016 if art == "sakko" else 0.013
    return aermel_l(P, p, dick, 0.03)


def vorderflaeche(p, y, dick):
    """z der Rumpf-Vorderseite in der Mitte bei Höhe y (für Knöpfe)."""
    zs = np.linspace(0.0, 0.25, 400)
    P = np.stack([np.zeros_like(zs), np.full_like(zs, y), zs], axis=1)
    d = rumpf_sdf(P, p, kleid=True) - dick
    i = np.argmin(np.abs(d))
    return zs[i]


def hemd_sdf(P, p, spitzen=True):
    """Hemd (mit Kragenspitzen) oder Bluse (runder, flacher Kragen) am Rumpf, sichtbar im V-Ausschnitt."""
    w = p.get("w", 0.0)
    g = gelenke(p)
    d = rumpf_sdf(P, p, kleid=True) - 0.005
    sym = P.copy()
    sym[:, 0] = np.abs(sym[:, 0])
    d = smax(d, 1.0 - P[:, 1], 0.004)
    # Kragen: Steg um den Hals, vorn tiefer, zwei flache Spitzen
    hr = L(0.059, 0.05, w) + 0.006 * p.get("fuelle", 0.0)
    kragen = rundkegel(P, (0, 1.39, -0.025), (0, 1.455, -0.022), hr + 0.012, hr + 0.007)
    kragen = smax(kragen, -rundkegel(P, (0, 1.37, -0.025), (0, 1.48, -0.022), hr + 0.003, hr - 0.002), 0.002)
    kragen = smax(kragen, P[:, 1] - (1.458 - 0.028 * glatt(0.0, 0.07, P[:, 2])), 0.003)
    if spitzen:
        spitze = box(sym, (0.03, 1.4, 0.07), (0.024, 0.026, 0.0035), 0.003, rot_z(-28) @ rot_x(-30))
        kragen = smin(kragen, spitze, 0.004)
    d = smin(d, kragen, 0.006)
    # Knopfleiste
    leiste = box(P, (0, 1.2, 0.0), (0.012, 0.22, 0.3), 0.002)
    zf = rumpf_sdf(P, p, kleid=True) - 0.0065
    d = smin(d, smax(leiste, zf, 0.001), 0.001)
    return d


def manschette_l(P, p):
    """Hemd-Manschette am linken Handgelenk (schaut unter dem Jackenärmel hervor)."""
    M, g = bind_matrizen(p)
    Q = in_ruhe(P, M, g, "oberarmL")
    H, E = g["handL"], g["unterarmL"]
    w = p.get("w", 0.0)
    d = flach_kegel(Q, H + [0, 0.09, 0.002], H + [0, 0.008, 0.004], L(0.033, 0.029, w) + 0.004, L(0.03, 0.027, w) + 0.004, 0.8, (1, 0, 0))
    d = smax(d, (H[1] + 0.012) - Q[:, 1], 0.003)
    d = smax(d, Q[:, 1] - (H[1] + 0.08), 0.003)
    return d


def krawatte_sdf(P, p):
    zf = rumpf_sdf(P, p, kleid=True) - 0.0055
    knoten = ellipsoid(P, (0, 1.402, vorderflaeche(p, 1.4, 0.005) + 0.004), (0.016, 0.013, 0.009))
    y = P[:, 1]
    b = 0.012 + glatt(1.39, 1.0, y) * 0.026
    blatt = np.maximum(np.abs(P[:, 0]) - b, np.maximum(y - 1.392, 0.97 - y - (b - np.abs(P[:, 0])) * 0.6))
    blatt = smax(blatt, zf - 0.0045, 0.001)
    blatt = smax(blatt, -zf, 0.001)
    return smin(knoten, blatt, 0.004)


def pullover_sdf(P, p):
    """Rumpf des Pullovers (ohne Ärmel) mit Bündchen und rundem Halsausschnitt."""
    M, g = bind_matrizen(p)
    d = oberkoerper_glatt(P, p, M, g, 0.011)
    sym = P.copy()
    sym[:, 0] = np.abs(sym[:, 0])
    S = g["oberarmL"]
    d = smin(d, kapsel(sym, (0.05, 1.43, -0.04), (S[0] + 0.005, S[1] + 0.025, S[2] - 0.004), 0.012), 0.03)
    d = smax(d, 0.87 - P[:, 1], 0.004)
    rippe = 0.0008 * np.sin(np.arctan2(P[:, 0], P[:, 2]) * 70) * (P[:, 1] < 0.92)
    d = d + rippe
    hr = 0.059 - 0.009 * p.get("w", 0.0) + 0.006 * p.get("fuelle", 0.0)
    d = smax(d, P[:, 1] - 1.455 + 0.02 * glatt(0.0, 0.07, P[:, 2]), 0.004)
    bund = rundkegel(P, (0, 1.405, -0.026), (0, 1.44, -0.024), hr + 0.016, hr + 0.012)
    bund = smax(bund, -rundkegel(P, (0, 1.38, -0.026), (0, 1.5, -0.024), hr + 0.003, hr + 0.002), 0.002)
    bund = smax(bund, P[:, 1] - (1.446 - 0.022 * glatt(0.0, 0.07, P[:, 2])), 0.002)
    d = smin(d, bund, 0.006)
    return d


def pullover_aermel_l(P, p):
    return aermel_l(P, p, 0.011, 0.018, rippe=0.0007)


def hose_sdf(P, p):
    M, g = bind_matrizen(p)
    w = p.get("w", 0.0)
    abstand = 0.004 + 0.008 * glatt(0.92, 0.8, P[:, 1])     # oben eng, unten weiter
    d = rumpf_sdf(P, p, kleid=True) - abstand
    d = smax(d, P[:, 1] - 1.0, 0.004)
    for seite in (1, -1):
        Pl = P if seite == 1 else spiegeln(P)
        Q = in_ruhe(Pl, M, g, "oberschenkelL")
        b = bein_glatt_ruhe(Q, p, g, 0.01)
        b = smax(b, Q[:, 1] - 0.84, 0.04)                                              # oben in die Hüfte übergehen
        b = smax(b, 0.045 - Q[:, 1] - 0.012 * glatt(-0.02, 0.08, Q[:, 2]), 0.003)    # Saum, hinten tiefer
        # Bügelfalte vorn
        b = b - 0.0012 * np.clip(1 - np.abs(Q[:, 0] - g["oberschenkelL"][0]) / 0.008, 0, 1) * (Q[:, 2] > 0) * (Q[:, 1] < 0.8)
        d = smin(d, b, 0.03)
    # Schritt sauber trennen
    return d


def rock_sdf(P, p):
    M, g = bind_matrizen(p)
    w, fu = p.get("w", 0.0), p.get("fuelle", 0.0)
    oben = rumpf_sdf(P, p, kleid=True) - 0.01
    oben = smax(oben, P[:, 1] - 1.05, 0.004)
    hx = g["oberschenkelL"][0]
    k = 1 + 0.07 * fu
    schnitte = [(0.47, 0.17 * k, 0.085, -0.115, 2.4, 2.4), (0.62, 0.178 * k, 0.088, -0.122, 2.4, 2.4),
                (0.78, 0.18 * k, 0.088, -0.128, 2.4, 2.4), (0.88, 0.183 * k, 0.09, -0.125, 2.4, 2.4)]
    unten = loft(P, schnitte, 0.0)
    d = smin(oben, unten, 0.05)
    d = smax(d, 0.475 - P[:, 1], 0.003)
    return d


def schuh_sdf_ruhe(Q, p, g, damen=False):
    """Schuh am linken Fuß (Ruhehaltung). Liefert (Abstand, Schicht: 0 Oberleder, 1 Sohle)."""
    A = g["fussL"]
    X = Q - A
    s = 0.93 if damen else 1.0
    X = X / s
    # Leisten als Querschnitte entlang z (Achsen tauschen: z wird zur Längsachse)
    Z = np.stack([X[:, 0], X[:, 2], X[:, 1]], axis=1)
    if damen:
        schnitte = [(-0.06, 0.03, -0.035, -0.07, 2.2, 2.2), (-0.035, 0.033, -0.01, -0.072, 2.4, 2.4), (0.0, 0.034, -0.01, -0.074, 2.6, 2.6),
                    (0.05, 0.038, -0.03, -0.075, 2.8, 2.8), (0.1, 0.043, -0.042, -0.075, 3.0, 3.0), (0.15, 0.041, -0.05, -0.074, 3.0, 3.0),
                    (0.185, 0.032, -0.055, -0.072, 2.6, 2.6), (0.205, 0.014, -0.059, -0.07, 2.2, 2.2)]
    else:
        schnitte = [(-0.065, 0.032, -0.03, -0.075, 2.2, 2.2), (-0.04, 0.037, 0.0, -0.077, 2.4, 2.4), (0.0, 0.039, 0.0, -0.078, 2.6, 2.6),
                    (0.05, 0.043, -0.02, -0.078, 2.8, 2.8), (0.1, 0.048, -0.034, -0.078, 3.0, 3.0), (0.15, 0.047, -0.043, -0.077, 3.0, 3.0),
                    (0.19, 0.041, -0.05, -0.075, 2.6, 2.6), (0.215, 0.022, -0.056, -0.073, 2.2, 2.2)]
    # loft erwartet (y, halbe Breite, vorn, hinten): hier y = Längsachse, „vorn/hinten“ = oben/unten
    d = loft(Z, [(s0, a, f, b, nf, nb) for (s0, a, f, b, nf, nb) in schnitte], 0.004)
    sohle = X[:, 1] < (-0.064 if not damen else -0.062)
    schicht = np.where(sohle, 1, 0)
    if not damen:
        # Schnürung angedeutet
        d = d - 0.0006 * (np.abs(X[:, 0]) < 0.012) * (X[:, 2] > 0.02) * (X[:, 2] < 0.09) * (np.sin(X[:, 2] * 400) > 0)
    return d * s, schicht
