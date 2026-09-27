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
                    muetze | schal | ohrringe | bart | kinderwagen
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

  // ---- Europaplatz ----
  sanne: {
    name: "Sanne",
    haut: "haut_2", kopf: "oval", koerper: "mittel", alter: "erwachsen",
    haare: { stil: "zopf", farbe: "haar_rot" },
    oberteil: { typ: "hemd", farbe: "petrol" },
    unterteil: { typ: "shorts", farbe: "anthrazit" },
    schuhe: "schwarz",
    extras: [ { typ: "umhaengetasche", farbe: "terrakotta" }, { typ: "muetze", farbe: "petrol" } ],
    stimme: { tonhoehe: 1.05 }
  },

  dimitriou: {
    name: "Herr Dimitriou",
    haut: "haut_3", kopf: "breit", koerper: "kraeftig", alter: "alt",
    haare: { stil: "glatze", farbe: "haar_weiss" },
    oberteil: { typ: "pullover", farbe: "weinrot" },
    unterteil: { typ: "hose", farbe: "oliv" },
    schuhe: "holz_dunkel",
    extras: [ { typ: "bart" }, { typ: "gehstock" } ],
    stimme: { tonhoehe: 0.8 }
  },

  // ---- Deutschland-Viertel ----
  lea: {
    name: "Lea",
    haut: "haut_2", kopf: "rund", koerper: "mittel", alter: "erwachsen",
    haare: { stil: "zopf", farbe: "haar_blond" },
    oberteil: { typ: "strickjacke", farbe: "senf", innen: "creme" },
    unterteil: { typ: "hose", farbe: "jeans" },
    schuhe: "terrakotta",
    extras: [ { typ: "schal", farbe: "petrol" } ],
    stimme: { tonhoehe: 1.05 }
  },

  tobias: {
    name: "Tobias",
    haut: "haut_4", kopf: "oval", koerper: "schmal", alter: "erwachsen",
    haare: { stil: "kurz", farbe: "haar_schwarz" },
    oberteil: { typ: "hoodie", farbe: "petrol" },
    unterteil: { typ: "hose", farbe: "anthrazit" },
    schuhe: "weiss",
    extras: [ { typ: "brille" }, { typ: "bart" } ],
    stimme: { tonhoehe: 0.9 }
  },

  brandt: {
    name: "Herr Brandt",
    haut: "haut_1", kopf: "breit", koerper: "kraeftig", alter: "alt",
    haare: { stil: "glatze", farbe: "haar_grau" },
    oberteil: { typ: "strickjacke", farbe: "oliv", innen: "creme" },
    unterteil: { typ: "hose", farbe: "grau" },
    schuhe: "holz_dunkel",
    extras: [ { typ: "brille" } ],
    stimme: { tonhoehe: 0.8 }
  },

  jana: {
    name: "Jana",
    haut: "haut_5", kopf: "oval", koerper: "schmal", alter: "jung",
    haare: { stil: "locken", farbe: "haar_schwarz" },
    oberteil: { typ: "tshirt", farbe: "koralle" },
    unterteil: { typ: "shorts", farbe: "jeans" },
    schuhe: "weiss",
    extras: [ { typ: "ohrringe", farbe: "senf" }, { typ: "umhaengetasche", farbe: "oliv" } ],
    stimme: { tonhoehe: 1.15 }
  },

  yilmaz: {
    name: "Frau Yılmaz",
    haut: "haut_3", kopf: "rund", koerper: "mittel", alter: "erwachsen",
    haare: { stil: "bob", farbe: "haar_dunkelbraun" },
    oberteil: { typ: "pullover", farbe: "mint" },
    unterteil: { typ: "hose", farbe: "oliv" },
    schuhe: "koralle",
    extras: [ { typ: "ohrringe", farbe: "koralle" } ],
    stimme: { tonhoehe: 1.0 }
  },

  okafor: {
    name: "Frau Okafor",
    haut: "haut_6", kopf: "oval", koerper: "schmal", alter: "erwachsen",
    haare: { stil: "dutt", farbe: "haar_schwarz" },
    oberteil: { typ: "blazer", farbe: "weinrot", innen: "creme" },
    unterteil: { typ: "hose", farbe: "anthrazit" },
    schuhe: "schwarz",
    extras: [ { typ: "brille" } ],
    stimme: { tonhoehe: 0.95 }
  },

  ben: {
    name: "Ben",
    haut: "haut_5", kopf: "rund", koerper: "mittel", alter: "kind",
    haare: { stil: "kurz", farbe: "haar_schwarz" },
    oberteil: { typ: "tshirt", farbe: "senf" },
    unterteil: { typ: "shorts", farbe: "petrol" },
    schuhe: "koralle",
    extras: [],
    stimme: { tonhoehe: 1.35 }
  },

  // ---- Schweden-Viertel ----
  lindqvist: {
    name: "Frau Lindqvist",
    haut: "haut_1", kopf: "oval", koerper: "schmal", alter: "erwachsen",
    haare: { stil: "bob", farbe: "haar_blond" },
    oberteil: { typ: "blazer", farbe: "himmelblau", innen: "weiss" },
    unterteil: { typ: "hose", farbe: "anthrazit" },
    schuhe: "schwarz",
    extras: [ { typ: "brille" } ],
    stimme: { tonhoehe: 1.0 }
  },
  lars: {
    name: "Lars",
    haut: "haut_2", kopf: "breit", koerper: "mittel", alter: "erwachsen",
    haare: { stil: "kurz", farbe: "haar_rot" },
    oberteil: { typ: "pullover", farbe: "oliv" },
    unterteil: { typ: "hose", farbe: "jeans" },
    schuhe: "weiss",
    extras: [ { typ: "kinderwagen", farbe: "petrol" }, { typ: "bart" } ],
    stimme: { tonhoehe: 0.9 }
  },
  nora: {
    name: "Nora",
    haut: "haut_4", kopf: "rund", koerper: "mittel", alter: "erwachsen",
    haare: { stil: "locken", farbe: "haar_dunkelbraun" },
    oberteil: { typ: "hoodie", farbe: "koralle" },
    unterteil: { typ: "hose", farbe: "jeans_hell" },
    schuhe: "creme",
    extras: [],
    stimme: { tonhoehe: 1.05 }
  },
  birgit: {
    name: "Birgit",
    haut: "haut_1", kopf: "rund", koerper: "kraeftig", alter: "alt",
    haare: { stil: "dutt", farbe: "haar_weiss" },
    oberteil: { typ: "strickjacke", farbe: "rosa", innen: "creme" },
    unterteil: { typ: "rock", farbe: "anthrazit", beine: "grau" },
    schuhe: "holz_dunkel",
    extras: [ { typ: "brille" } ],
    stimme: { tonhoehe: 1.1 }
  },
  erik: {
    name: "Erik",
    haut: "haut_5", kopf: "oval", koerper: "schmal", alter: "erwachsen",
    haare: { stil: "kurz", farbe: "haar_schwarz" },
    oberteil: { typ: "tshirt", farbe: "senf" },
    unterteil: { typ: "shorts", farbe: "anthrazit" },
    schuhe: "koralle",
    extras: [ { typ: "kinderwagen", farbe: "terrakotta" } ],
    stimme: { tonhoehe: 0.95 }
  },
  alva: {
    name: "Alva",
    haut: "haut_3", kopf: "oval", koerper: "schmal", alter: "jung",
    haare: { stil: "lang", farbe: "haar_blond" },
    oberteil: { typ: "hoodie", farbe: "lavendel" },
    unterteil: { typ: "hose", farbe: "schwarz" },
    schuhe: "weiss",
    extras: [ { typ: "ohrringe", farbe: "senf" } ],
    stimme: { tonhoehe: 1.15 }
  },

  // ---- Estland-Viertel ----
  kadri: {
    name: "Kadri",
    haut: "haut_2", kopf: "oval", koerper: "mittel", alter: "erwachsen",
    haare: { stil: "zopf", farbe: "haar_dunkelbraun" },
    oberteil: { typ: "blazer", farbe: "petrol", innen: "creme" },
    unterteil: { typ: "hose", farbe: "grau" },
    schuhe: "schwarz",
    extras: [ { typ: "umhaengetasche", farbe: "senf" } ],
    stimme: { tonhoehe: 1.0 }
  },
  mart: {
    name: "Mart",
    haut: "haut_1", kopf: "breit", koerper: "schmal", alter: "jung",
    haare: { stil: "kurz", farbe: "haar_blond" },
    oberteil: { typ: "hoodie", farbe: "anthrazit" },
    unterteil: { typ: "hose", farbe: "jeans" },
    schuhe: "weiss",
    extras: [ { typ: "brille" } ],
    stimme: { tonhoehe: 0.95 }
  },
  liis: {
    name: "Liis",
    haut: "haut_5", kopf: "rund", koerper: "mittel", alter: "erwachsen",
    haare: { stil: "dutt", farbe: "haar_schwarz" },
    oberteil: { typ: "tshirt", farbe: "mint" },
    unterteil: { typ: "hose", farbe: "mint" },
    schuhe: "weiss",
    extras: [],
    stimme: { tonhoehe: 1.05 }
  },
  kertu: {
    name: "Kertu",
    haut: "haut_2", kopf: "oval", koerper: "kraeftig", alter: "erwachsen",
    haare: { stil: "zopf", farbe: "haar_rot" },
    oberteil: { typ: "hemd", farbe: "ocker" },
    unterteil: { typ: "latzhose", farbe: "jeans" },
    schuhe: "holz_dunkel",
    extras: [],
    stimme: { tonhoehe: 1.0 }
  },
  priit: {
    name: "Priit",
    haut: "haut_3", kopf: "breit", koerper: "mittel", alter: "erwachsen",
    haare: { stil: "locken", farbe: "haar_kastanie" },
    oberteil: { typ: "pullover", farbe: "terrakotta" },
    unterteil: { typ: "hose", farbe: "oliv" },
    schuhe: "anthrazit",
    extras: [ { typ: "bart" } ],
    stimme: { tonhoehe: 0.9 }
  },
  anu: {
    name: "Anu",
    haut: "haut_6", kopf: "oval", koerper: "schmal", alter: "jung",
    haare: { stil: "afro", farbe: "haar_schwarz" },
    oberteil: { typ: "tshirt", farbe: "himmelblau" },
    unterteil: { typ: "rock", farbe: "senf", beine: "haut_6" },
    schuhe: "weiss",
    extras: [ { typ: "umhaengetasche", farbe: "koralle" } ],
    stimme: { tonhoehe: 1.2 }
  },

  // ---- Luxemburg-Viertel ----
  schmit: {
    name: "Herr Schmit",
    haut: "haut_2", kopf: "breit", koerper: "kraeftig", alter: "erwachsen",
    haare: { stil: "kurz", farbe: "haar_grau" },
    oberteil: { typ: "hemd", farbe: "weiss" },
    unterteil: { typ: "hose", farbe: "anthrazit" },
    schuhe: "schwarz",
    extras: [ { typ: "brille" } ],
    stimme: { tonhoehe: 0.85 }
  },
  paul: {
    name: "Paul",
    haut: "haut_4", kopf: "rund", koerper: "mittel", alter: "jung",
    haare: { stil: "locken", farbe: "haar_schwarz" },
    oberteil: { typ: "pullover", farbe: "lavendel" },
    unterteil: { typ: "hose", farbe: "grau" },
    schuhe: "weiss",
    extras: [],
    stimme: { tonhoehe: 1.0 }
  },
  chloe: {
    name: "Chloé",
    haut: "haut_3", kopf: "oval", koerper: "schmal", alter: "erwachsen",
    haare: { stil: "lang", farbe: "haar_schwarz" },
    oberteil: { typ: "blazer", farbe: "senf", innen: "creme" },
    unterteil: { typ: "hose", farbe: "anthrazit" },
    schuhe: "schwarz",
    extras: [ { typ: "ohrringe", farbe: "weiss" } ],
    stimme: { tonhoehe: 1.05 }
  },
  tom: {
    name: "Tom",
    haut: "haut_1", kopf: "oval", koerper: "mittel", alter: "erwachsen",
    haare: { stil: "kurz", farbe: "haar_blond" },
    oberteil: { typ: "hemd", farbe: "himmelblau" },
    unterteil: { typ: "hose", farbe: "jeans" },
    schuhe: "anthrazit",
    extras: [],
    stimme: { tonhoehe: 0.95 }
  },
  hoffmann: {
    name: "Dr. Hoffmann",
    haut: "haut_5", kopf: "oval", koerper: "mittel", alter: "alt",
    haare: { stil: "kurz", farbe: "haar_grau" },
    oberteil: { typ: "strickjacke", farbe: "weinrot", innen: "creme" },
    unterteil: { typ: "hose", farbe: "grau" },
    schuhe: "holz_dunkel",
    extras: [ { typ: "brille" }, { typ: "schal", farbe: "senf" } ],
    stimme: { tonhoehe: 0.95 }
  },
  marc: {
    name: "Marc",
    haut: "haut_6", kopf: "breit", koerper: "kraeftig", alter: "erwachsen",
    haare: { stil: "glatze", farbe: "haar_schwarz" },
    oberteil: { typ: "tshirt", farbe: "weiss" },
    unterteil: { typ: "hose", farbe: "anthrazit" },
    schuhe: "schwarz",
    extras: [ { typ: "bart" } ],
    stimme: { tonhoehe: 0.85 }
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
