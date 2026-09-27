/* =====================================================================
   Die Lücke – Aussehen aller Figuren
   ---------------------------------------------------------------------
   Jede Figur wird aus Bausteinen zusammengesetzt:

   haut      : haut_1 … haut_6
   kopf      : "rund" | "oval" | "breit"
   koerper   : "schmal" | "mittel" | "kraeftig"
   alter     : "kind" | "jung" | "erwachsen" | "alt"   (Kinder sind kleiner)
   haare     : { stil, farbe }
               stil: kurz | mittellang | bob | lang | zopf | dutt | locken |
                     afro | glatze | kopftuch
   oberteil  : { typ, farbe, innen? }
               typ: hoodie | pullover | tshirt | hemd | blazer | strickjacke | kleid
   unterteil : { typ, farbe, beine? }
               typ: hose | rock | shorts | latzhose   (bei "kleid" ignoriert)
   schuhe    : Farbname
   extras    : Liste von { typ, farbe? }
               typ: umhaengetasche | brille | gehstock | rollstuhl |
                    muetze | schal | ohrringe | bart
   stimme    : { tonhoehe } – für die Sprechlaute (ab Phase 5)

   Alle Farben sind Namen aus palette.js.
   ===================================================================== */
var DATA = window.DATA = window.DATA || {};

DATA.characters = {

  // ---- Spielfigur ----
  kim: {
    name: "Kim",
    haut: "haut_3", kopf: "rund", koerper: "mittel", alter: "jung",
    haare: { stil: "mittellang", farbe: "haar_kastanie" },
    oberteil: { typ: "hoodie", farbe: "salbei" },
    unterteil: { typ: "latzhose", farbe: "creme" },
    schuhe: "terrakotta",
    extras: [ { typ: "umhaengetasche", farbe: "senf" } ],
    stimme: { tonhoehe: 1.0 }
  },

  // ---- Hauptfiguren der Geschichte ----
  laurent: {
    name: "Dr. Marie Laurent",
    haut: "haut_5", kopf: "oval", koerper: "schmal", alter: "erwachsen",
    haare: { stil: "dutt", farbe: "haar_grau" },
    oberteil: { typ: "blazer", farbe: "petrol", innen: "creme" },
    unterteil: { typ: "hose", farbe: "anthrazit" },
    schuhe: "schwarz",
    extras: [ { typ: "brille" } ],
    stimme: { tonhoehe: 0.9 }
  },

  anna: {
    name: "Anna",
    haut: "haut_2", kopf: "rund", koerper: "mittel", alter: "erwachsen",
    haare: { stil: "bob", farbe: "haar_dunkelbraun" },
    oberteil: { typ: "pullover", farbe: "petrol" },
    unterteil: { typ: "hose", farbe: "jeans" },
    schuhe: "creme",
    extras: [],
    stimme: { tonhoehe: 1.05 }
  },

  jonas: {
    name: "Jonas",
    haut: "haut_2", kopf: "breit", koerper: "mittel", alter: "erwachsen",
    haare: { stil: "kurz", farbe: "haar_dunkelbraun" },
    oberteil: { typ: "hemd", farbe: "terrakotta" },
    unterteil: { typ: "hose", farbe: "jeans" },
    schuhe: "anthrazit",
    extras: [],
    stimme: { tonhoehe: 0.95 }
  },

  // ---- Probefiguren (Test-Insel, zeigen den Baukasten) ----
  emil: {
    name: "Emil",
    haut: "haut_4", kopf: "rund", koerper: "kraeftig", alter: "jung",
    haare: { stil: "locken", farbe: "haar_schwarz" },
    oberteil: { typ: "tshirt", farbe: "mint" },
    unterteil: { typ: "shorts", farbe: "oliv" },
    schuhe: "weiss",
    extras: [ { typ: "rollstuhl" } ],
    stimme: { tonhoehe: 1.0 }
  },

  helga: {
    name: "Helga",
    haut: "haut_1", kopf: "oval", koerper: "mittel", alter: "alt",
    haare: { stil: "dutt", farbe: "haar_weiss" },
    oberteil: { typ: "strickjacke", farbe: "lavendel", innen: "creme" },
    unterteil: { typ: "rock", farbe: "salbei", beine: "grau" },
    schuhe: "holz_dunkel",
    extras: [ { typ: "gehstock" }, { typ: "brille" } ],
    stimme: { tonhoehe: 1.1 }
  },

  leyla: {
    name: "Leyla",
    haut: "haut_3", kopf: "oval", koerper: "schmal", alter: "jung",
    haare: { stil: "kopftuch", farbe: "weinrot" },
    oberteil: { typ: "kleid", farbe: "ocker" },
    unterteil: { typ: "hose", farbe: "anthrazit" },
    schuhe: "creme",
    extras: [],
    stimme: { tonhoehe: 1.1 }
  },

  ole: {
    name: "Ole",
    haut: "haut_6", kopf: "breit", koerper: "kraeftig", alter: "erwachsen",
    haare: { stil: "afro", farbe: "haar_schwarz" },
    oberteil: { typ: "pullover", farbe: "rosa" },
    unterteil: { typ: "hose", farbe: "oliv" },
    schuhe: "anthrazit",
    extras: [ { typ: "bart" } ],
    stimme: { tonhoehe: 0.85 }
  },

  mia: {
    name: "Mia",
    haut: "haut_2", kopf: "rund", koerper: "schmal", alter: "kind",
    haare: { stil: "zopf", farbe: "haar_rot" },
    oberteil: { typ: "hoodie", farbe: "himmelblau" },
    unterteil: { typ: "latzhose", farbe: "jeans_hell" },
    schuhe: "koralle",
    extras: [ { typ: "muetze", farbe: "senf" } ],
    stimme: { tonhoehe: 1.3 }
  }
};

/* Gesichtsausdrücke: welche Augen- und Mundform zu welcher Emotion gehört.
   Augen: offen | zu | froehlich | ueberrascht | skeptisch | nachdenklich
   Münder: laecheln | neutral | grinsen | o | schief | sprechen | hmm | offen
   "sprechen" = zwei Mundformen, zwischen denen beim Reden gewechselt wird. */
DATA.gesichter = {
  neutral:      { augen: "offen",        mund: "laecheln", sprechen: ["sprechen", "laecheln"] },
  froehlich:    { augen: "froehlich",    mund: "grinsen",  sprechen: ["offen", "grinsen"] },
  nachdenklich: { augen: "nachdenklich", mund: "hmm",      sprechen: ["sprechen", "hmm"] },
  ueberrascht:  { augen: "ueberrascht",  mund: "o",        sprechen: ["o", "offen"] },
  skeptisch:    { augen: "skeptisch",    mund: "schief",   sprechen: ["sprechen", "schief"] }
};
