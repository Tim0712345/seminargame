/* =====================================================================
   Die Lücke – Karten
   ---------------------------------------------------------------------
   Jede Karte ist ein Raster: 1 Zeichen = 1 Kachel = 1 Welteinheit.
   x = Spalte (von links), y = Zeile (von oben). Oben im Raster = Norden,
   die Kamera schaut von Süden (unten) auf die Karte.

   Layer:
     boden      – ein Zeichen pro Kachel, Bedeutung über "legende"
     hoehe      – Ziffer 0–9 pro Kachel (1 Stufe = eine halbe Einheit)
     kollision  – optional: "X" = gesperrt, "o" = immer frei,
                  " " oder "." = automatisch (Wasser, steile Hänge
                  und Objekte sperren von selbst)
     objekte    – Liste: { p: Prefab-Name, x, y, rot: Drehung in Grad }
                  Das Objekt steht mitten auf der Kachel (x, y).
                  Kommazahlen sind erlaubt (x: 3.5 = eine halbe Kachel weiter).
     spawns     – Startpunkte: { x, y, blick } – blick in Grad,
                  0 = schaut nach Süden (zur Kamera), 180 = nach Norden
     aussen     – Bodenart außerhalb der Karte ("wasser" oder z. B. "gras")
   ===================================================================== */
var DATA = window.DATA = window.DATA || {};

/* Bodenarten: Farbe (palette.js) und Oberflächen-Muster.
   wasser: nicht begehbar · steg: begehbarer Holzsteg über Wasser
   hart: Rand bleibt scharf (sonst gehen die Farben weich ineinander über) */
DATA.bodenarten = {
  gras:      { farbe: "gras",      textur: "gras" },
  weg:       { farbe: "weg" },
  pflaster:  { farbe: "pflaster",  textur: "pflaster", hart: true },
  kopfstein: { farbe: "kopfstein", textur: "kopfstein", hart: true },
  sand:      { farbe: "sand" },
  wasser:    { farbe: "wasser",    wasser: true },
  steg:      { farbe: "holz",      textur: "holz", steg: true }
};

DATA.maps = {

  /* ---------------- Test-Insel (Phase 1) ---------------- */
  testinsel: {
    name: "Test-Insel",
    stimmung: "test",
    innen: false,
    aussen: "wasser",
    legende: { ".": "gras", "=": "weg", "#": "pflaster", "k": "kopfstein", ":": "sand", "~": "wasser", "h": "steg" },
    boden: [
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~:::::::::~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~:::::::..::::::~~~~~~~~~~~",
      "~~~~~~~~~::::::.........::~~~~~~~~~~",
      "~~~~~~~:::...............::~~~~~~~~~",
      "~~~~~~::.......==.........::::~~~~~~",
      "~~~~~~::.......==..........::::~~~~~",
      "~~~~~~:........==.....~~~~~~:::~~~~~",
      "~~~~~:...=.....==.....~~hh~~.::~~~~~",
      "~~~::...===....==.....~~hh~~..::~~~~",
      "~~:::....===...==.....~~hh~~..::~~~~",
      "~~:::.....===..==.......hh....::~~~~",
      "~~~::......===.==.......==....:::~~~",
      "~~~::.......==####......==....::::~~",
      "~~~:.........######.....==....:::~~~",
      "~~::.........##kk##.....==....::~~~~",
      "~~::.........##kk##=======....:::~~~",
      "~~~::........######=======....:::~~~",
      "~~~::.........####...........::::~~~",
      "~~~::::........==...........::::~~~~",
      "~~~:::::.......==...........:::~~~~~",
      "~~~~~:::.......==..........:::~~~~~~",
      "~~~~~~::.......==.........:::~~~~~~~",
      "~~~~~~~::......==.......:::~~~~~~~~~",
      "~~~~~~~~:::::..==....::::~~~~~~~~~~~",
      "~~~~~~~~~~~~::.==:::::::~~~~~~~~~~~~",
      "~~~~~~~~~~~~~::==~~::::~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
    ],
    hoehe: [
      "000000000000000000000000000000000000",
      "000000000000000000000000000000000000",
      "000000000000000000000000000000000000",
      "000000000000000000000000000000000000",
      "000000000000000000000000000000000000",
      "000000000000000000000000000000000000",
      "000000001111000000000000000000000000",
      "000000002211000000000000000000000000",
      "000000023221100000000000000000000000",
      "000000233321100000000000000000000000",
      "000001223221100000000000000000000000",
      "000001122211000000000000000000000000",
      "000001111111000000000000000000000000",
      "000000011100000000000000000000000000",
      "000000000000000000000000000000000000",
      "000000000000000000000000000000000000",
      "000000000000000000000000000000000000",
      "000000000000000000000000000000000000",
      "000000000000000000000000000000000000",
      "000000000000000000000000000000000000",
      "000000000000000000000000000000000000",
      "000000000000000000000000000000000000",
      "000000000000000000000000000000000000",
      "000000000000000000000000000000000000",
      "000000000000000000000000000000000000",
      "000000000000000000000000000000000000",
      "000000000000000000000000000000000000",
      "000000000000000000000000000000000000",
      "000000000000000000000000000000000000",
      "000000000000000000000000000000000000"
    ],
    objekte: [
      // Platz
      { p: "bank", x: 18.05, y: 13.95, rot: -45 },
      { p: "bank", x: 12.95, y: 19.05, rot: 135 },
      { p: "bank", x: 18.05, y: 19.05, rot: -135 },
      { p: "bank", x: 11.9,  y: 16.5,  rot: 90 },
      { p: "laterne", x: 19.2, y: 13.6 },
      { p: "laterne", x: 12.2, y: 19.9 },
      { p: "laterne", x: 19.4, y: 20.0 },
      { p: "laterne", x: 14.0, y: 22.5 },
      { p: "wegweiser", x: 14.0, y: 13.0, rot: 20 },
      { p: "blumenbeet", x: 19.0, y: 10.5 },
      { p: "blumenbeet", x: 10.5, y: 20.5, rot: 90 },
      // Haus im Norden
      { p: "haus_klein", x: 20.0, y: 5.0 },
      { p: "briefkasten", x: 17.8, y: 6.3, rot: 90 },
      { p: "zaun", x: 18, y: 7.3 },
      { p: "zaun", x: 19, y: 7.3 },
      { p: "zaun", x: 21, y: 7.3 },
      { p: "zaun", x: 22, y: 7.3 },
      // Bäume
      { p: "baum_rund", x: 5,  y: 13 },
      { p: "baum_rund", x: 7,  y: 18 },
      { p: "baum_rund", x: 10, y: 22 },
      { p: "baum_rund", x: 22, y: 21 },
      { p: "baum_rund", x: 26, y: 20 },
      { p: "baum_rund", x: 12, y: 7 },
      { p: "birke", x: 28, y: 12 },
      { p: "birke", x: 21, y: 8.4 },
      { p: "birke", x: 27.5, y: 16.5 },
      { p: "birke", x: 20, y: 24 },
      { p: "kiefer", x: 5,  y: 11 },
      { p: "kiefer", x: 11, y: 5.6 },
      { p: "kiefer", x: 4,  y: 16 },
      { p: "kiefer", x: 24, y: 23 },
      // Kleinkram
      { p: "busch", x: 27, y: 14 },
      { p: "busch", x: 6,  y: 15.2 },
      { p: "busch", x: 21.5, y: 22.5 },
      { p: "busch", x: 10, y: 24 },
      { p: "stein", x: 5,  y: 20.4 },
      { p: "stein", x: 30, y: 15 },
      { p: "stein", x: 22, y: 26 },
      { p: "stein", x: 9.4, y: 5 },
      // Test-Fundstück auf dem Hügel
      { p: "testfund_sockel", x: 8, y: 9, id: "testfund" }
    ],
    spawns: {
      start: { x: 15.5, y: 24.5, blick: 180 }
    },
    // Nur auf der Test-Insel: Probefiguren, die den Figuren-Baukasten zeigen
    testfiguren: [
      { figur: "emil",    x: 13.4, y: 21.2, blick: 30 },
      { figur: "helga",   x: 18.6, y: 21.6, blick: -30 },
      { figur: "leyla",   x: 20.6, y: 15.4, blick: -80 },
      { figur: "ole",     x: 21.6, y: 16.2, blick: -110 },
      { figur: "mia",     x: 10.2, y: 16.0, blick: 60 },
      { figur: "anna",    x: 9.6,  y: 17.4, blick: 100 },
      { figur: "jonas",   x: 10.6, y: 18.2, blick: 140 },
      { figur: "laurent", x: 17.2, y: 11.2, blick: 10 }
    ]
  }
};
