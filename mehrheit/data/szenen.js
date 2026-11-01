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
  }
};
