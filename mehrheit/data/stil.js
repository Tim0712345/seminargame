/* =====================================================================
   data/stil.js – Aussehen von „Mehrheit“
   ---------------------------------------------------------------------
   Hier stehen alle Materialien, Lichtstimmungen und Grafikstufen.
   Du kannst Farben (#rrggbb) und Zahlen frei ändern.
   Rauheit:   0 = spiegelglatt, 1 = ganz matt
   Metall:    0 = kein Metall, 1 = Metall
   Durchscheinen: wie stark Licht von hinten durchkommt (Ohren, Papier)
   Klarlack:  zusätzliche glänzende Lackschicht (0 bis 1)
   Struktur:  im Code erzeugte Oberfläche: glatt, korn, holz, gebuerstet,
              stoff, teppich, papier, stein, milchglas
   Fraktionsfarben stehen in data/fraktionen.js.
   ===================================================================== */
var DATA = window.DATA || {};

DATA.stil = {

  /* ---------------- Materialien (Abschnitt 7.2) ---------------- */
  materialien: {
    // Wände, Säulen, Treppen: sehr helles Warmweiß, ganz leicht durchscheinend
    modellharz:    { farbe: "#efece6", rauheit: 0.55, metall: 0, durchscheinen: 0.12, struktur: "korn", strukturSkala: 2.0, strukturStaerke: 0.35 },
    modellharz_kuehl: { farbe: "#e6e8ea", rauheit: 0.6, metall: 0, durchscheinen: 0.1, struktur: "korn", strukturSkala: 2.0, strukturStaerke: 0.35 },
    // Tische, Pulte, Wandverkleidung: helle Eiche mit dünnem Klarlack
    eiche:         { farbe: "#cbad8c", rauheit: 0.5, metall: 0, klarlack: 0.45, struktur: "holz", strukturSkala: 1.3, strukturStaerke: 1.0 },
    eiche_matt:    { farbe: "#c5a786", rauheit: 0.62, metall: 0, klarlack: 0.0, struktur: "holz", strukturSkala: 1.6, strukturStaerke: 1.0 },
    // Stuhlbeine, Mikrofone, Geländer, Lampen
    aluminium:     { farbe: "#d4d7db", rauheit: 0.3, metall: 1, struktur: "gebuerstet", strukturSkala: 5.0, strukturStaerke: 0.8 },
    stahl:         { farbe: "#7d8288", rauheit: 0.42, metall: 1, struktur: "gebuerstet", strukturSkala: 2.0, strukturStaerke: 0.5 },
    chrom:         { farbe: "#e8eaec", rauheit: 0.12, metall: 1, struktur: "glatt", strukturStaerke: 0.1 },
    // Trennwände, Lampenschirme: durchscheinend, Licht dahinter weich gestreut
    milchglas:     { farbe: "#f3f2ee", rauheit: 0.55, glas: true, alpha: 0.72, durchscheinen: 0.9, struktur: "milchglas", strukturSkala: 3.0, strukturStaerke: 0.4 },
    // Fenster, Dolmetschkabinen, Gläser, Glasmodell
    klarglas:      { farbe: "#f2f7f6", rauheit: 0.04, glas: true, alpha: 0.10, brechung: 0.035, struktur: "glatt", strukturStaerke: 0.15 },
    fensterglas:   { farbe: "#eef4f6", rauheit: 0.03, glas: true, alpha: 0.06, brechung: 0.004, struktur: "glatt", strukturStaerke: 0.05 },
    // Plenarsaal, Büros: tiefes Graublau, schluckt Licht
    teppich:       { farbe: "#36425c", rauheit: 0.95, metall: 0, struktur: "teppich", strukturSkala: 3.0, strukturStaerke: 1.0 },
    // Flure, Eingangshalle: hier entstehen die Spiegelungen
    steinboden:    { farbe: "#8f8b86", rauheit: 0.12, metall: 0, struktur: "stein", strukturSkala: 0.35, strukturStaerke: 0.8, spiegelt: true },
    // Gesetzentwurf, Akten, Haftnotizen
    papier:        { farbe: "#f6f3ea", rauheit: 0.8, metall: 0, durchscheinen: 0.55, struktur: "papier", strukturSkala: 6.0, strukturStaerke: 0.6, doppelseitig: true },
    haftnotiz:     { farbe: "#f2e3a0", rauheit: 0.8, metall: 0, durchscheinen: 0.5, struktur: "papier", strukturSkala: 6.0, strukturStaerke: 0.6, doppelseitig: true },
    // Kleidung, Flaggen, Vorhänge (Farbe kommt von der Figur)
    stoff:         { farbe: "#5a6070", rauheit: 0.85, metall: 0, struktur: "stoff", strukturSkala: 14.0, strukturStaerke: 0.7, samt: 0.35 },
    stoff_sitz:    { farbe: "#3c4660", rauheit: 0.9, metall: 0, struktur: "stoff", strukturSkala: 10.0, strukturStaerke: 0.8, samt: 0.4 },
    // Mappen, Namensschilder, Sitzlampen-Gehäuse (Farbe aus Fraktion)
    lack:          { farbe: "#00a2ad", rauheit: 0.25, metall: 0, klarlack: 0.8, struktur: "korn", strukturSkala: 4.0, strukturStaerke: 0.15 },
    // Becher, Gläser-Inhalt
    kaffee:        { farbe: "#1c120c", rauheit: 0.08, metall: 0, struktur: "glatt", strukturStaerke: 0.0 },
    wasser:        { farbe: "#dfeeee", rauheit: 0.02, glas: true, alpha: 0.08, brechung: 0.06, struktur: "glatt", strukturStaerke: 0.0 },
    keramik:       { farbe: "#ece9e2", rauheit: 0.22, metall: 0, klarlack: 0.6, struktur: "korn", strukturSkala: 6.0, strukturStaerke: 0.1 },
    gummi:         { farbe: "#2a2826", rauheit: 0.75, metall: 0, struktur: "korn", strukturSkala: 8.0, strukturStaerke: 0.4 },
    bildschirm:    { farbe: "#0d0f12", rauheit: 0.1, metall: 0, klarlack: 1.0, struktur: "glatt", strukturStaerke: 0.0 },
    blatt_pflanze: { farbe: "#3f6a3a", rauheit: 0.5, metall: 0, durchscheinen: 0.7, klarlack: 0.2, struktur: "korn", strukturSkala: 10.0, strukturStaerke: 0.25, doppelseitig: true },
    erde:          { farbe: "#2b2119", rauheit: 0.95, metall: 0, struktur: "teppich", strukturSkala: 8.0, strukturStaerke: 0.8 },
    kork:          { farbe: "#b38a5e", rauheit: 0.9, metall: 0, struktur: "teppich", strukturSkala: 10.0, strukturStaerke: 0.9 },
    // Haut der Gliederfiguren: Modellharz, eingefärbt (Farbe kommt aus figuren.js)
    haut:          { farbe: "#d9a77f", rauheit: 0.5, metall: 0, durchscheinen: 0.45, struktur: "korn", strukturSkala: 12.0, strukturStaerke: 0.2 },
    haar:          { farbe: "#3b2a20", rauheit: 0.55, metall: 0, struktur: "gebuerstet", strukturSkala: 30.0, strukturStaerke: 0.7, samt: 0.3 },
    auge:          { farbe: "#15110f", rauheit: 0.6, metall: 0, struktur: "glatt", strukturStaerke: 0.0 },
    leder:         { farbe: "#2a201b", rauheit: 0.45, metall: 0, klarlack: 0.3, struktur: "korn", strukturSkala: 10.0, strukturStaerke: 0.5 },
    // Stempel: Holzgriff, Gummiplatte, Stempelfarbe
    stempelfarbe:  { farbe: "#a3322c" },
    // Himmel hinter den Fenstern (leuchtet selbst)
    himmel:        { farbe: "#000000", emission: 1.0, struktur: "glatt", strukturStaerke: 0.0 }
  },

  /* Farbe der Tinte im Gesetzentwurf und der Stempel */
  tinte: {
    text: "#1d1c1a",           // normaler Text
    neu: "#00727a",            // eigene Änderungen (Fraktion Brücke, etwas dunkler für Lesbarkeit)
    gestrichen: "#b0403a",     // Durchstreichung
    stempel: "#a3322c"         // Stempelabdruck
  },

  /* ---------------- Lichtstimmungen (Abschnitt 7.3) ----------------
     sonne.richtung: Richtung ZUR Sonne (x = Osten, y = oben, z = Süden)
     kelvin: Farbtemperatur (2000 = warm-orange, 6500 = neutral, 9000 = kühl-blau)
     staerke: Helligkeit der Hauptlichtquelle
     winkel: scheinbare Größe der Lichtquelle in Grad (größer = weichere Schatten)
     umgebung: Stärke des Umgebungslichts (aus der Raum-Würfeltextur)
     nebel.dichte: wie stark die Luft Licht streut (Lichtstrahlen im Staub)
     nebel.reichweite: bis zu welcher Entfernung (Meter) Lichtstrahlen berechnet werden
     nebel.dunst: wie stark ferne Dinge im Dunst verschwinden (0 = gar nicht, 1 = normal)
     sonne.kegel: [x, z, innen, außen] – Licht nur in diesem Kreis (Pendelleuchte)
     farbe: Farbkorrektur (Temperatur -1..1, Sättigung, Kontrast, Tönung der Schatten/Lichter)
  */
  stimmungen: {
    titel: {
      name: "Morgendämmerung im leeren Plenarsaal",
      sonne: { richtung: [0.40, 0.82, -0.41], kelvin: 3300, staerke: 5.0, winkel: 0.7 },
      himmel: { oben: "#41598a", horizont: "#e6a47c", unten: "#1a1c24", sonnenglanz: 4.0, staerke: 3.0 },
      umgebung: 1.4,
      nebel: { dichte: 0.02, farbe: "#55648a", streuung: 0.35, strahlen: 14, reichweite: 40, dunst: 0.15 },
      belichtung: 0.85,
      farbe: { temperatur: 0.02, saettigung: 0.92, kontrast: 1.12, schatten: "#1e2c4a", lichter: "#ffd2a0", toenung: 0.45, schwarz: 0.012 },
      bloom: 0.065, vignette: 0.42, korn: 0.035
    },
    buero_morgen: {
      name: "Kapitel 1 – kühles Morgenlicht, Schreibtischlampe noch an",
      sonne: { richtung: [-0.30, 0.42, -0.86], kelvin: 6800, staerke: 2.4, winkel: 2.5 },
      himmel: { oben: "#9fb6d4", horizont: "#e3e6ea", unten: "#6c7078", sonnenglanz: 1.2, staerke: 2.2 },
      umgebung: 1.7,
      nebel: { dichte: 0.012, farbe: "#c3cede", streuung: 0.4, strahlen: 3.0, reichweite: 9, dunst: 0.5 },
      belichtung: 1.25,
      farbe: { temperatur: -0.06, saettigung: 0.9, kontrast: 1.05, schatten: "#2a3550", lichter: "#fff1dc", toenung: 0.3, schwarz: 0.01 },
      bloom: 0.05, vignette: 0.32, korn: 0.03
    },
    buero_vormittag: {
      name: "Kapitel 3 – später Vormittag, harte Fensterkreuz-Schatten",
      sonne: { richtung: [-0.46, 0.60, -0.65], kelvin: 5200, staerke: 5.5, winkel: 0.5 },
      himmel: { oben: "#7fa3d6", horizont: "#e7e9e6", unten: "#6c6a66", sonnenglanz: 2.0, staerke: 2.0 },
      umgebung: 1.5,
      nebel: { dichte: 0.016, farbe: "#d9d3c4", streuung: 0.45, strahlen: 5.0, reichweite: 9, dunst: 0.5 },
      belichtung: 1.15,
      farbe: { temperatur: 0.05, saettigung: 0.95, kontrast: 1.1, schatten: "#273046", lichter: "#ffe8c4", toenung: 0.35, schwarz: 0.01 },
      bloom: 0.05, vignette: 0.32, korn: 0.03
    }
    ,
    anhoerung: {
      name: "Kapitel 2 – helles Saallicht von oben, warme Spots auf die Gäste",
      sonne: { richtung: [0.18, 1.0, 0.32], kelvin: 5200, staerke: 3.0, winkel: 9 },
      himmel: { oben: "#d9dde3", horizont: "#e8e4dc", unten: "#7a7670", sonnenglanz: 0.2, staerke: 1.2 },
      umgebung: 1.5,
      nebel: { dichte: 0.008, farbe: "#d8d4cc", streuung: 0.3, strahlen: 0.0, reichweite: 12, dunst: 0.4 },
      belichtung: 1.1,
      farbe: { temperatur: 0.03, saettigung: 0.95, kontrast: 1.06, schatten: "#2e3446", lichter: "#fff0dc", toenung: 0.25, schwarz: 0.01 },
      bloom: 0.045, vignette: 0.3, korn: 0.025
    },
    ausschuss: {
      name: "Kapitel 5 – Kunstlicht, leicht kühl; Sitzlampen leuchten in Fraktionsfarben",
      sonne: { richtung: [0.1, 1.0, 0.25], kelvin: 6500, staerke: 2.2, winkel: 9 },
      himmel: { oben: "#c8d0dc", horizont: "#d0d4d8", unten: "#5a5e66", sonnenglanz: 0.2, staerke: 0.9 },
      umgebung: 1.1,
      nebel: { dichte: 0.01, farbe: "#b8c2d0", streuung: 0.3, strahlen: 0.0, reichweite: 12, dunst: 0.4 },
      belichtung: 0.95,
      farbe: { temperatur: -0.08, saettigung: 0.9, kontrast: 1.12, schatten: "#1e2638", lichter: "#e8f0ff", toenung: 0.3, schwarz: 0.012 },
      bloom: 0.07, vignette: 0.38, korn: 0.03
    },
    flure: {
      name: "Kapitel 4 – Nachmittagssonne in langen Bahnen durch die Rückseite",
      sonne: { richtung: [-0.38, 0.42, -0.82], kelvin: 4100, staerke: 6.5, winkel: 0.6 },
      himmel: { oben: "#8fb0d8", horizont: "#f0dcc0", unten: "#2a2622", sonnenglanz: 1.5, staerke: 1.6 },
      umgebung: 1.0,
      nebel: { dichte: 0.004, farbe: "#c8b8a0", streuung: 0.45, strahlen: 2.0, reichweite: 40, dunst: 0.04 },
      belichtung: 1.0,
      farbe: { temperatur: 0.06, saettigung: 0.95, kontrast: 1.1, schatten: "#24283a", lichter: "#ffe2bc", toenung: 0.35, schwarz: 0.012 },
      bloom: 0.05, vignette: 0.42, korn: 0.03
    },
    trilog: {
      name: "Kapitel 6 – Nacht, nur eine warme Pendelleuchte über dem Tisch",
      sonne: { richtung: [0.06, 1.0, 0.04], kelvin: 2700, staerke: 7.0, winkel: 7, kegel: [0, 0, 1.7, 3.4] },
      himmel: { oben: "#0b0f1c", horizont: "#1a2234", unten: "#050608", sonnenglanz: 0.0, staerke: 1.0 },
      umgebung: 0.75,
      nebel: { dichte: 0.012, farbe: "#3a3020", streuung: 0.4, strahlen: 0.8, reichweite: 8, dunst: 0.15 },
      belichtung: 1.3,
      farbe: { temperatur: 0.08, saettigung: 0.92, kontrast: 1.15, schatten: "#141a2c", lichter: "#ffd8a8", toenung: 0.45, schwarz: 0.014 },
      bloom: 0.08, vignette: 0.55, korn: 0.04
    },
    plenum: {
      name: "Kapitel 7 – festliches helles Licht durch das Glasdach",
      sonne: { richtung: [0.28, 0.9, -0.33], kelvin: 5600, staerke: 5.5, winkel: 0.8 },
      himmel: { oben: "#9cbce6", horizont: "#eef0f2", unten: "#4a4a4c", sonnenglanz: 2.0, staerke: 4.0 },
      umgebung: 1.5,
      nebel: { dichte: 0.012, farbe: "#c8d0dc", streuung: 0.35, strahlen: 7, reichweite: 40, dunst: 0.15 },
      belichtung: 0.95,
      farbe: { temperatur: 0.0, saettigung: 0.97, kontrast: 1.08, schatten: "#263048", lichter: "#fff4e4", toenung: 0.25, schwarz: 0.01 },
      bloom: 0.06, vignette: 0.35, korn: 0.03
    },
    epilog: {
      name: "Epilog – weicher, leicht überbelichteter Erinnerungs-Look",
      sonne: { richtung: [-0.5, 0.75, 0.3], kelvin: 3700, staerke: 5.0, winkel: 2.5 },
      himmel: { oben: "#f0e6d8", horizont: "#fff4e4", unten: "#8a7a6a", sonnenglanz: 1.0, staerke: 1.5 },
      umgebung: 1.2,
      nebel: { dichte: 0.008, farbe: "#f0dcc0", streuung: 0.5, strahlen: 1.5, reichweite: 6, dunst: 0.15 },
      belichtung: 0.8,
      farbe: { temperatur: 0.14, saettigung: 0.88, kontrast: 1.04, schatten: "#5a4a40", lichter: "#fff0d8", toenung: 0.45, schwarz: 0.03 },
      bloom: 0.12, vignette: 0.5, korn: 0.04
    }
  },

  /* ---------------- Grafikstufen (Abschnitt 7.5) ----------------
     renderskala: Anteil der Bildschirm-Auflösung (1 = volle Auflösung)
     pixelMax: höchstens so viele Bildpunkte pro CSS-Pixel (scharfe Bildschirme)
     schatten: Größe der Schattenkarte, schattenWeich: 2 = sehr weich, 1 = weich, 0 = gefiltert, -1 = hart
     verdeckung (Umgebungsverdeckung): 2 hoch, 1 normal, 0.5 halbe Auflösung, 0 nur vorberechnet
     spiegel: 2 voll, 1 nur Boden halbe Auflösung, 0 nur Würfeltextur
     strahlen: Schritte für Lichtstrahlen (0 = aus)
     tiefe (Tiefenschärfe): 2 Bokeh rund, 1 normal, 0.5 einfach, 0 aus
     kanten: "zeitlich" oder "fxaa"
     teilchen: Anteil der Teilchen (1 = viele)
  */
  grafikstufen: {
    ultra:   { name: "Ultra",   renderskala: 1.0,  pixelMax: 1.5,  schatten: 4096, schattenWeich: 2,  verdeckung: 2,   spiegel: 2, strahlen: 40, bloomStufen: 6, tiefe: 2,   kanten: "zeitlich", korn: true,  farbsaum: true,  teilchen: 1.0, brechung: true,  umgebungGroesse: 256, texturGroesse: 1024, seitenAufloesung: 1600 },
    hoch:    { name: "Hoch",    renderskala: 1.0,  pixelMax: 1.25, schatten: 2048, schattenWeich: 1,  verdeckung: 1,   spiegel: 2, strahlen: 24, bloomStufen: 6, tiefe: 1,   kanten: "zeitlich", korn: true,  farbsaum: true,  teilchen: 0.6, brechung: true,  umgebungGroesse: 128, texturGroesse: 512,  seitenAufloesung: 1400 },
    mittel:  { name: "Mittel",  renderskala: 0.85, pixelMax: 1.0,  schatten: 1024, schattenWeich: 0,  verdeckung: 0.5, spiegel: 1, strahlen: 10, bloomStufen: 5, tiefe: 0.5, kanten: "fxaa",     korn: true,  farbsaum: true,  teilchen: 0.3, brechung: false, umgebungGroesse: 128, texturGroesse: 512,  seitenAufloesung: 1200 },
    niedrig: { name: "Niedrig", renderskala: 0.7,  pixelMax: 1.0,  schatten: 1024, schattenWeich: -1, verdeckung: 0,   spiegel: 0, strahlen: 0,  bloomStufen: 3, tiefe: 0,   kanten: "fxaa",     korn: false, farbsaum: false, teilchen: 0.0, brechung: false, umgebungGroesse: 64,  texturGroesse: 256,  seitenAufloesung: 1024 }
  },

  /* Automatische Wahl: gemessene Bildzeit (Millisekunden) auf Stufe „Hoch“ */
  automatik: { ultraUnter: 9, hochUnter: 17, mittelUnter: 28, absenkenUnterFps: 28, absenkenNachSekunden: 4 },

  /* ---------------- Oberfläche (Abschnitt 7.10) ---------------- */
  oberflaeche: {
    akzent: "#00a2ad",                      // Petrol – Fokusrahmen, Hervorhebungen
    schriftUI: 'system-ui, "Segoe UI", -apple-system, "Helvetica Neue", Arial, sans-serif',
    schriftGesetz: 'Georgia, "Times New Roman", serif',
    schriftZahlen: 'ui-monospace, Consolas, monospace',
    glas: "rgba(250, 250, 248, 0.62)",      // mattiertes Glas
    glasRand: "rgba(255, 255, 255, 0.75)",
    text: "#1b1d22",
    rundung: 8
  }
};
