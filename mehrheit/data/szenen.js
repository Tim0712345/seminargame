/* =====================================================================
   data/szenen.js – Aufbau der Räume aus Bausteinen (Abschnitt 7.6)
   ---------------------------------------------------------------------
   pos:  [x, y, z] in Metern (x = rechts/Osten, y = oben, z = zur Kamera/Süden)
   dreh: Drehung um die Hochachse in Grad (0 = schaut zur Kamera, 90 = schaut nach rechts)
   Alle Räume sind erfunden. Die Form (Halbrund, Glasdach) ist allgemein parlamentarisch.
   ===================================================================== */
var DATA = window.DATA || {};

DATA.szenen = {

  /* ---------------- Plenarsaal (Titel und Kapitel 7) ---------------- */
  plenarsaal: {
    stimmung: "titel",
    beschreibung: "titel",
    // Halbrund mit ansteigenden Sitzreihen
    halbrund: {
      sitzeProReihe: [15, 17, 19, 21, 23, 25],   // zusammen 120 Plätze (Spielwert sitze_plenum_darstellung)
      radiusStart: 6.6,       // Abstand der ersten Reihe vom Rednerpult
      reihenAbstand: 1.18,    // Abstand zwischen den Reihen
      stufenHoehe: 0.42,      // jede Reihe liegt so viel höher
      winkelVon: 12, winkelBis: 168,   // Ausdehnung des Halbrunds in Grad
      gaenge: [50, 90, 130],  // Treppen zwischen den Blöcken (Winkel in Grad)
      gangBreite: 4.2         // Breite der Treppen in Grad
    },
    raum: { radius: 15.4, hoehe: 12.0, vorne: -9.6, breiteVorne: 15.4 },
    // Glasdach mit Stahlträgern (Mitte x/z, Größe, Felder)
    glasdach: { mitte: [4.3, -5.8], groesse: [9.6, 7.6], felder: [6, 4] },
    praesidium: { vorne: -3.1, hinten: -6.2, breite: 15.0, hoehe: 0.95 },
    rednerpult: { pos: [0, 0, -1.66], dreh: 0 },
    rang: { radius: 14.0, hoehe: 4.9, tiefe: 2.2 },
    sitzlampen: { ruhe: 0.4 }   // wie hell die Sitzlampen ohne Abstimmung glimmen
  },

  /* ---------------- Büro der Spielfigur (Kapitel 1 und 3) ---------------- */
  buero: {
    stimmung: "buero_morgen",
    beschreibung: "buero",
    raum: { links: -2.4, rechts: 2.4, hinten: -2.6, vorne: 2.4, hoehe: 2.9 },
    fenster: { pfostenAbstand: 1.2, riegelHoehe: 2.12, bruestung: 0.06 },
    stadt: { bloecke: 90, saat: 11 },
    moebel: [
      { baustein: "schreibtisch",   pos: [0.15, 0, -1.0],   dreh: 0, groesse: [1.72, 0.75, 0.86] },
      { baustein: "papierstapel",   pos: [-0.1, 0.75, -0.735], dreh: -3 },
      { baustein: "glasmodell",     pos: [0.53, 0.75, -0.98], dreh: -10 },
      { baustein: "schreibtischlampe", pos: [0.86, 0.75, -1.3], dreh: 205, an: true },
      { baustein: "bildschirm",     pos: [-0.5, 0.75, -1.25], dreh: 14 },
      { baustein: "becher",         pos: [0.25, 0.75, -0.5], dampf: true },
      { baustein: "aktenstapel",    pos: [-0.66, 0.75, -0.66], dreh: 9 },
      { baustein: "pflanze",        pos: [-1.95, 0, -2.08] },
      { baustein: "regal",          pos: [2.2, 0, -0.95], dreh: -90, laenge: 2.5 },
      { baustein: "pinnwand",       pos: [-2.38, 1.42, -0.75], dreh: 90 },
      { baustein: "tisch_klein",    pos: [-1.42, 0, 0.62] },
      { baustein: "stuhl",          pos: [-1.92, 0, 0.55], dreh: 75 },
      { baustein: "stuhl",          pos: [0.12, 0, -0.18], dreh: 185 },
      { baustein: "teppich",        pos: [0.05, 0, -0.55], dreh: 0, groesse: [2.7, 2.0], farbe: "#8a7058", innen: "#a68b6e" },
      { baustein: "papierkorb",     pos: [1.05, 0, -0.62] },
      { baustein: "garderobe",      pos: [1.95, 0, 1.95], mantel: ["#3a4150", "#7a5a3c"], schal: "#c25a3c" },
      { baustein: "sideboard",      pos: [2.15, 0, 0.95], dreh: -90, laenge: 1.1 },
      { baustein: "stehlampe",      pos: [-2.0, 0, 1.45], an: true, staerke: 1.2 },
      { baustein: "bild",           pos: [-2.38, 1.55, 1.35], dreh: 90, groesse: [0.95, 0.65], saat: 7 },
      { baustein: "wanduhr",        pos: [-2.38, 2.42, -0.75], dreh: 90 },
      { baustein: "pflanze",        pos: [1.95, 0, -2.15], saat: 23 },
      { baustein: "deckenleuchte",  pos: [0.0, 2.9, -0.6], an: false },
      { baustein: "deckenleuchte",  pos: [0.0, 2.9, 1.2], an: false }
    ],
    // Zusatzlicht: weiches Fülllicht von der offenen Raumseite (wie aus dem Flur)
    lichter: [
      { pos: [0.6, 2.3, 2.6], kelvin: 4300, staerke: 2.6, reichweite: 7.5 },
      { pos: [-1.2, 1.9, 1.8], kelvin: 3800, staerke: 0.5, reichweite: 3.5 }
    ],
    figuren: [
      { person: "mira", pos: [-1.92, 0, 0.55], dreh: 75, haltung: "sitzen" },
      { person: "luca", pos: [0.92, 0, 0.78], dreh: -72, haltung: "stehen" }
    ]
  },

  /* ---------------- Ausschusssaal (Kapitel 2 und 5) ---------------- */
  ausschusssaal: {
    stimmung: "anhoerung",
    beschreibung: "ausschusssaal",
    raum: { breite: 16, tiefe: 13, hoehe: 4.6, hinten: -6.2 },
    // Hufeisentisch: Querteil für die Gäste, zwei Arme für die Abgeordneten
    tisch: { querZ: -3.3, querBreite: 9.4, armX: 4.7, armVon: -2.7, armBis: 5.6 },
    gaeste: [
      { person: "ines",    pos: [-2.4, 0, -3.95], dreh: 0, haltung: "sitzen" },
      { person: "weiss",   pos: [-1.2, 0, -3.95], dreh: 0, haltung: "sitzen" },
      { person: "karin",   pos: [ 0.0, 0, -3.95], dreh: 0, haltung: "sitzen" },
      { person: "nadia",   pos: [ 1.2, 0, -3.95], dreh: 0, haltung: "sitzen" },
      { person: "mateusz", pos: [ 2.4, 0, -3.95], dreh: 0, haltung: "sitzen" }
    ],
    flaggen: ["eu", "frankreich", "italien", "belgien", "irland", "oesterreich", "deutschland"],
    lichter: [
      { pos: [-1.2, 3.6, -2.2], kelvin: 3200, staerke: 3.2, reichweite: 6, richtung: [0, -0.85, -0.52], kegelAussen: 34, kegelInnen: 18 },
      { pos: [1.2, 3.6, -2.2], kelvin: 3200, staerke: 3.2, reichweite: 6, richtung: [0, -0.85, -0.52], kegelAussen: 34, kegelInnen: 18 },
      // warmes Wandlicht auf die Rückwand (gegen die dunkle Fläche)
      { pos: [-5.0, 3.9, -5.2], kelvin: 3400, staerke: 3.0, reichweite: 6, richtung: [0, -0.5, -0.86], kegelAussen: 55, kegelInnen: 25 },
      { pos: [0.0, 3.9, -5.2], kelvin: 3400, staerke: 3.0, reichweite: 6, richtung: [0, -0.5, -0.86], kegelAussen: 55, kegelInnen: 25 },
      { pos: [5.0, 3.9, -5.2], kelvin: 3400, staerke: 3.0, reichweite: 6, richtung: [0, -0.5, -0.86], kegelAussen: 55, kegelInnen: 25 }
    ]
  },

  /* ---------------- Schnittmodell des Parlamentsgebäudes (Kapitel 4) ---------------- */
  gebaeude: {
    stimmung: "flure",
    beschreibung: "gebaeude",
    breite: 24, tiefe: 8, etagenHoehe: 3.3, etagen: 3,
    // Räume: etage 0 = Erdgeschoss; x von/bis in Metern
    raeume: [
      { id: "cafeteria",  etage: 0, von: -12, bis: -4, art: "cafeteria" },
      { id: "halle",      etage: 0, von: -4, bis: 3, art: "halle" },
      { id: "bibliothek", etage: 0, von: 3, bis: 12, art: "bibliothek" },
      { id: "BFW",        etage: 1, von: -12, bis: -6, art: "buero", fraktion: "BFW" },
      { id: "EVM",        etage: 1, von: -6, bis: 0, art: "buero", fraktion: "EVM" },
      { id: "ASG",        etage: 1, von: 0, bis: 6, art: "buero", fraktion: "ASG" },
      { id: "GZL",        etage: 1, von: 6, bis: 12, art: "buero", fraktion: "GZL" },
      { id: "BSN",        etage: 2, von: -12, bis: -6, art: "buero", fraktion: "BSN" },
      { id: "FU",         etage: 2, von: -6, bis: 0, art: "buero", fraktion: "FU" },
      { id: "eigenes",    etage: 2, von: 0, bis: 6, art: "buero", fraktion: "BRUECKE" },
      { id: "terrasse",   etage: 2, von: 6, bis: 12, art: "leer" }
    ],
    // Deckenlicht je Etage (warm, weich), damit man in die Räume hineinsieht
    lichter: [
      { pos: [-6, 3.0, -1.2], kelvin: 3600, staerke: 7.5, reichweite: 7 },
      { pos: [6, 3.0, -1.2], kelvin: 3600, staerke: 7.5, reichweite: 7 },
      { pos: [-6, 6.3, -1.2], kelvin: 3800, staerke: 7.5, reichweite: 7 },
      { pos: [6, 6.3, -1.2], kelvin: 3800, staerke: 7.5, reichweite: 7 },
      { pos: [-6, 9.6, -1.2], kelvin: 3800, staerke: 7.0, reichweite: 7 },
      { pos: [3, 9.6, -1.2], kelvin: 3800, staerke: 7.0, reichweite: 7 }
    ],
    besucher: 5,
    raumLicht: 7      // Helligkeit des Lichts im besuchten Büro (Spielwert der Darstellung)
  },

  /* ---------------- Trilog-Raum (Kapitel 6) ---------------- */
  trilog: {
    stimmung: "trilog",
    beschreibung: "trilog",
    raum: { breite: 10, tiefe: 7.4, hoehe: 3.1 },
    figuren: [
      { person: "marinescu", pos: [-0.3, 0, -1.05], dreh: 0, haltung: "sitzen" },
      { person: "tiago",     pos: [2.75, 0, 0.0], dreh: -90, haltung: "sitzen" },
      { person: "sam",       pos: [0.3, 0, 1.05], dreh: 180, haltung: "sitzen" },
      { person: "hanna",     pos: [-2.75, 0, 0.15], dreh: 90, haltung: "sitzen" },
      { person: "dolmetscher", pos: [-1.2, 1.35, -4.62], dreh: 0, haltung: "sitzen" }
    ]
  },

  /* ---------------- Plenarsaal in Straßburg (Kapitel 7) ---------------- */
  plenum: {
    basis: "plenarsaal",
    stimmung: "plenum",
    beschreibung: "plenum",
    besucher: 46,
    figuren: [
      { person: "sam",        pos: [0, 0, -2.18], dreh: 0, haltung: "stehen" },
      { person: "saaldiener", pos: [-4.2, 0, -2.7], dreh: 35, haltung: "stehen" }
    ]
  },

  /* ---------------- Epilog: Collage auf einem Tisch ---------------- */
  epilog: {
    stimmung: "epilog",
    beschreibung: "epilog"
  }
};
