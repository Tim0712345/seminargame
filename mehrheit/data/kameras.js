/* =====================================================================
   data/kameras.js – Kameravorlagen und Kamerafahrten (Abschnitt 7.4)
   ---------------------------------------------------------------------
   pos:    wo die Kamera steht   [x, y, z] in Metern
   ziel:   wohin sie schaut      [x, y, z]
   mm:     Brennweite wie beim Film (35 = Totale, 50 = Halbnah, 85 = Nah, 100 = Makro)
   blende: kleine Zahl = wenig Schärfentiefe (viel Unschärfe), große Zahl = alles scharf
   fokus:  Entfernung der Schärfe in Metern (leer lassen = Abstand zum Ziel)
   t:      Zeitpunkt in Sekunden innerhalb einer Fahrt
   Koordinaten: x = Osten (rechts), y = oben, z = Süden (zur Kamera hin)
   ===================================================================== */
var DATA = window.DATA || {};

DATA.kameras = {

  /* Brennweiten-Vorlagen */
  vorlagen: {
    totale:  { mm: 35,  blende: 8.0 },
    halbnah: { mm: 50,  blende: 2.8 },
    nah:     { mm: 85,  blende: 2.2 },
    makro:   { mm: 100, blende: 5.6 }
  },

  /* Die Welt wird gefilmt, als wäre sie ein Modell im Maßstab 1:20.
     Größere Zahl = stärkere Unschärfe im Hintergrund (Makro-Gefühl). */
  modellMassstab: 1.6,

  /* Ganz leichtes „Atmen“ der Kamera (Meter, Tempo in Schwingungen pro Sekunde) */
  atmen: { staerke: 0.006, tempo: 0.13 },

  /* Kamerafahrten */
  fahrten: {
    // Titel: Flug durch den leeren Plenarsaal, endet auf dem Blatt am Rednerpult
    titel: {
      punkte: [
        { t: 0,    pos: [-6.2, 10.4, 11.6], ziel: [2.5, 3.0, -4.5],  mm: 24, blende: 8 },
        { t: 5.5,  pos: [-4.2, 7.4, 9.8],   ziel: [2.2, 2.2, -2.8],  mm: 26, blende: 8 },
        { t: 10.5, pos: [ 1.6, 4.4, 10.0],  ziel: [5.0, 2.3, 3.5],   mm: 30, blende: 4 },
        { t: 14.0, pos: [ 6.2, 2.9, 7.1],   ziel: [3.0, 1.6, 1.0],   mm: 35, blende: 2.8, fokus: 1.6 },
        { t: 18.0, pos: [ 2.4, 2.3, 0.4],   ziel: [0.0, 1.2, -1.5],  mm: 45, blende: 4 },
        { t: 23.0, pos: [ 0.02, 1.70, -2.12], ziel: [0.01, 1.10, -1.66], mm: 50, blende: 5.6 }
      ],
      // Sitzlampe in der Nähe dieses Punktes flackert kurz auf
      flackerPunkt: [5.6, 1.4, 6.2], flackerZeit: 13.2
    },
    // Ruhige Schleife über dem Blatt, solange das Menü offen ist
    titel_schleife: {
      dauer: 26,
      mitte: [0.02, 1.70, -2.12], ziel: [0.01, 1.10, -1.66], ausschlag: [0.06, 0.02, 0.03], mm: 50, blende: 5.6
    }
  },

  /* Feste Einstellungen im Büro */
  buero: {
    totale:   { pos: [0.55, 1.58, 4.35],  ziel: [-0.15, 1.02, -0.9],  mm: 30, blende: 8 },
    schreibtisch: { pos: [0.15, 1.42, 0.62], ziel: [0.12, 0.8, -0.95], mm: 38, blende: 4 },
    dokument: { pos: [-0.1, 1.22, -0.30], ziel: [-0.1, 0.758, -0.735], mm: 60, blende: 8 },
    halbrund: { pos: [0.74, 1.0, -0.5], ziel: [0.52, 0.8, -1.02], mm: 50, blende: 5.6 },
    stempel:  { pos: [-0.08, 1.30, -0.22], ziel: [-0.1, 0.76, -0.735], mm: 45, blende: 8 }
  },

  /* Gespräch: Schuss/Gegenschuss über die Schulter */
  gespraech: {
    mm: 50, blende: 2.0,
    schulterAbstand: 0.55,   // wie weit hinter der zuhörenden Person
    schulterSeite: 0.30,     // seitlich versetzt (über die Schulter)
    schulterHoehe: 0.10      // etwas über Schulterhöhe
  }
};
