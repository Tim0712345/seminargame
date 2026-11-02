# -*- coding: utf-8 -*-
"""
werkzeuge/kopf.py – Kopf und Hals als Abstandsfeld
--------------------------------------------------------------------
Koordinaten des Kopfes: Ursprung zwischen den Ohröffnungen (Tragion),
x = linke Seite der Figur, y = oben, z = vorn (Blickrichtung). Meter.
Maße nach üblichen Durchschnittswerten erwachsener Menschen
(Kopfbreite ≈ 15 cm, Kopflänge ≈ 19,5 cm, Augenabstand ≈ 6,3 cm).
p: Formwerte, alle 0 = Grundform (Mann, mittel)
   w      0..1  weibliche Gesichtszüge
   nase   -1..1 Nase kleiner/größer
   kinn   -1..1 Kinn und Kiefer schmaler/kräftiger
   wangen -1..1 Gesicht schmaler/voller
   lippen -1..1 Lippen schmaler/voller
   alter   0..1 Falten, schmalere Lippen, etwas schwerere Lider
   fuelle -1..1 Körperbau (Hals, Wangen)
"""
import numpy as np
from sdf import (kugel, ellipsoid, rundkegel, kapsel, box, smin, smax, glatt, loft, kette,
                 rot_x, rot_y, rot_z, laenge)


def L(a, b, t):
    return a + (b - a) * t


def werte(p):
    w = p.get("w", 0.0)
    q = dict(p)
    q.setdefault("nase", 0.0)
    q.setdefault("kinn", 0.0)
    q.setdefault("wangen", 0.0)
    q.setdefault("lippen", 0.0)
    q.setdefault("alter", 0.0)
    q.setdefault("fuelle", 0.0)
    q["w"] = w
    q["s"] = L(1.0, 0.94, w)                       # Kopfgröße
    q["auge"] = np.array([0.0315, 0.013, 0.071])   # Augapfel-Mitte (rechts gespiegelt)
    q["augR"] = 0.0119                             # Augapfel-Radius
    return q


def augen_mitte(p, seite):
    q = werte(p)
    a = q["auge"].copy()
    a[0] *= seite
    return a * q["s"]


def gebogen(P, k):
    """Gesichtsbogen: z nach außen hin zurücknehmen (wie der Zahnbogen)."""
    Q = P.copy()
    Q[:, 2] = Q[:, 2] + k * Q[:, 0] ** 2
    return Q


def kopf_sdf(P, p, masken=False):
    """Abstand zur Haut von Kopf und Hals. masken=True liefert zusätzlich Lippen- und Brauenanteil."""
    q = werte(p)
    w, s = q["w"], q["s"]
    X = P / s                                     # Kopf wird als Ganzes skaliert
    sym = X.copy()
    sym[:, 0] = np.abs(sym[:, 0])                 # Spiegelsymmetrie
    fu = q["fuelle"]
    wa = q["wangen"] + 0.35 * fu
    ki = q["kinn"]
    al = q["alter"]

    # --- Schädel ---
    d = ellipsoid(X, (0, 0.038, -0.014), (0.0745, 0.096, 0.097))
    d = smin(d, ellipsoid(X, (0, 0.07, 0.03), (0.066, 0.07, 0.06)), 0.03)         # Stirn
    d = smin(d, ellipsoid(X, (0, 0.015, -0.055), (0.066, 0.07, 0.058)), 0.03)      # Hinterhaupt

    # --- Gesicht und Kiefer aus Querschnitten (y, halbe Breite, vorn, hinten, Exponent vorn/hinten) ---
    km = 0.004 * ki + 0.0025 * fu
    schnitte_m = [(0.05, 0.068, 0.088, -0.02, 2.16, 2.0), (0.02, 0.0705, 0.086, -0.03, 2.20, 2.0),
                  (0.0, 0.071 + 0.001 * wa, 0.084, -0.034, 2.20, 2.0), (-0.0200, 0.0675 + 0.002 * wa, 0.085, -0.035, 2.20, 2.0),
                  (-0.0392, 0.0635 + 0.002 * wa, 0.089, -0.03, 2.16, 2.0), (-0.0558, 0.0585 + km + 0.0015 * wa, 0.091, -0.022, 2.16, 2.2),
                  (-0.0686, 0.0545 + km, 0.088, -0.012, 2.12, 2.3), (-0.0824, 0.044 + km, 0.088, 0.004, 2.08, 2.2),
                  (-0.0935, 0.031 + 0.7 * km, 0.087, 0.022, 2.04, 2.0), (-0.1018, 0.018 + 0.4 * km, 0.08, 0.04, 2.00, 2.0),
                  (-0.1064, 0.006, 0.07, 0.05, 2.00, 2.0)]
    schnitte_w = [(0.05, 0.066, 0.086, -0.02, 2.12, 2.0), (0.02, 0.068, 0.084, -0.03, 2.16, 2.0),
                  (0.0, 0.0685 + 0.0015 * wa, 0.082, -0.033, 2.16, 2.0), (-0.0200, 0.065 + 0.002 * wa, 0.083, -0.034, 2.16, 2.0),
                  (-0.0392, 0.0605 + 0.002 * wa, 0.087, -0.03, 2.12, 2.0), (-0.0558, 0.054 + km + 0.0015 * wa, 0.089, -0.022, 2.12, 2.2),
                  (-0.0686, 0.048 + km, 0.086, -0.01, 2.08, 2.2), (-0.0815, 0.037 + km, 0.085, 0.006, 2.04, 2.1),
                  (-0.0916, 0.025 + 0.7 * km, 0.083, 0.024, 2.00, 2.0), (-0.0981, 0.014 + 0.4 * km, 0.077, 0.04, 2.00, 2.0),
                  (-0.1018, 0.005, 0.068, 0.05, 2.00, 2.0)]
    schnitte = [tuple(L(np.array(m), np.array(f_), w)) for m, f_ in zip(schnitte_m, schnitte_w)]
    d = smin(d, loft(X, schnitte, 0.0), 0.03)
    # Kieferwinkel (beim Mann deutlicher)
    gon = np.array([L(0.049, 0.043, w) + km, -0.066, -0.004])
    d = smin(d, ellipsoid(sym, gon, (0.011, 0.017, 0.02)), L(0.022, 0.03, w))
    # Kinn
    kz = L(0.08, 0.077, w) + 0.003 * ki
    d = smin(d, ellipsoid(X, (0, L(-0.088, -0.084, w) - 0.002 * ki, kz), (L(0.018, 0.015, w) + 0.003 * ki, 0.0135, 0.0125)), 0.016)
    # Jochbeine und Wangen
    d = smin(d, ellipsoid(sym, (0.046, -0.001, 0.058), (0.022, 0.014, 0.018), rot_y(28)), 0.022)
    d = smin(d, ellipsoid(sym, (0.038, -0.036 - 0.004 * al, 0.062), (0.022 + 0.004 * wa, 0.024, 0.019 + 0.004 * wa)), 0.03)

    # --- Stirn und Brauenbogen (weich) ---
    d = smin(d, ellipsoid(sym, (0.026, 0.035, 0.078), (0.032, L(0.013, 0.01, w), L(0.015, 0.012, w)), rot_z(-8)), 0.03)
    d = smin(d, ellipsoid(X, (0, 0.03, 0.086), (0.013, 0.013, 0.008)), 0.018)       # Nasenwurzel

    # --- Augenhöhlen und Lider ---
    a = q["auge"]
    d = smax(d, -ellipsoid(sym, (a[0], a[1] + 0.004, a[2] + 0.016), (0.019, 0.012, 0.012)), 0.012)
    d = smin(d, ellipsoid(sym, (a[0] + 0.001, a[1] - 0.0078, a[2] + 0.0075), (0.0135, 0.0042, 0.0062)), 0.005)   # Unterlid
    rl = q["augR"] + 0.0017
    lid = kugel(sym, a, rl)
    d = smin(d, lid, 0.006)
    d = smin(d, ellipsoid(sym, (a[0], a[1] + 0.0065, a[2] + 0.0085), (0.0135, 0.0045 + 0.0008 * al, 0.0055)), 0.004)   # Oberlid
    # Lidspalte (mandelförmig, außen etwas höher)
    u = (sym[:, 0] - a[0]) / 0.0145
    v = sym[:, 1] - a[1] + 0.0004 - 0.0011 * u
    hoehe = L(0.0044, 0.0047, w) * np.clip(1 - u * u, 0, 1) ** 0.55 - 0.0003 * al
    spalt = np.maximum(np.abs(v) - hoehe, np.abs(u) - 1.0)
    schnitt = np.maximum(spalt, kugel(sym, a, q["augR"] + 0.0028))
    d = smax(d, -schnitt, 0.0012)
    d = smax(d, -ellipsoid(sym, (a[0] + 0.001, a[1] + 0.0098, a[2] + 0.0105), (0.013, 0.0012, 0.004)), 0.002)          # Lidfalte

    # --- Nase: Querschnitte von der Nasenwurzel bis zum Nasensteg ---
    ns = 1.0 + 0.12 * q["nase"] - 0.06 * w          # Länge/Vorsprung
    nb = 1.0 + 0.14 * q["nase"] - 0.1 * w           # Breite
    Xn = X.copy()
    Xn[:, 0] = Xn[:, 0] / nb
    vz = lambda z: 0.088 + (z - 0.088) * ns         # Vorsprung skalieren
    nase_s = [(0.026, 0.0095, 0.089, 0.06, 2.05, 2.0), (0.012, 0.0082, vz(0.0955), 0.062, 2.00, 2.0),
              (-0.002, 0.0088, vz(0.1035), 0.065, 2.05, 2.0), (-0.012, 0.0108, vz(0.1105), 0.07, 2.25, 2.0),
              (-0.018, 0.0135, vz(0.1145), 0.074, 2.20, 2.0), (-0.0235, 0.0152, vz(0.1135), 0.078, 2.40, 2.0),
              (-0.0275, 0.0148, vz(0.108), 0.081, 2.40, 2.0), (-0.0305, 0.0118, vz(0.1005), 0.084, 2.20, 2.0),
              (-0.0322, 0.006, vz(0.095), 0.086, 2.35, 2.0)]
    d = smin(d, loft(Xn, nase_s, 0.0), 0.009)
    # Nasenflügel: weich an der Seite der Nasenbasis
    Xs = Xn.copy()
    Xs[:, 0] = np.abs(Xs[:, 0])
    d = smin(d, ellipsoid(Xs, (0.0135, -0.0262, vz(0.0965)), (0.0068, 0.0068, 0.0085)), 0.005)          # Nasenflügel
    d = smax(d, -ellipsoid(Xs, (0.0066, -0.032, vz(0.1005)), (0.0036, 0.0022, 0.0055), rot_y(-12)), 0.0025)   # Nasenlöcher
    if al > 0.05:
        d = smax(d, -kapsel(sym, (0.022, -0.026, 0.087), (0.03, -0.053, 0.079), 0.0009 * al), 0.008 * al)   # Nasolabialfalte (nur mit dem Alter)

    # --- Mund: Ober- und Unterlippe als weiche Ketten entlang des Zahnbogens ---
    lp = q["lippen"] - 0.6 * al
    bogen = lambda x: 0.0985 - 17.0 * x * x
    xs = np.array([-0.0245, -0.019, -0.012, -0.006, 0.0, 0.006, 0.012, 0.019, 0.0245])
    oy = np.array([-0.0543, -0.0522, -0.0508, -0.0502, -0.0507, -0.0502, -0.0508, -0.0522, -0.0543])
    uy = np.array([-0.0546, -0.0567, -0.0582, -0.0589, -0.059, -0.0589, -0.0582, -0.0567, -0.0546])
    fo = (1 + 0.28 * lp) * L(1.0, 1.12, w)
    fu_ = (1 + 0.28 * lp) * L(1.0, 1.1, w)
    orad = np.array([0.0019, 0.0026, 0.0034, 0.0039, 0.0037, 0.0039, 0.0034, 0.0026, 0.0019]) * fo
    urad = np.array([0.0019, 0.0029, 0.0039, 0.0045, 0.0046, 0.0045, 0.0039, 0.0029, 0.0019]) * fu_
    op = [(x, y, bogen(x) - r * 0.9) for x, y, r in zip(xs, oy, orad)]
    up = [(x, y, bogen(x) - 0.0012 - r * 0.9) for x, y, r in zip(xs, uy, urad)]
    ol = kette(X, op, orad)
    ul = kette(X, up, urad)
    lippe = np.minimum(ol, ul)
    d = smin(d, ellipsoid(gebogen(X, 12.0), (0, -0.051, 0.072), (0.029, 0.022, 0.022)), 0.02)       # Mundpartie
    d = smin(d, lippe, 0.0035)
    G = gebogen(sym, 17.0)
    d = smax(d, -ellipsoid(G, (0, -0.0546, 0.0995), (0.019, 0.001, 0.0042)), 0.0016)                  # Mundspalte (flach)
    d = smax(d, -ellipsoid(G, (0, -0.0668, 0.0915), (0.016, 0.0028, 0.006)), 0.007)                    # Kinnfurche
    d = smax(d, -kapsel(G, (0, -0.0368, 0.0995), (0, -0.0458, 0.0993), 0.0016), 0.003)                  # Philtrum

    # --- Ohren ---
    ohr_achsen = rot_y(24) @ rot_x(-10)
    oc = np.array([0.0745, 0.006, -0.012])
    ohr = ellipsoid(sym, oc + np.array([0.004, 0, -0.004]), (0.0078, 0.033, 0.02), ohr_achsen)
    ohr = smax(ohr, -ellipsoid(sym, oc + np.array([0.011, 0.002, -0.001]), (0.006, 0.022, 0.013), ohr_achsen), 0.003)   # Muschel
    ohr = smin(ohr, ellipsoid(sym, oc + np.array([0.004, -0.026, 0.0]), (0.0055, 0.009, 0.008)), 0.005)               # Ohrläppchen
    ohr = smin(ohr, ellipsoid(sym, oc + np.array([-0.001, -0.002, 0.012]), (0.006, 0.008, 0.005)), 0.004)             # Tragus
    d = smin(d, ohr, 0.006)

    # --- Hals (nicht mitskaliert) ---
    Y = P
    symY = Y.copy()
    symY[:, 0] = np.abs(symY[:, 0])
    rh = L(0.059, 0.05, w) + 0.006 * fu
    hals = rundkegel(Y, (0, -0.215, -0.03), (0, -0.04, -0.022), rh * 1.06, rh * 0.93)
    hals = smin(hals, kapsel(symY, (0.05, -0.05, -0.02), (0.018, -0.19, 0.032), 0.009 + 0.002 * fu), 0.03)   # Kopfnicker
    if w < 0.5:
        hals = smin(hals, ellipsoid(Y, (0, -0.118, 0.04), (0.009, 0.012, 0.009)), 0.012 * (1 - 2 * w))         # Adamsapfel
    # Nacken
    hals = smin(hals, ellipsoid(Y, (0, -0.1, -0.06), (0.05, 0.08, 0.035)), 0.03)
    d = d * s
    d = smin(d, hals, 0.03)

    if not masken:
        return d
    lip_anteil = np.clip(1.0 - (lippe * s + 0.0003) / 0.0014, 0, 1)
    braue_hoehe = sym[:, 1] - (0.041 - 0.105 * (sym[:, 0] - 0.03) ** 2 * 10 + 0.004 * np.clip((sym[:, 0] - 0.012) / 0.03, 0, 1))
    bx = np.clip((sym[:, 0] - 0.011) / 0.043, 0, 1)
    braue_dicke = L(0.0042, 0.0028, w) * (1 - 0.55 * bx)
    braue_m = np.clip(1 - np.abs(braue_hoehe - 0.003 * (1 - bx)) / braue_dicke, 0, 1)
    braue_m *= (sym[:, 0] > 0.008) & (sym[:, 0] < 0.056) & (sym[:, 2] > 0.055)
    braue_m = np.clip(braue_m * 1.6, 0, 1) * glatt(0.008, 0.013, sym[:, 0]) * (1 - glatt(0.05, 0.057, sym[:, 0]))
    return d, lip_anteil, braue_m


def augapfel_sdf(P, p, seite):
    q = werte(p)
    return kugel(P, augen_mitte(p, seite), q["augR"] * q["s"])
