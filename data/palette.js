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
  // ---- Boden ----
  gras:          "#a3d38c",
  gras_hell:     "#b9df98",
  weg:           "#ead3a2",
  pflaster:      "#ddd5c8",
  kopfstein:     "#cbc2b6",
  sand:          "#f2e1b3",
  seegrund:      "#b8c79c",
  wasser:        "#86cfd9",
  holz:          "#cf9f70",
  holz_hell:     "#e0bb8c",
  holz_dunkel:   "#a57855",

  // ---- Natur ----
  laub:          "#93c77c",
  laub_dunkel:   "#79b56f",
  laub_hell:     "#b5da8a",
  birke_laub:    "#bddf83",
  kiefer:        "#6aa57a",
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
  weiss:      "#fbf8f2",
  schwarz:    "#3c3638"
};

/* Farbstimmung pro Ort (Himmel, Dunst, Licht).
   sonne   = Farbe des direkten Sonnenlichts
   schatten= Farbe der Schattenseite (kühler Himmelston)
   kruemmung = Stärke der „gekrümmten Welt“ (0 = aus)            */
DATA.stimmungen = {
  test: {
    himmel_oben: "#8ecbef",
    horizont:    "#fdeed8",
    dunst:       "#eef1ee",
    sonne:       "#fff0dc",
    schatten:    "#b4b9e0",
    kruemmung:   0.012
  }
};
