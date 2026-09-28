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
   kruemmung = Stärke einer gekrümmten Welt (0 = aus, Standard)    */
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
    sonne: "#fbfaf2", schatten: "#a9b3d6", tusche: "tusche", kruemmung: 0
  },
  // Estland-Viertel: frisches Grün, Kiefern, etwas Wind
  ee: {
    himmel_oben: "#a4c9d2", horizont: "#eff0e3", dunst: "#edeee0",
    sonne: "#fdf7e6", schatten: "#a8b2cc", tusche: "tusche", kruemmung: 0
  },
  // Luxemburg-Viertel: warmer Sandstein, goldenes Licht
  lu: {
    himmel_oben: "#b3c8d8", horizont: "#f7e8cf", dunst: "#f4e5cb",
    sonne: "#fff0d8", schatten: "#b6a8c8", tusche: "tusche", kruemmung: 0
  },
  // Brüssel: helles, leicht bewölktes Licht über Kopfsteinpflaster
  bxl: {
    himmel_oben: "#adc0d4", horizont: "#f1eadc", dunst: "#eee6d6",
    sonne: "#fdf6ea", schatten: "#aeaacd", tusche: "tusche", kruemmung: 0
  },
  // Epilog: warmes Abendlicht
  abend: {
    himmel_oben: "#c3b3cf", horizont: "#f8dcbc", dunst: "#f4d9bd",
    sonne: "#ffe6c4", schatten: "#a99bc4", tusche: "tusche", kruemmung: 0
  },
  // Innenräume
  innen_archiv: {
    himmel_oben: "#e8dcc4", horizont: "#e8dcc4", dunst: "#e4d7bf",
    sonne: "#fbefd9", schatten: "#b9a9c2", tusche: "tusche", kruemmung: 0
  },
  innen_warm: {
    himmel_oben: "#efe2cc", horizont: "#efe2cc", dunst: "#ebdfc9",
    sonne: "#fff3e0", schatten: "#c2b4c8", tusche: "tusche", kruemmung: 0
  },
  innen_kuehl: {
    himmel_oben: "#e3e6e0", horizont: "#e3e6e0", dunst: "#e4e4dc",
    sonne: "#f8f7f0", schatten: "#b3b5cf", tusche: "tusche", kruemmung: 0
  }
};
