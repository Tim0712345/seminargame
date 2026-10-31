// =====================================================================
//  data/stationen.js – Aufbau der Stationen (Straßenszenen)
// ---------------------------------------------------------------------
//  Jede Station ist eine breite Straße, die man seitlich abläuft.
//  breite   = Länge der Straße in Welt-Einheiten (das Bild ist 360 hoch)
//  boden    = Höhe der Straße, auf der alle laufen (y wächst nach unten)
//  start    = wo Robin anfängt
//  stimmung = Tageszeit aus data/stil.js
//  ebenen   = von hinten nach vorne. parallaxe: 1 = Straße,
//             kleiner = weiter weg, größer = Vordergrund.
//             ton = Tönung aus der Stimmung („fern“, „mitte“, „nah“, „vorne“)
//  objekte  = Bausteine aus js/zeichnen/objekte.js. Jeder hat einen „typ“
//             und eine Position. Farben kann man mit farbe / dachFarbe
//             (Materialname aus data/stil.js) ändern.
//  figuren  = wer hier steht (Aussehen in data/figuren.js)
//
//  Schilder-Texte stehen direkt hier (schild, eingang, plakat …).
// =====================================================================

var DATA = window.DATA || {};
window.DATA = DATA;

DATA.stationen = {

  kiel: {
    titel: "Bahnhof Kiel",
    land: "Deutschland",
    tageszeit: "Abend",
    thema: "Teilzeit, Minijobs, Kinderbetreuung",
    stimmung: "kiel_abend",
    breite: 2000,
    boden: 300,
    start: 560,

    ebenen: [
      // ---------- Himmel ----------
      { name: "himmel", parallaxe: 0.04, objekte: [
        { typ: "sterne", von: 300, bis: 1700, oben: 10, unten: 170 },
        { typ: "sonne", x: 900, y: 214, r: 40 },
        { typ: "wolke", x: 620, y: 150, b: 170, h: 15 },
        { typ: "wolke", x: 1080, y: 104, b: 240, h: 17 },
        { typ: "wolke", x: 1390, y: 176, b: 130, h: 11 },
        { typ: "wolke", x: 380, y: 96, b: 120, h: 12, farbe: "wolke_hell" },
        { typ: "moewen", x: 760, y: 120, anzahl: 4 }
      ]},

      // ---------- Ferne: Förde, Ostufer, Werftkräne, Fähre ----------
      { name: "ferne", parallaxe: 0.2, ton: "fern", objekte: [
        { typ: "huegel", von: -300, bis: 2300, y: 262, h: 22, saat: 2 },
        { typ: "windrad", x: 1150, y: 248, h: 62 },
        { typ: "windrad", x: 1260, y: 246, h: 54, tempo: 0.7 },
        { typ: "windrad", x: 1360, y: 250, h: 58, tempo: 1.1 },
        { typ: "skyline", von: 120, bis: 520, y: 262, hMin: 10, hMax: 34, saat: 4 },
        { typ: "kran", x: 610, y: 262, h: 112, richtung: 1 },
        { typ: "kran", x: 900, y: 262, h: 92, richtung: -1, kabine: "schild_pink" },
        { typ: "skyline", von: 1450, bis: 2000, y: 262, hMin: 8, hMax: 26, saat: 9 },
        { typ: "wasser", von: -300, bis: 2300, y: 262, h: 70, glanz: { x: 900, parallaxe: 0.04, b: 60 } },
        { typ: "faehre", x: 640, y: 284, b: 230 }
      ]},

      // ---------- Mitte: Häuser der Innenstadt ----------
      { name: "mitte", parallaxe: 0.55, ton: "mitte", objekte: [
        { typ: "reihenhaus", x: 760, b: 90, h: 150, dach: "stufe", farbe: "backstein_dunkel", y: 292 },
        { typ: "reihenhaus", x: 850, b: 80, h: 170, dach: "flach", farbe: "putz_hell", y: 292 },
        { typ: "turm", x: 980, y: 292, b: 30, h: 190, spitze: 70 },
        { typ: "reihenhaus", x: 1000, b: 100, h: 140, dach: "giebel", farbe: "putz_rosa", y: 292 },
        { typ: "reihenhaus", x: 1100, b: 90, h: 175, dach: "stufe", y: 292 },
        { typ: "reihenhaus", x: 1190, b: 110, h: 130, dach: "flach", farbe: "putz_blau", y: 292 },
        { typ: "reihenhaus", x: 1300, b: 85, h: 160, dach: "spitz", farbe: "putz_gelb", y: 292 },
        { typ: "reihenhaus", x: 1385, b: 95, h: 145, dach: "giebel", farbe: "backstein", y: 292 },
        { typ: "reihenhaus", x: 1480, b: 120, h: 185, dach: "flach", farbe: "putz_hell", y: 292 },
        { typ: "reihenhaus", x: 1600, b: 90, h: 150, dach: "stufe", farbe: "backstein_dunkel", y: 292 }
      ]},

      // ---------- Straße: hier laufen Robin und alle Figuren ----------
      { name: "strasse", parallaxe: 1, ton: "nah", figuren: true, objekte: [
        { typ: "kaimauer", von: -100, bis: 352 },
        { typ: "poller", x: 40 }, { typ: "poller", x: 200 },
        { typ: "laterne", x: 120 },
        { typ: "litfass", x: 300, plakat: ["FUNKLOCH", "Der Podcast,", "der zuhört."] },
        { typ: "bahnhof", x: 370, b: 480, h: 140, schild: "BAHNHOF KIEL", eingang: "ZU DEN GLEISEN" },
        { typ: "baum", x: 905, h: 128, r: 36 },
        { typ: "kita", x: 950, b: 240, h: 92, schild: "KITA MÖWENNEST" },
        { typ: "zaun", von: 1010, bis: 1150, h: 24, farben: ["schild_pink", "schild_gelb", "schild_blau"], farbe: "metall" },
        { typ: "laterne", x: 1222 },
        { typ: "haltestelle", x: 1262 },
        { typ: "markt", x: 1300, b: 330, h: 108, schild: "MARKT", zusatz: "BIS SPÄT GEÖFFNET" },
        { typ: "muelleimer", x: 1650 },
        { typ: "reihenhaus", x: 1680, b: 110, h: 150, dach: "stufe" },
        { typ: "reihenhaus", x: 1790, b: 100, h: 130, dach: "giebel", farbe: "putz_gruen" },
        { typ: "reihenhaus", x: 1890, b: 130, h: 160, dach: "flach", farbe: "putz_rosa" },
        { typ: "laterne", x: 1760 },
        { typ: "boden", von: -300, bis: 2300 }
      ]},

      // ---------- Vordergrund (dunkel, bewegt sich schneller) ----------
      { name: "vorne", parallaxe: 1.35, ton: "vorne", objekte: [
        { typ: "gras", von: -200, bis: 260, y: 372, h: 26, farbe: "gras" },
        { typ: "pfosten", x: 520, y: 380, h: 70 },
        { typ: "fahrraeder", x: 760, y: 376, anzahl: 3 },
        { typ: "busch", x: 1080, y: 378, r: 26 },
        { typ: "busch", x: 1130, y: 380, r: 20 },
        { typ: "poller", x: 1420, y: 372, h: 26 },
        { typ: "poller", x: 1470, y: 372, h: 26 },
        { typ: "gras", von: 1700, bis: 2200, y: 372, h: 24 }
      ]}
    ],

    figuren: [
      { id: "jannik", x: 1090, richtung: -1, gespraech: "stilprobe_jannik" },
      { id: "birte", x: 1580, richtung: -1, gespraech: "stilprobe_birte" }
    ]
  }
};
