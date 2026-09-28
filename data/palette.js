/* =====================================================================
   Die Lücke – Farbpalette
   ---------------------------------------------------------------------
   Alle Grundfarben des Spiels. Überall sonst werden Farben nur über
   ihren Namen verwendet (z. B. farbe: "salbei").
   Die Schattierung entsteht im Spiel durch das Licht – hier stehen nur
   die hellen Grundtöne. Farben als "#rrggbb".
   ===================================================================== */
var DATA = window.DATA = window.DATA || {};

DATA.palette = {
  // ---- Zeichenmittel ----
  tusche:        "#2e2934",   // Konturen, Schraffur, Gesichter
  papier:        "#f4ecdb",   // Hintergrund / Papierton

  // ---- Boden ----
  gras:          "#a8c27c",
  gras_hell:     "#c4d392",
  weg:           "#d5ab72",
  pflaster:      "#e3dac7",
  kopfstein:     "#cbbfae",
  sand:          "#eed9a9",
  seegrund:      "#9fb49a",
  wasser:        "#8ab8cc",
  holz:          "#cf9f70",
  holz_hell:     "#e0bb8c",
  holz_dunkel:   "#a57855",

  // ---- Natur ----
  laub:          "#8db06a",
  laub_dunkel:   "#6c955c",
  laub_hell:     "#b4c982",
  birke_laub:    "#bccb77",
  kiefer:        "#5b8a6a",
  rinde:         "#a27a5c",
  birke_rinde:   "#f3efe6",
  birke_fleck:   "#6d6763",
  stein:         "#c3bdb4",
  stein_hell:    "#dcd7ce",
  erde:          "#b58b69",
  bluete_koralle:"#f7a79c",
  bluete_gelb:   "#ffd97d",
  bluete_lila:   "#c9aeea",
  bluete_weiss:  "#fff6ea",

  // ---- Gebäude & Dinge ----
  putz_creme:    "#f5e8d2",
  putz_ocker:    "#eac68f",
  dach_rot:      "#dc8a72",
  dach_grau:     "#a3abb4",
  fenster:       "#a6d6e4",
  tuer:          "#bf9270",
  metall:        "#8a929b",
  metall_dunkel: "#626a73",
  laterne_licht: "#fff3bd",
  lampe_warm:    "#ffd68f",   // Licht von Laternen und Lampen
  lampe_schirm:  "#fbe7b8",   // Lampenschirm (leuchtet)
  tageslicht:    "#fff1d6",   // Licht, das durchs Fenster fällt
  fensterglanz:  "#ffd48a",   // Fenster, hinter denen abends Licht brennt
  rueckstrahl:   "#e9c9a0",   // warmer Widerschein vom Boden in den Schatten
  pollen:        "#fff3c4",   // schwebende Pollen im Sonnenlicht
  staub:         "#fbeedd",   // Staubkörnchen in Innenräumen
  brille:        "#4d4a52",
  backstein:     "#c97d62",
  putz_salbei:   "#cfd9c0",
  glas:          "#b7d3de",
  kork:          "#c9a27a",
  schwedenrot:   "#b45a4f",
  dach_dunkel:   "#5e5966",
  // Flaggen (kräftige Farben, damit man die Länder erkennt)
  flagge_schwarz: "#26232b",
  flagge_rot:     "#d23a2e",
  flagge_gold:    "#f0c232",
  se_blau:        "#2f6cae",
  se_gelb:        "#f3c62e",
  ee_blau:        "#2f82cf",
  lu_rot:         "#df4b3f",
  lu_blau:        "#3aa9dc",
  be_gelb:        "#f5d02c",
  be_rot:         "#df3a3f",
  eu_blau:        "#2b4aa0",
  eu_gelb:        "#f6d03a",
  sandstein:     "#ddc9a0",
  schiefer:      "#6f7280",

  // ---- Haut (bewusst breite Spanne) ----
  haut_1: "#fbe3d1",
  haut_2: "#f1cda9",
  haut_3: "#dcab85",
  haut_4: "#b98262",
  haut_5: "#8f5d40",
  haut_6: "#65422e",

  // ---- Haare ----
  haar_schwarz:     "#3b302d",
  haar_dunkelbraun: "#5c3f30",
  haar_kastanie:    "#7f5137",
  haar_blond:       "#e5c27b",
  haar_rot:         "#c76d41",
  haar_grau:        "#c9c5c0",
  haar_weiss:       "#efebe5",

  // ---- Kleidung (keine Zuordnung nach Geschlecht!) ----
  salbei:     "#a9c6a1",
  senf:       "#e4ba5d",
  terrakotta: "#da8c67",
  petrol:     "#63a0a2",
  lavendel:   "#bbaddb",
  koralle:    "#f29d89",
  creme:      "#f6eddb",
  jeans_hell: "#93b2d0",
  jeans:      "#7392b5",
  anthrazit:  "#62656c",
  oliv:       "#9ea66e",
  himmelblau: "#a0cbea",
  rosa:       "#f3b8c6",
  weinrot:    "#b85d6e",
  mint:       "#abdecb",
  ocker:      "#dba75e",
  grau:       "#b6b3ae",
  grau_hell:  "#d4cfc6",
  weiss:      "#fbf8f2",
  schwarz:    "#3c3638"
};

/* Farbstimmung pro Ort (Himmel, Dunst, Licht).
   sonne   = Farbe des direkten Sonnenlichts
   schatten= Farbe der Schattenseite (kühler Himmelston)
   tusche   = Farbe der Konturen und Schraffur
   kruemmung = Stärke einer gekrümmten Welt (0 = aus, Standard)
   Lichtwerte (optional, sonst gilt DATA.lichtStandard unten):
   lampen    = wie hell Laternen und Lampen leuchten (0 = aus … 1 = Abend)
   lichthof  = Deckkraft des gemalten Scheins um Lampen (0 … 1)
   wolken    = Wolkenschatten, die über die Welt ziehen (0 = keine … 1 = viele)
   fenster   = Fenster leuchten von innen (0 = Tag, Glanzstrich … 1 = warmes Licht)
   fenster_licht = Farbe der leuchtenden Fenster
   rueckstrahl, rueckstrahl_staerke = warmer Widerschein vom Boden in den Schatten
   schlagschatten  = Stärke der geworfenen Schatten (0 = aus … 1 = voll)
   pollen, pollen_farbe = schwebende Pollen/Staubkörnchen (0 = keine … 1 = viele)
   sonnen_richtung = woher die Sonne scheint [x, y, z] (x < 0: von links/Westen,
                     z > 0: von vorn/Süden, y = Höhe)                           */
DATA.lichtStandard = {
  lampen: 0.4, lichthof: 0.3, wolken: 0.35, fenster: 0, fenster_licht: "fensterglanz",
  rueckstrahl: "rueckstrahl", rueckstrahl_staerke: 0.4,
  schlagschatten: 1, sonnen_richtung: [-0.5, 0.78, 0.45], pollen: 0.5, pollen_farbe: "pollen"
};

/* Bildstil der Nachbearbeitung (nur bei Grafik „Hoch“)
   wackeln      = Linien wirken freihand gezeichnet (0 = aus, 1 = normal, 2 = stark)
   pigmentrand  = an Farbkanten sammelt sich dunklere Farbe (0 = aus … 2)
   papierrand   = Bildrand läuft ausgefranst ins Papier aus (0 = aus … 1)
   papierfaser  = Papierstruktur im Bild (0 = aus … 2)
   saettigung   = Farbkraft (1 = unverändert)
   lichter_ton / schatten_ton = Farbstich heller bzw. dunkler Stellen [r, g, b] (1 = neutral) */
DATA.bildStil = {
  wackeln: 1, pigmentrand: 1.3, papierrand: 1, papierfaser: 1, saettigung: 1.08,
  lichter_ton: [1.03, 1.0, 0.95], schatten_ton: [0.94, 0.96, 1.04]
};

DATA.stimmungen = {
  test: {
    himmel_oben: "#a7c6d8", horizont: "#f4ecdb", dunst: "#f2e9d6",
    sonne: "#fff7e8", schatten: "#b3aed3", tusche: "tusche", kruemmung: 0
  },
  // Europaplatz: hell und freundlich
  hub: {
    himmel_oben: "#a9cbe0", horizont: "#f5eddc", dunst: "#f2e9d6",
    sonne: "#fff8ec", schatten: "#b1afd6", tusche: "tusche", kruemmung: 0
  },
  // Deutschland-Viertel: warmes Ocker/Rot, späte Nachmittagssonne
  de: {
    himmel_oben: "#b9c9d6", horizont: "#f6e6cf", dunst: "#f3e4cc",
    sonne: "#ffefd6", schatten: "#b9a9c9", tusche: "tusche", kruemmung: 0
  },
  // Schweden-Viertel: kühles, klares Nordlicht
  se: {
    himmel_oben: "#9fc4dc", horizont: "#eef0ea", dunst: "#ecefe8",
    sonne: "#fbfaf2", schatten: "#a9b3d6", tusche: "tusche", kruemmung: 0, wolken: 0.45
  },
  // Estland-Viertel: frisches Grün, Kiefern, etwas Wind
  ee: {
    himmel_oben: "#a4c9d2", horizont: "#eff0e3", dunst: "#edeee0",
    sonne: "#fdf7e6", schatten: "#a8b2cc", tusche: "tusche", kruemmung: 0, wolken: 0.5
  },
  // Luxemburg-Viertel: warmer Sandstein, goldenes Licht
  lu: {
    himmel_oben: "#b3c8d8", horizont: "#f7e8cf", dunst: "#f4e5cb",
    sonne: "#fff0d8", schatten: "#b6a8c8", tusche: "tusche", kruemmung: 0
  },
  // Brüssel: helles, leicht bewölktes Licht über Kopfsteinpflaster
  bxl: {
    himmel_oben: "#adc0d4", horizont: "#f1eadc", dunst: "#eee6d6",
    sonne: "#fdf6ea", schatten: "#aeaacd", tusche: "tusche", kruemmung: 0, wolken: 0.5
  },
  // Epilog: warmes Abendlicht
  abend: {
    himmel_oben: "#c3b3cf", horizont: "#f8dcbc", dunst: "#f4d9bd",
    sonne: "#ffe6c4", schatten: "#a99bc4", tusche: "tusche", kruemmung: 0,
    lampen: 1, lichthof: 0.55, fenster: 0.8, wolken: 0.2
  },
  // Innenräume
  innen_archiv: {
    himmel_oben: "#e8dcc4", horizont: "#e8dcc4", dunst: "#e4d7bf",
    sonne: "#fbefd9", schatten: "#b9a9c2", tusche: "tusche", kruemmung: 0,
    lampen: 1.3, lichthof: 0.35, wolken: 0, pollen: 0.35, pollen_farbe: "staub"
  },
  innen_warm: {
    himmel_oben: "#efe2cc", horizont: "#efe2cc", dunst: "#ebdfc9",
    sonne: "#fff3e0", schatten: "#c2b4c8", tusche: "tusche", kruemmung: 0,
    lampen: 1.3, lichthof: 0.35, wolken: 0, pollen: 0.35, pollen_farbe: "staub"
  },
  innen_kuehl: {
    himmel_oben: "#e3e6e0", horizont: "#e3e6e0", dunst: "#e4e4dc",
    sonne: "#f8f7f0", schatten: "#b3b5cf", tusche: "tusche", kruemmung: 0,
    lampen: 1.3, lichthof: 0.35, wolken: 0, pollen: 0.35, pollen_farbe: "staub"
  }
};
