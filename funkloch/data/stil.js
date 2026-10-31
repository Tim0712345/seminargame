// =====================================================================
//  data/stil.js – So sieht „Funkloch“ aus (Risograph-Zine)
// ---------------------------------------------------------------------
//  Hier kannst du ALLES am Aussehen ändern, ohne Code anzufassen:
//  Druckfarben, Papier, Rasterpunkte, Fehlpasser, Druckfehler,
//  Materialien (welche Farbe hat Backstein, Wasser, Fenster …) und
//  die Stimmung (Tageszeit) jeder Station.
//
//  So funktionieren Farben hier:
//  Es gibt nur VIER Druckfarben: blau, pink, gelb, gruen.
//  Jede Fläche sagt, wie DICHT jede Farbe gedruckt wird:
//      0   = gar nicht,   0.5 = halbe Rasterpunkte,   1 = voll.
//  Beispiel:  { pink: 0.6, gelb: 0.5 }  ergibt ein gerastertes Ziegelrot.
//  Mischtöne entstehen nur durch Übereinanderdrucken – wie beim echten Riso.
//
//  Hex-Farben (#RRGGBB) kannst du z. B. mit einem Farbwähler im Internet
//  heraussuchen. Nach dem Ändern einfach die Seite neu laden.
// =====================================================================

var DATA = window.DATA || {};
window.DATA = DATA;

DATA.stil = {

  // ---------- Papier ----------
  papier: {
    farbe: "#f4efe2",   // gebrochenes Weiß
    korn: 0.22,         // wie stark das Papierkorn sichtbar ist (0 … 1)
    fasern: 0.5         // wie viele Papierfasern (0 … 1)
  },

  // ---------- Die vier Druckfarben ----------
  //  farbe     = Farbton der Druckfarbe
  //  deckkraft = wie kräftig sie druckt (Riso-Farben sind leicht durchscheinend)
  //  winkel    = Drehung des Punktrasters in Grad (jede Farbe anders, wie im Druck)
  //  versatz   = Fehlpasser: um wie viele Bildschirm-Pixel diese Farbschicht
  //              verrutscht ist [nach rechts, nach unten]
  druckfarben: {
    gelb:  { farbe: "#ffe800", deckkraft: 0.95, winkel: 0,  versatz: [0, -1] },
    pink:  { farbe: "#ff48b0", deckkraft: 0.90, winkel: 75, versatz: [2, 1] },
    blau:  { farbe: "#0078bf", deckkraft: 0.92, winkel: 15, versatz: [-1, 1] },
    gruen: { farbe: "#3b6656", deckkraft: 0.94, winkel: 45, versatz: [1, -1] }
  },
  // Reihenfolge der Druckschichten (wie die Trommeln in der Maschine)
  reihenfolge: ["gelb", "pink", "blau", "gruen"],

  // ---------- Rasterpunkte ----------
  raster: {
    abstand: 4.5,   // Abstand der Rasterpunkte in Bildschirm-Pixeln (größer = gröber)
    stufen: 24      // wie viele Helligkeitsstufen es gibt
  },

  // ---------- Fehlpasser (verrutschte Farbschichten) ----------
  fehlpasser: {
    staerke: 1,       // 0 = alles passt genau, 1 = normal, 2 = sehr schief gedruckt
    zittern: 1,       // wie stark die Schichten zittern (in Pixeln; 0 = aus)
    zitterTakt: 140   // alle wie viele Millisekunden das Zittern wechselt
  },

  // ---------- Druckfehler ----------
  druckfehler: {
    staerke: 0.55,    // ausgedünnte Farbe / kleine Fehlstellen (0 = perfekter Druck)
    flecken: 0.5      // wie viele größere ausgedünnte Flecken
  },

  // ---------- Technik ----------
  technik: {
    maxPixel: 1800000,  // höchstens so viele Bildpunkte werden berechnet (Schul-Laptop, iPad)
    renderSkala: 1,     // 1 = volle Auflösung, 0.75 = schneller, etwas weicher
    weltHoehe: 360,     // so viele Welt-Einheiten ist das Bild hoch
    mindestBreite: 330  // mindestens so viele Welt-Einheiten sieht man in der Breite (Hochformat)
  },

  // ---------- Figuren ----------
  figuren: {
    hoehe: 96,        // so groß ist eine normal große Figur (Welt-Einheiten; Bild = 360 hoch)
    rand: 2.4         // Papierrand um Figuren, wie ausgeschnitten (0 = aus)
  },

  // ---------- Materialien ----------
  //  Namen, die in data/stationen.js und data/figuren.js benutzt werden.
  //  „leuchtet: true“ = wird nicht von der Abendtönung abgedunkelt (Lampen, Fenster).
  materialien: {
    // Gebäude
    backstein:        { gelb: 1, pink: 0.82 },
    backstein_dunkel: { pink: 1, gelb: 0.5, blau: 0.45 },
    putz_hell:        { gelb: 0.25, pink: 0.1 },
    putz_gelb:        { gelb: 0.75, pink: 0.12 },
    putz_rosa:        { pink: 0.35, gelb: 0.2 },
    putz_blau:        { blau: 0.35, gelb: 0.1 },
    putz_gruen:       { gruen: 0.35, gelb: 0.3 },
    dach:             { gruen: 1 },
    dach_kupfer:      { gruen: 0.45, blau: 0.4, gelb: 0.35 },
    dach_ziegel:      { pink: 1, blau: 0.55 },
    schatten:         { blau: 0.35, gruen: 0.25 },   // wird überdruckt (Schattenseite)
    kante:            { gruen: 0.9, blau: 0.2 },
    // Fenster und Licht
    fenster_hell:     { gelb: 1, leuchtet: true },
    fenster_warm:     { gelb: 0.9, pink: 0.38, leuchtet: true },
    fenster_dunkel:   { blau: 1, gruen: 0.35 },
    fenster_tag:      { blau: 0.45, gruen: 0.12 },
    rahmen:           { gruen: 0.8 },
    lampe:            { gelb: 1, leuchtet: true },
    lichtkegel:       { gelb: 0.32, leuchtet: true }, // wird überdruckt
    leuchtschild:     { pink: 1, leuchtet: true },
    // Stadt und Natur
    strasse:          { blau: 1, gruen: 0.4 },
    gehweg:           { gelb: 0.22, gruen: 0.14 },
    bordstein:        { gruen: 1 },
    markierung:       { gelb: 0.9, leuchtet: true },
    wasser:           { blau: 1, gruen: 0.15 },
    wasser_glanz:     { pink: 0.55, gelb: 0.6, leuchtet: true },
    huegel:           { blau: 0.5, gruen: 0.35, pink: 0.12 },
    silhouette:       { blau: 0.6, pink: 0.3 },
    metall:           { gruen: 0.8, blau: 0.3 },
    metall_hell:      { blau: 0.35, gruen: 0.25 },
    holz:             { pink: 0.4, gelb: 0.65, gruen: 0.3 },
    baumkrone:        { gruen: 1, gelb: 0.35 },
    baumkrone_hell:   { gruen: 0.5, gelb: 0.7 },
    stamm:            { gruen: 0.95, pink: 0.3 },
    gras:             { gruen: 0.75, gelb: 0.5 },
    schiff:           { gelb: 0.06 },
    schiff_rumpf:     { blau: 0.95, gruen: 0.55 },
    schiff_streifen:  { pink: 1, gelb: 0.25 },
    sonne:            { pink: 0.85, gelb: 1, leuchtet: true },
    mond:             { gelb: 0.35, leuchtet: true },
    wolke:            { pink: 0.4, gelb: 0.25 },
    wolke_hell:       { pink: 0.15, gelb: 0.15 },
    // Schilder
    schild_blau:      { blau: 1 },
    schild_gruen:     { gruen: 1 },
    schild_pink:      { pink: 1 },
    schild_gelb:      { gelb: 1 },
    plakat:           { gelb: 1, pink: 0.2 },
    // Figuren
    gesicht:          { gruen: 1 },
    bodenschatten:    { gruen: 0.45, blau: 0.25 },
    schallwelle:      { pink: 1, leuchtet: true }
  },

  // ---------- Stimmungen (Tageszeit je Station) ----------
  //  betonung    = welche Druckfarbe diese Station besonders prägt
  //  himmel      = Dichte jeder Farbe oben und unten am Himmel (Rasterverlauf)
  //  horizont    = wo der Himmelsverlauf endet (0 = oben, 1 = unten am Bildrand)
  //  kurve       = wie schnell der Verlauf kippt (1 = gleichmäßig, 2 = erst spät)
  //  ton         = zusätzliche Farbe je Ebene (Ferne wirkt bläulich, Vordergrund dunkel)
  //  fensterAn   = Anteil der erleuchteten Fenster (0 … 1)
  //  lichter     = Laternen an?   sterne = Anzahl der Sterne
  //  materialien = hier kann eine Stimmung einzelne Materialien ersetzen
  stimmungen: {

    kiel_abend: {
      name: "Kiel · Abend",
      betonung: "blau",
      himmel: {
        oben:  { blau: 0.92, pink: 0.25, gruen: 0.1 },
        unten: { pink: 0.7, gelb: 0.75, blau: 0.05 },
        horizont: 0.6, kurve: 1.25
      },
      ton: {
        fern:  { blau: 0.32, pink: 0.12 },
        mitte: { blau: 0.2, pink: 0.06 },
        nah:   {},
        vorne: { blau: 0.55, gruen: 0.55 }
      },
      fensterAn: 0.55, lichter: true, sterne: 0
    },

    kopenhagen_vormittag: {
      name: "Kopenhagen · Vormittag",
      betonung: "gelb",
      himmel: {
        oben:  { blau: 0.4, gelb: 0.05 },
        unten: { gelb: 0.5, blau: 0.08 },
        horizont: 0.75, kurve: 1.0
      },
      ton: { fern: { blau: 0.15, gelb: 0.1 }, mitte: { gelb: 0.08 }, nah: {}, vorne: { gruen: 0.5, gelb: 0.4 } },
      fensterAn: 0, lichter: false, sterne: 0,
      materialien: { sonne: { gelb: 1, pink: 0.1, leuchtet: true }, wolke: { gelb: 0.0 }, wasser_glanz: { gelb: 0.6, leuchtet: true } }
    },

    wien_mittag: {
      name: "Wien · Mittag",
      betonung: "gruen",
      himmel: {
        oben:  { blau: 0.3, gruen: 0.12 },
        unten: { gelb: 0.25, gruen: 0.06 },
        horizont: 0.7, kurve: 1.0
      },
      ton: { fern: { gruen: 0.18, blau: 0.1 }, mitte: { gruen: 0.08 }, nah: {}, vorne: { gruen: 0.7, gelb: 0.2 } },
      fensterAn: 0, lichter: false, sterne: 0,
      materialien: { sonne: { gelb: 1, leuchtet: true }, wolke: { gelb: 0.0 }, wasser_glanz: { gelb: 0.5, leuchtet: true } }
    },

    bukarest_daemmerung: {
      name: "Bukarest · Dämmerung",
      betonung: "pink",
      himmel: {
        oben:  { blau: 0.75, pink: 0.55 },
        unten: { pink: 0.95, gelb: 0.45 },
        horizont: 0.72, kurve: 1.2
      },
      ton: { fern: { pink: 0.3, blau: 0.25 }, mitte: { pink: 0.16, blau: 0.12 }, nah: { pink: 0.06 }, vorne: { pink: 0.5, blau: 0.6 } },
      fensterAn: 0.4, lichter: true, sterne: 6,
      materialien: { sonne: { pink: 1, gelb: 0.6, leuchtet: true } }
    },

    bruessel_nacht: {
      name: "Brüssel · Nacht",
      betonung: "alle",
      himmel: {
        oben:  { blau: 1, gruen: 0.7, pink: 0.1 },
        unten: { blau: 0.85, pink: 0.3, gruen: 0.3 },
        horizont: 0.75, kurve: 1.0
      },
      ton: { fern: { blau: 0.5, gruen: 0.3 }, mitte: { blau: 0.4, gruen: 0.2 }, nah: { blau: 0.28, gruen: 0.1 }, vorne: { blau: 0.8, gruen: 0.7 } },
      fensterAn: 0.75, lichter: true, sterne: 40,
      materialien: { sonne: { gelb: 0.35, leuchtet: true }, wolke: { blau: 0.4, gruen: 0.4 }, wasser_glanz: { gelb: 0.5, leuchtet: true } }
    }
  }
};
