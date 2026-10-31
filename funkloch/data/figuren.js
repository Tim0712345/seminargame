// =====================================================================
//  data/figuren.js – Aussehen aller Figuren (Figuren-Baukasten)
// ---------------------------------------------------------------------
//  Jede Figur ist aus einfachen Formen gebaut: Kopf = Kreis,
//  Körper = Trapez, Beine = Rechtecke. Gesicht: zwei Punkte, ein Strich.
//
//  groesse   1 = normal, 0.6 = Kind, 1.1 = groß
//  koerper   Körperbreite: 0.8 = schmal, 1 = mittel, 1.35 = breit
//  haltung   "gerade", "gebeugt" (älter), "sitzt" (nur mit Rollstuhl)
//  haut      Name aus DATA.hauttoene (unten) – Hautton als Rasterdichte
//  haare     form: "kurz", "wuschel", "lang", "dutt", "zopf", "locken",
//                  "glatze", "kopftuch", "muetze", "seitenscheitel"
//            farbe: Name eines Materials oder { druckfarbe: dichte }
//  oberteil  form: "trapez", "gerade", "kleid", "mantel", "kapuze"
//            farbe: wie oben
//  hose      farbe: wie oben
//  extras    Liste aus: "kopfhoerer", "rekorder", "schuerze", "namensschild",
//            "becher", "kinderwagen", "gehstock", "rollstuhl", "tasche",
//            "rucksack", "schal", "bart", "weste"
//  extraFarbe  Farbe für Schürze, Schal, Weste, Tasche usw.
//  stimme    tonhoehe für die Sprechlaute (kommt in Phase 2)
// =====================================================================

var DATA = window.DATA || {};
window.DATA = DATA;

// Hauttöne als Rasterdichte (heller = weniger Punkte)
DATA.hauttoene = {
  haut_1: { pink: 0.16, gelb: 0.22 },
  haut_2: { pink: 0.26, gelb: 0.36 },
  haut_3: { pink: 0.36, gelb: 0.52, blau: 0.04 },
  haut_4: { pink: 0.5, gelb: 0.66, blau: 0.18 },
  haut_5: { pink: 0.62, gelb: 0.76, blau: 0.34 }
};

DATA.figuren = {

  // ---------------- Spielfigur ----------------
  robin: {
    name: "Robin",
    rolle: "neu im Team von „Funkloch“",
    groesse: 1, koerper: 0.95, haltung: "gerade",
    haut: "haut_3",
    haare: { form: "wuschel", farbe: { gruen: 0.95, pink: 0.35 } },
    oberteil: { form: "kapuze", farbe: { pink: 1, gelb: 0.12 } },
    hose: { farbe: { blau: 1, gruen: 0.25 } },
    extras: ["kopfhoerer", "rekorder"],
    extraFarbe: { gelb: 1 },
    stimme: { tonhoehe: 1.0 }
  },

  // ---------------- Bahnhof Kiel ----------------
  birte: {
    name: "Birte",
    rolle: "Kassiererin im Minijob",
    groesse: 0.96, koerper: 1.2, haltung: "gerade",
    haut: "haut_1",
    haare: { form: "dutt", farbe: { gelb: 0.55, pink: 0.25, gruen: 0.3 } },
    oberteil: { form: "trapez", farbe: { blau: 0.7, gruen: 0.15 } },
    hose: { farbe: { gruen: 0.9, blau: 0.4 } },
    extras: ["schuerze", "namensschild", "becher"],
    extraFarbe: { pink: 0.85, gelb: 0.2 },
    stimme: { tonhoehe: 1.1 }
  },

  jannik: {
    name: "Jannik",
    rolle: "Vater, arbeitet in Teilzeit",
    groesse: 1.06, koerper: 1.0, haltung: "gerade",
    haut: "haut_4",
    haare: { form: "kurz", farbe: { gruen: 1, blau: 0.5 } },
    oberteil: { form: "mantel", farbe: { gruen: 0.6, gelb: 0.55 } },
    hose: { farbe: { blau: 0.6, gruen: 0.6 } },
    extras: ["bart", "kinderwagen", "schal"],
    extraFarbe: { pink: 0.9, gelb: 0.6 },
    stimme: { tonhoehe: 0.8 }
  },

  // ---------------- Figuren-Parade (nur Debug, Taste P) ----------------
  //  Zeigt die Vielfalt des Baukastens für die Stil-Abnahme.
  probe_1: {
    name: "Probe Rollstuhl", groesse: 1, koerper: 1.05, haltung: "sitzt", haut: "haut_5",
    haare: { form: "locken", farbe: { gruen: 1, blau: 0.6 } },
    oberteil: { form: "gerade", farbe: { pink: 0.9, gelb: 0.15 } },
    hose: { farbe: { blau: 0.85 } }, extras: ["rollstuhl"], extraFarbe: { gruen: 0.9 }
  },
  probe_2: {
    name: "Probe Gehstock", groesse: 0.92, koerper: 0.9, haltung: "gebeugt", haut: "haut_2",
    haare: { form: "glatze", farbe: { gelb: 0.15, blau: 0.15 } },
    oberteil: { form: "mantel", farbe: { blau: 0.55, pink: 0.25 } },
    hose: { farbe: { gruen: 0.7 } }, extras: ["gehstock", "bart"], extraFarbe: "holz"
  },
  probe_3: {
    name: "Probe Kopftuch", groesse: 1.0, koerper: 1.0, haltung: "gerade", haut: "haut_3",
    haare: { form: "kopftuch", farbe: { gruen: 0.75, gelb: 0.6 } },
    oberteil: { form: "kleid", farbe: { blau: 0.8, pink: 0.3 } },
    hose: { farbe: { gruen: 0.9 } }, extras: ["tasche"], extraFarbe: { pink: 0.9 }
  },
  probe_4: {
    name: "Probe Kind", groesse: 0.6, koerper: 0.9, haltung: "gerade", haut: "haut_4",
    haare: { form: "zopf", farbe: { gruen: 1, pink: 0.4 } },
    oberteil: { form: "gerade", farbe: { gelb: 1 } },
    hose: { farbe: { pink: 0.9, blau: 0.3 } }, extras: ["rucksack"], extraFarbe: { blau: 0.9 }
  },
  probe_5: {
    name: "Probe Groß", groesse: 1.14, koerper: 1.35, haltung: "gerade", haut: "haut_5",
    haare: { form: "muetze", farbe: { pink: 1, gelb: 0.3 } },
    oberteil: { form: "trapez", farbe: { gruen: 0.85, blau: 0.2 } },
    hose: { farbe: { blau: 0.9, gruen: 0.4 } }, extras: ["weste"], extraFarbe: { gelb: 1, pink: 0.35 }
  },
  probe_6: {
    name: "Probe Lang", groesse: 1.02, koerper: 0.82, haltung: "gerade", haut: "haut_1",
    haare: { form: "lang", farbe: { gelb: 0.85, pink: 0.45 } },
    oberteil: { form: "kapuze", farbe: { blau: 0.45 } },
    hose: { farbe: { gruen: 0.95 } }, extras: ["kopfhoerer"], extraFarbe: { gelb: 1 }
  },
  probe_7: {
    name: "Probe Seitenscheitel", groesse: 1.0, koerper: 1.1, haltung: "gerade", haut: "haut_2",
    haare: { form: "seitenscheitel", farbe: { pink: 0.7, gelb: 0.7, gruen: 0.25 } },
    oberteil: { form: "gerade", farbe: "schild_blau" },
    hose: { farbe: { gelb: 0.5, gruen: 0.6 } }, extras: ["schal", "tasche"], extraFarbe: { gelb: 1 }
  }
};
